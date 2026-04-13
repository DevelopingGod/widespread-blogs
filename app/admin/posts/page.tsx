'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { Blog } from '@/lib/database.types';
import { Flag, Trash2, FolderInput, CheckCircle, Search, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

type FilterType = 'all' | 'flagged' | 'clean';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<{ slug: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');

  // Modal state
  const [flagTarget, setFlagTarget] = useState<Blog | null>(null);
  const [flagReason, setFlagReason] = useState('');
  const [moveTarget, setMoveTarget] = useState<Blog | null>(null);
  const [moveCategory, setMoveCategory] = useState('');

  const supabase = createClient();

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('blogs').select('*').order('created_at', { ascending: false });
    if (filter === 'flagged') query = query.eq('is_flagged', true);
    if (filter === 'clean')   query = query.eq('is_flagged', false);
    const { data } = await query;
    setPosts(data ?? []);
    setLoading(false);
  }, [filter, supabase]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  useEffect(() => {
    supabase.from('categories').select('slug, label').order('sort_order').then(({ data }) => {
      setCategories(data ?? []);
    });
  }, [supabase]);

  const flagPost = async () => {
    if (!flagTarget || !flagReason.trim()) return;
    const { error } = await supabase
      .from('blogs')
      .update({ is_flagged: true, flag_reason: flagReason.trim() })
      .eq('id', flagTarget.id);
    if (error) { toast.error('Failed to flag post.'); return; }
    toast.success('Post flagged.');
    setFlagTarget(null);
    setFlagReason('');
    fetchPosts();
  };

  const unflagPost = async (id: string) => {
    const { error } = await supabase
      .from('blogs')
      .update({ is_flagged: false, flag_reason: null })
      .eq('id', id);
    if (error) { toast.error('Failed to unflag.'); return; }
    toast.success('Post unflagged.');
    fetchPosts();
  };

  const deletePost = async (id: string) => {
    if (!confirm('Permanently delete this post? This cannot be undone.')) return;
    const { error } = await supabase.from('blogs').delete().eq('id', id);
    if (error) { toast.error('Failed to delete post.'); return; }
    toast.success('Post deleted.');
    fetchPosts();
  };

  const movePost = async () => {
    if (!moveTarget || !moveCategory) return;
    const { error } = await supabase
      .from('blogs')
      .update({ category: moveCategory })
      .eq('id', moveTarget.id);
    if (error) { toast.error('Failed to move post.'); return; }
    toast.success(`Post moved to "${moveCategory}".`);
    setMoveTarget(null);
    setMoveCategory('');
    fetchPosts();
  };

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.author_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-montserrat font-extrabold text-3xl text-gray-900">Manage Posts</h1>
        <p className="text-gray-500 mt-1">Flag, move, or delete community posts.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or author…"
            className="input-field pl-9 text-sm"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'flagged', 'clean'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                filter === f ? 'bg-brand-teal text-brand-dark' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No posts found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-left text-xs text-gray-500 uppercase tracking-wide">
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Author</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((post) => (
                <tr key={post.id} className={`hover:bg-gray-50 transition-colors ${post.is_flagged ? 'bg-orange-50/50' : ''}`}>
                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-800 max-w-xs truncate">{post.title}</div>
                    {post.flag_reason && (
                      <div className="text-xs text-orange-500 mt-0.5 truncate max-w-xs">
                        ⚑ {post.flag_reason}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3 text-gray-600">{post.author_name}</td>
                  <td className="px-5 py-3">
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-semibold capitalize">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400 whitespace-nowrap">
                    {new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3">
                    {post.is_flagged ? (
                      <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2.5 py-1 rounded-full">Flagged</span>
                    ) : (
                      <span className="bg-green-100 text-green-600 text-xs font-bold px-2.5 py-1 rounded-full">Active</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/blogs/${post.category}/${post.id}`}
                        target="_blank"
                        className="p-1.5 text-gray-400 hover:text-brand-navy transition-colors"
                        title="View post"
                      >
                        <ExternalLink size={15} />
                      </Link>
                      {post.is_flagged ? (
                        <button
                          onClick={() => unflagPost(post.id)}
                          className="p-1.5 text-gray-400 hover:text-green-500 transition-colors"
                          title="Unflag"
                        >
                          <CheckCircle size={15} />
                        </button>
                      ) : (
                        <button
                          onClick={() => { setFlagTarget(post); setFlagReason(''); }}
                          className="p-1.5 text-gray-400 hover:text-orange-500 transition-colors"
                          title="Flag post"
                        >
                          <Flag size={15} />
                        </button>
                      )}
                      <button
                        onClick={() => { setMoveTarget(post); setMoveCategory(post.category); }}
                        className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"
                        title="Move to category"
                      >
                        <FolderInput size={15} />
                      </button>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Flag modal */}
      {flagTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-7 w-full max-w-md shadow-2xl">
            <h3 className="font-bold text-lg text-gray-900 mb-1">Flag Post</h3>
            <p className="text-sm text-gray-500 mb-4 truncate">"{flagTarget.title}"</p>
            <label className="label">Reason for flagging</label>
            <textarea
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              placeholder="e.g. Inappropriate content, spam, misinformation…"
              rows={3}
              className="input-field resize-none"
            />
            <p className="text-xs text-gray-400 mt-1.5 mb-4">
              The post author will see this reason on their dashboard.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setFlagTarget(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={flagPost} disabled={!flagReason.trim()} className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 disabled:opacity-50">
                Flag Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Move category modal */}
      {moveTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-7 w-full max-w-md shadow-2xl">
            <h3 className="font-bold text-lg text-gray-900 mb-1">Move Post to Category</h3>
            <p className="text-sm text-gray-500 mb-4 truncate">"{moveTarget.title}"</p>
            <label className="label">Select new category</label>
            <select
              value={moveCategory}
              onChange={(e) => setMoveCategory(e.target.value)}
              className="input-field"
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.label}</option>
              ))}
            </select>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setMoveTarget(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={movePost}
                disabled={moveCategory === moveTarget.category}
                className="flex-1 py-2.5 rounded-xl bg-brand-teal text-brand-dark text-sm font-semibold hover:bg-teal-400 disabled:opacity-50"
              >
                Move Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
