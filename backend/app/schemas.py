from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class PredictRequest(BaseModel):
    nitrogen: float = Field(..., ge=0, le=500, description="N mg/kg")
    phosphorus: float = Field(..., ge=0, le=500, description="P mg/kg")
    potassium: float = Field(..., ge=0, le=500, description="K mg/kg")
    temperature: float = Field(..., ge=-10, le=60, description="°C")
    humidity: float = Field(..., ge=0, le=100, description="%")
    ph: float = Field(..., ge=0, le=14, description="Soil pH")
    rainfall: float = Field(..., ge=0, le=500, description="mm")
    save: bool = Field(True, description="Save to history")

class AlternativeCrop(BaseModel):
    crop: str
    probability: float

class PredictResponse(BaseModel):
    id: Optional[int] = None
    crop: str
    confidence: float
    explanation: Optional[str] = None
    alternatives: List[AlternativeCrop] = []
    inputs: dict

class PredictionRecord(BaseModel):
    id: int
    nitrogen: float
    phosphorus: float
    potassium: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float
    crop: str
    confidence: float
    explanation: Optional[str] = None
    alternatives: List[AlternativeCrop] = []
    created_at: str

class AssistRequest(BaseModel):
    description: str

class AssistResponse(BaseModel):
    nitrogen: Optional[float] = None
    phosphorus: Optional[float] = None
    potassium: Optional[float] = None
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    ph: Optional[float] = None
    rainfall: Optional[float] = None
    missing: List[str] = []
