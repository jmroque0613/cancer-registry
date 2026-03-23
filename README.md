# Cancer Registry Information System

Hospital cancer registry — FastAPI + Django + Next.js + PostgreSQL + Redis + Elasticsearch + HAPI FHIR R4 + Keycloak + Metabase.

## Quick Start

```bash
# 1. Copy and configure environment
cp .env.example .env

# 2. Start all infrastructure (Postgres, Redis, ES, Keycloak, HAPI FHIR, Metabase)
docker compose up -d

# 3. FastAPI service
cd backend/fastapi_service
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001

# 4. Django service (new terminal)
cd backend/django_service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8002

# 5. Next.js frontend (new terminal)
cd frontend
pnpm install
pnpm dev
```

## Service URLs

| Service         | URL                         |
|-----------------|-----------------------------|
| Next.js         | http://localhost:3000        |
| FastAPI docs    | http://localhost:8001/docs   |
| Django admin    | http://localhost:8002/admin  |
| Keycloak        | http://localhost:8080        |
| HAPI FHIR       | http://localhost:8090/fhir   |
| Metabase        | http://localhost:3001        |
| Elasticsearch   | http://localhost:9200        |
| PostgreSQL      | localhost:5432               |
| Redis           | localhost:6379               |
