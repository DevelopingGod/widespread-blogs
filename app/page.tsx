import Link from 'next/link';
import Image from 'next/image';
import { createServerClient } from '@/lib/supabase-server';
import { DEFAULT_CATEGORIES } from '@/lib/categories';
import type { Category, Blog } from '@/lib/database.types';
import CategoryCard from '@/components/CategoryCard';
import BlogCard from '@/components/BlogCard';
import { PenLine, ArrowRight, Bell } from 'lucide-react';

async function getData(): Promise<{ categories: Category[]; recentBlogs: Blog[] }> {
  try {
    const supabase = createServerClient();
    const [{ data: rawCats }, { data: rawBlogs }] = await Promise.all([
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('blogs').select('*').order('created_at', { ascending: false }).limit(6),
    ]);
    return {
      categories: (rawCats as Category[] | null)?.length ? (rawCats as Category[]) : DEFAULT_CATEGORIES,
      recentBlogs: (rawBlogs as Blog[] | null) ?? [],
    };
  } catch {
    return { categories: DEFAULT_CATEGORIES, recentBlogs: [] };
  }
}

export default async function HomePage() {
  const { categories, recentBlogs } = await getData();

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-dark">
        <Image
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=80"
          alt="Hero"
          fill
          className="object-cover opacity-30"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/60 via-brand-dark/40 to-brand-dark" />

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <span className="inline-block bg-brand-teal/20 border border-brand-teal/40 text-brand-teal text-sm font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
            A Community Blogging Platform
          </span>
          <h1 className="font-montserrat font-extrabold text-5xl md:text-7xl leading-tight mb-6">
            Widespread{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-cyan-300">
              Blogs
            </span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Explore ideas across {categories.slice(0, 4).map((c) => c.label).join(', ')}, and more.
            Share your thoughts with readers around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/blogs/create" className="btn-primary text-base px-8 py-4">
              <PenLine size={18} /> Start Writing
            </Link>
            <Link href="#categories" className="btn-outline text-base px-8 py-4">
              Browse Blogs <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Scroll indicator — hidden on small screens to avoid overlap with stacked buttons */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block z-10">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section id="categories" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-montserrat font-bold text-4xl text-gray-900 mb-3">Explore Categories</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              The distinct worlds of knowledge and creativity — pick your passion and dive in.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => <CategoryCard key={cat.slug} category={cat} />)}
          </div>
        </div>
      </section>

      {/* ── Recent Blogs ── */}
      {recentBlogs.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="font-montserrat font-bold text-4xl text-gray-900 mb-2">Latest Posts</h2>
                <p className="text-gray-500">Fresh ideas from our community.</p>
              </div>
              <Link href={`/blogs/${categories[0]?.slug ?? 'astronomy'}`} className="text-brand-teal font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                View all <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentBlogs.map((blog) => {
                const cat = categories.find((c) => c.slug === blog.category);
                return <BlogCard key={blog.id} blog={blog} category={cat} />;
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Newsletter ── */}
      <section className="py-16 px-4 bg-gray-50 border-y border-gray-100">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-teal/15 rounded-2xl mb-5">
            <Bell size={24} className="text-brand-teal" />
          </div>
          <h2 className="font-montserrat font-bold text-3xl text-gray-900 mb-3">
            Stay in the loop
          </h2>
          <p className="text-gray-500 mb-6">
            Our newsletter is coming soon. Drop your email and we&apos;ll notify you the moment it launches.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="you@example.com"
              className="input-field flex-1"
              disabled
            />
            <button
              disabled
              className="bg-brand-teal text-brand-dark font-bold px-6 py-3 rounded-xl opacity-60 cursor-not-allowed whitespace-nowrap"
            >
              Notify Me
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3">🚀 Newsletter launching soon. No spam, ever.</p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 bg-gradient-to-br from-brand-dark via-slate-800 to-brand-navy text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-montserrat font-bold text-4xl mb-4">Ready to share your story?</h2>
          <p className="text-white/70 mb-8 text-lg">Join our community. Your ideas deserve an audience.</p>
          <Link href="/auth/register" className="btn-primary text-base px-10 py-4">
            Create Free Account <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
