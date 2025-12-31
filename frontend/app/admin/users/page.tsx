'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardBody, LoadingSpinner, Badge, EmptyState } from '@/components/ui';

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement user management API
    setLoading(false);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600 mb-1">Manage users and their permissions</p>
          <p className="text-sm font-medium text-primary-600">Replies, right on time</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <Card>
            <CardBody>
              <EmptyState
                icon="👥"
                title="User Management"
                description="User management features will be available soon. For now, users are managed through brand assignments."
              />
            </CardBody>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

