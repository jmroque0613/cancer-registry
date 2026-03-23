from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.endpoints import patients, cases, fhir, search

app = FastAPI(
    title="Cancer Registry API",
    description="FHIR R4 clinical data API for the hospital cancer registry",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(patients.router, prefix="/api/v1/patients", tags=["patients"])
app.include_router(cases.router,    prefix="/api/v1/cases",    tags=["cases"])
app.include_router(fhir.router,     prefix="/api/v1/fhir",     tags=["fhir"])
app.include_router(search.router,   prefix="/api/v1/search",   tags=["search"])

@app.get("/health")
async def health():
    return {"status": "ok", "service": "fastapi"}
