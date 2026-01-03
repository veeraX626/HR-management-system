import { auth } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const USE_MOCK = process.env.NEXT_PUBLIC_MOCK_API === "true";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (USE_MOCK) {
    const mock = await import("../mocks/mockApi");
    return mock.handleMock<T>(path, options);
  }
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...auth.authHeader(),
    ...options.headers
  };
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json() as Promise<T>;
}

export const api = {
  login: (username: string, password: string) =>
    request<{ access_token: string; token_type: string }>("/auth/login", {
      method: "POST",
      body: new URLSearchParams({ username, password }) as unknown as BodyInit,
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    }),
  register: (payload: { username: string; email: string; password: string; full_name?: string }) =>
    request<{ access_token: string; token_type: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  users: {
    list: () => request<any[]>("/users"),
    create: (payload: any) => request("/users", { method: "POST", body: JSON.stringify(payload) }),
    update: (id: number, payload: any) =>
      request(`/users/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    remove: (id: number) => request(`/users/${id}`, { method: "DELETE" })
  },
  health: () => request<{ status: string }>("/health")
};
