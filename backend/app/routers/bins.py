from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from datetime import datetime
from ..database import get_db
from ..models.bin import TrashBin, BinStatusEnum
from ..schemas.bin import BinCreate, BinUpdate, BinResponse, BinMapResponse
from ..core.auth import require_role

router = APIRouter()

def get_color_code(status: BinStatusEnum) -> str:
    if status in [BinStatusEnum.full, BinStatusEnum.overflowing]:
        return "red"
    elif status == BinStatusEnum.half_full:
        return "yellow"
    return "green"

@router.get("/map", response_model=List[BinMapResponse])
def get_all_bins_map(db: Session = Depends(get_db)):
    bins = db.query(TrashBin).all()
    results = []
    for b in bins:
        results.append(BinMapResponse(
            id=b.id,
            latitude=b.latitude,
            longitude=b.longitude,
            status=b.status,
            color_code=get_color_code(b.status),
            name=b.name
        ))
    return results

@router.get("/map/municipality/{municipality_id}", response_model=List[BinMapResponse])
def get_municipality_bins_map(municipality_id: UUID, db: Session = Depends(get_db)):
    bins = db.query(TrashBin).filter(TrashBin.municipality_id == municipality_id).all()
    results = []
    for b in bins:
        results.append(BinMapResponse(
            id=b.id,
            latitude=b.latitude,
            longitude=b.longitude,
            status=b.status,
            color_code=get_color_code(b.status),
            name=b.name
        ))
    return results

@router.post("", response_model=BinResponse)
def create_bin(bin_data: BinCreate, db: Session = Depends(get_db), current_user = Depends(require_role("municipality_admin", "superadmin"))):
    new_bin = TrashBin(**bin_data.model_dump())
    db.add(new_bin)
    db.commit()
    db.refresh(new_bin)
    response = BinResponse.model_validate(new_bin)
    response.color_code = get_color_code(new_bin.status)
    return response

@router.put("/{bin_id}", response_model=BinResponse)
def update_bin(bin_id: UUID, bin_data: BinUpdate, db: Session = Depends(get_db), current_user = Depends(require_role("municipality_admin", "municipality_worker"))):
    b = db.query(TrashBin).filter(TrashBin.id == bin_id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Bin not found")
    
    if bin_data.status:
        b.status = bin_data.status
    if bin_data.last_emptied_at:
        b.last_emptied_at = bin_data.last_emptied_at
        if bin_data.status is None:
            b.status = BinStatusEnum.empty
            
    db.commit()
    db.refresh(b)
    
    response = BinResponse.model_validate(b)
    response.color_code = get_color_code(b.status)
    return response

@router.get("/{bin_id}/history")
def get_bin_history(bin_id: UUID, db: Session = Depends(get_db)):
    from ..models.report import Report
    reports = db.query(Report).filter(Report.bin_id == bin_id).order_by(Report.created_at.desc()).all()
    return reports

@router.get("/stats")
def get_bin_stats(db: Session = Depends(get_db)):
    total = db.query(TrashBin).count()
    full = db.query(TrashBin).filter(TrashBin.status.in_([BinStatusEnum.full, BinStatusEnum.overflowing])).count()
    return {
        "total_bins": total,
        "full_bins": full,
        "empty_bins": total - full
    }
