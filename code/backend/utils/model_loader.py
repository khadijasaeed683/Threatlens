"""
utils/model_loader.py
Loads every configured YOLOv8 model once and stores it in `model_registry`.
All inference functions import from this registry — models are NEVER
reloaded per-request.
"""

from __future__ import annotations

import logging
from pathlib import Path

from config.settings import settings

logger = logging.getLogger("threatlens.loader")

# Global singleton registry  {model_name: YOLO instance}
model_registry: dict = {}


def load_all_models() -> None:
    """Iterate over settings.MODEL_PATHS and load each model."""
    try:
        from ultralytics import YOLO  # lazy import so server starts fast if missing
    except ImportError as exc:
        raise RuntimeError(
            "ultralytics is not installed. Run:  pip install ultralytics"
        ) from exc

    for name, path in settings.MODEL_PATHS.items():
        path = Path(path)
        if not path.exists():
            logger.warning(
                "Model file not found: %s — skipping '%s'.", path, name
            )
            continue
        logger.info("Loading model '%s' from %s …", name, path)
        model_registry[name] = YOLO(str(path))
        logger.info("Model '%s' loaded ✓", name)

    if not model_registry:
        logger.warning(
            "No models were loaded. Place .pt files in backend/models_store/ "
            "and verify settings.MODEL_PATHS."
        )
