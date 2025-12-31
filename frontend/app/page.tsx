'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { authAPI } from '@/lib/api';
import { routes } from '@/lib/routes';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      // Verify token and redirect based on role
      authAPI.getMe()
        .then(({ user }) => {
          if (user.role === 'ADMIN') {
            router.push(routes.adminBrands);
          } else {
            router.push(routes.dashboard);
          }
        })
        .catch(() => {
          router.push(routes.login);
        });
    } else {
      router.push(routes.login);
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
      <p className="text-sm text-gray-500">Loading Promptly</p>
      <p className="text-xs text-primary-600 font-medium mt-1">Replies, right on time</p>
    </div>
  );
}

