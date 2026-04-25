import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/auth-context'

export const metadata: Metadata = {
  title: 'ScamShield - Analyze Suspicious Text Before You Trust It',
  description: 'Paste suspicious messages and get instant scam risk analysis. Detect SMS scams, WhatsApp fraud, phishing emails, fake job offers, and more.',
  keywords: ['scam detection', 'phishing', 'fraud prevention', 'SMS scam', 'cybersecurity'],
}

export const viewport: Viewport = {
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
