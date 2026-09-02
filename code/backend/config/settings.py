"""
config/settings.py — Centralised configuration for ThreatLens backend.
Edit MODEL_PATHS to point at your actual .pt files.
"""

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings:
    # ── Server ──────────────────────────────────────────────────────────────
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))

    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",   # Vite dev server
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ]

    # ── Model paths (relative to backend/) ──────────────────────────────────
    # Place your .pt files inside  backend/models_store/
    MODEL_PATHS: dict[str, Path] = {
        "fire":    BASE_DIR / "models_store" / "fire_detection.pt",
        "fight":   BASE_DIR / "models_store" / "fight_detection.pt",
        "weapon":  BASE_DIR / "models_store" / "weapon_detection.pt",
        # Add a 4th model key here if needed, e.g.:
        # "smoke": BASE_DIR / "models_store" / "smoke_detection.pt",
    }

    # ── Inference ────────────────────────────────────────────────────────────
    CONFIDENCE_THRESHOLD: float = float(os.getenv("CONF_THRESH", 0.35))
    IMAGE_SIZE: int = int(os.getenv("IMG_SIZE", 640))
    MAX_UPLOAD_MB: int = 10


settings = Settings()
