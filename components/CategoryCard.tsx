import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/lib/database.types';
import { ArrowRight } from 'lucide-react';

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/blogs/${category.slug}`}
      className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
    >
      <div className="relative h-64">
        <Image
          src={category.hero_image}
          alt={category.label}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          unoptimized
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent`} />
      </div>
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
        <span className="text-3xl mb-2">{category.icon}</span>
        <h3 className="font-montserrat font-bold text-2xl mb-1">{category.label}</h3>
        <p className="text-white/70 text-sm leading-relaxed line-clamp-2 mb-3">{category.description}</p>
        <span className="flex items-center gap-2 text-brand-teal font-semibold text-sm group-hover:gap-3 transition-all">
          Explore <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
}
