"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const ROLES = ["ADMIN", "CUSTOMER"] as const;

type Props = {
  userId: string;
  role: "ADMIN" | "CUSTOMER";
};

export default function UserRoleForm({ userId, role }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(role);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSave() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ role: value }),
      });
      const json = (await res.json().catch(() => null)) as { message?: string } | null;
      if (!res.ok) {
        setError(json?.message || "Failed to update role");
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <select
        className="rounded-md border bg-background px-3 py-2 text-sm"
        value={value}
        onChange={(event) => setValue(event.target.value as "ADMIN" | "CUSTOMER")}
      >
        {ROLES.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <Button type="button" size="sm" onClick={onSave} disabled={loading}>
        {loading ? "Saving…" : "Update"}
      </Button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
