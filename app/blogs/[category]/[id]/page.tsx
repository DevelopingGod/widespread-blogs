import { cache } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase-server';
import { Calendar, User, ArrowLeft, PenLine, AlertTriangle } from 'lucide-react';
import type { Metadata } from 'next';
import type { Blog, Category } from '@/lib/database.types';

interface Props { params: { category: string; id: string } }

async function getBlogWithCategory(id: string) {
  try {
    const supabase = createServerClient();
    // Fetch blog and its category in parallel
    const { data: rawBlog } = await supabase.from('blogs').select('*').eq('id', id).single();
    const blog = rawBlog as Blog | null;
    if (!blog) return { blog: null, category: null };
    const { data: rawCat } = await supabase.from('categories').select('*').eq('slug', blog.category).single();
    return { blog, category: rawCat as Category | null };
  } catch { return { blog: null, category: null }; }
}

// Cache the result per request so generateMetadata + page share one fetch
const getBlogCached = cache(getBlogWithCategory);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { blog } = await getBlogCached(params.id);
  if (!blog) return {};
  return {
    title: `${blog.title} — Widespread Blogs`,
    description: blog.content.replace(/<[^>]*>/g, '').slice(0, 160),
    openGraph: { title: blog.title, images: [blog.image_url] },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { blog, category } = await getBlogCached(params.id);
  if (!blog) notFound();

  const gradient = category?.gradient ?? 'from-gray-500 to-gray-700';
  const icon     = category?.icon ?? '📝';
  const label    = category?.label ?? blog.category;

  return (
    <article className="pt-20 min-h-screen bg-white">
      <div className="relative h-72 md:h-[480px] overflow-hidden">
        <Image src={blog.image_url} alt={blog.title} fill className="object-cover" unoptimized priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 pb-8 text-white">
          <Link href={`/blogs/${blog.category}`} className={`inline-flex items-center gap-1.5 bg-gradient-to-r ${gradient} text-white text-xs font-bold px-3 py-1 rounded-full mb-4`}>
            {icon} {label}
          </Link>
          <h1 className="font-montserrat font-extrabold text-3xl md:text-5xl leading-tight drop-shadow-lg">{blog.title}</h1>
          <div className="flex items-center gap-5 mt-4 text-white/80 text-sm">
            <span className="flex items-center gap-1.5"><User size={14} />{blog.author_name}</span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {new Date(blog.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {blog.is_flagged && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-8 flex items-start gap-3">
            <AlertTriangle size={18} className="text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-orange-700">This post has been flagged by moderators.</p>
              {blog.flag_reason && <p className="text-sm text-orange-600 mt-0.5">Reason: {blog.flag_reason}</p>}
            </div>
          </div>
        )}

        <div
          className="prose prose-lg prose-gray max-w-none prose-headings:font-montserrat prose-headings:font-bold prose-a:text-brand-teal prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href={`/blogs/${blog.category}`} className="flex items-center gap-2 text-gray-500 hover:text-brand-navy font-semibold text-sm transition-colors">
            <ArrowLeft size={16} /> Back to {label}
          </Link>
          <Link href="/blogs/create" className="btn-primary text-sm py-2.5 px-6">
            <PenLine size={14} /> Write your own blog
          </Link>
        </div>
      </div>
    </article>
  );
}
