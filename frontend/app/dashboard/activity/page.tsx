'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { adminAPI } from '@/lib/api';
import { Card, CardBody, LoadingSpinner, Badge } from '@/components/ui';
import { EmptyState } from '@/components/ui';

interface ActivityLog {
  id: number;
  action_type: string;
  target_type: string;
  target_id: number | null;
  details: any;
  created_at: string;
  admin_user_id: number;
}

export default function ActivityPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivityLogs();
  }, []);

  const loadActivityLogs = async () => {
    try {
      setLoading(true);
      // For brand users, we might need a different endpoint
      // For now, using admin endpoint - this should be updated with proper brand user activity endpoint
      const data = await adminAPI.getLogs({ limit: 50 });
      setLogs(data.logs || []);
    } catch (error) {
      console.error('Failed to load activity logs:', error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getActionBadgeVariant = (actionType: string) => {
    if (actionType === 'CREATE') return 'success';
    if (actionType === 'UPDATE') return 'info';
    if (actionType === 'DELETE') return 'error';
    return 'gray';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Activity Logs</h1>
          <p className="text-gray-600 mb-1">View recent activity and system events</p>
          <p className="text-sm font-medium text-primary-600">Replies, right on time</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : logs.length === 0 ? (
          <Card>
            <CardBody>
              <EmptyState
                icon="📋"
                title="No activity logs"
                description="Activity logs will appear here once actions are performed in the system."
              />
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardBody className="p-0">
              <div className="divide-y divide-gray-200">
                {logs.map((log) => (
                  <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge variant={getActionBadgeVariant(log.action_type)}>
                            {log.action_type}
                          </Badge>
                          <span className="text-sm font-medium text-gray-900">
                            {log.target_type}
                          </span>
                        </div>
                        {log.details && (
                          <p className="text-sm text-gray-600 mt-1">
                            {JSON.stringify(log.details)}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 ml-4">
                        {formatDate(log.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

