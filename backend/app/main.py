from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import subprocess

from app.config import settings
from app.routers import orders, tracking, admin


@asynccontextmanager
async def lifespan(app: FastAPI):
    subprocess.run(["alembic", "upgrade", "head"], check=False)
    yield


app = FastAPI(title="RELAXIA API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH"],
    allow_headers=["*"],
)

app.include_router(orders.router, prefix="/api")
app.include_router(tracking.router, prefix="/api")
app.include_router(admin.router, prefix="/api/admin")


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "relaxia-api"}
