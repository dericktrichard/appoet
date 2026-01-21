import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        tier: true,
        poemRequests: {
          select: {
            id: true,
            poemType: true,
            status: true,
          },
        },
      },
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
        { error: 'Order has not been paid' },
        { status: 403 }
      );
    }

    // Check if user still has poems remaining
    if (order.poemsRemaining <= 0) {
      return NextResponse.json(
        { error: 'No poems remaining in this order' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      email: order.email,
      poemsRemaining: order.poemsRemaining,
      tierName: order.tier.name,
      deliveryHours: order.tier.deliveryHours,
      existingRequests: order.poemRequests,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
}