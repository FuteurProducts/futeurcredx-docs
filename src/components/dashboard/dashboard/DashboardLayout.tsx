import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { useEnvironment } from "@/contexts/EnvironmentContext";
import { FlaskConical, Radio } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  hideSidebar?: boolean;
}

export function DashboardLayout({ children, hideSidebar = false }: DashboardLayoutProps) {
  const { currentEnvironment } = useEnvironment();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-surface">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg">
          Skip to main content
        </a>
        {!hideSidebar && <DashboardSidebar />}
        <div className="flex-1 flex flex-col">
          <DashboardHeader showMenu={hideSidebar} />
          {/* Environment Banner */}
          {currentEnvironment === 'sandbox' ? (
            <div className="flex items-center gap-2 px-4 py-1.5 bg-warning/10 text-warning text-xs font-medium border-b border-warning/20">
              <FlaskConical className="w-3.5 h-3.5" />
              Sandbox Environment — Test data only
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-1.5 bg-success/10 text-success text-xs font-medium border-b border-success/20">
              <Radio className="w-3.5 h-3.5" />
              Production — Live data
            </div>
          )}
          <main id="main-content" className="flex-1 p-6 overflow-auto bg-surface">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
