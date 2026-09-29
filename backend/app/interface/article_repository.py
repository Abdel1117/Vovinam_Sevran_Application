from abc import ABC, abstractmethod

from app.models.article import Article


class IArticleRepository(ABC):
    @abstractmethod
    async def list(self, tag: str | None = None) -> list[Article]: ...

    @abstractmethod
    async def get_by_slug(self, slug: str) -> Article | None: ...

    @abstractmethod
    async def slug_exists(self, slug: str) -> bool: ...

    @abstractmethod
    async def create(self, article: Article) -> Article: ...

    @abstractmethod
    async def update(self, article: Article) -> Article: ...

    @abstractmethod
    async def delete(self, article: Article) -> None: ...
