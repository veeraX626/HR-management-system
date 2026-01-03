#!/usr/bin/env bash
set -euo pipefail

# Build backend image and push (placeholder - replace registry)
# docker build -t your-registry/hackathon-backend:latest ./backend
# docker push your-registry/hackathon-backend:latest

echo "Run DB migrations"
cd backend
alembic upgrade head

echo "Starting backend"
uvicorn main:app --host 0.0.0.0 --port 8000
