import { getSiteSettings } from '@/lib/site-settings-server';
import { Mail } from 'lucide-react';

function XIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function GithubIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}
function LinkedinIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export const metadata = { title: 'Our Team — Widespread Blogs' };

export default async function OurTeamPage() {
  const settings = await getSiteSettings();

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Header */}
      <section className="relative bg-brand-dark overflow-hidden py-20 px-4 text-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-teal/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand-navy/30 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <h1 className="font-montserrat font-extrabold text-4xl md:text-5xl text-white mb-4">Our Team</h1>
          <p className="text-white/60 max-w-xl mx-auto text-lg">
            The people behind Widespread Blogs — passionate about writing, technology, and community.
          </p>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="flex flex-wrap justify-center gap-8">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden w-full max-w-sm hover:shadow-xl transition-shadow">
            {/* Cover band */}
            <div className="h-24 bg-gradient-to-r from-brand-dark to-brand-navy relative">
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                {settings.admin_photo_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={settings.admin_photo_url}
                    alt={settings.admin_name}
                    className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg bg-brand-teal flex items-center justify-center text-brand-dark text-3xl font-extrabold">
                    {settings.admin_name.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-14 pb-8 px-8 text-center">
              <h3 className="font-montserrat font-bold text-xl text-gray-900 mb-1">{settings.admin_name}</h3>
              <span className="inline-block bg-brand-teal/15 text-brand-navy text-xs font-semibold px-3 py-1 rounded-full mb-4">
                {settings.admin_role}
              </span>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">{settings.admin_bio}</p>
              <div className="flex justify-center gap-3">
                <a href={settings.github_url} target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-brand-dark hover:text-white transition-all" aria-label="GitHub">
                  <GithubIcon />
                </a>
                <a href={settings.linkedin_url} target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-blue-600 hover:text-white transition-all" aria-label="LinkedIn">
                  <LinkedinIcon />
                </a>
                <a href={settings.x_url} target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-black hover:text-white transition-all" aria-label="X">
                  <XIcon />
                </a>
                <a href={`mailto:${settings.contact_email}`}
                  className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-brand-teal hover:text-brand-dark transition-all" aria-label="Email">
                  <Mail size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-montserrat font-bold text-3xl text-gray-900 mb-6">Our Mission</h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Widespread Blogs was created to give everyone a voice. We believe that great ideas
            deserve to be shared — whether it&apos;s a groundbreaking scientific discovery, a
            breathtaking nature experience, an AI breakthrough, or a vivid fictional world from
            your imagination. Our platform makes sharing effortless, beautiful, and accessible to all.
          </p>
        </div>
      </section>
    </div>
  );
}
