'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { commentsAPI } from '@/lib/api';
import { Card, CardBody, LoadingSpinner, Button } from '@/components/ui';
import { routes, routeWithParams } from '@/lib/routes';

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
        total: allData.pagination?.total || allData.comments.length,
        open: openData.pagination?.total || openData.comments.length,
        replied: repliedData.pagination?.total || repliedData.comments.length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    description, 
    icon, 
    color, 
    onClick 
  }: { 
    title: string; 
    value: number; 
    description: string; 
    icon: string; 
    color: string;
    onClick: () => void;
  }) => (
    <Card 
      hover 
      onClick={onClick}
      className="cursor-pointer transition-all duration-200"
    >
      <CardBody className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            {title}
          </h3>
          <span className="text-3xl">{icon}</span>
        </div>
        <div className="flex items-baseline space-x-2">
          <p className={`text-4xl font-bold ${color}`}>{value}</p>
        </div>
        <p className="text-sm text-gray-500 mt-3">{description}</p>
        <div className="mt-4 flex items-center text-sm text-primary-600 font-medium">
          View details
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600 mb-1">Monitor your Instagram engagement at a glance</p>
          <p className="text-sm font-medium text-primary-600">Replies, right on time</p>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Total Comments"
              value={stats.total}
              description="All comments received"
              icon="💬"
              color="text-gray-900"
              onClick={() => router.push(routeWithParams(routes.inbox, { filter: 'all' }))}
            />
            <StatCard
              title="Open Comments"
              value={stats.open}
              description="Awaiting your response"
              icon="⚡"
              color="text-yellow-600"
              onClick={() => router.push(routeWithParams(routes.inbox, { filter: 'open' }))}
            />
            <StatCard
              title="Replied"
              value={stats.replied}
              description="Successfully responded"
              icon="✓"
              color="text-green-600"
              onClick={() => router.push(routeWithParams(routes.inbox, { filter: 'replied' }))}
            />
          </div>
        )}

        {/* Quick Actions */}
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                <p className="text-sm text-gray-500 mt-1">Common tasks and shortcuts</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                onClick={() => router.push(routeWithParams(routes.inbox, { filter: 'open' }))}
              >
                View Open Comments
              </Button>
              <Button
                variant="secondary"
                onClick={() => router.push(routes.inbox)}
              >
                View All Comments
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push(routes.instagramAccount)}
              >
                Instagram Settings
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
