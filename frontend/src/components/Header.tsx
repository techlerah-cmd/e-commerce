import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Menu, ShoppingBag } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  console.log(isAuthenticated, user);
  const navItems = [
    { to: "/", label: "Home" },
    { to: "/collections", label: "Collections" },
    // { to: "#new", label: "New Arrivals" },
    // { to: "#story", label: "Our Story" },
    { to: "/contact", label: "Contact" },
    { to: "/policy", label: "Policies" },
    ...(user?.is_admin ? [{ to: "/admin", label: "Dashboard" }] : []),
  ];
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <div className="px-6 py-4">
                <Link to="/" className="font-serif text-xl tracking-wide">
                  Lerah Royal Elegance
                </Link>
              </div>
              <Separator />
              <nav className="flex flex-col gap-1 p-2">
                {navItems.map((item) => (
                  <SheetClose asChild key={item.to}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          "rounded-md px-4 py-2 text-sm transition-colors hover:bg-muted/60",
                          isActive && "bg-muted/70 font-medium"
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  </SheetClose>
                ))}
                <SheetClose asChild key={"'/my-orders"}>
                  <NavLink
                    to={"/my-orders"}
                    className={({ isActive }) =>
                      cn(
                        "rounded-md px-4 py-2 text-sm transition-colors hover:bg-muted/60",
                        isActive && "bg-muted/70 font-medium"
                      )
                    }
                  >
                    My Orders
                  </NavLink>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>

          <Link to="/" className="font-serif text-lg sm:text-xl tracking-wide">
            Lerah Royal Elegance
          </Link>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground",
                  isActive && "text-foreground"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <Link to="/login">
              <Button variant="outline" className="hidden sm:inline-flex">
                Login
              </Button>
            </Link>
          ) : (
            <Link to="/my-orders">
              <Button variant="outline" className="hidden sm:inline-flex">
                My Orders
              </Button>
            </Link>
          )}
          <Link to="/cart" aria-label="Cart">
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </Link>
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Logout"
              onClick={logout}
              className="hover:bg-transparent text-red-500 hover:bg-red-500"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
