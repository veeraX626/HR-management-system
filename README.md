# Hackathon Monorepo (Next.js 15 + FastAPI)

Battle-tested starter for 8-hour builds: Next.js 15 (app router) + Tailwind + shadcn/ui + FastAPI + Postgres + Docker + deploy-ready configs.

## Quickstart
1. Copy `.env.example` to `.env` and adjust secrets.
2. Install frontend deps: `cd frontend && npm install`.
3. Install backend deps: `cd backend && pip install -r requirements.txt`.
4. Run dev stack: `docker-compose up --build` then `npm run dev` in `frontend` (API at http://localhost:8000, web at http://localhost:3000).

## Frontend
- Next.js 15 app router with Tailwind and shadcn-style components in `components/ui`.
- Dark mode + toast provider in [app/layout.tsx](frontend/app/layout.tsx).
- Landing with hero, metrics, table, and chart in [app/page.tsx](frontend/app/page.tsx).
- Protected example with login + CRUD table in [app/dashboard/page.tsx](frontend/app/dashboard/page.tsx).
- API helpers and JWT storage in [lib/api.ts](frontend/lib/api.ts) and [lib/auth.ts](frontend/lib/auth.ts).
- Mocks for offline dev: set `NEXT_PUBLIC_MOCK_API=true` and calls will resolve via [mocks/mockApi.ts](frontend/mocks/mockApi.ts).
- Tests: `npm test` (Vitest) example in [__tests__/smoke.test.tsx](frontend/__tests__/smoke.test.tsx).

## Backend
- FastAPI with CORS, health, and docs in [main.py](backend/main.py).
- Async SQLAlchemy models, CRUD, and JWT helpers in [models/user.py](backend/models/user.py), [crud/user.py](backend/crud/user.py), [security.py](backend/security.py).
- Auth and user routers in [routers/auth.py](backend/routers/auth.py) and [routers/users.py](backend/routers/users.py).
- Alembic ready: config at [alembic.ini](backend/alembic.ini) and migration in [alembic/versions/0001_create_users.py](backend/alembic/versions/0001_create_users.py).
- Seed sample users: `python backend/scripts/seed.py`.
- Basic test: `pytest backend/tests`.

## Database & Docker
- `docker-compose.yml` runs Postgres and the backend (hot reload) with persistent volume.
- Change DB creds via `.env` variables (`POSTGRES_*`, `DATABASE_URL`).
- Run migrations: `cd backend && alembic upgrade head`.

## Deployment
- Frontend: deploy to Vercel; rewrite `/api/*` to backend via [vercel.json](vercel.json).
- Backend: deploy to Railway/Render using [backend/Dockerfile](backend/Dockerfile); set env vars (`DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGINS`).
- Simple deploy helper at [scripts/deploy.sh](scripts/deploy.sh) (replace registry placeholders).

## Auth
- Username/password login returns JWT bearer token (stub) from `/auth/login` and `/auth/register`.
- Include token via `Authorization: Bearer <token>`; frontend helper `auth.authHeader()` adds it automatically.

## Extras
- Mock API responses for offline demos at `/mock/users` (backend) and in frontend mocks.
- Prettier + ESLint already configured (run `npm run lint`, `npm run format`).
- Skeleton, badge, toast, dialog, select, form, table, card, button, chart, input components prebuilt.

## 1-click checklist
- Env prepared via `.env.example`.
- `docker-compose up` brings Postgres + FastAPI.
- `npm run dev` serves Next.js frontend.
- `alembic upgrade head` then `python scripts/seed.py` primes demo data.
# HR-management-system
