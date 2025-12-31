# Routing Validation Guide

This document validates all routes and navigation in the Promptly application.

## ✅ Logo Integration

- **Location**: Top-left of all pages
- **Component**: `components/Logo.tsx`
- **Click Action**: Routes to home dashboard based on user role
  - Brand users → `/dashboard`
  - Admin users → `/admin/brands`
- **Status**: ✅ Implemented

## ✅ Route Configuration

All routes are centralized in `lib/routes.ts`:

### Auth Routes
- `/login` - Login page ✅
- `/logout` - Logout handler (redirects to login) ✅

### Brand User Routes
- `/dashboard` - Dashboard overview ✅
- `/dashboard/inbox` - Comments inbox ✅
- `/dashboard/inbox?filter=all` - All comments ✅
- `/dashboard/inbox?filter=open` - Open comments ✅
- `/dashboard/inbox?filter=replied` - Replied comments ✅
- `/dashboard/instagram` - Instagram account management ✅
- `/dashboard/activity` - Activity logs ✅

### Admin Routes
- `/admin` - Redirects to `/admin/brands` ✅
- `/admin/brands` - Brand management ✅
- `/admin/users` - User management ✅
- `/admin/logs` - System activity logs ✅

## ✅ Sidebar Navigation

### Brand User Sidebar
- ✅ Dashboard → `/dashboard`
- ✅ Inbox → `/dashboard/inbox`
- ✅ Instagram Account → `/dashboard/instagram`
- ✅ Activity → `/dashboard/activity`

### Admin Sidebar
- ✅ Brands → `/admin/brands`
- ✅ Users → `/admin/users`
- ✅ Logs → `/admin/logs`

## ✅ Top Navigation

- ✅ Logo click → Home dashboard (role-based)
- ✅ Instagram status badge → `/dashboard/instagram` (brand users only)
- ✅ User logout button → `/logout` → `/login`

## ✅ Dashboard Cards

All dashboard stat cards are clickable:
- ✅ Total Comments → `/dashboard/inbox?filter=all`
- ✅ Open Comments → `/dashboard/inbox?filter=open`
- ✅ Replied Comments → `/dashboard/inbox?filter=replied`

## ✅ Inbox Interactions

- ✅ Comment click → Opens detail panel (no route change)
- ✅ Filter buttons → Update query params without page reload
- ✅ Reply button → Sends reply, updates UI, no route change
- ✅ Status updates → UI reflects "REPLIED" status

## ✅ Admin Screen

- ✅ Brand row click → Routes to brand detail (prepared for future)
- ✅ Action buttons → Toggle brand status
- ✅ Create brand → Opens modal (no route change)
- ✅ Filters → Update without page reload

## ✅ Route Guards

- ✅ Brand users cannot access `/admin/*` routes → Redirected to `/dashboard`
- ✅ Admin users cannot access `/dashboard/*` routes → Redirected to `/admin/brands`
- ✅ Unauthenticated users → Redirected to `/login`

## ✅ Query Parameter Handling

- ✅ Inbox filters use `?filter=open` or `?filter=replied`
- ✅ Backward compatible with `?status=OPEN` or `?status=REPLIED`
- ✅ Query params update without page reload

## Testing Checklist

### Logo
- [x] Logo appears in top-left
- [x] Logo routes to correct home page
- [x] Logo works on all pages

### Brand User Navigation
- [x] Dashboard card clicks route correctly
- [x] Sidebar items route correctly
- [x] Instagram badge routes to Instagram page
- [x] Logout works correctly

### Admin Navigation
- [x] Sidebar items route correctly
- [x] Brand cards are clickable
- [x] Logout works correctly

### Route Guards
- [x] Brand users redirected from admin routes
- [x] Admin users redirected from brand routes
- [x] Unauthenticated users redirected to login

### Inbox
- [x] Filters update query params
- [x] Comment selection doesn't change route
- [x] Reply action doesn't change route
- [x] Status updates reflect in UI

## Notes

- All routes use Next.js App Router
- Route guards are implemented in `DashboardLayout`
- Query params are handled with `useSearchParams` hook
- No page reloads for filter changes
- All clickable elements have proper cursor styles

