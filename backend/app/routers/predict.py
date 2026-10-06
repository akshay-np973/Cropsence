import json
import warnings
import numpy as np
from fastapi import APIRouter, Request, HTTPException
from app.schemas import PredictRequest, PredictResponse, AssistRequest, AssistResponse, AlternativeCrop
from app.database import get_db
from app.services import get_explanation, extract_values_from_text

router = APIRouter()

@router.post("/predict", response_model=PredictResponse)
async def predict(req: PredictRequest, request: Request):
    model = request.app.state.model
    scaler = request.app.state.scaler

    # Build feature array: [N, P, K, temperature, humidity, ph, rainfall]
    features = np.array([[
        req.nitrogen, req.phosphorus, req.potassium,
        req.temperature, req.humidity, req.ph, req.rainfall
    ]])

    import pandas as pd
    feature_names = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
    features_df = pd.DataFrame(features, columns=feature_names)

    with warnings.catch_warnings():
        warnings.simplefilter("ignore")
        scaled = scaler.transform(features_df)
        crop = model.predict(scaled)[0]
        probas = model.predict_proba(scaled)[0]
        classes = model.classes_

    # Confidence = probability of top predicted class
    crop_idx = list(classes).index(crop)
    confidence = float(probas[crop_idx])

    # Top 3 alternatives (excluding the predicted crop)
    sorted_crops = sorted(
        [(c, float(p)) for c, p in zip(classes, probas) if c != crop],
        key=lambda x: x[1], reverse=True
    )
    alternatives = [
        AlternativeCrop(crop=c, probability=round(p * 100, 1))
        for c, p in sorted_crops[:3]
        if p > 0.01
    ]

    # Get AI explanation
    inputs_dict = {
        "nitrogen": req.nitrogen, "phosphorus": req.phosphorus,
        "potassium": req.potassium, "temperature": req.temperature,
        "humidity": req.humidity, "ph": req.ph, "rainfall": req.rainfall,
    }
    explanation = await get_explanation(crop, confidence * 100, inputs_dict)

    # Save to DB
    prediction_id = None
    if req.save:
        async for db in get_db():
            cursor = await db.execute(
                """
                INSERT INTO predictions
                (nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall,
                 crop, confidence, explanation, alternatives)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    req.nitrogen, req.phosphorus, req.potassium,
                    req.temperature, req.humidity, req.ph, req.rainfall,
                    crop, round(confidence * 100, 1), explanation,
                    json.dumps([a.dict() for a in alternatives])
                )
            )
            await db.commit()
            prediction_id = cursor.lastrowid

    return PredictResponse(
        id=prediction_id,
        crop=crop,
        confidence=round(confidence * 100, 1),
        explanation=explanation,
        alternatives=alternatives,
        inputs=inputs_dict,
    )

@router.post("/predict/assist", response_model=AssistResponse)
async def assist(req: AssistRequest):
    result = await extract_values_from_text(req.description)
    return result
