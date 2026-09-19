import uuid

from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.interface.user_repository import IUserRepository
from app.models.user import User


class UserRepository(IUserRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_by_email(self, email: str) -> User | None:
        statement = select(User).where(User.email == email)
        result = await self._session.exec(statement)
        return result.first()

    async def get_by_id(self, user_id: uuid.UUID | str) -> User | None:
        return await self._session.get(User, user_id)
