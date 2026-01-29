'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Feather, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  LogOut,
  Mail,
  Calendar,
  Sun,
  Moon
} from 'lucide-react';
import { getAuthToken, clearAuthToken } from '@/lib/admin-auth';
import Link from 'next/link';

interface PoemRequest {
  id: string;
  poemType: string;
  theme: string;
  tone: string | null;
  status: string;
  createdAt: string;
  estimatedDelivery: string | null;
  order: {
    orderNumber: string;
    email: string;
    tier: {
      name: string;
    };
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<PoemRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
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

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/admin');
      return;
    }

    const loadRequests = async () => {
      try {
        const url = filter === 'all' 
          ? '/api/admin/requests'
          : `/api/admin/requests?status=${filter}`;

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          clearAuthToken();
          router.push('/admin');
          return;
        }

        if (response.ok) {
          const data = await response.json();
          setRequests(data);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, [router, filter]);

  const handleLogout = () => {
    clearAuthToken();
    router.push('/admin');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'DELIVERED': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-4 h-4" />;
      case 'IN_PROGRESS': return <FileText className="w-4 h-4" />;
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />;
      case 'DELIVERED': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatPoemType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
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

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${isDark ? 'bg-black' : 'bg-white'}`}>
        <div className="text-center">
          <Feather className={`w-12 h-12 animate-pulse mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'} style={{ fontFamily: 'Nunito, sans-serif' }}>
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  const pendingCount = requests.filter(r => r.status === 'PENDING').length;
  const inProgressCount = requests.filter(r => r.status === 'IN_PROGRESS').length;
  const completedCount = requests.filter(r => r.status === 'COMPLETED' || r.status === 'DELIVERED').length;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-black' : 'bg-white'}`}>
      {/* Header */}
      <header className={`transition-colors duration-300 ${isDark ? 'bg-slate-900/50 border-b border-white/10' : 'bg-white border-b border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Feather className={`w-8 h-8 ${isDark ? 'text-white' : 'text-slate-900'}`} />
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                Appoet Admin
              </h1>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                Poem Request Management
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
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
            <button
              onClick={handleLogout}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isDark 
                  ? 'text-slate-400 hover:text-white hover:bg-white/10' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className={`rounded-xl p-6 border transition-colors ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Pending
                </p>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                  {pendingCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`rounded-xl p-6 border transition-colors ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                  In Progress
                </p>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                  {inProgressCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-xl p-6 border transition-colors ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Completed
                </p>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                  {completedCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {['all', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELIVERED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? isDark ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
                  : isDark ? 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-white/10' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </header>

      {/* Requests List */}
      <div className={`transition-colors duration-300 ${isDark ? 'bg-black' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="space-y-4">
          {requests.length === 0 ? (
            <div className={`rounded-xl p-12 text-center border transition-colors ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}>
              <FileText className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} />
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'} style={{ fontFamily: 'Nunito, sans-serif' }}>
                No poem requests found
              </p>
            </div>
          ) : (
            requests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-xl p-6 border transition-colors ${isDark ? 'bg-slate-900 border-white/10 hover:border-white/20' : 'bg-white border-slate-200 hover:border-slate-300'}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                        {formatPoemType(request.poemType)}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {request.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className={`mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                      {request.theme}
                    </p>
                    {request.tone && (
                      <p className={`text-sm mb-3 ${isDark ? 'text-slate-500' : 'text-slate-500'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                        Tone: {request.tone}
                      </p>
                    )}
                  </div>
                </div>

                <div className={`flex items-center justify-between text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <span>{request.order.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>Order #{request.order.orderNumber.slice(0, 8)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(request.createdAt)}</span>
                    </div>
                  </div>

                  <Link
                    href={`/admin/fulfill/${request.id}`}
                    className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                      isDark 
                        ? 'bg-white text-slate-900 hover:bg-slate-100' 
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {request.status === 'PENDING' ? 'Start Writing' : 'View Details'}
                  </Link>
                </div>
              </motion.div>
            ))
          )}
          </div>
        </div>
      </div>
    </div>
  );
}