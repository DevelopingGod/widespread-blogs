'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Category } from '@/lib/database.types';
import { Plus, Pencil, Trash2, Save, X, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';

const GRADIENT_OPTIONS = [
  { label: 'Indigo → Purple', value: 'from-indigo-500 to-purple-600' },
  { label: 'Green → Teal',    value: 'from-green-500 to-teal-600' },
  { label: 'Blue → Cyan',     value: 'from-blue-500 to-cyan-600' },
  { label: 'Purple → Pink',   value: 'from-purple-500 to-pink-600' },
  { label: 'Orange → Red',    value: 'from-orange-500 to-red-600' },
  { label: 'Yellow → Orange', value: 'from-yellow-400 to-orange-500' },
  { label: 'Pink → Rose',     value: 'from-pink-500 to-rose-600' },
  { label: 'Teal → Blue',     value: 'from-teal-400 to-blue-600' },
];

const empty = {
  slug: '', label: '', description: '', icon: '📝',
  hero_image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80',
  gradient: 'from-indigo-500 to-purple-600', sort_order: 99,
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  const fetch = async () => {
    setLoading(true);
    const { data } = await supabase.from('categories').select('*').order('sort_order');
    setCategories(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openEdit = (cat: Category) => {
    setEditTarget(cat);
    setForm({
      slug: cat.slug, label: cat.label, description: cat.description,
      icon: cat.icon, hero_image: cat.hero_image, gradient: cat.gradient, sort_order: cat.sort_order,
    });
    setShowForm(true);
  };

  const openNew = () => {
    setEditTarget(null);
    setForm(empty);
    setShowForm(true);
  };

  const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const save = async () => {
    if (!form.label.trim() || !form.slug.trim()) {
      toast.error('Label and slug are required.');
      return;
    }
    setSaving(true);
    if (editTarget) {
      const { error } = await supabase
        .from('categories')
        .update({ label: form.label, description: form.description, icon: form.icon, hero_image: form.hero_image, gradient: form.gradient, sort_order: form.sort_order })
        .eq('id', editTarget.id);
      if (error) { toast.error('Update failed: ' + error.message); setSaving(false); return; }
      toast.success('Category updated.');
    } else {
      const { error } = await supabase.from('categories').insert({ ...form, slug: slugify(form.slug) });
      if (error) { toast.error('Create failed: ' + error.message); setSaving(false); return; }
      toast.success('Category created!');
    }
    setSaving(false);
    setShowForm(false);
    fetch();
  };

  const deleteCategory = async (cat: Category) => {
    if (!confirm(`Delete category "${cat.label}"? All posts in this category will lose their category reference.`)) return;
    const { error } = await supabase.from('categories').delete().eq('id', cat.id);
    if (error) { toast.error('Delete failed.'); return; }
    toast.success('Category deleted.');
    fetch();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-montserrat font-extrabold text-3xl text-gray-900">Categories</h1>
          <p className="text-gray-500 mt-1">Add, edit or remove blog categories.</p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm py-2.5 px-5">
          <Plus size={16} /> New Category
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400">Loading…</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl shadow-sm overflow-hidden group">
              <div className={`h-24 bg-gradient-to-r ${cat.gradient} flex items-end p-4`}>
                <span className="text-3xl">{cat.icon}</span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">{cat.label}</h3>
                    <code className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded mt-0.5 inline-block">/blogs/{cat.slug}</code>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(cat)} className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => deleteCategory(cat)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2 line-clamp-2">{cat.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <GripVertical size={12} className="text-gray-300" />
                  <span className="text-xs text-gray-300">Order: {cat.sort_order}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 overflow-auto py-8">
          <div className="bg-white rounded-2xl p-7 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-xl text-gray-900">
                {editTarget ? 'Edit Category' : 'New Category'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Icon (emoji)</label>
                  <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="input-field text-2xl text-center" maxLength={4} />
                </div>
                <div>
                  <label className="label">Sort Order</label>
                  <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: +e.target.value })} className="input-field" />
                </div>
              </div>
              <div>
                <label className="label">Label</label>
                <input
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value, slug: editTarget ? form.slug : slugify(e.target.value) })}
                  placeholder="e.g. Technology"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                  placeholder="e.g. technology"
                  className="input-field font-mono text-sm"
                  disabled={!!editTarget}
                />
                {editTarget && <p className="text-xs text-gray-400 mt-1">Slug cannot be changed after creation.</p>}
              </div>
              <div>
                <label className="label">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="input-field resize-none" />
              </div>
              <div>
                <label className="label">Hero Image URL</label>
                <input value={form.hero_image} onChange={(e) => setForm({ ...form, hero_image: e.target.value })} placeholder="https://…" className="input-field" />
              </div>
              <div>
                <label className="label">Gradient</label>
                <select value={form.gradient} onChange={(e) => setForm({ ...form, gradient: e.target.value })} className="input-field">
                  {GRADIENT_OPTIONS.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
                <div className={`h-6 rounded-lg mt-2 bg-gradient-to-r ${form.gradient}`} />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={save} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-brand-teal text-brand-dark text-sm font-semibold hover:bg-teal-400 disabled:opacity-50 flex items-center justify-center gap-2">
                <Save size={15} /> {saving ? 'Saving…' : 'Save Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
