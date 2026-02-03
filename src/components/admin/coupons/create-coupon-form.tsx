"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const COUPON_TYPES = ["PERCENT", "AMOUNT"] as const;

export default function CreateCouponForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    code: "",
    type: "PERCENT",
    value: "",
    isActive: true,
    maxRedemptions: "",
    perUserLimit: "",
    startsAt: "",
    endsAt: "",
  });

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      code: form.code,
      type: form.type,
      value: Number(form.value),
      isActive: form.isActive,
      maxRedemptions: form.maxRedemptions ? Number(form.maxRedemptions) : undefined,
      perUserLimit: form.perUserLimit ? Number(form.perUserLimit) : undefined,
      startsAt: form.startsAt || undefined,
      endsAt: form.endsAt || undefined,
    };

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => null)) as { message?: string } | null;
      if (!res.ok) {
        setError(json?.message || "Failed to create coupon");
        return;
      }
      setForm({
        code: "",
        type: "PERCENT",
        value: "",
        isActive: true,
        maxRedemptions: "",
        perUserLimit: "",
        startsAt: "",
        endsAt: "",
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="code">Code</Label>
        <Input
          id="code"
          value={form.code}
          onChange={(event) => setForm((prev) => ({ ...prev, code: event.target.value }))}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="type">Type</Label>
        <select
          id="type"
          className="rounded-md border bg-background px-3 py-2 text-sm"
          value={form.type}
          onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
        >
          {COUPON_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="value">Value</Label>
        <Input
          id="value"
          type="number"
          min={0}
          value={form.value}
          onChange={(event) => setForm((prev) => ({ ...prev, value: event.target.value }))}
          required
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.checked }))}
        />
        Active
      </label>

      <div className="grid gap-2">
        <Label htmlFor="maxRedemptions">Max redemptions</Label>
        <Input
          id="maxRedemptions"
          type="number"
          min={0}
          value={form.maxRedemptions}
          onChange={(event) => setForm((prev) => ({ ...prev, maxRedemptions: event.target.value }))}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="perUserLimit">Per-user limit</Label>
        <Input
          id="perUserLimit"
          type="number"
          min={0}
          value={form.perUserLimit}
          onChange={(event) => setForm((prev) => ({ ...prev, perUserLimit: event.target.value }))}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="startsAt">Starts at (ISO)</Label>
        <Input
          id="startsAt"
          type="datetime-local"
          value={form.startsAt}
          onChange={(event) => setForm((prev) => ({ ...prev, startsAt: event.target.value }))}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="endsAt">Ends at (ISO)</Label>
        <Input
          id="endsAt"
          type="datetime-local"
          value={form.endsAt}
          onChange={(event) => setForm((prev) => ({ ...prev, endsAt: event.target.value }))}
        />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button type="submit" disabled={loading}>
        {loading ? "Creating…" : "Create coupon"}
      </Button>
    </form>
  );
}
