/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  MapPin,
  Plus,
  Edit,
  ShoppingBag,
  CreditCard,
  Truck,
  Tag,
  Shield,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAPICall } from "@/hooks/useApiCall";
import { API_ENDPOINT } from "@/config/backend";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { ICart, IAddress } from "@/types/apiTypes";
import { Loading } from "@/components/ui/Loading";

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { fetchType, fetching, isFetched, makeApiCall } = useAPICall();
  const { authToken } = useAuth();
  const state: { address: any; from_cart: boolean } = useLocation().state;
  useEffect(() => {
    if (!state || !state.from_cart) {
      navigate("/cart");
    } else {
      setAddress(state.address);
    }
  }, []); // Added dependency array to run only once on mount
  const [cart, setCart] = useState<ICart>({
    coupon: null,
    items: [],
    shipping: 0,
    subtotal: 0,
    total: 0,
    discount: 0,
  });
  const [address, setAddress] = useState<IAddress | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [unexpectedError, setUnexpectedError] = useState<boolean>(false);
  const [addressForm, setAddressForm] = useState<IAddress>({
    full_name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    country: "India",
    postcode: "",
    landmark: "",
  });

  useEffect(() => {
    fetchCart();
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
      const shipping =
        response.data.items.length != 0 ? (subtotal > 2000 ? 0 : 200) : 0;
      setCart({
        ...response.data,
        shipping,
        subtotal,
        discount,
        total: Math.max(0, subtotal - discount) + shipping,
      });
    } else {
      toast.error("Error fetching cart");
    }
  };

  const calculateSumOfItems = (items: any[]) => {
    let sum = 0;
    for (let i = 0; i < items.length; i++) {
      sum += items[i].price;
    }
    return sum;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const calculateCouponDiscount = (subtotal: number, coupon: any) => {
    if (!coupon) {
      return 0;
    }
    if (coupon.discount_type == "percent") {
      return (subtotal * coupon.discount_value) / 100;
    } else {
      return coupon.discount_value;
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !addressForm.full_name ||
      !addressForm.phone ||
      !addressForm.street ||
      !addressForm.city ||
      !addressForm.state ||
      !addressForm.postcode
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const endpoint = address
      ? API_ENDPOINT.UPDATE_ADDRESS(address.id!)
      : API_ENDPOINT.ADD_ADDRESS;
    const method = address ? "PUT" : "POST";

    const response = await makeApiCall(
      method,
      endpoint,
      addressForm,
      "application/json",
      authToken,
      address ? "updateAddress" : "addAddress"
    );

    if (response.status === 200 || response.status === 201) {
      toast.success(
        address ? "Address updated successfully" : "Address added successfully"
      );
      console.log("response.data", response.data);
      setAddress(response.data);
      setIsAddressModalOpen(false);
    } else {
      toast.error("Failed to save address");
    }
  };

  const handleCheckout = async () => {
    if (!address) {
      toast.error("Please add a delivery address");
      return;
    }
    if (cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      // Create Razorpay order
      const orderResponse = await makeApiCall(
        "POST",
        API_ENDPOINT.CREATE_RAZORPAY_ORDER,
        {},
        "application/json",
        authToken,
        "createRazorpayOrder"
      );

      if (orderResponse.status !== 200 && orderResponse.status !== 201) {
        if (orderResponse.status != 500) {
          toast.error(orderResponse.error);
        } else {
          toast.error("Failed to create payment order");
        }
        return;
      }

      handleRazorpayScriptLoaded(orderResponse.data);
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to initiate payment");
    }
  };

  const handleRazorpayScriptLoaded = (transactionData: any) => {
    if (!transactionData) return;
    const options = {
      key: transactionData.key,
      amount: transactionData.amount * 100, // Razorpay works in paise
      currency: transactionData.currency,
      name: "Lorah Royal Elegance",
      description: "Order Payment",
      order_id: transactionData.razorpay_order_id, // from backend
      handler: function (response: any) {
        // Payment successful, redirect to verification page
        navigate("/checkout/payment-verification", {
          state: {
            transaction_id: transactionData.razorpay_order_id,
          },
        });
      },
      modal: {
        ondismiss: async function () {
          setUnexpectedError(true);
          const response = await makeApiCall(
            "DELETE",
            API_ENDPOINT.DELETE_ORDER(transactionData.order_id),
            {},
            "application/json",
            authToken,
            "deleteOrder"
          );
          toast.error("Payment Failed");
          navigate("/cart");
        },
      },
      theme: { color: "#9333ea" }, // Purple theme matching your site
    };
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };
  function formatPrice(value: number, currency: string = "INR") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
  const handleCreateOrEditAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await makeApiCall(
      "POST",
      API_ENDPOINT.ADD_ADDRESS,
      addressForm,
      "application/json",
      authToken,
      "createOrUpdateAddress"
    );
    if (response.status == 200 || response.status == 201) {
      setAddress(response.data);
      console.log("response.data", response.data);
      toast.success("Address saved successfully");
      setIsAddressModalOpen(false);
    } else {
      toast.error("Failed to save address");
    }
  };
  if (!isFetched) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-secondary">
          <div className="py-8">
            <Loading />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-secondary">
        {/* Breadcrumb */}
        <section className="border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/cart">Cart</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Checkout</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </section>

        {/* Main Content */}
        <section className="px-3 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6">
              <h1 className="font-serif-elegant text-3xl text-primary">
                Checkout
              </h1>
              <p className="text-muted-foreground mt-1">
                Review your order and complete your purchase
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left Column - Address & Items */}
              <div className="lg:col-span-2 space-y-6">
                {/* Delivery Address Section */}
                <Card className="border-purple-200">
                  <CardHeader>
                    <CardTitle className="font-serif-elegant text-xl text-primary flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Delivery Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {address ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <h3 className="font-medium text-primary">
                                {address.full_name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {address.street}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {address.city}, {address.state}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {address.country} - {address.postcode}
                              </p>
                              {address.landmark && (
                                <p className="text-sm text-muted-foreground">
                                  Landmark: {address.landmark}
                                </p>
                              )}
                              <p className="text-sm text-muted-foreground">
                                Phone: {address.phone}
                              </p>
                            </div>
                            <Dialog
                              open={isAddressModalOpen}
                              onOpenChange={setIsAddressModalOpen}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                                  onClick={() => {
                                    setAddressForm(address);
                                    setIsAddressModalOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Edit Address</DialogTitle>
                                </DialogHeader>
                                <form
                                  onSubmit={handleCreateOrEditAddress}
                                  className="space-y-4"
                                >
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="full_name">
                                        Full Name *
                                      </Label>
                                      <Input
                                        id="full_name"
                                        value={addressForm.full_name}
                                        onChange={(e) =>
                                          setAddressForm({
                                            ...addressForm,
                                            full_name: e.target.value,
                                          })
                                        }
                                        required
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="phone">Phone *</Label>
                                      <Input
                                        id="phone"
                                        value={addressForm.phone}
                                        onChange={(e) =>
                                          setAddressForm({
                                            ...addressForm,
                                            phone: e.target.value,
                                          })
                                        }
                                        required
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="street">
                                      Street Address *
                                    </Label>
                                    <Textarea
                                      id="street"
                                      value={addressForm.street}
                                      onChange={(e) =>
                                        setAddressForm({
                                          ...addressForm,
                                          street: e.target.value,
                                        })
                                      }
                                      required
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="city">City *</Label>
                                      <Input
                                        id="city"
                                        value={addressForm.city}
                                        onChange={(e) =>
                                          setAddressForm({
                                            ...addressForm,
                                            city: e.target.value,
                                          })
                                        }
                                        required
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="state">State *</Label>
                                      <Input
                                        id="state"
                                        value={addressForm.state}
                                        onChange={(e) =>
                                          setAddressForm({
                                            ...addressForm,
                                            state: e.target.value,
                                          })
                                        }
                                        required
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="country">Country *</Label>
                                      <Input
                                        id="country"
                                        value={addressForm.country}
                                        onChange={(e) =>
                                          setAddressForm({
                                            ...addressForm,
                                            country: e.target.value,
                                          })
                                        }
                                        required
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="postcode">
                                        Postcode *
                                      </Label>
                                      <Input
                                        id="postcode"
                                        value={addressForm.postcode}
                                        onChange={(e) =>
                                          setAddressForm({
                                            ...addressForm,
                                            postcode: e.target.value,
                                          })
                                        }
                                        required
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="landmark">Landmark</Label>
                                    <Input
                                      id="landmark"
                                      value={addressForm.landmark}
                                      onChange={(e) =>
                                        setAddressForm({
                                          ...addressForm,
                                          landmark: e.target.value,
                                        })
                                      }
                                      placeholder="Optional"
                                    />
                                  </div>
                                  <div className="flex gap-2 pt-4">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() =>
                                        setIsAddressModalOpen(false)
                                      }
                                      className="flex-1"
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      type="submit"
                                      className="flex-1 btn-luxury"
                                      disabled={fetching}
                                    >
                                      {fetching ? "Saving..." : "Save Address"}
                                    </Button>
                                  </div>
                                </form>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MapPin className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                        <p className="text-muted-foreground mb-4">
                          No delivery address found
                        </p>
                        <Dialog
                          open={isAddressModalOpen}
                          onOpenChange={setIsAddressModalOpen}
                        >
                          <DialogTrigger asChild>
                            <Button className="btn-luxury">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Address
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Add Delivery Address</DialogTitle>
                            </DialogHeader>
                            <form
                              onSubmit={handleAddressSubmit}
                              className="space-y-4"
                            >
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="full_name">Full Name *</Label>
                                  <Input
                                    id="full_name"
                                    value={addressForm.full_name}
                                    onChange={(e) =>
                                      setAddressForm({
                                        ...addressForm,
                                        full_name: e.target.value,
                                      })
                                    }
                                    required
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="phone">Phone *</Label>
                                  <Input
                                    id="phone"
                                    value={addressForm.phone}
                                    onChange={(e) =>
                                      setAddressForm({
                                        ...addressForm,
                                        phone: e.target.value,
                                      })
                                    }
                                    required
                                  />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="street">Street Address *</Label>
                                <Textarea
                                  id="street"
                                  value={addressForm.street}
                                  onChange={(e) =>
                                    setAddressForm({
                                      ...addressForm,
                                      street: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="city">City *</Label>
                                  <Input
                                    id="city"
                                    value={addressForm.city}
                                    onChange={(e) =>
                                      setAddressForm({
                                        ...addressForm,
                                        city: e.target.value,
                                      })
                                    }
                                    required
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="state">State *</Label>
                                  <Input
                                    id="state"
                                    value={addressForm.state}
                                    onChange={(e) =>
                                      setAddressForm({
                                        ...addressForm,
                                        state: e.target.value,
                                      })
                                    }
                                    required
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="country">Country *</Label>
                                  <Input
                                    id="country"
                                    value={addressForm.country}
                                    onChange={(e) =>
                                      setAddressForm({
                                        ...addressForm,
                                        country: e.target.value,
                                      })
                                    }
                                    required
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="postcode">Postcode *</Label>
                                  <Input
                                    id="postcode"
                                    value={addressForm.postcode}
                                    onChange={(e) =>
                                      setAddressForm({
                                        ...addressForm,
                                        postcode: e.target.value,
                                      })
                                    }
                                    required
                                  />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="landmark">Landmark</Label>
                                <Input
                                  id="landmark"
                                  value={addressForm.landmark}
                                  onChange={(e) =>
                                    setAddressForm({
                                      ...addressForm,
                                      landmark: e.target.value,
                                    })
                                  }
                                  placeholder="Optional"
                                />
                              </div>
                              <div className="flex gap-2 pt-4">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setIsAddressModalOpen(false)}
                                  className="flex-1"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="submit"
                                  className="flex-1 btn-luxury"
                                  disabled={fetching}
                                >
                                  {fetching ? "Adding..." : "Add Address"}
                                </Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card className="border-purple-200">
                  <CardHeader>
                    <CardTitle className="font-serif-elegant text-xl text-primary flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5" />
                      Order Items ({cart.items.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {cart.items.length === 0 ? (
                      <div className="p-8 text-center">
                        <ShoppingBag className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          Your cart is empty
                        </p>
                        <Button
                          className="btn-luxury mt-4"
                          onClick={() => navigate("/collections")}
                        >
                          Continue Shopping
                        </Button>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {cart.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 p-4"
                          >
                            <img
                              src={item.image}
                              alt={item.product.title}
                              className="h-16 w-14 rounded-md object-cover ring-1 ring-purple-200"
                            />
                            <div className="flex-1">
                              <h3 className="font-medium text-primary">
                                {item.product.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Quantity: {item.qty}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Unit Price: {formatPrice(item.product.price)}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-accent">
                                {formatPrice(item.price)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Total Price
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Order Summary */}
              <div>
                <Card className="border-purple-200 sticky top-6">
                  <CardHeader>
                    <CardTitle className="font-serif-elegant text-xl text-primary">
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Summary Details */}
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">
                          {formatPrice(cart.subtotal)}
                        </span>
                      </div>

                      {cart.discount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            Discount
                          </span>
                          <span className="font-medium text-green-700">
                            - {formatPrice(cart.discount)}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Truck className="h-3 w-3" />
                          Shipping
                        </span>
                        <span className="font-medium">
                          {cart.shipping === 0
                            ? "Free"
                            : formatPrice(cart.shipping)}
                        </span>
                      </div>

                      {cart.shipping === 0 && cart.subtotal > 0 && (
                        <p className="text-xs text-green-700">
                          🎉 Free shipping on orders above ₹2,000
                        </p>
                      )}
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-accent">
                        {formatPrice(cart.total)}
                      </span>
                    </div>

                    <Button
                      className="w-full btn-luxury flex items-center gap-2"
                      onClick={handleCheckout}
                      disabled={!address || cart.items.length === 0 || fetching}
                      loading={fetching || unexpectedError}
                    >
                      <CreditCard className="h-4 w-4" />
                      {fetching ? "Processing..." : "Proceed to Payment"}
                    </Button>

                    {!address && (
                      <p className="text-xs text-red-600 text-center">
                        Please add a delivery address to continue
                      </p>
                    )}

                    <div className="pt-4 space-y-3">
                      {/* Razorpay Secure Payment Badge */}
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-4 w-4 text-purple-600" />
                          <span className="text-xs font-semibold text-purple-900">
                            Secure Payment with Razorpay
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Your payment information is encrypted and secure. We
                          support UPI, Cards, Net Banking, and Wallets.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          SSL encrypted checkout
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Free returns within 7 days
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          24/7 customer support
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CheckoutPage;
