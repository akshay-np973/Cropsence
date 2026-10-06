import json
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.schemas import PredictionRecord, AlternativeCrop
from app.database import get_db

router = APIRouter()

def row_to_record(row) -> dict:
    alts = []
    if row["alternatives"]:
        try:
            raw = json.loads(row["alternatives"])
            alts = [AlternativeCrop(**a) for a in raw]
        except Exception:
            alts = []
    return {
        "id": row["id"],
        "nitrogen": row["nitrogen"],
        "phosphorus": row["phosphorus"],
        "potassium": row["potassium"],
        "temperature": row["temperature"],
        "humidity": row["humidity"],
        "ph": row["ph"],
        "rainfall": row["rainfall"],
        "crop": row["crop"],
        "confidence": row["confidence"],
        "explanation": row["explanation"],
        "alternatives": alts,
        "created_at": str(row["created_at"]),
    }

@router.get("/history", response_model=List[PredictionRecord])
async def get_history(search: Optional[str] = Query(None)):
    async for db in get_db():
        if search:
            cursor = await db.execute(
                "SELECT * FROM predictions WHERE crop LIKE ? ORDER BY created_at DESC LIMIT 50",
                (f"%{search}%",)
            )
        else:
            cursor = await db.execute(
                "SELECT * FROM predictions ORDER BY created_at DESC LIMIT 50"
            )
        rows = await cursor.fetchall()
        return [row_to_record(r) for r in rows]

@router.get("/history/{prediction_id}", response_model=PredictionRecord)
async def get_prediction(prediction_id: int):
    async for db in get_db():
        cursor = await db.execute(
            "SELECT * FROM predictions WHERE id = ?", (prediction_id,)
        )
        row = await cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Prediction not found")
        return row_to_record(row)

@router.delete("/history/{prediction_id}")
async def delete_prediction(prediction_id: int):
    async for db in get_db():
        cursor = await db.execute(
            "SELECT id FROM predictions WHERE id = ?", (prediction_id,)
        )
        row = await cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Prediction not found")
        await db.execute("DELETE FROM predictions WHERE id = ?", (prediction_id,))
        await db.commit()
        return {"message": "Deleted successfully"}
