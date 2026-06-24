from uuid import UUID

from pydantic import BaseModel


class Balance(BaseModel):
    id: UUID
    user_id: UUID
    amount: float

