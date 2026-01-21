import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PoemType } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const { orderId, poemType, theme, tone, constraints, surpriseMe } = await request.json();

    // Validate required fields
    if (!orderId || !poemType || !theme) {
      return NextResponse.json(
        { error: 'Order ID, poem type, and theme are required' },
        { status: 400 }
      );
    }

    // Verify order exists and has poems remaining
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { tier: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.poemsRemaining <= 0) {
      return NextResponse.json(
        { error: 'No poems remaining for this order' },
        { status: 400 }
      );
    }

    if (order.status !== 'PAID' && order.status !== 'QUEUED' && order.status !== 'IN_PROGRESS') {
      return NextResponse.json(
        { error: 'Order payment not confirmed' },
        { status: 400 }
      );
    }

    // Calculate estimated delivery
    const estimatedDelivery = new Date();
    estimatedDelivery.setHours(estimatedDelivery.getHours() + order.tier.deliveryHours);

    // Create poem request and update order
    const poemRequest = await prisma.$transaction(async (tx) => {
      // Create the poem request
      const request = await tx.poemRequest.create({
        data: {
          orderId: order.id,
          poemType: poemType as PoemType,
          theme,
          tone: tone || null,
          constraints: constraints ? JSON.stringify({ details: constraints }) : null,
          surpriseMe,
          status: 'PENDING',
          estimatedDelivery,
        },
      });

      // Update order status and poems remaining
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: order.status === 'PAID' ? 'QUEUED' : order.status,
          poemsRemaining: order.poemsRemaining - 1,
        },
      });

      return request;
    });

    console.log('Poem request created:', poemRequest.id);

    return NextResponse.json({
      id: poemRequest.id,
      estimatedDelivery: poemRequest.estimatedDelivery,
    });
  } catch (error) {
    console.error('Error creating poem request:', error);
    return NextResponse.json(
      { error: 'Failed to create poem request' },
      { status: 500 }
    );
  }
}