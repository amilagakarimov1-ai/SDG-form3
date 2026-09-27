from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from app.models.coin import TransactionTypeEnum

class CoinTransactionResponse(BaseModel):
    id: UUID
    user_id: UUID
    amount: int
    transaction_type: TransactionTypeEnum
    reference_id: Optional[UUID] = None
    description: Optional[str] = None
    qr_code: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class WalletResponse(BaseModel):
    balance: int
    transactions: List[CoinTransactionResponse]

class QRPaymentRequest(BaseModel):
    qr_code: str
    amount: int

class QRPaymentResponse(BaseModel):
    success: bool
    new_balance: int
    message: str
