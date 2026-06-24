from sqlalchemy.orm import Mapped, relationship

from database.database import Base
from database.models.types import str_50, uuid_pk, str_256

from model.user_role import UserRole

class UserOrm(Base):
    __tablename__ = "user"

    id: Mapped[uuid_pk]
    name: Mapped[str_50]
    surname: Mapped[str_256]
    email: Mapped[str_50]
    passwordHash: Mapped[str]
    role: Mapped[UserRole]
    balance: Mapped["BalanceOrm"] = relationship(
        back_populates="user",
    )

    transactions: Mapped[list["TransactionOrm"]] = relationship(
        back_populates="user",
    )


