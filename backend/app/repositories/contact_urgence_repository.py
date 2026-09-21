import uuid

from sqlmodel import delete, select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.interface.contact_urgence_repository import IContactUrgenceRepository
from app.models.contact_urgence import ContactUrgence


class ContactUrgenceRepository(IContactUrgenceRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def list_for_adherent(self, adherent_id: uuid.UUID | str) -> list[ContactUrgence]:
        statement = select(ContactUrgence).where(ContactUrgence.adherent_id == adherent_id)
        result = await self._session.exec(statement)
        return list(result.all())

    async def replace_for_adherent(
        self, adherent_id: uuid.UUID | str, contacts: list[ContactUrgence]
    ) -> list[ContactUrgence]:
        await self._session.exec(delete(ContactUrgence).where(ContactUrgence.adherent_id == adherent_id))
        for contact in contacts:
            contact.adherent_id = adherent_id
            self._session.add(contact)
        await self._session.commit()
        for contact in contacts:
            await self._session.refresh(contact)
        return contacts
