#!/usr/bin/env bash
# Starts the local Clojure API and Vite frontend together.
# The API receives the existing exported SQLite database; this script never
# creates, migrates, or alters the database.

set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_DIR="$ROOT_DIR/frontend"
BACKEND_DIR="$ROOT_DIR/backend"
DATABASE_PATH="${RISK_API_DB:-$ROOT_DIR/test1.sqlite}"
FRONTEND_PORT="${FRONTEND_PORT:-5173}"
BACKEND_PORT="${BACKEND_PORT:-8101}"

for directory in "$FRONTEND_DIR" "$BACKEND_DIR"; do
  if [[ ! -d "$directory" ]]; then
    echo "Missing required directory: $directory" >&2
    exit 1
  fi
done

if [[ ! -f "$DATABASE_PATH" ]]; then
  echo "SQLite database not found: $DATABASE_PATH" >&2
  exit 1
fi

if ! command -v clojure >/dev/null 2>&1; then
  echo "Clojure CLI is required to start the backend." >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required to start the frontend." >&2
  exit 1
fi

# Before starting, stop any processes already bound to the configured ports.
# This supports a clean restart even if a previous run left services behind.
kill_port_processes() {
  local port=$1
  local pids=""

  if command -v lsof >/dev/null 2>&1; then
    # Only target processes that are listening on the port.
    pids=$(lsof -nP -iTCP:"$port" -sTCP:LISTEN -t 2>/dev/null || true)
  elif command -v ss >/dev/null 2>&1; then
    pids=$(ss -lptn "sport = :$port" 2>/dev/null | grep -oE 'pid=[0-9]+' | cut -d= -f2 | sort -u | tr '\n' ' ')
  elif command -v fuser >/dev/null 2>&1; then
    pids=$(fuser "$port/tcp" 2>/dev/null || true)
  else
    echo "Cannot check port $port: lsof, ss, or fuser is required. Continuing anyway." >&2
    return 0
  fi

  if [[ -z "$pids" ]]; then
    return 0
  fi

  echo "Port $port is already in use by PID(s): $pids. Stopping them..."

  for pid in $pids; do
    if [[ "$pid" =~ ^[0-9]+$ ]] && kill -0 "$pid" 2>/dev/null; then
      kill -TERM "$pid" 2>/dev/null || true
    fi
  done

  local attempts=0
  local max_attempts=30
  local still_running=""

  while (( attempts < max_attempts )); do
    still_running=""
    for pid in $pids; do
      if [[ "$pid" =~ ^[0-9]+$ ]] && kill -0 "$pid" 2>/dev/null; then
        still_running="$still_running $pid"
      fi
    done
    if [[ -z "$still_running" ]]; then
      echo "Port $port is now free."
      return 0
    fi
    sleep 0.5
    attempts=$((attempts + 1))
  done

  echo "Force killing remaining PID(s) on port $port: $still_running"
  for pid in $still_running; do
    kill -KILL "$pid" 2>/dev/null || true
  done
  sleep 0.5
}

cleanup() {
  local status=$?
  trap - EXIT INT TERM
  kill "${BACKEND_PID:-}" "${FRONTEND_PID:-}" 2>/dev/null || true
  wait "${BACKEND_PID:-}" "${FRONTEND_PID:-}" 2>/dev/null || true
  exit "$status"
}
trap cleanup EXIT INT TERM

kill_port_processes "$BACKEND_PORT"
kill_port_processes "$FRONTEND_PORT"

(
  cd "$BACKEND_DIR"
  PORT="$BACKEND_PORT" RISK_API_DB="$DATABASE_PATH" exec clojure -M:run
) &
BACKEND_PID=$!

(
  cd "$FRONTEND_DIR"
  exec npm run dev -- --host 0.0.0.0 --port "$FRONTEND_PORT"
) &
FRONTEND_PID=$!

echo "Backend:  http://localhost:$BACKEND_PORT"
echo "Frontend: http://localhost:$FRONTEND_PORT"
echo "Database: $DATABASE_PATH (existing database; no schema operations by this script)"
echo "Press Ctrl+C to stop both services."

# Avoid `wait -n`: it is unavailable in the Bash version bundled with macOS.
# As soon as either child exits, the EXIT trap stops the remaining service.
while true; do
  if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
    wait "$BACKEND_PID"
    exit $?
  fi
  if ! kill -0 "$FRONTEND_PID" 2>/dev/null; then
    wait "$FRONTEND_PID"
    exit $?
  fi
  sleep 1
done
