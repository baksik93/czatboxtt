import http from "node:http";
import { timingSafeEqual } from "node:crypto";
import { PostgresD1 } from "./postgres-d1.mjs";
import { createLiveRelay } from "./live-relay.mjs";

Object.defineProperty(globalThis.crypto.subtle, "timingSafeEqual", {
  configurable: true,
  value(left, right) {
    const a = Buffer.from(left);
    const b = Buffer.from(right);
    return a.length === b.length && timingSafeEqual(a, b);
  }
});

const database = new PostgresD1(process.env.DATABASE_URL);
const { default: worker } = await import("./worker.mjs");
const port = Number(process.env.PORT || 3000);
const maxBodyBytes = 8_000_000;

const workerEnv = {
  DB: database,
  ADMIN_DASHBOARD_TOKEN: process.env.ADMIN_DASHBOARD_TOKEN || "",
  BREVO_API_KEY: process.env.BREVO_API_KEY || "",
  EMAIL_FROM: process.env.EMAIL_FROM || "",
  PUBLIC_APP_ORIGIN: process.env.PUBLIC_APP_ORIGIN || "",
  ASSETS: { fetch: () => new Response("Czatbox TT(M)") }
};

function requestUrl(request) {
  const forwardedProto = String(request.headers["x-forwarded-proto"] || "").split(",")[0].trim();
  const forwardedHost = String(request.headers["x-forwarded-host"] || "").split(",")[0].trim();
  const protocol = forwardedProto || "http";
  const host = forwardedHost || request.headers.host || "localhost";
  return `${protocol}://${host}${request.url || "/"}`;
}

async function readBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxBodyBytes) throw Object.assign(new Error("request_too_large"), { statusCode: 413 });
    chunks.push(chunk);
  }
  return chunks.length ? Buffer.concat(chunks) : undefined;
}

async function handle(request, response) {
  try {
    if (request.url === "/healthz") {
      await database.query("SELECT 1");
      response.writeHead(200, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
      response.end(JSON.stringify({ status: "ok", service: "czatbox-api", database: "ok" }));
      return;
    }

    const method = request.method || "GET";
    const body = method === "GET" || method === "HEAD" ? undefined : await readBody(request);
    const fetchRequest = new Request(requestUrl(request), {
      method,
      headers: request.headers,
      body
    });
    const workerResponse = await worker.fetch(fetchRequest, workerEnv);
    const headers = Object.fromEntries(workerResponse.headers.entries());
    response.writeHead(workerResponse.status, headers);
    response.end(Buffer.from(await workerResponse.arrayBuffer()));
  } catch (error) {
    const status = Number(error?.statusCode || 500);
    console.error(JSON.stringify({ event: "node_adapter_error", message: error?.message || String(error) }));
    response.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
    response.end(JSON.stringify({ error: status === 413 ? "Żądanie jest zbyt duże." : "Wystąpił błąd serwera." }));
  }
}

const server = http.createServer((request, response) => void handle(request, response));
const liveRelay = createLiveRelay({
  server,
  database,
  publicAppOrigin: process.env.PUBLIC_APP_ORIGIN || ""
});
server.listen(port, "0.0.0.0", () => console.log(JSON.stringify({ event: "api_started", port })));

async function shutdown(signal) {
  console.log(JSON.stringify({ event: "api_stopping", signal }));
  liveRelay.close();
  await new Promise((resolve) => server.close(resolve));
  await database.close();
  process.exit(0);
}

process.once("SIGTERM", () => void shutdown("SIGTERM"));
process.once("SIGINT", () => void shutdown("SIGINT"));
