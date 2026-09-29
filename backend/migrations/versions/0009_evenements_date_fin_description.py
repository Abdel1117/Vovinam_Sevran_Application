"""add date_fin, description and updated_at to evenements

Revision ID: 0009
Revises: 0008
Create Date: 2026-09-29

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0009"
down_revision: Union[str, None] = "0008"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("evenements", sa.Column("date_fin", sa.Date(), nullable=True))
    op.add_column("evenements", sa.Column("description", sa.String(), nullable=True))
    op.add_column(
        "evenements",
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_evenements_date_evenement", "evenements", ["date_evenement"])


def downgrade() -> None:
    op.drop_index("ix_evenements_date_evenement", table_name="evenements")
    op.drop_column("evenements", "updated_at")
    op.drop_column("evenements", "description")
    op.drop_column("evenements", "date_fin")
