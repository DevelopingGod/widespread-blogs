export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SplashScreen from '@/components/SplashScreen';
import { Toaster } from 'react-hot-toast';
import { createServerClient } from '@/lib/supabase-server';
import { DEFAULT_CATEGORIES } from '@/lib/categories';
import type { Category } from '@/lib/database.types';

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let initialCategories: Category[] = DEFAULT_CATEGORIES;
  try {
    const supabase = createServerClient();
    const { data } = await supabase.from('categories').select('*').order('sort_order');
    if (data?.length) initialCategories = data as Category[];
  } catch {
    // Fall back to DEFAULT_CATEGORIES if DB is unreachable
  }

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <SplashScreen />
        <Navbar initialCategories={initialCategories} />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </body>
    </html>
  );
}
