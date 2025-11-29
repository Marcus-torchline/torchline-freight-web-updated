export interface QuoteApproval {
  id: string;
  quoteId: string;
  status: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  version: number;
  priceCalculation: PriceCalculation;
  emailNotifications: EmailNotification[];
}

export interface PriceCalculation {
  basePrice: number;
  additionalFees: Fee[];
  discounts: Discount[];
  totalPrice: number;
  currency: string;
  calculatedAt: string;
}

export interface Fee {
  name: string;
  amount: number;
  type: string;
}

export interface Discount {
  name: string;
  amount: number;
  percentage?: number;
}

export interface EmailNotification {
  to: string;
  subject: string;
  body: string;
  sentAt: string;
  status: string;
}

export interface FileMetadata {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  category: string;
  uploadedBy: string;
  uploadedAt: string;
  expiresAt?: string;
  tags: string[];
  previewUrl?: string;
}

export interface AnalyticsData {
  conversionRate: number;
  totalQuotes: number;
  approvedQuotes: number;
  rejectedQuotes: number;
  pendingQuotes: number;
  averageQuoteValue: number;
  topServices: ServiceMetric[];
  customerMetrics: CustomerMetric[];
  revenueForecasting: RevenueForecast[];
}

export interface ServiceMetric {
  serviceName: string;
  quoteCount: number;
  approvalRate: number;
  averageValue: number;
}

export interface CustomerMetric {
  customerId: string;
  customerName: string;
  totalQuotes: number;
  approvedQuotes: number;
  totalRevenue: number;
  lastActivity: string;
}

export interface RevenueForecast {
  month: string;
  projected: number;
  actual: number;
  confidence: number;
}

export interface RealtimeUpdate {
  id: string;
  type: string;
  data: any;
  timestamp: string;
  userId: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: string[];
}

export interface ShipmentTracking {
  trackingNumber: string;
  status: string;
  currentLocation: string;
  estimatedDelivery: string;
  updates: TrackingUpdate[];
  realtime: boolean;
}

export interface TrackingUpdate {
  location: string;
  status: string;
  timestamp: string;
  description: string;
}

export interface Report {
  id: string;
  name: string;
  type: string;
  parameters: any;
  generatedAt: string;
  generatedBy: string;
  format: string;
  data: any;
  scheduled?: boolean;
  scheduleConfig?: ScheduleConfig;
}

export interface ScheduleConfig {
  frequency: string;
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  recipients: string[];
}