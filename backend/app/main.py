import pickle
import numpy as np
import os
from pathlib import Path
from contextlib import asynccontextmanager
from dotenv import load_dotenv

# Load .env from the backend directory
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.routers import predict, history, weather

# ── Load ML model at startup ─────────────────────────────────────────────────
# backend/app/main.py → parent = app/, parent.parent = backend/ (where pkl files live)
BASE_DIR = Path(__file__).resolve().parent.parent

def load_model():
    model_path = BASE_DIR / "bagging_model.pkl"
    scaler_path = BASE_DIR / "scaler.pkl"
    import warnings
    with warnings.catch_warnings():
        warnings.simplefilter("ignore")
        with open(model_path, "rb") as f:
            model = pickle.load(f)
        with open(scaler_path, "rb") as f:
            scaler = pickle.load(f)
    return model, scaler

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    app.state.model, app.state.scaler = load_model()
    yield
    # Shutdown (nothing to clean up)

app = FastAPI(
    title="CropSense API",
    description="Crop recommendation API using ML + Groq AI",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://cropsence.onrender.com",
        "https://cropsence-ecru.vercel.app",
        "https://cropsence-e9nxs83kx-hobby-b301.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router, prefix="/api")
app.include_router(history.router, prefix="/api")
app.include_router(weather.router, prefix="/api")

@app.get("/api/health")
async def health():
    return {"status": "ok", "version": "1.0.0"}
