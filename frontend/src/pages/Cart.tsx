import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Trash2, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import {
  CartItem,
  clearCart,
  getCart,
  getCartTotals,
  removeFromCart,
} from "@/lib/cart";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { beginCheckoutFromCart, setCheckoutState } from "@/lib/checkout";
import { useAPICall } from "@/hooks/useApiCall";
import { API_ENDPOINT } from "@/config/backend";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { IAddress, ICart, ICouponCode } from "@/types/apiTypes";
import { Loading } from "@/components/ui/Loading";

const Cart = () => {
  const [coupon, setCoupon] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const { fetchType, fetching, isFetched, makeApiCall } = useAPICall();
  const { authToken , user } = useAuth();
  const [cart, setCart] = useState<ICart>({
    coupon: null,
    items: [],
    shipping: 0,
    subtotal: 0,
    total: 0,
    discount: 0,
  });
  useEffect(() => {
    if (user) fetchCart();
  }, []);
  const fetchCart = async () => {
    const response = await makeApiCall(
      "GET",
      API_ENDPOINT.GET_CART,
      {},
      "application/json",
      authToken,
      "getCart"
    );
    if (response.status === 200) {
      const subtotal = calculateSumOfItems(response.data.items);
      const discount = calculateCouponDiscount(subtotal, response.data.coupon);
      const shipping = 0
      setCart({
        ...response.data,
        items: [...response.data.items],
        shipping,
        subtotal,
        discount,
        total: Math.max(0, subtotal - discount) + shipping,
      });
    } else {
      toast.error("Error fetching cart");
    }
  };
  const calculateSumOfItems = (items) => {
    let sum = 0;
    for (let i = 0; i < items.length; i++) {
      sum += items[i].price;
    }
    return sum;
  };

  const calculateCouponDiscount = (subtotal, coupon: ICouponCode) => {
    if (!coupon) {
      return 0;
    }
    if (coupon.discount_type == "percent") {
      return (subtotal * coupon.discount_value) / 100;
    } else {
      return coupon.discount_value;
    }
  };

  const removeItem = async (id: string) => {
    const response = await makeApiCall(
      "DELETE",
      API_ENDPOINT.DELETE_CART_ITEM(id),
      {},
      "application/json",
      authToken,
      "removeFromCart"
    );

    if (response.status === 200) {
      toast.success("Item removed from cart");
      const updatedItems = cart.items.filter((i) => i.id != id);
      const subtotal = calculateSumOfItems(updatedItems);
      const discount = 0;
      const shipping = 0
      setCart({
        ...cart,
        items: updatedItems,
        shipping,
        subtotal,
        discount,
        total: Math.max(0, subtotal - discount) + shipping,
      });
    } else {
      toast.error("Failed to remove item");
    }
  };

  function formatPrice(value: number, currency: string = "INR") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  const applyCoupon = async (code: string) => {
    if (code.trim() === "") {
      toast.error("Please enter a valid coupon code");
      return;
    }
    const response = await makeApiCall(
      "POST",
      API_ENDPOINT.APPLY_COUPON,
      { code },
      "application/json",
      authToken,
      "applyCoupon"
    );
    if (response.status == 200 || response.status == 201) {
      const discount = calculateCouponDiscount(cart.subtotal, response.data);
      setCart({
        ...cart,
        coupon: response.data,
        discount,
        total: Math.max(0, cart.subtotal - discount) + cart.shipping,
      });
      toast.success(`Coupon ${response.data.code} applied`);
    } else {
      toast.error(response.error);
    }
  };
  const handleCheckout = async () => {
    try {
      const response = await makeApiCall(
        "GET",
        API_ENDPOINT.GET_ADDRESS,
        {},
        "application/json",
        authToken,
        "getAddress"
      );
      if (response.status === 200) {
        const address: IAddress = response.data;
        navigate("/checkout/", {
          state: {
            address,
            from_cart: true,
          },
        });
      } else {
        if (response.status != 500) {
          toast.error(response.error);
        } else {
          toast.error("Failed to proceed to checkout");
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <>
      <Header />
      <main className="min-h-screen bg-secondary">
        <section className="border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Cart</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </section>

        <section className="px-3 py-6 sm:px-6 lg:px-8">
          {(fetching && fetchType == "getCart") ? (
            <div className="py-4">
              <Loading />
            </div>
          ) : (
            <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <h1 className="font-serif-elegant text-3xl text-primary">
                    Your Cart
                    {fetching && fetchType == "removeFromCart" && (
                      <span className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></span>
                    )}
                  </h1>
                  {cart.items.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {cart.items.length} item
                      {cart.items.length !== 1 ? "s" : ""} •{" "}
                      {cart.items.reduce((total, item) => total + item.qty, 0)}{" "}
                      total quantity
                    </p>
                  )}
                </div>

                {cart.items.length === 0 ? (
                  <Card>
                    <CardContent className="py-16 text-center">
                      <ShoppingBag className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Your cart is empty
                      </p>
                      <Button
                        className="btn-luxury mt-6"
                        onClick={() => navigate("/collections")}
                      >
                        Explore Collections
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-purple-200">
                    <CardContent className="p-0 divide-y">
                      {cart.items.map((item) => (
                        <div
                          key={item.product_id}
                          className="flex items-start gap-4 p-4"
                        >
                          <img
                            src={item.image}
                            alt={item.product.title}
                            className="h-24 w-20 rounded-md object-cover ring-1 ring-purple-200 cursor-pointer hover:ring-2 hover:ring-purple-300 transition-all"
                            onClick={() =>
                              navigate(`/product/${item.product_id}`)
                            }
                          />
                          <div className="flex-1 space-y-2">
                            <div>
                              <h3
                                className="font-medium text-primary hover:text-accent cursor-pointer transition-colors"
                                onClick={() =>
                                  navigate(`/product/${item.product_id}`)
                                }
                              >
                                {item.product.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Unit Price: {formatPrice(item.product.price)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Quantity: {item.qty}
                              </p>
                            </div>

                            {/* Remove Item Button */}
                            <div className="flex items-center gap-3">
                              {item.product.stock < item.qty && (
                                <p className="text-sm font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-md inline-block mt-1">
                                  Out of Stock
                                </p>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => removeItem(item.id)}
                                disabled={fetching}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <div className="text-right space-y-1">
                            <div className="font-semibold text-accent text-lg">
                              {formatPrice(item.price)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Total Price
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
              <div>
                <div className="sticky top-12 ">
                  <Card className="border-purple-200">
                    <CardHeader>
                      <CardTitle className="font-serif-elegant text-xl text-primary">
                        Order Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Coupon */}
                      <div className="mb-4 space-y-2">
                        <label className="text-sm text-muted-foreground">
                          Coupon Code
                        </label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter code"
                            value={coupon}
                            onChange={(e) => setCoupon(e.target.value)}
                          />
                          <Button
                            variant="outline"
                            className="border-amber-300 text-amber-700 hover:bg-amber-50"
                            onClick={() => {
                              applyCoupon(coupon);
                            }}
                            loading={fetching && fetchType == "applyCoupon"}
                            disabled={
                              cart.items.length == 0 ||
                              !coupon ||
                              (fetching && fetchType == "applyCoupon")
                            }
                          >
                            Apply
                          </Button>
                        </div>
                        {appliedDiscount > 0 && (
                          <p className="text-xs text-green-600">
                            Applied {appliedCode} • You save{" "}
                            {formatPrice(appliedDiscount)}
                          </p>
                        )}
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Subtotal
                          </span>
                          <span className="font-medium">
                            {formatPrice(cart.subtotal)}
                          </span>
                        </div>
                        {cart.discount > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Discount
                            </span>
                            <span className="font-medium text-green-700">
                              - {formatPrice(cart.discount)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Shipping
                          </span>
                          <span className="font-medium">
                            {cart.shipping === 0
                              ? "Free"
                              : formatPrice(cart.shipping)}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-base font-semibold">
                          <span>Total</span>
                          <span className="text-accent">
                            {formatPrice(cart.total)}
                          </span>
                        </div>
                      </div>
                      <Button
                        className="mt-6 w-full bg-amber-500 text-white hover:bg-amber-600 transition shadow-sm hover:shadow"
                        disabled={
                          cart.items.length == 0 ||
                          (fetching && fetchType == "getAddress") ||
                          cart.items.find((i) => i.product.stock < i.qty) !=
                            null
                        }
                        onClick={handleCheckout}
                        loading={fetching && fetchType == "getAddress"}
                      >
                        Proceed to Checkout
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Cart;
