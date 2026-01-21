import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const { orderNumber } = params;

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { tier: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if order is paid
    if (order.status !== 'PAID' && order.status !== 'QUEUED' && order.status !== 'IN_PROGRESS') {
      return NextResponse.json(
        { error: 'Order payment not confirmed' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      id: order.id,
      orderNumber: order.orderNumber,
      tierName: order.tier.name,
      poemsRemaining: order.poemsRemaining,
      email: order.email,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}