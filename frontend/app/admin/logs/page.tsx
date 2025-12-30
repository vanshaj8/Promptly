'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { adminAPI } from '@/lib/api';

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
      setLogs(data.logs);
    } catch (error) {
      console.error('Failed to load logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Logs</h1>
        <p className="text-gray-600 mb-8">Track all administrative actions and system activity</p>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No activity logs found</div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {logs.map((log) => (
                <li key={log.id} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900">{log.action_type}</span>
                        <span className="text-sm text-gray-500">on</span>
                        <span className="text-sm text-gray-700">{log.target_type}</span>
                        {log.target_id && (
                          <span className="text-sm text-gray-500">(ID: {log.target_id})</span>
                        )}
                      </div>
                      {log.admin_email && (
                        <p className="text-sm text-gray-600">By: {log.admin_email}</p>
                      )}
                      {log.details && typeof log.details === 'object' && (
                        <div className="mt-2 text-sm text-gray-500">
                          <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-2">{formatDate(log.created_at)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

