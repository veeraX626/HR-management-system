"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" }
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <header className="flex items-center justify-between border-b bg-white/70 px-6 py-4 backdrop-blur dark:bg-slate-900/70">
      <Link href="/" className="text-lg font-semibold text-primary">
        Hackathon Starter
      </Link>
      <nav className="flex items-center gap-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium ${pathname === link.href ? "text-primary" : "text-muted-foreground"}`}
          >
            {link.label}
          </Link>
        ))}
        <Button
          variant="ghost"
          aria-label="Toggle theme"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex items-center gap-2"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />} Dark
        </Button>
      </nav>
    </header>
  );
}
