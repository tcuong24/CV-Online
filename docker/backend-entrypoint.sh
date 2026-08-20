#!/bin/sh
set -eu

attempt=1
until ./node_modules/.bin/prisma migrate deploy --schema=./prisma/schema.prisma; do
  if [ "$attempt" -ge 30 ]; then
    echo "Database is still unavailable after $attempt attempts." >&2
    exit 1
  fi
  echo "Waiting for PostgreSQL (attempt $attempt/30)..."
  attempt=$((attempt + 1))
  sleep 2
done

exec node dist/src/main.js
