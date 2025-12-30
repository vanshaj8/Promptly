'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { authAPI } from '@/lib/api';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      // Verify token and redirect based on role
      authAPI.getMe()
        .then(({ user }) => {
          if (user.role === 'ADMIN') {
            router.push('/admin');
          } else {
            router.push('/dashboard');
          }
        })
        .catch(() => {
          router.push('/login');
        });
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );
}

