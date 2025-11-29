declare namespace NodeJS {
  interface Timeout {
    [Symbol.toPrimitive](hint: 'number'): number;
    [Symbol.toPrimitive](hint: 'string'): string;
    [Symbol.toPrimitive](hint: 'default'): number;
  }
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

interface Window {
  gtag?: (...args: any[]) => void;
  dataLayer?: any[];
}

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer' | 'vendor' | 'operator';
  avatar?: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface FreightQuote {
  id: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  origin: Address;
  destination: Address;
  shipmentDetails: ShipmentDetails;
  pricing: QuotePricing;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'expired';
  validUntil: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface ShipmentDetails {
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  packageCount: number;
  description: string;
  value: number;
  hazardous: boolean;
  specialInstructions?: string;
}

interface QuotePricing {
  baseRate: number;
  fuelSurcharge: number;
  accessorialCharges: number;
  taxes: number;
  totalAmount: number;
  currency: string;
}

interface Shipment {
  id: string;
  shipmentNumber: string;
  quoteId?: string;
  customerId: string;
  vendorId?: string;
  origin: Address;
  destination: Address;
  details: ShipmentDetails;
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'delayed' | 'cancelled';
  trackingNumber: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: Address;
  billingAddress?: Address;
  paymentTerms: string;
  creditLimit: number;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: Address;
  services: string[];
  rating: number;
  status: 'active' | 'inactive' | 'suspended';
  certifications: string[];
  insuranceInfo: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
    coverage: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface Report {
  id: string;
  name: string;
  type: 'financial' | 'operational' | 'customer' | 'vendor' | 'custom';
  description: string;
  parameters: Record<string, any>;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    time: string;
    recipients: string[];
  };
  lastGenerated?: string;
  createdAt: string;
  createdBy: string;
}

interface Document {
  id: string;
  name: string;
  type: 'invoice' | 'bill_of_lading' | 'proof_of_delivery' | 'contract' | 'other';
  entityId: string;
  entityType: 'quote' | 'shipment' | 'customer' | 'vendor';
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  uploadedBy: string;
}

interface AnalyticsData {
  revenue: {
    total: number;
    monthly: number[];
    growth: number;
  };
  shipments: {
    total: number;
    completed: number;
    inTransit: number;
    delayed: number;
  };
  customers: {
    total: number;
    active: number;
    new: number;
  };
  performance: {
    onTimeDelivery: number;
    customerSatisfaction: number;
    averageTransitTime: number;
  };
}

export {
  User,
  AuthContextType,
  NotificationContextType,
  Notification,
  FreightQuote,
  Address,
  ShipmentDetails,
  QuotePricing,
  Shipment,
  Customer,
  Vendor,
  Report,
  Document,
  AnalyticsData,
  ApiResponse,
  PaginatedResponse,
  DeepPartial,
  Optional,
  RequiredFields
};