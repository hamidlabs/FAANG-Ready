import './globals.css'
import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

export const metadata: Metadata = {
  title: 'FAANG Interview Prep - Master System Design & Algorithms',
  description: 'World\'s most addictive FAANG interview preparation platform with AI mentor, gamification, and interactive coding practice',
  keywords: 'FAANG, interview, preparation, algorithms, system design, coding, tech jobs, Google, Apple, Facebook, Amazon, Netflix',
  authors: [{ name: 'FAANG Prep Team' }],
  creator: 'FAANG Prep',
  publisher: 'FAANG Prep',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FAANG Prep',
  },
  openGraph: {
    type: 'website',
    title: 'FAANG Interview Prep - Master Your Tech Interviews',
    description: 'AI-powered learning platform for FAANG interviews with gamification',
    siteName: 'FAANG Prep',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAANG Interview Prep',
    description: 'Master tech interviews with AI mentor & gamification',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-dark-100 text-white min-h-screen">
        <TooltipProvider>
          {children}
          <Toaster 
            theme="dark" 
            position="bottom-center"
            richColors
            closeButton
          />
        </TooltipProvider>
      </body>
    </html>
  )
}