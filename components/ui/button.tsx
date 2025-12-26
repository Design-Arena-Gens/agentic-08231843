import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none ring-offset-slate-950",
  {
    variants: {
      variant: {
        default: "bg-primary-500 text-white hover:bg-primary-400",
        ghost: "bg-slate-900 text-slate-100 hover:bg-slate-800",
        outline: "border border-slate-700 bg-transparent hover:bg-slate-800",
        subtle: "bg-slate-800 text-slate-100 hover:bg-slate-700",
        destructive: "bg-red-600 hover:bg-red-500 text-white"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
