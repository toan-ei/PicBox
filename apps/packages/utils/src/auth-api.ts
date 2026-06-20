import axios from "axios";
import type { User, UserRole } from "@picbox/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// ─── JWT decode (no library needed) ─────────────────────────────────────────

function decodeJwt(token: string): Record<string, unknown> {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return {};
  }
}

function scopeToRole(scope: string): UserRole {
  const s = (scope || "").toUpperCase();
  if (s.includes("ADMIN")) return "admin";
  if (s.includes("OPS")) return "ops";
  if (s.includes("SHIPPER")) return "shipper";
  if (s.includes("DRIVER")) return "driver";
  return "sender";
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AuthResult {
  token: string;
  user: User;
}

// ─── API calls ───────────────────────────────────────────────────────────────

export async function apiLogin(username: string, password: string): Promise<AuthResult> {
  const { data } = await axios.post(`${API_BASE}/identity/auth/token`, { username, password });
  if (data.code !== 1000 && data.code !== 0) {
    throw new Error(data.message || "Đăng nhập thất bại");
  }
  const token: string = data.result.token;
  const claims = decodeJwt(token);
  const userId = claims.sub as string;
  const scope = (claims.scope as string) || "";

  // Fetch profile for display name
  let fullName = username;
  let phone = "";
  let avatarUrl: string | undefined;
  try {
    const profileRes = await axios.get(
      `${API_BASE}/profile/profiles/getProfile/fromUserId/${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const p = profileRes.data?.result;
    if (p) {
      fullName = p.fullName || p.firstName || username;
      phone = p.phone || p.phoneNumber || "";
      avatarUrl = p.avatarUrl || p.avatar;
    }
  } catch {
    // Profile fetch is best-effort; continue with username as fallback
  }

  const user: User = {
    id: userId,
    email: username.includes("@") ? username : "",
    fullName,
    phone,
    role: scopeToRole(scope),
    status: "active",
    avatarUrl,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return { token, user };
}

export async function apiRegister(params: {
  username: string;
  password: string;
  fullName: string;
  phone: string;
}): Promise<void> {
  let data: Record<string, unknown>;
  try {
    const res = await axios.post(`${API_BASE}/identity/users/createUser`, {
      username: params.username,
      password: params.password,
      gender: "",
    });
    data = res.data;
  } catch (err: unknown) {
    // Extract backend error message from Axios response body (e.g. "user existed")
    const axiosErr = err as { response?: { data?: { message?: string } } };
    const msg = axiosErr.response?.data?.message;
    throw new Error(msg || "Đăng ký thất bại");
  }

  // identity-service uses code 1001 for success (other services use 1000 or 0)
  if (data.code !== 1000 && data.code !== 1001 && data.code !== 0) {
    throw new Error((data.message as string) || "Đăng ký thất bại");
  }

  // Create profile (best-effort; non-fatal if it fails)
  try {
    await axios.post(`${API_BASE}/profile/profiles/Internal/createProfile`, {
      userId: (data.result as Record<string, unknown>)?.id,
      fullName: params.fullName,
      phone: params.phone,
      email: params.username.includes("@") ? params.username : "",
    });
  } catch {
    // profile creation failure is non-fatal for registration
  }
}

export async function apiLogout(token: string): Promise<void> {
  try {
    await axios.post(`${API_BASE}/identity/auth/logout`, { token });
  } catch {
    // Ignore logout errors — clear local state regardless
  }
}

export async function apiRefreshToken(token: string): Promise<string> {
  const { data } = await axios.post(`${API_BASE}/identity/auth/refreshToken`, { token });
  return data.result.token as string;
}
