import { apiClient } from "./api-client";
import { toFrontendStatus } from "./order-api";
import type { OrderPage } from "./order-api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  username: string;
  fullName: string;
  phone: string;
  role: string;
}

export interface AdminHub {
  id: string;
  name: string;
  type: "hub" | "branch";
  address: string;
  province: string;
  contactPhone: string;
  active: boolean;
  hubName?: string;
  maxCapacity?: number;
}

export interface AdminOrder {
  id: string;
  trackingCode: string;
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  originBranchName: string;
  destBranchName: string;
  receiverAddress: string;
  weight: number;
  fee: number;
  codAmount: number;
  status: string;
  backendStatus: string;
  shipperId?: string;
  note?: string;
  createdAt: string;
}

// ─── Internal adapters ────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function adaptAdminOrder(o: any): AdminOrder {
  return {
    id: o.id,
    trackingCode: o.trackingCode,
    senderName: o.senderName,
    senderPhone: o.senderPhone,
    receiverName: o.receiverName,
    receiverPhone: o.receiverPhone,
    originBranchName: o.originBranchName,
    destBranchName: o.destBranchName,
    receiverAddress: o.receiverAddress,
    weight: o.weight,
    fee: o.fee,
    codAmount: o.codAmount ?? 0,
    status: toFrontendStatus(o.status),
    backendStatus: o.status,
    shipperId: o.shipperId,
    note: o.note,
    createdAt: o.createdAt,
  };
}

// ─── Orders ───────────────────────────────────────────────────────────────────

const ADMIN_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PICKED_UP",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "DELIVERY_FAILED",
  "CANCELLED",
];

export async function getAllAdminOrders(): Promise<AdminOrder[]> {
  const results = await Promise.allSettled(
    ADMIN_STATUSES.map((s) =>
      apiClient.get(`/order/orders/status/${s}`, { params: { page: 0, size: 50 } })
    )
  );

  const orders: AdminOrder[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") {
      const content = r.value.data?.result?.content ?? [];
      orders.push(...content.map(adaptAdminOrder));
    }
  }
  // Sort by createdAt desc
  orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return orders;
}

export async function countOrdersByStatus(status: string): Promise<number> {
  try {
    const { data } = await apiClient.get(`/order/orders/status/${status}`, {
      params: { page: 0, size: 1 },
    });
    return data?.result?.totalElements ?? 0;
  } catch {
    return 0;
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
  note?: string
): Promise<void> {
  const { data } = await apiClient.put(`/order/orders/${orderId}/status`, {
    status,
    note,
  });
  if (data.code !== 0 && data.code !== 1000) {
    throw new Error(data.message || "Cập nhật trạng thái thất bại");
  }
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function getAllUsers(): Promise<AdminUser[]> {
  const [usersRes, profilesRes] = await Promise.allSettled([
    apiClient.get("/identity/users/getAllUser"),
    apiClient.get("/profile/profiles/GetAllProfile"),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const users: any[] =
    usersRes.status === "fulfilled" ? (usersRes.value.data?.result ?? []) : [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profiles: any[] =
    profilesRes.status === "fulfilled"
      ? (profilesRes.value.data?.result ?? [])
      : [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profileMap = new Map<string, any>(profiles.map((p) => [p.userId, p]));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return users.map((u: any) => {
    const profile = profileMap.get(u.id);
    const roleName: string =
      (u.roles as { name: string }[])?.[0]?.name?.toLowerCase() ?? "sender";
    return {
      id: u.id,
      username: u.username,
      fullName: profile?.fullName || u.username,
      phone: profile?.phoneNumber || "",
      role: roleName,
    };
  });
}

export async function countUsersByRole(role: string): Promise<number> {
  try {
    const { data } = await apiClient.get(
      `/identity/users/countUserWithRole/${role}`
    );
    return (data?.result as number) ?? 0;
  } catch {
    return 0;
  }
}

export async function deleteUser(userId: string): Promise<void> {
  const { data } = await apiClient.delete(
    `/identity/users/deleteUser/${userId}`
  );
  if (data.code !== 0 && data.code !== 1000) {
    throw new Error(data.message || "Xóa người dùng thất bại");
  }
}

// ─── Hubs & Branches ──────────────────────────────────────────────────────────

export async function getAllHubsAndBranches(): Promise<AdminHub[]> {
  const [hubsRes, branchesRes] = await Promise.allSettled([
    apiClient.get("/hub/hubs"),
    apiClient.get("/hub/branches"),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hubs: AdminHub[] =
    hubsRes.status === "fulfilled"
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (hubsRes.value.data?.result ?? []).map((h: any) => ({
          id: h.id,
          name: h.name,
          type: "hub" as const,
          address: h.address || "",
          province: h.province || h.areaName || "",
          contactPhone: h.contactPhone || "",
          active: h.active ?? true,
        }))
      : [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const branches: AdminHub[] =
    branchesRes.status === "fulfilled"
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (branchesRes.value.data?.result ?? []).map((b: any) => ({
          id: b.id,
          name: b.name,
          type: "branch" as const,
          address: [b.address, b.district, b.ward].filter(Boolean).join(", "),
          province: b.province || "",
          contactPhone: b.contactPhone || "",
          active: b.active ?? true,
          hubName: b.hubName,
          maxCapacity: b.maxCapacity,
        }))
      : [];

  return [...hubs, ...branches];
}

// ─── Dashboard stats ──────────────────────────────────────────────────────────

export interface DashboardStats {
  totalOrders: number;
  deliveringOrders: number;
  deliveredOrders: number;
  failedOrders: number;
  totalUsers: number;
  totalShippers: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [pending, delivering, delivered, failed, totalUsers, totalShippers] =
    await Promise.all([
      countOrdersByStatus("PENDING"),
      countOrdersByStatus("OUT_FOR_DELIVERY"),
      countOrdersByStatus("DELIVERED"),
      countOrdersByStatus("DELIVERY_FAILED"),
      countUsersByRole("SENDER").catch(() => 0),
      countUsersByRole("SHIPPER").catch(() => 0),
    ]);

  return {
    totalOrders: pending + delivering + delivered + failed,
    deliveringOrders: delivering,
    deliveredOrders: delivered,
    failedOrders: failed,
    totalUsers,
    totalShippers,
  };
}
