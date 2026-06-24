from typing import List
from uuid import UUID

from authx import TokenPayload
from fastapi import APIRouter, Depends, HTTPException, Body

from deps import get_user_service, auth
from model.balance import Balance
from model.transaction import Transaction
from model.user import User
from service.user_service import UserService

router = APIRouter(prefix="/api/users", tags=["User"])

@router.get(
    path="/current",
    description="Получение текущего пользователя",
    response_model=User
)
def get_current_user(user_service: UserService = Depends(get_user_service), payload: TokenPayload = Depends(auth.access_token_required)):
    id_from_token = payload.sub
    return user_service.get_user_by_id(UUID(id_from_token))

@router.get(
    path="/balance",
    description="Получение баланса пользователя",
    response_model=Balance
)
def get_balance(user_service: UserService = Depends(get_user_service), payload: TokenPayload = Depends(auth.access_token_required)):
    id_from_token = payload.sub
    return user_service.get_user_balance(UUID(id_from_token))

@router.post(
    path="/balance/add",
    description="Пополнение баланса",
)
def add_money_to_balance(amount: float = Body(..., embed=True), user_service: UserService = Depends(get_user_service), payload: TokenPayload = Depends(auth.access_token_required)):
    id_from_token = payload.sub
    try:
        user_service.add_money_to_balance(UUID(id_from_token), amount)
        return {"result": "ok"}
    except ValueError as e:
        raise HTTPException(400, str(e))

@router.get(
    path="/transactions",
    description="Получение всех транзакций текущего пользователя",
    response_model=List[Transaction]
)
def get_user_transactions(user_service: UserService = Depends(get_user_service), payload: TokenPayload = Depends(auth.access_token_required)):
    id_from_token = payload.sub
    return user_service.get_user_transactions(UUID(id_from_token))

@router.post(
    path="/transfer",
    description="Перевод по СБП",
)
def transfer(
    phone: str = Body(...),
    amount: float = Body(...),
    purpose: str = Body(...),
    user_service: UserService = Depends(get_user_service),
    payload: TokenPayload = Depends(auth.access_token_required),
):
    id_from_token = payload.sub
    try:
        user_service.withdraw(UUID(id_from_token), amount, phone)
        return {"result": "ok"}
    except ValueError as e:
        raise HTTPException(400, str(e))

