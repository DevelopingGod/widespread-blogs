'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { Profile } from '@/lib/database.types';
import { Flag, Ban, CheckCircle, Search, ShieldOff } from 'lucide-react';
import toast from 'react-hot-toast';

type FilterType = 'all' | 'flagged' | 'banned';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');

  // Flag modal
  const [flagTarget, setFlagTarget] = useState<Profile | null>(null);
  const [flagReason, setFlagReason] = useState('');
  const [flagType, setFlagType] = useState<'flag' | 'ban'>('flag');

  const supabase = createClient();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (filter === 'flagged') query = query.eq('is_flagged', true);
    if (filter === 'banned')  query = query.eq('is_banned', true);
    const { data } = await query;
    setUsers(data ?? []);
    setLoading(false);
  }, [filter, supabase]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const openModal = (user: Profile, type: 'flag' | 'ban') => {
    setFlagTarget(user);
    setFlagType(type);
    setFlagReason('');
  };

  const submitAction = async () => {
    if (!flagTarget || !flagReason.trim()) return;
    const update =
      flagType === 'ban'
        ? { is_banned: true, ban_reason: flagReason.trim(), is_flagged: true, flag_reason: flagReason.trim() }
        : { is_flagged: true, flag_reason: flagReason.trim() };

    const { error } = await supabase.from('profiles').update(update).eq('id', flagTarget.id);
    if (error) { toast.error('Action failed.'); return; }
    toast.success(flagType === 'ban' ? 'User banned.' : 'User flagged.');
    setFlagTarget(null);
    setFlagReason('');
    fetchUsers();
  };

  const clearFlag = async (user: Profile) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_flagged: false, flag_reason: null })
      .eq('id', user.id);
    if (error) { toast.error('Failed.'); return; }
    toast.success('Flag removed.');
    fetchUsers();
  };

  const unban = async (user: Profile) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_banned: false, ban_reason: null, is_flagged: false, flag_reason: null })
      .eq('id', user.id);
    if (error) { toast.error('Failed.'); return; }
    toast.success('User unbanned.');
    fetchUsers();
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge = (user: Profile) => {
    if (user.is_banned)  return <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">Banned</span>;
    if (user.is_flagged) return <span className="bg-yellow-100 text-yellow-600 text-xs font-bold px-2.5 py-1 rounded-full">Flagged</span>;
    if (user.is_admin)   return <span className="bg-purple-100 text-purple-600 text-xs font-bold px-2.5 py-1 rounded-full">Admin</span>;
    return <span className="bg-green-100 text-green-600 text-xs font-bold px-2.5 py-1 rounded-full">Active</span>;
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-montserrat font-extrabold text-3xl text-gray-900">Manage Users</h1>
        <p className="text-gray-500 mt-1">Flag or ban users who violate community guidelines.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="input-field pl-9 text-sm"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'flagged', 'banned'] as FilterType[]).map((f) => (
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
          <div className="p-12 text-center text-gray-400">No users found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-left text-xs text-gray-500 uppercase tracking-wide">
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Note</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((user) => (
                <tr key={user.id} className={`hover:bg-gray-50 transition-colors ${user.is_banned ? 'bg-red-50/30' : user.is_flagged ? 'bg-yellow-50/30' : ''}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-teal/20 flex items-center justify-center text-sm font-bold text-brand-navy flex-shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{user.name}</div>
                        <div className="text-xs text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-400 whitespace-nowrap">
                    {new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3">{statusBadge(user)}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs max-w-[160px] truncate">
                    {user.ban_reason || user.flag_reason || '—'}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {!user.is_admin && (
                        <>
                          {user.is_banned ? (
                            <button onClick={() => unban(user)} className="p-1.5 text-gray-400 hover:text-green-500 transition-colors" title="Unban">
                              <ShieldOff size={15} />
                            </button>
                          ) : (
                            <>
                              {user.is_flagged ? (
                                <button onClick={() => clearFlag(user)} className="p-1.5 text-gray-400 hover:text-green-500 transition-colors" title="Remove flag">
                                  <CheckCircle size={15} />
                                </button>
                              ) : (
                                <button onClick={() => openModal(user, 'flag')} className="p-1.5 text-gray-400 hover:text-yellow-500 transition-colors" title="Flag user">
                                  <Flag size={15} />
                                </button>
                              )}
                              <button onClick={() => openModal(user, 'ban')} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors" title="Ban user">
                                <Ban size={15} />
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Flag/Ban modal */}
      {flagTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-7 w-full max-w-md shadow-2xl">
            <h3 className="font-bold text-lg text-gray-900 mb-1">
              {flagType === 'ban' ? '🚫 Ban User' : '⚑ Flag User'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">{flagTarget.name} · {flagTarget.email}</p>
            {flagType === 'ban' && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3 mb-4">
                Banning prevents this user from posting new content. Their existing posts remain visible.
              </div>
            )}
            <label className="label">Reason</label>
            <textarea
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              placeholder="Explain the reason…"
              rows={3}
              className="input-field resize-none"
            />
            <p className="text-xs text-gray-400 mt-1.5 mb-4">
              The user will see this reason on their dashboard.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setFlagTarget(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={submitAction}
                disabled={!flagReason.trim()}
                className={`flex-1 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-50 ${
                  flagType === 'ban' ? 'bg-red-500 hover:bg-red-600' : 'bg-yellow-500 hover:bg-yellow-600'
                }`}
              >
                {flagType === 'ban' ? 'Ban User' : 'Flag User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
