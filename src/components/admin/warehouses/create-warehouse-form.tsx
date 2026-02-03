"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateWarehouseForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    city: "",
    country: "",
    isDefault: false,
  });

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      name: form.name,
      city: form.city || undefined,
      country: form.country || undefined,
      isDefault: form.isDefault,
    };

    try {
      const res = await fetch("/api/admin/warehouses", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => null)) as { message?: string } | null;
      if (!res.ok) {
        setError(json?.message || "Failed to create warehouse");
        return;
      }
      setForm({ name: "", city: "", country: "", isDefault: false });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          value={form.city}
          onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          value={form.country}
          onChange={(event) => setForm((prev) => ({ ...prev, country: event.target.value }))}
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.isDefault}
          onChange={(event) => setForm((prev) => ({ ...prev, isDefault: event.target.checked }))}
        />
        Default warehouse
      </label>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button type="submit" disabled={loading}>
        {loading ? "Creating…" : "Create warehouse"}
      </Button>
    </form>
  );
}
