import uuid
from abc import ABC, abstractmethod
from datetime import date

from app.models.evenement import Evenement


class IEvenementRepository(ABC):
    @abstractmethod
    async def list_a_venir(self, aujourd_hui: date, limit: int | None = None) -> list[Evenement]: ...

    @abstractmethod
    async def list_tous(self) -> list[Evenement]: ...

    @abstractmethod
    async def get(self, evenement_id: uuid.UUID | str) -> Evenement | None: ...

    @abstractmethod
    async def create(self, evenement: Evenement) -> Evenement: ...

    @abstractmethod
    async def update(self, evenement: Evenement) -> Evenement: ...

    @abstractmethod
    async def delete(self, evenement: Evenement) -> None: ...
