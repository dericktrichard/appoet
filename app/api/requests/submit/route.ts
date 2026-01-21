import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PoemType } from '@prisma/client';

interface RequestBody {
  orderId: string;
  poemType: string;
  theme: string;
  tone?: string;
  constraints?: string;
  surpriseMe: boolean;
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const { orderId, poemType, theme, tone, constraints, surpriseMe } = body;

    // Validate required fields
    if (!orderId || !poemType || (!theme && !surpriseMe)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate poem type
    if (!Object.values(PoemType).includes(poemType as PoemType)) {
      return NextResponse.json(
        { error: 'Invalid poem type' },
        { status: 400 }
      );
    }

    // Check if order exists and is valid
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

    if (order.status !== 'PAID' && order.status !== 'QUEUED' && order.status !== 'IN_PROGRESS') {
      return NextResponse.json(
        { error: 'Order has not been paid' },
        { status: 403 }
      );
    }

    if (order.poemsRemaining <= 0) {
      return NextResponse.json(
        { error: 'No poems remaining in this order' },
        { status: 403 }
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
          theme: theme || 'Surprise me!',
          tone: tone || null,
          constraints: constraints || null,
          surpriseMe,
          status: 'PENDING',
          estimatedDelivery,
        },
      });

      // Decrease poems remaining and update order status
      await tx.order.update({
        where: { id: order.id },
        data: {
          poemsRemaining: order.poemsRemaining - 1,
          status: order.status === 'PAID' ? 'QUEUED' : order.status,
        },
      });

      return request;
    });

    console.log('Poem request created:', poemRequest.id);

    return NextResponse.json({
      success: true,
      requestId: poemRequest.id,
      poemsRemaining: order.poemsRemaining - 1,
      estimatedDelivery: poemRequest.estimatedDelivery,
    });
  } catch (error) {
    console.error('Error creating poem request:', error);
    return NextResponse.json(
      { error: 'Failed to submit poem request' },
      { status: 500 }
    );
  }
}