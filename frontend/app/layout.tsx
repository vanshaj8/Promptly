import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Promptly - Replies, right on time',
  description: 'Replies, right on time. Manage Instagram comments and mentions from a single dashboard.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}

