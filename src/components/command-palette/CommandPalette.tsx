import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Home,
  Lightbulb,
  FileText,
  Eye,
  Briefcase,
  KeyRound,
  Link2,
  TrendingUp,
  Package,
  Building2,
  BarChart3,
  SlidersHorizontal,
  Moon,
  Sun,
  LogOut,
  Bell,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Command {
  id: string;
  label: string;
  icon: LucideIcon;
  action: () => void;
  keywords?: string[];
  group: 'Navigation' | 'Actions';
  shortcut?: string;
}

interface CommandPaletteProps {
  onNavigate?: (tab: string) => void;
}

export function CommandPalette({ onNavigate }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { resolvedTheme, setTheme } = useTheme();
  const { signOut } = useAuth();

  // Handle navigation - either use provided callback or navigate directly
  const handleNavigate = useCallback(
    (tab: string) => {
      if (onNavigate) {
        onNavigate(tab);
      } else {
        navigate(`/dashboard?tab=${tab}`);
      }
      setOpen(false);
    },
    [navigate, onNavigate]
  );

  // Keyboard shortcut listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Define commands
  const commands: Command[] = useMemo(
    () => [
      // Navigation
      {
        id: 'overview',
        label: 'Go to Dashboard',
        icon: Home,
        action: () => handleNavigate('overview'),
        keywords: ['home', 'main', 'start'],
        group: 'Navigation',
        shortcut: 'G D',
      },
      {
        id: 'credit-intel',
        label: 'Go to Credit Intelligence',
        icon: Lightbulb,
        action: () => handleNavigate('credit-intel'),
        keywords: ['credit', 'intelligence', 'score'],
        group: 'Navigation',
        shortcut: 'G C',
      },
      {
        id: 'underwriting',
        label: 'Go to Underwriting',
        icon: FileText,
        action: () => handleNavigate('underwriting'),
        keywords: ['underwrite', 'applications', 'apply'],
        group: 'Navigation',
        shortcut: 'G U',
      },
      {
        id: 'risk',
        label: 'Go to Risk Dashboard',
        icon: Eye,
        action: () => handleNavigate('risk'),
        keywords: ['risk', 'monitor', 'alerts'],
        group: 'Navigation',
        shortcut: 'G R',
      },
      {
        id: 'customer',
        label: 'Go to Customer Engagement',
        icon: Briefcase,
        action: () => handleNavigate('customer'),
        keywords: ['customer', 'smb', 'business', 'engagement'],
        group: 'Navigation',
        shortcut: 'G E',
      },
      {
        id: 'api-keys',
        label: 'Go to API Console',
        icon: KeyRound,
        action: () => handleNavigate('api-keys'),
        keywords: ['api', 'keys', 'credentials', 'tokens', 'console'],
        group: 'Navigation',
        shortcut: 'G A',
      },
      {
        id: 'partner-portal',
        label: 'Go to Partner Portal',
        icon: Link2,
        action: () => handleNavigate('partner-portal'),
        keywords: ['partner', 'portal', 'integrations'],
        group: 'Navigation',
        shortcut: 'G P',
      },
      {
        id: 'analytics',
        label: 'Go to Analytics',
        icon: TrendingUp,
        action: () => handleNavigate('analytics'),
        keywords: ['analytics', 'stats', 'metrics'],
        group: 'Navigation',
        shortcut: 'G N',
      },
      {
        id: 'products',
        label: 'Go to Products',
        icon: Package,
        action: () => handleNavigate('products'),
        keywords: ['products', 'catalog', 'offerings'],
        group: 'Navigation',
      },
      {
        id: 'users',
        label: 'Go to Users',
        icon: Building2,
        action: () => handleNavigate('users'),
        keywords: ['users', 'team', 'members'],
        group: 'Navigation',
      },
      {
        id: 'reports',
        label: 'Go to Reports',
        icon: BarChart3,
        action: () => handleNavigate('reports'),
        keywords: ['reports', 'export', 'download'],
        group: 'Navigation',
      },
      {
        id: 'notifications',
        label: 'Go to Notifications',
        icon: Bell,
        action: () => handleNavigate('notifications'),
        keywords: ['notifications', 'alerts', 'inbox'],
        group: 'Navigation',
      },
      {
        id: 'settings',
        label: 'Go to Settings',
        icon: SlidersHorizontal,
        action: () => handleNavigate('settings'),
        keywords: ['settings', 'config', 'preferences'],
        group: 'Navigation',
        shortcut: 'G S',
      },
      // Actions
      {
        id: 'toggle-theme',
        label: resolvedTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
        icon: resolvedTheme === 'dark' ? Sun : Moon,
        action: () => {
          setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
          setOpen(false);
        },
        keywords: ['theme', 'dark', 'light', 'mode', 'appearance'],
        group: 'Actions',
        shortcut: 'T T',
      },
      {
        id: 'sign-out',
        label: 'Sign Out',
        icon: LogOut,
        action: () => {
          signOut();
          setOpen(false);
        },
        keywords: ['logout', 'sign out', 'exit'],
        group: 'Actions',
      },
    ],
    [handleNavigate, resolvedTheme, setTheme, signOut]
  );

  // Group commands
  const navigationCommands = commands.filter((cmd) => cmd.group === 'Navigation');
  const actionCommands = commands.filter((cmd) => cmd.group === 'Actions');

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {navigationCommands.map((command) => (
            <CommandItem
              key={command.id}
              value={`${command.label} ${command.keywords?.join(' ') || ''}`}
              onSelect={command.action}
              className="flex items-center gap-3 cursor-pointer"
            >
              <command.icon className="h-4 w-4 text-muted-foreground" />
              <span>{command.label}</span>
              {command.shortcut && (
                <span className="ml-auto text-xs text-muted-foreground tracking-widest">
                  {command.shortcut}
                </span>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          {actionCommands.map((command) => (
            <CommandItem
              key={command.id}
              value={`${command.label} ${command.keywords?.join(' ') || ''}`}
              onSelect={command.action}
              className="flex items-center gap-3 cursor-pointer"
            >
              <command.icon className="h-4 w-4 text-muted-foreground" />
              <span>{command.label}</span>
              {command.shortcut && (
                <span className="ml-auto text-xs text-muted-foreground tracking-widest">
                  {command.shortcut}
                </span>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export default CommandPalette;
