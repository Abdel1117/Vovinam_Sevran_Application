import uuid
from datetime import datetime, timedelta, timezone

from jose import JWTError

from app.config import get_settings
from app.interface.refresh_token_repository import IRefreshTokenRepository
from app.interface.user_repository import IUserRepository
from app.models.refresh_token import RefreshToken
from app.models.user import User
from app.utils.exceptions import InvalidCredentialsError, InvalidSessionError
from app.utils.security import (
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
    hash_refresh_token,
    verify_password,
)

settings = get_settings()


class AuthService:
    def __init__(
        self,
        user_repository: IUserRepository,
        refresh_token_repository: IRefreshTokenRepository,
    ) -> None:
        self._user_repository = user_repository
        self._refresh_token_repository = refresh_token_repository

    async def authenticate(self, email: str, password: str) -> tuple[str, str, User]:
        user = await self._user_repository.get_by_email(email)
        if user is None or not user.is_active or not verify_password(password, user.hashed_password):
            raise InvalidCredentialsError("Email ou mot de passe incorrect.")

        access_token = create_access_token(subject=str(user.id), extra_claims={"role": user.role.value})
        refresh_token = await self._issue_refresh_token(user)
        return access_token, refresh_token, user

    async def refresh(self, refresh_token: str | None) -> tuple[str, str, User]:
        if refresh_token is None:
            raise InvalidSessionError("Aucune session active.")

        try:
            payload = decode_refresh_token(refresh_token)
        except JWTError as exc:
            raise InvalidSessionError("Session invalide ou expirée.") from exc

        jti = payload.get("jti")
        if jti is None:
            raise InvalidSessionError("Session invalide ou expirée.")

        row = await self._refresh_token_repository.get_by_id(jti)
        if row is None or row.token_hash != hash_refresh_token(refresh_token):
            raise InvalidSessionError("Session invalide ou expirée.")

        if row.revoked_at is not None:
            await self._refresh_token_repository.revoke_all_for_user(row.user_id)
            raise InvalidSessionError("Session invalide ou expirée.")

        if row.expires_at < datetime.now(timezone.utc):
            raise InvalidSessionError("Session invalide ou expirée.")

        user = await self._user_repository.get_by_id(row.user_id)
        if user is None or not user.is_active:
            raise InvalidSessionError("Session invalide ou expirée.")

        await self._refresh_token_repository.revoke(row.id)

        new_access_token = create_access_token(subject=str(user.id), extra_claims={"role": user.role.value})
        new_refresh_token = await self._issue_refresh_token(user)
        return new_access_token, new_refresh_token, user

    async def logout(self, refresh_token: str | None) -> None:
        if refresh_token is None:
            return

        try:
            payload = decode_refresh_token(refresh_token)
        except JWTError:
            return

        jti = payload.get("jti")
        if jti is None:
            return

        row = await self._refresh_token_repository.get_by_id(jti)
        if row is not None and row.revoked_at is None:
            await self._refresh_token_repository.revoke(row.id)

    async def _issue_refresh_token(self, user: User) -> str:
        token_id = uuid.uuid4()
        raw_token = create_refresh_token(subject=str(user.id), jti=str(token_id))
        expires_at = datetime.now(timezone.utc) + timedelta(days=settings.jwt_refresh_expiration_days)

        await self._refresh_token_repository.create(
            RefreshToken(
                id=token_id,
                user_id=user.id,
                token_hash=hash_refresh_token(raw_token),
                expires_at=expires_at,
            )
        )
        return raw_token
