import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/admin-auth';
import { sendPoemDeliveryEmail } from '@/lib/email';

interface FulfillRequest {
  requestId: string;
  poemContent: string;
  poemTitle?: string;
}

export async function POST(request: NextRequest) {
  // Check authentication
  if (!checkAdminAuth(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body: FulfillRequest = await request.json();
    const { requestId, poemContent, poemTitle } = body;

    if (!requestId || !poemContent) {
      return NextResponse.json(
        { error: 'Request ID and poem content are required' },
        { status: 400 }
      );
    }

    // Get the poem request with order details
    const poemRequest = await prisma.poemRequest.findUnique({
      where: { id: requestId },
      include: {
        order: true,
      },
    });

    if (!poemRequest) {
      return NextResponse.json(
        { error: 'Poem request not found' },
        { status: 404 }
      );
    }

    // Update the poem request
    const updatedRequest = await prisma.poemRequest.update({
      where: { id: requestId },
      data: {
        poemContent,
        status: 'DELIVERED',
        deliveredAt: new Date(),
      },
    });

    // Send delivery email
    await sendPoemDeliveryEmail({
      to: poemRequest.order.email,
      orderNumber: poemRequest.order.orderNumber,
      poemTitle: poemTitle || undefined,
      poemContent,
      poemType: poemRequest.poemType,
    });

    // Check if all poems in the order are delivered
    const allRequests = await prisma.poemRequest.findMany({
      where: { orderId: poemRequest.orderId },
    });

    const allDelivered = allRequests.every(
      (req) => req.status === 'DELIVERED'
    );

    if (allDelivered) {
      await prisma.order.update({
        where: { id: poemRequest.orderId },
        data: { status: 'DELIVERED' },
      });
    }

    console.log('Poem delivered:', requestId);

    return NextResponse.json({
      success: true,
      request: updatedRequest,
    });
  } catch (error) {
    console.error('Error fulfilling poem:', error);
    return NextResponse.json(
      { error: 'Failed to fulfill poem' },
      { status: 500 }
    );
  }
}

// Update status only (for marking as in progress)
export async function PATCH(request: NextRequest) {
  // Check authentication
  if (!checkAdminAuth(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { requestId, status } = await request.json();

    if (!requestId || !status) {
      return NextResponse.json(
        { error: 'Request ID and status are required' },
        { status: 400 }
      );
    }

    const updatedRequest = await prisma.poemRequest.update({
      where: { id: requestId },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      request: updatedRequest,
    });
  } catch (error) {
    console.error('Error updating status:', error);
    return NextResponse.json(
      { error: 'Failed to update status' },
      { status: 500 }
    );
  }
}