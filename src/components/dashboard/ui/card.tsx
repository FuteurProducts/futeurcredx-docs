import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Premium card styling with enhanced shadows and hover effects
      "rounded-2xl border border-border/50 bg-card text-card-foreground",
      "shadow-[0px_4px_6px_-2px_rgba(0,0,0,0.05),0px_10px_15px_-3px_rgba(0,0,0,0.1)]",
      "transition-all duration-300 ease-out",
      // Enhanced hover - lift effect with stronger shadow
      "hover:shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]",
      "hover:-translate-y-1 hover:border-border",
      // Subtle gradient overlay on hover
      "relative overflow-hidden",
      "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300",
      "hover:before:opacity-100",
      // Dark mode with premium inset glow and stronger shadow
      "dark:bg-gradient-to-br dark:from-slate-800/90 dark:to-slate-900/90 dark:border-white/5",
      "dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0px_10px_20px_-5px_rgba(0,0,0,0.5)]",
      "dark:hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0px_25px_30px_-10px_rgba(0,0,0,0.6)]",
      "dark:hover:border-white/10",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-2 p-6 pb-4", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

const CardMetric = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title: string;
    value: string;
    trend?: number;
    trendLabel?: string;
  }
>(({ className, title, value, trend, trendLabel = "vs last month", ...props }, ref) => (
  <Card ref={ref} className={cn("p-5", className)} {...props}>
    <p className="text-caption text-muted-foreground mb-1">{title}</p>
    <p className="text-h4 text-foreground mb-2">{value}</p>
    {trend !== undefined && (
      <div className="flex items-center gap-2">
        <span className={cn(
          "label",
          trend >= 0 ? "label-green" : "label-red"
        )}>
          {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
        </span>
        <span className="text-caption text-muted-foreground">{trendLabel}</span>
      </div>
    )}
  </Card>
));
CardMetric.displayName = "CardMetric";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardMetric };
