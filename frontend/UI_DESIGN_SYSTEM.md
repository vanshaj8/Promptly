# UI Design System

This document outlines the modern, production-ready UI structure for Promptly.

## Design Principles

1. **Premium & Professional**: Clean, modern aesthetic with attention to detail
2. **Intuitive**: Clear navigation and user-friendly interactions
3. **Scalable**: Component-based architecture for easy maintenance
4. **Accessible**: WCAG-compliant components with proper focus states
5. **Responsive**: Mobile-first design that works on all devices

## Color System

### Primary Colors
- **Primary 500**: `#0ea5e9` - Main brand color
- **Primary 600**: `#0284c7` - Hover states, active elements
- **Primary 700**: `#0369a1` - Darker variants

### Semantic Colors
- **Success**: Green (`#22c55e`) - Positive actions, connected states
- **Error**: Red (`#ef4444`) - Errors, warnings, disconnected states
- **Warning**: Yellow (`#f59e0b`) - Warnings, pending states
- **Info**: Blue (`#3b82f6`) - Informational messages

### Neutral Colors
- **Gray Scale**: 50-900 for backgrounds, text, borders
- **White**: Pure white for cards and elevated surfaces

## Typography

- **Font Family**: System font stack for optimal performance
- **Headings**: Bold, clear hierarchy
- **Body**: Regular weight, optimal line height for readability

## Component Library

### Button
```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md" isLoading={false}>
  Click me
</Button>
```

**Variants**: `primary`, `secondary`, `ghost`, `danger`  
**Sizes**: `sm`, `md`, `lg`

### Card
```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui';

<Card hover>
  <CardHeader>Header</CardHeader>
  <CardBody>Content</CardBody>
  <CardFooter>Footer</CardFooter>
</Card>
```

### Input
```tsx
import { Input } from '@/components/ui';

<Input
  label="Email"
  type="email"
  error="Error message"
  helperText="Helper text"
/>
```

### Badge
```tsx
import { Badge } from '@/components/ui';

<Badge variant="success">Connected</Badge>
```

**Variants**: `success`, `error`, `warning`, `info`, `gray`

### EmptyState
```tsx
import { EmptyState } from '@/components/ui';

<EmptyState
  icon="📭"
  title="No comments yet"
  description="Comments will appear here once you connect Instagram"
  action={{ label: "Connect Instagram", onClick: handleConnect }}
/>
```

### LoadingSpinner
```tsx
import { LoadingSpinner } from '@/components/ui';

<LoadingSpinner size="md" />
```

**Sizes**: `sm`, `md`, `lg`

## Layout Structure

### DashboardLayout
Main layout component that provides:
- Top navigation bar with logo and user info
- Responsive sidebar navigation
- Mobile-friendly hamburger menu
- Status indicators
- Consistent spacing and padding

### Page Structure
```
/app
  /login          - Authentication page
  /dashboard      - Main dashboard (brand users)
  /dashboard/inbox - Comments inbox
  /dashboard/instagram - Instagram settings
  /admin          - Admin dashboard
  /admin/logs     - Activity logs
```

## CSS Utilities

### Custom Classes
- `.btn` - Base button styles
- `.card` - Card container
- `.input` - Form input
- `.badge` - Status badge
- `.nav-link` - Navigation link
- `.spinner` - Loading spinner
- `.skeleton` - Loading skeleton

### Animation Classes
- `.animate-fade-in` - Fade in animation
- `.animate-slide-up` - Slide up animation
- `.animate-scale-in` - Scale in animation

### Scrollbar Styling
- `.scrollbar-thin` - Custom thin scrollbar

## Best Practices

1. **Use Components**: Always use the component library instead of raw HTML
2. **Consistent Spacing**: Use Tailwind spacing scale (4, 8, 12, 16, etc.)
3. **Color Consistency**: Use design system colors, not arbitrary values
4. **Responsive Design**: Mobile-first approach with `sm:`, `md:`, `lg:` breakpoints
5. **Loading States**: Always show loading indicators for async operations
6. **Error Handling**: Display user-friendly error messages
7. **Accessibility**: Include proper ARIA labels and keyboard navigation

## Responsive Breakpoints

- **sm**: 640px - Small tablets
- **md**: 768px - Tablets
- **lg**: 1024px - Desktops
- **xl**: 1280px - Large desktops

## Animation Guidelines

- **Fast**: 150ms - Hover states, quick feedback
- **Base**: 200ms - Standard transitions
- **Slow**: 300ms - Page transitions, modal animations

## Shadow System

- **sm**: Subtle elevation
- **md**: Card elevation
- **lg**: Modal elevation
- **soft**: Soft, premium shadow
- **soft-lg**: Large soft shadow

## Usage Examples

### Creating a New Page
```tsx
'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardBody, Button } from '@/components/ui';

export default function MyPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Page Title</h1>
          <Button variant="primary">Action</Button>
        </div>
        
        <Card>
          <CardBody>
            {/* Content */}
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
```

### Creating a Form
```tsx
import { Input, Button, Card, CardBody } from '@/components/ui';

<Card>
  <CardBody>
    <form className="space-y-4">
      <Input label="Name" required />
      <Input label="Email" type="email" required />
      <Button type="submit" variant="primary">Submit</Button>
    </form>
  </CardBody>
</Card>
```

## Future Enhancements

- [ ] Modal/Dialog component
- [ ] Toast notification system
- [ ] Dropdown/Select component
- [ ] Table component with sorting/filtering
- [ ] Date picker component
- [ ] Rich text editor
- [ ] Chart components for analytics

