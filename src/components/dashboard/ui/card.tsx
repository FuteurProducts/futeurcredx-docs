import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-3xl border border-border bg-card text-card-foreground shadow-[var(--shadow-widget)] transition-all duration-200 hover:shadow-[var(--shadow-depth)]",
      "dark:shadow-[inset_0_0_0_1.5px_rgba(229,229,229,0.04),0px_5px_1.5px_-4px_rgba(8,8,8,0.5),0px_6px_4px_-4px_rgba(8,8,8,0.05)]",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-title leading-none tracking-tight", className)} {...props} />
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
