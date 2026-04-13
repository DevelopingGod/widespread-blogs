'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { DEFAULT_CATEGORIES } from '@/lib/categories';
import { Category } from '@/lib/database.types';
import toast from 'react-hot-toast';
import { PenLine, ImageIcon, Send, AlertCircle, Ban } from 'lucide-react';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';

export default function CreateBlogPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isBanned, setIsBanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);

  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.from('categories').select('*').order('sort_order').then(({ data }) => {
      if (data?.length) {
        setCategories(data);
        setCategory(data[0].slug);
      } else {
        setCategory(DEFAULT_CATEGORIES[0].slug);
      }
    });
  }, [supabase]);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user) {
        if (data.user.user_metadata?.name) setAuthorName(data.user.user_metadata.name);
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_banned, name')
          .eq('id', data.user.id)
          .single();
        setIsBanned(profile?.is_banned ?? false);
        if (profile?.name && !authorName) setAuthorName(profile.name);
      }
      setAuthChecked(true);
    });
  }, [supabase]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error('Please log in to post.'); return; }
    if (isBanned) { toast.error('Your account is banned from posting.'); return; }
    if (content.trim().length < 200) { toast.error('Content must be at least 200 characters.'); return; }
    if (!category) { toast.error('Please select a category.'); return; }

    setLoading(true);

    const blogId = crypto.randomUUID();

    const { error } = await supabase.from('blogs').insert({
      id: blogId,
      title: title.trim(),
      author_name: authorName.trim(),
      image_url: imageUrl.trim(),
      content: content.trim().replace(/\n/g, '<br />'),
      category,
      user_id: user.id,
    });

    setLoading(false);

    if (error) {
      console.error('Blog insert error:', error);
      toast.error('Failed to post: ' + error.message);
      return;
    }

    toast.success('Blog published!');
    router.push(`/blogs/${category}/${blogId}`);
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-teal" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 px-4">
        <div className="max-w-md w-full text-center bg-white rounded-3xl shadow-lg p-10">
          <AlertCircle size={48} className="mx-auto text-brand-teal mb-4" />
          <h2 className="font-montserrat font-bold text-2xl mb-2">Login Required</h2>
          <p className="text-gray-500 mb-8">You need an account to write and publish blogs.</p>
          <div className="flex flex-col gap-3">
            <Link href="/auth/login" className="btn-primary justify-center">Sign In</Link>
            <Link href="/auth/register" className="btn-outline justify-center">Create Free Account</Link>
          </div>
        </div>
      </div>
    );
  }

  if (isBanned) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 px-4">
        <div className="max-w-md w-full text-center bg-white rounded-3xl shadow-lg p-10">
          <Ban size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="font-montserrat font-bold text-2xl mb-2">Account Banned</h2>
          <p className="text-gray-500 mb-6">Your account has been banned from posting. Check your dashboard for details.</p>
          <Link href="/dashboard" className="btn-primary justify-center">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  const selectedCat = categories.find((c) => c.slug === category);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-montserrat font-extrabold text-4xl text-gray-900 mb-2">
            Write a Blog ✍️
          </h1>
          <p className="text-gray-500">Share your ideas with the Widespread Blogs community.</p>
        </div>

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
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="A compelling title…" className="input-field" required />
          </div>

          <div>
            <label className="label">Your Name</label>
            <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="How would you like to be credited?" className="input-field" required />
          </div>

          <div>
            <label className="label flex items-center gap-2"><ImageIcon size={15} /> Cover Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onBlur={() => { if (imageUrl.startsWith('http')) setImagePreview(imageUrl); }}
              placeholder="https://images.unsplash.com/…"
              className="input-field"
              required
            />
            <p className="text-xs text-gray-400 mt-1.5">
              Tip: <a href="https://unsplash.com" target="_blank" rel="noreferrer" className="text-brand-teal hover:underline">Unsplash</a> has free high-quality photos.
            </p>
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
              placeholder={`Start writing your ${selectedCat?.label ?? 'blog'} here…`}
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
                Publishing…
              </span>
            ) : (
              <><Send size={18} /> Publish Blog</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
