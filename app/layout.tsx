import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
export const metadata: Metadata = { title: 'JiraHub — Work, in one place', description: 'A connected workspace for teams to plan and ship together.', generator: 'v0.app' }
export const viewport: Viewport = { colorScheme: 'light', themeColor: '#f6f5f4' }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" className="bg-background"><body className={`${inter.variable} antialiased`}>{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html> }
