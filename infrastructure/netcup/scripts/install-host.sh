#!/usr/bin/env bash
set -euo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run this script as root." >&2
  exit 1
fi

source_dir="${1:-/tmp/czatbox-stage}"
target_dir="/opt/czatbox"

test -f "${source_dir}/docker-compose.yml"
test -f "${source_dir}/Caddyfile"

install -d -m 0755 "$target_dir"
cp -a "${source_dir}/." "$target_dir/"
chown -R root:root "$target_dir"
chmod 0755 "$target_dir/scripts/backup-postgres.sh"

if [[ ! -f "${target_dir}/.env" ]]; then
  umask 077
  postgres_password="$(openssl rand -hex 32)"
  printf 'POSTGRES_DB=czatbox\nPOSTGRES_USER=czatbox\nPOSTGRES_PASSWORD=%s\n' \
    "$postgres_password" > "${target_dir}/.env"
fi
chmod 0600 "${target_dir}/.env"

install -o root -g root -m 0644 \
  "${target_dir}/systemd/czatbox-postgres-backup.service" \
  /etc/systemd/system/czatbox-postgres-backup.service
install -o root -g root -m 0644 \
  "${target_dir}/systemd/czatbox-postgres-backup.timer" \
  /etc/systemd/system/czatbox-postgres-backup.timer

cd "$target_dir"
docker compose config --quiet
docker compose pull
docker compose up -d

systemctl daemon-reload
systemctl enable --now czatbox-postgres-backup.timer

for _ in {1..30}; do
  postgres_health="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' czatbox-postgres-1 2>/dev/null || true)"
  caddy_health="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' czatbox-caddy-1 2>/dev/null || true)"
  if [[ "$postgres_health" == "healthy" && "$caddy_health" == "healthy" ]]; then
    break
  fi
  sleep 2
done

test "$(docker inspect --format '{{.State.Health.Status}}' czatbox-postgres-1)" = "healthy"
test "$(docker inspect --format '{{.State.Health.Status}}' czatbox-caddy-1)" = "healthy"

systemctl start czatbox-postgres-backup.service
docker compose ps
systemctl list-timers czatbox-postgres-backup.timer --no-pager
