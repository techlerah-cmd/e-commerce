import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutProgress from "@/components/checkout/CheckoutProgress";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  getCheckoutState,
  setCheckoutState,
  type ShippingInfo,
} from "@/lib/checkout";
import { useNavigate } from "react-router-dom";

export default function CheckoutShipping() {
  const navigate = useNavigate();
  const state = getCheckoutState();
  const [form, setForm] = useState<ShippingInfo>({
    name: state.shippingInfo?.name || "",
    phone: state.shippingInfo?.phone || "",
    address: state.shippingInfo?.address || "",
    pincode: state.shippingInfo?.pincode || "",
  });

  useEffect(() => {
    // if (!state.items || state.items.length === 0) {
    //   navigate("/cart");
    // }
  }, []);

  const canContinue = form.name && form.phone && form.address && form.pincode;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-secondary">
        <section className="px-3 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-2xl space-y-6">
            <CheckoutProgress current="shipping" />

            <Card className="border-purple-200">
              <CardContent className="space-y-4 p-4 sm:p-6">
                <h1 className="font-serif-elegant text-2xl text-primary">
                  Shipping Information
                </h1>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Your Name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="focus-visible:ring-amber-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="+91"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="focus-visible:ring-amber-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="Street, City, State"
                      value={form.address}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                      className="focus-visible:ring-amber-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      placeholder="e.g., 400001"
                      value={form.pincode}
                      onChange={(e) =>
                        setForm({ ...form, pincode: e.target.value })
                      }
                      className="focus-visible:ring-amber-400"
                    />
                  </div>
                </div>

                <Button
                  className="mt-2 w-full bg-amber-500 text-white hover:bg-amber-600 transition shadow-sm hover:shadow"
                  disabled={!canContinue}
                  onClick={() => {
                    setCheckoutState({ shippingInfo: form });
                    navigate("/checkout/payment");
                  }}
                >
                  Proceed to Payment
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
