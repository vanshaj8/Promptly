'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { commentsAPI, Comment } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    replied: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [allData, openData, repliedData] = await Promise.all([
        commentsAPI.getAll(),
        commentsAPI.getAll('OPEN'),
        commentsAPI.getAll('REPLIED'),
      ]);

      setStats({
        total: allData.pagination.total || allData.comments.length,
        open: openData.pagination.total || openData.comments.length,
        replied: repliedData.pagination.total || repliedData.comments.length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMetricClick = (status?: 'OPEN' | 'REPLIED') => {
    const params = status ? `?status=${status}` : '';
    router.push(`/dashboard/inbox${params}`);
  };

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600 mb-8">Quick status of your Instagram engagement</p>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Comments */}
            <button
              onClick={() => handleMetricClick()}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-primary-300 transition-all text-left cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Total Comments</h3>
                <span className="text-2xl">💬</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500 mt-2">All comments received</p>
            </button>

            {/* Open Comments */}
            <button
              onClick={() => handleMetricClick('OPEN')}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-yellow-300 transition-all text-left cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Open Comments</h3>
                <span className="text-2xl">⚡</span>
              </div>
              <p className="text-3xl font-bold text-yellow-600">{stats.open}</p>
              <p className="text-sm text-gray-500 mt-2">Need attention</p>
            </button>

            {/* Replied Comments */}
            <button
              onClick={() => handleMetricClick('REPLIED')}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-green-300 transition-all text-left cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Replied</h3>
                <span className="text-2xl">✓</span>
              </div>
              <p className="text-3xl font-bold text-green-600">{stats.replied}</p>
              <p className="text-sm text-gray-500 mt-2">Completed</p>
            </button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/dashboard/inbox?status=OPEN')}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              View Open Comments
            </button>
            <button
              onClick={() => router.push('/dashboard/inbox')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              View All Comments
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
