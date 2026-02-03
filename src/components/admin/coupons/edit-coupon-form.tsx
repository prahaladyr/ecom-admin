"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const COUPON_TYPES = ["PERCENT", "AMOUNT"] as const;

type Coupon = {
  id: string;
  code: string;
  type: "PERCENT" | "AMOUNT";
  value: number;
  isActive: boolean;
  maxRedemptions?: number | null;
  perUserLimit?: number | null;
  startsAt?: string | null;
  endsAt?: string | null;
};

export default function EditCouponForm({ coupon }: { coupon: Coupon }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    code: coupon.code,
    type: coupon.type,
    value: String(coupon.value),
    isActive: coupon.isActive,
    maxRedemptions: coupon.maxRedemptions != null ? String(coupon.maxRedemptions) : "",
    perUserLimit: coupon.perUserLimit != null ? String(coupon.perUserLimit) : "",
    startsAt: coupon.startsAt ? coupon.startsAt.slice(0, 16) : "",
    endsAt: coupon.endsAt ? coupon.endsAt.slice(0, 16) : "",
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
      const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => null)) as { message?: string } | null;
      if (!res.ok) {
        setError(json?.message || "Failed to update coupon");
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    if (!confirm("Delete this coupon?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/coupons/${coupon.id}`, { method: "DELETE" });
      if (!res.ok) {
        setError("Failed to delete coupon");
        return;
      }
      router.replace("/admin/coupons");
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
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              type: event.target.value as "PERCENT" | "AMOUNT",
            }))
          }
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

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : "Save changes"}
        </Button>
        <Button type="button" variant="outline" onClick={onDelete} disabled={loading}>
          Delete
        </Button>
      </div>
    </form>
  );
}
