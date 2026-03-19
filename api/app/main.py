from __future__ import annotations

import asyncio
import json
from datetime import datetime
from typing import AsyncGenerator

import httpx
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse

from .config import Settings, get_settings


class ChatPayload(BaseModel):
    session_id: str
    message: str


app = FastAPI(title="ItacaPanel API", version="0.1.0")


def configure_cors(settings: Settings) -> None:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


configure_cors(get_settings())


@app.get("/api/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "ts": datetime.utcnow().isoformat()}


@app.post("/api/chat")
async def relay_chat(payload: ChatPayload, settings: Settings = Depends(get_settings)) -> dict[str, str]:
    """Placeholder proxy to OpenClaw gateway.

    TODO: Replace with actual call to /sessions/:id/messages when hooking up the gateway.
    """

    if not settings.openclaw_gateway_url:
        raise HTTPException(status_code=500, detail="Gateway URL not configured")

    # For now we just echo back; later we'll forward to OpenClaw via httpx
    return {
        "status": "queued",
        "session_id": payload.session_id,
        "echo": payload.message,
    }


async def heartbeat_stream() -> AsyncGenerator[str, None]:
    while True:
        data = json.dumps({"ts": datetime.utcnow().isoformat()})
        yield f"event: heartbeat\ndata: {data}\n\n"
        await asyncio.sleep(15)


@app.get("/api/stream/{session_id}")
async def stream_session(session_id: str) -> EventSourceResponse:
    """Simple SSE endpoint that will later fan out real OpenClaw events."""

    async def event_generator() -> AsyncGenerator[str, None]:
        async for chunk in heartbeat_stream():
            yield chunk

    return EventSourceResponse(event_generator())
