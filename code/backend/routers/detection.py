"""
routers/detection.py
POST /api/v1/detect  – accepts an image, runs all loaded models in parallel,
returns JSON with detections + annotated image.
"""

from __future__ import annotations

import asyncio
import io
import logging
from concurrent.futures import ThreadPoolExecutor
from typing import Any

from fastapi import APIRouter, File, HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError

from config.settings import settings
from utils.annotator import annotate_image
from utils.inference import run_model
from utils.model_loader import model_registry

logger = logging.getLogger("threatlens.router")
router = APIRouter()

# Thread pool for CPU-bound inference
_executor = ThreadPoolExecutor(max_workers=4)


def _infer_sync(model_name: str, image: Image.Image) -> list[dict]:
    """Blocking call — executed in the thread pool."""
    return run_model(model_registry[model_name], model_name, image)


async def _run_all_models(image: Image.Image) -> list[dict]:
    """Run every loaded model concurrently using the thread pool."""
    loop = asyncio.get_event_loop()
    tasks = [
        loop.run_in_executor(_executor, _infer_sync, name, image)
        for name in model_registry
    ]
    results = await asyncio.gather(*tasks, return_exceptions=True)

    detections: list[dict] = []
    for name, result in zip(model_registry.keys(), results):
        if isinstance(result, Exception):
            logger.error("Model '%s' failed: %s", name, result)
        else:
            detections.extend(result)
    return detections


def _build_summary(detections: list[dict]) -> dict[str, Any]:
    """Aggregate detection counts per model / category."""
    summary: dict[str, int] = {}
    for det in detections:
        key = det["model"]
        summary[key] = summary.get(key, 0) + 1
    return {
        "total_threats": len(detections),
        "by_category": summary,
        "highest_confidence": (
            max(detections, key=lambda d: d["confidence"])["confidence"]
            if detections
            else None
        ),
    }


@router.post("/detect")
async def detect(file: UploadFile = File(...)) -> dict[str, Any]:
    """
    Upload an image and receive threat detections from all loaded models.

    Returns
    -------
    JSON body:
    {
        "summary": { "total_threats": int, "by_category": {...}, ... },
        "detections": [ { model, class_name, confidence, bbox }, ... ],
        "annotated_image": "<base64 PNG>",
        "models_used": ["fire", "fight", "weapon"]
    }
    """
    # ── Validate upload ──────────────────────────────────────────────────────
    max_bytes = settings.MAX_UPLOAD_MB * 1024 * 1024
    raw = await file.read()
    if len(raw) > max_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"File too large (max {settings.MAX_UPLOAD_MB} MB).",
        )

    try:
        image = Image.open(io.BytesIO(raw)).convert("RGB")
    except UnidentifiedImageError:
        raise HTTPException(status_code=400, detail="Uploaded file is not a valid image.")

    if not model_registry:
        raise HTTPException(
            status_code=503,
            detail="No models are loaded. Check backend/models_store/ for .pt files.",
        )

    # ── Run inference ────────────────────────────────────────────────────────
    detections = await _run_all_models(image)

    # ── Annotate ─────────────────────────────────────────────────────────────
    annotated_b64 = annotate_image(image, detections)

    return {
        "summary": _build_summary(detections),
        "detections": detections,
        "annotated_image": annotated_b64,
        "models_used": list(model_registry.keys()),
    }


@router.get("/models")
def list_models() -> dict[str, Any]:
    """Return names of currently loaded models."""
    return {"models": list(model_registry.keys())}
