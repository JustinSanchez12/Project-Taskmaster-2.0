"""add_scheduled_end_time

Revision ID: a1b2c3d4e5f6
Revises: cfd733e88d0d
Create Date: 2026-03-16 00:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, Sequence[str], None] = "cfd733e88d0d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("tasks", sa.Column("scheduled_end_time", sa.DateTime(), nullable=True))


def downgrade() -> None:
    op.drop_column("tasks", "scheduled_end_time")
