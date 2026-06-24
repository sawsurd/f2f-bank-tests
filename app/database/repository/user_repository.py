from typing import List, Optional
from uuid import UUID

from sqlalchemy import select

from database.database import session_factory
from database.models.balance import BalanceOrm
from database.models.user import UserOrm
from model.balance import Balance
from model.user import User, UserAuthData


class UserRepository:

    def __init__(self):
        self._session = session_factory

    def create_user(self, user: UserOrm) -> User:
        with self._session() as session:
            session.add(user)
            session.commit()
            balance = BalanceOrm(user_id=user.id, amount=0.0)
            session.add(balance)
            session.commit()

            session.flush()
            return User.model_validate(user, from_attributes=True)

    def get_users(self) -> List[User]:
        with self._session() as session:
            query = select(UserOrm)
            result = session.execute(query)
            raw_users = list(result.scalars().all())
            return [User.model_validate(user, from_attributes=True) for user in raw_users]

    def get_user_by_email(self, email: str) -> Optional[UserOrm]:
        with self._session() as session:
            statement = select(UserOrm).filter(UserOrm.email == email)
            result = session.execute(statement)
            return result.scalar_one_or_none()

    def get_user_auth_data(self, email: str) -> Optional[UserAuthData]:
        with self._session() as session:
            statement = select(UserOrm).filter(UserOrm.email == email)
            result = session.execute(statement)
            user = result.scalar_one_or_none()
            if user:
                return UserAuthData.model_validate(user, from_attributes=True)
            return None

    def get_user_balance(self, user_id: UUID) -> Optional[Balance]:
        with self._session() as session:
            query = select(BalanceOrm).filter(BalanceOrm.user_id == user_id)
            result = session.execute(query)
            balance = result.scalar_one_or_none()
            if balance:
                return Balance.model_validate(balance, from_attributes=True)
            return None

    def get_user_by_id(self, user_id: UUID) -> Optional[User]:
        with self._session() as session:
            statement = select(UserOrm).filter(UserOrm.id == user_id)
            result = session.execute(statement)
            user = result.scalar_one_or_none()
            if user:
                return User.model_validate(user, from_attributes=True)
            return None
