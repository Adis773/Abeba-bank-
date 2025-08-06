import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'Abeba Bank — Новый банк будущего без налогов и с огромными бонусами',
  description: 'Abeba Bank — революционный онлайн-банк: нулевые налоги, нулевые комиссии, огромные бонусы до 5%. Присоединяйся и получай +10$ за регистрацию! Швейцарская защита данных.',
  keywords: 'Abeba Bank, новый банк, банк будущего, без налогов, онлайн-банк, бонусы, криптобанк, Abebabank, абеба банк, без комиссии, бонус за регистрацию, швейцарская защита',
  authors: [{ name: 'Abeba Bank Team' }],
  creator: 'Abeba Bank',
  publisher: 'Abeba Bank',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://abebabank.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Abeba Bank — Банк будущего без налогов',
    description: 'Новая финансовая эра. Огромные бонусы, нулевая комиссия, без налогов. +10$ за регистрацию.',
    url: 'https://abebabank.vercel.app',
    siteName: 'Abeba Bank',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Abeba Bank - Банк будущего',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abeba Bank — Банк будущего',
    description: 'Нулевые налоги, огромные бонусы, швейцарская защита. +10$ за регистрацию!',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '4eTTB18477nZaOFQX-U_Cb6nDtAyGDmocV22_JBsJaU',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
