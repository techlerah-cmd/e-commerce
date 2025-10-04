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
  { to: "/admin/", label: "Dashboard", icon: LayoutGrid },
  { to: "/admin/products/", label: "Product", icon: PlusCircle },
  { to: "/admin/coupons/", label: "Coupons", icon: Tags },
  { to: "/admin/orders/", label: "Orders", icon: ListOrdered },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const {pathname} = useLocation()
  return (
    <div className="min-h-screen bg-secondary">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 border-r bg-white/80 backdrop-blur transition-transform duration-200 supports-[backdrop-filter]:bg-white/60",
            "md:translate-x-0 md:static md:block",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="p-6 flex items-center justify-between md:block">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Back to Store</span>
            </Link>
            <button className="md:hidden" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </button>
            <h1 className="mt-4 font-serif-elegant text-xl text-primary hidden md:block">
              Admin
            </h1>
          </div>
          <nav className="px-3">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                
                className={({ isActive }) =>
                  cn(
                    "mb-1 flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted/60",
                    to === pathname
                      ? "bg-muted/70 font-medium text-foreground"
                      : "text-muted-foreground"
                  )
                }
                onClick={() => setIsOpen(false)}
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex flex-col md:ml-0">
          {/* Top bar */}
          <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="flex h-14 items-center justify-between px-4">
              <div className="flex items-center gap-2">
                {/* Mobile menu button */}
                <button
                  className="md:hidden"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <Menu className="h-5 w-5" />
                </button>
                <Link
                  to="/"
                  className="font-serif-elegant text-lg text-primary md:hidden"
                >
                  Admin
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden sm:inline-flex"
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
