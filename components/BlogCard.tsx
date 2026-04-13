import Link from 'next/link';
import Image from 'next/image';
import { Blog, Category } from '@/lib/database.types';
import { Calendar, User } from 'lucide-react';

interface BlogCardProps {
  blog: Blog;
  category?: Category;
}

export default function BlogCard({ blog, category }: BlogCardProps) {
  const preview = blog.content.replace(/<[^>]*>/g, '').slice(0, 180);
  const gradient = category?.gradient ?? 'from-gray-500 to-gray-700';
  const icon     = category?.icon ?? '📝';
  const label    = category?.label ?? blog.category;

  return (
    <Link
      href={`/blogs/${blog.category}/${blog.id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={blog.image_url}
          alt={blog.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        {blog.is_flagged && (
          <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            ⚑ Flagged
          </span>
        )}
        <span className={`absolute top-3 left-3 bg-gradient-to-r ${gradient} text-white text-xs font-bold px-3 py-1 rounded-full`}>
          {icon} {label}
        </span>
      </div>
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-montserrat font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-brand-navy transition-colors">
          {blog.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-3">{preview}…</p>
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1"><User size={12} />{blog.author_name}</span>
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {new Date(blog.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>
    </Link>
  );
}
