"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InventoryForm from "@/components/admin/inventory/inventory-form";

export default function InventoryLookup() {
  const [productId, setProductId] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="productId">Product ID</Label>
        <Input
          id="productId"
          value={productId}
          onChange={(event) => setProductId(event.target.value)}
          placeholder="UUID"
        />
      </div>

      <Button type="button" onClick={() => setActiveId(productId)} disabled={!productId}>
        Load inventory
      </Button>

      {activeId ? <InventoryForm productId={activeId} /> : null}
    </div>
  );
}
