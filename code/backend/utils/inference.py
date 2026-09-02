"""
utils/inference.py
Runs inference for ONE model against a PIL image and returns a list of
structured detection dicts.
"""

from __future__ import annotations

import logging
from typing import Any

import numpy as np
from PIL import Image

from config.settings import settings

logger = logging.getLogger("threatlens.inference")


def run_model(
    model,
    model_name: str,
    image: Image.Image,
) -> list[dict[str, Any]]:
    """
    Run YOLO inference on *image* and return detections.

    Returns
    -------
    list of dicts with keys:
        model        – str   e.g. "fire"
        class_name   – str   e.g. "fire"
        class_id     – int
        confidence   – float (0–1)
        bbox         – [x1, y1, x2, y2]  pixel coords on original image
    """
    try:
        results = model.predict(
            source=np.array(image),
            conf=settings.CONFIDENCE_THRESHOLD,
            imgsz=settings.IMAGE_SIZE,
            verbose=False,
        )
    except Exception as exc:
        logger.error("Inference failed for model '%s': %s", model_name, exc)
        return []

    detections: list[dict] = []
    for result in results:
        boxes = result.boxes
        if boxes is None:
            continue
        for box in boxes:
            xyxy = box.xyxy[0].tolist()
            detections.append(
                {
                    "model": model_name,
                    "class_name": result.names[int(box.cls[0])],
                    "class_id": int(box.cls[0]),
                    "confidence": round(float(box.conf[0]), 4),
                    "bbox": [round(v, 2) for v in xyxy],  # [x1, y1, x2, y2]
                }
            )
    return detections
