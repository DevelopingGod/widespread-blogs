import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SplashScreen from '@/components/SplashScreen';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Widespread Blogs',
  description:
    'A community blogging platform covering Astronomy, Nature, Science, AI, Technology, and more.',
  keywords: ['blog', 'astronomy', 'nature', 'science', 'AI', 'technology', 'writing', 'community'],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'Widespread Blogs',
    description: 'Share your ideas with the world.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <SplashScreen />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </body>
    </html>
  );
}
