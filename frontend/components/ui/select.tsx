"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Select({
  children,
  placeholder,
  onValueChange,
  defaultValue
}: {
  children: React.ReactNode;
  placeholder?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
}) {
  return (
    <SelectPrimitive.Root onValueChange={onValueChange} defaultValue={defaultValue}>
      <SelectPrimitive.Trigger className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-white px-3 text-sm shadow-sm">
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon>
          <ChevronDown className="h-4 w-4" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content className="z-50 overflow-hidden rounded-md border bg-white shadow-md">
          <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <SelectPrimitive.Item
      value={value}
      className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm outline-none hover:bg-muted"
    >
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}
