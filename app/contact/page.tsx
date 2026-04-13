'use client';

import { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Header */}
      <section className="relative bg-brand-dark overflow-hidden py-20 px-4 text-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-teal/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <h1 className="font-montserrat font-extrabold text-4xl md:text-5xl text-white mb-4">Contact Us</h1>
          <p className="text-white/60 max-w-xl mx-auto text-lg">
            Have a question, feedback, or just want to say hello? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12">
        {/* Info */}
        <div className="space-y-8">
          <div>
            <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">Get in touch</h2>
            <p className="text-gray-500 leading-relaxed">
              Whether you&apos;re a writer wanting to collaborate, a reader with feedback, or anyone
              in between — drop us a message and we&apos;ll respond within 24 hours.
            </p>
          </div>
          {[
            { icon: <Mail size={20} />,    label: 'Email',    value: 'widespreadblogs@gmail.com' },
            { icon: <Phone size={20} />,   label: 'Phone',    value: '+91 98765 43210' },
            { icon: <MapPin size={20} />,  label: 'Location', value: 'India' },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center text-brand-teal flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <div className="font-semibold text-gray-700 text-sm">{item.label}</div>
                <div className="text-gray-500 text-sm">{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-lg p-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="input-field" required />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="input-field" required />
            </div>
          </div>
          <div>
            <label className="label">Subject</label>
            <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="What's this about?" className="input-field" required />
          </div>
          <div>
            <label className="label">Message</label>
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us more…" rows={5} className="input-field resize-none" required />
          </div>
          <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-3.5 disabled:opacity-60">
            {loading ? 'Sending…' : <><Send size={16} /> Send Message</>}
          </button>
        </form>
      </section>
    </div>
  );
}
