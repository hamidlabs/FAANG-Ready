import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAANG Interview Prep - Master System Design & Algorithms',
  description: 'Comprehensive preparation for FAANG technical interviews with systematic learning approach',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-dark-100 text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}