import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ElementType } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
  as?: ElementType;
}

// TODO: as the app grows, discuss using a storybook or even separating out a separate ui package
export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  asChild = false,
  as: Component = "button",
  ...props
}: ButtonProps) {
  const baseStyles = "font-medium transition-colors duration-300 rounded-lg";

  const variants = {
    primary: "bg-gray-900 text-white hover:bg-gray-800",
    secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const styles = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    className
  );

  if (asChild) {
    return (
      <span className={styles}>
        {children}
      </span>
    );
  }

  return (
    <Component
      className={styles}
      {...props}
    >
      {children}
    </Component>
  );
}
