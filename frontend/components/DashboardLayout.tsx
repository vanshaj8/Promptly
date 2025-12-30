'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { authAPI, User, brandAPI, instagramAPI, Brand, InstagramAccount } from '@/lib/api';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [instagramAccount, setInstagramAccount] = useState<InstagramAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    Promise.all([
      authAPI.getMe(),
      loadBrandData(),
      loadInstagramStatus(),
    ])
      .then(([{ user }]) => {
        setUser(user);
        setLoading(false);
      })
      .catch(() => {
        Cookies.remove('token');
        router.push('/login');
      });
  }, [router]);

  const loadBrandData = async () => {
    try {
      const { brand } = await brandAPI.getMe();
      setBrand(brand);
    } catch (error) {
      // Brand might not exist for admin users
      console.error('Failed to load brand:', error);
    }
  };

  const loadInstagramStatus = async () => {
    try {
      const { account } = await instagramAPI.getAccount();
      setInstagramAccount(account);
    } catch (error) {
      // Instagram might not be connected
      setInstagramAccount(null);
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const isAdmin = user?.role === 'ADMIN';

  // Sidebar navigation items
  const sidebarItems = isAdmin
    ? [
        { href: '/admin', label: 'Brand Management', icon: '🏢' },
        { href: '/admin/logs', label: 'System Logs', icon: '📋' },
      ]
    : [
        { href: '/dashboard', label: 'Dashboard', icon: '📊' },
        { href: '/dashboard/inbox', label: 'Inbox', icon: '📥' },
        { href: '/dashboard/instagram', label: 'Instagram', icon: '📸' },
      ];

  const getInstagramStatus = () => {
    if (isAdmin) return null;
    if (!instagramAccount) {
      return { text: 'Not Connected', color: 'text-red-600', bg: 'bg-red-100' };
    }
    if (!instagramAccount.is_connected) {
      return { text: 'Disconnected', color: 'text-red-600', bg: 'bg-red-100' };
    }
    return { text: 'Connected', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const instagramStatus = getInstagramStatus();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo */}
            <div className="flex items-center">
              <Link href={isAdmin ? '/admin' : '/dashboard'} className="flex items-center">
                <h1 className="text-xl font-bold text-primary-600">Promptly</h1>
              </Link>
              
              {/* Current Brand (only for brand users) */}
              {!isAdmin && brand && (
                <div className="ml-8 flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Brand:</span>
                  <span className="text-sm font-medium text-gray-900">{brand.name}</span>
                </div>
              )}
            </div>

            {/* Right: Instagram Status and User Profile */}
            <div className="flex items-center space-x-6">
              {/* Instagram Connection Status (only for brand users) */}
              {!isAdmin && instagramStatus && (
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${instagramStatus.bg} ${instagramStatus.color}`}>
                    Instagram: {instagramStatus.text}
                  </span>
                </div>
              )}

              {/* User Profile */}
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.full_name || user?.email}</p>
                  <p className="text-xs text-gray-500">{user?.role === 'ADMIN' ? 'Administrator' : 'Brand User'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Left Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
