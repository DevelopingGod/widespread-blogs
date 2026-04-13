import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase-server';
import BlogCard from '@/components/BlogCard';
import type { Blog, Category } from '@/lib/database.types';
import { PenLine, BookOpen } from 'lucide-react';

interface Props { params: { category: string } }

async function getCategory(slug: string): Promise<Category | null> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase.from('categories').select('*').eq('slug', slug).single();
    return data as Category | null;
  } catch { return null; }
}

async function getBlogs(category: string): Promise<Blog[]> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase.from('blogs').select('*').eq('category', category).order('created_at', { ascending: false });
    return (data as Blog[] | null) ?? [];
  } catch { return []; }
}

export async function generateMetadata({ params }: Props) {
  const category = await getCategory(params.category);
  if (!category) return {};
  return { title: `${category.label} Blogs — Widespread Blogs`, description: category.description };
}

export default async function CategoryPage({ params }: Props) {
  const [category, blogs] = await Promise.all([getCategory(params.category), getBlogs(params.category)]);
  if (!category) notFound();

  return (
    <>
      <section className="relative h-72 md:h-96 flex items-end overflow-hidden">
        <Image src={category.hero_image} alt={category.label} fill className="object-cover" unoptimized priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pb-10 text-white">
          <span className="text-4xl mb-3 block">{category.icon}</span>
          <h1 className="font-montserrat font-extrabold text-4xl md:text-5xl mb-2">{category.label}</h1>
          <p className="text-white/75 max-w-lg">{category.description}</p>
        </div>
      </section>

      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-gray-500 flex items-center gap-2">
            <BookOpen size={15} />{blogs.length} {blogs.length === 1 ? 'post' : 'posts'}
          </span>
          <Link href="/blogs/create" className="btn-primary text-sm py-2 px-5">
            <PenLine size={14} /> Write in {category.label}
          </Link>
        </div>
      </div>

      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => <BlogCard key={blog.id} blog={blog} category={category} />)}
            </div>
          ) : (
            <div className="text-center py-24">
              <span className="text-6xl block mb-4">{category.icon}</span>
              <h3 className="font-montserrat font-bold text-2xl text-gray-700 mb-2">No posts yet</h3>
              <p className="text-gray-400 mb-8">Be the first to write about {category.label}!</p>
              <Link href="/blogs/create" className="btn-primary"><PenLine size={16} /> Write the first post</Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
