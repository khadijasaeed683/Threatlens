# ThreatLens 🔭

**Automated Vision System for Violence, Weapon, and Fire Localization**

A full-stack application that loads trained YOLOv8 models at startup and
serves real-time threat detection via a clean web interface.

---

## Architecture

```
threatlens/
├── backend/                    # FastAPI application
│   ├── main.py                 # Entry point, lifespan, CORS
│   ├── requirements.txt
│   ├── config/
│   │   └── settings.py         # All config (model paths, thresholds, CORS)
│   ├── routers/
│   │   └── detection.py        # POST /api/v1/detect  GET /api/v1/models
│   ├── utils/
│   │   ├── model_loader.py     # Loads all .pt models into model_registry
│   │   ├── inference.py        # Per-model YOLO inference → detection dicts
│   │   └── annotator.py        # Draws bounding boxes → base64 PNG
│   └── models_store/           # ← place your .pt files here
│       ├── fire_detection.pt
│       ├── fight_detection.pt
│       └── weapon_detection.pt
│
└── frontend/                   # React + Tailwind application
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── hooks/
        │   └── useDetection.js
        ├── utils/
        │   └── api.js
        └── components/
            ├── Header.jsx
            ├── UploadZone.jsx       # Drag-and-drop image upload
            ├── SummaryPanel.jsx     # Threat counts + highest confidence
            ├── AnnotatedImage.jsx   # Rendered bounding-box image
            ├── DetectionList.jsx    # Per-detection confidence bars
            ├── ThreatBadge.jsx
            ├── LoadingOverlay.jsx
            └── ErrorBanner.jsx
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| Python | 3.10 + |
| Node.js | 18 + |
| pip | latest |
| npm / yarn | latest |

---

## Step 1 — Add your model files

Copy your trained `.pt` files into `backend/models_store/`:

```
backend/models_store/fire_detection.pt
backend/models_store/fight_detection.pt
backend/models_store/weapon_detection.pt
```

> If your filenames differ, edit the `MODEL_PATHS` dict in
> `backend/config/settings.py` to match.

---

## Step 2 — Backend setup

```bash
cd threatlens/backend

# Create virtual environment (recommended)
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API is now available at **http://localhost:8000**

- Swagger UI → http://localhost:8000/docs
- Health check → http://localhost:8000/health

---

## Step 3 — Frontend setup

Open a **new terminal**:

```bash
cd threatlens/frontend

npm install
npm run dev
```

The UI is available at **http://localhost:5173**

---

## Step 4 — Using ThreatLens

1. Open **http://localhost:5173** in your browser.
2. Drag and drop (or click to browse) any scene image.
3. All loaded models run in parallel on the backend.
4. Results appear: annotated image with coloured bounding boxes, threat
   summary card, and per-detection confidence bars.
5. Click **Save PNG** to download the annotated output.
6. Click **Analyse another** to start over.

---

## API Reference

### `POST /api/v1/detect`

Upload an image and receive detections from all loaded models.

**Request** — multipart/form-data
```
file: <image file>   (JPEG, PNG, WebP, BMP — max 10 MB)
```

**Response** — JSON
```json
{
  "summary": {
    "total_threats": 3,
    "by_category": { "fire": 1, "weapon": 2 },
    "highest_confidence": 0.9123
  },
  "detections": [
    {
      "model": "fire",
      "class_name": "fire",
      "class_id": 0,
      "confidence": 0.9123,
      "bbox": [120.5, 88.0, 430.2, 310.7]
    }
  ],
  "annotated_image": "<base64 PNG string>",
  "models_used": ["fire", "fight", "weapon"]
}
```

### `GET /api/v1/models`
Returns names of currently loaded models.

### `GET /health`
```json
{ "status": "ok", "models_loaded": ["fire", "fight", "weapon"] }
```

---

## Configuration

All settings live in `backend/config/settings.py`:

| Setting | Default | Description |
|---------|---------|-------------|
| `CONFIDENCE_THRESHOLD` | `0.35` | Minimum confidence to include a detection |
| `IMAGE_SIZE` | `640` | YOLO input resolution |
| `MAX_UPLOAD_MB` | `10` | Max upload file size |
| `CORS_ORIGINS` | localhost:5173, :3000 | Allowed frontend origins |

You can also override via environment variables:
```bash
export CONF_THRESH=0.45
export IMG_SIZE=1280
uvicorn main:app --reload
```

---

## Adding a 4th Model

1. Place `your_model.pt` in `backend/models_store/`
2. Add one line to `MODEL_PATHS` in `config/settings.py`:
   ```python
   "smoke": BASE_DIR / "models_store" / "your_model.pt",
   ```
3. Add a colour entry in `backend/utils/annotator.py → CATEGORY_COLOURS`
4. Add a badge style in `frontend/src/components/ThreatBadge.jsx → STYLES`
5. Restart the backend — the model loads automatically.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `No models were loaded` | Check `.pt` paths in `settings.py`; verify files exist |
| `ultralytics not installed` | `pip install ultralytics` |
| Frontend can't reach backend | Confirm backend is on port 8000; check `vite.config.js` proxy |
| CUDA out of memory | Reduce `IMAGE_SIZE` in settings or use CPU |
| Slow inference | Models run on CPU by default — install CUDA PyTorch for GPU acceleration |

---

## Tech Stack

**Backend** — FastAPI · Uvicorn · Ultralytics YOLOv8 · Pillow · asyncio ThreadPoolExecutor

**Frontend** — React 18 · Vite · Tailwind CSS · Lucide Icons
