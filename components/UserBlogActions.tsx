'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Trash2, Pencil, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Props {
  blogId: string;
  category: string;
  isFlagged: boolean;
}

export default function UserBlogActions({ blogId, category, isFlagged }: Props) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to permanently delete this post? This cannot be undone.')) return;
    setDeleting(true);
    const { error } = await supabase.from('blogs').delete().eq('id', blogId);
    setDeleting(false);
    if (error) {
      toast.error('Failed to delete: ' + error.message);
      return;
    }
    toast.success('Post deleted.');
    router.refresh(); // Re-fetch the server component data
  };

  return (
    <div className="flex items-center justify-end gap-1">
      {/* View */}
      <Link
        href={`/blogs/${category}/${blogId}`}
        title="View post"
        className="p-1.5 text-gray-400 hover:text-brand-navy transition-colors rounded-lg hover:bg-gray-100"
      >
        <ExternalLink size={15} />
      </Link>

      {/* Edit — navigates to edit page */}
      <Link
        href={`/blogs/edit/${blogId}`}
        title={isFlagged ? 'Edit to address the flag' : 'Edit post'}
        className={`p-1.5 transition-colors rounded-lg hover:bg-gray-100 ${
          isFlagged ? 'text-orange-400 hover:text-orange-600' : 'text-gray-400 hover:text-blue-500'
        }`}
      >
        <Pencil size={15} />
      </Link>

      {/* Delete */}
      <button
        onClick={handleDelete}
        disabled={deleting}
        title="Delete post"
        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 disabled:opacity-40"
      >
        {deleting
          ? <span className="w-[15px] h-[15px] border-2 border-red-400 border-t-transparent rounded-full animate-spin inline-block" />
          : <Trash2 size={15} />
        }
      </button>
    </div>
  );
}
