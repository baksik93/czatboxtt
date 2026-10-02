import { createRequire } from "node:module";
import { randomBytes } from "node:crypto";

const require = createRequire("/app/package.json");
const { Pool } = require("pg");

const baseUrl = process.env.SMOKE_BASE_URL || "http://api:3000";
const expectSharedCookie = process.env.SMOKE_EXPECT_SHARED_COOKIE !== "false";
const origin = new URL(baseUrl).origin;
const email = `migration-smoke-${Date.now()}@example.invalid`;
const password = `T3st-${randomBytes(18).toString("base64url")}`;
const avatar = "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEALmk0mk0iIiIiIgBoSygABc6zbAAA";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const tables = ["users", "sessions", "action_tokens", "sync_data", "registration_events", "account_activity"];

async function counts() {
  return Object.fromEntries(await Promise.all(tables.map(async (table) => {
    const result = await pool.query(`SELECT COUNT(*)::integer AS count FROM ${table}`);
    return [table, result.rows[0].count];
  })));
}

async function api(path, options = {}) {
  return fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { origin, "content-type": "application/json", ...(options.headers || {}) }
  });
}

const before = await counts();
try {
  const register = await api("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name: "Migration Smoke", email, password })
  });
  if (![201, 503].includes(register.status)) throw new Error(`register_status_${register.status}`);

  const created = await pool.query("SELECT id FROM users WHERE email=$1", [email]);
  if (created.rowCount !== 1) throw new Error("registration_not_persisted");
  await pool.query("UPDATE users SET email_verified=1 WHERE email=$1", [email]);

  const login = await api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
  if (login.status !== 200) throw new Error(`login_status_${login.status}`);
  const setCookie = login.headers.get("set-cookie") || "";
  const hasSharedDomain = /;\s*Domain=czatboxtt\.com(?:;|$)/i.test(setCookie);
  if (expectSharedCookie && !hasSharedDomain) throw new Error("shared_session_domain_missing");
  if (!expectSharedCookie && hasSharedDomain) throw new Error("legacy_desktop_cookie_not_host_scoped");
  const cookie = setCookie.split(";", 1)[0];
  if (!cookie?.startsWith("cttm_session=")) throw new Error("session_cookie_missing");

  const session = await api("/api/auth/session", { headers: { cookie } });
  if (session.status !== 200 || !(await session.json()).authenticated) throw new Error("session_check_failed");

  const syncWrite = await api("/api/sync", {
    method: "PUT",
    headers: { cookie },
    body: JSON.stringify({
      data: { settings: { smoke: true }, filters: [], creators: [], archive: [] },
      meta: { settings: Date.now(), filters: 0, creators: 0, archive: 0 }
    })
  });
  if (syncWrite.status !== 200 || Number((await syncWrite.json()).revision) !== 1) throw new Error("sync_write_failed");

  const profile = await api("/api/account/profile", {
    method: "PATCH",
    headers: { cookie },
    body: JSON.stringify({ name: "Migration Smoke Updated", avatar })
  });
  if (profile.status !== 200) throw new Error(`profile_status_${profile.status}`);
  const profileBody = await profile.json();
  if (profileBody.user?.avatar !== avatar) throw new Error("profile_avatar_not_persisted");

  const avatarSession = await api("/api/auth/session", { headers: { cookie } });
  const avatarSessionBody = await avatarSession.json();
  if (avatarSession.status !== 200 || avatarSessionBody.user?.avatar !== avatar) throw new Error("session_avatar_missing");

  const logout = await api("/api/auth/logout", { method: "POST", headers: { cookie }, body: "{}" });
  if (logout.status !== 200) throw new Error(`logout_status_${logout.status}`);
  const expired = await api("/api/auth/session", { headers: { cookie } });
  if (expired.status !== 401) throw new Error(`logout_session_status_${expired.status}`);

  console.log(JSON.stringify({ ok: true, registerStatus: register.status, login: true, session: true, sync: true, profile: true, logout: true }));
} finally {
  await pool.query("DELETE FROM registration_events WHERE email=$1", [email]);
  await pool.query("DELETE FROM login_attempts WHERE email=$1", [email]);
  await pool.query("DELETE FROM users WHERE email=$1", [email]);
  const after = await counts();
  if (JSON.stringify(before) !== JSON.stringify(after)) {
    throw new Error(`cleanup_count_mismatch:${JSON.stringify({ before, after })}`);
  }
  await pool.end();
}
