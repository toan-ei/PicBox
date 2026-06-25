import { apiClient } from "./api-client";
import type { Order, OrderStatus } from "@picbox/types";

// ─── Backend status enum (15 values) ────────────────────────────────────────

export type BackendOrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PICKED_UP"
  | "AT_ORIGIN_BRANCH"
  | "IN_TRANSIT_TO_HUB"
  | "AT_HUB"
  | "IN_TRANSIT_TO_DEST_HUB"
  | "AT_DEST_HUB"
  | "IN_TRANSIT_TO_DEST_BRANCH"
  | "AT_DEST_BRANCH"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "DELIVERY_FAILED"
  | "RETURNED"
  | "CANCELLED";

const BE_TO_FE: Record<BackendOrderStatus, OrderStatus> = {
  PENDING:                  "pending",
  CONFIRMED:                "confirmed",
  PICKED_UP:                "picked_up",
  AT_ORIGIN_BRANCH:         "picked_up",
  IN_TRANSIT_TO_HUB:        "in_transit",
  AT_HUB:                   "at_hub",
  IN_TRANSIT_TO_DEST_HUB:   "at_hub",
  AT_DEST_HUB:              "at_hub",
  IN_TRANSIT_TO_DEST_BRANCH:"in_transit",
  AT_DEST_BRANCH:           "sorting",
  OUT_FOR_DELIVERY:         "out_for_delivery",
  DELIVERED:                "delivered",
  DELIVERY_FAILED:          "failed",
  RETURNED:                 "returned",
  CANCELLED:                "cancelled",
};

const FE_TO_BE: Record<OrderStatus, BackendOrderStatus> = {
  pending:          "PENDING",
  confirmed:        "CONFIRMED",
  picked_up:        "PICKED_UP",
  in_transit:       "IN_TRANSIT_TO_HUB",
  at_hub:           "AT_HUB",
  sorting:          "AT_DEST_BRANCH",
  out_for_delivery: "OUT_FOR_DELIVERY",
  delivered:        "DELIVERED",
  failed:           "DELIVERY_FAILED",
  returned:         "RETURNED",
  cancelled:        "CANCELLED",
};

export function toFrontendStatus(s: string): OrderStatus {
  return BE_TO_FE[s as BackendOrderStatus] ?? "pending";
}

export function toBackendStatus(s: OrderStatus): BackendOrderStatus {
  return FE_TO_BE[s] ?? "PENDING";
}

// ─── Branch list (replace with GET /hub/branches when hub-service is ready) ──

export interface Branch {
  id: string;
  name: string;
}

export const BRANCH_LIST: Branch[] = [
  { id: "HCM_01", name: "Chi nhánh TP.HCM - Quận 1" },
  { id: "HAN_01", name: "Chi nhánh Hà Nội - Hoàn Kiếm" },
  { id: "DN_01",  name: "Chi nhánh Đà Nẵng" },
  { id: "CT_01",  name: "Chi nhánh Cần Thơ" },
  { id: "HP_01",  name: "Chi nhánh Hải Phòng" },
];

// ─── Backend response shape ──────────────────────────────────────────────────

interface BackendOrder {
  id: string;
  trackingCode: string;
  senderId: string;
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  originBranchId: string;
  originBranchName: string;
  destBranchId: string;
  destBranchName: string;
  weight: number;
  width?: number;
  height?: number;
  length?: number;
  fee: number;
  codAmount?: number;
  pickupMethod: "PICKUP_AT_BRANCH" | "PICKUP_AT_DOOR";
  status: string;
  regionCode?: string;
  shipperId?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// ─── Adapter: BackendOrder → Order (frontend type) ───────────────────────────

function adapt(o: BackendOrder): Order {
  const dims = [o.length, o.width, o.height]
    .filter(Boolean)
    .map(d => `${d}cm`)
    .join(" × ");
  return {
    id:              o.id,
    trackingCode:    o.trackingCode,
    senderId:        o.senderId,
    senderName:      o.senderName,
    senderPhone:     o.senderPhone,
    senderAddress:   o.originBranchName,
    receiverName:    o.receiverName,
    receiverPhone:   o.receiverPhone,
    receiverAddress: o.receiverAddress,
    weight:          o.weight,
    dimensions:      dims || undefined,
    note:            o.note,
    codAmount:       o.codAmount ?? 0,
    shippingFee:     o.fee,
    status:          toFrontendStatus(o.status),
    createdAt:       o.createdAt,
    updatedAt:       o.updatedAt,
  };
}

// ─── Paged result ─────────────────────────────────────────────────────────────

export interface OrderPage {
  orders: Order[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

// ─── Create order params ──────────────────────────────────────────────────────

export interface CreateOrderParams {
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  destBranchId: string;
  destBranchName: string;
  originBranchId: string;
  originBranchName: string;
  weight: number;
  width?: number;
  height?: number;
  length?: number;
  fee: number;
  codAmount?: number;
  pickupMethod?: "PICKUP_AT_BRANCH" | "PICKUP_AT_DOOR";
  note?: string;
}

// ─── API functions ────────────────────────────────────────────────────────────

export async function createOrder(params: CreateOrderParams): Promise<Order> {
  const { data } = await apiClient.post("/order/orders", {
    ...params,
    pickupMethod: params.pickupMethod ?? "PICKUP_AT_DOOR",
  });
  if (data.code !== 1000 && data.code !== 0) {
    throw new Error(data.message || "Tạo đơn hàng thất bại");
  }
  return adapt(data.result as BackendOrder);
}

export async function getMyOrders(page = 0, size = 50): Promise<OrderPage> {
  const { data } = await apiClient.get("/order/orders/my", {
    params: { page, size },
  });
  if (data.code !== 1000 && data.code !== 0) {
    throw new Error(data.message || "Không thể tải danh sách đơn");
  }
  const pr = data.result as PageResponse<BackendOrder>;
  return {
    orders:        pr.content.map(adapt),
    totalElements: pr.totalElements,
    totalPages:    pr.totalPages,
    page:          pr.page,
    size:          pr.size,
  };
}

export async function getAssignedOrders(page = 0, size = 50): Promise<OrderPage> {
  const { data } = await apiClient.get("/order/orders/assigned", {
    params: { page, size },
  });
  if (data.code !== 1000 && data.code !== 0) {
    throw new Error(data.message || "Không thể tải danh sách đơn được gán");
  }
  const pr = data.result as PageResponse<BackendOrder>;
  return {
    orders:        pr.content.map(adapt),
    totalElements: pr.totalElements,
    totalPages:    pr.totalPages,
    page:          pr.page,
    size:          pr.size,
  };
}

export async function getOrder(orderId: string): Promise<Order> {
  const { data } = await apiClient.get(`/order/orders/${orderId}`);
  if (data.code !== 1000 && data.code !== 0) {
    throw new Error(data.message || "Không tìm thấy đơn hàng");
  }
  return adapt(data.result as BackendOrder);
}

export async function getOrderByTracking(trackingCode: string): Promise<Order> {
  const { data } = await apiClient.get(
    `/order/orders/tracking/${trackingCode}`
  );
  if (data.code !== 1000 && data.code !== 0) {
    throw new Error(data.message || "Không tìm thấy vận đơn");
  }
  return adapt(data.result as BackendOrder);
}

export async function cancelOrder(orderId: string): Promise<void> {
  const { data } = await apiClient.delete(`/order/orders/${orderId}`);
  if (data.code !== 1000 && data.code !== 0) {
    throw new Error(data.message || "Không thể huỷ đơn hàng");
  }
}

export interface OrderHistoryEvent {
  status: OrderStatus;
  note?: string;
  timestamp: string;
  updatedBy?: string;
}

export async function getOrderHistory(
  orderId: string
): Promise<OrderHistoryEvent[]> {
  const { data } = await apiClient.get(`/order/orders/${orderId}/history`);
  if (data.code !== 1000 && data.code !== 0) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.result as any[]).map((h) => ({
    status:    toFrontendStatus(h.status),
    note:      h.note,
    timestamp: h.createdAt ?? h.timestamp,
    updatedBy: h.updatedBy,
  }));
}
