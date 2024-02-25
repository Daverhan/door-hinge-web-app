"""empty message

Revision ID: 8bd45efafe3c
Revises: 4045a5a3cec2
Create Date: 2024-02-25 17:06:43.189841

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '8bd45efafe3c'
down_revision = '4045a5a3cec2'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('delete_this_column')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('delete_this_column', mysql.INTEGER(), autoincrement=False, nullable=True))

    # ### end Alembic commands ###
