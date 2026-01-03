"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type Column<T> = {
  key: keyof T;
  header: string;
};

export function GenericTable<T extends Record<string, any>>({ data, columns }: { data: T[]; columns: Column<T>[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: keyof T; dir: "asc" | "desc" } | null>(null);

  const filtered = useMemo(() => {
    const term = query.toLowerCase();
    let rows = data.filter((row) => JSON.stringify(row).toLowerCase().includes(term));
    if (sort) {
      rows = [...rows].sort((a, b) => {
        const aVal = a[sort.key];
        const bVal = b[sort.key];
        if (aVal === bVal) return 0;
        if (aVal > bVal) return sort.dir === "asc" ? 1 : -1;
        return sort.dir === "asc" ? -1 : 1;
      });
    }
    return rows;
  }, [data, query, sort]);

  const toggleSort = (key: keyof T) => {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: "asc" };
      return { key, dir: prev.dir === "asc" ? "desc" : "asc" };
    });
  };

  return (
    <div className="space-y-2">
      <Input placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={String(col.key)}>
                <Button variant="ghost" className="p-0 text-left" onClick={() => toggleSort(col.key)}>
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    <ArrowUpDown className="h-3 w-3" />
                  </span>
                </Button>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((row) => (
            <TableRow key={row.id ?? JSON.stringify(row)}>
              {columns.map((col) => (
                <TableCell key={String(col.key)}>{String(row[col.key])}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
