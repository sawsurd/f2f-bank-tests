from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, relationship
from sqlalchemy.orm import mapped_column

from database.database import Base
from database.models.types import uuid_pk, created_dt, updated_dt
from model.transaction_status import TransactionStatus
from model.transaction_type import TransactionType


class TransactionOrm(Base):
    __tablename__ = "transaction"

    id: Mapped[uuid_pk]
    user_id: Mapped[UUID] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"))
    created_at: Mapped[created_dt]
    updated_at: Mapped[updated_dt]
    amount: Mapped[float]
    transaction_type: Mapped[TransactionType]
    transaction_status: Mapped[TransactionStatus]

    user: Mapped["UserOrm"] = relationship(
        back_populates="transactions"
    )
