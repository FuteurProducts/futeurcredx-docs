import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  accentColor?: "primary" | "accent" | "success" | "warning";
}

export function MetricCard({ title, value, change, changeType, icon: Icon, accentColor = "primary" }: MetricCardProps) {
  const changeColor = {
    positive: "text-success",
    negative: "text-destructive",
    neutral: "text-muted-foreground",
  }[changeType];

  const accentStyles = {
    primary: "border-l-primary bg-gradient-to-r from-primary/5 to-transparent",
    accent: "border-l-accent bg-gradient-to-r from-accent/5 to-transparent",
    success: "border-l-success bg-gradient-to-r from-success/5 to-transparent",
    warning: "border-l-warning bg-gradient-to-r from-warning/5 to-transparent",
  }[accentColor];

  const iconStyles = {
    primary: "bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/25",
    accent: "bg-gradient-to-br from-accent to-accent/80 text-white shadow-lg shadow-accent/25",
    success: "bg-gradient-to-br from-success to-success/80 text-white shadow-lg shadow-success/25",
    warning: "bg-gradient-to-br from-warning to-warning/80 text-white shadow-lg shadow-warning/25",
  }[accentColor];

  return (
    <Card className={`shadow-sm hover:shadow-md transition-all duration-300 border-l-4 ${accentStyles} overflow-hidden`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{title}</p>
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconStyles}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          <p className={`text-sm ${changeColor} font-semibold`}>{change}</p>
        </div>
      </CardContent>
    </Card>
  );
}

