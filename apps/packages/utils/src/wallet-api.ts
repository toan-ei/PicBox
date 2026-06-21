import axios from "axios";
import { apiClient } from "./api-client";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WalletInfo {
  id: string;
  userId: string;
  balance: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: string;
  referenceId?: string;
  subject: string;
  body: string;
  status: string;
  createdAt: string;
}

export interface TopUpRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  note?: string;
  createdAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

const TOPUP_QUEUE_KEY = "picbox_topup_queue";

// ─── Wallet APIs ──────────────────────────────────────────────────────────────

export async function getMyWallet(): Promise<WalletInfo | null> {
  try {
    const { data } = await apiClient.get("/payment/wallets/my");
    if (data.code !== 0 && data.code !== 1000) return null;
    const r = data.result;
    return { id: r.id, userId: r.userId, balance: Number(r.balance) };
  } catch {
    return null;
  }
}

export async function topUpWallet(amount: number, description?: string): Promise<WalletInfo> {
  const { data } = await apiClient.post("/payment/wallets/top-up", {
    amount,
    description: description ?? "Nạp tiền",
  });
  if (data.code !== 0 && data.code !== 1000) {
    throw new Error(data.message || "Nạp tiền thất bại");
  }
  const r = data.result;
  return { id: r.id, userId: r.userId, balance: Number(r.balance) };
}

// Admin calls internal endpoint (permitAll — no auth needed)
export async function adminCreditWallet(userId: string, amount: number, description: string): Promise<void> {
  const { data } = await axios.post(
    `${API_BASE}/payment/internal/wallets/credit`,
    { userId, amount, description },
    { headers: { "Content-Type": "application/json" } }
  );
  if (data.code !== 0 && data.code !== 1000) {
    throw new Error(data.message || "Cấp tiền thất bại");
  }
}

// ─── Pending top-up queue (localStorage) ─────────────────────────────────────

export function savePendingTopUp(params: {
  userId: string;
  userName: string;
  amount: number;
  note?: string;
}): TopUpRequest {
  const queue: TopUpRequest[] = getPendingTopUps();
  const req: TopUpRequest = {
    id: typeof crypto !== "undefined" ? crypto.randomUUID() : Math.random().toString(36).slice(2),
    userId: params.userId,
    userName: params.userName,
    amount: params.amount,
    note: params.note,
    createdAt: new Date().toISOString(),
    status: "PENDING",
  };
  queue.unshift(req);
  localStorage.setItem(TOPUP_QUEUE_KEY, JSON.stringify(queue.slice(0, 100)));
  return req;
}

export function getPendingTopUps(): TopUpRequest[] {
  try {
    return JSON.parse(localStorage.getItem(TOPUP_QUEUE_KEY) ?? "[]") as TopUpRequest[];
  } catch {
    return [];
  }
}

export function updateTopUpStatus(id: string, status: "APPROVED" | "REJECTED"): void {
  const queue = getPendingTopUps().map((r) => (r.id === id ? { ...r, status } : r));
  localStorage.setItem(TOPUP_QUEUE_KEY, JSON.stringify(queue));
}

// ─── Notification API ─────────────────────────────────────────────────────────

export async function getUserNotifications(userId: string, page = 0): Promise<NotificationItem[]> {
  try {
    const { data } = await apiClient.get(`/notification/notifications/user/${userId}`, {
      params: { page, size: 20 },
    });
    const content = data?.result?.content ?? [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return content.map((n: any) => ({
      id: n.id,
      userId: n.userId,
      type: n.type ?? "GENERIC",
      referenceId: n.referenceId,
      subject: n.subject,
      body: n.body,
      status: n.status ?? "SENT",
      createdAt: n.createdAt,
    }));
  } catch {
    return [];
  }
}
