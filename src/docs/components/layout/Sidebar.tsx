import { useCallback, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  Activity,
  BarChart3,
  BookOpen,
  Box,
  ChevronDown,
  ChevronRight,
  Clock,
  CreditCard,
  FileText,
  HelpCircle,
  Home,
  Key,
  Layers,
  LifeBuoy,
  MessageSquare,
  Scale,
  Server,
  Settings,
  Shield,
  ShieldAlert,
  Users,
  Webhook,
  X,
  Zap,
} from 'lucide-react';

import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: typeof Home;
  children?: NavItem[];
}

const apiReferenceChildren: NavItem[] = [
  { label: 'Health', path: '/api-reference#health', icon: Activity },
  { label: 'Portfolios', path: '/api-reference#portfolios', icon: Layers },
  { label: 'Businesses', path: '/api-reference#businesses', icon: Users },
  { label: 'Credit Scores', path: '/api-reference#credit-scores', icon: CreditCard },
  { label: 'Risk', path: '/api-reference#risk', icon: ShieldAlert },
  { label: 'Underwriting', path: '/api-reference#underwriting', icon: Scale },
  { label: 'Analytics', path: '/api-reference#analytics', icon: BarChart3 },
  { label: 'API Keys', path: '/api-reference#api-keys', icon: Key },
  { label: 'Reports', path: '/api-reference#reports', icon: FileText },
  { label: 'Audit', path: '/api-reference#audit', icon: Clock },
  { label: 'Webhooks', path: '/api-reference#webhooks-api', icon: Webhook },
];

const navItems: NavItem[] = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Quickstart', path: '/quickstart', icon: Zap },
  { label: 'Authentication', path: '/authentication', icon: Shield },
  {
    label: 'API Reference',
    path: '/api-reference',
    icon: BookOpen,
    children: apiReferenceChildren,
  },
  { label: 'Sandbox', path: '/sandbox', icon: Box },
  { label: 'Errors', path: '/errors', icon: MessageSquare },
  { label: 'Data Models', path: '/data-models', icon: Server },
  { label: 'Webhooks', path: '/webhooks', icon: Webhook },
  { label: 'Changelog', path: '/changelog', icon: Settings },
  { label: 'FAQ', path: '/faq', icon: HelpCircle },
];

interface NavLinkItemProps {
  item: NavItem;
  depth: number;
  currentPath: string;
}

function NavLinkItem({ item, depth, currentPath }: NavLinkItemProps) {
  const hasChildren = item.children && item.children.length > 0;
  const isActive =
    currentPath === item.path ||
    (hasChildren && currentPath.startsWith(item.path));
  const [expanded, setExpanded] = useState(isActive);

  const toggleExpanded = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setExpanded((prev) => !prev);
  }, []);

  const Icon = item.icon;

  return (
    <div>
      <div className="flex items-center">
        <Link
          to={item.path}
          className={cn(
            'flex flex-1 items-center gap-2.5 rounded-lg px-3 py-2 text-sm',
            'transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50',
            depth > 0 && 'pl-9',
            isActive && !hasChildren
              ? 'bg-gray-800/80 font-medium text-white'
              : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200',
          )}
        >
          {depth === 0 && (
            <Icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          )}
          {depth > 0 && (
            <span
              className={cn(
                'h-1 w-1 flex-shrink-0 rounded-full',
                isActive ? 'bg-blue-400' : 'bg-gray-600',
              )}
              aria-hidden="true"
            />
          )}
          <span>{item.label}</span>
        </Link>
        {hasChildren && (
          <button
            type="button"
            onClick={toggleExpanded}
            className={cn(
              'mr-2 rounded-md p-1 text-gray-500 hover:text-gray-300',
              'transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50',
            )}
            aria-label={expanded ? `Collapse ${item.label}` : `Expand ${item.label}`}
            aria-expanded={expanded}
          >
            {expanded ? (
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div className="mt-0.5 space-y-0.5">
          {item.children?.map((child) => (
            <NavLinkItem
              key={child.path}
              item={child}
              depth={depth + 1}
              currentPath={currentPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname + location.hash;

  const sidebarContent = (
    <nav
      className="flex h-full flex-col"
      aria-label="Documentation navigation"
    >
      {/* Mobile close button */}
      <div className="flex items-center justify-end p-2 lg:hidden">
        <button
          type="button"
          onClick={onClose}
          className={cn(
            'rounded-lg p-2 text-gray-400 hover:text-white',
            'transition-colors duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50',
          )}
          aria-label="Close navigation"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLinkItem
              key={item.path}
              item={item}
              depth={0}
              currentPath={currentPath}
            />
          ))}
        </div>

        {/* Support link */}
        <div className="mt-8 border-t border-gray-800 pt-4">
          <a
            href="mailto:support@futeurcredx.com"
            className={cn(
              'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm',
              'text-gray-400 hover:bg-gray-800 hover:text-gray-200',
              'transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50',
            )}
          >
            <LifeBuoy className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <span>Support</span>
          </a>
        </div>
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:block',
          'sticky top-16 h-[calc(100vh-4rem)] w-64 flex-shrink-0',
          'border-r border-gray-800 bg-gray-900',
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                onClose?.();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Close navigation overlay"
          />
          {/* Slide-in panel */}
          <aside
            className={cn(
              'fixed inset-y-0 left-0 z-50 w-64',
              'border-r border-gray-800 bg-gray-900',
              'lg:hidden',
              'animate-in slide-in-from-left duration-200',
            )}
          >
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
