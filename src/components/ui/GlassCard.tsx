import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "strong" | "glow";
  glowColor?: "primary" | "accent" | "destructive";
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", glowColor, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl transition-all duration-300",
          variant === "default" && "glass",
          variant === "strong" && "glass-strong",
          variant === "glow" && glowColor === "primary" && "glass glow-primary",
          variant === "glow" && glowColor === "accent" && "glass glow-accent",
          variant === "glow" && glowColor === "destructive" && "glass glow-destructive",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";
