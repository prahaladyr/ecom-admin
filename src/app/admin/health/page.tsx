import { backendFetch } from "@/lib/backend";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type HealthResponse = {
  status: string;
  checks?: Record<string, { status: string; message?: string }>;
};

async function loadHealth(path: string) {
  const res = await backendFetch(path, { method: "GET" });
  const json = (await res.json().catch(() => null)) as HealthResponse | null;
  return { ok: res.ok, status: res.status, body: json };
}

export default async function HealthPage() {
  const [health, ready] = await Promise.all([
    loadHealth("/api/v1/health"),
    loadHealth("/api/v1/health/ready"),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Health</h1>
        <p className="mt-1 text-sm text-muted-foreground">Service liveness and readiness.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Liveness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <div>Status: {health.ok ? "OK" : `Error (${health.status})`}</div>
              <div className="mt-2 rounded-md border bg-muted/40 p-3 text-xs">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(health.body ?? { message: "No response" }, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Readiness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <div>Status: {ready.ok ? "OK" : `Error (${ready.status})`}</div>
              <div className="mt-2 rounded-md border bg-muted/40 p-3 text-xs">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(ready.body ?? { message: "No response" }, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
