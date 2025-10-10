import { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Tags,
  ListOrdered,
  PlusCircle,
  LayoutGrid,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutGrid },
  { to: "/admin/products/", label: "Product", icon: PlusCircle },
  { to: "/admin/coupons/", label: "Coupons", icon: Tags },
  { to: "/admin/orders/", label: "Orders", icon: ListOrdered },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[260px_1fr]">
        {/* Sidebar (mobile slide-over + desktop static) */}
        {/* backdrop for mobile when menu open */}
        <div
          aria-hidden={!isOpen}
          className={cn(
            "fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden",
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          )}
          onClick={() => setIsOpen(false)}
        />

        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200",
            "md:translate-x-0 md:static md:block",
            isOpen ? "translate-x-0" : "-translate-x-full",
            "bg-[hsl(var(--sidebar-background))]/95 text-[hsl(var(--sidebar-foreground))] border-r border-[hsl(var(--sidebar-border))] shadow-luxury backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--sidebar-background))]/80"
          )}
        >
          <div className="p-6 flex items-center justify-between md:block">
            {/* <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
            >
              <ShoppingBag className="h-4 w-4 text-[hsl(var(--accent))]" />
              <span className="font-sans-clean">Back to Store</span>
            </Link> */}

            {/* close on mobile */}
            <button
              className="md:hidden p-1 rounded hover:bg-[hsl(var(--input))]/30 transition"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
            </button>

            <h1 className="mt-4 font-serif-elegant text-xl text-[hsl(var(--secondary))] hidden md:block">
              Admin
            </h1>
          </div>

          <nav className="px-3 mt-3">
            {navItems.map(({ to, label, icon: Icon }) => {
              const active = pathname === to;
              return (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "mb-1 flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    "hover:bg-[hsl(var(--muted))]/30 hover:text-[hsl(var(--foreground))]",
                    active
                      ? "bg-[hsl(var(--muted))]/50 font-medium text-[hsl(var(--secondary))] border-l-4 border-[hsl(var(--accent))] pl-[calc(0.75rem-4px)]"
                      : "text-[hsl(var(--muted-foreground))]"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <span
                    className={cn(
                      "inline-flex items-center justify-center h-8 w-8 rounded-md flex-shrink-0",
                      active
                        ? "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]"
                        : "bg-transparent text-[hsl(var(--muted-foreground))]"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>

                  <span className="truncate">{label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-auto p-6 hidden md:block">
            <div className="text-xs text-[hsl(var(--muted-foreground))]">
              <div className="mb-2">Logged in as</div>
              <div className="font-medium text-[hsl(var(--foreground))]">
                Admin
              </div>
            </div>
            <div className="mt-4">
              <Link to="/" aria-label="Go to storefront">
                <Button
                  variant="outline"
                  size="sm"
                  className="btn-outline-luxury w-full"
                >
                  View Store
                </Button>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex flex-col md:ml-0 min-h-screen">
          {/* Top bar */}
          <header className="sticky top-0 z-40 border-b border-[hsl(var(--sidebar-border))] bg-[hsl(var(--card))]/60 backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--card))]/60">
            <div className="flex h-14 items-center justify-between px-4 md:px-6">
              <div className="flex items-center gap-3">
                {/* Mobile menu button */}
                <button
                  className="md:hidden p-2 rounded hover:bg-[hsl(var(--input))]/30 transition"
                  onClick={() => setIsOpen((s) => !s)}
                  aria-expanded={isOpen}
                  aria-label="Toggle menu"
                >
                  <Menu className="h-5 w-5 text-[hsl(var(--secondary))]" />
                </button>

                <Link
                  to="/"
                  className="font-serif-elegant text-lg text-[hsl(var(--secondary))] md:hidden"
                >
                  Admin
                </Link>

                <div className="hidden md:flex items-center gap-4">
                  {/* optional quick links */}
                  <Link
                    to="/admin/"
                    className="text-sm text-[hsl(var(--primary-foreground))] hover:text-[hsl(var(--secondary))]"
                  >
                    Overview
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link to="/" className="sm:inline-flex">
                  <Button
                    variant="outlineSecondary"
                    size="sm"
                    className="btn-outline-luxury"
                  >
                    Go to Store
                  </Button>
                </Link>
              </div>
            </div>
          </header>

          <main className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
