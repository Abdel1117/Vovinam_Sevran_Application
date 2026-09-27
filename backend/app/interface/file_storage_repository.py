from abc import ABC, abstractmethod


class IFileStorageRepository(ABC):
    @abstractmethod
    async def save(self, subdir: str, filename: str, content: bytes) -> str: ...

    @abstractmethod
    async def delete(self, relative_path: str) -> None: ...

    @abstractmethod
    def url_for(self, relative_path: str) -> str: ...
