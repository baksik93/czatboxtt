const LEGACY_ORIGIN = "https://app.czatboxtt.com";
const BACKEND_ORIGIN = "https://api.czatboxtt.com";

function json(payload, status, headers = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...headers,
    },
  });
}

function targetRequest(request, origin, rewriteOrigin = false, legacyDesktop = false) {
  const source = new URL(request.url);
  const target = new URL(`${source.pathname}${source.search}`, origin);
  const headers = new Headers(request.headers);
  if (rewriteOrigin && headers.has("origin")) headers.set("origin", target.origin);
  if (rewriteOrigin && headers.has("referer")) headers.set("referer", `${target.origin}/`);
  if (legacyDesktop) headers.set("x-czatbox-client", "desktop");
  return new Request(target, {
    method: request.method,
    headers,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
    redirect: "manual",
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      if (env.MIGRATION_MODE !== "proxy") {
        return json(
          { error: "Trwa bezpieczna migracja danych. Spróbuj ponownie za kilka minut." },
          503,
          { "retry-after": "120" },
        );
      }
      return fetch(targetRequest(request, BACKEND_ORIGIN, true, true));
    }
    return fetch(targetRequest(request, LEGACY_ORIGIN));
  },
};
