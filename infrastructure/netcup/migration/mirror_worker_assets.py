#!/usr/bin/env python3
"""Mirror the currently deployed Worker assets without copying local drafts."""

import argparse
import hashlib
import json
import mimetypes
import re
import tarfile
import urllib.parse
import urllib.request
import urllib.error
from collections import deque
from pathlib import Path

TEXT_TYPES = ("text/", "javascript", "json", "manifest")
ASSET_PATH = re.compile(r"(?:^/$|\.(?:html?|css|js|json|webmanifest|svg|png|jpe?g|gif|webp|ico|woff2?|ttf|txt|wav|mp3|mp4)(?:\?|$))", re.I)
URL_PATTERNS = (
    re.compile(r"(?:src|href)=[\"']([^\"']+)[\"']", re.I),
    re.compile(r"url\(\s*[\"']?([^\"')]+)", re.I),
    re.compile(r"[\"']((?:/|\./|\.\./)[^\"']+\.(?:css|js|json|webmanifest|svg|png|jpe?g|gif|webp|ico|woff2?|ttf|txt|wav|mp3|mp4)(?:\?[^\"']*)?)[\"']", re.I),
)


def output_path(root: Path, url: str) -> Path:
    path = urllib.parse.unquote(urllib.parse.urlsplit(url).path)
    if path == "/" or path.endswith("/"):
        path += "index.html"
    target = (root / path.lstrip("/")).resolve()
    if root.resolve() not in target.parents:
        raise ValueError(f"unsafe path: {path}")
    return target


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("origin")
    parser.add_argument("output_directory", type=Path)
    parser.add_argument("--archive", type=Path)
    args = parser.parse_args()
    origin = args.origin.rstrip("/")
    output_root = args.output_directory.resolve()
    origin_host = urllib.parse.urlsplit(origin).netloc
    queue = deque([f"{origin}/", f"{origin}/sw.js", f"{origin}/manifest.webmanifest"])
    queued = set(queue)
    manifest = {}
    errors = {}

    while queue:
        url = queue.popleft()
        target = output_path(output_root, url)
        if target.exists():
            data = target.read_bytes()
            content_type = mimetypes.guess_type(target.name)[0] or "application/octet-stream"
        else:
            request = urllib.request.Request(url, headers={"User-Agent": "Czatbox-cutover-mirror/1.0"})
            try:
                with urllib.request.urlopen(request, timeout=30) as response:
                    data = response.read()
                    content_type = response.headers.get_content_type()
            except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError) as error:
                errors[url] = str(error)
                continue
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(data)
        relative = target.relative_to(output_root).as_posix()
        manifest[relative] = {
            "bytes": len(data),
            "sha256": hashlib.sha256(data).hexdigest(),
            "source": url,
        }

        if not any(marker in content_type for marker in TEXT_TYPES):
            continue
        text = data.decode("utf-8", errors="ignore")
        for pattern in URL_PATTERNS:
            for match in pattern.finditer(text):
                raw = match.group(1).strip()
                if not raw or any(character.isspace() for character in raw) or "{" in raw or "}" in raw:
                    continue
                if not ASSET_PATH.search(urllib.parse.urlsplit(raw).path):
                    continue
                candidate = urllib.parse.urljoin(url, raw)
                parsed = urllib.parse.urlsplit(candidate)
                if parsed.netloc != origin_host or parsed.path.startswith("/api/"):
                    continue
                normalized = urllib.parse.urlunsplit((parsed.scheme, parsed.netloc, parsed.path, parsed.query, ""))
                if normalized not in queued:
                    queued.add(normalized)
                    queue.append(normalized)

    manifest_path = output_root / "cutover-manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    errors_path = output_root / "cutover-errors.json"
    errors_path.write_text(json.dumps(errors, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    if "index.html" not in manifest or "sw.js" not in manifest or "manifest.webmanifest" not in manifest:
        raise RuntimeError("required entrypoint assets were not mirrored")
    if args.archive:
        args.archive.parent.mkdir(parents=True, exist_ok=True)
        with tarfile.open(args.archive, "w:gz") as archive:
            for relative in sorted(manifest):
                archive.add(output_root / relative, arcname=relative, recursive=False)
            archive.add(manifest_path, arcname=manifest_path.name, recursive=False)
            archive.add(errors_path, arcname=errors_path.name, recursive=False)
    print(json.dumps({"files": len(manifest), "bytes": sum(item["bytes"] for item in manifest.values()), "skipped": len(errors), "archive": str(args.archive) if args.archive else None}))


if __name__ == "__main__":
    main()
