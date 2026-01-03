"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

const schema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  full_name: z.string().optional(),
  password: z.string().min(6).optional()
});

type FormValues = z.infer<typeof schema>;

export function FormModal({
  triggerLabel,
  defaultValues,
  onSubmit
}: {
  triggerLabel: string;
  defaultValues?: Partial<FormValues>;
  onSubmit: (data: FormValues) => Promise<void> | void;
}) {
  const { push } = useToast();
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });

  useEffect(() => {
    if (defaultValues) form.reset(defaultValues);
  }, [defaultValues, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
    push("Saved");
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader title="User" description="Create or edit a user" />
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input placeholder="Username" {...form.register("username")} />
          <Input placeholder="Email" type="email" {...form.register("email")} />
          <Input placeholder="Full name" {...form.register("full_name")} />
          <Input placeholder="Password" type="password" {...form.register("password")} />
          <Button type="submit" className="w-full">
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
