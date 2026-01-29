'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, Clock, Feather, Sun, Moon } from 'lucide-react';
import Link from 'next/link';

export default function RequestConfirmationPage() {
  const searchParams = useSearchParams();
  const poemsRemaining = searchParams.get('poemsRemaining') || '0';
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
        <div className={`backdrop-blur-sm rounded-2xl p-12 shadow-xl border text-center transition-colors ${
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
            className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}
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
            <p className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-700'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
              Thank you for sharing your vision. I&apos;ve received your poem request and will begin crafting it with care.
            </p>

            <div className={`flex items-start gap-3 text-left rounded-lg p-4 ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
              <Clock className={`w-5 h-5 mt-1 flex-shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
              <div>
                <p className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                  What happens next?
                </p>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-700'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                  I&apos;ll craft your poem and deliver it to your email within the promised timeframe. You&apos;ll receive a notification when it&apos;s ready.
                </p>
              </div>
            </div>

            <div className={`flex items-start gap-3 text-left rounded-lg p-4 ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
              <Mail className={`w-5 h-5 mt-1 flex-shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
              <div>
                <p className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                  Check your email
                </p>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-700'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                  You&apos;ll receive your completed poem via email. Keep an eye on your inbox (and spam folder, just in case).
                </p>
              </div>
            </div>

            {parseInt(poemsRemaining) > 0 && (
              <div className={`flex items-start gap-3 text-left rounded-lg p-4 border ${
                isDark 
                  ? 'bg-blue-500/20 border-blue-500/50' 
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <Feather className={`w-5 h-5 mt-1 flex-shrink-0 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                <div>
                  <p className={`font-semibold mb-1 ${isDark ? 'text-blue-300' : 'text-blue-900'}`} style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                    You have {poemsRemaining} poem{parseInt(poemsRemaining) !== 1 ? 's' : ''} remaining
                  </p>
                  <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-800'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
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
          <motion.p{`mt-8 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
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