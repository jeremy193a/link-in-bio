// User types
export type UserPlan = 'free' | 'pro';

export interface User {
  id: string;
  clerkId: string;
  email: string;
  username: string;
  name: string | null;
  plan: UserPlan;
  customDomain: string | null;
  stripeCustomerId: string | null;
  createdAt: number;
  updatedAt: number;
}

// Product types
export type ContactMethod = 'zalo' | 'whatsapp' | 'phone';
export type ProductStatus = 'draft' | 'active';
export type Currency = 'VNĐ' | 'USD';

export interface Product {
  id: string;
  userId: string;
  slug: string;
  title: string;
  price: string;
  currency: Currency;
  description: string | null;
  contactMethod: ContactMethod;
  contactValue: string;
  videoUrl: string | null;
  status: ProductStatus;
  viewCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface ProductHighlight {
  id: string;
  productId: string;
  text: string;
  displayOrder: number;
}

export interface ProductImage {
  id: string;
  productId: string;
  r2Key: string;
  cdnUrl: string;
  displayOrder: number;
  createdAt: number;
}

// Full product with relations
export interface ProductWithDetails extends Product {
  highlights: ProductHighlight[];
  images: ProductImage[];
  user: Pick<User, 'username' | 'name'>;
}

// Form types
export interface ProductFormData {
  title: string;
  price: string;
  currency: Currency;
  description?: string;
  highlights: string[];
  contactMethod: ContactMethod;
  contactValue: string;
  videoUrl?: string;
  images: File[];
  status?: ProductStatus;
}

// API request/response types
export interface UploadedImage {
  r2Key: string;
  cdnUrl: string;
}

export interface CreateProductRequest {
  title: string;
  price: string;
  currency: Currency;
  description?: string;
  highlights: string[];
  contactMethod: ContactMethod;
  contactValue: string;
  videoUrl?: string;
  images: UploadedImage[];
  status?: ProductStatus;
}

export interface GenerateDescriptionRequest {
  title: string;
  price: string;
  currency: string;
  highlights: string[];
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}


// Analytics types
export type AnalyticsEventType = 'view' | 'click_contact';

export interface AnalyticsEvent {
  id: string;
  productId: string;
  eventType: AnalyticsEventType;
  userAgent: string | null;
  ipAddress: string | null;
  timestamp: number;
}

export interface ProductAnalytics {
  totalViews: number;
  totalClicks: number;
  clickThroughRate: number;
  viewsByDay: { date: string; count: number }[];
}
