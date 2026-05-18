// ─────────────────────────────────────────────────────────────────────────────
// MOCK AUTH — giả lập đăng ký / đăng nhập dùng localStorage
// Khi có backend: xoá file này, thay bằng API calls thật
// ─────────────────────────────────────────────────────────────────────────────

export interface MockUser {
  id: string
  name: string
  email: string
  phone: string
  password: string   // thực tế KHÔNG bao giờ lưu plaintext — đây chỉ là mock
  createdAt: string
}

const USERS_KEY = 'shipnow_mock_users'
const SESSION_KEY = 'shipnow_mock_session'

// ── Helpers ──────────────────────────────────────────────────────────────────

function getUsers(): MockUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveUsers(users: MockUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

// ── Auth actions ──────────────────────────────────────────────────────────────

export type AuthResult =
  | { ok: true; user: MockUser }
  | { ok: false; error: string }

/** Đăng ký tài khoản mới */
export function mockRegister(data: {
  name: string
  email: string
  phone: string
  password: string
}): AuthResult {
  const users = getUsers()

  // Kiểm tra email/phone trùng
  if (users.some(u => u.email === data.email)) {
    return { ok: false, error: 'Email này đã được sử dụng' }
  }
  if (users.some(u => u.phone === data.phone)) {
    return { ok: false, error: 'Số điện thoại này đã được sử dụng' }
  }

  const newUser: MockUser = {
    id: `user_${Date.now()}`,
    name: data.name,
    email: data.email,
    phone: data.phone,
    password: data.password,
    createdAt: new Date().toISOString(),
  }

  saveUsers([...users, newUser])
  return { ok: true, user: newUser }
}

/** Đăng nhập — chấp nhận email hoặc SĐT */
export function mockLogin(identifier: string, password: string): AuthResult {
  const users = getUsers()
  const user = users.find(
    u => (u.email === identifier || u.phone === identifier) && u.password === password
  )

  if (!user) {
    return { ok: false, error: 'Email/SĐT hoặc mật khẩu không đúng' }
  }

  // Lưu session (giả lập cookie/token)
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id, name: user.name, email: user.email, phone: user.phone }))

  // Set cookie giả để middleware Next.js nhận ra (dev mode đã bypass rồi nên optional)
  document.cookie = `auth_token=mock_${user.id}; path=/; max-age=${60 * 60 * 24 * 7}`

  return { ok: true, user }
}

/** Đăng xuất */
export function mockLogout() {
  localStorage.removeItem(SESSION_KEY)
  document.cookie = 'auth_token=; path=/; max-age=0'
}

/** Lấy user đang đăng nhập */
export function getCurrentUser(): { userId: string; name: string; email: string; phone: string } | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/** Kiểm tra đã đăng nhập chưa */
export function isLoggedIn(): boolean {
  return getCurrentUser() !== null
}