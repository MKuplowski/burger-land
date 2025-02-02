import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  onClose: () => void;
  children: React.ReactNode;
  testId?: string;
}

export function Modal({
  onClose,
  children,
  testId,
  className,
  ...props
}: ModalProps) {

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 px-4",
          className
        )}
        {...props}
      >
        <div
          className="animate-in fade-in-0 zoom-in-95 duration-200"
          data-testid={testId}
        >
          {children}
        </div>
      </div>
    </>
  );
}