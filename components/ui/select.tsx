import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "flex h-10 w-full appearance-none rounded-xl border border-slate-800 bg-slate-950/80 px-4 text-sm text-slate-100 shadow-inner shadow-slate-950/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";
