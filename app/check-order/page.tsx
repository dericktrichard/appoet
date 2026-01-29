'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, Clock, CheckCircle, Mail, AlertCircle, Sun, Moon } from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  tierName: string;
  poemsRemaining: number;
  deliveryHours: number;
  createdAt: string;
  requests: Array<{
    poemType: string;
    status: string;
    createdAt: string;
    deliveredAt: string | null;
  }>;
}

export default function CheckOrderPage() {
  const [searchType, setSearchType] = useState<'orderNumber' | 'email'>('orderNumber');
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchValue.trim()) {
      setError('Please enter a value to search');
      return;
    }

    setLoading(true);
    setError(null);
    setOrders([]);

    try {
      const response = await fetch('/api/orders/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [searchType]: searchValue.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to find orders');
        return;
      }

      setOrders(data.orders);
    } catch {
      setError('Failed to check order status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-slate-100 text-slate-800';
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'QUEUED': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'DELIVERED': return 'bg-purple-100 text-purple-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 py-12 px-6 ${isDark ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-white'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between mb-12"
        >
          <div className="flex-1">
            <Package className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`} />
            <h1 className={`text-4xl font-bold mb-4 text-center ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
              Check Order Status
            </h1>
            <p className={`text-lg text-center ${isDark ? 'text-slate-300' : 'text-slate-600'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
              Track your poem commission progress
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all flex-shrink-0 ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-900'}`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl p-8 mb-8 border backdrop-blur-md transition-colors ${isDark ? 'bg-white/10 border-white/20' : 'bg-slate-50 border-slate-200'}`}
        >
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Search Type Toggle */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setSearchType('orderNumber')}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  searchType === 'orderNumber'
                    ? isDark ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
                    : isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                Order Number
              </button>
              <button
                type="button"
                onClick={() => setSearchType('email')}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  searchType === 'email'
                    ? isDark ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
                    : isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                Email Address
              </button>
            </div>

            {/* Search Input */}
            <div>
              <label htmlFor="search" className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                {searchType === 'orderNumber' ? 'Enter Order Number' : 'Enter Email Address'}
              </label>
              <input
                type={searchType === 'email' ? 'email' : 'text'}
                id="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={searchType === 'orderNumber' ? 'e.g., cmku0v...' : 'e.g., you@example.com'}
                className={`w-full px-4 py-3 rounded-lg focus:outline-none transition-colors ${
                  isDark 
                    ? 'bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:border-white/40' 
                    : 'border border-slate-300 bg-white text-slate-900 placeholder-slate-500 focus:border-slate-400'
                }`}
                style={{ fontFamily: 'Nunito, sans-serif' }}
              />
            </div>

            {/* Search Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                isDark 
                  ? 'bg-white text-slate-900 hover:bg-slate-100' 
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              {loading ? (
                <>Processing...</>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Check Status
                </>
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className={`mt-6 rounded-lg p-4 flex items-start gap-3 border ${isDark ? 'bg-red-500/20 border-red-500/50' : 'bg-red-50 border-red-200'}`}>
              <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDark ? 'text-red-300' : 'text-red-600'}`} />
              <p className={`text-sm ${isDark ? 'text-red-200' : 'text-red-800'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                {error}
              </p>
            </div>
          )}
        </motion.div>

        {/* Results */}
        {orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {orders.map((order) => (
              <div
                key={order.id}
                className={`rounded-2xl p-6 border backdrop-blur-md transition-colors ${isDark ? 'bg-white/10 border-white/20' : 'bg-slate-50 border-slate-200'}`}
              >
                {/* Order Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className={`text-sm mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                      Order Number
                    </p>
                    <p className={`text-xl font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {order.orderNumber.slice(0, 16)}...
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <p className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                      Tier
                    </p>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                      {order.tierName}
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                      Poems Remaining
                    </p>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {order.poemsRemaining}
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                      Ordered
                    </p>
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Poem Requests */}
                {order.requests.length > 0 && (
                  <div className={`border-t pt-6 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                    <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                      Poem Requests
                    </h3>
                    <div className="space-y-3">
                      {order.requests.map((request, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between rounded-lg p-4 ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}
                        >
                          <div className="flex items-center gap-3">
                            {request.status === 'DELIVERED' ? (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            ) : (
                              <Clock className="w-5 h-5 text-yellow-400" />
                            )}
                            <div>
                              <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                                {request.poemType.replace('_', ' ')}
                              </p>
                              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                                {request.deliveredAt 
                                  ? `Delivered ${formatDate(request.deliveredAt)}`
                                  : `Requested ${formatDate(request.createdAt)}`
                                }
                              </p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action */}
                {order.poemsRemaining > 0 && order.status === 'PAID' && (
                  <div className={`mt-6 pt-6 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                    <Link
                      href={`/request?orderId=${order.id}`}
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${isDark ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                      style={{ fontFamily: 'Nunito, sans-serif' }}
                    >
                      <Mail className="w-4 h-4" />
                      Request Another Poem
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className={`transition-colors ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}