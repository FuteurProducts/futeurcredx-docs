import { NavLink } from "react-router-dom";
import { LayoutDashboard, BarChart3, Users, FileText, TrendingUp, Settings } from "lucide-react";

const menuItems = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Users", url: "/users", icon: Users },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Performance", url: "/performance", icon: TrendingUp },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function DashboardTopNav() {
  return (
    <nav className="w-full border-b border-border bg-white/90 backdrop-blur-sm sticky top-16 z-10">
      <div className="max-w-7xl mx-auto px-6">
        <ul className="flex items-center gap-1 py-2 overflow-x-auto">
          {menuItems.map((item) => (
            <li key={item.title}>
              <NavLink
                to={item.url}
                end
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span>{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}


