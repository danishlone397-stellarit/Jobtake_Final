# FastAPI proxy: forwards all /api/* requests from supervisor's `backend` (port 8001)
# to the Next.js dev server on localhost:3000. This is required because the
# Emergent Kubernetes ingress routes /api/* to port 8001, while Next.js' API
# routes are co-located with the frontend on port 3000.

import os
import httpx
from fastapi import FastAPI, Request
from fastapi.responses import Response

NEXT_ORIGIN = os.environ.get("NEXT_ORIGIN", "http://127.0.0.1:3000")

app = FastAPI(title="Jobtake API proxy")
client = httpx.AsyncClient(timeout=httpx.Timeout(60.0))


@app.get("/")
async def root():
    return {"service": "jobtake-proxy", "target": NEXT_ORIGIN}


@app.api_route("/api/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"])
async def proxy(path: str, request: Request):
    body = await request.body()
    target_url = f"{NEXT_ORIGIN}/api/{path}"
    if request.url.query:
        target_url = f"{target_url}?{request.url.query}"
    headers = {k: v for k, v in request.headers.items() if k.lower() not in {"host", "content-length"}}
    try:
        upstream = await client.request(
            request.method,
            target_url,
            content=body,
            headers=headers,
            follow_redirects=False,
        )
    except httpx.RequestError as e:
        return Response(content=f"Upstream error: {e}", status_code=502)

    response_headers = {k: v for k, v in upstream.headers.items() if k.lower() not in {"content-encoding", "transfer-encoding", "connection"}}
    return Response(content=upstream.content, status_code=upstream.status_code, headers=response_headers, media_type=upstream.headers.get("content-type"))
