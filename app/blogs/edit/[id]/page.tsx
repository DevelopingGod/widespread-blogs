'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { DEFAULT_CATEGORIES } from '@/lib/categories';
import { Category } from '@/lib/database.types';
import toast from 'react-hot-toast';
import { Save, ImageIcon, AlertTriangle, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [isFlagged, setIsFlagged] = useState(false);
  const [flagReason, setFlagReason] = useState('');

  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    supabase.from('categories').select('*').order('sort_order').then(({ data }) => {
      if (data?.length) setCategories(data);
    });
  }, [supabase]);

  useEffect(() => {
    const load = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) { router.push('/auth/login'); return; }
      setUser(currentUser);

      const { data: blog, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !blog) { setNotFound(true); setFetching(false); return; }
      if (blog.user_id !== currentUser.id) { setUnauthorized(true); setFetching(false); return; }

      // Pre-fill form
      setTitle(blog.title);
      setAuthorName(blog.author_name);
      setImageUrl(blog.image_url);
      setImagePreview(blog.image_url);
      setContent((blog.content as string).replace(/<br\s*\/?>/gi, '\n'));
      setCategory(blog.category);
      setIsFlagged(blog.is_flagged ?? false);
      setFlagReason(blog.flag_reason ?? '');
      setFetching(false);
    };
    load();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (content.trim().length < 200) { toast.error('Content must be at least 200 characters.'); return; }

    setLoading(true);

    try {
      const res = await fetch('/api/blogs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          title:       title.trim(),
          author_name: authorName.trim(),
          image_url:   imageUrl.trim(),
          content:     content.trim().replace(/\n/g, '<br />'),
          category,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) { toast.error(data.error ?? 'Failed to save. Please try again.'); return; }
    } catch {
      setLoading(false);
      toast.error('Network error — please try again.');
      return;
    }

    toast.success('Post updated successfully!');
    window.location.href = '/dashboard';
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-teal" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 px-4">
        <div className="max-w-md w-full text-center bg-white rounded-3xl shadow-lg p-10">
          <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="font-montserrat font-bold text-2xl mb-2">Post Not Found</h2>
          <p className="text-gray-500 mb-6">This post doesn&apos;t exist or has been deleted.</p>
          <Link href="/dashboard" className="btn-primary justify-center">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 px-4">
        <div className="max-w-md w-full text-center bg-white rounded-3xl shadow-lg p-10">
          <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
          <h2 className="font-montserrat font-bold text-2xl mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-6">You can only edit your own posts.</p>
          <Link href="/dashboard" className="btn-primary justify-center">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const selectedCat = categories.find((c) => c.slug === category);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-navy transition-colors">
            <ArrowLeft size={15} /> Back to Dashboard
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="font-montserrat font-extrabold text-4xl text-gray-900 mb-2">Edit Post</h1>
          <p className="text-gray-500">Update your blog post below.</p>
        </div>

        {/* Flag notice */}
        {isFlagged && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <AlertTriangle size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-orange-700 text-sm">This post was flagged by an admin</p>
              <p className="text-orange-600 text-sm mt-0.5">Reason: <strong>{flagReason}</strong></p>
              <p className="text-orange-500 text-xs mt-1">
                Edit your post to address the issue, then save. The admin will review it.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-lg p-8 space-y-6">
          {/* Category picker */}
          <div>
            <label className="label">Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setCategory(cat.slug)}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border-2 text-sm font-semibold transition-all ${
                    category === cat.slug
                      ? 'border-brand-teal bg-brand-teal/10 text-brand-navy'
                      : 'border-gray-200 text-gray-600 hover:border-brand-teal/50'
                  }`}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-center leading-tight">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Blog Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" required />
          </div>

          <div>
            <label className="label">Your Name</label>
            <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} className="input-field" required />
          </div>

          <div>
            <label className="label flex items-center gap-2"><ImageIcon size={15} /> Cover Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onBlur={() => { if (imageUrl.startsWith('http')) setImagePreview(imageUrl); }}
              className="input-field"
              required
            />
            {imagePreview && (
              <div className="mt-3 rounded-xl overflow-hidden h-40 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" onError={() => setImagePreview('')} />
              </div>
            )}
          </div>

          <div>
            <label className="label">Your Blog</label>
            <p className="text-xs text-gray-400 mb-2">Minimum 200 characters.</p>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Edit your ${selectedCat?.label ?? 'blog'} here…`}
              rows={12}
              className="input-field resize-y leading-relaxed"
              required
            />
            <div className={`text-xs mt-1 ${content.length < 200 ? 'text-red-400' : 'text-green-500'}`}>
              {content.length} characters {content.length < 200 ? `(${200 - content.length} more needed)` : '✓'}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || content.length < 200}
            className="w-full btn-primary justify-center py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Saving…
              </span>
            ) : (
              <><Save size={18} /> Save Changes</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
