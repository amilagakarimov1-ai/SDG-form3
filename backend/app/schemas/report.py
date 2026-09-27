from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID
from app.models.report import ReportTypeEnum, AIVerdictEnum, ReportStatusEnum

class ReportCreate(BaseModel):
    report_type: ReportTypeEnum
    latitude: float
    longitude: float
    bin_id: Optional[UUID] = None
    description: Optional[str] = None

class AIAnalysisResult(BaseModel):
    verdict: AIVerdictEnum
    confidence: float
    message: str

class ReportResponse(BaseModel):
    id: UUID
    reporter_id: UUID
    bin_id: Optional[UUID] = None
    report_type: ReportTypeEnum
    photo_url: str
    latitude: float
    longitude: float
    description: Optional[str] = None
    ai_confidence: Optional[float] = None
    ai_verdict: Optional[AIVerdictEnum] = None
    coins_awarded: int
    status: ReportStatusEnum
    created_at: datetime

    class Config:
        from_attributes = True
