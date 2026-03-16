from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.models.task import Priority


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    scheduled_date: date
    scheduled_time: Optional[datetime] = None
    end_date: Optional[date] = None  # last day for multi-day tasks
    description: Optional[str] = None
    priority: Optional[Priority] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    scheduled_date: Optional[date] = None
    scheduled_time: Optional[datetime] = None
    end_date: Optional[date] = None  # last day for multi-day tasks (inclusive)
    is_complete: Optional[bool] = None
    description: Optional[str] = None
    priority: Optional[Priority] = None
    is_locked: Optional[bool] = None


class TaskResponse(BaseModel):
    id: str
    title: str
    scheduled_date: date
    is_complete: bool
    completed_at: Optional[datetime]
    description: Optional[str]
    priority: Optional[Priority]
    scheduled_time: Optional[datetime]
    due_date: Optional[date]
    ai_notes: Optional[str]
    is_locked: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
