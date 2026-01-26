import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { orderNumber, email } = await request.json();

    if (!orderNumber && !email) {
      return NextResponse.json(
        { error: 'Please provide either an order number or email address' },
        { status: 400 }
      );
    }

    // Find orders by order number or email
    const orders = await prisma.order.findMany({
      where: orderNumber 
        ? { orderNumber: { contains: orderNumber, mode: 'insensitive' } }
        : { email: { equals: email, mode: 'insensitive' } },
      include: {
        tier: true,
        poemRequests: {
          select: {
            id: true,
            poemType: true,
            status: true,
            createdAt: true,
            deliveredAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10, // Limit to 10 most recent orders
    });

    if (orders.length === 0) {
      return NextResponse.json(
        { error: 'No orders found. Please check your order number or email address.' },
        { status: 404 }
      );
    }

    // Map to safe public data
    const safeOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      tierName: order.tier.name,
      poemsRemaining: order.poemsRemaining,
      deliveryHours: order.deliveryHours,
      createdAt: order.createdAt,
      requests: order.poemRequests.map(req => ({
        poemType: req.poemType,
        status: req.status,
        createdAt: req.createdAt,
        deliveredAt: req.deliveredAt,
      })),
    }));

    return NextResponse.json({ orders: safeOrders });
  } catch (error) {
    console.error('Error checking order:', error);
    return NextResponse.json(
      { error: 'Failed to check order status' },
      { status: 500 }
    );
  }
}