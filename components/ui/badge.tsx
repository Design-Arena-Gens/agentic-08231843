import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary-500/20 text-primary-200",
        outline: "border-slate-700 text-slate-300",
        success: "border-transparent bg-emerald-500/20 text-emerald-200",
        warning: "border-transparent bg-amber-500/20 text-amber-200",
        danger: "border-transparent bg-red-500/20 text-red-200"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
