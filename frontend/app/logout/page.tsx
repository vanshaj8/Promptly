'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { routes } from '@/lib/routes';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    Cookies.remove('token');
    router.push(routes.login);
  }, [router]);

  return null;
}

