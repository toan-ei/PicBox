import { apiLogin, apiLogout, apiRegister } from "@picbox/utils";

// ─── Cookie helper (middleware reads auth_token cookie) ──────────────────────

function setCookie(name: string, value: string, maxAge = 86400) {
  document.cookie = `${name}=${value};path=/;max-age=${maxAge}`;
}

function clearCookie(name: string) {
  document.cookie = `${name}=;path=/;max-age=0`;
}

// ─── Login ───────────────────────────────────────────────────────────────────

export async function login(
  identifier: string,
  password: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const { token, user } = await apiLogin(identifier, password);
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(user));
    setCookie("auth_token", token);
    return { ok: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Đăng nhập thất bại";
    return { ok: false, error: message };
  }
}

// ─── Register ────────────────────────────────────────────────────────────────

export async function register(params: {
  name: string;
  email: string;
  phone: string;
  password: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await apiRegister({
      username: params.email,
      password: params.password,
      fullName: params.name,
      phone: params.phone,
    });
    return { ok: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Đăng ký thất bại";
    return { ok: false, error: message };
  }
}

// ─── Logout ──────────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  const token = localStorage.getItem("accessToken") ?? "";
  await apiLogout(token);
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  clearCookie("auth_token");
}

// ─── Get current user display info ───────────────────────────────────────────

export function getCurrentUser(): { name: string; email: string } | null {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const u = JSON.parse(raw);
    return {
      name: u.fullName || u.username || "Người dùng",
      email: u.email || "",
    };
  } catch {
    return null;
  }
}
