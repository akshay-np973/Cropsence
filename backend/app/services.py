import os
import json
from typing import Optional
from groq import AsyncGroq

CROP_EMOJI = {
    "rice": "🌾", "maize": "🌽", "chickpea": "🫘", "kidneybeans": "🫘",
    "pigeonpeas": "🌱", "mothbeans": "🌱", "mungbean": "🌱", "blackgram": "🌱",
    "lentil": "🌱", "pomegranate": "🍎", "banana": "🍌", "mango": "🥭",
    "grapes": "🍇", "watermelon": "🍉", "muskmelon": "🍈", "apple": "🍎",
    "orange": "🍊", "papaya": "🍈", "coconut": "🥥", "cotton": "🌿",
    "jute": "🌿", "coffee": "☕",
}

async def get_explanation(crop: str, confidence: float, inputs: dict) -> Optional[str]:
    """Generate AI explanation for the crop recommendation using Groq."""
    api_key = os.getenv("GROQ_API_KEY", "")
    if not api_key or api_key == "your_groq_api_key_here":
        return None

    try:
        client = AsyncGroq(api_key=api_key)
        prompt = f"""A machine learning model (BaggingClassifier with DecisionTree base) recommended **{crop}** as the best crop based on these soil and environmental conditions:

- Nitrogen (N): {inputs['nitrogen']} mg/kg
- Phosphorus (P): {inputs['phosphorus']} mg/kg  
- Potassium (K): {inputs['potassium']} mg/kg
- Temperature: {inputs['temperature']}°C
- Humidity: {inputs['humidity']}%
- Soil pH: {inputs['ph']}
- Rainfall: {inputs['rainfall']} mm

The model's confidence was {confidence:.1f}%.

Write a brief 2-3 sentence explanation (in plain language suitable for farmers) explaining why these conditions are suitable for {crop} cultivation. Focus on which specific conditions are most relevant. Do NOT invent measurements or make claims the ML model didn't make. Do NOT say this is the "perfect" or "ideal" crop — just explain what conditions align with it."""

        chat = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=200,
        )
        return chat.choices[0].message.content.strip()
    except Exception:
        return None

async def extract_values_from_text(description: str) -> dict:
    """Use Groq to extract numeric soil/weather values from natural language description."""
    api_key = os.getenv("GROQ_API_KEY", "")
    if not api_key or api_key == "your_groq_api_key_here":
        return {
            "nitrogen": None, "phosphorus": None, "potassium": None,
            "temperature": None, "humidity": None, "ph": None, "rainfall": None,
            "missing": ["all"],
        }

    try:
        client = AsyncGroq(api_key=api_key)
        prompt = f"""Extract ONLY explicitly stated numeric values from this text for these fields:
- nitrogen (N, mg/kg)
- phosphorus (P, mg/kg)
- potassium (K, mg/kg)
- temperature (°C)
- humidity (%)
- ph (soil pH, 0-14)
- rainfall (mm)

Text: \"{description}\"

Rules:
1. Only extract values that are EXPLICITLY stated as numbers. Do NOT guess or infer.
2. If a value is not explicitly given, set it to null.
3. Return ONLY a valid JSON object with these keys: nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall.
4. Also include a "missing" array listing field names that are null.

JSON only, no other text:"""

        chat = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.0,
            max_tokens=200,
        )
        raw = chat.choices[0].message.content.strip()
        # Extract JSON from response
        if "```" in raw:
            raw = raw.split("```")[1].replace("json", "").strip()
        data = json.loads(raw)
        missing = [k for k, v in data.items() if k != "missing" and v is None]
        data["missing"] = missing
        return data
    except Exception:
        return {
            "nitrogen": None, "phosphorus": None, "potassium": None,
            "temperature": None, "humidity": None, "ph": None, "rainfall": None,
            "missing": ["nitrogen", "phosphorus", "potassium", "temperature", "humidity", "ph", "rainfall"],
        }
