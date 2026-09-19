"""create adherents table

Revision ID: 0003
Revises: 0002
Create Date: 2026-09-19

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0003"
down_revision: Union[str, None] = "0002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

type_adherent = postgresql.ENUM(
    "enfant", "adolescent", "adulte", "encadrant", name="typeadherent", create_type=False
)
statut_cotisation = postgresql.ENUM("a_jour", "en_attente", name="statutcotisation", create_type=False)
certificat_medical = postgresql.ENUM("valide", "manquant", name="certificatmedical", create_type=False)


def upgrade() -> None:
    type_adherent.create(op.get_bind(), checkfirst=True)
    statut_cotisation.create(op.get_bind(), checkfirst=True)
    certificat_medical.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "adherents",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("nom", sa.String(), nullable=False),
        sa.Column("prenom", sa.String(), nullable=False),
        sa.Column("date_naissance", sa.Date(), nullable=False),
        sa.Column("numero_licence", sa.String(), nullable=False),
        sa.Column("grade", sa.String(), nullable=False),
        sa.Column("couleur_ceinture", sa.String(), nullable=True),
        sa.Column("date_obtention_grade", sa.Date(), nullable=True),
        sa.Column("type_adherent", type_adherent, nullable=False, server_default="adulte"),
        sa.Column("is_actif", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("telephone", sa.String(), nullable=False),
        sa.Column("email", sa.String(), nullable=True),
        sa.Column("adresse", sa.String(), nullable=True),
        sa.Column("statut_cotisation", statut_cotisation, nullable=False, server_default="en_attente"),
        sa.Column("certificat_medical", certificat_medical, nullable=False, server_default="manquant"),
        sa.Column("assurance_incluse", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("nom_secours", sa.String(), nullable=False),
        sa.Column("prenom_secours", sa.String(), nullable=False),
        sa.Column("telephone_secours", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_adherents_numero_licence", "adherents", ["numero_licence"], unique=True)


def downgrade() -> None:
    op.drop_index("ix_adherents_numero_licence", table_name="adherents")
    op.drop_table("adherents")
    certificat_medical.drop(op.get_bind(), checkfirst=True)
    statut_cotisation.drop(op.get_bind(), checkfirst=True)
    type_adherent.drop(op.get_bind(), checkfirst=True)
