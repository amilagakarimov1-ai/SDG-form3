from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from ..database import get_db
from ..models.task import Task, TaskStatusEnum
from ..models.user import User
from ..models.bin import TrashBin, BinStatusEnum
from ..models.report import ReportTypeEnum
from ..schemas.task import TaskCreate, TaskUpdate, TaskResponse
from ..core.auth import get_current_user, require_role
from ..core.s3 import upload_image

router = APIRouter()

@router.get("", response_model=List[TaskResponse])
def get_my_tasks(db: Session = Depends(get_db), current_user: User = Depends(require_role("municipality_worker"))):
    tasks = db.query(Task).filter(Task.assigned_to == current_user.id).order_by(Task.created_at.desc()).all()
    results = []
    for t in tasks:
        tr = TaskResponse.model_validate(t)
        tr.assignee_name = current_user.full_name
        results.append(tr)
    return results

@router.get("/municipality/{municipality_id}", response_model=List[TaskResponse])
def get_municipality_tasks(municipality_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(require_role("municipality_admin", "superadmin"))):
    tasks = db.query(Task).filter(Task.municipality_id == municipality_id).order_by(Task.created_at.desc()).all()
    results = []
    for t in tasks:
        assignee = db.query(User).filter(User.id == t.assigned_to).first() if t.assigned_to else None
        tr = TaskResponse.model_validate(t)
        if assignee:
            tr.assignee_name = assignee.full_name
        results.append(tr)
    return results

@router.post("", response_model=TaskResponse)
def create_task(task_data: TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(require_role("municipality_admin"))):
    new_task = Task(**task_data.model_dump(), created_by=current_user.id, municipality_id=current_user.municipality_id)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.put("/{task_id}/assign", response_model=TaskResponse)
def assign_task(task_id: UUID, worker_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(require_role("municipality_admin"))):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    worker = db.query(User).filter(User.id == worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
        
    task.assigned_to = worker_id
    task.status = TaskStatusEnum.assigned
    db.commit()
    db.refresh(task)
    
    tr = TaskResponse.model_validate(task)
    tr.assignee_name = worker.full_name
    return tr

@router.put("/{task_id}/accept", response_model=TaskResponse)
def accept_task(task_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(require_role("municipality_worker"))):
    task = db.query(Task).filter(Task.id == task_id, Task.assigned_to == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found or not assigned to you")
        
    task.status = TaskStatusEnum.in_progress
    db.commit()
    db.refresh(task)
    tr = TaskResponse.model_validate(task)
    tr.assignee_name = current_user.full_name
    return tr

@router.put("/{task_id}/resolve", response_model=TaskResponse)
async def resolve_task(
    task_id: UUID, 
    file: UploadFile = File(None),
    db: Session = Depends(get_db), 
    current_user: User = Depends(require_role("municipality_worker"))
):
    task = db.query(Task).filter(Task.id == task_id, Task.assigned_to == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found or not assigned to you")
        
    if file:
        file_bytes = await file.read()
        photo_url = upload_image(file_bytes, file.filename, file.content_type)
        if photo_url:
            task.after_photo_url = photo_url
            
    task.status = TaskStatusEnum.resolved
    task.resolved_at = datetime.utcnow()
    
    # Empty bin if it was a full bin task
    if task.task_type == ReportTypeEnum.full_bin and task.report_id:
        from ..models.report import Report
        report = db.query(Report).filter(Report.id == task.report_id).first()
        if report and report.bin_id:
            bin_obj = db.query(TrashBin).filter(TrashBin.id == report.bin_id).first()
            if bin_obj:
                bin_obj.status = BinStatusEnum.empty
                bin_obj.last_emptied_at = datetime.utcnow()
                
    db.commit()
    db.refresh(task)
    tr = TaskResponse.model_validate(task)
    tr.assignee_name = current_user.full_name
    return tr

@router.put("/{task_id}/close", response_model=TaskResponse)
def close_task(task_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(require_role("municipality_admin"))):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    task.status = TaskStatusEnum.closed
    db.commit()
    db.refresh(task)
    tr = TaskResponse.model_validate(task)
    return tr

@router.get("/stats")
def get_task_stats(db: Session = Depends(get_db), current_user: User = Depends(require_role("municipality_admin", "superadmin"))):
    query = db.query(Task)
    if current_user.municipality_id:
        query = query.filter(Task.municipality_id == current_user.municipality_id)
        
    total = query.count()
    open = query.filter(Task.status.in_([TaskStatusEnum.open, TaskStatusEnum.assigned, TaskStatusEnum.in_progress])).count()
    resolved = query.filter(Task.status == TaskStatusEnum.resolved).count()
    closed = query.filter(Task.status == TaskStatusEnum.closed).count()
    
    return {
        "total": total,
        "open": open,
        "resolved": resolved,
        "closed": closed
    }
