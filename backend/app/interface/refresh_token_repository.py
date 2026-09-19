import uuid
from abc import ABC, abstractmethod

from app.models.refresh_token import RefreshToken


class IRefreshTokenRepository(ABC):
    @abstractmethod
    async def create(self, refresh_token: RefreshToken) -> RefreshToken: ...

    @abstractmethod
    async def get_by_id(self, token_id: uuid.UUID | str) -> RefreshToken | None: ...

    @abstractmethod
    async def revoke(self, token_id: uuid.UUID | str) -> None: ...

    @abstractmethod
    async def revoke_all_for_user(self, user_id: uuid.UUID | str) -> None: ...
