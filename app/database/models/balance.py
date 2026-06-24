from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, relationship
from sqlalchemy.testing.schema import mapped_column

from database.database import Base
from database.models.types import uuid_pk


class BalanceOrm(Base):
    __tablename__ = "balance"

    id: Mapped[uuid_pk]
    user_id: Mapped[UUID] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"))
    amount: Mapped[float] = mapped_column(default=0.0)

    user: Mapped["UserOrm"] = relationship(back_populates="balance")