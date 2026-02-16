import { FileCode, RefreshCw, Settings } from 'lucide-react';

import { cn } from '@/lib/utils';

const BASE = 'https://www.futeurcredx.com';

const columns = [
  {
    title: 'Products',
    links: [
      { label: 'FuteurCredX App', href: `${BASE}/futeurcredx-app` },
      { label: 'LumiqAI', href: `${BASE}/lumiq-ai` },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'For Consumers', href: `${BASE}/solutions/consumers` },
      { label: 'For Institutions', href: `${BASE}/solutions/institutions` },
      { label: 'For Fintechs', href: `${BASE}/solutions/fintechs` },
    ],
  },
  {
    title: 'Partners',
    links: [
      { label: 'Partner Ecosystem', href: `${BASE}/partners/ecosystem` },
      { label: 'Technology Partners', href: `${BASE}/partners/technology` },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: `${BASE}/company/about` },
      { label: 'Legal', href: `${BASE}/legal` },
      { label: 'Support', href: `${BASE}/support` },
      { label: 'Contact', href: `${BASE}/contact-us` },
    ],
  },
] as const;

const developerLinks = [
  {
    icon: FileCode,
    title: 'API Docs',
    description: "Integrate with LumiqAI's APIs and SDKs",
    href: '/',
    internal: true,
  },
  {
    icon: RefreshCw,
    title: 'Changelog',
    description: 'Latest updates to our API and SDK',
    href: '/changelog',
    internal: true,
  },
  {
    icon: Settings,
    title: 'API Reference',
    description: 'Manage your integration',
    href: '/api-reference',
    internal: true,
  },
] as const;

const legalLinks = [
  { label: 'Privacy Policy', href: `${BASE}/legal` },
  { label: 'Terms of Service', href: `${BASE}/legal` },
  { label: 'Cookie Policy', href: `${BASE}/legal` },
  { label: 'Data Processing', href: `${BASE}/legal` },
  { label: 'GLBA Compliance', href: `${BASE}/legal` },
] as const;

const disclaimers = [
  'Business Credit Services: FuteurCredX is a business credit technology platform and program manager. Our LUMIQ\u2122 platform provides business credit monitoring, building, and intelligence services to help businesses establish and grow their credit profiles without personal guarantees.',
  'Enterprise Solutions: Our enterprise solutions provide financial institutions with AI-powered risk assessment tools, lending intelligence, and portfolio analytics to enhance decision-making processes and improve operational efficiency.',
  'Data Security: FuteurCredX employs industry-leading security measures to protect your business data. All information is encrypted and stored according to the highest security standards in compliance with relevant regulations.',
] as const;

export function DocsFooter() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-[6%]">
        {/* Link columns */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-6">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
                {col.title}
              </h4>
              <div className="space-y-3">
                {col.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-white/70 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}

          {/* For Developers — spans 2 cols */}
          <div className="lg:col-span-2">
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              For Developers
            </h4>
            <div className="space-y-4 rounded-xl bg-[#0F0A04] p-5">
              {developerLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.title}
                    href={link.href}
                    className="group flex items-start gap-3"
                  >
                    <div
                      className={cn(
                        'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
                        'bg-emerald-500/20 transition-colors duration-200 group-hover:bg-emerald-500/30',
                      )}
                    >
                      <Icon className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white transition-colors duration-200 group-hover:text-emerald-400">
                        {link.title}
                      </p>
                      <p className="text-xs leading-relaxed text-white/50">
                        {link.description}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="my-10 border-t border-gray-800" />

        {/* Brand + Legal Links */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <span className="text-sm font-semibold uppercase tracking-wider text-white/80">
            FuteurCredX
          </span>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/50 transition-colors duration-200 hover:text-white/80"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Disclaimers */}
        <div className="mt-8 space-y-4">
          {disclaimers.map((text, i) => (
            <p
              key={i}
              className="text-xs leading-relaxed text-white/40"
            >
              {text}
            </p>
          ))}
        </div>

        {/* Copyright */}
        <p className="mt-8 text-xs text-white/40">
          &copy; {new Date().getFullYear()} FuteurCredX. LUMIQ&trade; and
          FuteurCredX&reg; are registered trademarks. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
