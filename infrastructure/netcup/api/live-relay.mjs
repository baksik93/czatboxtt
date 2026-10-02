import { createHash } from "node:crypto";
import { TikTokLiveConnection, ControlEvent, WebcastEvent } from "tiktok-live-connector";
import { WebSocket, WebSocketServer } from "ws";

const CONNECT_TIMEOUT_MS = 45_000;
const USERNAME_PATTERN = /^[a-zA-Z0-9._]{2,64}$/;

function cookieTokens(request) {
  const cookies = String(request.headers.cookie || "");
  return [...new Set(cookies.split(";").map((item) => item.trim()).filter((item) => item.startsWith("cttm_session=")).map((item) => {
    try { return decodeURIComponent(item.slice(13)); } catch { return ""; }
  }).filter(Boolean))];
}

function tokenHash(token) {
  return createHash("sha256").update(token).digest("base64");
}

function closeSocket(socket, code, reason) {
  if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
    socket.close(code, reason);
  }
}

function closeConnection(run) {
  clearTimeout(run.timeout);
  for (const pending of run.giftStreaks.values()) clearTimeout(pending.timer);
  run.giftStreaks.clear();
  if (run.connection) {
    try { run.connection.disconnect(); } catch {}
  }
}

function serialize(packet) {
  return JSON.stringify(packet, (_key, value) => typeof value === "bigint" ? value.toString() : value);
}

export function createLiveRelay({ server, database, publicAppOrigin = "" }) {
  const websocketServer = new WebSocketServer({
    noServer: true,
    clientTracking: false,
    perMessageDeflate: false,
    maxPayload: 1024
  });
  const activeByUser = new Map();
  const allowedOrigin = String(publicAppOrigin).replace(/\/$/, "");

  server.on("upgrade", async (request, socket, head) => {
    try {
      const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
      if (url.pathname !== "/api/live") {
        socket.destroy();
        return;
      }
      if (allowedOrigin && String(request.headers.origin || "") !== allowedOrigin) {
        socket.write("HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n");
        socket.destroy();
        return;
      }
      const username = String(url.searchParams.get("uniqueId") || "").replace(/^@/, "").trim();
      const tokens = cookieTokens(request);
      if (!USERNAME_PATTERN.test(username) || !tokens.length) {
        socket.write("HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n");
        socket.destroy();
        return;
      }
      let userId = "";
      for (const token of tokens) {
        const result = await database.query(
          "SELECT u.id FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.expires_at>$2",
          [tokenHash(token), Date.now()]
        );
        userId = result.rows[0]?.id || "";
        if (userId) break;
      }
      if (!userId) {
        socket.write("HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n");
        socket.destroy();
        return;
      }
      websocketServer.handleUpgrade(request, socket, head, (client) => {
        websocketServer.emit("connection", client, { userId, username });
      });
    } catch (error) {
      console.error(JSON.stringify({ event: "live_upgrade_error", message: error?.message || String(error) }));
      socket.destroy();
    }
  });

  websocketServer.on("connection", (client, { userId, username }) => {
    const existing = activeByUser.get(userId);
    if (existing) {
      closeSocket(existing.client, 4000, "Nowe połączenie LIVE");
      closeConnection(existing);
    }

    const run = {
      client,
      connection: null,
      giftStreaks: new Map(),
      completedGiftStreaks: new Map(),
      timeout: null
    };
    activeByUser.set(userId, run);
    const active = () => activeByUser.get(userId) === run && client.readyState === WebSocket.OPEN;
    const finish = (code, reason) => {
      if (activeByUser.get(userId) === run) activeByUser.delete(userId);
      closeConnection(run);
      closeSocket(client, code, reason);
    };
    client.once("close", () => {
      if (activeByUser.get(userId) === run) activeByUser.delete(userId);
      closeConnection(run);
    });
    client.once("error", () => finish(1011, "Błąd połączenia"));
    run.timeout = setTimeout(() => finish(4408, "Timeout"), CONNECT_TIMEOUT_MS);

    void (async () => {
      try {
        const connection = new TikTokLiveConnection(username, {
          processInitialData: false,
          fetchRoomInfoOnConnect: true,
          enableExtendedGiftInfo: false,
          webClientOptions: { timeout: 15_000 }
        });
        run.connection = connection;
        connection.on(ControlEvent.ERROR, () => {});
        connection.on(ControlEvent.DISCONNECTED, () => finish(4500, "Połączenie przerwane"));
        connection.on(WebcastEvent.STREAM_END, () => finish(4005, "Transmisja zakończona"));

        const forwardedTypes = new Set([
          WebcastEvent.CHAT, WebcastEvent.MEMBER, WebcastEvent.GIFT,
          WebcastEvent.ROOM_USER, WebcastEvent.LIKE, WebcastEvent.FOLLOW,
          WebcastEvent.SHARE, WebcastEvent.ENVELOPE, WebcastEvent.SUPER_FAN,
          WebcastEvent.SUPER_FAN_JOIN, WebcastEvent.SUPER_FAN_BOX,
          WebcastEvent.LINK_MIC_BATTLE, WebcastEvent.LINK_MIC_ARMIES,
          WebcastEvent.LINK_MIC_BATTLE_TASK, WebcastEvent.LINK_MIC_BATTLE_PUNISH_FINISH,
          WebcastEvent.BOOST_CARD
        ].filter(Boolean));
        const sendEvent = (type, data) => {
          if (!active()) return;
          const flattenedUser = {
            uniqueId: data.uniqueId,
            nickname: data.nickname,
            profilePictureUrl: data.profilePictureUrl,
            isModerator: data.isModerator,
            isSuperFan: data.isSuperFan,
            badges: data.badges,
            badgeList: data.badgeList,
            userBadges: data.userBadges,
            newUserBadges: data.newUserBadges,
            userBadgeList: data.userBadgeList,
            badgeImageList: data.badgeImageList,
            mediaBadgeImageList: data.mediaBadgeImageList,
            badgeInfo: data.badgeInfo,
            avatarBorder: data.avatarBorder,
            borders: data.borders
          };
          const user = { ...(data.user || flattenedUser) };
          const isSuperFanEvent = type === WebcastEvent.SUPER_FAN || type === WebcastEvent.SUPER_FAN_JOIN;
          const payload = { ...data, user };
          if (isSuperFanEvent) {
            payload.isSuperFan = true;
            payload.user.isSuperFan = true;
          }
          try { client.send(serialize({ event: type, data: payload })); } catch {}
        };

        for (const type of forwardedTypes) {
          connection.on(type, (data) => {
            if (!active()) return;
            if (type !== WebcastEvent.GIFT || Number(data.gift?.type ?? data.extendedGiftInfo?.type) !== 1) {
              sendEvent(type, data);
              return;
            }
            const sender = data.user?.displayId || data.user?.uniqueId || data.user?.id || "";
            const key = `${data.groupId || data.common?.msgId || ""}:${data.giftId || data.gift?.id || ""}:${sender}`;
            if (Date.now() - (run.completedGiftStreaks.get(key) || 0) < 10_000) return;
            const previous = run.giftStreaks.get(key);
            if (previous) clearTimeout(previous.timer);
            const finalize = (finalData) => {
              if (!active() || run.completedGiftStreaks.has(key)) return;
              const pending = run.giftStreaks.get(key);
              run.giftStreaks.delete(key);
              run.completedGiftStreaks.set(key, Date.now());
              setTimeout(() => run.completedGiftStreaks.delete(key), 11_000).unref?.();
              sendEvent(type, { ...(finalData || pending?.data || data), repeatEnd: 1 });
            };
            if (Number(data.repeatEnd) === 1) finalize(data);
            else run.giftStreaks.set(key, { data, timer: setTimeout(finalize, 1_500) });
          });
        }

        await connection.connect();
        if (activeByUser.get(userId) !== run) {
          try { connection.disconnect(); } catch {}
          return;
        }
        clearTimeout(run.timeout);
        console.log(JSON.stringify({ event: "live_connected", userId, username }));
      } catch (error) {
        const text = `${error?.name || ""} ${error?.message || ""}`;
        const code = /UserOfflineError|is(?:n't| not) online/i.test(text) ? 4404 : /SignatureRateLimitError|rate[_ -]?limit|too many connections/i.test(text) ? 4429 : 1011;
        console.error(JSON.stringify({ event: "live_connect_error", userId, username, code, message: error?.message || String(error) }));
        finish(code, code === 4404 ? "Twórca offline" : "Nie udało się połączyć");
      }
    })();
  });

  return {
    close() {
      for (const run of activeByUser.values()) {
        closeConnection(run);
        closeSocket(run.client, 1001, "Serwer jest restartowany");
      }
      activeByUser.clear();
      websocketServer.close();
    }
  };
}
