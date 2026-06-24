
from datetime import datetime

from pydantic import BaseModel
from uuid import UUID

from model.transaction_status import TransactionStatus
from model.transaction_type import TransactionType

class TransactionCreate(BaseModel):
    user_id: UUID
    amount: float
    type: TransactionType

class Transaction(BaseModel):
    id: UUID
    user_id: UUID
    amount: float
    transaction_status: TransactionStatus
    created_at: datetime
    updated_at: datetime
    transaction_type: TransactionType
