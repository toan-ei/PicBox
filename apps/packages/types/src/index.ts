// ===== User & Auth =====
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "admin" | "ops" | "shipper" | "driver" | "sender" | "receiver";

export type UserStatus = "active" | "inactive" | "suspended" | "pending";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

// ===== Order =====
export interface Order {
  id: string;
  trackingCode: string;
  senderId: string;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  weight: number;
  dimensions?: string;
  note?: string;
  codAmount: number;
  shippingFee: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "picked_up"
  | "in_transit"
  | "at_hub"
  | "sorting"
  | "out_for_delivery"
  | "delivered"
  | "failed"
  | "returned"
  | "cancelled";

// ===== Hub & Branch =====
export interface Hub {
  id: string;
  name: string;
  address: string;
  type: "hub" | "branch";
  lat: number;
  lng: number;
  status: "active" | "inactive";
}

// ===== API Response =====
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ===== System Config =====
export interface SystemConfig {
  key: string;
  value: string;
  description: string;
  category: ConfigCategory;
  updatedAt: string;
}

export type ConfigCategory = "general" | "shipping" | "payment" | "notification" | "security";
