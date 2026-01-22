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
  Calendar
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Feather className="w-12 h-12 text-slate-400 animate-pulse mx-auto mb-4" />
          <p className="text-slate-600" style={{ fontFamily: 'Nunito, sans-serif' }}>
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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Feather className="w-8 h-8 text-slate-900" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                Appoet Admin
              </h1>
              <p className="text-sm text-slate-600" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Poem Request Management
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Pending
                </p>
                <p className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
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
            className="bg-white rounded-xl p-6 border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  In Progress
                </p>
                <p className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
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
            className="bg-white rounded-xl p-6 border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Completed
                </p>
                <p className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
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
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600" style={{ fontFamily: 'Nunito, sans-serif' }}>
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
                className="bg-white rounded-xl p-6 border border-slate-200 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900" style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                        {formatPoemType(request.poemType)}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {request.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-slate-600 mb-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      {request.theme}
                    </p>
                    {request.tone && (
                      <p className="text-sm text-slate-500 mb-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
                        Tone: {request.tone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-600" style={{ fontFamily: 'Nunito, sans-serif' }}>
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
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
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
  );
}