import uuid

from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.interface.adherent_repository import IAdherentRepository
from app.models.adherent import Adherent


class AdherentRepository(IAdherentRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def list(self) -> list[Adherent]:
        statement = select(Adherent).where(Adherent.is_actif.is_(True))
        result = await self._session.exec(statement)
        return list(result.all())

    async def get(self, adherent_id: uuid.UUID | str) -> Adherent | None:
        return await self._session.get(Adherent, adherent_id)

    async def get_by_licence(self, numero_licence: str) -> Adherent | None:
        statement = select(Adherent).where(Adherent.numero_licence == numero_licence)
        result = await self._session.exec(statement)
        return result.first()

    async def create(self, adherent: Adherent) -> Adherent:
        self._session.add(adherent)
        await self._session.commit()
        await self._session.refresh(adherent)
        return adherent

    async def update(self, adherent: Adherent) -> Adherent:
        self._session.add(adherent)
        await self._session.commit()
        await self._session.refresh(adherent)
        return adherent

    async def deactivate(self, adherent_id: uuid.UUID | str) -> None:
        adherent = await self._session.get(Adherent, adherent_id)
        if adherent is not None:
            adherent.is_actif = False
            self._session.add(adherent)
            await self._session.commit()
