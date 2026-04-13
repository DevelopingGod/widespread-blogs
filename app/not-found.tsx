import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4 text-white text-center">
      <div>
        <p className="text-8xl font-montserrat font-extrabold text-brand-teal">404</p>
        <h1 className="text-3xl font-bold mt-4 mb-2">Page not found</h1>
        <p className="text-white/60 mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/" className="btn-primary">
            <Home size={16} /> Go Home
          </Link>
          <Link href="/blogs/astronomy" className="btn-outline">
            <Search size={16} /> Browse Blogs
          </Link>
        </div>
      </div>
    </div>
  );
}
