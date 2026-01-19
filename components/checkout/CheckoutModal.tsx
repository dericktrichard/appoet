'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';
import PayPalButton from './PayPalButton';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  tierId: string;
  tierName: string;
  tierPrice: number;
  tierDescription: string;
  isDark?: boolean;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  tierId,
  tierName,
  tierPrice,
  tierDescription,
  isDark = false,
}: CheckoutModalProps) {
  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSuccess = (orderNumber: string) => {
    // Close modal and redirect to success page
    onClose();
    window.location.href = `/payment/success?orderNumber=${orderNumber}`;
  };

  const handleError = (error: string) => {
    alert(`Payment failed: ${error}\n\nPlease try again or contact support.`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 ${
          isDark ? 'bg-black/80' : 'bg-black/50'
        } backdrop-blur-sm`}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md rounded-2xl p-8 shadow-2xl ${
          isDark
            ? 'bg-slate-900 border border-white/10'
            : 'bg-white border border-slate-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
            isDark
              ? 'hover:bg-white/10 text-slate-400 hover:text-white'
              : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2
            className={`text-2xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
            style={{ fontFamily: 'Philosopher, Georgia, serif' }}
          >
            Checkout
          </h2>
          <div
            className={`p-4 rounded-lg ${
              isDark ? 'bg-white/5' : 'bg-slate-50'
            }`}
          >
            <h3
              className={`font-semibold mb-1 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
              style={{ fontFamily: 'Philosopher, Georgia, serif' }}
            >
              {tierName}
            </h3>
            <p
              className={`text-sm mb-2 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              {tierDescription}
            </p>
            <p
              className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
              style={{ fontFamily: 'Philosopher, Georgia, serif' }}
            >
              ${tierPrice.toFixed(2)}
            </p>
          </div>
        </div>

        {/* PayPal Button */}
        <PayPalButton
          tierId={tierId}
          tierName={tierName}
          price={tierPrice}
          onSuccess={handleSuccess}
          onError={handleError}
          isDark={isDark}
        />

        {/* Security notice */}
        <p
          className={`text-xs text-center mt-6 ${
            isDark ? 'text-slate-500' : 'text-slate-500'
          }`}
          style={{ fontFamily: 'Nunito, sans-serif' }}
        >
          Secure payment powered by PayPal
        </p>
      </div>
    </div>
  );
}