"""add chemin_vignette to photos_galerie

Revision ID: 0007
Revises: 0006
Create Date: 2026-09-27

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0007"
down_revision: Union[str, None] = "0006"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("photos_galerie", sa.Column("chemin_vignette", sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column("photos_galerie", "chemin_vignette")
