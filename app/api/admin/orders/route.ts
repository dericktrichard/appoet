import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/admin-auth';
import { OrderStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  // Check authentication
  if (!checkAdminAuth(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const orders = await prisma.order.findMany({
      where: status ? { status: status as OrderStatus } : undefined,
      include: {
        tier: true,
        payment: true,
        poemRequests: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}