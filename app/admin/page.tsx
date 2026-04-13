import { createServerClient } from '@/lib/supabase-server';
import { FileText, Users, Flag, Tag, TrendingUp, AlertTriangle, UserX } from 'lucide-react';
import Link from 'next/link';
import type { Blog, Profile } from '@/lib/database.types';

async function getStats() {
  const supabase = createServerClient();
  const [
    { count: totalBlogs },
    { count: totalUsers },
    { count: flaggedBlogs },
    { count: flaggedUsers },
    { count: bannedUsers },
    { count: totalCategories },
    { data: rawRecentBlogs },
    { data: rawRecentUsers },
  ] = await Promise.all([
    supabase.from('blogs').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('blogs').select('*', { count: 'exact', head: true }).eq('is_flagged', true),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_flagged', true),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_banned', true),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('blogs').select('id, title, category, author_name, created_at, is_flagged').order('created_at', { ascending: false }).limit(5),
    supabase.from('profiles').select('id, name, email, created_at, is_flagged, is_banned').order('created_at', { ascending: false }).limit(5),
  ]);

  const recentBlogs = rawRecentBlogs as Pick<Blog, 'id' | 'title' | 'category' | 'author_name' | 'created_at' | 'is_flagged'>[] | null;
  const recentUsers = rawRecentUsers as Pick<Profile, 'id' | 'name' | 'email' | 'created_at' | 'is_flagged' | 'is_banned'>[] | null;

  return { totalBlogs, totalUsers, flaggedBlogs, flaggedUsers, bannedUsers, totalCategories, recentBlogs, recentUsers };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    { label: 'Total Posts',   value: stats.totalBlogs      ?? 0, icon: FileText,      color: 'bg-blue-500',   href: '/admin/posts' },
    { label: 'Total Users',   value: stats.totalUsers      ?? 0, icon: Users,         color: 'bg-green-500',  href: '/admin/users' },
    { label: 'Flagged Posts', value: stats.flaggedBlogs    ?? 0, icon: Flag,          color: 'bg-orange-500', href: '/admin/posts?filter=flagged' },
    { label: 'Flagged Users', value: stats.flaggedUsers    ?? 0, icon: AlertTriangle, color: 'bg-yellow-500', href: '/admin/users?filter=flagged' },
    { label: 'Banned Users',  value: stats.bannedUsers     ?? 0, icon: UserX,         color: 'bg-red-500',    href: '/admin/users?filter=banned' },
    { label: 'Categories',    value: stats.totalCategories ?? 0, icon: Tag,           color: 'bg-purple-500', href: '/admin/categories' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-montserrat font-extrabold text-3xl text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back, Admin. Here&apos;s what&apos;s happening.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {statCards.map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
            <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
              <Icon size={22} />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-gray-900">{value}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp size={17} className="text-brand-teal" /> Recent Posts
            </h2>
            <Link href="/admin/posts" className="text-xs text-brand-teal font-semibold hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {stats.recentBlogs?.map((blog) => (
              <div key={blog.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{blog.title}</p>
                  <p className="text-xs text-gray-400">{blog.author_name} · {blog.category}</p>
                </div>
                {blog.is_flagged && (
                  <span className="flex-shrink-0 text-xs bg-orange-100 text-orange-600 font-semibold px-2 py-0.5 rounded-full">Flagged</span>
                )}
              </div>
            ))}
            {!stats.recentBlogs?.length && <p className="text-sm text-gray-400">No posts yet.</p>}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <Users size={17} className="text-brand-teal" /> Recent Users
            </h2>
            <Link href="/admin/users" className="text-xs text-brand-teal font-semibold hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {stats.recentUsers?.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-teal/20 flex items-center justify-center text-sm font-bold text-brand-navy flex-shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
                {user.is_banned && <span className="flex-shrink-0 text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">Banned</span>}
                {user.is_flagged && !user.is_banned && <span className="flex-shrink-0 text-xs bg-yellow-100 text-yellow-600 font-semibold px-2 py-0.5 rounded-full">Flagged</span>}
              </div>
            ))}
            {!stats.recentUsers?.length && <p className="text-sm text-gray-400">No users yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
