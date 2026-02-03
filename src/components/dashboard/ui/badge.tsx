import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Premium gradient badges with glow effects
        default: "border-transparent bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/25 hover:shadow-md hover:shadow-blue-500/30 hover:scale-105",
        secondary: "border-transparent bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-sm hover:shadow-md hover:scale-105",
        destructive: "border-transparent bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-sm shadow-red-500/25 hover:shadow-md hover:shadow-red-500/30 hover:scale-105",
        success: "border-transparent bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-sm shadow-emerald-500/25 hover:shadow-md hover:shadow-emerald-500/30 hover:scale-105",
        warning: "border-transparent bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm shadow-amber-500/25 hover:shadow-md hover:shadow-amber-500/30 hover:scale-105",
        info: "border-transparent bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-sm shadow-cyan-500/25 hover:shadow-md hover:shadow-cyan-500/30 hover:scale-105",
        outline: "text-foreground border-border hover:bg-muted hover:scale-105",
        // New premium variants
        premium: "border-transparent bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-500/30 hover:shadow-lg hover:shadow-purple-500/40 hover:scale-105",
        live: "border-transparent bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-sm shadow-emerald-400/30 animate-pulse",
        new: "border-transparent bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm shadow-pink-500/25 hover:shadow-md hover:scale-105",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
