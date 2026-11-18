import {
  appleTeamID,
  attestationKeyURL,
  repository,
  signingKeys,
} from "./config";

export interface Download {
  platform: string;
  architecture?: string;
  name: string;
  url: string;
  size: number;
  sha256: string;
  attestation?: string;
  /** The Sigstore bundle of an attestation that release-tools signed itself. */
  attestation_bundle?: string;
  /** The oldest macOS the app runs on, e.g. "14.4". */
  minimum_macos_version?: string;
}

/** A system a repository installs on, e.g. "Fedora 44". */
export interface RepositorySystem {
  system: string;
  /** ID and VERSION_ID of the system's /etc/os-release. */
  id: string;
  version_id: string;
  architectures: string[];
}

/** Ubuntu has a suite with a sources file of its own for every version. */
export interface AptSystem extends RepositorySystem {
  suite: string;
  sources: string;
}

/** The source code of a library under the LGPL that the release uses, as
 * its LICENSES.txt names it. */
export interface ThirdPartySource {
  name: string;
  url: string;
  size: number;
  sha256: string;
}

export interface Release {
  version: string;
  published: string;
  downloads: Download[];
  thirdPartySources: ThirdPartySource[];
  repositories: {
    apt?: { key: string; package: string; systems: AptSystem[] };
    rpm?: {
      key: string;
      repository: string;
      package: string;
      systems: RepositorySystem[];
    };
    flatpak?: {
      flatpakref: string;
      flatpakrepo: string;
      architectures: string[];
    };
  };
}

export interface Manifest {
  format: 1;
  releases: Release[];
}

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Expected an object in the release manifest.");
  return value as Record<string, unknown>;
}

function string(value: unknown): string {
  if (typeof value !== "string" || !value.trim())
    throw new Error("Expected text in the release manifest.");
  return value;
}

function list(value: unknown): unknown[] {
  if (!Array.isArray(value)) throw new Error("Expected a release list.");
  return value;
}

function strings(value: unknown): string[] {
  return list(value).map(string);
}

function url(value: unknown): string {
  const result = string(value);
  const parsed = new URL(result);
  if (parsed.protocol !== "https:" || parsed.username || parsed.password)
    throw new Error("Release links must use HTTPS without credentials.");
  return result;
}

function token(value: unknown): string {
  const result = string(value);
  if (!/^[a-zA-Z0-9._+-]+$/.test(result))
    throw new Error("Invalid package identifier.");
  return result;
}

function digest(value: unknown): string {
  const result = string(value);
  if (!/^[a-f0-9]{64}$/i.test(result)) throw new Error("Invalid SHA-256.");
  return result;
}

// Used as-is in verification commands, so only a plain file name will do.
function fileName(value: unknown): string {
  const result = string(value);
  if (!/^[^/\\\x00-\x1f]+$/.test(result) || result.startsWith("."))
    throw new Error("Invalid file name.");
  return result;
}

function size(value: unknown): number {
  if (!Number.isSafeInteger(value) || Number(value) < 0)
    throw new Error("Invalid download size.");
  return Number(value);
}

function parseThirdPartySource(value: unknown): ThirdPartySource {
  const entry = record(value);
  return {
    name: fileName(entry["name"]),
    url: url(entry["url"]),
    size: size(entry["size"]),
    sha256: digest(entry["sha256"]),
  };
}

function parseDownload(value: unknown): Download {
  const entry = record(value);
  return {
    platform: string(entry["platform"]),
    architecture: entry["architecture"]
      ? string(entry["architecture"])
      : undefined,
    name: fileName(entry["name"]),
    url: url(entry["url"]),
    size: size(entry["size"]),
    sha256: digest(entry["sha256"]),
    attestation: entry["attestation"] ? url(entry["attestation"]) : undefined,
    attestation_bundle: entry["attestation_bundle"]
      ? url(entry["attestation_bundle"])
      : undefined,
    minimum_macos_version: entry["minimum_macos_version"]
      ? osVersion(entry["minimum_macos_version"])
      : undefined,
  };
}

function osVersion(value: unknown): string {
  const result = string(value);
  if (!/^\d+(?:\.\d+)*$/.test(result))
    throw new Error("Invalid system version.");
  return result;
}

function parseSystem(value: unknown): RepositorySystem {
  const entry = record(value);
  return {
    system: string(entry["system"]),
    id: token(entry["id"]),
    version_id: token(entry["version_id"]),
    architectures: strings(entry["architectures"]),
  };
}

export function parseManifest(value: unknown): Manifest {
  const document = record(value);
  if (document["format"] !== 1) throw new Error("Unsupported manifest format.");
  const releases = list(document["releases"]).map((value): Release => {
    const entry = record(value);
    const version = string(entry["version"]);
    if (!/^\d+(?:\.\d+)*$/.test(version)) throw new Error("Invalid version.");
    const published = string(entry["published"]);
    if (!Number.isFinite(Date.parse(published)))
      throw new Error("Invalid release date.");
    const repositories = record(entry["repositories"]);
    const result: Release = {
      version,
      published,
      downloads: list(entry["downloads"]).map(parseDownload),
      // A release that uses no library under the LGPL has none.
      thirdPartySources: entry["third_party_sources"]
        ? list(entry["third_party_sources"]).map(parseThirdPartySource)
        : [],
      repositories: {},
    };
    if (repositories["apt"]) {
      const apt = record(repositories["apt"]);
      result.repositories.apt = {
        key: url(apt["key"]),
        package: token(apt["package"]),
        systems: list(apt["systems"]).map((value) => {
          const system = record(value);
          return {
            ...parseSystem(system),
            suite: token(system["suite"]),
            sources: url(system["sources"]),
          };
        }),
      };
    }
    if (repositories["rpm"]) {
      const rpm = record(repositories["rpm"]);
      result.repositories.rpm = {
        key: url(rpm["key"]),
        repository: url(rpm["repository"]),
        package: token(rpm["package"]),
        systems: list(rpm["systems"]).map(parseSystem),
      };
    }
    if (repositories["flatpak"]) {
      const flatpak = record(repositories["flatpak"]);
      result.repositories.flatpak = {
        flatpakref: url(flatpak["flatpakref"]),
        flatpakrepo: url(flatpak["flatpakrepo"]),
        architectures: strings(flatpak["architectures"]),
      };
    }
    return result;
  });
  releases.sort((a, b) => {
    const left = a.version.split(".").map(Number);
    const right = b.version.split(".").map(Number);
    for (let index = 0; index < Math.max(left.length, right.length); index++) {
      const difference = (right[index] ?? 0) - (left[index] ?? 0);
      if (difference) return difference;
    }
    return 0;
  });
  if (
    new Set(releases.map((release) => release.version)).size !== releases.length
  )
    throw new Error("Duplicate release versions.");
  return { format: 1, releases };
}

export function normalizeArchitecture(architecture: string): string {
  if (["arm64", "aarch64"].includes(architecture)) return "arm64";
  if (["amd64", "x86_64", "x64"].includes(architecture)) return "x86_64";
  return architecture;
}

// Linux users know their CPU by the names `uname -m` prints, so use the common
// short forms of those. On a Mac, Apple's own terms are the familiar ones.
export function architectureLabel(
  architecture: string | undefined,
  platform: string
): string {
  if (!architecture) return "Any architecture";
  const normalized = normalizeArchitecture(architecture);
  if (normalized === "arm64")
    return platform === "macOS" ? "Apple silicon" : "ARM64";
  if (normalized === "x86_64") return platform === "macOS" ? "Intel" : "x86-64";
  return architecture;
}

function architectureOrder(architecture: string): number {
  const rank = ["x86_64", "arm64"].indexOf(normalizeArchitecture(architecture));
  return rank === -1 ? 2 : rank;
}

/** Distinct, normalized CPU names in a stable order: x86-64 first, then ARM64. */
export function architectureSet(architectures: string[]): string[] {
  return [...new Set(architectures.map(normalizeArchitecture))].sort(
    (a, b) => architectureOrder(a) - architectureOrder(b)
  );
}

/** A readable list of CPU names, e.g. "x86-64 and ARM64". */
export function architectureList(
  architectures: string[],
  platform: string
): string {
  const labels = architectureSet(architectures).map((each) =>
    architectureLabel(each, platform)
  );
  return new Intl.ListFormat("en", { type: "conjunction" }).format(labels);
}

/**
 * Every CPU any Linux method supports, and whether all methods support the
 * same ones. If they do, the page says so once instead of on every card.
 */
export function linuxArchitectures(release: Release): {
  all: string[];
  uniform: boolean;
} {
  const { flatpak, apt, rpm } = release.repositories;
  const archives = downloadsFor(release, "Linux").map(
    (file) => file.architecture ?? ""
  );
  const sets = [
    flatpak?.architectures,
    ...(apt?.systems.map((system) => system.architectures) ?? []),
    ...(rpm?.systems.map((system) => system.architectures) ?? []),
    archives.length ? archives : undefined,
  ]
    .filter((each): each is string[] => Boolean(each))
    .map((each) => architectureSet(each).join());
  const all = architectureSet(sets.flatMap((each) => each.split(",")));
  return { all, uniform: sets.every((each) => each === all.join()) };
}

/** One choice of Ubuntu versions that install the same way, e.g. "26.04+". */
export interface AptChoice {
  label: string;
  system: AptSystem;
}

/**
 * Ubuntu versions in a row that share a suite, sources file and CPUs install
 * the same way, so they are one choice. The newest one stands for the versions
 * after it too, e.g. "26.04+" for 26.04 and 26.10; one before it names its
 * range, e.g. "24.04–24.10".
 */
export function aptChoices(systems: AptSystem[]): AptChoice[] {
  const same = (a: AptSystem, b: AptSystem) =>
    a.suite === b.suite &&
    a.sources === b.sources &&
    architectureSet(a.architectures).join() ===
      architectureSet(b.architectures).join();
  const groups: AptSystem[][] = [];
  for (const system of systems) {
    const last = groups.at(-1);
    if (last && same(last[0]!, system)) last.push(system);
    else groups.push([system]);
  }
  return groups.map((group, index) => {
    const first = group[0]!.system;
    const label =
      group.length === 1
        ? first
        : index === groups.length - 1
          ? `${first}+`
          : `${first}–${group.at(-1)!.version_id}`;
    return { label, system: group[0]! };
  });
}

export function downloadsFor(release: Release, platform: string): Download[] {
  return release.downloads.filter((download) => download.platform === platform);
}

/** The disk image to offer on the homepage, if exactly one is published. */
export function macDownload(release: Release): Download | undefined {
  const files = downloadsFor(release, "macOS");
  return files.length === 1 ? files[0] : undefined;
}

/** The oldest macOS that every one of the files runs on, if they agree. */
export function macMinimum(files: Download[]): string | undefined {
  const versions = new Set(files.map((file) => file.minimum_macos_version));
  return versions.size === 1 ? files[0]?.minimum_macos_version : undefined;
}

export function hasLinux(release: Release): boolean {
  const { apt, rpm, flatpak } = release.repositories;
  return Boolean(
    apt || rpm || flatpak || downloadsFor(release, "Linux").length
  );
}

// Quote manifest values even after validation: these commands may be copied into a shell.
const quote = (value: string) => `'${value.replaceAll("'", "'\\''")}'`;

// Where the APT instructions save the repository's key.
const aptKeyring = "/etc/apt/keyrings/ladybird.asc";

// release-tools has linked attestations in two ways: through GitHub's API and,
// since 2026.46.1, through Sigstore's search page. Both name the file's digest.
const attestationURLs = [
  /^https:\/\/api\.github\.com\/repos\/[\w.-]+\/[\w.-]+\/attestations\/sha256:([a-f0-9]{64})$/i,
  /^https:\/\/search\.sigstore\.dev\/\?hash=sha256:([a-f0-9]{64})$/i,
];

/** Whether the attestation the manifest links is of this very file. */
export function isAttested(file: Download): boolean {
  return attestationURLs.some(
    (pattern) =>
      pattern.exec(file.attestation ?? "")?.[1]?.toLowerCase() ===
      file.sha256.toLowerCase()
  );
}

/** The file's attestation in Sigstore's public log, if the manifest links it. */
export function attestationLog(file: Download): string | undefined {
  return isAttested(file) &&
    file.attestation!.startsWith("https://search.sigstore.dev/")
    ? file.attestation
    : undefined;
}

export interface Check {
  /** What it checks, e.g. "Apple notarization and signer". */
  title: string;
  /** What the tool does with it. Text in backticks is code. */
  note?: string;
  /** A shell command. For a file, run in the folder that holds it. */
  command?: string;
  /** How to read the result. Text in backticks is output or a command. */
  outcome: string;
  /** The value the result should match, shown below the outcome, which
   * names it ("Expected hash:"). */
  expected?: string;
  /** Where to see the same evidence without running anything. */
  link?: { text: string; url: string };
}

/**
 * Checks an attestation that release-tools signed itself, with the public key
 * that this website serves rather than one from the download site. cosign reads
 * the bundle from a file only, and a file over 128 MiB only with a higher
 * COSIGN_MAX_ATTACHMENT_SIZE.
 */
function bundleCheck(
  file: Download,
  bundle: string,
  link: Check["link"]
): Check {
  // The name curl -O gives it.
  const saved = quote(
    decodeURIComponent(new URL(bundle).pathname.split("/").pop()!)
  );
  // macOS has no wget, Ubuntu's desktop install no curl.
  const fetch =
    file.platform === "macOS"
      ? `curl -fsSLO ${quote(bundle)}`
      : `wget -qO ${saved} ${quote(bundle)}`;
  return {
    title: "Build attestation",
    command: [
      fetch,
      `COSIGN_MAX_ATTACHMENT_SIZE=1G cosign verify-blob-attestation --key ${quote(attestationKeyURL)} --bundle ${saved} --type slsaprovenance1 ${quote(file.name)}`,
    ].join("\n"),
    outcome: "Should print `Verified OK`.",
    link,
  };
}

export function verification(file: Download): Check[] {
  const name = quote(file.name);
  // shasum ships with every macOS release; sha256sum with every Linux one.
  const hasher = file.platform === "macOS" ? "shasum -a 256" : "sha256sum";
  const checks: Check[] = [
    {
      title: "SHA-256",
      command: `${hasher} ${name}`,
      outcome: "Expected hash:",
      expected: file.sha256,
    },
  ];
  if (file.platform === "macOS" && /\.dmg$/i.test(file.name)) {
    // Notarized by Apple, and signed with Ladybird's Developer ID: a file
    // that another developer had notarized fails.
    const requirement = `notarized and anchor apple generic and certificate leaf[subject.OU] = "${appleTeamID}"`;
    checks.push({
      title: "Apple notarization and signer",
      command: `codesign --verify -v -R=${quote(requirement)} ${name}`,
      outcome: "Should print `explicit requirement satisfied`.",
    });
  }
  if (isAttested(file)) {
    const log = attestationLog(file);
    const link = log ? { text: "Sigstore log entry", url: log } : undefined;
    checks.push(
      file.attestation_bundle
        ? bundleCheck(file, file.attestation_bundle, link)
        : {
            // Attested by GitHub's build workflow.
            title: "Build attestation",
            command: `gh attestation verify ${name} --repo ${quote(repository)}`,
            outcome: "Should print `Verification succeeded!`.",
            link,
          }
    );
  }
  return checks;
}

// A key file, linked by its name, e.g. "ladybird.asc".
const keyLink = (url: string) => ({
  text: new URL(url).pathname.split("/").pop() || url,
  url,
});

// Commands for Linux use wget and gpg, which Ubuntu and Fedora Workstation both
// install by default (curl is missing from Ubuntu's desktop install). macOS
// has curl and no wget.

export function flatpakKeyCheck(
  flatpak: NonNullable<Release["repositories"]["flatpak"]>
): Check {
  return {
    title: "Signing key",
    link: keyLink(flatpak.flatpakrepo),
    note: "Flatpak saves this key when it adds the repository.",
    // The key in the .flatpakref that the install command uses.
    command: `wget -qO- ${quote(flatpak.flatpakref)} | sed -n 's/^GPGKey=//p' | base64 -d | gpg --show-keys`,
    outcome: "Expected fingerprint:",
    expected: signingKeys.flatpak,
  };
}

export function aptKeyCheck(
  apt: NonNullable<Release["repositories"]["apt"]>
): Check {
  return {
    title: "Signing key",
    link: keyLink(apt.key),
    note: "APT verifies the repository with this key. Check it after saving it, before `apt update`.",
    command: `gpg --show-keys ${aptKeyring}`,
    outcome: "Expected fingerprint:",
    expected: signingKeys.apt,
  };
}

export function rpmKeyCheck(
  rpm: NonNullable<Release["repositories"]["rpm"]>
): Check {
  return {
    title: "Signing key",
    link: keyLink(rpm.key),
    note: "DNF shows its fingerprint when it asks to import this key on first install.",
    outcome: "Expected fingerprint:",
    expected: signingKeys.rpm,
  };
}

export function flatpakCommand(
  flatpak: NonNullable<Release["repositories"]["flatpak"]>
): string {
  return `flatpak install --user ${quote(flatpak.flatpakref)}`;
}

export function aptCommands(
  apt: NonNullable<Release["repositories"]["apt"]>,
  system: AptSystem
): string {
  // A key added by hand belongs in /etc/apt/keyrings (see sources.list(5)),
  // which the apt package creates. The repository's .sources files name this
  // path in Signed-By.
  return [
    `sudo wget -qO ${aptKeyring} ${quote(apt.key)}`,
    `sudo wget -qO /etc/apt/sources.list.d/ladybird.sources ${quote(system.sources)}`,
    `sudo apt update && sudo apt install ${apt.package}`,
  ].join("\n");
}

export function rpmCommands(
  rpm: NonNullable<Release["repositories"]["rpm"]>
): string {
  return [
    // DNF5's config-manager checks the file before saving it to the repository directory.
    `sudo dnf config-manager addrepo --from-repofile=${quote(rpm.repository)}`,
    `sudo dnf install ${rpm.package}`,
  ].join("\n");
}

export function isMobile(userAgent: string): boolean {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent);
}

export function detectPlatform(userAgent: string): string | undefined {
  if (isMobile(userAgent)) return undefined;
  if (/Macintosh|Mac OS X/i.test(userAgent)) return "macOS";
  if (/Windows/i.test(userAgent)) return "Windows";
  if (/Linux|X11/i.test(userAgent)) return "Linux";
  return undefined;
}

export function formatDate(published: string): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(published));
}
