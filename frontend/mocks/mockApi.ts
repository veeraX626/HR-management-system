const mockUsers = [
  { id: 1, username: "demo", email: "demo@example.com", full_name: "Demo User", is_active: true },
  { id: 2, username: "alex", email: "alex@example.com", full_name: "Alex Dev", is_active: true }
];

export async function handleMock<T>(_path: string, options: RequestInit): Promise<T> {
  if (_path.includes("/auth/login")) {
    return { access_token: "mock-token", token_type: "bearer" } as T;
  }
  if (_path.includes("/auth/register")) {
    const body = options.body ? JSON.parse(options.body as string) : {};
    mockUsers.push({ id: mockUsers.length + 1, ...body, is_active: true });
    return { access_token: "mock-token", token_type: "bearer" } as T;
  }
  if (_path.includes("/users") && options.method === "POST") {
    const body = options.body ? JSON.parse(options.body as string) : {};
    const user = { id: mockUsers.length + 1, ...body };
    mockUsers.push(user);
    return user as T;
  }
  if (_path.includes("/users") && options.method === "PUT") {
    const id = Number(_path.split("/").pop());
    const body = options.body ? JSON.parse(options.body as string) : {};
    const idx = mockUsers.findIndex((u) => u.id === id);
    if (idx >= 0) mockUsers[idx] = { ...mockUsers[idx], ...body };
    return mockUsers[idx] as T;
  }
  if (_path.includes("/users") && options.method === "DELETE") {
    const id = Number(_path.split("/").pop());
    return { success: true, id } as T;
  }
  if (_path.includes("/users")) {
    return mockUsers as T;
  }
  if (_path.includes("/health")) {
    return { status: "ok-mock" } as T;
  }
  throw new Error(`Unhandled mock path: ${_path}`);
}
