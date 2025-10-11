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
import { Menu, ShoppingBag, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/collections", label: "Collections" },
    { to: "/contact", label: "Contact" },
    { to: "/policy", label: "Policies" },
    ...(user?.is_admin ? [{ to: "/admin", label: "Dashboard" }] : []),
  ];

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ backgroundColor: "hsl(var(--secondary))" }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section: Mobile Menu + Logo */}
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5 text-[hsl(var(--primary))]" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <div className="px-6 py-4">
                <Link to="/" className="flex items-center">
                  <img
                    src="/logo.png"
                    alt="Lerah Royal Elegance"
                    className="h-10 w-auto sm:h-12"
                  />
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
                          "rounded-md px-4 py-2 text-sm transition-colors ",
                          isActive && "bg-muted/70 font-medium"
                        )
                      }
                      style={({ isActive }) => ({
                        color: isActive
                          ? "hsl(var(--primary))"
                          : "hsl(var(--primary))",
                      })}
                    >
                      {item.label}
                    </NavLink>
                  </SheetClose>
                ))}
                {isAuthenticated ? (
                  <SheetClose asChild key={"/my-orders"}>
                    <NavLink
                      to={"/my-orders"}
                      className={({ isActive }) =>
                        cn(
                          "rounded-md px-4 py-2 text-sm transition-colors ",
                          isActive && "bg-muted/70 font-medium"
                        )
                      }
                      style={({ isActive }) => ({
                        color: isActive
                          ? "hsl(var(--primary))"
                          : "hsl(var(--primary))",
                      })}
                    >
                      My Orders
                    </NavLink>
                  </SheetClose>
                ) : (
                  <Link to="/login">
                    <Button
                      variant="outlineSecondary"
                      className=" sm:hidden mt-2"
                    >
                      Login
                    </Button>
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="Lerah Royal Elegance"
              className="h-10 w-auto sm:h-12"
            />
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-2 text-sm transition-colors ",
                  isActive && "font-medium"
                )
              }
              style={({ isActive }) => ({
                color: "hsl(var(--primary))",
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Section: Auth + Cart */}
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
            <Button
              variant="ghost"
              className="hover:bg-transparent"
              size="icon"
            >
              <ShoppingBag className="h-5 w-5  text-[hsl(var(--primary))]" />
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
