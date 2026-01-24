import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FacebookMessenger from '@/components/FacebookMessenger';

const inter = Inter({ subsets: ['latin'], variable: '--font-main' });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  title: "Ryan's Auto Solution",
  description: 'Quality used cars and trucks.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${orbitron.variable}`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
        <FacebookMessenger />
      </body>
    </html>
  );
}
