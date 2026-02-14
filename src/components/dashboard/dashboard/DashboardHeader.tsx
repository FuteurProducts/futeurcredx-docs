import { Bell, Search, User, LayoutDashboard, BarChart3, Users, FileText, TrendingUp, Settings, Sun, Moon, Monitor } from "lucide-react";
import { toast } from "sonner";
import { UserButton } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { useTheme } from "@/contexts/ThemeContext";
import { useEnvironment } from "@/contexts/EnvironmentContext";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NavLink } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ConnectedEnvironmentToggle } from "@/components/widgets";
import { useUser, useAuth } from "@/contexts/AuthContext";
import { isClerkConfigured } from "@/contexts/AuthContext";

interface DashboardHeaderProps {
  showMenu?: boolean;
}

const defaultMenu = [
  { title: "Overview", url: "/dashboard?tab=overview", icon: LayoutDashboard },
  { title: "Analytics", url: "/dashboard?tab=analytics", icon: BarChart3 },
  { title: "Users", url: "/dashboard?tab=users", icon: Users },
  { title: "Reports", url: "/dashboard?tab=reports", icon: FileText },
  { title: "Performance", url: "/dashboard?tab=performance", icon: TrendingUp },
  { title: "Settings", url: "/dashboard?tab=settings", icon: Settings },
];

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const useClerkUI = isClerkConfigured(CLERK_KEY);

export function DashboardHeader({ showMenu = false }: DashboardHeaderProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { isDemoMode } = useEnvironment();
  const { user } = useUser();
  const { signOut } = useAuth();

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-10 relative overflow-hidden">
      {/* Subtle gradient accent at top of header */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />

      <div className="flex items-center gap-4 flex-1 min-w-0">
        <SidebarTrigger className="hover:bg-primary/10 hover:text-primary" />

        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/50 w-4 h-4" />
          <Input
            placeholder="Search..."
            className="pl-10 bg-background border-primary/20 focus-visible:border-primary focus-visible:ring-primary/30"
          />
        </div>

        {showMenu && (
          <nav className="hidden md:block ml-4">
            <ul className="flex items-center gap-1">
              {defaultMenu.map((item) => (
                <li key={item.title}>
                  <NavLink
                    to={item.url}
                    end
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Sandbox/Production Toggle */}
        <ConnectedEnvironmentToggle variant="minimal" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Toggle theme">
              {resolvedTheme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover z-50">
            <DropdownMenuItem onClick={() => setTheme('light')} className="gap-2">
              <Sun className="w-4 h-4" /> Light
              {theme === 'light' && <span className="ml-auto text-xs text-muted-foreground">Active</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')} className="gap-2">
              <Moon className="w-4 h-4" /> Dark
              {theme === 'dark' && <span className="ml-auto text-xs text-muted-foreground">Active</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')} className="gap-2">
              <Monitor className="w-4 h-4" /> System
              {theme === 'system' && <span className="ml-auto text-xs text-muted-foreground">Active</span>}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
          onClick={() => {
            toast.info('You have 3 new notifications');
          }}
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </Button>

        {/* User menu: Clerk UserButton for real auth, fallback avatar for demo/no-auth */}
        {useClerkUI && !isDemoMode ? (
          <UserButton
            afterSignOutUrl="/sign-in"
            appearance={{
              baseTheme: resolvedTheme === 'dark' ? dark : undefined,
              elements: {
                avatarBox: "w-8 h-8 ring-2 ring-primary/20",
                userButtonPopoverCard: { zIndex: 9999, backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))' },
                userButtonPopoverRootBox: { zIndex: 9999 },
                userButtonPopoverActionButton: "text-foreground hover:bg-accent",
                userButtonPopoverActionButtonText: "text-foreground",
                userButtonPopoverFooter: "hidden",
              },
            }}
          />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2" aria-label="User menu">
                <Avatar className="w-8 h-8 ring-2 ring-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden md:inline">{user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover z-50">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={() => signOut()}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}