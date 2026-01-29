'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, AlertCircle, Sun, Moon } from 'lucide-react';
import { setAuthToken } from '@/lib/admin-auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
    <div className={`min-h-screen transition-colors duration-300 flex items-center justify-center px-6 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-white'
    }`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Theme Toggle Button */}
        <div className="absolute top-6 right-6">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all ${
              isDark 
                ? 'hover:bg-white/10 text-white' 
                : 'hover:bg-slate-100 text-slate-900'
            }`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className={`transition-colors duration-300 backdrop-blur-md rounded-2xl p-8 border ${
          isDark 
            ? 'bg-white/10 border-white/20' 
            : 'bg-slate-100/50 border-slate-200'
        }`}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              isDark 
                ? 'bg-white/10' 
                : 'bg-slate-200'
            }`}>
              <Lock className={`w-8 h-8 ${isDark ? 'text-white' : 'text-slate-900'}`} />
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
              Admin Access
            </h1>
            <p className={isDark ? 'text-slate-300' : 'text-slate-600'} style={{ fontFamily: 'Nunito, sans-serif' }}>
              Enter your admin token to continue
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`mb-6 rounded-lg p-4 flex items-start gap-3 ${
              isDark 
                ? 'bg-red-500/20 border border-red-500/50' 
                : 'bg-red-100 border border-red-300'
            }`}>
              <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDark ? 'text-red-300' : 'text-red-600'}`} />
              <p className={`text-sm ${isDark ? 'text-red-200' : 'text-red-700'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="token" className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                Admin Token
              </label>
              <input
                type="password"
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter your admin token"
                className={`w-full px-4 py-3 rounded-lg focus:outline-none transition-colors ${
                  isDark 
                    ? 'bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:border-white/40' 
                    : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-500 focus:border-slate-400'
                }`}
                style={{ fontFamily: 'Nunito, sans-serif' }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !token.trim()}
              className={`w-full py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isDark 
                  ? 'bg-white text-slate-900 hover:bg-slate-100' 
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              {loading ? 'Authenticating...' : 'Access Dashboard'}
            </button>
          </form>

          <p className={`mt-6 text-center text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
            This area is restricted to authorized administrators only.
          </p>
        </div>
      </motion.div>
    </div>
  );
}