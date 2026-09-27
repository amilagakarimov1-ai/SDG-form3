from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID
from app.models.task import PriorityEnum, TaskStatusEnum
from app.models.report import ReportTypeEnum

class TaskCreate(BaseModel):
    report_id: Optional[UUID] = None
    title: str
    description: Optional[str] = None
    task_type: ReportTypeEnum
    priority: PriorityEnum
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    due_date: Optional[datetime] = None
    assigned_to: Optional[UUID] = None

class TaskUpdate(BaseModel):
    status: TaskStatusEnum
    after_photo_url: Optional[str] = None

class TaskResponse(BaseModel):
    id: UUID
    report_id: Optional[UUID] = None
    assigned_to: Optional[UUID] = None
    created_by: Optional[UUID] = None
    municipality_id: Optional[UUID] = None
    title: str
    description: Optional[str] = None
    task_type: ReportTypeEnum
    priority: PriorityEnum
    status: TaskStatusEnum
    before_photo_url: Optional[str] = None
    after_photo_url: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    due_date: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    assignee_name: Optional[str] = None

    class Config:
        from_attributes = True
