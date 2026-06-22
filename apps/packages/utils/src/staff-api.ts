import { apiClient } from "./api-client";

export interface StaffMember {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  role: string;
  homeBaseId?: string;
  homeBaseName?: string;
  status: string;
}

export async function getStaffList(role?: string): Promise<StaffMember[]> {
  try {
    const params: Record<string, string> = {};
    if (role) params.role = role;
    const { data } = await apiClient.get("/staff/", { params });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const list: any[] = data?.result ?? [];
    return list.map((s) => ({
      id:           s.id,
      userId:       s.userId || s.id,
      fullName:     s.fullName || s.name || s.username || "Shipper",
      phone:        s.phone || s.phoneNumber || "",
      role:         s.role || s.staffRole || "",
      homeBaseId:   s.homeBaseId || s.branchId || "",
      homeBaseName: s.homeBaseName || s.branchName || "",
      status:       s.status || "ACTIVE",
    }));
  } catch {
    return [];
  }
}

export async function assignOrderToShipper(
  orderId: string,
  shipperId: string
): Promise<void> {
  const { data } = await apiClient.put(`/order/orders/${orderId}/assign`, {
    shipperId,
  });
  if (data.code !== 0 && data.code !== 1000) {
    throw new Error(data.message || "Gán shipper thất bại");
  }
}
