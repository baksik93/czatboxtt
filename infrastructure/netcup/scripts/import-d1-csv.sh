#!/bin/sh
set -eu

PROJECT_DIR=${PROJECT_DIR:-/opt/czatbox}
IMPORT_DIR=${1:-}
REPLACE_EXISTING=${REPLACE_EXISTING:-0}
TABLES="users sessions action_tokens login_attempts sync_data registration_events account_activity"

if [ "$(id -u)" -ne 0 ]; then
  echo "Run this script as root." >&2
  exit 1
fi
if [ -z "$IMPORT_DIR" ] || [ ! -d "$IMPORT_DIR" ]; then
  echo "Usage: $0 /absolute/path/to/private/csv" >&2
  exit 1
fi
for table in $TABLES; do
  if [ ! -f "$IMPORT_DIR/$table.csv" ]; then
    echo "Missing $IMPORT_DIR/$table.csv" >&2
    exit 1
  fi
done

cd "$PROJECT_DIR"
container=$(docker compose ps -q postgres)
if [ -z "$container" ]; then
  echo "PostgreSQL container is not running." >&2
  exit 1
fi

existing=$(docker compose exec -T postgres sh -c 'psql -At -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT COUNT(*) FROM users"')
if [ "$existing" != "0" ] && [ "$REPLACE_EXISTING" != "1" ]; then
  echo "Database contains $existing users. Set REPLACE_EXISTING=1 only for an intentional snapshot replacement." >&2
  exit 1
fi

container_import=/tmp/czatbox-d1-import
cleanup() {
  docker exec "$container" rm -rf "$container_import" >/dev/null 2>&1 || true
}
trap cleanup EXIT HUP INT TERM
cleanup
docker exec "$container" mkdir -m 0700 "$container_import"
docker cp "$IMPORT_DIR/." "$container:$container_import/"

docker compose exec -T postgres sh -c 'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"' <<'SQL'
BEGIN;
TRUNCATE account_activity, registration_events, sync_data, login_attempts, action_tokens, sessions, users;
\copy users FROM '/tmp/czatbox-d1-import/users.csv' WITH (FORMAT csv, HEADER true, NULL '\N')
\copy sessions FROM '/tmp/czatbox-d1-import/sessions.csv' WITH (FORMAT csv, HEADER true, NULL '\N')
\copy action_tokens FROM '/tmp/czatbox-d1-import/action_tokens.csv' WITH (FORMAT csv, HEADER true, NULL '\N')
\copy login_attempts FROM '/tmp/czatbox-d1-import/login_attempts.csv' WITH (FORMAT csv, HEADER true, NULL '\N')
\copy sync_data FROM '/tmp/czatbox-d1-import/sync_data.csv' WITH (FORMAT csv, HEADER true, NULL '\N')
\copy registration_events FROM '/tmp/czatbox-d1-import/registration_events.csv' WITH (FORMAT csv, HEADER true, NULL '\N')
\copy account_activity FROM '/tmp/czatbox-d1-import/account_activity.csv' WITH (FORMAT csv, HEADER true, NULL '\N')
COMMIT;
SQL

docker compose exec -T postgres sh -c 'psql -At -F= -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT '\''users'\'',COUNT(*) FROM users UNION ALL SELECT '\''sessions'\'',COUNT(*) FROM sessions UNION ALL SELECT '\''action_tokens'\'',COUNT(*) FROM action_tokens UNION ALL SELECT '\''login_attempts'\'',COUNT(*) FROM login_attempts UNION ALL SELECT '\''sync_data'\'',COUNT(*) FROM sync_data UNION ALL SELECT '\''registration_events'\'',COUNT(*) FROM registration_events UNION ALL SELECT '\''account_activity'\'',COUNT(*) FROM account_activity ORDER BY 1"'
