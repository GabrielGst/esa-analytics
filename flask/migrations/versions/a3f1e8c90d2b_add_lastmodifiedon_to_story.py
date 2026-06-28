"""Add lastModifiedOn to story model

Revision ID: a3f1e8c90d2b
Revises: 1c9ca6f81c35
Branch Labels: None
Depends On: None

"""
from alembic import op
import sqlalchemy as sa


revision = 'a3f1e8c90d2b'
down_revision = '1c9ca6f81c35'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('stories', schema=None) as batch_op:
        batch_op.add_column(sa.Column('lastModifiedOn', sa.String(length=100), nullable=True))


def downgrade():
    with op.batch_alter_table('stories', schema=None) as batch_op:
        batch_op.drop_column('lastModifiedOn')
