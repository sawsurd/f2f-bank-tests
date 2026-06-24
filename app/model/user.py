from uuid import UUID

from pydantic import BaseModel

from model.balance import Balance
from model.user_role import UserRole

class UserCreate(BaseModel):
    name: str
    surname: str
    email: str
    password: str
    role: UserRole = UserRole.USER

class User(BaseModel):
    id: UUID
    name: str
    surname: str
    email: str
    role: UserRole

class UserWithBalance(Balance):
    balance: Balance

class UserAuthData(BaseModel):
    id: UUID
    email: str
    passwordHash: str
    role: UserRole

class UserLogin(BaseModel):
    email: str
    password: str

class UserToken(BaseModel):
    token: str