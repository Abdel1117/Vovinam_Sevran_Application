import uuid
from abc import ABC, abstractmethod

from app.models.adherent import Adherent


class IAdherentRepository(ABC):
    @abstractmethod
    async def list(self) -> list[Adherent]: ...

    @abstractmethod
    async def get(self, adherent_id: uuid.UUID | str) -> Adherent | None: ...

    @abstractmethod
    async def get_by_licence(self, numero_licence: str) -> Adherent | None: ...

    @abstractmethod
    async def create(self, adherent: Adherent) -> Adherent: ...

    @abstractmethod
    async def update(self, adherent: Adherent) -> Adherent: ...

    @abstractmethod
    async def deactivate(self, adherent_id: uuid.UUID | str) -> None: ...
