#!/usr/bin/env bash
set -euo pipefail

install -d -m 0700 /var/backups/czatbox/postgres
cd /opt/czatbox

set -a
source ./.env
set +a

timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
target="/var/backups/czatbox/postgres/czatbox-${timestamp}.sql.gz"

docker compose exec -T postgres pg_dump \
  --username "$POSTGRES_USER" \
  --dbname "$POSTGRES_DB" \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges | gzip -9 > "$target"

test -s "$target"
find /var/backups/czatbox/postgres -type f -name 'czatbox-*.sql.gz' -mtime +14 -delete
