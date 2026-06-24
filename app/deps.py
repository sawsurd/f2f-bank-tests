from datetime import timedelta

from authx import AuthXConfig, AuthX

from config import settings
from database.repository.transaction_repository import TransactionRepository
from database.repository.user_repository import UserRepository
from service.auth_service import AuthService
from service.user_service import UserService

auth_config = AuthXConfig(
    JWT_SECRET_KEY= settings.JWT_SECRET_KEY,
    JWT_ACCESS_COOKIE_NAME = "access_token",
    JWT_TOKEN_LOCATION = ["cookies"],
    JWT_ACCESS_TOKEN_EXPIRES= timedelta(minutes=30),
    JWT_COOKIE_CSRF_PROTECT=False
)

auth = AuthX(config=auth_config)

user_repository = UserRepository()
transaction_repository = TransactionRepository()

user_service = UserService(user_repository, transaction_repository)
auth_service = AuthService(user_repository, auth)

def get_user_service() -> UserService:
    return user_service

def get_auth_service() -> AuthService:
    return auth_service