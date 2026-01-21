'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Feather, Clock, Sparkles, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface OrderDetails {
  orderId: string;
  orderNumber: string;
  email: string;
  poemsRemaining: number;
  tierName: string;
  deliveryHours: number;
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

    // Validation
    if (!surpriseMe && (!poemType || !theme.trim())) {
      setError('Please select a poem type and provide a theme, or check "Surprise Me"');
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
          theme: theme.trim() || 'Surprise me!',
          tone: tone.trim() || null,
          constraints: constraints.trim() || null,
          surpriseMe,
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Feather className="w-12 h-12 text-slate-400 animate-pulse mx-auto mb-4" />
          <p className="text-slate-600" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Loading your order...
          </p>
        </div>
      </div>
    );
  }

  if (error && !orderDetails) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
            Unable to Load Order
          </h1>
          <p className="text-slate-600 mb-6" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {error}
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Feather className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
            Request Your Poem
          </h1>
          <p className="text-slate-600" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Tell me what you&apos;re looking for, and I&apos;ll craft it with care.
          </p>
        </motion.div>

        {/* Order Info */}
        {orderDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/60 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/60"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-slate-600 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Order #{orderDetails.orderNumber}
                </p>
                <p className="text-lg font-semibold text-slate-900" style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                  {orderDetails.tierName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Poems Remaining
                </p>
                <p className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
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
          className="bg-white/60 backdrop-blur-sm rounded-xl p-8 border border-white/60 space-y-6"
        >
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                {error}
              </p>
            </div>
          )}

          {/* Surprise Me Option */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={surpriseMe}
                onChange={(e) => setSurpriseMe(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
              />
              <div>
                <p className="font-semibold text-slate-900" style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                  <Sparkles className="w-4 h-4 inline mr-1" />
                  Surprise Me
                </p>
                <p className="text-sm text-slate-600" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Let me choose the style and theme based on your order
                </p>
              </div>
            </label>
          </div>

          {!surpriseMe && (
            <>
              {/* Poem Type */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3" style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                  Poem Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {POEM_TYPES.map((type) => (
                    <label
                      key={type.value}
                      className={`relative flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        poemType === type.value
                          ? 'border-slate-900 bg-slate-50'
                          : 'border-slate-200 hover:border-slate-300'
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
                        <p className="font-semibold text-slate-900" style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                          {type.label}
                        </p>
                        <p className="text-xs text-slate-600" style={{ fontFamily: 'Nunito, sans-serif' }}>
                          {type.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Theme */}
              <div>
                <label htmlFor="theme" className="block text-sm font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                  Theme or Subject <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="theme"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  rows={4}
                  placeholder="What should this poem be about? (e.g., my mother's birthday, first day of autumn, a lost friend...)"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                />
              </div>

              {/* Tone */}
              <div>
                <label htmlFor="tone" className="block text-sm font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                  Tone or Mood <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  placeholder="e.g., joyful, melancholic, playful, reflective..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                />
              </div>

              {/* Additional Details */}
              <div>
                <label htmlFor="constraints" className="block text-sm font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                  Additional Details <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <textarea
                  id="constraints"
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                  rows={3}
                  placeholder="Any specific words to include? A dedication? Length preferences? Let me know..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                />
              </div>
            </>
          )}

          {/* Delivery Info */}
          {orderDetails && (
            <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3 border border-blue-200">
              <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-900" style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                  Estimated Delivery
                </p>
                <p className="text-sm text-blue-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Your poem will be delivered within {orderDetails.deliveryHours} hours to <strong>{orderDetails.email}</strong>
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            {submitting ? 'Submitting Request...' : 'Submit Poem Request'}
          </button>

          <p className="text-xs text-center text-slate-600" style={{ fontFamily: 'Nunito, sans-serif' }}>
            By submitting, you confirm the details are accurate. I&apos;ll begin crafting your poem shortly.
          </p>
        </motion.form>
      </div>
    </div>
  );
}