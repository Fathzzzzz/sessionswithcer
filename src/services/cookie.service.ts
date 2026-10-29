import type { SavedCookie } from "../types/cookie";
import { buildCookieUrl } from "../utils/domain";

/**
 * Get all cookies for a given domain.
 */
export async function getCookiesForDomain(
  domain: string,
): Promise<SavedCookie[]> {
  const cookies = await chrome.cookies.getAll({ domain });
  return cookies.map(mapToSavedCookie);
}

/**
 * Remove all cookies for a given domain.
 */
export async function clearCookiesForDomain(domain: string): Promise<void> {
  const cookies = await chrome.cookies.getAll({ domain });
  const removals = cookies.map((cookie) => {
    const url = buildCookieUrl({
      secure: cookie.secure,
      domain: cookie.domain,
      path: cookie.path,
    });
    return chrome.cookies
      .remove({ url, name: cookie.name, storeId: cookie.storeId })
      .catch((err) => {
        console.warn(`Failed to remove cookie ${cookie.name}:`, err);
      });
  });
  await Promise.all(removals);
}

/**
 * Set an array of saved cookies back into the browser.
 */
export async function setCookies(cookies: SavedCookie[]): Promise<void> {
  const sets = cookies.map((cookie) => {
    const url = buildCookieUrl(cookie);
    const details: chrome.cookies.SetDetails = {
      url,
      name: cookie.name,
      value: cookie.value,
      domain: cookie.domain,
      path: cookie.path,
      secure: cookie.secure,
      httpOnly: cookie.httpOnly,
      sameSite: cookie.sameSite,
      storeId: cookie.storeId,
    };
    // Only set expirationDate for persistent cookies
    if (cookie.expirationDate !== undefined) {
      details.expirationDate = cookie.expirationDate;
    }
    return chrome.cookies.set(details).catch((err) => {
      console.warn(`Failed to set cookie ${cookie.name}:`, err);
    });
  });
  await Promise.all(sets);
}

function mapToSavedCookie(cookie: chrome.cookies.Cookie): SavedCookie {
  const saved: SavedCookie = {
    name: cookie.name,
    value: cookie.value,
    domain: cookie.domain,
    path: cookie.path,
    secure: cookie.secure,
    httpOnly: cookie.httpOnly,
    sameSite: cookie.sameSite,
    storeId: cookie.storeId,
  };
  if (cookie.expirationDate !== undefined) {
    saved.expirationDate = cookie.expirationDate;
  }
  return saved;
}
