/**
 * Extract the domain from a URL string.
 * Returns the hostname (e.g. "github.com").
 */
export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

/**
 * Build a cookie URL from a SavedCookie's properties.
 * Used for chrome.cookies.set() and chrome.cookies.remove().
 */
export function buildCookieUrl(cookie: {
  secure: boolean;
  domain: string;
  path: string;
}): string {
  const scheme = cookie.secure ? "https" : "http";
  const domain = cookie.domain.replace(/^\./, "");
  return `${scheme}://${domain}${cookie.path}`;
}
