import type { Session } from "../types/session";
import {
  getCookiesForDomain,
  clearCookiesForDomain,
  setCookies,
} from "./cookie.service";
import {
  saveSession,
  getSession,
  updateSession,
} from "../storage/session.storage";
import { generateId } from "../utils/id";
import { extractDomain } from "../utils/domain";

/**
 * Capture the current session (all cookies) for the active tab's domain.
 */
export async function captureSession(
  label: string,
  tabId: number,
): Promise<Session> {
  const tab = await chrome.tabs.get(tabId);
  if (!tab.url) throw new Error("Cannot read tab URL");

  const domain = extractDomain(tab.url);
  if (!domain) throw new Error("Invalid URL");

  const cookies = await getCookiesForDomain(domain);

  const session: Session = {
    id: generateId(),
    label,
    domain,
    url: tab.url,
    cookies,
    savedAt: new Date().toISOString(),
    lastUsedAt: null,
    cookieCount: cookies.length,
  };

  await saveSession(session);
  return session;
}

/**
 * Restore a saved session: clear current cookies for the domain,
 * set saved cookies, reload the tab.
 */
export async function restoreSession(
  sessionId: string,
  tabId: number,
): Promise<void> {
  const session = await getSession(sessionId);
  if (!session) throw new Error(`Session ${sessionId} not found`);

  // Clear existing cookies for this domain
  await clearCookiesForDomain(session.domain);

  // Set the saved cookies
  await setCookies(session.cookies);

  // Update lastUsedAt
  await updateSession(sessionId, {
    lastUsedAt: new Date().toISOString(),
  });

  // Reload the tab to apply
  await chrome.tabs.reload(tabId);
}

/**
 * Re-capture: update an existing session with fresh cookies from the current tab.
 */
export async function recaptureSession(
  sessionId: string,
  tabId: number,
): Promise<Session> {
  const session = await getSession(sessionId);
  if (!session) throw new Error(`Session ${sessionId} not found`);

  const tab = await chrome.tabs.get(tabId);
  if (!tab.url) throw new Error("Cannot read tab URL");

  const domain = extractDomain(tab.url);
  const cookies = await getCookiesForDomain(domain);

  const updates: Partial<Session> = {
    cookies,
    cookieCount: cookies.length,
    savedAt: new Date().toISOString(),
    url: tab.url,
    domain,
  };

  await updateSession(sessionId, updates);
  return { ...session, ...updates };
}
