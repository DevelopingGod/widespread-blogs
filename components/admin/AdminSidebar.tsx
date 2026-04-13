'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Users, Tag, LogOut, Home, ExternalLink, Settings } from 'lucide-react';

const navItems = [
  { href: '/admin',            label: 'Overview',    icon: LayoutDashboard },
  { href: '/admin/posts',      label: 'Posts',       icon: FileText },
  { href: '/admin/users',      label: 'Users',       icon: Users },
  { href: '/admin/categories', label: 'Categories',  icon: Tag },
  { href: '/admin/settings',   label: 'Settings',    icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    window.location.href = '/api/auth/signout';
  };

  return (
    <aside className="w-64 bg-brand-dark flex flex-col border-r border-white/10 sticky top-16 self-start h-[calc(100vh-4rem)]">
      <div className="px-6 py-5 border-b border-white/10">
        <Link href="/admin" className="font-montserrat font-extrabold text-xl text-white">
          Widespread <span className="text-brand-teal">Admin</span>
        </Link>
        <span className="block text-xs text-white/40 mt-0.5">Control Panel</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? 'bg-brand-teal text-brand-dark'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-6 space-y-1 border-t border-white/10 pt-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-white/60 hover:bg-white/10 hover:text-white transition-all"
        >
          <Home size={17} />
          View Site
          <ExternalLink size={13} className="ml-auto" />
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-white/60 hover:bg-red-500/20 hover:text-red-400 transition-all"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  );
}
