var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// worker/static-site.js
var JSON_HEADERS = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
var DAY = 864e5;
var SESSION_TTL = 30 * DAY;
var VERIFY_TTL = 24 * 60 * 60 * 1e3;
var RESET_TTL = 60 * 60 * 1e3;
function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), { status, headers: { ...JSON_HEADERS, ...headers } });
}
__name(json, "json");
function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}
__name(normalizeEmail, "normalizeEmail");
function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}
__name(validEmail, "validEmail");
function validPassword(value) {
  return typeof value === "string" && value.length >= 10 && value.length <= 128;
}
__name(validPassword, "validPassword");
async function auditRegistration(env, { email = "", outcome, code = "", userId = null }) {
  try {
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS registration_events (id TEXT PRIMARY KEY, email TEXT NOT NULL DEFAULT '', outcome TEXT NOT NULL, code TEXT NOT NULL DEFAULT '', user_id TEXT, created_at INTEGER NOT NULL)").run();
    await env.DB.prepare("INSERT INTO registration_events(id,email,outcome,code,user_id,created_at) VALUES(?,?,?,?,?,?)").bind(crypto.randomUUID(), String(email || "").trim().toLowerCase().slice(0, 254), String(outcome || "unknown").slice(0, 40), String(code || "").slice(0, 80), userId, Date.now()).run();
  } catch (error) {
    console.error(JSON.stringify({ event: "registration_audit_failed", message: error?.message || "unknown" }));
  }
}
__name(auditRegistration, "auditRegistration");
async function ensureAdminTables(env) {
  await env.DB.batch([
    env.DB.prepare("CREATE TABLE IF NOT EXISTS account_activity (user_id TEXT PRIMARY KEY, last_seen INTEGER NOT NULL, last_source TEXT NOT NULL DEFAULT '', FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS registration_events (id TEXT PRIMARY KEY, email TEXT NOT NULL DEFAULT '', outcome TEXT NOT NULL, code TEXT NOT NULL DEFAULT '', user_id TEXT, created_at INTEGER NOT NULL)")
  ]);
}
__name(ensureAdminTables, "ensureAdminTables");
async function touchActivity(env, userId, source) {
  try {
    await ensureAdminTables(env);
    const now = Date.now();
    await env.DB.prepare("INSERT INTO account_activity(user_id,last_seen,last_source) VALUES(?,?,?) ON CONFLICT(user_id) DO UPDATE SET last_seen=excluded.last_seen,last_source=excluded.last_source WHERE account_activity.last_seen<?").bind(userId, now, source, now - 3e5).run();
  } catch (error) {
    console.error(JSON.stringify({ event: "activity_touch_failed", message: error?.message || "unknown" }));
  }
}
__name(touchActivity, "touchActivity");
async function adminAuthorized(request, env) {
  const expected = String(env.ADMIN_DASHBOARD_TOKEN || "");
  const header = request.headers.get("authorization") || "";
  const supplied = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!expected || !supplied) return false;
  const [a, b] = await Promise.all([sha256(expected), sha256(supplied)]);
  return a === b;
}
__name(adminAuthorized, "adminAuthorized");
async function adminStats(env) {
  await ensureAdminTables(env);
  const now = Date.now(), day = now - DAY, week = now - 7 * DAY, month = now - 30 * DAY;
  const [summary, accounts, attempts] = await Promise.all([
    env.DB.prepare("SELECT COUNT(*) total, SUM(CASE WHEN email_verified=1 THEN 1 ELSE 0 END) verified, SUM(CASE WHEN email_verified=0 THEN 1 ELSE 0 END) unverified, SUM(CASE WHEN a.last_seen>=? THEN 1 ELSE 0 END) active_24h, SUM(CASE WHEN a.last_seen>=? THEN 1 ELSE 0 END) active_7d, SUM(CASE WHEN a.last_seen>=? THEN 1 ELSE 0 END) active_30d FROM users u LEFT JOIN account_activity a ON a.user_id=u.id").bind(day, week, month).first(),
    env.DB.prepare("SELECT u.id,u.name,u.email,u.email_verified,u.created_at,a.last_seen,a.last_source FROM users u LEFT JOIN account_activity a ON a.user_id=u.id ORDER BY COALESCE(a.last_seen,u.created_at) DESC LIMIT 250").all(),
    env.DB.prepare("SELECT email,outcome,code,created_at FROM registration_events ORDER BY created_at DESC LIMIT 250").all()
  ]);
  return { generatedAt: now, summary: { total: Number(summary?.total || 0), verified: Number(summary?.verified || 0), unverified: Number(summary?.unverified || 0), active24h: Number(summary?.active_24h || 0), active7d: Number(summary?.active_7d || 0), active30d: Number(summary?.active_30d || 0) }, accounts: accounts.results || [], attempts: attempts.results || [] };
}
__name(adminStats, "adminStats");
function bytesToBase64(bytes) {
  let value = "";
  for (const byte of bytes) value += String.fromCharCode(byte);
  return btoa(value);
}
__name(bytesToBase64, "bytesToBase64");
function base64ToBytes(value) {
  const raw = atob(value), bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}
__name(base64ToBytes, "base64ToBytes");
function randomToken(size = 32) {
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);
  return bytesToBase64(bytes).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}
__name(randomToken, "randomToken");
async function sha256(value) {
  return bytesToBase64(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value))));
}
__name(sha256, "sha256");
async function hashPassword(password, salt = bytesToBase64(crypto.getRandomValues(new Uint8Array(16)))) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: base64ToBytes(salt), iterations: 1e5 }, key, 256);
  return { salt, hash: bytesToBase64(new Uint8Array(bits)) };
}
__name(hashPassword, "hashPassword");
async function verifyPassword(password, salt, expected) {
  const actual = await hashPassword(password, salt);
  return crypto.subtle.timingSafeEqual(base64ToBytes(actual.hash), base64ToBytes(expected));
}
__name(verifyPassword, "verifyPassword");
function cookieToken(request) {
  const cookies = request.headers.get("cookie") || "";
  const hit = cookies.split(";").map((x) => x.trim()).find((x) => x.startsWith("cttm_session="));
  return hit ? decodeURIComponent(hit.slice(13)) : "";
}
__name(cookieToken, "cookieToken");
function sessionCookie(token, maxAge = 2592e3) {
  return `cttm_session=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}
__name(sessionCookie, "sessionCookie");
async function body(request) {
  try {
    const length = Number(request.headers.get("content-length") || 0);
    if (length > 12e5) throw new Error("too_large");
    return await request.json();
  } catch {
    return null;
  }
}
__name(body, "body");
function publicUser(row) {
  return { id: row.id, name: row.name, email: row.email, emailVerified: !!row.email_verified };
}
__name(publicUser, "publicUser");
async function currentUser(request, env) {
  const token = cookieToken(request);
  if (!token) return null;
  const hash = await sha256(token);
  return env.DB.prepare("SELECT u.id,u.name,u.email,u.email_verified,s.id session_id FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>?").bind(hash, Date.now()).first();
}
__name(currentUser, "currentUser");
async function createSession(userId, env) {
  const token = randomToken();
  await env.DB.prepare("INSERT INTO sessions(id,user_id,token_hash,created_at,expires_at) VALUES(?,?,?,?,?)").bind(crypto.randomUUID(), userId, await sha256(token), Date.now(), Date.now() + SESSION_TTL).run();
  return token;
}
__name(createSession, "createSession");
async function createActionToken(userId, purpose, ttl, env) {
  const token = randomToken(24);
  await env.DB.prepare("DELETE FROM action_tokens WHERE user_id=? AND purpose=?").bind(userId, purpose).run();
  await env.DB.prepare("INSERT INTO action_tokens(id,user_id,purpose,token_hash,expires_at,created_at) VALUES(?,?,?,?,?,?)").bind(crypto.randomUUID(), userId, purpose, await sha256(token), Date.now() + ttl, Date.now()).run();
  return token;
}
__name(createActionToken, "createActionToken");
async function sendEmail(env, to, subject, html) {
  if (!env.BREVO_API_KEY || !env.EMAIL_FROM) throw new Error("email_not_configured");
  const response = await fetch("https://api.brevo.com/v3/smtp/email", { method: "POST", headers: { accept: "application/json", "content-type": "application/json", "api-key": env.BREVO_API_KEY }, body: JSON.stringify({ sender: { name: "Czatbox TT(M)", email: env.EMAIL_FROM }, to: [{ email: to }], replyTo: { email: env.EMAIL_FROM, name: "Czatbox TT(M)" }, subject, htmlContent: html, headers: { "Idempotency-Key": crypto.randomUUID() }, tags: ["account-action"] }) });
  if (response.status !== 201) {
    const error = await response.json().catch(() => ({}));
    console.error(JSON.stringify({ event: "brevo_email_failed", status: response.status, code: error.code || "unknown" }));
    throw new Error(`brevo_${response.status}`);
  }
  return response.json();
}
__name(sendEmail, "sendEmail");
async function sendActionEmail(request, env, user, purpose, token) {
  const base = new URL(request.url).origin;
  const verify = purpose === "verify";
  const url = `${base}/?${verify ? "verify" : "reset"}=${encodeURIComponent(token)}`;
  await sendEmail(env, user.email, verify ? "Potwierd\u017A konto Czatbox TT(M)" : "Ustaw nowe has\u0142o Czatbox TT(M)", `<p>Witaj ${escapeHtml(user.name)},</p><p>${verify ? "Potwierd\u017A adres e-mail" : "Ustaw nowe has\u0142o"}, otwieraj\u0105c poni\u017Cszy link:</p><p><a href="${url}">${url}</a></p><p>${verify ? "Link dzia\u0142a przez 24 godziny." : "Link dzia\u0142a przez godzin\u0119."}</p>`);
}
__name(sendActionEmail, "sendActionEmail");
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}
__name(escapeHtml, "escapeHtml");
function validProfileName(value) {
  return typeof value === "string" && value.trim().length >= 2 && value.trim().length <= 60;
}
__name(validProfileName, "validProfileName");
function sameOrigin(request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}
__name(sameOrigin, "sameOrigin");
function safeJson(value, fallback) {
  try {
    return JSON.parse(value) || fallback;
  } catch {
    return fallback;
  }
}
__name(safeJson, "safeJson");
function normalizeSync(payload) {
  const data = payload?.data || {}, meta = payload?.meta || {};
  const settings = { ...data.settings || {} };
  delete settings.eulerKey;
  return { data: { settings, filters: Array.isArray(data.filters) ? data.filters : [], creators: Array.isArray(data.creators) ? data.creators.slice(0, 50) : [], archive: Array.isArray(data.archive) ? data.archive.slice(-1e3) : [] }, meta: { settings: Number(meta.settings) || 0, filters: Number(meta.filters) || 0, creators: Number(meta.creators) || 0, archive: Number(meta.archive) || 0 } };
}
__name(normalizeSync, "normalizeSync");
function mergeArchive(a, b) {
  const map = /* @__PURE__ */ new Map();
  for (const item of [...a, ...b]) {
    if (!item || typeof item !== "object") continue;
    const key = String(item.id || `${item.timestamp}:${item.creator}:${item.kind}:${item.name}`);
    map.set(key, item);
  }
  return [...map.values()].sort((x, y) => (Number(x.timestamp) || 0) - (Number(y.timestamp) || 0)).slice(-1e3);
}
__name(mergeArchive, "mergeArchive");
function allowedAvatarUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    const host = url.hostname.toLowerCase();
    return ["tiktokcdn.com", "tiktokcdn-us.com", "byteoversea.com", "ibytedtos.com"].some((domain) => host === domain || host.endsWith(`.${domain}`)) ? url : null;
  } catch {
    return null;
  }
}
__name(allowedAvatarUrl, "allowedAvatarUrl");
async function proxyAvatar(source) {
  let url = allowedAvatarUrl(source);
  if (!url) return json({ error: "Niedozwolone \u017Ar\xF3d\u0142o awatara." }, 400);
  for (let redirect = 0; redirect < 4; redirect++) {
    const response = await fetch(url, { redirect: "manual", headers: { accept: "image/avif,image/webp,image/jpeg,image/png" } });
    if (response.status >= 300 && response.status < 400) {
      url = allowedAvatarUrl(response.headers.get("location"));
      if (!url) return json({ error: "Niedozwolone przekierowanie awatara." }, 400);
      continue;
    }
    if (!response.ok) return json({ error: "Nie uda\u0142o si\u0119 pobra\u0107 awatara." }, 502);
    const type = (response.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
    if (!["image/avif", "image/webp", "image/jpeg", "image/png"].includes(type)) return json({ error: "Nieprawid\u0142owy format awatara." }, 415);
    const declared = Number(response.headers.get("content-length") || 0);
    if (declared > 75e4) return json({ error: "Awatar jest za du\u017Cy." }, 413);
    const bytes = await response.arrayBuffer();
    if (bytes.byteLength > 75e4) return json({ error: "Awatar jest za du\u017Cy." }, 413);
    return new Response(bytes, { headers: { "content-type": type, "cache-control": "private, max-age=86400", "x-content-type-options": "nosniff" } });
  }
  return json({ error: "Zbyt wiele przekierowa\u0144 awatara." }, 502);
}
__name(proxyAvatar, "proxyAvatar");
async function api(request, env) {
  const url = new URL(request.url), path = url.pathname, method = request.method;
  if (method !== "GET" && !sameOrigin(request)) return json({ error: "Niedozwolone \u017Ar\xF3d\u0142o \u017C\u0105dania." }, 403);
  if (path === "/api/auth/register" && method === "POST") {
    const input = await body(request), name = String(input?.name || "").trim(), email = normalizeEmail(input?.email), password = input?.password;
    if (name.length < 2 || name.length > 60 || !validEmail(email) || !validPassword(password)) {
      await auditRegistration(env, { email, outcome: "rejected", code: "invalid_input" });
      return json({ error: "Podaj nazw\u0119, prawid\u0142owy e-mail i has\u0142o maj\u0105ce co najmniej 10 znak\xF3w." }, 400);
    }
    if (await env.DB.prepare("SELECT id FROM users WHERE email=?").bind(email).first()) {
      await auditRegistration(env, { email, outcome: "rejected", code: "duplicate_email" });
      return json({ error: "Konto z tym adresem ju\u017C istnieje." }, 409);
    }
    const id = crypto.randomUUID(), passwordData = await hashPassword(password), now = Date.now();
    await env.DB.batch([env.DB.prepare("INSERT INTO users(id,name,email,password_hash,password_salt,email_verified,created_at,updated_at) VALUES(?,?,?,?,?,0,?,?)").bind(id, name, email, passwordData.hash, passwordData.salt, now, now), env.DB.prepare("INSERT INTO sync_data(user_id,settings_json,filters_json,creators_json,archive_json,settings_updated_at,filters_updated_at,creators_updated_at,archive_updated_at,revision) VALUES(?,?,?,?,?,?,?,?,?,0)").bind(id, "{}", "[]", "[]", "[]", 0, 0, 0, 0)]);
    const token = await createActionToken(id, "verify", VERIFY_TTL, env);
    try {
      await sendActionEmail(request, env, { id, name, email }, "verify", token);
    } catch (error) {
      await auditRegistration(env, { email, outcome: "account_created", code: `email_failed:${error.message}`, userId: id });
      console.error(JSON.stringify({ event: "verification_email_failed", message: error.message }));
      return json({ error: "Konto utworzono, ale wys\u0142anie wiadomo\u015Bci nie powiod\u0142o si\u0119. U\u017Cyj opcji wys\u0142ania ponownie." }, 503);
    }
    await auditRegistration(env, { email, outcome: "account_created", code: "verification_email_sent", userId: id });
    return json({ ok: true, message: "Konto utworzone. Sprawd\u017A poczt\u0119 i potwierd\u017A adres e-mail." }, 201);
  }
  if (path === "/api/auth/verify" && method === "POST") {
    const input = await body(request), token = String(input?.token || "");
    if (!token) return json({ error: "Brak kodu potwierdzaj\u0105cego." }, 400);
    const hash = await sha256(token);
    const row = await env.DB.prepare("SELECT t.id,t.user_id FROM action_tokens t WHERE t.token_hash=? AND t.purpose='verify' AND t.expires_at>?").bind(hash, Date.now()).first();
    if (!row) return json({ error: "Link potwierdzaj\u0105cy wygas\u0142 albo zosta\u0142 wykorzystany." }, 400);
    await env.DB.batch([env.DB.prepare("UPDATE users SET email_verified=1,updated_at=? WHERE id=?").bind(Date.now(), row.user_id), env.DB.prepare("DELETE FROM action_tokens WHERE id=?").bind(row.id)]);
    return json({ ok: true, message: "Adres e-mail zosta\u0142 potwierdzony. Mo\u017Cesz si\u0119 zalogowa\u0107." });
  }
  if (path === "/api/auth/resend" && method === "POST") {
    const input = await body(request), email = normalizeEmail(input?.email), user2 = await env.DB.prepare("SELECT id,name,email,email_verified FROM users WHERE email=?").bind(email).first();
    if (user2 && !user2.email_verified) {
      const token = await createActionToken(user2.id, "verify", VERIFY_TTL, env);
      await sendActionEmail(request, env, user2, "verify", token);
    }
    return json({ ok: true, message: "Je\u015Bli konto oczekuje na potwierdzenie, wys\u0142ali\u015Bmy now\u0105 wiadomo\u015B\u0107." });
  }
  if (path === "/api/auth/login" && method === "POST") {
    const input = await body(request), email = normalizeEmail(input?.email), password = input?.password, cutoff = Date.now() - DAY;
    await env.DB.prepare("DELETE FROM login_attempts WHERE attempted_at<?").bind(cutoff).run();
    const failures = await env.DB.prepare("SELECT COUNT(*) count FROM login_attempts WHERE email=? AND success=0 AND attempted_at>=?").bind(email, cutoff).first();
    if (Number(failures?.count) >= 3) return json({ error: "Logowanie zablokowane na 24 godziny po trzech b\u0142\u0119dnych pr\xF3bach." }, 429);
    const user2 = await env.DB.prepare("SELECT * FROM users WHERE email=?").bind(email).first();
    const correct = user2 && validPassword(password) && await verifyPassword(password, user2.password_salt, user2.password_hash);
    if (!correct) {
      await env.DB.prepare("INSERT INTO login_attempts(id,email,success,attempted_at) VALUES(?,?,0,?)").bind(crypto.randomUUID(), email, Date.now()).run();
      return json({ error: Number(failures?.count) + 1 >= 3 ? "Logowanie zablokowane na 24 godziny po trzech b\u0142\u0119dnych pr\xF3bach." : "Nieprawid\u0142owy e-mail lub has\u0142o." }, Number(failures?.count) + 1 >= 3 ? 429 : 401);
    }
    await env.DB.prepare("DELETE FROM login_attempts WHERE email=?").bind(email).run();
    if (!user2.email_verified) return json({ error: "Najpierw potwierd\u017A adres e-mail." }, 403);
    const token = await createSession(user2.id, env);
    await touchActivity(env, user2.id, "login");
    return json({ ok: true, user: publicUser(user2) }, 200, { "set-cookie": sessionCookie(token) });
  }
  if (path === "/api/auth/logout" && method === "POST") {
    const token = cookieToken(request);
    if (token) await env.DB.prepare("DELETE FROM sessions WHERE token_hash=?").bind(await sha256(token)).run();
    return json({ ok: true }, 200, { "set-cookie": sessionCookie("", 0) });
  }
  if (path === "/api/auth/session" && method === "GET") {
    const user2 = await currentUser(request, env);
    if (user2) await touchActivity(env, user2.id, "session");
    return user2 ? json({ authenticated: true, user: publicUser(user2) }) : json({ authenticated: false }, 401);
  }
  if (path === "/api/auth/password/request" && method === "POST") {
    const input = await body(request), email = normalizeEmail(input?.email), user2 = await env.DB.prepare("SELECT id,name,email FROM users WHERE email=?").bind(email).first();
    if (user2) {
      const token = await createActionToken(user2.id, "reset", RESET_TTL, env);
      await sendActionEmail(request, env, user2, "reset", token);
    }
    return json({ ok: true, message: "Je\u015Bli konto istnieje, wys\u0142ali\u015Bmy wiadomo\u015B\u0107 do zmiany has\u0142a." });
  }
  if (path === "/api/auth/password/reset" && method === "POST") {
    const input = await body(request), token = String(input?.token || ""), password = input?.password;
    if (!validPassword(password)) return json({ error: "Has\u0142o musi mie\u0107 od 10 do 128 znak\xF3w." }, 400);
    const row = await env.DB.prepare("SELECT id,user_id FROM action_tokens WHERE token_hash=? AND purpose='reset' AND expires_at>?").bind(await sha256(token), Date.now()).first();
    if (!row) return json({ error: "Link wygas\u0142 albo zosta\u0142 wykorzystany." }, 400);
    const passwordData = await hashPassword(password);
    await env.DB.batch([env.DB.prepare("UPDATE users SET password_hash=?,password_salt=?,updated_at=? WHERE id=?").bind(passwordData.hash, passwordData.salt, Date.now(), row.user_id), env.DB.prepare("DELETE FROM action_tokens WHERE user_id=?").bind(row.user_id), env.DB.prepare("DELETE FROM sessions WHERE user_id=?").bind(row.user_id)]);
    return json({ ok: true, message: "Has\u0142o zosta\u0142o zmienione. Zaloguj si\u0119 ponownie." }, 200, { "set-cookie": sessionCookie("", 0) });
  }
  if (path === "/api/admin/stats" && method === "GET") {
    if (!await adminAuthorized(request, env)) return json({ error: "Brak dost\u0119pu." }, 401);
    return json(await adminStats(env));
  }
  const user = await currentUser(request, env);
  if (!user) return json({ error: "Sesja wygas\u0142a. Zaloguj si\u0119 ponownie." }, 401);
  await touchActivity(env, user.id, path === "/api/sync" ? "sync" : "api");
  if (path === "/api/avatar" && method === "GET") return proxyAvatar(url.searchParams.get("url") || "");
  if (path === "/api/sync" && method === "GET") {
    const row = await env.DB.prepare("SELECT * FROM sync_data WHERE user_id=?").bind(user.id).first();
    return json({ data: { settings: safeJson(row?.settings_json, {}), filters: safeJson(row?.filters_json, []), creators: safeJson(row?.creators_json, []), archive: safeJson(row?.archive_json, []) }, meta: { settings: row?.settings_updated_at || 0, filters: row?.filters_updated_at || 0, creators: row?.creators_updated_at || 0, archive: row?.archive_updated_at || 0 }, revision: row?.revision || 0 });
  }
  if (path === "/api/sync" && method === "PUT") {
    const incoming = normalizeSync(await body(request)), row = await env.DB.prepare("SELECT * FROM sync_data WHERE user_id=?").bind(user.id).first(), server = { data: { settings: safeJson(row.settings_json, {}), filters: safeJson(row.filters_json, []), creators: safeJson(row.creators_json, []), archive: safeJson(row.archive_json, []) }, meta: { settings: row.settings_updated_at || 0, filters: row.filters_updated_at || 0, creators: row.creators_updated_at || 0, archive: row.archive_updated_at || 0 } };
    for (const section of ["settings", "filters", "creators"]) {
      if (incoming.meta[section] >= server.meta[section]) {
        server.data[section] = incoming.data[section];
        server.meta[section] = incoming.meta[section];
      }
    }
    server.data.archive = mergeArchive(server.data.archive, incoming.data.archive);
    server.meta.archive = Math.max(server.meta.archive, incoming.meta.archive);
    const revision = Number(row.revision || 0) + 1;
    await env.DB.prepare("UPDATE sync_data SET settings_json=?,filters_json=?,creators_json=?,archive_json=?,settings_updated_at=?,filters_updated_at=?,creators_updated_at=?,archive_updated_at=?,revision=? WHERE user_id=?").bind(JSON.stringify(server.data.settings), JSON.stringify(server.data.filters), JSON.stringify(server.data.creators), JSON.stringify(server.data.archive), server.meta.settings, server.meta.filters, server.meta.creators, server.meta.archive, revision, user.id).run();
    return json({ ...server, revision });
  }
  if (path === "/api/account/profile" && method === "PATCH") {
    const input = await body(request), name = String(input?.name || "").trim();
    if (!validProfileName(name)) return json({ error: "Nazwa konta musi mie\u0107 od 2 do 60 znak\xF3w." }, 400);
    await env.DB.prepare("UPDATE users SET name=?,updated_at=? WHERE id=?").bind(name, Date.now(), user.id).run();
    const updated = await env.DB.prepare("SELECT id,name,email,email_verified FROM users WHERE id=?").bind(user.id).first();
    return json({ ok: true, message: "Dane konta zosta\u0142y zapisane.", user: publicUser(updated) });
  }
  if (path === "/api/account/password" && method === "POST") {
    const input = await body(request), currentPassword = input?.currentPassword, newPassword = input?.newPassword;
    if (!validPassword(newPassword)) return json({ error: "Nowe has\u0142o musi mie\u0107 od 10 do 128 znak\xF3w." }, 400);
    const full = await env.DB.prepare("SELECT * FROM users WHERE id=?").bind(user.id).first();
    if (!currentPassword || !await verifyPassword(currentPassword, full.password_salt, full.password_hash)) return json({ error: "Obecne has\u0142o jest nieprawid\u0142owe." }, 401);
    const passwordData = await hashPassword(newPassword);
    await env.DB.prepare("UPDATE users SET password_hash=?,password_salt=?,updated_at=? WHERE id=?").bind(passwordData.hash, passwordData.salt, Date.now(), user.id).run();
    return json({ ok: true, message: "Has\u0142o zosta\u0142o zmienione." });
  }
  if (path === "/api/account" && method === "DELETE") {
    const input = await body(request);
    if (!input?.password) return json({ error: "Podaj has\u0142o, aby usun\u0105\u0107 konto." }, 400);
    const full = await env.DB.prepare("SELECT * FROM users WHERE id=?").bind(user.id).first();
    if (!await verifyPassword(input.password, full.password_salt, full.password_hash)) return json({ error: "Nieprawid\u0142owe has\u0142o." }, 401);
    await env.DB.prepare("DELETE FROM users WHERE id=?").bind(user.id).run();
    return json({ ok: true }, 200, { "set-cookie": sessionCookie("", 0) });
  }
  return json({ error: "Nie znaleziono endpointu." }, 404);
}
__name(api, "api");
var static_site_default = { async fetch(request, env) {
  try {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      if (!env.DB) return json({ error: "Baza kont nie zosta\u0142a skonfigurowana." }, 503);
      return await api(request, env);
    }
    return env.ASSETS?.fetch ? env.ASSETS.fetch(request) : new Response("Czatbox TT(M)");
  } catch (error) {
    const message = error?.message || String(error), preview = new URL(request.url).hostname.startsWith("auth-test-");
    console.error(JSON.stringify({ event: "request_error", message }));
    return json({ error: "Wyst\u0105pi\u0142 b\u0142\u0105d serwera.", ...preview ? { diagnostic: message } : {} }, 500);
  }
} };
export {
  static_site_default as default
};
//# sourceMappingURL=static-site.js.map
