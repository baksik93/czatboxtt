#!/usr/bin/env bash
set -euo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run this script as root." >&2
  exit 1
fi

swap_file=/swapfile

if ! swapon --show=NAME --noheadings | grep -Fxq "$swap_file"; then
  if [[ ! -f "$swap_file" ]]; then
    fallocate -l 4G "$swap_file"
    chmod 0600 "$swap_file"
    mkswap "$swap_file"
  fi
  swapon "$swap_file"
fi

if ! grep -Eq '^/swapfile[[:space:]]' /etc/fstab; then
  printf '/swapfile none swap sw 0 0\n' >> /etc/fstab
fi

install -o root -g root -m 0644 \
  /opt/czatbox/system/99-czatbox.conf \
  /etc/sysctl.d/99-czatbox.conf
sysctl --system >/dev/null

swapon --show
sysctl vm.swappiness vm.vfs_cache_pressure
