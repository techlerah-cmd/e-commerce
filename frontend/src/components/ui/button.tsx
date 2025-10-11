import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Royal Purple Gradient Default
        default:
          "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-luxury hover:scale-[1.03] hover:shadow-glow active:scale-95",

        // Golden Accent (Destructive replaced with elegant gold version)
        destructive:
          "bg-gradient-to-r from-accent to-accent-glow text-accent-foreground hover:opacity-90 shadow-glow",

        // Gold Border Outline
        outline:
          "border-2 border-accent text-accent bg-transparent hover:bg-accent hover:text-accent-foreground transition-all duration-300",

        // 🆕 Outline Secondary
        outlineSecondary:
          "border-2 border-secondary text-secondary bg-transparent hover:bg-secondary hover:text-secondary-foreground transition-all duration-300",

        // 🆕 Outline Primary (new)
        outlinePrimary:
          "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground transition-all duration-300",

        // Subtle Muted Button
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-primary hover:border-secondary hover:text-foreground shadow-sm",

        // Minimal transparent button
        ghost:
          "text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all duration-300",

        // Underlined link button
        link: "text-accent hover:text-accent-glow transition-all duration-300",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-full px-8 text-base font-medium",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant,
      className,
      size,
      asChild = false,
      loading = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
