import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Promptly - Instagram Brand Engagement',
  description: 'Manage Instagram comments and mentions from a single dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

