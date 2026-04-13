// Client-safe: types and defaults only — no server imports
export interface SiteSettings {
  contact_email: string;
  contact_phone: string;
  contact_location: string;
  admin_name: string;
  admin_role: string;
  admin_bio: string;
  admin_photo_url: string;
  github_url: string;
  linkedin_url: string;
  x_url: string;
  newsletter_url: string;
}

export const SETTING_DEFAULTS: SiteSettings = {
  contact_email:    'widespreadblogs@gmail.com',
  contact_phone:    '+91 98765 43210',
  contact_location: 'India',
  admin_name:       'Sankalp Indish',
  admin_role:       'Founder & Lead Developer',
  admin_bio:        'Built Widespread Blogs to create a space where curious minds share their ideas with the world.',
  admin_photo_url:  'https://api.dicebear.com/7.x/initials/svg?seed=Sankalp+Indish&backgroundColor=1CD6CE&textColor=1B2430',
  github_url:       'https://github.com/DevelopingGod',
  linkedin_url:     'https://www.linkedin.com/in/sankalp-indish/',
  x_url:            'https://x.com/cutecreeperyt',
  newsletter_url:   '',
};
