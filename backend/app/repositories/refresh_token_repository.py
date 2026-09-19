import uuid
from datetime import datetime, timezone

from sqlmodel import update
from sqlmodel.ext.asyncio.session import AsyncSession

from app.interface.refresh_token_repository import IRefreshTokenRepository
from app.models.refresh_token import RefreshToken


class RefreshTokenRepository(IRefreshTokenRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def create(self, refresh_token: RefreshToken) -> RefreshToken:
        self._session.add(refresh_token)
        await self._session.commit()
        await self._session.refresh(refresh_token)
        return refresh_token

    async def get_by_id(self, token_id: uuid.UUID | str) -> RefreshToken | None:
        return await self._session.get(RefreshToken, token_id)

    async def revoke(self, token_id: uuid.UUID | str) -> None:
        token = await self._session.get(RefreshToken, token_id)
        if token is not None and token.revoked_at is None:
            token.revoked_at = datetime.now(timezone.utc)
            self._session.add(token)
            await self._session.commit()

    async def revoke_all_for_user(self, user_id: uuid.UUID | str) -> None:
        statement = (
            update(RefreshToken)
            .where(RefreshToken.user_id == user_id, RefreshToken.revoked_at.is_(None))
            .values(revoked_at=datetime.now(timezone.utc))
        )
        await self._session.exec(statement)
        await self._session.commit()
