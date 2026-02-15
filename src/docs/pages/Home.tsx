import { ArrowRight, BookOpen, Code, FlaskConical, HelpCircle, Rocket, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

import { cn } from '@/lib/utils';

interface FeatureCard {
  title: string;
  description: string;
  icon: typeof Rocket;
  href: string;
  iconGradient: string;
  borderHover: string;
}

const featureCards: FeatureCard[] = [
  {
    title: 'Quickstart',
    description: 'Get your first API call running in 5 minutes',
    icon: Rocket,
    href: '/docs/quickstart',
    iconGradient: 'from-orange-500 to-amber-500',
    borderHover: 'hover:border-orange-500/40',
  },
  {
    title: 'API Reference',
    description: 'Complete endpoint documentation with examples',
    icon: Code,
    href: '/docs/api-reference',
    iconGradient: 'from-blue-500 to-cyan-500',
    borderHover: 'hover:border-blue-500/40',
  },
  {
    title: 'Sandbox',
    description: 'Explore real data from 4 bank tenants',
    icon: FlaskConical,
    href: '/docs/sandbox',
    iconGradient: 'from-emerald-500 to-teal-500',
    borderHover: 'hover:border-emerald-500/40',
  },
];

interface QuickLink {
  title: string;
  description: string;
  href: string;
  icon: typeof Shield;
}

const quickLinks: QuickLink[] = [
  {
    title: 'Authentication',
    description: 'API keys, JWTs, and security best practices',
    href: '/docs/authentication',
    icon: Shield,
  },
  {
    title: 'Error Reference',
    description: 'HTTP status codes and troubleshooting',
    href: '/docs/errors',
    icon: BookOpen,
  },
  {
    title: 'Data Models',
    description: 'Schemas for businesses, scores, and more',
    href: '/docs/data-models',
    icon: Code,
  },
  {
    title: 'FAQ',
    description: 'Frequently asked questions',
    href: '/docs/faq',
    icon: HelpCircle,
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center">
        <h1
          className={cn(
            'text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl',
            'bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent',
          )}
        >
          LumiqAI Developer Documentation
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-400">
          Build intelligent credit decisioning into your systems. Access
          portfolio analytics, credit scores, risk alerts, and underwriting
          data through a single, unified API.
        </p>
        <div className="mt-8">
          <Link
            to="/docs/quickstart"
            className={cn(
              'inline-flex items-center gap-2 rounded-xl px-6 py-3',
              'bg-gradient-to-r from-blue-600 to-indigo-600',
              'text-sm font-semibold text-white shadow-lg shadow-blue-500/25',
              'transition-all duration-200',
              'hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/40',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
            )}
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Feature Cards */}
      <section>
        <div className="grid gap-6 sm:grid-cols-3">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                to={card.href}
                className={cn(
                  'group relative rounded-2xl border border-gray-800 bg-gray-900/50 p-6',
                  'transition-all duration-200',
                  card.borderHover,
                  'hover:bg-gray-900/80',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                )}
              >
                <div
                  className={cn(
                    'mb-4 inline-flex rounded-xl p-2.5',
                    'bg-gradient-to-br',
                    card.iconGradient,
                    'shadow-lg',
                  )}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  {card.description}
                </p>
                <ArrowRight
                  className={cn(
                    'absolute bottom-6 right-6 h-4 w-4 text-gray-600',
                    'transition-all duration-200',
                    'group-hover:translate-x-1 group-hover:text-gray-400',
                  )}
                />
              </Link>
            );
          })}
        </div>
      </section>

      {/* What is LumiqAI */}
      <section>
        <h2 className="mb-4 text-2xl font-bold text-white">
          What is LumiqAI?
        </h2>
        <div className="rounded-2xl border border-gray-800 bg-gray-900/30 p-6">
          <p className="leading-relaxed text-gray-300">
            LumiqAI is a comprehensive SMB credit analytics platform purpose-built
            for banks and financial institutions. It aggregates business data,
            credit bureau scores, financial statements, and alternative data
            sources into a unified API, enabling real-time credit decisioning,
            portfolio monitoring, and risk management. Whether you are building
            an internal underwriting workflow or a customer-facing lending
            portal, LumiqAI provides the data infrastructure you need.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Businesses Monitored', value: '50,000+' },
              { label: 'API Uptime', value: '99.9%' },
              { label: 'Avg Response Time', value: '<200ms' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-gray-800 bg-gray-950/50 p-4 text-center"
              >
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section>
        <h2 className="mb-4 text-2xl font-bold text-white">Quick Links</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.title}
                to={link.href}
                className={cn(
                  'group flex items-start gap-4 rounded-xl border border-gray-800 bg-gray-900/30 p-4',
                  'transition-all duration-200',
                  'hover:border-gray-700 hover:bg-gray-900/60',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                )}
              >
                <div className="rounded-lg bg-gray-800/50 p-2">
                  <Icon className="h-4 w-4 text-gray-400 transition-colors duration-200 group-hover:text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{link.title}</h3>
                  <p className="mt-0.5 text-xs text-gray-500">{link.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
