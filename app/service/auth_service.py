from authx import AuthX
from passlib.context import CryptContext

from database.models.user import UserOrm
from database.repository.user_repository import UserRepository
from model.exception import EmailAlreadyExistsException, UserNotFoundException
from model.user import UserCreate, User, UserLogin, UserAuthData


class AuthService:
    def __init__(self, user_repository: UserRepository, auth: AuthX):
        self._context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        self._user_repository = user_repository
        self.auth = auth

    def register_user(self, new_user: UserCreate) -> User:
        if self._user_repository.get_user_by_email(new_user.email) is not None:
            raise EmailAlreadyExistsException("User already exists")

        new_user = UserOrm(
            name=new_user.name,
            surname=new_user.surname,
            email=new_user.email,
            passwordHash=self._get_hashed_password(new_user.password),
            role=new_user.role,
        )
        return self._user_repository.create_user(user = new_user)

    def login_user(self, creds: UserLogin) -> str:
        user = self._user_repository.get_user_auth_data(creds.email)
        if user is None:
            raise UserNotFoundException(f"User with email {creds.email} not found")
        if self._verify_password(creds.password, user.passwordHash):
            return self._create_token(user)
        raise ValueError(f"Auth data is incorrect")


    def _get_hashed_password(self, password: str) -> str:
        return self._context.hash(password)

    def _verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return self._context.verify(plain_password, hashed_password)

    def _create_token(self, user: UserAuthData) -> str:
        return self.auth.create_access_token(
            uid=user.id.__str__(),
            data={
                "role": user.role.name,
            }
        )

