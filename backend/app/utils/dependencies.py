from fastapi import Depends, Header
from jose import JWTError
from sqlmodel.ext.asyncio.session import AsyncSession

from app.db.session import get_session
from app.interface.refresh_token_repository import IRefreshTokenRepository
from app.interface.user_repository import IUserRepository
from app.models.user import User
from app.repositories.refresh_token_repository import RefreshTokenRepository
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService
from app.utils.exceptions import InvalidSessionError
from app.utils.security import decode_access_token

REFRESH_TOKEN_COOKIE = "refresh_token"


def get_user_repository(session: AsyncSession = Depends(get_session)) -> IUserRepository:
    return UserRepository(session)


def get_refresh_token_repository(session: AsyncSession = Depends(get_session)) -> IRefreshTokenRepository:
    return RefreshTokenRepository(session)


def get_auth_service(
    user_repository: IUserRepository = Depends(get_user_repository),
    refresh_token_repository: IRefreshTokenRepository = Depends(get_refresh_token_repository),
) -> AuthService:
    return AuthService(user_repository, refresh_token_repository)


async def get_current_user(
    authorization: str | None = Header(default=None),
    user_repository: IUserRepository = Depends(get_user_repository),
) -> User:
    if authorization is None or not authorization.startswith("Bearer "):
        raise InvalidSessionError("Aucune session active.")

    token = authorization.removeprefix("Bearer ").strip()

    try:
        payload = decode_access_token(token)
    except JWTError as exc:
        raise InvalidSessionError("Session invalide ou expirée.") from exc

    user = await user_repository.get_by_id(payload["sub"])
    if user is None or not user.is_active:
        raise InvalidSessionError("Session invalide ou expirée.")

    return user
