import { LayoutDashboard, BarChart3, Users, Settings, FileText, TrendingUp, FlaskConical, Radio } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useEnvironment } from "@/contexts/EnvironmentContext";

const menuItems = [
  { title: "Overview", url: "/dashboard?tab=overview", icon: LayoutDashboard },
  { title: "Analytics", url: "/dashboard?tab=analytics", icon: BarChart3 },
  { title: "Users", url: "/dashboard?tab=users", icon: Users },
  { title: "Reports", url: "/dashboard?tab=reports", icon: FileText },
  { title: "Performance", url: "/dashboard?tab=performance", icon: TrendingUp },
  { title: "Settings", url: "/dashboard?tab=settings", icon: Settings },
];

export function DashboardSidebar() {
  const { open } = useSidebar();
  const { currentEnvironment } = useEnvironment();

  return (
    <Sidebar className={open ? "w-64" : "w-16"} collapsible="icon" role="navigation">
      <SidebarContent className="flex flex-col h-full">
        <div className="p-4 border-b border-border">
          {open ? (
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Dashboard
            </h2>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-primary" />
            </div>
          )}
        </div>

        <SidebarGroup className="mt-4 flex-1">
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Environment indicator at bottom */}
        <div className="p-3 border-t border-border">
          {currentEnvironment === 'sandbox' ? (
            <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-warning/10 text-warning ${open ? '' : 'justify-center'}`}>
              <FlaskConical className="w-4 h-4 shrink-0" />
              {open && <span className="text-xs font-semibold uppercase tracking-wide">Sandbox</span>}
            </div>
          ) : (
            <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-success/10 text-success ${open ? '' : 'justify-center'}`}>
              <Radio className="w-4 h-4 shrink-0" />
              {open && <span className="text-xs font-semibold uppercase tracking-wide">Production</span>}
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
