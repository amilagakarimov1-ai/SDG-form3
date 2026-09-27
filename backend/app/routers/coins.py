from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from typing import List
from ..database import get_db
from ..models.user import User, RoleEnum
from ..models.coin import GreenCoin
from ..models.partner import Partner
from ..schemas.coin import WalletResponse, QRPaymentRequest, QRPaymentResponse
from ..core.auth import get_current_user
from ..services.coin_service import get_wallet, spend_coins_qr, generate_ev_qr
from pydantic import BaseModel

router = APIRouter()

class EVGenerateRequest(BaseModel):
    station_id: str
    amount: int

@router.get("/wallet", response_model=WalletResponse)
def get_my_wallet(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_wallet(current_user.id, db)

@router.get("/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    # Simple leaderboard based on total earned coins
    results = db.query(
        GreenCoin.user_id,
        User.full_name,
        func.sum(GreenCoin.amount).label("total_earned")
    ).join(User, GreenCoin.user_id == User.id)\
    .filter(GreenCoin.amount > 0, User.role == RoleEnum.citizen)\
    .group_by(GreenCoin.user_id, User.full_name)\
    .order_by(func.sum(GreenCoin.amount).desc())\
    .limit(20).all()
    
    return [{"user_id": r.user_id, "name": r.full_name, "points": r.total_earned} for r in results]

@router.post("/spend/qr", response_model=QRPaymentResponse)
def spend_via_qr(request: QRPaymentRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return spend_coins_qr(current_user.id, request.qr_code, request.amount, db)

@router.get("/partners")
def list_partners(db: Session = Depends(get_db)):
    partners = db.query(Partner).filter(Partner.is_active == True).all()
    return [{"id": p.id, "name": p.name, "type": p.partner_type.value, "discount_percent": p.discount_percent, "lat": p.latitude, "lng": p.longitude} for p in partners]

@router.post("/ev/generate-qr")
def generate_ev_payment_qr(request: EVGenerateRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    qr_data = generate_ev_qr(current_user.id, request.station_id, request.amount, db)
    return {"qr_code_data": qr_data}
