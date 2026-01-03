import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GenericTable } from "@/components/GenericTable";
import { SimpleLineChart } from "@/components/ui/chart";

const metrics = [
  { label: "Signups", value: "482", change: "+12%" },
  { label: "Active", value: "1,203", change: "+4%" },
  { label: "MRR", value: "$8.4k", change: "+9%" },
  { label: "Latency", value: "132ms", change: "-3%" }
];

const tableData = [
  { id: 1, name: "Acme Corp", status: "Active", plan: "Pro" },
  { id: 2, name: "Globex", status: "Trial", plan: "Starter" },
  { id: 3, name: "Soylent", status: "Active", plan: "Enterprise" }
];

const chartData = [
  { name: "Mon", value: 30 },
  { name: "Tue", value: 45 },
  { name: "Wed", value: 32 },
  { name: "Thu", value: 50 },
  { name: "Fri", value: 60 },
  { name: "Sat", value: 48 },
  { name: "Sun", value: 52 }
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Badge>Next.js 15 + FastAPI</Badge>
          <h1 className="text-4xl font-bold leading-tight">Ship a full stack MVP today.</h1>
          <p className="text-lg text-muted-foreground">
            Prewired auth, charts, CRUD table, and API glue so your hackathon team can focus on the pitch.
          </p>
          <div className="flex gap-3">
            <Button>Deploy Frontend</Button>
            <Button variant="outline">Open API</Button>
          </div>
        </div>
        <Card className="bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 text-white">
          <CardHeader>
            <CardTitle>Live Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleLineChart data={chartData} />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">{metric.label}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">{metric.value}</CardContent>
            <CardContent className="text-xs text-primary">{metric.change} vs last week</CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Demo Data</h2>
            <p className="text-sm text-muted-foreground">Sortable & searchable table component</p>
          </div>
          <Button variant="outline">Export CSV</Button>
        </div>
        <Card>
          <CardContent>
            <GenericTable data={tableData} columns={[{ key: "name", header: "Name" }, { key: "status", header: "Status" }, { key: "plan", header: "Plan" }]} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
