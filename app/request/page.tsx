'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Feather, Clock, Sparkles, AlertCircle, Sun, Moon } from 'lucide-react';
import Link from 'next/link';

interface OrderDetails {
  orderId: string;
  orderNumber: string;
  email: string;
  poemsRemaining: number;
  tierName: string;
  deliveryHours: number;
  allowCustomization: boolean;
}

const POEM_TYPES = [
  { value: 'HAIKU', label: 'Haiku', description: '3 lines, 5-7-5 syllables' },
  { value: 'FREE_VERSE', label: 'Free Verse', description: 'No rhyme scheme, natural flow' },
  { value: 'SONNET', label: 'Sonnet', description: '14 lines, structured rhyme' },
  { value: 'LIMERICK', label: 'Limerick', description: '5 lines, humorous & rhythmic' },
  { value: 'ACROSTIC', label: 'Acrostic', description: 'First letters spell a word' },
  { value: 'CUSTOM', label: 'Custom', description: 'Tell me what you need' },
];

export default function PoemRequestPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId') || searchParams.get('order');

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  // Form state
  const [poemType, setPoemType] = useState('');
  const [theme, setTheme] = useState('');
  const [tone, setTone] = useState('');
  const [constraints, setConstraints] = useState('');
  const [surpriseMe, setSurpriseMe] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setError('No order ID provided');
      setLoading(false);
      return;
    }

    async function fetchOrderDetails() {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch order details');
        }

        setOrderDetails(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load order');
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [orderId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderId) return;

    // For Quick Poem (no customization), we don't need theme
    const needsTheme = orderDetails?.allowCustomization && !surpriseMe;

    // Validation
    if (needsTheme && !theme.trim()) {
      setError('Please provide a theme for your custom poem');
      return;
    }

    if (orderDetails?.allowCustomization && !surpriseMe && !poemType) {
      setError('Please select a poem type or check "Surprise Me"');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/requests/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          poemType: poemType || 'CUSTOM',
          theme: theme.trim() || 'Poet\'s choice',
          tone: tone.trim() || null,
          constraints: constraints.trim() || null,
          surpriseMe: surpriseMe || !orderDetails?.allowCustomization,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit request');
      }

      // Redirect to confirmation
      router.push(`/request/confirmation?poemsRemaining=${data.poemsRemaining}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${isDark ? 'bg-black' : 'bg-white'}`}>
        <div className="text-center">
          <Feather className={`w-12 h-12 animate-pulse mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'} style={{ fontFamily: 'Nunito, sans-serif' }}>
            Loading your order...
          </p>
        </div>
      </div>
    );
  }

  if (error && !orderDetails) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-6 transition-colors duration-300 ${isDark ? 'bg-black' : 'bg-white'}`}>
        <div className="max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
            Unable to Load Order
          </h1>
          <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
            {error}
          </p>
          <Link
            href="/"
            className={`inline-block px-6 py-3 rounded-lg font-semibold transition-colors ${isDark ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 py-12 px-6 ${
      isDark 
        ? 'bg-black' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      <div className="max-w-3xl mx-auto">
        {/* Header with Theme Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex-1 text-center">
            <Feather className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-400' : 'text-slate-700'}`} />
            <h1 className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
              Request Your Poem
            </h1>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'} style={{ fontFamily: 'Nunito, sans-serif' }}>
              Tell me what you&apos;re looking for, and I&apos;ll craft it with care.
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all ml-4 flex-shrink-0 ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-900'}`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </motion.div>

        {/* Order Info */}
        {orderDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`rounded-xl p-6 mb-8 border transition-colors ${isDark ? 'bg-slate-900/50 border-white/10' : 'bg-white/60 border-white/60'}`}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Order #{orderDetails.orderNumber}
                </p>
                <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                  {orderDetails.tierName}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Poems Remaining
                </p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                  {orderDetails.poemsRemaining}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className={`rounded-xl p-8 space-y-6 border transition-colors ${isDark ? 'bg-slate-900/50 border-white/10' : 'bg-white/60 border-white/60'}`}
        >
          {/* Error Message */}
          {error && (
            <div className={`rounded-lg p-4 flex items-start gap-3 border ${isDark ? 'bg-red-500/20 border-red-500/50' : 'bg-red-50 border-red-200'}`}>
              <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
              <p className={`text-sm ${isDark ? 'text-red-300' : 'text-red-800'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                {error}
              </p>
            </div>
          )}

          {/* Surprise Me Option or Quick Poem Notice */}
          {!orderDetails?.allowCustomization ? (
            // Quick Poem - Show informational message
            <div className={`rounded-lg p-6 border ${isDark ? 'bg-blue-500/20 border-blue-500/50' : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex items-start gap-3">
                <Sparkles className={`w-6 h-6 mt-1 flex-shrink-0 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                <div>
                  <p className={`font-bold mb-2 ${isDark ? 'text-blue-300' : 'text-blue-900'}`} style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                    Quick Poem - Poet&apos;s Choice
                  </p>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-blue-200' : 'text-blue-800'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                    For Quick Poems, I&apos;ll choose the perfect style and craft something special. 
                    Simply click submit below and I&apos;ll create a thoughtful poem for you within 24 hours.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Custom Poem - Show Surprise Me checkbox
            <div className={`rounded-lg p-4 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={surpriseMe}
                  onChange={(e) => setSurpriseMe(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                />
                <div>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                    <Sparkles className="w-4 h-4 inline mr-1" />
                    Surprise Me
                  </p>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Let me choose the style and theme based on your order
                  </p>
                </div>
              </label>
            </div>
          )}

          {orderDetails?.allowCustomization && !surpriseMe && (
            <>
              {/* Poem Type */}
              <div>
                <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                  Poem Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {POEM_TYPES.map((type) => (
                    <label
                      key={type.value}
                      className={`relative flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        poemType === type.value
                          ? isDark ? 'border-white bg-slate-800' : 'border-slate-900 bg-slate-50'
                          : isDark ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="poemType"
                        value={type.value}
                        checked={poemType === type.value}
                        onChange={(e) => setPoemType(e.target.value)}
                        className="sr-only"
                      />
                      <div>
                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                          {type.label}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                          {type.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Theme */}
              <div>
                <label htmlFor="theme" className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                  Theme or Subject <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="theme"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  rows={4}
                  placeholder="What should this poem be about? (e.g., my mother's birthday, first day of autumn, a lost friend...)"
                  className={`w-full px-4 py-3 rounded-lg focus:outline-none transition-colors ${
                    isDark 
                      ? 'bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-slate-600 focus:ring-1 focus:ring-slate-600' 
                      : 'border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500'
                  }`}
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                />
              </div>

              {/* Tone */}
              <div>
                <label htmlFor="tone" className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                  Tone or Mood <span className={`font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>(Optional)</span>
                </label>
                <input
                  type="text"
                  id="tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  placeholder="e.g., joyful, melancholic, playful, reflective..."
                  className={`w-full px-4 py-3 rounded-lg focus:outline-none transition-colors ${
                    isDark 
                      ? 'bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-slate-600 focus:ring-1 focus:ring-slate-600' 
                      : 'border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500'
                  }`}
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                />
              </div>

              {/* Additional Details */}
              <div>
                <label htmlFor="constraints" className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                  Additional Details <span className={`font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>(Optional)</span>
                </label>
                <textarea
                  id="constraints"
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                  rows={3}
                  placeholder="Any specific words to include? A dedication? Length preferences? Let me know..."
                  className={`w-full px-4 py-3 rounded-lg focus:outline-none transition-colors ${
                    isDark 
                      ? 'bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-slate-600 focus:ring-1 focus:ring-slate-600' 
                      : 'border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500'
                  }`}
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                />
              </div>
            </>
          )}

          {/* Delivery Info */}
          {orderDetails && (
            <div className={`rounded-lg p-4 flex items-start gap-3 border ${isDark ? 'bg-blue-500/20 border-blue-500/50' : 'bg-blue-50 border-blue-200'}`}>
              <Clock className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <div>
                <p className={`text-sm font-semibold ${isDark ? 'text-blue-300' : 'text-blue-900'}`} style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                  Estimated Delivery
                </p>
                <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-800'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Your poem will be delivered within {orderDetails.deliveryHours} hours to <strong>{orderDetails.email}</strong>
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isDark 
                ? 'bg-white text-slate-900 hover:bg-slate-100' 
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            {submitting ? 'Submitting Request...' : 'Submit Poem Request'}
          </button>

          <p className={`text-xs text-center ${isDark ? 'text-slate-400' : 'text-slate-600'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
            By submitting, you confirm the details are accurate. I&apos;ll begin crafting your poem shortly.
          </p>
        </motion.form>
      </div>
    </div>
  );
}