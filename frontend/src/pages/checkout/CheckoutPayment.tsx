import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutProgress from "@/components/checkout/CheckoutProgress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Lock, CreditCard, Landmark, Smartphone, HandCoins } from "lucide-react";
import { getCheckoutState, setCheckoutState, type PaymentMethod, clearCheckout } from "@/lib/checkout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "@/lib/adminStore";
import { clearCart } from "@/lib/cart";

export default function CheckoutPayment() {
  const navigate = useNavigate();
  const state = getCheckoutState();
  const [method, setMethod] = useState<PaymentMethod>(state.paymentMethod || "upi");

  useEffect(() => {
    if (!state.items || state.items.length === 0 || !state.shippingInfo) {
      navigate("/checkout/shipping");
    }
  }, []);

  const onPayNow = () => {
    const subtotal = state.subtotal || 0;
    const shipping = state.shipping || 0;
    const discount = state.discount || 0;
    const total = Math.max(0, subtotal - discount) + shipping;
    const order = createOrder({
      items: (state.items || []).map(i => ({ productId: i.productId, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
      subtotal,
      shipping,
      discount,
      total,
      couponCode: state.couponCode,
      customer: state.shippingInfo ? {
        name: state.shippingInfo.name,
        phone: state.shippingInfo.phone,
        address: `${state.shippingInfo.address}, ${state.shippingInfo.pincode}`,
      } : {},
    });
    // clear cart and checkout state
    clearCart();
    clearCheckout();
    navigate(`/checkout/review?orderId=${order.id}`);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-secondary">
        <section className="px-3 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-2xl space-y-6">
            <CheckoutProgress current="payment" />

            <Card className="border-purple-200">
              <CardContent className="space-y-4 p-4 sm:p-6">
                <h1 className="font-serif-elegant text-2xl text-primary">Payment</h1>

                <RadioGroup value={method} onValueChange={(v) => setMethod(v as PaymentMethod)} className="grid grid-cols-1 gap-3">
                  <label className="flex items-center gap-3 rounded-lg border border-purple-200 bg-white p-3">
                    <RadioGroupItem value="upi" id="upi" />
                    <Smartphone className="h-4 w-4 text-amber-600" />
                    <span className="text-sm">UPI</span>
                  </label>
                  <label className="flex items-center gap-3 rounded-lg border border-purple-200 bg-white p-3">
                    <RadioGroupItem value="card" id="card" />
                    <CreditCard className="h-4 w-4 text-amber-600" />
                    <span className="text-sm">Card</span>
                  </label>
                  <label className="flex items-center gap-3 rounded-lg border border-purple-200 bg-white p-3">
                    <RadioGroupItem value="netbanking" id="netbanking" />
                    <Landmark className="h-4 w-4 text-amber-600" />
                    <span className="text-sm">Netbanking</span>
                  </label>
                  <label className="flex items-center gap-3 rounded-lg border border-purple-200 bg-white p-3">
                    <RadioGroupItem value="cod" id="cod" />
                    <HandCoins className="h-4 w-4 text-amber-600" />
                    <span className="text-sm">Cash on Delivery</span>
                  </label>
                </RadioGroup>

                <div className="flex items-center gap-2 rounded-md bg-purple-50 p-3 text-xs text-purple-700">
                  <Lock className="h-4 w-4 text-amber-600" />
                  <span>100% secure payment. Your data is encrypted and protected.</span>
                </div>

                <div className="space-y-2">
                  <Button
                    className="w-full bg-amber-500 text-white hover:bg-amber-600 transition shadow-sm hover:shadow"
                    onClick={() => {
                      setCheckoutState({ paymentMethod: method });
                      onPayNow();
                    }}
                  >
                    Pay Now
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
                    onClick={() => navigate("/checkout/shipping")}
                  >
                    Back to Shipping
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
