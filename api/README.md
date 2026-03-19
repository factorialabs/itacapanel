# ItacaPanel API

Backend FastAPI (proxy seguro) para ItacaPanel.

## Estructura
- `app/main.py` — FastAPI + endpoints `/api/chat`, `/api/stream/{session_id}`, `/api/health`
- `app/config.py` — Configuración pydantic (gateway URL, API key, CORS)
- `requirements.txt` — Dependencias (FastAPI, httpx, sse-starlette, etc.)

## Ejecutar local
```bash
cd api
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 5050
```

Luego actualiza el front (`web/`) para apuntar al endpoint `http://localhost:5050/api`.
