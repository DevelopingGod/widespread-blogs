import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-server';
import Link from 'next/link';
import Image from 'next/image';
import { PenLine, FileText, AlertTriangle, Ban, CheckCircle, Calendar, LayoutDashboard, ExternalLink, Flag } from 'lucide-react';
import UserBlogActions from '@/components/UserBlogActions';
import type { Blog, Profile } from '@/lib/database.types';

export const metadata = { title: 'My Dashboard — Widespread Blogs' };

export default async function DashboardPage() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const [{ data: rawProfile }, { data: rawBlogs }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('blogs').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
  ]);

  const profile = rawProfile as Profile | null;
  const myBlogs = rawBlogs as Blog[] | null;

  const flaggedBlogs = myBlogs?.filter((b) => b.is_flagged) ?? [];
  const activeBlogs  = myBlogs?.filter((b) => !b.is_flagged) ?? [];

  return (
    <div className="pt-20 min-h-screen bg-gray-50 pb-16">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-teal/20 flex items-center justify-center text-2xl font-extrabold text-brand-navy">
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-montserrat font-extrabold text-2xl text-gray-900">{profile?.name}</h1>
              <p className="text-gray-400 text-sm">{profile?.email}</p>
            </div>
          </div>
          <Link href="/blogs/create" className="btn-primary text-sm py-2.5 px-5 self-start sm:self-auto">
            <PenLine size={15} /> Write New Blog
          </Link>
        </div>

        {profile?.is_banned && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6 flex items-start gap-4">
            <Ban size={22} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-red-700 mb-1">Your account has been banned</h3>
              <p className="text-red-600 text-sm">You cannot post new content. Reason: <strong>{profile.ban_reason}</strong></p>
              <p className="text-red-400 text-xs mt-1">If you believe this is a mistake, contact us at widespreadblogs@gmail.com.</p>
            </div>
          </div>
        )}

        {profile?.is_flagged && !profile?.is_banned && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-6 flex items-start gap-4">
            <AlertTriangle size={22} className="text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-yellow-700 mb-1">Your account has been flagged</h3>
              <p className="text-yellow-600 text-sm">Reason: <strong>{profile.flag_reason}</strong></p>
              <p className="text-yellow-500 text-xs mt-1">Please review our community guidelines.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Posts',   value: myBlogs?.length ?? 0, icon: FileText,    color: 'text-blue-500'   },
            { label: 'Active Posts',  value: activeBlogs.length,   icon: CheckCircle, color: 'text-green-500'  },
            { label: 'Flagged Posts', value: flaggedBlogs.length,  icon: Flag,        color: 'text-orange-500' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm">
              <Icon size={22} className={`${color} mb-2`} />
              <div className="text-3xl font-extrabold text-gray-900">{value}</div>
              <div className="text-sm text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {flaggedBlogs.length > 0 && (
          <div className="mb-8">
            <h2 className="font-montserrat font-bold text-xl text-gray-800 mb-3 flex items-center gap-2">
              <AlertTriangle size={18} className="text-orange-500" /> Posts Requiring Attention
            </h2>
            <div className="space-y-3">
              {flaggedBlogs.map((blog) => (
                <div key={blog.id} className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={blog.image_url} alt={blog.title} fill className="object-cover" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">{blog.title}</h3>
                    <p className="text-orange-600 text-sm mt-0.5">⚑ Flagged: <strong>{blog.flag_reason}</strong></p>
                    <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(blog.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex flex-col gap-1 items-center">
                    <Link href={`/blogs/${blog.category}/${blog.id}`} className="text-gray-400 hover:text-brand-navy transition-colors p-1" title="View">
                      <ExternalLink size={15} />
                    </Link>
                    <Link href={`/blogs/edit/${blog.id}`} className="text-orange-400 hover:text-orange-600 transition-colors p-1" title="Edit to address flag">
                      <PenLine size={15} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="font-montserrat font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
            <LayoutDashboard size={18} className="text-brand-teal" /> My Posts
          </h2>
          {myBlogs?.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
              <FileText size={40} className="mx-auto text-gray-300 mb-4" />
              <h3 className="font-semibold text-gray-600 mb-2">No posts yet</h3>
              <p className="text-gray-400 text-sm mb-6">Share your first idea with the world!</p>
              <Link href="/blogs/create" className="btn-primary text-sm"><PenLine size={14} /> Write Your First Blog</Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-left text-xs text-gray-500 uppercase tracking-wide">
                    <th className="px-5 py-3">Post</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {myBlogs?.map((blog) => (
                    <tr key={blog.id} className={`hover:bg-gray-50 ${blog.is_flagged ? 'bg-orange-50/30' : ''}`}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                            <Image src={blog.image_url} alt={blog.title} fill className="object-cover" unoptimized />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 truncate max-w-[200px]">{blog.title}</p>
                            {blog.flag_reason && <p className="text-xs text-orange-500 truncate max-w-[200px]">⚑ {blog.flag_reason}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full capitalize">{blog.category}</span>
                      </td>
                      <td className="px-5 py-3 text-gray-400 whitespace-nowrap">
                        {new Date(blog.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-3">
                        {blog.is_flagged
                          ? <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2.5 py-1 rounded-full">Flagged</span>
                          : <span className="bg-green-100 text-green-600 text-xs font-bold px-2.5 py-1 rounded-full">Active</span>}
                      </td>
                      <td className="px-5 py-3">
                        <UserBlogActions
                          blogId={blog.id}
                          category={blog.category}
                          isFlagged={blog.is_flagged}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
