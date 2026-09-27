from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from ..database import get_db
from ..models.report import Report, ReportTypeEnum, ReportStatusEnum, AIVerdictEnum
from ..models.bin import TrashBin, BinStatusEnum
from ..models.task import Task, PriorityEnum
from ..models.user import User
from ..models.coin import TransactionTypeEnum
from ..schemas.report import ReportResponse, ReportCreate
from ..core.auth import get_current_user
from ..core.s3 import upload_image
from ..services.ai_service import analyze_bin_image, analyze_city_problem
from ..services.coin_service import award_coins
import json

router = APIRouter()

@router.post("", response_model=ReportResponse)
async def create_report(
    file: UploadFile = File(...),
    data: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        report_data = json.loads(data)
        report_create = ReportCreate(**report_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid JSON data in form")

    # Upload to S3
    file_bytes = await file.read()
    photo_url = upload_image(file_bytes, file.filename, file.content_type)
    if not photo_url:
        raise HTTPException(status_code=500, detail="Failed to upload image")

    # AI Analysis
    if report_create.report_type == ReportTypeEnum.full_bin:
        ai_result = analyze_bin_image(photo_url)
    else:
        ai_result = analyze_city_problem(photo_url, report_create.report_type.value)

    new_report = Report(
        reporter_id=current_user.id,
        bin_id=report_create.bin_id,
        report_type=report_create.report_type,
        photo_url=photo_url,
        latitude=report_create.latitude,
        longitude=report_create.longitude,
        description=report_create.description,
        ai_confidence=ai_result.confidence,
        ai_verdict=ai_result.verdict,
        status=ReportStatusEnum.pending_ai
    )

    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    # Process confirmed reports
    if ai_result.verdict == AIVerdictEnum.confirmed:
        new_report.status = ReportStatusEnum.task_created
        
        # Award coins
        coins_to_award = 25
        award_coins(current_user.id, coins_to_award, TransactionTypeEnum.earned_report, new_report.id, f"Report {report_create.report_type.value} confirmed", db)
        new_report.coins_awarded = coins_to_award
        
        # Create Task
        priority = PriorityEnum.high if report_create.report_type == ReportTypeEnum.full_bin else PriorityEnum.medium
        new_task = Task(
            report_id=new_report.id,
            title=f"Fix: {report_create.report_type.value}",
            description=report_create.description,
            task_type=report_create.report_type,
            priority=priority,
            before_photo_url=photo_url,
            latitude=report_create.latitude,
            longitude=report_create.longitude
        )
        db.add(new_task)
        
        # Update Bin if applicable
        if report_create.bin_id and report_create.report_type == ReportTypeEnum.full_bin:
            bin_obj = db.query(TrashBin).filter(TrashBin.id == report_create.bin_id).first()
            if bin_obj:
                bin_obj.status = BinStatusEnum.full
                new_task.municipality_id = bin_obj.municipality_id
                
        db.commit()
        db.refresh(new_report)
    elif ai_result.verdict == AIVerdictEnum.rejected:
        new_report.status = ReportStatusEnum.rejected
        db.commit()
        
    return new_report

@router.get("", response_model=List[ReportResponse])
def get_reports(status: Optional[str] = None, report_type: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Report)
    if status:
        query = query.filter(Report.status == status)
    if report_type:
        query = query.filter(Report.report_type == report_type)
    return query.order_by(Report.created_at.desc()).all()

@router.get("/my", response_model=List[ReportResponse])
def get_my_reports(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Report).filter(Report.reporter_id == current_user.id).order_by(Report.created_at.desc()).all()

@router.get("/{report_id}", response_model=ReportResponse)
def get_report(report_id: UUID, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report
