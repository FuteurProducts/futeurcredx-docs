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
    <Sidebar className={`${open ? "w-64" : "w-16"} relative`} collapsible="icon" role="navigation">
      {/* Vibrant colored accent strip on left edge */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-primary" />

      <SidebarContent className="flex flex-col h-full pl-1">
        <div className="p-4 border-b border-border">
          {open ? (
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Dashboard
            </h2>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        <SidebarGroup className="mt-4 flex-1">
          <SidebarGroupLabel className="text-primary/70 font-semibold">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-primary/15 to-accent/10 text-primary font-semibold border-l-2 border-primary shadow-sm"
                            : "text-muted-foreground hover:bg-primary/5 hover:text-primary hover:translate-x-1"
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
            <div className={`flex items-center gap-2 px-2.5 py-2 rounded-lg bg-gradient-to-r from-warning/15 to-warning/5 text-warning border border-warning/20 ${open ? '' : 'justify-center'}`}>
              <FlaskConical className="w-4 h-4 shrink-0" />
              {open && <span className="text-xs font-semibold uppercase tracking-wide">Sandbox</span>}
            </div>
          ) : (
            <div className={`flex items-center gap-2 px-2.5 py-2 rounded-lg bg-gradient-to-r from-success/15 to-success/5 text-success border border-success/20 ${open ? '' : 'justify-center'}`}>
              <Radio className="w-4 h-4 shrink-0" />
              {open && <span className="text-xs font-semibold uppercase tracking-wide">Production</span>}
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
