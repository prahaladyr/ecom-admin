"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ORDER_STATUSES = ["PENDING", "PAID", "CANCELLED", "FULFILLED", "REFUNDED"] as const;

type StatusResponse = {
  id: string;
  status: string;
  updatedAt?: string;
};

export default function OrderStatusForm() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [result, setResult] = useState<StatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function lookup() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`);
      const json = (await res.json().catch(() => null)) as
        | StatusResponse
        | { message?: string }
        | null;
      if (!res.ok || !json || typeof (json as StatusResponse).status !== "string") {
        setError((json as { message?: string })?.message || "Order not found");
        setResult(null);
        return;
      }
      setResult(json as StatusResponse);
      setStatus((json as StatusResponse).status);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = (await res.json().catch(() => null)) as
        | StatusResponse
        | { message?: string }
        | null;
      if (!res.ok) {
        setError((json as { message?: string })?.message || "Failed to update status");
        return;
      }
      setResult(json as StatusResponse);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="orderId">Order ID</Label>
        <Input
          id="orderId"
          value={orderId}
          onChange={(event) => setOrderId(event.target.value)}
          placeholder="UUID"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={lookup} disabled={!orderId || loading}>
          {loading ? "Loading…" : "Check status"}
        </Button>
      </div>

      {result ? (
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          <div>
            <span className="text-muted-foreground">Current status:</span> {result.status}
          </div>
          {result.updatedAt ? (
            <div className="text-xs text-muted-foreground">Updated {result.updatedAt}</div>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-2">
        <Label htmlFor="status">Update status</Label>
        <select
          id="status"
          className="rounded-md border bg-background px-3 py-2 text-sm"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          {ORDER_STATUSES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button type="button" onClick={updateStatus} disabled={!orderId || loading}>
        {loading ? "Saving…" : "Update status"}
      </Button>
    </div>
  );
}
