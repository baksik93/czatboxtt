# Netcup production infrastructure

This directory contains the initial production foundation for `czatboxtt.com`.

- Caddy terminates TLS, serves the product page on `czatboxtt.com` and the browser application on `app.czatboxtt.com`.
- `landing/` contains the public product page; `site/` is populated at deployment time with the verified browser-application mirror and is intentionally not committed.
- PostgreSQL is isolated on an internal Docker network and is not published to the Internet.
- The Node API reuses the current Worker logic through a D1-compatible PostgreSQL adapter.
- The API is currently staging-only on the internal Docker network; Caddy does not proxy production traffic to it.
- Daily local database dumps are retained for 14 days.
- `.env` is generated only on the server and must never be committed.

The current Cloudflare Worker and D1 database remain authoritative. Before cutover,
create a fresh D1 export, repeat the import, configure the Brevo secret, rerun the
smoke test, enable the Caddy proxy and only then release a client that uses the new origin.
