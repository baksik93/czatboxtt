'use strict';

// One native LIVE connection, owned by one renderer request. Never replay the
// initial backlog after reconnecting; the renderer retains its current feed.
class LocalLive {
  constructor(load = () => import('tiktok-live-connector')) {
    this.load = load;
    this.current = null;
  }

  stop(id) {
    const run = this.current;
    if (!run || (id && run.id !== id)) return;
    this.current = null;
    clearTimeout(run.timer);
    for (const pending of run.giftStreaks?.values() || []) clearTimeout(pending.timer);
    run.giftStreaks?.clear();
    if (run.connection) {
      // Keep the error listener: an in-flight request may finish after stop().
      try { run.connection.disconnect(); } catch {}
    }
  }

  async start(id, username, send) {
    this.stop();
    const run = { id, connection: null, timer: null, giftStreaks: new Map(), completedGiftStreaks: new Map() };
    this.current = run;
    const active = () => this.current === run;
    const emit = packet => { if (active()) send({ id, ...packet }); };
    const finish = code => {
      if (!active()) return;
      emit({ kind: 'close', code });
      this.stop(id);
    };
    run.timer = setTimeout(() => finish(4408), 45000);
    let sdk;
    try {
      sdk = await this.load();
      if (!active()) return;
      const connection = new sdk.TikTokLiveConnection(username, {
        processInitialData: false,
        fetchRoomInfoOnConnect: true,
        enableExtendedGiftInfo: true,
        webClientOptions: { timeout: 15000 }
      });
      run.connection = connection;
      // Errors may be transient (e.g. a nonessential enrichment request). The
      // connect rejection / disconnected event decides whether to reconnect.
      connection.on(sdk.ControlEvent.ERROR, () => {});
      connection.on(sdk.ControlEvent.DISCONNECTED, () => finish(4500));
      connection.on(sdk.WebcastEvent.STREAM_END, () => finish(4005));
      const forwardedTypes = new Set([
        sdk.WebcastEvent.CHAT, sdk.WebcastEvent.MEMBER, sdk.WebcastEvent.GIFT,
        sdk.WebcastEvent.ROOM_USER, sdk.WebcastEvent.LIKE, sdk.WebcastEvent.FOLLOW,
        sdk.WebcastEvent.SHARE, sdk.WebcastEvent.ENVELOPE, sdk.WebcastEvent.SUPER_FAN,
        sdk.WebcastEvent.SUPER_FAN_JOIN, sdk.WebcastEvent.SUPER_FAN_BOX,
        sdk.WebcastEvent.LINK_MIC_BATTLE, sdk.WebcastEvent.LINK_MIC_ARMIES,
        sdk.WebcastEvent.LINK_MIC_BATTLE_TASK, sdk.WebcastEvent.LINK_MIC_BATTLE_PUNISH_FINISH,
        sdk.WebcastEvent.BOOST_CARD
      ].filter(Boolean));
      const sendEvent = (type, data) => {
        if (!active()) return;
        try {
          const payload = { ...data, user: data.user || {
            uniqueId: data.uniqueId, nickname: data.nickname,
            profilePictureUrl: data.profilePictureUrl
          } };
          emit({ kind: 'message', data: JSON.stringify({ event: type, data: payload },
            (_key, value) => typeof value === 'bigint' ? value.toString() : value) });
        } catch { /* A malformed optional event must not tear down LIVE. */ }
      };
      for (const type of forwardedTypes) {
        if (type === sdk.WebcastEvent.STREAM_END) continue;
        connection.on(type, data => {
          if (!active()) return;
          if (type !== sdk.WebcastEvent.GIFT || Number(data.gift?.type ?? data.extendedGiftInfo?.type) !== 1) {
            sendEvent(type, data);
            return;
          }
          const userId = data.user?.displayId || data.user?.uniqueId || data.user?.id || '';
          const key = `${data.groupId || data.common?.msgId || ''}:${data.giftId || data.gift?.id || ''}:${userId}`;
          const completedAt = run.completedGiftStreaks.get(key) || 0;
          if (Date.now() - completedAt < 10000) return;
          const previous = run.giftStreaks.get(key);
          if (previous) clearTimeout(previous.timer);
          const finalize = finalData => {
            if (!active() || run.completedGiftStreaks.has(key)) return;
            const pending = run.giftStreaks.get(key);
            run.giftStreaks.delete(key);
            run.completedGiftStreaks.set(key, Date.now());
            setTimeout(() => run.completedGiftStreaks.delete(key), 11000).unref?.();
            sendEvent(type, { ...(finalData || pending?.data || data), repeatEnd: 1 });
          };
          if (Number(data.repeatEnd) === 1) finalize(data);
          else run.giftStreaks.set(key, { data, timer: setTimeout(finalize, 1500) });
        });
      }
      await connection.connect();
      if (!active()) { connection.disconnect(); return; }
      clearTimeout(run.timer);
      emit({ kind: 'open' });
    } catch (error) {
      if (!active()) return;
      const is = name => typeof sdk?.[name] === 'function' && error instanceof sdk[name];
      finish(is('UserOfflineError') ? 4404 : is('SignatureRateLimitError') ? 4429 : 1011);
    }
  }
}

module.exports = { LocalLive };
