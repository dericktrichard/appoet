'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Send, 
  Mail, 
  Clock, 
  FileText,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';
import { getAuthToken } from '@/lib/admin-auth';
import Link from 'next/link';

interface PoemRequest {
  id: string;
  poemType: string;
  theme: string;
  tone: string | null;
  constraints: string | null;
  status: string;
  poemContent: string | null;
  createdAt: string;
  estimatedDelivery: string | null;
  order: {
    orderNumber: string;
    email: string;
    tier: {
      name: string;
      deliveryHours: number;
    };
  };
}

export default function FulfillPoemPage() {
  const router = useRouter();
  const params = useParams();
  const requestId = params.requestId as string;

  const [request, setRequest] = useState<PoemRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [poemTitle, setPoemTitle] = useState('');
  const [poemContent, setPoemContent] = useState('');
  const [markingInProgress, setMarkingInProgress] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/admin');
      return;
    }

    const loadRequest = async () => {
      try {
        const response = await fetch(`/api/admin/requests/${requestId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          router.push('/admin');
          return;
        }

        if (response.ok) {
          const data = await response.json();
          setRequest(data);
          if (data.poemContent) {
            setPoemContent(data.poemContent);
          }
        } else {
          setError('Failed to load request');
        }
      } catch {
        setError('Failed to load request');
      } finally {
        setLoading(false);
      }
    };

    loadRequest();
  }, [router, requestId]);

  const handleMarkInProgress = async () => {
    const token = getAuthToken();
    if (!token) return;

    setMarkingInProgress(true);
    try {
      const response = await fetch('/api/admin/fulfill', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId,
          status: 'IN_PROGRESS',
        }),
      });

      if (response.ok) {
        setRequest(prev => prev ? { ...prev, status: 'IN_PROGRESS' } : null);
      }
    } catch {
      console.error('Failed to update status');
    } finally {
      setMarkingInProgress(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!poemContent.trim()) {
      setError('Please write the poem content');
      return;
    }

    const token = getAuthToken();
    if (!token) {
      router.push('/admin');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/fulfill', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId,
          poemContent: poemContent.trim(),
          poemTitle: poemTitle.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 2000);
      } else {
        setError(data.error || 'Failed to deliver poem');
      }
    } catch {
      setError('Failed to deliver poem');
    } finally {
      setSubmitting(false);
    }
  };

  const formatPoemType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
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
          <Loader className="w-12 h-12 text-slate-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-600" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Loading request...
          </p>
        </div>
      </div>
    );
  }

  if (error && !request) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
            Error Loading Request
          </h1>
          <p className="text-slate-600 mb-6" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {error}
          </p>
          <Link
            href="/admin/dashboard"
            className="inline-block px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
            Poem Delivered!
          </h2>
          <p className="text-slate-600" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Redirecting to dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!request) return null;

  const isDelivered = request.status === 'DELIVERED';

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
            {isDelivered ? 'View Delivered Poem' : 'Fulfill Poem Request'}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Request Details Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-slate-200 sticky top-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                Request Details
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Order Number
                  </p>
                  <p className="text-sm font-mono text-slate-900">
                    {request.order.orderNumber.slice(0, 12)}...
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Customer Email
                  </p>
                  <p className="text-sm text-slate-900 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {request.order.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Poem Type
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    {formatPoemType(request.poemType)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Theme
                  </p>
                  <p className="text-sm text-slate-900">
                    {request.theme}
                  </p>
                </div>

                {request.tone && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      Tone
                    </p>
                    <p className="text-sm text-slate-900">
                      {request.tone}
                    </p>
                  </div>
                )}

                {request.constraints && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      Additional Details
                    </p>
                    <p className="text-sm text-slate-900">
                      {request.constraints}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-slate-500 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Requested
                  </p>
                  <p className="text-sm text-slate-900 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(request.createdAt)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Status
                  </p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                    request.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {request.status.replace('_', ' ')}
                  </span>
                </div>

                {request.status === 'PENDING' && (
                  <button
                    onClick={handleMarkInProgress}
                    disabled={markingInProgress}
                    className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium"
                    style={{ fontFamily: 'Nunito, sans-serif' }}
                  >
                    {markingInProgress ? 'Updating...' : 'Mark as In Progress'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Poem Editor */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                {isDelivered ? 'Delivered Poem' : 'Write Poem'}
              </h2>

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    {error}
                  </p>
                </div>
              )}

              <div className="space-y-6">
                {/* Poem Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                    Poem Title <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={poemTitle}
                    onChange={(e) => setPoemTitle(e.target.value)}
                    placeholder="e.g., Morning Reflections"
                    disabled={isDelivered}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-600"
                    style={{ fontFamily: 'Philosopher, Georgia, serif' }}
                  />
                </div>

                {/* Poem Content */}
                <div>
                  <label htmlFor="content" className="block text-sm font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Philosopher, Georgia, serif' }}>
                    Poem Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="content"
                    value={poemContent}
                    onChange={(e) => setPoemContent(e.target.value)}
                    rows={16}
                    placeholder="Write the poem here..."
                    disabled={isDelivered}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-600 font-serif text-lg leading-relaxed"
                    style={{ fontFamily: 'Philosopher, Georgia, serif' }}
                    required
                  />
                  <p className="text-xs text-slate-500 mt-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    {poemContent.split('\n').length} lines • {poemContent.trim().split(/\s+/).length} words
                  </p>
                </div>

                {!isDelivered && (
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={submitting || !poemContent.trim()}
                      className="flex-1 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
                      style={{ fontFamily: 'Nunito, sans-serif' }}
                    >
                      {submitting ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Delivering...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Deliver Poem
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {!isDelivered && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900 flex items-start gap-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      Once you click &quot;Deliver Poem&quot;, the poem will be emailed to the customer at <strong>{request.order.email}</strong> and marked as complete.
                    </span>
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}