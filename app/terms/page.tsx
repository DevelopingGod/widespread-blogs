import { ScrollText, UserCheck, FileText, Copyright, Trash2, AlertTriangle, RefreshCw, Mail, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions — Widespread Blogs',
  description: 'The rules and guidelines for using Widespread Blogs.',
};

const sections = [
  {
    icon: CheckCircle,
    color: 'bg-green-50 text-green-600',
    title: 'Acceptance of Terms',
    content: [
      'By accessing or using Widespread Blogs, you agree to be bound by these Terms.',
      'If you do not agree with any part of these terms, please do not use our platform.',
      'These terms apply to all visitors, users, and contributors.',
    ],
  },
  {
    icon: UserCheck,
    color: 'bg-blue-50 text-blue-600',
    title: 'User Accounts',
    content: [
      'You must provide accurate and complete information when registering.',
      'You are responsible for keeping your account credentials confidential.',
      'One person may not maintain multiple accounts.',
      'You must be at least 13 years of age to create an account.',
      'Notify us immediately if you suspect unauthorized access to your account.',
    ],
  },
  {
    icon: FileText,
    color: 'bg-purple-50 text-purple-600',
    title: 'Content Guidelines',
    content: [
      'All content must be original — plagiarism is strictly prohibited.',
      'Posts must not contain hate speech, discrimination, or harassment of any kind.',
      'Content promoting illegal activities will be immediately removed.',
      'Adult or explicit content is not permitted on this platform.',
      'Posts should be relevant to one of the available blog categories.',
      'Spamming, excessive self-promotion, or bot-generated content is banned.',
    ],
  },
  {
    icon: Copyright,
    color: 'bg-amber-50 text-amber-600',
    title: 'Intellectual Property',
    content: [
      'You retain full ownership of the content you publish.',
      'By posting, you grant Widespread Blogs a non-exclusive, royalty-free license to display your content.',
      'This license lets us show your posts to readers and promote them on the platform.',
      'You may not post content that infringes on the intellectual property of others.',
    ],
  },
  {
    icon: Trash2,
    color: 'bg-rose-50 text-rose-600',
    title: 'Content Removal & Moderation',
    content: [
      'We reserve the right to remove content that violates these terms without prior notice.',
      'Posts may be flagged by moderators with a stated reason visible to the author.',
      'Repeated violations may result in account suspension or permanent ban.',
      'Banned users retain read access but cannot publish new content.',
    ],
  },
  {
    icon: AlertTriangle,
    color: 'bg-orange-50 text-orange-600',
    title: 'Disclaimer of Warranties',
    content: [
      'Widespread Blogs is provided "as is" without warranties of any kind.',
      'We are not responsible for the accuracy or completeness of user-submitted content.',
      'We do not guarantee uninterrupted access or error-free operation of the platform.',
      'Views expressed in blog posts are those of the authors, not Widespread Blogs.',
    ],
  },
  {
    icon: RefreshCw,
    color: 'bg-teal-50 text-teal-600',
    title: 'Changes to These Terms',
    content: [
      'We may update these Terms at any time to reflect platform changes.',
      'We will notify users of significant changes via email or a site announcement.',
      'Continued use of the platform after changes constitutes your acceptance.',
      'The "last updated" date at the top of this page reflects the latest revision.',
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero */}
      <section className="relative bg-brand-dark overflow-hidden py-20 px-4 text-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-brand-teal/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-900/20 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-teal/20 border border-brand-teal/30 rounded-2xl mb-6">
            <ScrollText size={30} className="text-brand-teal" />
          </div>
          <h1 className="font-montserrat font-extrabold text-4xl md:text-5xl text-white mb-4">
            Terms &amp; Conditions
          </h1>
          <p className="text-white/60 text-lg">
            Please read these terms carefully before using Widespread Blogs.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
            <span className="bg-white/10 text-white/70 px-4 py-1.5 rounded-full">Last updated: April 2025</span>
            <span className="bg-brand-teal/20 text-brand-teal px-4 py-1.5 rounded-full border border-brand-teal/30">Effective immediately</span>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12">
        {/* TL;DR box */}
        <div className="bg-brand-teal/10 border border-brand-teal/30 rounded-3xl p-6 mb-8">
          <h3 className="font-montserrat font-bold text-brand-navy mb-3">TL;DR — The Short Version</h3>
          <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <span className="text-brand-teal font-bold">✓</span>
              Write original, respectful content
            </div>
            <div className="flex items-start gap-2">
              <span className="text-brand-teal font-bold">✓</span>
              You own everything you publish
            </div>
            <div className="flex items-start gap-2">
              <span className="text-brand-teal font-bold">✓</span>
              We moderate to keep it safe
            </div>
          </div>
        </div>

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
          <h3 className="font-montserrat font-bold text-xl mb-2">Questions about these terms?</h3>
          <p className="text-white/60 mb-4">Contact us and we&apos;ll clarify anything you need.</p>
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
