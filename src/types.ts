export type Currency = 'EUR';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  category: string;
  image: string;
  description: string;
  longDescription: string;
  features: string[];
  stock: number;
  colors?: string[];
  badge?: string;
  isPopular?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface CheckoutDetails {
  orderId?: string;
  trackingNumber?: string;
  orderDate?: string;
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  currency?: Currency;
  totalPaidFormatted?: string;
  bankRegion?: 'DE' | 'EUR';
  amazonProfileUrl?: string;
  paypalAccount?: string;
  paymentMethod?: string;
  paymentScreenshot?: string;
  items?: CartItem[];
}

export interface TrackingMilestone {
  day: number;
  date: string;
  time: string;
  title: string;
  location: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  carrier: string;
  stage: 'US_ORIGIN' | 'US_CUSTOMS' | 'AIR_TRANSIT' | 'GERMANY_CUSTOMS' | 'GERMANY_DOMESTIC' | 'OUT_FOR_DELIVERY';
}
