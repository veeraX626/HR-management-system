export type TokenPayload = {
  access_token: string;
  token_type: string;
};

const TOKEN_KEY = "hackathon_token";

export const auth = {
  save(token: TokenPayload) {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
  },
  load(): TokenPayload | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(TOKEN_KEY);
    return raw ? (JSON.parse(raw) as TokenPayload) : null;
  },
  clear() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
  },
  authHeader(): Record<string, string> {
    const token = auth.load();
    if (!token) return {};
    return { Authorization: `Bearer ${token.access_token}` };
  }
};
