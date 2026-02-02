"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PROVIDERS = ["STRIPE", "RAZORPAY", "COD"] as const;

type PaymentIntentResponse = {
  id?: string;
  provider?: string;
  status?: string;
  clientSecret?: string;
};

export default function PaymentIntentForm() {
  const [orderId, setOrderId] = useState("");
  const [provider, setProvider] = useState("STRIPE");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PaymentIntentResponse | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/payments/intent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ orderId, provider }),
      });
      const json = (await res.json().catch(() => null)) as
        | PaymentIntentResponse
        | { message?: string }
        | null;
      if (!res.ok) {
        setError((json as { message?: string })?.message || "Failed to create intent");
        return;
      }
      setResult(json as PaymentIntentResponse);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="orderId">Order ID</Label>
        <Input
          id="orderId"
          value={orderId}
          onChange={(event) => setOrderId(event.target.value)}
          placeholder="UUID"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="provider">Provider</Label>
        <select
          id="provider"
          className="rounded-md border bg-background px-3 py-2 text-sm"
          value={provider}
          onChange={(event) => setProvider(event.target.value)}
        >
          {PROVIDERS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button type="submit" disabled={loading}>
        {loading ? "Creating…" : "Create payment intent"}
      </Button>

      {result ? (
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          <div>Provider: {result.provider ?? "-"}</div>
          <div>Status: {result.status ?? "-"}</div>
          {result.clientSecret ? (
            <div className="break-all text-xs text-muted-foreground">{result.clientSecret}</div>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
