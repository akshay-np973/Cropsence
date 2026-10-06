import aiosqlite
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "cropsense.db"

CREATE_PREDICTIONS_TABLE = """
CREATE TABLE IF NOT EXISTS predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nitrogen REAL NOT NULL,
    phosphorus REAL NOT NULL,
    potassium REAL NOT NULL,
    temperature REAL NOT NULL,
    humidity REAL NOT NULL,
    ph REAL NOT NULL,
    rainfall REAL NOT NULL,
    crop TEXT NOT NULL,
    confidence REAL NOT NULL,
    explanation TEXT,
    alternatives TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""

async def init_db():
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(CREATE_PREDICTIONS_TABLE)
        await db.commit()

async def get_db():
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        yield db
