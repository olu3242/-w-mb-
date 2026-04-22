import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ówàmbẹ̀ — Give. Plan. Celebrate.',
  description: 'Unified platform for gifting, planning, and executing any occasion.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
