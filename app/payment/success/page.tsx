'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, Feather, Sun, Moon } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');
  const [isDark, setIsDark] = useState(true); // Default to dark mode

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
  }, []);

  // Save theme preference
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 flex items-center justify-center px-6 ${
      isDark 
        ? 'bg-black' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      <button
        onClick={toggleTheme}
        className={`absolute top-6 right-6 p-2 rounded-full transition-all ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-900'}`}
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        <div className={`backdrop-blur-sm rounded-2xl p-12 shadow-xl border transition-colors ${
          isDark 
            ? 'bg-slate-900/50 border-white/10 text-white' 
            : 'bg-white/60 border-white/60 text-slate-900'
        }`}>
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
            className={`text-4xl font-bold mb-4 text-center ${isDark ? 'text-white' : 'text-slate-900'}`}
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
              className={`mb-8 p-4 rounded-lg border ${isDark ? 'bg-slate-800 border-white/10' : 'bg-slate-50 border-slate-200'}`}
            >
              <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                Order Number
              </p>
              <p className={`text-lg font-mono font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
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
              <Mail className={`w-5 h-5 mt-1 flex-shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
              <p className={isDark ? 'text-slate-300' : 'text-slate-700'} style={{ fontFamily: 'Nunito, sans-serif' }}>
                A confirmation email has been sent to your inbox with your order details.
              </p>
            </div>

            <div className="flex items-start gap-3 text-left">
              <Feather className={`w-5 h-5 mt-1 flex-shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
              <p className={isDark ? 'text-slate-300' : 'text-slate-700'} style={{ fontFamily: 'Nunito, sans-serif' }}>
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
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
              What&apos;s next?
            </p>
            
            <Link
              href="/"
              className={`inline-block px-8 py-3 rounded-lg font-semibold transition-colors ${
                isDark 
                  ? 'bg-white text-slate-900 hover:bg-slate-100' 
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
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