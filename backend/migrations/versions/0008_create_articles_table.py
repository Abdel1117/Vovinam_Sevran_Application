"""create articles table

Revision ID: 0008
Revises: 0007
Create Date: 2026-09-29

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0008"
down_revision: Union[str, None] = "0007"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "articles",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("slug", sa.String(), nullable=False),
        sa.Column("titre", sa.String(), nullable=False),
        sa.Column("categorie", sa.String(), nullable=False),
        sa.Column("chapo", sa.String(), nullable=False),
        sa.Column("corps", postgresql.JSONB(), nullable=False),
        sa.Column("tags", postgresql.ARRAY(sa.String()), nullable=False, server_default="{}"),
        sa.Column("chemin_image", sa.String(), nullable=False),
        sa.Column("chemin_vignette", sa.String(), nullable=False),
        sa.Column("facebook_url", sa.String(), nullable=True),
        sa.Column("instagram_url", sa.String(), nullable=True),
        sa.Column("youtube_url", sa.String(), nullable=True),
        sa.Column(
            "auteur_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_articles_slug", "articles", ["slug"], unique=True)
    op.create_index("ix_articles_tags", "articles", ["tags"], postgresql_using="gin")


def downgrade() -> None:
    op.drop_index("ix_articles_tags", table_name="articles")
    op.drop_index("ix_articles_slug", table_name="articles")
    op.drop_table("articles")
