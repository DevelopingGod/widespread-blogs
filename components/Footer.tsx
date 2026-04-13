import Link from 'next/link';
import { Mail, MapPin, Phone, Bell } from 'lucide-react';
import { getSiteSettings } from '@/lib/site-settings-server';

// X (formerly Twitter) icon as inline SVG
function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default async function Footer() {
  const settings = await getSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <h3 className="font-montserrat font-bold text-2xl text-brand-teal mb-3">
            Widespread Blogs
          </h3>
          <p className="text-white/60 text-sm leading-relaxed mb-5">
            A platform where curious minds share ideas across multiple domains of knowledge and creativity.
          </p>
          <div className="flex items-center gap-3">
            <a href={settings.github_url} target="_blank" rel="noreferrer" aria-label="GitHub"
              className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white/60 hover:bg-brand-teal hover:text-brand-dark transition-all">
              <GithubIcon size={16} />
            </a>
            <a href={settings.linkedin_url} target="_blank" rel="noreferrer" aria-label="LinkedIn"
              className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white/60 hover:bg-blue-500 hover:text-white transition-all">
              <LinkedinIcon size={16} />
            </a>
            <a href={settings.x_url} target="_blank" rel="noreferrer" aria-label="X (Twitter)"
              className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white/60 hover:bg-white hover:text-black transition-all">
              <XIcon size={14} />
            </a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h4 className="font-semibold text-brand-teal uppercase tracking-widest text-xs mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-white/70">
            {[
              { href: '/blogs/astronomy',              label: '🔭 Astronomy' },
              { href: '/blogs/nature',                 label: '🌿 Nature' },
              { href: '/blogs/science',                label: '🔬 Science' },
              { href: '/blogs/fictional',              label: '✨ Fictional' },
              { href: '/blogs/artificial-intelligence',label: '🤖 AI' },
              { href: '/blogs/technology',             label: '💻 Technology' },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-brand-teal transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-semibold text-brand-teal uppercase tracking-widest text-xs mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-white/70">
            {[
              { href: '/our-team',       label: 'Our Team' },
              { href: '/contact',        label: 'Contact Us' },
              { href: '/privacy-policy', label: 'Privacy Policy' },
              { href: '/terms',          label: 'Terms & Conditions' },
              { href: '/blogs/create',   label: 'Write a Blog' },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-brand-teal transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact + Newsletter */}
        <div>
          <h4 className="font-semibold text-brand-teal uppercase tracking-widest text-xs mb-4">Contact</h4>
          <div className="space-y-2.5 text-sm text-white/60 mb-6">
            <a href={`mailto:${settings.contact_email}`} className="flex items-center gap-2 hover:text-brand-teal transition-colors">
              <Mail size={14} /> {settings.contact_email}
            </a>
            <span className="flex items-center gap-2">
              <Phone size={14} /> {settings.contact_phone}
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={14} /> {settings.contact_location}
            </span>
          </div>

          {/* Newsletter teaser */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Bell size={14} className="text-brand-teal" />
              <span className="text-sm font-semibold text-white">Newsletter</span>
              <span className="text-xs bg-brand-teal/20 text-brand-teal px-2 py-0.5 rounded-full">Coming soon</span>
            </div>
            <p className="text-xs text-white/50">Weekly digest of the best posts across all categories.</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/30">
        © {year} Widespread Blogs. All rights reserved. Built with ❤️ by{' '}
        <a href={settings.linkedin_url} target="_blank" rel="noreferrer" className="text-brand-teal hover:underline">
          {settings.admin_name}
        </a>
      </div>
    </footer>
  );
}
