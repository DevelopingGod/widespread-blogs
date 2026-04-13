'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { SETTING_DEFAULTS, type SiteSettings } from '@/lib/site-settings';
import toast from 'react-hot-toast';
import { Save, User, Mail, Phone, MapPin, Github, Linkedin, Link2, Bell, RefreshCw } from 'lucide-react';

function XIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

type SettingsRow = { key: string; value: string };

const FIELDS: {
  key: keyof SiteSettings;
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  type?: string;
  section: string;
}[] = [
  // Contact
  { key: 'contact_email',    label: 'Contact Email',    placeholder: 'widespreadblogs@gmail.com',     icon: <Mail size={15} />,    section: 'Contact Information' },
  { key: 'contact_phone',    label: 'Contact Phone',    placeholder: '+91 98765 43210',               icon: <Phone size={15} />,   section: 'Contact Information' },
  { key: 'contact_location', label: 'Location',         placeholder: 'India',                         icon: <MapPin size={15} />,  section: 'Contact Information' },
  // Profile
  { key: 'admin_name',       label: 'Your Name',        placeholder: 'Sankalp Indish',                icon: <User size={15} />,    section: 'Profile' },
  { key: 'admin_role',       label: 'Your Role',        placeholder: 'Founder & Lead Developer',      icon: <User size={15} />,    section: 'Profile' },
  { key: 'admin_bio',        label: 'Your Bio',         placeholder: 'Short description about you…',  icon: <User size={15} />,    section: 'Profile' },
  { key: 'admin_photo_url',  label: 'Profile Photo URL',placeholder: 'https://…',                    icon: <Link2 size={15} />,   section: 'Profile' },
  // Social
  { key: 'github_url',       label: 'GitHub URL',       placeholder: 'https://github.com/…',          icon: <Github size={15} />,  section: 'Social Links' },
  { key: 'linkedin_url',     label: 'LinkedIn URL',     placeholder: 'https://linkedin.com/in/…',     icon: <Linkedin size={15} />,section: 'Social Links' },
  { key: 'x_url',            label: 'X (Twitter) URL',  placeholder: 'https://x.com/…',               icon: <XIcon />,             section: 'Social Links' },
  // Newsletter
  { key: 'newsletter_url',   label: 'Newsletter URL',   placeholder: 'https://… (leave blank = coming soon)', icon: <Bell size={15} />, section: 'Newsletter' },
];

const SECTIONS = ['Contact Information', 'Profile', 'Social Links', 'Newsletter'];

export default function AdminSettingsPage() {
  const [values, setValues] = useState<SiteSettings>(SETTING_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.from('site_settings').select('key, value').then(({ data }) => {
      if (data?.length) {
        const map: Record<string, string> = {};
        for (const row of data as SettingsRow[]) map[row.key] = row.value;
        setValues({ ...SETTING_DEFAULTS, ...map } as SiteSettings);
      }
      setLoading(false);
    });
  }, [supabase]);

  const handleSave = async () => {
    setSaving(true);
    const upserts = (Object.entries(values) as [string, string][]).map(([key, value]) => ({
      key,
      value,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from('site_settings')
      .upsert(upserts, { onConflict: 'key' });

    setSaving(false);
    if (error) {
      toast.error('Save failed: ' + error.message);
    } else {
      toast.success('Settings saved! Changes will appear on the live site shortly.');
    }
  };

  const handleReset = () => {
    if (!confirm('Reset all settings to defaults?')) return;
    setValues(SETTING_DEFAULTS);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-teal" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-montserrat font-extrabold text-3xl text-gray-900">Site Settings</h1>
          <p className="text-gray-500 mt-1">Update your contact info, profile, and social links.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
            <RefreshCw size={14} /> Reset
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2.5 px-5 disabled:opacity-60">
            <Save size={15} /> {saving ? 'Saving…' : 'Save All'}
          </button>
        </div>
      </div>

      {/* Profile photo preview */}
      {values.admin_photo_url && (
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6 flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={values.admin_photo_url}
            alt="Profile preview"
            className="w-16 h-16 rounded-full object-cover border-2 border-brand-teal/30"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <div>
            <p className="font-semibold text-gray-800">{values.admin_name || 'Your Name'}</p>
            <p className="text-sm text-gray-500">{values.admin_role || 'Your Role'}</p>
          </div>
        </div>
      )}

      {/* Settings sections */}
      <div className="space-y-6">
        {SECTIONS.map((section) => {
          const sectionFields = FIELDS.filter((f) => f.section === section);
          return (
            <div key={section} className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-semibold text-gray-800 mb-5 pb-3 border-b border-gray-100">{section}</h2>
              <div className="space-y-4">
                {sectionFields.map(({ key, label, placeholder, icon }) => (
                  <div key={key}>
                    <label className="label flex items-center gap-2">
                      <span className="text-gray-400">{icon}</span>
                      {label}
                    </label>
                    {key === 'admin_bio' ? (
                      <textarea
                        value={values[key]}
                        onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                        placeholder={placeholder}
                        rows={2}
                        className="input-field resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={values[key]}
                        onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                        placeholder={placeholder}
                        className="input-field"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        <button onClick={handleSave} disabled={saving} className="btn-primary py-3.5 px-8 disabled:opacity-60">
          <Save size={17} /> {saving ? 'Saving…' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
}
