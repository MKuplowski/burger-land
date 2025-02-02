import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

export function Card({
  title,
  description,
  footer,
  children,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-gray-100 rounded-2xl p-8 shadow-sm",
        className
      )}
      {...props}
    >
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
        )}
      </div>
      {children && <div className="mt-6">{children}</div>}
      {footer && (
        <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
          {footer}
        </div>
      )}
    </div>
  );
}