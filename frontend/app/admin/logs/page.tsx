'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { adminAPI } from '@/lib/api';
import { Card, CardBody, LoadingSpinner, Badge, EmptyState } from '@/components/ui';

interface ActivityLog {
  id: number;
  admin_user_id: number;
  action_type: string;
  target_type: string;
  target_id: number | null;
  details: any;
  created_at: string;
  admin_email?: string;
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getLogs();
      setLogs(data.logs || []);
    } catch (error) {
      console.error('Failed to load logs:', error);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Logs</h1>
          <p className="text-gray-600 mb-1">Track all administrative actions and system activity</p>
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
                description="Activity logs will appear here once administrative actions are performed."
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
                          {log.target_id && (
                            <span className="text-sm text-gray-500">(ID: {log.target_id})</span>
                          )}
                        </div>
                        {log.admin_email && (
                          <p className="text-sm text-gray-600 mb-2">By: {log.admin_email}</p>
                        )}
                        {log.details && typeof log.details === 'object' && (
                          <div className="mt-2">
                            <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto border border-gray-200">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 ml-4 whitespace-nowrap">
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
