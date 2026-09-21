import uuid
from abc import ABC, abstractmethod

from app.models.contact_urgence import ContactUrgence


class IContactUrgenceRepository(ABC):
    @abstractmethod
    async def list_for_adherent(self, adherent_id: uuid.UUID | str) -> list[ContactUrgence]: ...

    @abstractmethod
    async def replace_for_adherent(
        self, adherent_id: uuid.UUID | str, contacts: list[ContactUrgence]
    ) -> list[ContactUrgence]: ...
