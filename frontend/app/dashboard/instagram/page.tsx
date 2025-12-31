'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { instagramAPI, InstagramAccount } from '@/lib/api';
import { Card, CardBody, Button, Badge, LoadingSpinner } from '@/components/ui';
import { routes } from '@/lib/routes';

export default function InstagramPage() {
  const router = useRouter();
  const [account, setAccount] = useState<InstagramAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  useEffect(() => {
    loadAccount();
    
    // Check for OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    
    if (success === 'true') {
      alert('Instagram account connected successfully!');
      loadAccount();
      window.history.replaceState({}, '', routes.instagramAccount);
    } else if (error) {
      alert(`Connection failed: ${error}`);
      window.history.replaceState({}, '', routes.instagramAccount);
    }
  }, []);

  const loadAccount = async () => {
    try {
      setLoading(true);
      const data = await instagramAPI.getAccount();
      setAccount(data.account);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error('Failed to load Instagram account:', error);
      }
      setAccount(null);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setConnecting(true);
      const { authUrl } = await instagramAPI.getConnectUrl();
      window.location.href = authUrl;
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to initiate connection');
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect your Instagram account?')) {
      return;
    }

    try {
      setDisconnecting(true);
      await instagramAPI.disconnect();
      setAccount(null);
      alert('Instagram account disconnected');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to disconnect');
    } finally {
      setDisconnecting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Instagram Account</h1>
          <p className="text-gray-600 mb-1">Manage your Instagram Business account integration</p>
          <p className="text-sm font-medium text-primary-600">Replies, right on time</p>
        </div>

        {account ? (
          <Card>
            <CardBody className="p-8">
              <div className="flex items-start space-x-6 mb-6">
                {account.profile_picture_url && (
                  <img
                    src={account.profile_picture_url}
                    alt={account.username}
                    className="w-20 h-20 rounded-full border-2 border-gray-200"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">@{account.username}</h2>
                    <Badge variant={account.is_connected ? 'success' : 'error'}>
                      {account.is_connected ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Instagram Business account connected to Promptly
                  </p>
                  {account.last_sync_at && (
                    <p className="text-sm text-gray-500">
                      Last synced: {new Date(account.last_sync_at).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-1">Connection Status</h3>
                  <p className="text-sm text-gray-600">
                    Your account is {account.is_connected ? 'actively connected' : 'disconnected'}. 
                    {account.is_connected && ' You can manage comments and replies.'}
                  </p>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  variant="primary"
                  onClick={handleConnect}
                  isLoading={connecting}
                  disabled={account.is_connected}
                >
                  Reconnect
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDisconnect}
                  isLoading={disconnecting}
                >
                  Disconnect
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardBody className="p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📸</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Instagram Account</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Connect your Instagram Business account to start managing comments and mentions 
                  from a single dashboard.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">What you'll need:</h3>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>An Instagram Business account</li>
                  <li>A Facebook Page connected to your Instagram account</li>
                  <li>Admin access to the Facebook Page</li>
                </ul>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleConnect}
                isLoading={connecting}
                className="w-full"
              >
                Connect Instagram Account
              </Button>
            </CardBody>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
