"""Initial migration

Revision ID: 0001
Revises:
Create Date: 2026-05-19
"""
from alembic import op
import sqlalchemy as sa

revision = '0001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('orders',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('order_id', sa.String(20), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('customer_name', sa.String(255), nullable=False),
        sa.Column('phone', sa.String(20), nullable=False),
        sa.Column('city', sa.String(100), nullable=False),
        sa.Column('country', sa.String(50), server_default='Morocco'),
        sa.Column('status', sa.String(50), server_default='pending_upsell'),
        sa.Column('total_price', sa.Numeric(10, 2), nullable=False),
        sa.Column('currency', sa.String(10), server_default='MAD'),
        sa.Column('ip_address', sa.String(50)),
        sa.Column('user_agent', sa.Text()),
        sa.Column('fbclid', sa.String(255)),
        sa.Column('ttclid', sa.String(255)),
        sa.Column('source', sa.String(100)),
        sa.Column('medium', sa.String(100)),
        sa.Column('campaign', sa.String(100)),
        sa.Column('fbp', sa.String(255)),
        sa.Column('fbc', sa.String(255)),
        sa.Column('event_id', sa.String(100)),
        sa.Column('sheet_synced', sa.Boolean(), server_default='false'),
        sa.Column('sheet_synced_at', sa.DateTime()),
        sa.Column('sheet_error', sa.Text()),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('order_id'),
    )
    op.create_index('ix_orders_order_id', 'orders', ['order_id'])
    op.create_index('ix_orders_created_at', 'orders', ['created_at'])
    op.create_index('ix_orders_status', 'orders', ['status'])

    op.create_table('order_items',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('order_id', sa.Integer(), sa.ForeignKey('orders.id', ondelete='CASCADE'), nullable=False),
        sa.Column('product_id', sa.String(50), nullable=False),
        sa.Column('product_name', sa.String(255), nullable=False),
        sa.Column('sku', sa.String(50), nullable=False),
        sa.Column('quantity', sa.Integer(), nullable=False),
        sa.Column('offer_type', sa.String(20)),
        sa.Column('pieces_per_bundle', sa.Integer(), server_default='1'),
        sa.Column('unit_price', sa.Numeric(10, 2), nullable=False),
        sa.Column('is_upsell', sa.Boolean(), server_default='false'),
        sa.PrimaryKeyConstraint('id'),
    )

    op.create_table('tracking_events',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('event_type', sa.String(100), nullable=False),
        sa.Column('order_id', sa.String(20)),
        sa.Column('product_id', sa.String(50)),
        sa.Column('value', sa.Numeric(10, 2)),
        sa.Column('currency', sa.String(10), server_default='MAD'),
        sa.Column('fbp', sa.String(255)),
        sa.Column('fbc', sa.String(255)),
        sa.Column('ttclid', sa.String(255)),
        sa.Column('ip_address', sa.String(50)),
        sa.Column('user_agent', sa.Text()),
        sa.Column('event_id', sa.String(100)),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('event_id'),
    )
    op.create_index('ix_tracking_event_type', 'tracking_events', ['event_type'])


def downgrade():
    op.drop_table('tracking_events')
    op.drop_table('order_items')
    op.drop_table('orders')
