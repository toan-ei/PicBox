import type { UserRole, AuthState } from "@picbox/types";

/** Get current auth state from localStorage */
export function getAuthState(): AuthState {
  if (typeof window === "undefined") {
    return { user: null, accessToken: null, isAuthenticated: false };
  }

  const accessToken = localStorage.getItem("accessToken");
  const userStr = localStorage.getItem("user");

  let user = null;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch {
    user = null;
  }

  return {
    user,
    accessToken,
    isAuthenticated: !!accessToken && !!user,
  };
}

/** Save auth data after login */
export function setAuthData(accessToken: string, refreshToken: string, user: object): void {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("user", JSON.stringify(user));
}

/** Clear auth data on logout */
export function clearAuthData(): void {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}

/** Check if user has required role */
export function hasRole(userRole: UserRole | undefined, allowedRoles: UserRole[]): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}

/** Check if user is admin */
export function isAdmin(userRole: UserRole | undefined): boolean {
  return hasRole(userRole, ["admin"]);
}
