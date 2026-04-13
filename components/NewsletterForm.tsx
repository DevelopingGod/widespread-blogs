'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.error ?? 'Something went wrong.');
      return;
    }

    setSubscribed(true);
    toast.success("You're on the list! We'll notify you when we launch.");
  };

  if (subscribed) {
    return (
      <p className="text-brand-teal font-semibold text-lg">
        ✓ You&apos;re on the list! We&apos;ll be in touch.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="input-field flex-1"
        required
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-brand-teal text-brand-dark font-bold px-6 py-3 rounded-xl hover:bg-teal-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {loading ? 'Subscribing…' : 'Notify Me'}
      </button>
    </form>
  );
}
