# Database migration

`private/` contains production D1 exports with personal data and password hashes. It is intentionally ignored by Git and must not be shared or committed.

The checked-in schema and conversion scripts must not contain production rows or secrets.

`export_d1_csv.py` converts a full Wrangler export to private CSV files without
logging row contents. The staging import must be repeated from a fresh D1 export
immediately before production cutover because the live D1 database is still changing.

On the server, `scripts/import-d1-csv.sh` performs all table replacements in one
PostgreSQL transaction. It refuses to replace a non-empty database unless
`REPLACE_EXISTING=1` is explicitly supplied.
