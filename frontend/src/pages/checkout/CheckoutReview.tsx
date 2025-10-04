import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutProgress from "@/components/checkout/CheckoutProgress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getOrders } from "@/lib/adminStore";

export default function CheckoutReview() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const orderId = params.get("orderId") || "";

  const order = useMemo(() => getOrders().find(o => o.id === orderId), [orderId]);

  useEffect(() => {
    if (!order) {
      // If no order found, go to cart
      navigate("/cart");
    }
  }, [order]);

  if (!order) return null;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-secondary">
        <section className="px-3 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-2xl space-y-6">
            <CheckoutProgress current="review" />

            <div className="flex flex-col items-center text-center">
              <div className="relative mb-3">
                <CheckCircle2 className="h-16 w-16 text-amber-500 animate-pulse" />
              </div>
              <h1 className="font-serif-elegant text-2xl text-primary">
                Thank you for choosing Lerah Saree. Your elegance is our pride.
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">Order ID: {order.id.slice(0,8).toUpperCase()}</p>
            </div>

            <Card className="border-purple-200">
              <CardContent className="space-y-4 p-4 sm:p-6">
                <h2 className="font-serif-elegant text-xl text-primary">Order Summary</h2>
                <div className="divide-y">
                  {order.items.map((i) => (
                    <div key={i.productId} className="flex items-center gap-3 py-3">
                      <img src={i.image} alt={i.name} className="h-16 w-12 rounded object-cover ring-1 ring-purple-200" />
                      <div className="flex-1 text-left">
                        <p className="font-medium text-primary">{i.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {i.quantity}</p>
                      </div>
                      <div className="text-sm font-semibold text-accent">₹{(i.price * i.quantity).toLocaleString("en-IN")}</div>
                    </div>
                  ))}
                </div>

                <div className="rounded-md bg-purple-50 p-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{order.subtotal.toLocaleString("en-IN")}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{order.shipping === 0 ? "Free" : `₹${order.shipping.toLocaleString("en-IN")}`}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span>₹{order.discount.toLocaleString("en-IN")}{order.couponCode ? ` (${order.couponCode})` : ''}</span></div>
                  <div className="mt-2 flex justify-between text-base font-semibold"><span>Total</span><span className="text-accent">₹{order.total.toLocaleString("en-IN")}</span></div>
                </div>

                <div className="text-sm">
                  <h3 className="mb-1 font-medium text-primary">Shipping to</h3>
                  <p className="text-muted-foreground">{order.customer?.name}</p>
                  <p className="text-muted-foreground">{order.customer?.phone}</p>
                  <p className="text-muted-foreground">{order.customer?.address}</p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button className="flex-1 bg-amber-500 text-white hover:bg-amber-600 transition shadow-sm hover:shadow" onClick={() => navigate(`/admin/orders`)}>
                    Track Order
                  </Button>
                  <Button variant="outline" className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50" onClick={() => navigate(`/collections`)}>
                    Continue Shopping
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
