"""
utils/annotator.py
Draws bounding boxes + labels on an image and returns a base64-encoded PNG.
Each threat category gets its own colour.
"""

from __future__ import annotations

import base64
import io

from PIL import Image, ImageDraw, ImageFont

# Colour palette per model/category  (R, G, B, A)
CATEGORY_COLOURS: dict[str, tuple[int, int, int, int]] = {
    "fire":   (255, 80,  30,  220),
    "fight":  (230, 30,  100, 220),
    "weapon": (50,  160, 255, 220),
    # default fallback
    "default": (120, 60, 200, 220),
}

LABEL_BG_ALPHA = 180
FONT_SIZE = 14
BOX_WIDTH = 2


def _colour_for(model_name: str) -> tuple[int, int, int, int]:
    return CATEGORY_COLOURS.get(model_name.lower(), CATEGORY_COLOURS["default"])


def annotate_image(
    image: Image.Image,
    detections: list[dict],
) -> str:
    """
    Draw all detections onto *image* (non-destructive copy).

    Returns
    -------
    str – base64-encoded PNG suitable for embedding in JSON.
    """
    img = image.convert("RGBA")
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", FONT_SIZE)
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", FONT_SIZE - 2)
    except OSError:
        font = ImageFont.load_default()
        font_small = font

    for det in detections:
        colour = _colour_for(det["model"])
        x1, y1, x2, y2 = det["bbox"]

        # Bounding box
        draw.rectangle([x1, y1, x2, y2], outline=colour, width=BOX_WIDTH)

        # Label text
        label = f"{det['model'].upper()} · {det['class_name']} {det['confidence']:.0%}"
        bbox_text = draw.textbbox((x1, y1), label, font=font)
        text_w = bbox_text[2] - bbox_text[0]
        text_h = bbox_text[3] - bbox_text[1]
        label_y = max(y1 - text_h - 6, 0)

        # Label background
        draw.rectangle(
            [x1, label_y, x1 + text_w + 6, label_y + text_h + 4],
            fill=(*colour[:3], LABEL_BG_ALPHA),
        )
        draw.text((x1 + 3, label_y + 2), label, fill=(255, 255, 255, 255), font=font)

    # Merge overlay
    composed = Image.alpha_composite(img, overlay).convert("RGB")

    buf = io.BytesIO()
    composed.save(buf, format="PNG", optimize=True)
    buf.seek(0)
    return base64.b64encode(buf.read()).decode("utf-8")
