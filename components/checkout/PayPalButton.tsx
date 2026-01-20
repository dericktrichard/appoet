'use client';

import { useEffect, useRef, useState } from 'react';

interface PayPalButtonProps {
  tierId: string;
  tierName: string;
  price: number;
  onSuccess: (orderNumber: string) => void;
  onError: (error: string) => void;
  isDark?: boolean;
}

interface PayPalButtonConfig {
  style?: {
    layout?: string;
    color?: string;
    shape?: string;
    label?: string;
  };
  createOrder: () => Promise<string>;
  onApprove: (data: { orderID: string }) => Promise<void>;
  onError: (err: Error) => void;
  onCancel: () => void;
}

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: PayPalButtonConfig) => {
        render: (container: HTMLElement) => void;
      };
    };
  }
}

export default function PayPalButton({
  tierId,
  tierName,
  price,
  onSuccess,
  onError,
  isDark = false,
}: PayPalButtonProps) {
  const paypalRef = useRef<HTMLDivElement>(null);
  const orderIdRef = useRef<string | null>(null);
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [showPayPal, setShowPayPal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
  }, [email]);

  useEffect(() => {
    if (!showPayPal || !window.paypal || !paypalRef.current) return;

    // Clear any existing buttons
    if (paypalRef.current) {
      paypalRef.current.innerHTML = '';
    }

    window.paypal
      .Buttons({
        style: {
          layout: 'vertical',
          color: isDark ? 'white' : 'black',
          shape: 'rect',
          label: 'pay',
        },
        createOrder: async () => {
          try {
            setLoading(true);
            const response = await fetch('/api/orders/create', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                tierId,
                email,
              }),
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.error || 'Failed to create order');
            }

            // Store orderId in ref for later use in onApprove
            orderIdRef.current = data.orderId;
            console.log('Order created:', data.orderId, 'PayPal Order:', data.paypalOrderId);

            return data.paypalOrderId;
          } catch (error) {
            console.error('Error creating order:', error);
            onError(error instanceof Error ? error.message : 'Failed to create order');
            throw error;
          } finally {
            setLoading(false);
          }
        },
        onApprove: async (data: { orderID: string }) => {
          try {
            setLoading(true);
            
            // Get the orderId from ref
            const orderId = orderIdRef.current;
            
            if (!orderId) {
              throw new Error('Order ID not found');
            }

            console.log('Capturing payment for order:', orderId, 'PayPal Order:', data.orderID);
            
            const response = await fetch('/api/orders/capture', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                paypalOrderId: data.orderID,
                orderId: orderId,
              }),
            });

            const result = await response.json();

            if (!response.ok) {
              throw new Error(result.error || 'Failed to capture payment');
            }

            onSuccess(result.orderNumber);
          } catch (error) {
            console.error('Error capturing payment:', error);
            onError(error instanceof Error ? error.message : 'Failed to process payment');
          } finally {
            setLoading(false);
          }
        },
        onError: (err: Error) => {
          console.error('PayPal error:', err);
          onError('Payment failed. Please try again.');
          setLoading(false);
        },
        onCancel: () => {
          setLoading(false);
        },
      })
      .render(paypalRef.current);
  }, [showPayPal, tierId, email, isDark, onSuccess, onError]);

  return (
    <div className="space-y-4">
      {!showPayPal ? (
        <>
          <div>
            <label
              htmlFor="email"
              className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              Your Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                isDark
                  ? 'bg-white/5 border-white/20 text-white placeholder-slate-500 focus:border-white/40'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-slate-500'
              } focus:outline-none`}
              style={{ fontFamily: 'Nunito, sans-serif' }}
            />
            <p
              className={`text-xs mt-2 ${
                isDark ? 'text-slate-500' : 'text-slate-500'
              }`}
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              We&apos;ll send your order confirmation and poem to this address
            </p>
          </div>

          <button
            onClick={() => setShowPayPal(true)}
            disabled={!isEmailValid}
            className={`w-full py-3 rounded-lg font-semibold transition-all ${
              isEmailValid
                ? isDark
                  ? 'bg-white text-black hover:bg-slate-100'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
                : isDark
                ? 'bg-white/10 text-slate-600 cursor-not-allowed'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            Continue to Payment
          </button>
        </>
      ) : (
        <div>
          <div
            className={`text-sm mb-3 p-3 rounded-lg ${
              isDark ? 'bg-white/5 text-slate-300' : 'bg-slate-50 text-slate-700'
            }`}
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            <p className="font-semibold mb-1">{tierName}</p>
            <p className="text-xs opacity-75">Email: {email}</p>
            <p className="text-xs opacity-75 mt-1">Amount: ${price.toFixed(2)}</p>
          </div>

          {loading && (
            <div className="text-center py-4">
              <p
                className={isDark ? 'text-white' : 'text-slate-900'}
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                Processing payment...
              </p>
            </div>
          )}

          <div ref={paypalRef} className={loading ? 'opacity-50 pointer-events-none' : ''} />

          <button
            onClick={() => setShowPayPal(false)}
            className={`w-full mt-3 py-2 rounded-lg text-sm transition-colors ${
              isDark
                ? 'text-slate-400 hover:text-white hover:bg-white/5'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            ← Change email
          </button>
        </div>
      )}
    </div>
  );
}