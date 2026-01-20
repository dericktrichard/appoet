'use client';

import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, Feather } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/60 text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <CheckCircle className="w-20 h-20 text-green-600" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-slate-900 mb-4"
            style={{ fontFamily: 'Philosopher, Georgia, serif' }}
          >
            Payment Successful!
          </motion.h1>

          {/* Order Number */}
          {orderNumber && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200"
            >
              <p className="text-sm text-slate-600 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Order Number
              </p>
              <p className="text-lg font-mono font-semibold text-slate-900">
                {orderNumber}
              </p>
            </motion.div>
          )}

          {/* Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-4 mb-8"
          >
            <div className="flex items-start gap-3 text-left">
              <Mail className="w-5 h-5 text-slate-600 mt-1 flex-shrink-0" />
              <p className="text-slate-700" style={{ fontFamily: 'Nunito, sans-serif' }}>
                A confirmation email has been sent to your inbox with your order details.
              </p>
            </div>

            <div className="flex items-start gap-3 text-left">
              <Feather className="w-5 h-5 text-slate-600 mt-1 flex-shrink-0" />
              <p className="text-slate-700" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Check your email for a link to submit your poem request. I&apos;ll craft your poem with care and deliver it within the promised timeframe.
              </p>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <p className="text-sm text-slate-600" style={{ fontFamily: 'Nunito, sans-serif' }}>
              What&apos;s next?
            </p>
            
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              Return to Home
            </Link>
          </motion.div>

          {/* Footer Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 text-xs text-slate-500"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            Questions? Reply to the confirmation email—I&apos;m here to help.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}