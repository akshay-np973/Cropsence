import os
import httpx
from fastapi import APIRouter, HTTPException, Query

router = APIRouter()

@router.get("/weather")
async def get_weather(city: str = Query(..., min_length=1)):
    api_key = os.getenv("OPENWEATHERMAP_API_KEY", "")
    if not api_key or api_key == "your_openweathermap_key_here":
        raise HTTPException(
            status_code=503,
            detail="Weather API key not configured. Set OPENWEATHERMAP_API_KEY in backend/.env"
        )

    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {"q": city, "appid": api_key, "units": "metric"}

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            resp = await client.get(url, params=params)
            if resp.status_code == 404:
                raise HTTPException(status_code=404, detail=f"City '{city}' not found")
            if resp.status_code == 401:
                raise HTTPException(status_code=503, detail="Invalid weather API key")
            resp.raise_for_status()
            data = resp.json()
            return {
                "city": data["name"],
                "country": data["sys"]["country"],
                "temperature": round(data["main"]["temp"], 1),
                "humidity": data["main"]["humidity"],
                "description": data["weather"][0]["description"],
                "updated_at": None,
            }
        except httpx.TimeoutException:
            raise HTTPException(status_code=504, detail="Weather service timeout")
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Weather service error: {str(e)}")
