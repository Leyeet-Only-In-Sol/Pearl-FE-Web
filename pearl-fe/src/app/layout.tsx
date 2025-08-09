import './globals.css'
import { Inter } from 'next/font/google'
import { SuiProvider } from '@/providers/SuiProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Pearl',
  description: 'A simple DeFi platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SuiProvider>
          {children}
        </SuiProvider>
      </body>
    </html>
  )
}