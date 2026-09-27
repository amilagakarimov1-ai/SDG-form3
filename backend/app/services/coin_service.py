from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from uuid import UUID
from ..models.coin import GreenCoin, TransactionTypeEnum
from ..models.partner import Partner
from ..schemas.coin import WalletResponse, QRPaymentResponse
import uuid
import json

def award_coins(user_id: UUID, amount: int, transaction_type: TransactionTypeEnum, reference_id: UUID, description: str, db: Session):
    coin = GreenCoin(
        user_id=user_id,
        amount=amount,
        transaction_type=transaction_type,
        reference_id=reference_id,
        description=description
    )
    db.add(coin)
    db.commit()
    db.refresh(coin)
    return coin

def get_wallet(user_id: UUID, db: Session) -> WalletResponse:
    transactions = db.query(GreenCoin).filter(GreenCoin.user_id == user_id).order_by(GreenCoin.created_at.desc()).all()
    balance = db.query(func.sum(GreenCoin.amount)).filter(GreenCoin.user_id == user_id).scalar() or 0
    return WalletResponse(balance=balance, transactions=transactions)

def spend_coins_qr(user_id: UUID, qr_code: str, amount: int, db: Session) -> QRPaymentResponse:
    try:
        qr_data = json.loads(qr_code)
        partner_id = uuid.UUID(qr_data.get("partner_id"))
        secret = qr_data.get("secret")
        
        partner = db.query(Partner).filter(Partner.id == partner_id, Partner.qr_secret == secret).first()
        if not partner:
            return QRPaymentResponse(success=False, new_balance=0, message="Invalid QR code")
        
        balance = db.query(func.sum(GreenCoin.amount)).filter(GreenCoin.user_id == user_id).scalar() or 0
        if balance < amount:
            return QRPaymentResponse(success=False, new_balance=balance, message="Insufficient balance")
            
        coin = GreenCoin(
            user_id=user_id,
            amount=-amount,
            transaction_type=TransactionTypeEnum.spent_partner,
            reference_id=partner.id,
            description=f"Spent at {partner.name}"
        )
        db.add(coin)
        db.commit()
        
        new_balance = balance - amount
        return QRPaymentResponse(success=True, new_balance=new_balance, message="Payment successful")
    except Exception as e:
        return QRPaymentResponse(success=False, new_balance=0, message=str(e))

def generate_ev_qr(user_id: UUID, station_id: str, amount: int, db: Session) -> str:
    # Generates a QR code data payload for EV charging
    qr_data = {
        "user_id": str(user_id),
        "station_id": station_id,
        "amount": amount,
        "type": "ev_charge",
        "nonce": str(uuid.uuid4())
    }
    return json.dumps(qr_data)
