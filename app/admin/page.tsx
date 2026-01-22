'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, AlertCircle } from 'lucide-react';
import { setAuthToken } from '@/lib/admin-auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Test the token by making an authenticated request
      const response = await fetch('/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Token is valid, save it and redirect
        setAuthToken(token);
        router.push('/admin/dashboard');
      } else {
        setError('Invalid admin token');
      }
    } catch {
      setError('Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
              Admin Access
            </h1>
            <p className="text-slate-300" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Enter your admin token to continue
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-300 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-200" style={{ fontFamily: 'Nunito, sans-serif' }}>
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-slate-200 mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Admin Token
              </label>
              <input
                type="password"
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter your admin token"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-white/40 transition-colors"
                style={{ fontFamily: 'Nunito, sans-serif' }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !token.trim()}
              className="w-full py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              {loading ? 'Authenticating...' : 'Access Dashboard'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400" style={{ fontFamily: 'Nunito, sans-serif' }}>
            This area is restricted to authorized administrators only.
          </p>
        </div>
      </motion.div>
    </div>
  );
}