export default function AdminHomePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Manage catalog, orders, coupons, users, and payments from one place.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { href: "/admin/products", label: "Products" },
          { href: "/admin/categories", label: "Categories" },
          { href: "/admin/inventory", label: "Inventory" },
          { href: "/admin/orders", label: "Orders" },
          { href: "/admin/coupons", label: "Coupons" },
          { href: "/admin/cart", label: "Cart" },
          { href: "/admin/users", label: "Users" },
          { href: "/admin/payments", label: "Payments" },
          { href: "/admin/health", label: "Health" },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="rounded-lg border bg-card p-4 text-sm transition hover:bg-accent"
          >
            <div className="font-medium">{item.label}</div>
            <div className="mt-1 text-xs text-muted-foreground">Open {item.label}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
