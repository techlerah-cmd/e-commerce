/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IUser {
  id: string;
  email: string;
  full_name: string;
  is_admin: boolean;
  phone: string;
  user_id: string;
}

export interface ProductImage {
  id?: string;
  product_id?: string; // optional if not always returned
  path?: string;
  alt?: string;
  url?: string;
  isNew?: boolean; //only for product editing
  file?: File; //only for product editing
}

// Type for a single product
export interface IProduct {
  id?: string;
  title: string;
  code: string;
  description: string;
  active: boolean;
  price: number;
  category: string;
  actual_price: number;
  created_at?: string; // or Date if you parse it
  stock: number;
  product_metadata: { key: string; value: string }[]; // JSON object
  images: ProductImage[];
  total_sold?: number;
  featured: boolean;
  review_count?: number;
  avg_rating?: number;
  collection?: string;
  related_products?: IProductList[];
}

export interface IProductList {
  id?: string;
  title: string;
  image: string;
  price: number;
  actual_price: number;
  stock: number;
  featured: boolean;
  created_at: string;
}

export interface IPagination {
  page: number;
  size: number;
  has_next: boolean;
  has_prev: boolean;
  total: number;
}

export interface ICouponCode {
  id?: string;
  code: string;
  discount_type: "percent" | "flat";
  discount_value: number;
  min_order: number;
  max_uses: number;
  used_count?: string;
  expires_at: string;
}

export interface ICartItem {
  id: string;
  product_id: string;
  qty: number;
  price: number;
  image?: string;
  product: {
    title: string;
    price: number;
    stock: number;
  };
}

export interface ICart {
  items: ICartItem[];
  coupon: ICouponCode | null;
  subtotal: number;
  total: number;
  shipping: number;
  discount: number;
}

export interface IAddress {
  id?: string;
  full_name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  landmark?: string;
}
export interface ICustomerOrder {
  id: string;
  order_number: string;
  status: string;
  subtotal: number;
  tax: number;
  user?: IUser;
  discount: number;
  shipping_charge: number;
  delivery_partner: string;
  delivery_tracking_id: string;
  total: number;
  items: OrderItem[];
  shipping_address: ShippingAddress;
  transaction: OrderTransaction;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id?: string;
  sku?: string;
  name?: string;
  product_id?: string;
  qty?: number;
  unit_price?: number;
  total_price?: number;
}

export interface ShippingAddress {
  full_name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  landmark?: string;
}

export interface TransactionMetadata {
  amount: number;
  amount_due: number;
  amount_paid: number;
  attempts: number;
  created_at: number;
  currency: string;
  entity: string;
  id: string;
  notes: any[];
  offer_id?: string | null;
  receipt?: string | null;
  status: string;
}

export interface OrderTransaction {
  id: string;
  order_id: string;
  transaction_id: string;
  payment_method: string;
  amount: number;
  status: "created" | "paid" | "failed";
  transaction_metadata?: TransactionMetadata;
  created_at: string;
  updated_at: string;
}
