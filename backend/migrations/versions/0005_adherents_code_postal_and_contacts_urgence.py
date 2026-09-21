"""add code_postal to adherents and create contacts_urgence table

Revision ID: 0005
Revises: 0004
Create Date: 2026-09-21

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0005"
down_revision: Union[str, None] = "0004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("adherents", sa.Column("code_postal", sa.String(), nullable=True))
    op.drop_column("adherents", "nom_secours")
    op.drop_column("adherents", "prenom_secours")
    op.drop_column("adherents", "telephone_secours")

    op.create_table(
        "contacts_urgence",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "adherent_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("adherents.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("nom", sa.String(), nullable=False),
        sa.Column("telephone", sa.String(), nullable=False),
        sa.Column("lien", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_contacts_urgence_adherent_id", "contacts_urgence", ["adherent_id"])


def downgrade() -> None:
    op.drop_index("ix_contacts_urgence_adherent_id", table_name="contacts_urgence")
    op.drop_table("contacts_urgence")

    op.add_column("adherents", sa.Column("nom_secours", sa.String(), nullable=False, server_default=""))
    op.add_column("adherents", sa.Column("prenom_secours", sa.String(), nullable=False, server_default=""))
    op.add_column("adherents", sa.Column("telephone_secours", sa.String(), nullable=False, server_default=""))
    op.alter_column("adherents", "nom_secours", server_default=None)
    op.alter_column("adherents", "prenom_secours", server_default=None)
    op.alter_column("adherents", "telephone_secours", server_default=None)
    op.drop_column("adherents", "code_postal")
