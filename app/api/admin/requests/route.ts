import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/admin-auth';
import { PoemStatus } from '@prisma/client';

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

    const requests = await prisma.poemRequest.findMany({
      where: status ? { status: status as PoemStatus } : undefined,
      include: {
        order: {
          include: {
            tier: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    );
  }
}