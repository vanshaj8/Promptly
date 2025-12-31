'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { routes } from '@/lib/routes';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to brands page
    router.replace(routes.adminBrands);
  }, [router]);

  return null;
}
