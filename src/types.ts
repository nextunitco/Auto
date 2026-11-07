export type VehicleCondition = 'Brand New' | 'Foreign Used' | 'Certified Pre-Owned' | 'Local Used';
export type VehicleTransmission = 'Automatic' | 'Manual';
export type VehicleFuelType = 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
export type VehicleStatus = 'Available' | 'Reserved' | 'Sold';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  samplePriceNotice?: string;
  isDemonstration: boolean;
  mileage: string;
  transmission: VehicleTransmission;
  fuelType: VehicleFuelType;
  condition: VehicleCondition;
  engineCapacity: string;
  exteriorColor: string;
  interiorColor: string;
  description: string;
  features: string[];
  images: string[];
  status: VehicleStatus;
  featured?: boolean;
  createdAt: string;
}

export type ProductCategory =
  | 'WD-40 Products'
  | 'Lubricants'
  | 'Cleaning Products'
  | 'Car Care'
  | 'Automotive Accessories'
  | 'Other Products';

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  sizeVariant: string;
  variants?: ProductVariant[];
  price: number;
  isDemonstrationPrice: boolean;
  description: string;
  specifications: string[];
  stock: number;
  isAvailable: boolean;
  images: string[];
  featured?: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  sizeVariant: string;
  image: string;
  category: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Payment Confirmed'
  | 'Processing'
  | 'Ready for Delivery'
  | 'Dispatched'
  | 'Completed'
  | 'Cancelled';

export type PaymentMethod = 'bank_transfer' | 'paystack' | 'flutterwave';
export type PaymentStatus = 'Pending' | 'Payment Confirmed' | 'Failed';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  sizeVariant?: string;
  image?: string;
  type: 'product' | 'vehicle';
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  notes?: string;
}

export interface Order {
  id: string; // e.g. NX-2026-1042
  type: 'product' | 'vehicle';
  items: OrderItem[];
  customer: CustomerInfo;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  orderStatus: OrderStatus;
  createdAt: string;
  commissionCalculated: boolean;
  commissionAmount: number;
  commissionRateApplied: string;
  netToBusiness: number;
  commissionPaid: boolean;
  commissionPaidAt?: string;
  commissionPaymentRef?: string;
  adminNotes?: string;
}

export type EnquiryType = 'vehicle' | 'product' | 'general';
export type EnquiryStatus = 'New' | 'Contacted' | 'In Progress' | 'Closed';

export interface Enquiry {
  id: string;
  type: EnquiryType;
  itemId?: string;
  itemTitle?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  message: string;
  status: EnquiryStatus;
  followUpNotes?: string;
  createdAt: string;
}

export interface CommissionSettlement {
  id: string;
  orderId: string;
  itemType: 'vehicle' | 'product';
  saleAmount: number;
  commissionAmount: number;
  commissionRate: string;
  netToBusiness: number;
  status: 'Outstanding' | 'Paid';
  settlementDate?: string;
  paymentReference?: string;
  notes?: string;
  createdAt: string;
}

export interface PlatformSettings {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  whatsappNumber: string;
  vehicleCommissionType: 'percentage' | 'fixed';
  vehicleCommissionValue: number; // e.g. 3 (%) or 500 ($)
  productCommissionType: 'percentage' | 'fixed';
  productCommissionValue: number; // e.g. 7 (%) or 5 ($)
  deliveryFee: number;
  freeDeliveryThreshold: number;
  vehicleDirectCheckoutEnabled: boolean;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankSortCodeOrSwift: string;
  paystackEnabled: boolean;
  paystackPublicKey: string;
  flutterwaveEnabled: boolean;
  flutterwavePublicKey: string;
  currencySymbol: string;
}

export interface AdminStats {
  totalVehicles: number;
  totalProducts: number;
  totalOrders: number;
  completedSales: number;
  pendingOrders: number;
  totalSalesRevenue: number;
  nexunitCommissionEarned: number;
  nexunitCommissionPaid: number;
  nexunitCommissionOutstanding: number;
  recentOrders: Order[];
  recentEnquiries: Enquiry[];
}
