"""create users table

Revision ID: 0001
Revises:
Create Date: 2026-09-19

"""
import uuid
from datetime import datetime, timezone
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

user_role = postgresql.ENUM("admin", "adherent", name="userrole", create_type=False)

SEED_ADMIN_ID = str(uuid.uuid4())
# Password: "ChangeMoi123!" — a changer immediatement apres la premiere connexion.
SEED_ADMIN_PASSWORD_HASH = "$2b$12$HVldPS27tmZ4e3cWB5pWSebNPTauZuVOZ0Ab2lu.O9wVRXUuDTgYG"


def upgrade() -> None:
    user_role.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("hashed_password", sa.String(), nullable=False),
        sa.Column("nom", sa.String(), nullable=False),
        sa.Column("prenom", sa.String(), nullable=False),
        sa.Column("role", user_role, nullable=False, server_default="adherent"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    users_table = sa.table(
        "users",
        sa.column("id", postgresql.UUID(as_uuid=True)),
        sa.column("email", sa.String),
        sa.column("hashed_password", sa.String),
        sa.column("nom", sa.String),
        sa.column("prenom", sa.String),
        sa.column("role", user_role),
        sa.column("is_active", sa.Boolean),
        sa.column("created_at", sa.DateTime(timezone=True)),
    )
    op.bulk_insert(
        users_table,
        [
            {
                "id": SEED_ADMIN_ID,
                "email": "admin@vovinam-sevran.fr",
                "hashed_password": SEED_ADMIN_PASSWORD_HASH,
                "nom": "Admin",
                "prenom": "Vovinam",
                "role": "admin",
                "is_active": True,
                "created_at": datetime.now(timezone.utc),
            }
        ],
    )


def downgrade() -> None:
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
    user_role.drop(op.get_bind(), checkfirst=True)
