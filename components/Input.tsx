import { cn } from "@/lib/utils";
import { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  customInput?: ReactNode;
}

export function Input({
  label,
  error,
  className,
  inputClassName,
  labelClassName,
  customInput,
  id,
  ...props
}: InputProps) {
  const inputClasses = cn(
    "w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 transition-shadow",
    error && "border-red-500 focus:ring-red-200",
    inputClassName
  );

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "block text-sm font-medium text-gray-700",
            labelClassName
          )}
        >
          {label}
        </label>
      )}

      {customInput ? (
        <div className={inputClasses}>
          {customInput}
        </div>
      ) : (
        <input
          id={id}
          className={inputClasses}
          {...props}
        />
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}