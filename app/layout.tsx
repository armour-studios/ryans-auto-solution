import type { Metadata, Viewport } from 'next';
import { Tinos } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FacebookMessenger from '@/components/FacebookMessenger';

const tinos = Tinos({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-tinos'
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#111111',
};

export const metadata: Metadata = {
  title: {
    default: "Ryan's Auto Solution | Quality Used Cars in Bemidji, MN",
    template: "%s | Ryan's Auto Solution",
  },
  description: 'Quality used cars and trucks in Bemidji, Minnesota. Serving Northern Minnesota with reliable vehicles and financing assistance.',
  keywords: ['used cars', 'trucks', 'Bemidji', 'Minnesota', 'Ryan Auto Solution', 'financing', 'auto dealer'],
  authors: [{ name: "Ryan's Auto Solution" }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: "Ryan's Auto Solution",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={tinos.variable} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
        <FacebookMessenger />
      </body>
    </html>
  );
}
