import { Product, allProducts as seedProducts } from "@/data/products";

export type AdminProductInput = Omit<Product, "id"> & {
  id?: number;
  active?: boolean;
  featured?: boolean;
  deletedImages?: string[];
};
export type ProductWithStock = Product & {
  stock: number;
  totalSold: number;
  active?: boolean;
  featured?: boolean;
  metadata?: { key: string; value: string }[];
  code?: string;
};
export type Coupon = {
  code: string;
  discountType: "percent" | "flat";
  discountValue: number; // percent 0-100 or flat in INR
  minOrder: number;
  maxUses?: number;
  usedCount: number;
  expiresAt?: string; // ISO date string
  active: boolean;
};
export type OrderStatus =
  | "payment_pending"
  | "payment_paid"
  | "payment_failed"
  | "shipped";

export type Order = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: Array<{
    productId: number;
    code: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  tax: number;
  createdAt: string;
  couponCode?: string;
  deliveryPartner?: string;
  deliveryTrackingId?: string;
  customer?: {
    name?: string;
    phone?: string;
    email?: string;
    address?: {
      fullName: string;
      phone: string;
      street: string;
      city: string;
      state: string;
      country: string;
      postcode: string;
      landmark?: string;
    };
  };
  transaction?: {
    transactionId: string;
    paymentMethod: string;
    amount: number;
    status: string;
    metadata?: any;
  };
};

const ADMIN_PRODUCTS_KEY = "admin_products";
const ADMIN_COUPONS_KEY = "admin_coupons";
const ADMIN_ORDERS_KEY = "admin_orders";
const ADMIN_PRODUCT_STOCK_KEY = "admin_product_stock";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Products
export function getAdminProducts(): Product[] {
  return read<Product[]>(ADMIN_PRODUCTS_KEY, []);
}
export function saveAdminProducts(list: Product[]) {
  write(ADMIN_PRODUCTS_KEY, list);
}
export function addAdminProduct(input: AdminProductInput): Product {
  const list = getAdminProducts();
  const nextId =
    Math.max(0, ...seedProducts.map((p) => p.id), ...list.map((p) => p.id)) + 1;
  const product: Product = { ...input, id: input.id ?? nextId } as Product;
  list.push(product);
  saveAdminProducts(list);
  return product;
}
export function getAllProductsCombined(): Product[] {
  return [...seedProducts, ...getAdminProducts()];
}

// Product Stock Management
export function getProductStock(): Record<
  number,
  { stock: number; totalSold: number }
> {
  return read<Record<number, { stock: number; totalSold: number }>>(
    ADMIN_PRODUCT_STOCK_KEY,
    {}
  );
}

export function saveProductStock(
  stock: Record<number, { stock: number; totalSold: number }>
) {
  write(ADMIN_PRODUCT_STOCK_KEY, stock);
}

export function getProductsWithStock(): ProductWithStock[] {
  const products = getAllProductsCombined();
  const stockData = getProductStock();

  return products.map((product) => {
    const stockInfo = stockData[product.id] || { stock: 0, totalSold: 0 };
    return {
      ...product,
      stock: stockInfo.stock,
      totalSold: stockInfo.totalSold,
      metadata: product.metadata || [
        { key: "fabric", value: (product as any).fabric || "" },
        { key: "work", value: product.work || "" },
        { key: "occasion", value: product.occasion || "" },
        { key: "careInstructions", value: product.careInstructions || "" },
        { key: "isNew", value: (product.isNew || false).toString() },
      ],
    };
  });
}

// Search products function - placeholder for backend integration
export async function searchProductsWithStock(
  query: string
): Promise<ProductWithStock[]> {
  // TODO: Replace with actual backend API call
  // const response = await fetch(`/api/admin/products/search?q=${encodeURIComponent(query)}`);
  // if (!response.ok) throw new Error('Search failed');
  // return await response.json();

  // For now, using local filtering as placeholder
  if (query.trim() === "") {
    return getProductsWithStock();
  }

  const allProducts = getProductsWithStock();
  return allProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description?.toLowerCase().includes(query.toLowerCase()) ||
      product.code?.toLowerCase().includes(query.toLowerCase()) ||
      product.work?.toLowerCase().includes(query.toLowerCase()) ||
      product.occasion?.toLowerCase().includes(query.toLowerCase()) ||
      product.metadata?.some(
        (meta) =>
          meta.key.toLowerCase().includes(query.toLowerCase()) ||
          meta.value.toLowerCase().includes(query.toLowerCase())
      )
  );
}

export function updateProductStock(productId: number, stock: number) {
  const stockData = getProductStock();
  stockData[productId] = { ...stockData[productId], stock };
  saveProductStock(stockData);
}

export function updateProductSales(productId: number, quantity: number) {
  const stockData = getProductStock();
  const current = stockData[productId] || { stock: 0, totalSold: 0 };
  stockData[productId] = {
    stock: Math.max(0, current.stock - quantity),
    totalSold: current.totalSold + quantity,
  };
  saveProductStock(stockData);
}

export function updateAdminProduct(
  productId: number,
  updates: Partial<AdminProductInput>
) {
  const products = getAdminProducts();
  const index = products.findIndex((p) => p.id === productId);
  if (index !== -1) {
    products[index] = { ...products[index], ...updates } as Product;
    saveAdminProducts(products);
    return products[index];
  }
  return null;
}

// Coupons
export function getCoupons(): Coupon[] {
  const stored = read<Coupon[]>(ADMIN_COUPONS_KEY, []);
  // Add some dummy data if no coupons exist
  if (stored.length === 0) {
    const dummyCoupons: Coupon[] = [
      {
        code: "WELCOME10",
        discountType: "percent",
        discountValue: 10,
        minOrder: 1000,
        maxUses: 100,
        usedCount: 23,
        expiresAt: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(), // 30 days from now
        active: true,
      },
      {
        code: "SAVE50",
        discountType: "flat",
        discountValue: 50,
        minOrder: 500,
        maxUses: 50,
        usedCount: 12,
        expiresAt: new Date(
          Date.now() + 15 * 24 * 60 * 60 * 1000
        ).toISOString(), // 15 days from now
        active: true,
      },
      {
        code: "FESTIVAL20",
        discountType: "percent",
        discountValue: 20,
        minOrder: 2000,
        maxUses: 200,
        usedCount: 45,
        expiresAt: new Date(
          Date.now() + 60 * 24 * 60 * 60 * 1000
        ).toISOString(), // 60 days from now
        active: true,
      },
      {
        code: "NEWUSER",
        discountType: "flat",
        discountValue: 100,
        minOrder: 1500,
        maxUses: 25,
        usedCount: 25,
        expiresAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // Expired 5 days ago
        active: false,
      },
      {
        code: "BULK15",
        discountType: "percent",
        discountValue: 15,
        minOrder: 5000,
        maxUses: 10,
        usedCount: 3,
        expiresAt: new Date(
          Date.now() + 45 * 24 * 60 * 60 * 1000
        ).toISOString(), // 45 days from now
        active: true,
      },
    ];
    saveCoupons(dummyCoupons);
    return dummyCoupons;
  }
  return stored;
}
export function saveCoupons(list: Coupon[]) {
  write(ADMIN_COUPONS_KEY, list);
}
export function addCoupon(coupon: Coupon) {
  const list = getCoupons();
  const existing = list.find(
    (c) => c.code.toLowerCase() === coupon.code.toLowerCase()
  );
  if (existing) {
    Object.assign(existing, coupon);
  } else {
    list.push(coupon);
  }
  saveCoupons(list);
}

export function updateCoupon(code: string, updates: Partial<Coupon>) {
  const list = getCoupons();
  const index = list.findIndex((c) => c.code === code);
  if (index !== -1) {
    list[index] = { ...list[index], ...updates };
    saveCoupons(list);
    return list[index];
  }
  return null;
}

export function deleteCoupon(code: string) {
  const list = getCoupons();
  const filtered = list.filter((c) => c.code !== code);
  saveCoupons(filtered);
}

// Search coupons function - placeholder for backend integration
export async function searchCoupons(query: string): Promise<Coupon[]> {
  // TODO: Replace with actual backend API call
  // const response = await fetch(`/api/admin/coupons/search?q=${encodeURIComponent(query)}`);
  // if (!response.ok) throw new Error('Search failed');
  // return await response.json();

  // For now, using local filtering as placeholder
  if (query.trim() === "") {
    return getCoupons();
  }

  const allCoupons = getCoupons();
  return allCoupons.filter(
    (coupon) =>
      coupon.code.toLowerCase().includes(query.toLowerCase()) ||
      coupon.discountType.toLowerCase().includes(query.toLowerCase())
  );
}

// Orders
export function getOrders(): Order[] {
  return read<Order[]>(ADMIN_ORDERS_KEY, []);
}
export function saveOrders(list: Order[]) {
  write(ADMIN_ORDERS_KEY, list);
}
export function createOrder(
  order: Omit<Order, "id" | "createdAt" | "orderNumber">
): Order {
  const list = getOrders();
  const orderNumber = `ORD${Date.now()}${Math.random()
    .toString(36)
    .substr(2, 4)
    .toUpperCase()}`;
  const full: Order = {
    ...order,
    id: crypto.randomUUID(),
    orderNumber,
    createdAt: new Date().toISOString(),
  } as Order;
  list.unshift(full);
  saveOrders(list);
  return full;
}

export function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  deliveryPartner?: string,
  deliveryTrackingId?: string
): boolean {
  const list = getOrders();
  const index = list.findIndex((o) => o.id === orderId);
  if (index === -1) return false;

  list[index] = {
    ...list[index],
    status,
    ...(deliveryPartner && { deliveryPartner }),
    ...(deliveryTrackingId && { deliveryTrackingId }),
  };

  saveOrders(list);
  return true;
}
