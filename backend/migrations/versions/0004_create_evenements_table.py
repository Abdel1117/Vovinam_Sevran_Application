"""create evenements table

Revision ID: 0004
Revises: 0003
Create Date: 2026-09-19

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0004"
down_revision: Union[str, None] = "0003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

type_evenement = postgresql.ENUM(
    "stage", "competition", "passage_de_grades", "demonstration", name="typeevenement", create_type=False
)


def upgrade() -> None:
    type_evenement.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "evenements",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("titre", sa.String(), nullable=False),
        sa.Column("date_evenement", sa.Date(), nullable=False),
        sa.Column("heure_debut", sa.Time(), nullable=False),
        sa.Column("heure_fin", sa.Time(), nullable=True),
        sa.Column("type_evenement", type_evenement, nullable=False, server_default="stage"),
        sa.Column("lieu", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("evenements")
    type_evenement.drop(op.get_bind(), checkfirst=True)
