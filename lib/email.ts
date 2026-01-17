import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderConfirmationEmailProps {
  to: string;
  orderNumber: string;
  tierName: string;
  price: number;
  poemsRemaining: number;
  deliveryHours: number;
}

interface PoemDeliveryEmailProps {
  to: string;
  orderNumber: string;
  poemTitle?: string;
  poemContent: string;
  poemType: string;
}

export async function sendOrderConfirmationEmail({
  to,
  orderNumber,
  tierName,
  price,
  poemsRemaining,
  deliveryHours,
}: OrderConfirmationEmailProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Appoet <onboarding@resend.dev>', // Resend's development sender
      to: [to],
      subject: `Order Confirmed - ${orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: 'Georgia', serif;
                line-height: 1.6;
                color: #1e293b;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                text-align: center;
                padding: 30px 0;
                border-bottom: 2px solid #e2e8f0;
              }
              .logo {
                font-size: 32px;
                font-weight: bold;
                color: #0f172a;
              }
              .content {
                padding: 30px 0;
              }
              .order-details {
                background-color: #f8fafc;
                border-left: 4px solid #0f172a;
                padding: 20px;
                margin: 20px 0;
              }
              .detail-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #e2e8f0;
              }
              .detail-row:last-child {
                border-bottom: none;
              }
              .label {
                font-weight: 600;
                color: #475569;
              }
              .value {
                color: #0f172a;
              }
              .footer {
                text-align: center;
                padding: 30px 0;
                border-top: 2px solid #e2e8f0;
                color: #64748b;
                font-size: 14px;
              }
              .cta-button {
                display: inline-block;
                background-color: #0f172a;
                color: white;
                padding: 12px 32px;
                text-decoration: none;
                border-radius: 8px;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">Appoet</div>
              <p style="color: #64748b; margin-top: 10px;">Poetry written by hand, with heart</p>
            </div>
            
            <div class="content">
              <h2 style="color: #0f172a;">Thank You for Your Order</h2>
              
              <p>Your payment has been confirmed and your order is ready for fulfillment.</p>
              
              <div class="order-details">
                <h3 style="margin-top: 0; color: #0f172a;">Order Details</h3>
                <div class="detail-row">
                  <span class="label">Order Number:</span>
                  <span class="value">${orderNumber}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Tier:</span>
                  <span class="value">${tierName}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Amount Paid:</span>
                  <span class="value">$${price.toFixed(2)}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Poems Available:</span>
                  <span class="value">${poemsRemaining}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Estimated Delivery:</span>
                  <span class="value">Within ${deliveryHours} hours</span>
                </div>
              </div>
              
              <h3 style="color: #0f172a;">What's Next?</h3>
              <p>
                You can now submit your poem request. Tell me about the theme, tone, and any special 
                details you'd like included. I'll craft your poem with care and deliver it within 
                ${deliveryHours} hours.
              </p>
              
              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/request?order=${orderNumber}" class="cta-button">
                  Submit Poem Request
                </a>
              </div>
              
              <p style="margin-top: 30px; color: #64748b; font-size: 14px;">
                <strong>Note:</strong> This is a human-written service. Your poem will be crafted 
                personally by me—no AI, no templates, just authentic poetry.
              </p>
            </div>
            
            <div class="footer">
              <p>© 2026 Appoet. Every poem written by hand, with heart.</p>
              <p style="margin-top: 10px;">
                Questions? Reply to this email—I'm here to help.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending order confirmation email:', error);
      return { success: false, error };
    }

    console.log('Order confirmation email sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    return { success: false, error };
  }
}

export async function sendPoemDeliveryEmail({
  to,
  orderNumber,
  poemTitle,
  poemContent,
  poemType,
}: PoemDeliveryEmailProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Appoet <onboarding@resend.dev>', // Resend's development sender
      to: [to],
      subject: poemTitle ? `Your Poem: ${poemTitle}` : 'Your Poem Has Arrived',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: 'Georgia', serif;
                line-height: 1.8;
                color: #1e293b;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                text-align: center;
                padding: 30px 0;
                border-bottom: 2px solid #e2e8f0;
              }
              .logo {
                font-size: 32px;
                font-weight: bold;
                color: #0f172a;
              }
              .content {
                padding: 40px 0;
              }
              .poem-container {
                background-color: #f8fafc;
                border-left: 4px solid #0f172a;
                padding: 30px;
                margin: 30px 0;
              }
              .poem-title {
                font-size: 24px;
                font-weight: bold;
                color: #0f172a;
                margin-bottom: 10px;
              }
              .poem-type {
                font-size: 12px;
                color: #64748b;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 20px;
              }
              .poem-text {
                font-size: 18px;
                line-height: 1.8;
                color: #334155;
                white-space: pre-line;
              }
              .footer {
                text-align: center;
                padding: 30px 0;
                border-top: 2px solid #e2e8f0;
                color: #64748b;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">Appoet</div>
            </div>
            
            <div class="content">
              <p style="font-size: 18px; color: #0f172a;">
                Your poem is ready.
              </p>
              
              <p>
                I've crafted this piece especially for you. I hope it captures what you were looking for.
              </p>
              
              <div class="poem-container">
                ${poemTitle ? `<div class="poem-title">${poemTitle}</div>` : ''}
                <div class="poem-type">${poemType}</div>
                <div class="poem-text">${poemContent}</div>
              </div>
              
              <p>
                This poem is yours to keep, share, or hold close. Thank you for trusting me with your words.
              </p>
              
              <p style="margin-top: 30px; color: #64748b; font-size: 14px;">
                <strong>Order:</strong> ${orderNumber}
              </p>
            </div>
            
            <div class="footer">
              <p>© 2026 Appoet. Every poem written by hand, with heart.</p>
              <p style="margin-top: 10px;">
                I'd love to hear what you think. Feel free to reply to this email.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending poem delivery email:', error);
      return { success: false, error };
    }

    console.log('Poem delivery email sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send poem delivery email:', error);
    return { success: false, error };
  }
}