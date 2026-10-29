import type { SavedCookie } from "./cookie";

export interface Session {
  id: string;
  label: string;
  domain: string;
  url: string;
  cookies: SavedCookie[];
  savedAt: string;
  lastUsedAt: string | null;
  cookieCount: number;
}
