'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { authAPI, User, brandAPI, instagramAPI, Brand, InstagramAccount } from '@/lib/api';
import { routes } from '@/lib/routes';
import { Badge, LoadingSpinner } from './ui';
import Logo from './Logo';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push(routes.login);
      return;
    }

    // Load user first to determine role
    authAPI.getMe()
      .then(({ user }) => {
        setUser(user);
        
        // Route guard: Check if user has access to current route
        if (user.role === 'ADMIN' && pathname?.startsWith('/dashboard')) {
          router.push(routes.adminBrands);
          setLoading(false);
          return;
        } else if (user.role === 'BRAND_USER' && pathname?.startsWith('/admin')) {
          router.push(routes.dashboard);
          setLoading(false);
          return;
        }
        
        // Only load brand and Instagram data for brand users
        if (user.role === 'BRAND_USER') {
          Promise.all([
            loadBrandData(),
            loadInstagramStatus(),
          ])
            .then(() => {
              setLoading(false);
            })
            .catch(() => {
              setLoading(false);
            });
        } else {
          // Admin users don't need brand/instagram data
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Failed to get user:', error);
        // Only redirect to login if it's an auth error, not a network error
        if (error.response?.status === 401 || error.response?.status === 403) {
          Cookies.remove('token');
          router.push(routes.login);
        } else {
          // For other errors, still set loading to false so page can render
          setLoading(false);
        }
      });
  }, [router, pathname]);

  const loadBrandData = async () => {
    try {
      const { brand } = await brandAPI.getMe();
      setBrand(brand);
    } catch (error: any) {
      // Silently fail for admin users (expected) or 403 errors
      if (error.response?.status !== 403) {
        console.error('Failed to load brand:', error);
      }
    }
  };

  const loadInstagramStatus = async () => {
    try {
      const { account } = await instagramAPI.getAccount();
      setInstagramAccount(account);
    } catch (error: any) {
      // Silently fail for admin users (expected) or 403 errors
      if (error.response?.status !== 403) {
        console.error('Failed to load Instagram account:', error);
      }
      setInstagramAccount(null);
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    router.push(routes.login);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  const isAdmin = user?.role === 'ADMIN';

  // Brand user sidebar items
  const brandSidebarItems = [
    { href: routes.dashboard, label: 'Dashboard', icon: '📊', description: 'Overview' },
    { href: routes.inbox, label: 'Inbox', icon: '📥', description: 'View all comments' },
    { href: routes.instagramAccount, label: 'Instagram Account', icon: '📸', description: 'Manage connection' },
    { href: routes.activity, label: 'Activity', icon: '📋', description: 'View activity logs' },
  ];

  // Admin sidebar items
  const adminSidebarItems = [
    { href: routes.adminBrands, label: 'Brands', icon: '🏢', description: 'Manage brands' },
    { href: routes.adminUsers, label: 'Users', icon: '👥', description: 'Manage users' },
    { href: routes.adminLogs, label: 'Logs', icon: '📋', description: 'View system logs' },
  ];

  const sidebarItems = isAdmin ? adminSidebarItems : brandSidebarItems;

  const getInstagramStatus = () => {
    if (isAdmin) return null;
    if (!instagramAccount || !instagramAccount.is_connected) {
      return { text: 'Not Connected', variant: 'error' as const };
    }
    return { text: 'Connected', variant: 'success' as const };
  };

  const instagramStatus = getInstagramStatus();

  // Determine home route based on role
  const homeRoute = isAdmin ? routes.adminBrands : routes.dashboard;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo and Mobile Menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                aria-label="Toggle sidebar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {/* Logo - always routes to home */}
              <Logo href={homeRoute} size="md" />
              
              {!isAdmin && brand && (
                <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                  <span className="text-xs text-gray-500 font-medium">Brand</span>
                  <span className="text-sm font-semibold text-gray-900">{brand.name}</span>
                </div>
              )}
            </div>

            {/* Right: Status and User Profile */}
            <div className="flex items-center space-x-4">
              {!isAdmin && instagramStatus && (
                <Link 
                  href={routes.instagramAccount}
                  className="hidden sm:flex items-center"
                >
                  <Badge variant={instagramStatus.variant}>
                    <span className={`status-dot status-dot-${instagramStatus.variant} mr-1.5`}></span>
                    {instagramStatus.text}
                  </Badge>
                </Link>
              )}

              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-gray-900">{user?.full_name || user?.email}</p>
                  <p className="text-xs text-gray-500">{user?.role === 'ADMIN' ? 'Administrator' : 'Brand User'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Logout"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-50
            w-64 bg-white border-r border-gray-200
            transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            transition-transform duration-300 ease-in-out
            lg:flex lg:flex-col
            h-[calc(100vh-4rem)] lg:h-auto
          `}
        >
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    nav-link ${isActive ? 'nav-link-active' : ''}
                    group
                  `}
                >
                  <span className="mr-3 text-xl">{item.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    {item.description && (
                      <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                    )}
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-600"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-500">
              <p className="font-medium text-gray-700 mb-1">Promptly v1.0</p>
              <p className="text-primary-600 font-medium">Replies, right on time</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <div className="animate-fade-in">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
