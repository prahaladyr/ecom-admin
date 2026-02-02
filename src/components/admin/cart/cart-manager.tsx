"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CartItem = {
  productId: string;
  quantity: number;
};

type Cart = {
  id: string;
  items: CartItem[];
};

export default function CartManager() {
  const [cartId, setCartId] = useState("");
  const [cart, setCart] = useState<Cart | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState({ productId: "", quantity: "1" });

  async function loadCart() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/cart", {
        headers: cartId ? { "x-cart-id": cartId } : undefined,
      });
      const json = (await res.json().catch(() => null)) as Cart | { message?: string } | null;
      if (!res.ok || !json || typeof (json as Cart).id !== "string") {
        setError((json as { message?: string })?.message || "Failed to load cart");
        return;
      }
      const headerId = res.headers.get("x-cart-id");
      if (headerId) setCartId(headerId);
      setCart(json as Cart);
    } finally {
      setLoading(false);
    }
  }

  async function addItem(event: React.FormEvent) {
    event.preventDefault();
    if (!newItem.productId) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/cart/items", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(cartId ? { "x-cart-id": cartId } : {}),
        },
        body: JSON.stringify({
          productId: newItem.productId,
          quantity: Number(newItem.quantity),
        }),
      });
      const json = (await res.json().catch(() => null)) as Cart | { message?: string } | null;
      if (!res.ok || !json || typeof (json as Cart).id !== "string") {
        setError((json as { message?: string })?.message || "Failed to add item");
        return;
      }
      const headerId = res.headers.get("x-cart-id");
      if (headerId) setCartId(headerId);
      setCart(json as Cart);
      setNewItem({ productId: "", quantity: "1" });
    } finally {
      setLoading(false);
    }
  }

  async function updateItem(productId: string, quantity: number) {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/cart/items/${productId}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          ...(cartId ? { "x-cart-id": cartId } : {}),
        },
        body: JSON.stringify({ quantity }),
      });
      const json = (await res.json().catch(() => null)) as Cart | { message?: string } | null;
      if (!res.ok || !json || typeof (json as Cart).id !== "string") {
        setError((json as { message?: string })?.message || "Failed to update item");
        return;
      }
      const headerId = res.headers.get("x-cart-id");
      if (headerId) setCartId(headerId);
      setCart(json as Cart);
    } finally {
      setLoading(false);
    }
  }

  async function removeItem(productId: string) {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/cart/items/${productId}`, {
        method: "DELETE",
        headers: cartId ? { "x-cart-id": cartId } : undefined,
      });
      const json = (await res.json().catch(() => null)) as Cart | { message?: string } | null;
      if (!res.ok || !json || typeof (json as Cart).id !== "string") {
        setError((json as { message?: string })?.message || "Failed to remove item");
        return;
      }
      const headerId = res.headers.get("x-cart-id");
      if (headerId) setCartId(headerId);
      setCart(json as Cart);
    } finally {
      setLoading(false);
    }
  }

  async function clearCart() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/cart/clear", {
        method: "POST",
        headers: cartId ? { "x-cart-id": cartId } : undefined,
      });
      const json = (await res.json().catch(() => null)) as Cart | { message?: string } | null;
      if (!res.ok || !json || typeof (json as Cart).id !== "string") {
        setError((json as { message?: string })?.message || "Failed to clear cart");
        return;
      }
      const headerId = res.headers.get("x-cart-id");
      if (headerId) setCartId(headerId);
      setCart(json as Cart);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-2">
          <Label htmlFor="cartId">Cart ID</Label>
          <Input
            id="cartId"
            value={cartId}
            onChange={(event) => setCartId(event.target.value)}
            placeholder="Leave blank to create a new cart"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={loadCart} disabled={loading}>
            {loading ? "Loading…" : "Load cart"}
          </Button>
          <Button type="button" variant="outline" onClick={clearCart} disabled={loading}>
            Clear cart
          </Button>
        </div>
      </div>

      <form onSubmit={addItem} className="grid gap-3 sm:grid-cols-[2fr_1fr_auto] sm:items-end">
        <div className="grid gap-2">
          <Label htmlFor="productId">Product ID</Label>
          <Input
            id="productId"
            value={newItem.productId}
            onChange={(event) => setNewItem((prev) => ({ ...prev, productId: event.target.value }))}
            placeholder="UUID"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min={1}
            value={newItem.quantity}
            onChange={(event) => setNewItem((prev) => ({ ...prev, quantity: event.target.value }))}
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          Add item
        </Button>
      </form>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="rounded-md border bg-muted/40 p-4 text-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-xs uppercase text-muted-foreground">Active cart</div>
            <div className="font-medium">{cart?.id || cartId || "Not loaded"}</div>
          </div>
          <div className="text-xs text-muted-foreground">Items: {cart?.items.length ?? 0}</div>
        </div>

        {cart && cart.items.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">Product ID</th>
                  <th className="py-2">Quantity</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item) => (
                  <tr key={item.productId} className="border-b">
                    <td className="py-2 break-all">{item.productId}</td>
                    <td className="py-2">
                      <Input
                        type="number"
                        min={0}
                        defaultValue={item.quantity}
                        onBlur={(event) =>
                          updateItem(item.productId, Number(event.target.value || item.quantity))
                        }
                      />
                    </td>
                    <td className="py-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(item.productId)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">Cart is empty.</p>
        )}
      </div>
    </div>
  );
}
