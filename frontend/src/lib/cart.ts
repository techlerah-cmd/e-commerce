import { Product, formatPrice } from "@/data/products";

export type CartItem = {
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

const CART_KEY = "lerah_cart_items";

export function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(product, quantity = 1) {
  const items = getCart();
  const idx = items.findIndex((i) => i.productId === product.id);
  if (idx >= 0) {
    items[idx].quantity += quantity;
  } else {
    items.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    });
  }
  saveCart(items);
}


export function removeFromCart(productId: number) {
  const items = getCart().filter((i) => i.productId !== productId);
  saveCart(items);
}

export function clearCart() {
  saveCart([]);
}

export function getCartTotals(items?: CartItem[]) {
  const list = items ?? getCart();
  const subtotal = list.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal > 2000 || subtotal === 0 ? 0 : 199;
  const total = subtotal + shipping;
  return { subtotal, shipping, total, formatPrice };
}
