import { Link } from 'react-router-dom';

import { cn } from '@/lib/utils';

const footerLinks = {
  documentation: [
    { label: 'Quickstart', path: '/quickstart' },
    { label: 'Authentication', path: '/authentication' },
    { label: 'API Reference', path: '/api-reference' },
    { label: 'Sandbox', path: '/sandbox' },
    { label: 'Data Models', path: '/data-models' },
  ],
  resources: [
    { label: 'Changelog', path: '/changelog' },
    { label: 'Error Reference', path: '/errors' },
    { label: 'Webhooks', path: '/webhooks' },
    { label: 'FAQ', path: '/faq' },
  ],
  company: [
    { label: 'Website', href: 'https://www.futeurcredx.com' },
    { label: 'Enterprise', href: 'https://institutions.futeurcredx.com' },
    { label: 'Dashboard', href: 'https://sandbox.futeurcredx.com' },
    { label: 'Contact', href: 'mailto:support@futeurcredx.com' },
  ],
  legal: [
    { label: 'Privacy Policy', href: 'https://www.futeurcredx.com/privacy' },
    { label: 'Terms of Service', href: 'https://www.futeurcredx.com/terms' },
    { label: 'Security', href: 'https://www.futeurcredx.com/security' },
  ],
};

export function DocsFooter() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Link columns */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Documentation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Documentation
            </h3>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.documentation.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={cn(
                      'text-sm text-gray-500 transition-colors duration-200',
                      'hover:text-gray-300',
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Resources
            </h3>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.resources.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={cn(
                      'text-sm text-gray-500 transition-colors duration-200',
                      'hover:text-gray-300',
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                    className={cn(
                      'text-sm text-gray-500 transition-colors duration-200',
                      'hover:text-gray-300',
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Legal
            </h3>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'text-sm text-gray-500 transition-colors duration-200',
                      'hover:text-gray-300',
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 md:flex-row">
          <div className="flex items-center gap-3">
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-lg font-bold text-transparent">
              FuteurCredX
            </span>
            <span className="text-xs text-gray-600">|</span>
            <span className="text-xs text-gray-500">
              Developer Documentation
            </span>
          </div>

          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} LUMIQ AI, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
