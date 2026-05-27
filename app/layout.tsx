import type { Metadata } from 'next'
import './globals.css'

const siteUrl = 'https://fastwebsites.agency'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Fast Websites — Award-Winning Web Agency',
    template: '%s | Fast Websites',
  },
  description: 'We build beautiful, high-performance websites that drive results. Digital design & development for ambitious brands.',
  keywords: ['web design agency', 'web development', 'digital design', 'high-performance websites', 'conversion optimization'],
  authors: [{ name: 'Fast Websites' }],
  creator: 'Fast Websites',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Fast Websites',
    title: 'Fast Websites — Award-Winning Web Agency',
    description: 'We build beautiful, high-performance websites that drive results. Digital design & development for ambitious brands.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fast Websites — Award-Winning Web Agency',
    description: 'We build beautiful, high-performance websites that drive results. Digital design & development for ambitious brands.',
  },
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">✦</text></svg>',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Fast Websites',
  url: siteUrl,
  description: 'Digital design & development agency building high-performance websites for ambitious brands.',
  sameAs: [],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Fast Websites',
  url: siteUrl,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {children}
      </body>
    </html>
  )
}
