import { NextResponse } from 'next/server';
import paypal from '@paypal/checkout-server-sdk';
import { client } from '@/lib/paypal';
import { prisma } from '@/lib/prisma';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { paypalOrderId, orderId } = await request.json();

    if (!paypalOrderId || !orderId) {
      return NextResponse.json(
        { error: 'PayPal Order ID and Order ID are required' },
        { status: 400 }
      );
    }

    // Verify order exists and is still pending
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

    if (order.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Order has already been processed' },
        { status: 400 }
      );
    }

    // Capture the payment with PayPal
    const captureRequest = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
    captureRequest.requestBody({});

    const capture = await client().execute(captureRequest);
    const captureResult = capture.result;

    console.log('Payment captured:', captureResult.id);

    // Verify payment was successful
    if (captureResult.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Payment was not completed' },
        { status: 400 }
      );
    }

    // Get capture details
    const captureDetails = captureResult.purchase_units[0].payments.captures[0];
    const amountPaid = parseFloat(captureDetails.amount.value);

    // Verify amount matches tier price
    if (Math.abs(amountPaid - order.tier.price) > 0.01) {
      console.error('Payment amount mismatch:', {
        expected: order.tier.price,
        received: amountPaid,
      });
      return NextResponse.json(
        { error: 'Payment amount mismatch' },
        { status: 400 }
      );
    }

    // Update order and create payment record
    await prisma.$transaction(async (tx) => {
      // Update order status
      await tx.order.update({
        where: { id: order.id },
        data: { status: 'PAID' },
      });

      // Create payment record
      await tx.payment.create({
        data: {
          orderId: order.id,
          provider: 'PAYPAL',
          providerPaymentId: captureResult.id,
          amount: amountPaid,
          currency: 'USD',
          status: 'COMPLETED',
          webhookVerified: true, // We verified it ourselves via API
          webhookData: JSON.stringify(captureResult),
        },
      });
    });

    // Send confirmation email
    await sendOrderConfirmationEmail({
      to: order.email,
      orderNumber: order.orderNumber,
      tierName: order.tier.name,
      price: order.tier.price,
      poemsRemaining: order.poemsRemaining,
      deliveryHours: order.tier.deliveryHours,
    });

    console.log('Order confirmed and email sent:', order.orderNumber);

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
    });
  } catch (error) {
    console.error('Error capturing payment:', error);
    return NextResponse.json(
      { error: 'Failed to capture payment' },
      { status: 500 }
    );
  }
}