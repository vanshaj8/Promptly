// Centralized routing configuration
export const routes = {
  // Auth routes
  login: '/login',
  logout: '/logout',
  
  // Brand user routes
  dashboard: '/dashboard',
  inbox: '/dashboard/inbox',
  instagramAccount: '/dashboard/instagram',
  activity: '/dashboard/activity',
  
  // Admin routes
  adminBrands: '/admin/brands',
  adminUsers: '/admin/users',
  adminLogs: '/admin/logs',
  
  // Legacy/compatibility routes
  admin: '/admin',
  instagram: '/dashboard/instagram',
} as const;

// Helper function to build query params
export function buildQueryString(params: Record<string, string | undefined>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

// Helper to get route with query params
export function routeWithParams(route: string, params?: Record<string, string | undefined>): string {
  if (!params) return route;
  return `${route}${buildQueryString(params)}`;
}

