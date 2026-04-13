'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { Menu, X, PenLine, LogOut, LogIn, UserPlus, LayoutDashboard, Shield, ChevronDown } from 'lucide-react';
import { Category } from '@/lib/database.types';
import { DEFAULT_CATEGORIES } from '@/lib/categories';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [blogsOpen, setBlogsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);

  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    supabase.from('categories').select('*').order('sort_order').then(({ data }) => {
      if (data?.length) setCategories(data);
    });
  }, [supabase]);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', data.user.id)
          .single();
        setIsAdmin(profile?.is_admin ?? false);
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange(async (_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        setIsAdmin(profile?.is_admin ?? false);
      } else {
        setIsAdmin(false);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = () => {
    // Clear local session state immediately — don't await the network call
    setUser(null);
    setIsAdmin(false);
    // Fire signOut in the background (clears server session)
    supabase.auth.signOut({ scope: 'local' }).catch(() => {});
    // Redirect instantly without waiting
    window.location.href = '/';
  };

  const textClass = scrolled ? 'text-gray-700' : 'text-white';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-white shadow-lg h-16' : 'bg-brand-dark border-b border-white/20 h-20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className={`font-montserrat font-bold text-2xl transition-colors duration-300 ${
            scrolled ? 'text-brand-dark' : 'text-white'
          }`}
        >
          Widespread Blogs
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className={`px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-all duration-300 border-b-2 ${
              pathname === '/'
                ? 'border-brand-teal text-brand-teal'
                : `border-transparent ${textClass} hover:text-brand-teal hover:border-brand-teal`
            }`}
          >
            Home
          </Link>

          {/* Blogs dropdown */}
          <div className="relative" onMouseEnter={() => setBlogsOpen(true)} onMouseLeave={() => setBlogsOpen(false)}>
            <button
              className={`flex items-center gap-1 px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-all duration-300 border-b-2 ${
                pathname.startsWith('/blogs')
                  ? 'border-brand-teal text-brand-teal'
                  : `border-transparent ${textClass} hover:text-brand-teal hover:border-brand-teal`
              }`}
            >
              Blogs <ChevronDown size={13} className={`transition-transform ${blogsOpen ? 'rotate-180' : ''}`} />
            </button>
            {blogsOpen && (
              <div className="absolute top-full left-0 bg-white shadow-xl rounded-2xl py-2 min-w-[200px] border border-gray-100 z-50">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/blogs/${cat.slug}`}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-navy transition-colors"
                  >
                    <span>{cat.icon}</span> {cat.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-purple-700 transition-colors"
                >
                  <Shield size={14} /> Admin
                </Link>
              )}
              <Link
                href="/dashboard"
                className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
                  scrolled ? 'text-gray-700 hover:text-brand-navy' : 'text-white/80 hover:text-white'
                }`}
              >
                <LayoutDashboard size={15} /> Dashboard
              </Link>
              <Link
                href="/blogs/create"
                className="flex items-center gap-2 bg-brand-teal text-brand-dark px-4 py-2 rounded-full text-sm font-bold hover:bg-teal-400 transition-colors"
              >
                <PenLine size={15} /> Write
              </Link>
              <button
                onClick={handleLogout}
                className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
                  scrolled ? 'text-gray-500 hover:text-red-500' : 'text-white/60 hover:text-red-400'
                }`}
              >
                <LogOut size={15} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
                  scrolled ? 'text-gray-700 hover:text-brand-teal' : 'text-white hover:text-brand-teal'
                }`}
              >
                <LogIn size={15} /> Login
              </Link>
              <Link
                href="/auth/register"
                className="flex items-center gap-2 bg-brand-teal text-brand-dark px-4 py-2 rounded-full text-sm font-bold hover:bg-teal-400 transition-colors"
              >
                <UserPlus size={15} /> Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className={`md:hidden transition-colors ${scrolled ? 'text-brand-dark' : 'text-white'}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-brand-dark border-t border-white/10 px-4 py-4 flex flex-col gap-1 max-h-[80vh] overflow-y-auto">
          <Link href="/" onClick={() => setMenuOpen(false)} className="text-sm font-semibold uppercase text-white py-2 border-b border-white/10">Home</Link>
          <div className="text-xs text-white/40 uppercase tracking-widest pt-2 pb-1 px-1">Categories</div>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blogs/${cat.slug}`}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-sm text-white/80 py-2 pl-2 hover:text-brand-teal"
            >
              {cat.icon} {cat.label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2 border-t border-white/10 mt-1">
            {user ? (
              <>
                {isAdmin && (
                  <Link href="/admin" onClick={() => setMenuOpen(false)} className="bg-purple-600 text-white text-sm font-bold text-center py-2.5 rounded-xl">
                    Admin Panel
                  </Link>
                )}
                <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="text-white text-sm font-semibold text-center py-2">
                  My Dashboard
                </Link>
                <Link href="/blogs/create" onClick={() => setMenuOpen(false)} className="bg-brand-teal text-brand-dark text-sm font-bold text-center py-2.5 rounded-xl">
                  Write a Blog
                </Link>
                <button onClick={handleLogout} className="text-white/60 text-sm font-semibold text-center py-2">Logout</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="text-white text-sm font-semibold text-center py-2">Login</Link>
                <Link href="/auth/register" onClick={() => setMenuOpen(false)} className="bg-brand-teal text-brand-dark text-sm font-bold text-center py-2.5 rounded-xl">
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
