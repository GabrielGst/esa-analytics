"""Add customer1-5 columns to story model

Revision ID: b7d2a4f1c083
Revises: a3f1e8c90d2b
Branch Labels: None
Depends On: None

"""
from alembic import op
import sqlalchemy as sa


revision = 'b7d2a4f1c083'
down_revision = 'a3f1e8c90d2b'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('stories', schema=None) as batch_op:
        batch_op.add_column(sa.Column('customer1', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('customer2', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('customer3', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('customer4', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('customer5', sa.String(length=255), nullable=True))


def downgrade():
    with op.batch_alter_table('stories', schema=None) as batch_op:
        batch_op.drop_column('customer5')
        batch_op.drop_column('customer4')
        batch_op.drop_column('customer3')
        batch_op.drop_column('customer2')
        batch_op.drop_column('customer1')
