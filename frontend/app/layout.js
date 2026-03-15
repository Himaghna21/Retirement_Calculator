import '@/styles/variables.css';
import '@/app/globals.css';

export const metadata = {
  title: 'HDFC Retirement Planning Calculator',
  description: 'Calculate your retirement corpus and required monthly SIP for illustration purposes only.',
  keywords: ['retirement', 'planning', 'calculator', 'SIP', 'corpus', 'HDFC'],
  authors: [
    {
      name: 'HDFC',
      url: 'https://www.hdfc.com',
    },
  ],
  creator: 'HDFC',
  publisher: 'HDFC',
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://your-domain.com',
    siteName: 'HDFC Retirement Planning Calculator',
    title: 'HDFC Retirement Planning Calculator',
    description: 'Plan your retirement with our illustrative calculator. Calculate corpus and SIP requirements.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'HDFC Retirement Planning Calculator',
        type: 'image/png',
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'HDFC Retirement Planning Calculator',
    description: 'Calculate your retirement corpus and required monthly SIP',
    images: ['/images/twitter-image.png'],
    creator: '@HDFC',
  },
  
  // Additional Meta
  viewport: 'width=device-width, initial-scale=1.0',
  themeColor: '#224c87',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'HDFC Retirement Calc',
  },
  
  // Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  
  // Manifest
  manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external services */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet" />
        
        {/* Preload local fonts if they exist, but Google Fonts is primary now for Montserrat */}
      </head>
      <body>{children}</body>
    </html>
  );
}