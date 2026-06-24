from uuid import UUID
from typing import List

from sqlalchemy import select, desc
from sqlalchemy.orm import selectinload

from database.database import session_factory
from database.models.transaction import TransactionOrm
from database.models.user import UserOrm
from model.transaction import Transaction
from model.transaction_status import TransactionStatus
from model.transaction_type import TransactionType


class TransactionRepository:

    def __init__(self):
        self._session = session_factory

    def create_transaction(self, user_id: UUID, amount: float, type: TransactionType) -> Transaction:
        transaction = TransactionOrm(
            user_id = user_id,
            amount = amount,
            transaction_type = type,
            transaction_status = TransactionStatus.PENDING,
        )
        with self._session() as session:
            session.add(transaction)
            session.commit()

            session.flush()
            return Transaction.model_validate(transaction, from_attributes=True)

    def get_transactions_by_user_id(self, user_id: UUID) -> List[Transaction]:
        with self._session() as session:
            query = select(TransactionOrm).filter(TransactionOrm.user_id == user_id).order_by(desc(TransactionOrm.created_at))
            result = session.execute(query)
            raw_transactions = list(result.scalars().all())
            return [Transaction.model_validate(tr, from_attributes=True) for tr in raw_transactions]


    def approve_transaction(self, transaction_id: UUID) -> bool:
        with self._session() as session:
            query = select(TransactionOrm).filter(TransactionOrm.id == transaction_id).options(selectinload(TransactionOrm.user).selectinload(UserOrm.balance))
            transaction = session.execute(query).scalar_one()
            transaction.transaction_status = TransactionStatus.COMPLETED

            balance = transaction.user.balance
            if transaction.transaction_type == TransactionType.DEPOSIT:
                balance.amount += transaction.amount
            if transaction.transaction_type == TransactionType.WITHDRAWAL:
                balance.amount -= transaction.amount
            session.commit()
            return True

    def decline_transaction(self, transaction_id: UUID):
        with self._session() as session:
            query = select(TransactionOrm).filter(TransactionOrm.id == transaction_id)
            transaction = session.execute(query).scalar_one()
            transaction.transaction_status = TransactionStatus.FAILED
            session.commit()

    def get_transactions(self, limit) -> List[Transaction]:
        with self._session() as session:
            query = select(TransactionOrm).limit(limit)
            result = session.execute(query)
            raw_transactions = list(result.scalars().all())
            return [Transaction.model_validate(tr, from_attributes=True) for tr in raw_transactions]