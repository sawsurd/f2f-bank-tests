import re
from uuid import UUID

from database.repository.user_repository import UserRepository
from typing import List, Optional

from model.balance import Balance
from model.transaction import Transaction
from model.transaction_type import TransactionType
from model.user import User

class UserService:
    def __init__(self, user_repository: UserRepository, transaction_repository):
        self._user_repository = user_repository
        self._transaction_repository = transaction_repository

    def get_users(self) -> List[User]:
        return self._user_repository.get_users()

    def get_user_by_id(self, user_id: UUID) -> Optional[User]:
        return self._user_repository.get_user_by_id(user_id)

    def add_money_to_balance(self, user_id: UUID, amount: float):
        if amount <= 0:
            raise ValueError("Amount must be greater than zero")
        transaction_result = self._transaction_repository.create_transaction(
            user_id=user_id,
            amount=amount,
            type=TransactionType.DEPOSIT
        )
        self._transaction_repository.approve_transaction(transaction_result.id)

    def withdraw(self, user_id: UUID, amount: float, phone: str):
        if amount <= 0:
            raise ValueError("Amount must be greater than zero")
        phone = phone.strip()
        digits = re.sub(r'\D', '', phone)
        if not phone.startswith('+') or not (10 <= len(digits) <= 15):
            raise ValueError("Invalid phone number format")
        balance = self.get_user_balance(user_id)
        if balance is None or balance.amount < amount:
            raise ValueError("Insufficient funds")
        transaction_result = self._transaction_repository.create_transaction(
            user_id=user_id,
            amount=amount,
            type=TransactionType.WITHDRAWAL,
        )
        self._transaction_repository.approve_transaction(transaction_result.id)

    def get_user_transactions(self, user_id: UUID) -> List[Transaction]:
        return self._transaction_repository.get_transactions_by_user_id(user_id)

    def get_user_balance(self, user_id: UUID) -> Optional[Balance]:
        return self._user_repository.get_user_balance(user_id)

