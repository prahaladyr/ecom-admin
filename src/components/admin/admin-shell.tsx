"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LogoutButton from "@/app/admin/logout-button";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/warehouses", label: "Warehouses" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/cart", label: "Cart" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/health", label: "Health" },
];

function NavLinks({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className={cn("grid gap-1", className)}>
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "rounded-md px-3 py-2 text-sm transition-colors",
              active
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-accent/20">
      <header className="sticky top-0 z-10 border-b bg-background/80 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <SheetTrigger asChild>
                <Button type="button" variant="outline" size="sm" className="md:hidden">
                  Menu
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetHeader className="border-b">
                  <SheetTitle>Ecom Admin</SheetTitle>
                  <SheetDescription>Navigation</SheetDescription>
                </SheetHeader>
                <div className="p-3">
                  <NavLinks onNavigate={() => setMobileNavOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/admin" className="text-sm font-semibold">
              Ecom Admin
            </Link>
          </div>

          <LogoutButton />
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl">
        <aside className="hidden w-64 shrink-0 border-r bg-background/80 backdrop-blur md:block">
          <div className="p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Admin
            </div>
            <NavLinks className="mt-3" />
          </div>
        </aside>

        <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
