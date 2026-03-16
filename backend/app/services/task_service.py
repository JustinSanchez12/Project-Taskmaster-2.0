from datetime import date, datetime, timezone
from typing import Optional

from sqlalchemy import and_, or_
from sqlalchemy.orm import Session

from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate


def utcnow() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


class TaskService:
    def __init__(self, db: Session):
        self.db = db

    def list_tasks(
        self,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
    ) -> list[Task]:
        query = self.db.query(Task)
        if start_date:
            # Include multi-day tasks whose due_date reaches into the query window
            query = query.filter(
                or_(Task.due_date >= start_date, Task.due_date.is_(None))
            )
            query = query.filter(Task.scheduled_date >= start_date)
        if end_date:
            query = query.filter(Task.scheduled_date <= end_date)
        # Sort by date, then time-specific tasks first (NULLs last), then creation order
        return query.order_by(
            Task.scheduled_date,
            Task.scheduled_time.nulls_last(),
            Task.created_at,
        ).all()

    def get_task(self, task_id: str) -> Optional[Task]:
        return self.db.query(Task).filter(Task.id == task_id).first()

    def create_task(self, payload: TaskCreate) -> Task:
        task = Task(
            title=payload.title,
            scheduled_date=payload.scheduled_date,
            scheduled_time=payload.scheduled_time,
            scheduled_end_time=payload.scheduled_end_time,
            due_date=payload.end_date,  # end_date in schema maps to due_date column
            description=payload.description,
            priority=payload.priority,
        )
        self.db.add(task)
        self.db.commit()
        self.db.refresh(task)
        return task

    def update_task(self, task_id: str, payload: TaskUpdate) -> Optional[Task]:
        task = self.get_task(task_id)
        if not task:
            return None

        update_data = payload.model_dump(exclude_unset=True)

        # Map schema field end_date → ORM column due_date
        if "end_date" in update_data:
            update_data["due_date"] = update_data.pop("end_date")

        # Auto-set completed_at when marking complete
        if "is_complete" in update_data:
            if update_data["is_complete"] and not task.completed_at:
                update_data["completed_at"] = utcnow()
            elif not update_data["is_complete"]:
                update_data["completed_at"] = None

        for field, value in update_data.items():
            setattr(task, field, value)

        self.db.commit()
        self.db.refresh(task)
        return task

    def delete_task(self, task_id: str) -> bool:
        task = self.get_task(task_id)
        if not task:
            return False
        self.db.delete(task)
        self.db.commit()
        return True
