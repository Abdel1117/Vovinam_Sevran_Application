import uuid
from abc import ABC, abstractmethod

from app.models.enseignant import Enseignant


class IEnseignantRepository(ABC):
    @abstractmethod
    async def list(self) -> list[Enseignant]: ...

    @abstractmethod
    async def get(self, enseignant_id: uuid.UUID | str) -> Enseignant | None: ...

    @abstractmethod
    async def ordre_max(self) -> int: ...

    @abstractmethod
    async def create(self, enseignant: Enseignant) -> Enseignant: ...

    @abstractmethod
    async def update(self, enseignant: Enseignant) -> Enseignant: ...

    @abstractmethod
    async def delete(self, enseignant: Enseignant) -> None: ...
