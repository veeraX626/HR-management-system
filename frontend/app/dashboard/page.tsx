"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GenericTable } from "@/components/GenericTable";
import { FormModal } from "@/components/FormModal";
import { useToast } from "@/components/ui/toast";

const schema = z.object({ username: z.string(), password: z.string() });

type LoginForm = z.infer<typeof schema>;

export default function DashboardPage() {
  const [authed, setAuthed] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const { push } = useToast();
  const router = useRouter();
  const form = useForm<LoginForm>({ resolver: zodResolver(schema) });

  useEffect(() => {
    const token = auth.load();
    if (token) setAuthed(true);
  }, []);

  useEffect(() => {
    if (!authed) return;
    api.users
      .list()
      .then(setUsers)
      .catch(() => push("Failed to load users"));
  }, [authed, push]);

  const onLogin = form.handleSubmit(async (values) => {
    const token = await api.login(values.username, values.password);
    auth.save(token);
    setAuthed(true);
    push("Logged in");
    router.refresh();
  });

  const onCreate = async (data: any) => {
    await api.users.create(data);
    const refreshed = await api.users.list();
    setUsers(refreshed);
  };

  if (!authed) {
    return (
      <div className="mx-auto max-w-sm space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Protected Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={onLogin}>
              <Input placeholder="Username" {...form.register("username")} />
              <Input placeholder="Password" type="password" {...form.register("password")} />
              <Button className="w-full" type="submit">
                Login
              </Button>
            </form>
            <p className="mt-2 text-xs text-muted-foreground">Use demo/password (seeded).</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Users</h1>
        <FormModal triggerLabel="New User" onSubmit={onCreate} />
      </div>
      <Card>
        <CardContent>
          <GenericTable data={users} columns={[{ key: "username", header: "Username" }, { key: "email", header: "Email" }, { key: "full_name", header: "Name" }]} />
        </CardContent>
      </Card>
    </div>
  );
}
