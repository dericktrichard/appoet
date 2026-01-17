import { NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    const result = await sendOrderConfirmationEmail({
      to: email,
      orderNumber: 'TEST-' + Date.now(),
      tierName: 'Quick Poem',
      price: 0.99,
      poemsRemaining: 3,
      deliveryHours: 24,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to send email', details: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      data: result.data,
    });
  } catch (error) {
    console.error('Error in test-email route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}