from sqlalchemy.orm import selectinload
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.interface.article_repository import IArticleRepository
from app.models.article import Article


class ArticleRepository(IArticleRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    def _select(self):
        # L'auteur est chargé d'office : un accès paresseux à la relation lèverait une erreur en async.
        return (
            select(Article)
            .options(selectinload(Article.auteur))
            .execution_options(populate_existing=True)
        )

    async def list(self, tag: str | None = None) -> list[Article]:
        statement = self._select().order_by(Article.created_at.desc())
        if tag:
            statement = statement.where(Article.tags.any(tag))
        result = await self._session.exec(statement)
        return list(result.all())

    async def get_by_slug(self, slug: str) -> Article | None:
        result = await self._session.exec(self._select().where(Article.slug == slug))
        return result.first()

    async def slug_exists(self, slug: str) -> bool:
        result = await self._session.exec(select(Article.id).where(Article.slug == slug))
        return result.first() is not None

    async def create(self, article: Article) -> Article:
        self._session.add(article)
        await self._session.commit()
        return await self.get_by_slug(article.slug)

    async def update(self, article: Article) -> Article:
        self._session.add(article)
        await self._session.commit()
        return await self.get_by_slug(article.slug)

    async def delete(self, article: Article) -> None:
        await self._session.delete(article)
        await self._session.commit()
