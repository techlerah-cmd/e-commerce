import { CartItem, getCart, getCartTotals } from "@/lib/cart";

export type ShippingInfo = {
  name: string;
  phone: string;
  address: string;
  pincode: string;
};

export type PaymentMethod = "upi" | "card" | "netbanking" | "cod";

export type CheckoutState = {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  couponCode?: string;
  discount?: number;
  total?: number;
  shippingInfo?: ShippingInfo;
  paymentMethod?: PaymentMethod;
};

const CHECKOUT_KEY = "lerah_checkout_state";

export function getCheckoutState(): CheckoutState {
  try {
    const raw = localStorage.getItem(CHECKOUT_KEY);
    return raw ? (JSON.parse(raw) as CheckoutState) : {} as CheckoutState;
  } catch {
    return {} as CheckoutState;
  }
}

export function setCheckoutState(patch: Partial<CheckoutState>) {
  const current = getCheckoutState();
  const next = { ...current, ...patch };
  localStorage.setItem(CHECKOUT_KEY, JSON.stringify(next));
  return next;
}

export function beginCheckoutFromCart(couponCode?: string, discount?: number) {
  const items = getCart();
  const { subtotal, shipping } = getCartTotals(items);
  const state: CheckoutState = {
    items,
    subtotal,
    shipping,
    couponCode,
    discount,
    total: Math.max(0, subtotal - (discount || 0)) + shipping,
  };
  localStorage.setItem(CHECKOUT_KEY, JSON.stringify(state));
  return state;
}

export function clearCheckout() {
  localStorage.removeItem(CHECKOUT_KEY);
}
