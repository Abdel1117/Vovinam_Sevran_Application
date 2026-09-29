import uuid

from sqlalchemy import func
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.interface.enseignant_repository import IEnseignantRepository
from app.models.enseignant import Enseignant


class EnseignantRepository(IEnseignantRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def list(self) -> list[Enseignant]:
        statement = select(Enseignant).order_by(Enseignant.ordre, Enseignant.created_at)
        result = await self._session.exec(statement)
        return list(result.all())

    async def get(self, enseignant_id: uuid.UUID | str) -> Enseignant | None:
        return await self._session.get(Enseignant, enseignant_id)

    async def ordre_max(self) -> int:
        result = await self._session.exec(select(func.max(Enseignant.ordre)))
        return result.one() or 0

    async def create(self, enseignant: Enseignant) -> Enseignant:
        self._session.add(enseignant)
        await self._session.commit()
        await self._session.refresh(enseignant)
        return enseignant

    async def update(self, enseignant: Enseignant) -> Enseignant:
        self._session.add(enseignant)
        await self._session.commit()
        await self._session.refresh(enseignant)
        return enseignant

    async def delete(self, enseignant: Enseignant) -> None:
        await self._session.delete(enseignant)
        await self._session.commit()
