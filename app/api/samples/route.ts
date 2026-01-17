import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const samples = await prisma.samplePoem.findMany({
      where: {
        visible: true,
      },
      orderBy: {
        displayOrder: 'asc',
      },
    });

    return NextResponse.json(samples);
  } catch (error) {
    console.error('Error fetching sample poems:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sample poems' },
      { status: 500 }
    );
  }
}