import { Shield, Eye, Database, Cookie, UserCheck, Mail, Lock, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy — Widespread Blogs',
  description: 'How Widespread Blogs collects, uses, and protects your personal information.',
};

const sections = [
  {
    icon: Database,
    color: 'bg-blue-50 text-blue-600',
    title: 'Information We Collect',
    content: [
      'Your name and email address when you create an account.',
      'Blog post content, title, author name, and cover image URL when you publish.',
      'Login timestamps and session data for security purposes.',
      'We do NOT collect payment information, phone numbers, or location data.',
    ],
  },
  {
    icon: Eye,
    color: 'bg-purple-50 text-purple-600',
    title: 'How We Use Your Information',
    content: [
      'To create and authenticate your account securely.',
      'To display your published blog posts to readers.',
      'To send important account emails such as email confirmation.',
      'To improve platform performance and troubleshoot issues.',
      'We never sell, rent, or trade your data to third parties.',
    ],
  },
  {
    icon: Lock,
    color: 'bg-green-50 text-green-600',
    title: 'Data Storage & Security',
    content: [
      'All data is stored on Supabase, which provides AES-256 encryption at rest.',
      'All data in transit is encrypted using TLS 1.3.',
      'Passwords are hashed using bcrypt — we never store plain-text passwords.',
      'Row Level Security (RLS) ensures users can only access their own data.',
    ],
  },
  {
    icon: Cookie,
    color: 'bg-amber-50 text-amber-600',
    title: 'Cookies & Tracking',
    content: [
      'We use essential session cookies for authentication only.',
      'No third-party advertising or tracking cookies are used.',
      'No analytics tools that track individual users are installed.',
      'You can clear cookies at any time via your browser settings.',
    ],
  },
  {
    icon: UserCheck,
    color: 'bg-teal-50 text-teal-600',
    title: 'Your Rights',
    content: [
      'Access — Request a copy of the personal data we hold about you.',
      'Correction — Update your profile information at any time from your dashboard.',
      'Deletion — Request full deletion of your account and all associated data.',
      'Portability — Request an export of your data in a readable format.',
    ],
  },
  {
    icon: AlertCircle,
    color: 'bg-rose-50 text-rose-600',
    title: 'Content Moderation',
    content: [
      'Our admin team may review posts that are reported or flagged.',
      'Flagged content reasons are visible only to the post author and admins.',
      'We do not share flagging details with other users or third parties.',
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero */}
      <section className="relative bg-brand-dark overflow-hidden py-20 px-4 text-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-teal/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand-navy/30 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-teal/20 border border-brand-teal/30 rounded-2xl mb-6">
            <Shield size={30} className="text-brand-teal" />
          </div>
          <h1 className="font-montserrat font-extrabold text-4xl md:text-5xl text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/60 text-lg">
            Your privacy matters to us. Here&apos;s exactly how we handle your data.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
            <span className="bg-white/10 text-white/70 px-4 py-1.5 rounded-full">Last updated: April 2025</span>
            <span className="bg-brand-teal/20 text-brand-teal px-4 py-1.5 rounded-full border border-brand-teal/30">Effective immediately</span>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
          <p className="text-gray-600 text-lg leading-relaxed">
            Widespread Blogs (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your personal information.
            This policy explains what we collect, why we collect it, and how we keep it safe.
            By using our platform, you agree to the practices described below.
          </p>
        </div>

        {/* Policy sections */}
        <div className="space-y-5">
          {sections.map((section, i) => (
            <div key={i} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-start gap-5">
                <div className={`${section.color} w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <section.icon size={22} />
                </div>
                <div className="flex-1">
                  <h2 className="font-montserrat font-bold text-xl text-gray-900 mb-4">
                    {i + 1}. {section.title}
                  </h2>
                  <ul className="space-y-2.5">
                    {section.content.map((item, j) => (
                      <li key={j} className="flex items-start gap-3 text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-teal mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-8 bg-gradient-to-br from-brand-dark to-slate-800 rounded-3xl p-8 text-white text-center">
          <Mail size={28} className="text-brand-teal mx-auto mb-3" />
          <h3 className="font-montserrat font-bold text-xl mb-2">Questions about your privacy?</h3>
          <p className="text-white/60 mb-4">
            We&apos;re happy to help. Reach us directly and we&apos;ll respond within 48 hours.
          </p>
          <a
            href="mailto:widespreadblogs@gmail.com"
            className="inline-flex items-center gap-2 bg-brand-teal text-brand-dark font-bold px-6 py-3 rounded-full hover:bg-teal-400 transition-colors"
          >
            <Mail size={16} /> widespreadblogs@gmail.com
          </a>
        </div>
      </section>
    </div>
  );
}
