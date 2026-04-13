import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-server';
import AdminSidebar from '@/components/admin/AdminSidebar';
import type { Profile } from '@/lib/database.types';

export const metadata = { title: 'Admin Panel — Widespread Blogs' };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  const profile = data as Pick<Profile, 'is_admin'> | null;
  if (!profile?.is_admin) redirect('/');

  return (
    <div className="flex min-h-screen bg-gray-100 pt-16">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
