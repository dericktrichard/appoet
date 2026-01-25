import { NextResponse } from 'next/server';
import { paypalClient } from '@/lib/paypal';
import { prisma } from '@/lib/prisma';
import { 
  OrdersController, 
  CheckoutPaymentIntent, 
  ItemCategory,
  OrderApplicationContextLandingPage,
  OrderApplicationContextUserAction,
} from '@paypal/paypal-server-sdk';

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

    // Check if this is a first-time customer (by email)
    const existingOrders = await prisma.order.count({
      where: { 
        email,
        status: { in: ['PAID', 'QUEUED', 'IN_PROGRESS', 'DELIVERED'] }
      },
    });
    
    const isFirstTime = existingOrders === 0;
    
    // Calculate poems remaining
    const poemsRemaining = tier.basePoemCount + (isFirstTime ? tier.bonusPoems : 0);

    // Create order in our database (PENDING status)
    const order = await prisma.order.create({
      data: {
        tierId: tier.id,
        email,
        poemsRemaining,
        isFirstTime,
        amountPaid: tier.basePrice, // Will be updated after payment
        deliveryHours: tier.baseDeliveryHours,
        status: 'PENDING',
      },
    });

    // Create PayPal order using new SDK
    const ordersController = new OrdersController(paypalClient);
    
    const collect = {
      body: {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [
          {
            referenceId: order.id,
            description: `${tier.name} - Appoet Poetry Commission`,
            amount: {
              currencyCode: 'USD',
              value: tier.basePrice.toFixed(2),
              breakdown: {
                itemTotal: {
                  currencyCode: 'USD',
                  value: tier.basePrice.toFixed(2),
                },
              },
            },
            items: [
              {
                name: tier.name,
                description: tier.description || 'Custom poetry commission',
                unitAmount: {
                  currencyCode: 'USD',
                  value: tier.basePrice.toFixed(2),
                },
                quantity: '1',
                category: ItemCategory.DigitalGoods,
              },
            ],
          },
        ],
        applicationContext: {
          brandName: 'Appoet',
          landingPage: OrderApplicationContextLandingPage.NoPreference,
          userAction: OrderApplicationContextUserAction.PayNow,
          returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?orderId=${order.id}`,
          cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel?orderId=${order.id}`,
        },
      },
      prefer: 'return=representation',
    };

    const { result: paypalOrder } = await ordersController.createOrder(collect);

    console.log('PayPal order created:', paypalOrder.id);

    return NextResponse.json({
      orderId: order.id,
      paypalOrderId: paypalOrder.id,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}