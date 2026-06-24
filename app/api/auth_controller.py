from fastapi import APIRouter, Depends, HTTPException, status, Response

from deps import get_auth_service, auth_config, auth
from model.exception import EmailAlreadyExistsException, UserNotFoundException
from model.user import UserCreate, UserLogin, User, UserToken
from service.auth_service import AuthService

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post(
    path="/register",
    description="Регистрация пользователя в системе",
    status_code=status.HTTP_201_CREATED,
    response_model=User,
)
def register_user(user: UserCreate, auth_service: AuthService = Depends(get_auth_service)):
    try:
        return auth_service.register_user(user)
    except EmailAlreadyExistsException:
        raise HTTPException(400, "User with this email already exists")


@router.post(
    path="/login",
    description="Авторизация пользователя",
    response_model=UserToken
)
def login_user(creds: UserLogin, response: Response, auth_service: AuthService = Depends(get_auth_service)):
    try:
      token = UserToken(token=auth_service.login_user(creds))
      response.set_cookie(auth_config.JWT_ACCESS_COOKIE_NAME, token.token)
      return token
    except (UserNotFoundException, ValueError):
        raise HTTPException(401, "Invalid email or password")


@router.get(path="/logout",
            description="Выход пользователя из системы",
            dependencies=[Depends(auth.access_token_required)])
def logout(response: Response):
    response.delete_cookie(auth_config.JWT_ACCESS_COOKIE_NAME)
    return {"result": "ok"}
