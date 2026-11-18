// Read in the visitor's browser. PUBLIC_RELEASES_URL replaces it at build time.
export const releasesURL =
  import.meta.env["PUBLIC_RELEASES_URL"] ||
  "https://download.ladybird.org/releases.json";

// Release builds come from this repository's workflows. Attestations are
// checked against it, never against a repository named by the manifest.
export const repository = "LadybirdBrowser/ladybird";
export const repositoryURL = `https://github.com/${repository}`;

/** Release tags are named after the version, e.g. "2026.11.0". */
export function releaseTagURL(version: string): string {
  return `${repositoryURL}/releases/tag/${encodeURIComponent(version)}`;
}

// Who signs releases. These live here, not in the release manifest: a
// fingerprint served from the same host as its key proves nothing if that host
// is compromised, and changing these takes a commit to this website.
//
// OpenPGP fingerprints are written as `gpg --show-keys` and DNF's import
// prompt show them.
export const signingKeys = {
  apt: "4F3D5DFE64EBD9BB35D58FBDCF9EF7324C4B27AE",
  rpm: "5C9B16C67BF7A50B3EBD2EE172FC8B30AFFCACA6",
  flatpak: "9436EDD8A32302AD5B9BC80FD941A9B53C448496",
};

/** The Apple Developer Team ID that signs the macOS disk image. */
export const appleTeamID = "KQT83NTQL8";

/**
 * The public key of release-tools' attestation key, which signs the
 * attestations that the release makes itself, such as the disk image's. It is
 * public/keys/ladybird-attestation.pub in this website's repository, where
 * anyone can compare it with what the site serves.
 */
export const attestationKeyURL =
  "https://ladybird.org/keys/ladybird-attestation.pub";
