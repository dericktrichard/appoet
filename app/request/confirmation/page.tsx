'use client';

import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, Clock, Feather } from 'lucide-react';
import Link from 'next/link';

export default function RequestConfirmationPage() {
  const searchParams = useSearchParams();
  const poemsRemaining = searchParams.get('poemsRemaining') || '0';

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
            Request Received!
          </motion.h1>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 mb-8"
          >
            <p className="text-lg text-slate-700" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Thank you for sharing your vision. I&apos;ve received your poem request and will begin crafting it with care.
            </p>

            <div className="flex items-start gap-3 text-left bg-slate-50 p-4 rounded-lg">
              <Clock className="w-5 h-5 text-slate-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-900 mb-1" style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                  What happens next?
                </p>
                <p className="text-sm text-slate-700" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  I&apos;ll craft your poem and deliver it to your email within the promised timeframe. You&apos;ll receive a notification when it&apos;s ready.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-left bg-slate-50 p-4 rounded-lg">
              <Mail className="w-5 h-5 text-slate-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-900 mb-1" style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                  Check your email
                </p>
                <p className="text-sm text-slate-700" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  You&apos;ll receive your completed poem via email. Keep an eye on your inbox (and spam folder, just in case).
                </p>
              </div>
            </div>

            {parseInt(poemsRemaining) > 0 && (
              <div className="flex items-start gap-3 text-left bg-blue-50 p-4 rounded-lg border border-blue-200">
                <Feather className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-blue-900 mb-1" style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                    You have {poemsRemaining} poem{parseInt(poemsRemaining) !== 1 ? 's' : ''} remaining
                  </p>
                  <p className="text-sm text-blue-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Want to request another? You can submit additional requests anytime.
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
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
            transition={{ delay: 0.6 }}
            className="mt-8 text-xs text-slate-500"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            Questions or changes needed? Reply to your order confirmation email.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}