"""
ThreatLens — FastAPI backend entry point.
Loads all CV models once at startup; serves predictions via REST API.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config.settings import settings
from routers import detection
from utils.model_loader import load_all_models, model_registry


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load models at startup, release at shutdown."""
    print("🔭 ThreatLens: Loading vision models...")
    load_all_models()
    print(f"✅ {len(model_registry)} model(s) ready.")
    yield
    model_registry.clear()
    print("🛑 ThreatLens: Models unloaded.")


app = FastAPI(
    title="ThreatLens API",
    description="Automated Vision System for Violence, Weapon, and Fire Localization",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(detection.router, prefix="/api/v1", tags=["Detection"])


@app.get("/health", tags=["System"])
def health_check():
    return {
        "status": "ok",
        "models_loaded": list(model_registry.keys()),
    }
