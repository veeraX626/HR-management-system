import { ReactNode } from "react";
import { FieldErrors, UseFormRegisterReturn } from "react-hook-form";
import { cn } from "@/lib/utils";

export function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-foreground/80">{label}</label>
      {children}
    </div>
  );
}

export function FormInput({
  registration,
  errors,
  name,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  registration: UseFormRegisterReturn;
  errors: FieldErrors;
  name: string;
}) {
  return (
    <div className="space-y-1">
      <input
        className={cn(
          "w-full rounded-md border border-input bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary",
          props.className
        )}
        {...registration}
        {...props}
      />
      {errors[name] && (
        <p className="text-xs text-red-500">{String((errors as any)[name]?.message || "Invalid")}</p>
      )}
    </div>
  );
}
