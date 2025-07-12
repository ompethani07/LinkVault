import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '../styles/themes.css'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { themeScript } from '@/lib/theme-script'
import ClientOnly from '@/components/ClientOnly'
import LoadingBar from '@/components/LoadingBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LinkVault - Professional Link Management',
  description: 'Secure and professional link management platform',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <script dangerouslySetInnerHTML={{ __html: themeScript }} />
          <GoogleAnalytics />
          <script src="https://accounts.google.com/gsi/client" async defer />
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-your-ad-client-id" crossOrigin="anonymous"></script>
        </head>
        <body className={inter.className}>
          <LoadingBar />
          <ClientOnly>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </ClientOnly>
        </body>
      </html>
    </ClerkProvider>
  )
}
