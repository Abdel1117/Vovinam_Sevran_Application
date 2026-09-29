"""create enseignants and demandes_essai tables

Revision ID: 0011
Revises: 0010
Create Date: 2026-09-29

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0011"
down_revision: Union[str, None] = "0010"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

cours_essai = postgresql.ENUM("enfants", "adolescents", "adultes", name="coursessai", create_type=False)
statut_demande = postgresql.ENUM(
    "a_traiter", "contacte", "essai_planifie", "inscrit", "sans_suite", name="statutdemande", create_type=False
)


def upgrade() -> None:
    op.create_table(
        "enseignants",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("nom", sa.String(), nullable=False),
        sa.Column("grade", sa.String(), nullable=False),
        sa.Column("role", sa.String(), nullable=False),
        sa.Column("texte", sa.String(), nullable=True),
        sa.Column("chemin_photo", sa.String(), nullable=True),
        sa.Column("ordre", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )

    cours_essai.create(op.get_bind(), checkfirst=True)
    statut_demande.create(op.get_bind(), checkfirst=True)
    op.create_table(
        "demandes_essai",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("prenom", sa.String(), nullable=False),
        sa.Column("nom", sa.String(), nullable=False),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("telephone", sa.String(), nullable=True),
        sa.Column("cours", cours_essai, nullable=False),
        sa.Column("message", sa.String(), nullable=True),
        sa.Column("statut", statut_demande, nullable=False, server_default="a_traiter"),
        sa.Column("date_essai", sa.Date(), nullable=True),
        sa.Column("note_interne", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_demandes_essai_statut", "demandes_essai", ["statut"])


def downgrade() -> None:
    op.drop_index("ix_demandes_essai_statut", table_name="demandes_essai")
    op.drop_table("demandes_essai")
    statut_demande.drop(op.get_bind(), checkfirst=True)
    cours_essai.drop(op.get_bind(), checkfirst=True)
    op.drop_table("enseignants")
