#!/usr/bin/env python3
"""Convert a Wrangler D1 SQL export to private CSV files without logging row data."""

import argparse
import csv
import io
import json
import sqlite3
import tempfile
from pathlib import Path

TABLES = (
    "users",
    "sessions",
    "action_tokens",
    "login_attempts",
    "sync_data",
    "registration_events",
    "account_activity",
)


def csv_line(values) -> str:
    """Quote every real value while keeping SQL NULL as an unquoted marker."""
    fields = []
    for value in values:
        if value is None:
            fields.append(r"\N")
            continue
        buffer = io.StringIO()
        csv.writer(buffer, quoting=csv.QUOTE_ALL, lineterminator="").writerow([value])
        fields.append(buffer.getvalue())
    return ",".join(fields) + "\n"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("sql_export", type=Path)
    parser.add_argument("output_directory", type=Path)
    args = parser.parse_args()

    args.output_directory.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="czatbox-d1-") as temporary:
        database_path = Path(temporary) / "d1.sqlite3"
        connection = sqlite3.connect(database_path)
        try:
            connection.executescript(args.sql_export.read_text(encoding="utf-8"))
            manifest = {}
            for table in TABLES:
                cursor = connection.execute(f'SELECT * FROM "{table}"')
                columns = [description[0] for description in cursor.description]
                output = args.output_directory / f"{table}.csv"
                with output.open("w", newline="", encoding="utf-8") as stream:
                    stream.write(csv_line(columns))
                    count = 0
                    for row in cursor:
                        stream.write(csv_line(row))
                        count += 1
                manifest[table] = {"rows": count, "columns": columns}
            (args.output_directory / "manifest.json").write_text(
                json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
            )
        finally:
            connection.close()

    print(json.dumps({table: details["rows"] for table, details in manifest.items()}, sort_keys=True))


if __name__ == "__main__":
    main()
