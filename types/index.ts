// Database Types

export type UserRole = 'customer' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type ProductType = 'physical' | 'digital';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  type: ProductType;
  category_id: string | null;
  sku: string | null;
  stock_quantity: number;
  is_active: boolean;
  is_featured: boolean;
  digital_file_url: string | null;
  created_at: string;
  updated_at: string;
  category?: Category;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  sku: string | null;
  price: number | null;
  stock_quantity: number;
  attributes: Record<string, string>;
  is_active: boolean;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  position: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';

export type PaymentMethod = 'stripe' | 'paypal' | 'cod'; // cod = cash on delivery

export interface Order {
  id: string;
  user_id: string | null;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  shipping_address_id: string | null;
  billing_address_id: string | null;
  stripe_payment_intent_id: string | null;
  paypal_order_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  shipping_address?: Address;
  billing_address?: Address;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_name: string;
  variant_name: string | null;
  created_at: string;
  product?: Product;
}

export interface Address {
  id: string;
  user_id: string | null;
  full_name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string | null;
  postal_code: string;
  country: string;
  phone: string | null;
  is_default: boolean;
  created_at: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string | null;
  price: number;
  estimated_days_min: number;
  estimated_days_max: number;
  is_active: boolean;
  created_at: string;
}

export interface DigitalDownload {
  id: string;
  order_item_id: string;
  download_token: string;
  download_count: number;
  max_downloads: number;
  expires_at: string;
  created_at: string;
}

// Cart Types (Client-side)

export interface CartItem {
  id: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

// Checkout Types

export interface CheckoutFormData {
  email: string;
  shippingAddress: AddressFormData;
  billingAddress?: AddressFormData;
  sameAsShipping: boolean;
  shippingMethodId: string;
  paymentMethod: PaymentMethod;
}

export interface AddressFormData {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
}

// API Response Types

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Store Settings

export interface StoreSettings {
  name: string;
  currency: string;
  currencySymbol: string;
  taxRate: number;
  freeShippingThreshold: number | null;
}

// Filter Types

export interface ProductFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  sortBy?: 'name' | 'price_asc' | 'price_desc' | 'newest';
}
