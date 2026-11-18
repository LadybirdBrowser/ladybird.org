import { releasesURL } from "./config";
import { parseManifest, type Manifest } from "./releases";

let pending: Promise<Manifest> | undefined;

export function loadReleases(): Promise<Manifest> {
  if (!pending) {
    pending = fetch(releasesURL, {
      credentials: "omit",
      signal: AbortSignal.timeout(10000),
    })
      .then(async (response) => {
        if (!response.ok)
          throw new Error(`Release manifest: HTTP ${response.status}`);
        return parseManifest(await response.json());
      })
      .catch((error: unknown) => {
        pending = undefined;
        throw error;
      });
  }
  return pending;
}

export function desktopUserAgent(): string {
  // iPadOS can impersonate a Mac. It still cannot run the desktop application.
  return /Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1
    ? "iPad"
    : navigator.userAgent;
}
