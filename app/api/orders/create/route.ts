import { NextResponse } from 'next/server';
import paypal from '@paypal/checkout-server-sdk';
import { client } from '@/lib/paypal';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { tierId, email } = await request.json();

    // Validate input
    if (!tierId || !email) {
      return NextResponse.json(
        { error: 'Tier ID and email are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Fetch tier from database
    const tier = await prisma.tier.findUnique({
      where: { id: tierId, active: true },
    });

    if (!tier) {
      return NextResponse.json(
        { error: 'Invalid or inactive pricing tier' },
        { status: 404 }
      );
    }

    // Create order in our database (PENDING status)
    const order = await prisma.order.create({
      data: {
        tierId: tier.id,
        email,
        poemsRemaining: tier.poemCount + tier.bonusPoems,
        status: 'PENDING',
      },
    });

    // Create PayPal order
    const paypalRequest = new paypal.orders.OrdersCreateRequest();
    paypalRequest.prefer('return=representation');
    paypalRequest.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: order.id,
          description: `${tier.name} - Appoet Poetry Commission`,
          amount: {
            currency_code: 'USD',
            value: tier.price.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: tier.price.toFixed(2),
              },
            },
          },
          items: [
            {
              name: tier.name,
              description: tier.description || 'Custom poetry commission',
              unit_amount: {
                currency_code: 'USD',
                value: tier.price.toFixed(2),
              },
              quantity: '1',
            },
          ],
        },
      ],
      application_context: {
        brand_name: 'Appoet',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?orderId=${order.id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel?orderId=${order.id}`,
      },
    });

    const paypalOrder = await client().execute(paypalRequest);

    console.log('PayPal order created:', paypalOrder.result.id);

    return NextResponse.json({
      orderId: order.id,
      paypalOrderId: paypalOrder.result.id,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}