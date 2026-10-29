import type { Session } from "../types/session";

const STORAGE_KEY = "sessions";

/**
 * Get all stored sessions.
 */
export async function getAllSessions(): Promise<Session[]> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return (result[STORAGE_KEY] as Session[]) ?? [];
}

/**
 * Get sessions filtered by domain.
 */
export async function getSessionsByDomain(
  domain: string,
): Promise<Session[]> {
  const sessions = await getAllSessions();
  return sessions.filter((s) => s.domain === domain);
}

/**
 * Save a new session (appends to the array).
 */
export async function saveSession(session: Session): Promise<void> {
  const sessions = await getAllSessions();
  sessions.push(session);
  await chrome.storage.local.set({ [STORAGE_KEY]: sessions });
}

/**
 * Delete a session by its ID.
 */
export async function deleteSession(sessionId: string): Promise<void> {
  const sessions = await getAllSessions();
  const filtered = sessions.filter((s) => s.id !== sessionId);
  await chrome.storage.local.set({ [STORAGE_KEY]: filtered });
}

/**
 * Update a session (partial merge by ID).
 */
export async function updateSession(
  sessionId: string,
  updates: Partial<Session>,
): Promise<void> {
  const sessions = await getAllSessions();
  const idx = sessions.findIndex((s) => s.id === sessionId);
  if (idx === -1) throw new Error(`Session ${sessionId} not found`);
  sessions[idx] = { ...sessions[idx], ...updates };
  await chrome.storage.local.set({ [STORAGE_KEY]: sessions });
}

/**
 * Get a single session by ID.
 */
export async function getSession(sessionId: string): Promise<Session | null> {
  const sessions = await getAllSessions();
  return sessions.find((s) => s.id === sessionId) ?? null;
}
