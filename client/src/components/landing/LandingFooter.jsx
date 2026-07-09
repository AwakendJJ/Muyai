import { Link } from 'react-router-dom';
import { Globe, Mail, Share2 } from 'lucide-react';
import Logo from '../brand/Logo.jsx';
import { BRAND_TAGLINE } from '../../config/brand.js';

const FOOTER_LINKS = {
  Product: [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How it works' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#faq', label: 'FAQ' },
  ],
  Apps: [
    { to: '/register', label: 'Resume Scanner' },
    { to: '/register', label: 'Gap Analysis' },
    { to: '/register', label: 'Job Matching' },
    { to: '/register', label: 'Interview Prep' },
  ],
  Account: [
    { to: '/login', label: 'Sign in' },
    { to: '/register', label: 'Create account' },
    { to: '/apps/dashboard', label: 'Dashboard' },
  ],
};

export default function LandingFooter() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo tagline={BRAND_TAGLINE} />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-text">
              AI-powered career development built for African students and early-career
              professionals. Discover your skills, close gaps, and grow with confidence.
            </p>
            <div className="mt-6 flex gap-3">
              {[Share2, Globe, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-gray-text transition-colors hover:border-primary hover:text-primary"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display text-sm font-bold">{title}</h4>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {'to' in link ? (
                      <Link to={link.to} className="text-sm text-gray-text hover:text-primary">
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} className="text-sm text-gray-text hover:text-primary">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-xs text-gray-text">&copy; 2026 Muyai. All rights reserved.</p>
          <p className="text-xs text-gray-text">Built for African talent, powered by AI.</p>
        </div>
      </div>
    </footer>
  );
}
