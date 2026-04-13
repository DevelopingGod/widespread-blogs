import { Category } from './database.types';

// Fallback static config used when DB is unavailable (SSG, build time, etc.)
export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: '1',
    slug: 'astronomy',
    label: 'Astronomy',
    description: 'Explore the cosmos — stars, galaxies, black holes, and everything beyond our world.',
    icon: '🔭',
    hero_image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&q=80',
    gradient: 'from-indigo-500 to-purple-600',
    sort_order: 1,
    created_at: '',
  },
  {
    id: '2',
    slug: 'nature',
    label: 'Nature',
    description: 'Discover the breathtaking wonders of the natural world around us.',
    icon: '🌿',
    hero_image: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1200&q=80',
    gradient: 'from-green-500 to-teal-600',
    sort_order: 2,
    created_at: '',
  },
  {
    id: '3',
    slug: 'science',
    label: 'Science',
    description: 'Dive deep into scientific discoveries, experiments, and breakthroughs.',
    icon: '🔬',
    hero_image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=1200&q=80',
    gradient: 'from-blue-500 to-cyan-600',
    sort_order: 3,
    created_at: '',
  },
  {
    id: '4',
    slug: 'fictional',
    label: 'Fictional Imagination',
    description: 'Unleash your creativity — stories, worlds, and characters born from imagination.',
    icon: '✨',
    hero_image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1200&q=80',
    gradient: 'from-purple-500 to-pink-600',
    sort_order: 4,
    created_at: '',
  },
];

export function getCategoryFromList(slug: string, categories: Category[]): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
