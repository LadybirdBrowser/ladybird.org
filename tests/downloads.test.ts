import { test, expect, describe } from "bun:test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import {
  aptChoices,
  hasLinux,
  linuxArchitectures,
  otherDownloads,
  parseManifest,
  sizeLabel,
  verification,
  type AptSystem,
  type Download,
  type Release,
} from "../src/lib/downloads/releases";
import { aptKeyURL, rpmKeyURL, signingKeys } from "../src/lib/downloads/config";

function ubuntu(version: string, suite: string): AptSystem {
  return {
    system: `Ubuntu ${version}`,
    id: "ubuntu",
    version_id: version,
    suite,
    sources: `https://apt.ladybird.org/ladybird-${suite}.sources`,
    architectures: ["amd64", "arm64"],
  };
}

const labels = (systems: AptSystem[]) =>
  aptChoices(systems).map((choice) => [choice.label, choice.system.suite]);

describe("Ubuntu choices", () => {
  test("The newest suite stands for the versions after it", () => {
    expect(
      labels([
        ubuntu("24.04", "noble"),
        ubuntu("26.04", "resolute"),
        ubuntu("26.10", "resolute"),
      ])
    ).toEqual([
      ["Ubuntu 24.04", "noble"],
      ["Ubuntu 26.04+", "resolute"],
    ]);
  });

  test("Versions with suites of their own stay apart", () => {
    expect(
      labels([ubuntu("26.04", "resolute"), ubuntu("26.10", "stonking")])
    ).toEqual([
      ["Ubuntu 26.04", "resolute"],
      ["Ubuntu 26.10", "stonking"],
    ]);
  });

  test("An older shared suite names its range", () => {
    expect(
      labels([
        ubuntu("24.04", "noble"),
        ubuntu("24.10", "noble"),
        ubuntu("26.04", "resolute"),
      ])
    ).toEqual([
      ["Ubuntu 24.04–24.10", "noble"],
      ["Ubuntu 26.04", "resolute"],
    ]);
  });

  test("Versions with other CPUs stay apart", () => {
    const fewer = { ...ubuntu("26.10", "resolute"), architectures: ["amd64"] };
    expect(labels([ubuntu("26.04", "resolute"), fewer])).toEqual([
      ["Ubuntu 26.04", "resolute"],
      ["Ubuntu 26.10", "resolute"],
    ]);
  });
});

const digest = "a".repeat(64);
const base = "https://apt.ladybird.org/pool/main/l/ladybird/";

function download(changes: Partial<Download>): Download {
  return {
    platform: "Linux",
    architecture: "x86_64",
    name: "file",
    url: "https://download.ladybird.org/file",
    size: 1,
    sha256: digest,
    ...changes,
  };
}

const deb = download({
  name: "ladybird_2026.48.0-1~ubuntu24.04_amd64.deb",
  url: `${base}ladybird_2026.48.0-1~ubuntu24.04_amd64.deb`,
  signature: `${base}ladybird_2026.48.0-1~ubuntu24.04_amd64.deb.asc`,
  attestation: `https://search.sigstore.dev/?hash=sha256:${digest}`,
});
const appImage = download({
  architecture: "aarch64",
  name: "ladybird-2026.48.0-Linux-aarch64.AppImage",
});
const source = download({ platform: "source", architecture: undefined });
const mac = download({ platform: "macOS", architecture: "arm64" });

function release(downloads: Download[]): Release {
  return {
    version: "2026.48.0",
    published: "2026-11-24T00:00:00Z",
    downloads,
    thirdPartySources: [],
    repositories: {},
  };
}

describe("Other downloads", () => {
  test("Every file that no other part of the page shows is listed", () => {
    expect(
      otherDownloads(release([mac, source, deb, appImage])).map(
        (file) => file.name
      )
    ).toEqual([deb.name, appImage.name]);
  });

  test("A release with nothing else lists nothing", () => {
    expect(otherDownloads(release([mac, source]))).toEqual([]);
  });

  test("Sizes are written the way Finder writes them", () => {
    expect(sizeLabel(512)).toBe("512 bytes");
    expect(sizeLabel(82_833_380)).toBe("82.8 MB");
    expect(sizeLabel(154_044_052)).toBe("154 MB");
    expect(sizeLabel(1_500_000_000)).toBe("1.5 GB");
  });

  test("A file with a signature has a check with the key that made it", () => {
    const check = verification(deb).find(
      (each) => each.title === "OpenPGP signature"
    )!;
    expect(check.expected).toBe(signingKeys.apt);
    expect(check.links).toEqual([
      { text: "Signature", url: deb.signature! },
      { text: "ladybird-apt.asc", url: aptKeyURL },
    ]);
    expect(check.command).toContain(`wget -qO- '${aptKeyURL}' | gpg --import`);
    expect(check.command).toContain(`gpg --verify '${deb.name}.asc'`);
    expect(check.command).toContain(`'${deb.signature}'`);
  });

  test("An RPM has a check of the signature inside it", () => {
    const rpm = download({ name: "ladybird-2026.48.0-1.fc44.x86_64.rpm" });
    const check = verification(rpm).find(
      (each) => each.title === "RPM signature"
    )!;
    expect(check.links).toEqual([
      { text: "RPM-GPG-KEY-ladybird", url: rpmKeyURL },
    ]);
    expect(check.command).toContain(
      "sudo rpmkeys --import 'RPM-GPG-KEY-ladybird'"
    );
    expect(check.command).toContain(
      `rpmkeys --checksig --verbose '${rpm.name}'`
    );
    expect(check.expected).toBe(signingKeys.rpm.toLowerCase());
  });

  test("A file without a signature has no such check", () => {
    expect(verification(appImage).map((each) => each.title)).toEqual([
      "SHA-256",
    ]);
  });

  test("Downloads of the release alone do not make it available for Linux", () => {
    expect(hasLinux(release([deb, appImage]))).toBe(false);
    expect(linuxArchitectures(release([deb])).all).toEqual([]);
  });
});

const hash = "b".repeat(64);

function manifest(releases: unknown[]) {
  return { format: 1, releases };
}

function entry(version: string, changes: Record<string, unknown> = {}) {
  return {
    version,
    published: "2026-11-24T00:00:00Z",
    downloads: [],
    repositories: {},
    ...changes,
  };
}

describe("Release manifest", () => {
  test("Releases come newest first, whatever the order in the file", () => {
    const parsed = parseManifest(
      manifest([entry("2026.9.1"), entry("2026.47.7"), entry("2026.10.0")])
    );
    expect(parsed.releases.map((each) => each.version)).toEqual([
      "2026.47.7",
      "2026.10.0",
      "2026.9.1",
    ]);
  });

  test("Downloads keep what the manifest says about them", () => {
    const [parsed] = parseManifest(
      manifest([
        entry("2026.47.7", {
          downloads: [
            {
              platform: "macOS",
              architecture: "arm64",
              name: "ladybird.dmg",
              url: "https://download.ladybird.org/ladybird.dmg",
              size: 5,
              sha256: hash,
              attestation: `https://search.sigstore.dev/?hash=sha256:${hash}`,
              attestation_bundle: "https://download.ladybird.org/b.json",
              signature: "https://download.ladybird.org/ladybird.dmg.asc",
              minimum_macos_version: "14.4",
            },
            {
              platform: "source",
              name: "source.tar.xz",
              url: "https://download.ladybird.org/source.tar.xz",
              size: 7,
              sha256: hash,
            },
          ],
        }),
      ])
    ).releases;
    expect(parsed!.downloads[0]).toEqual({
      platform: "macOS",
      architecture: "arm64",
      name: "ladybird.dmg",
      url: "https://download.ladybird.org/ladybird.dmg",
      size: 5,
      sha256: hash,
      attestation: `https://search.sigstore.dev/?hash=sha256:${hash}`,
      attestation_bundle: "https://download.ladybird.org/b.json",
      signature: "https://download.ladybird.org/ladybird.dmg.asc",
      minimum_macos_version: "14.4",
    });
    expect(parsed!.downloads[1]).toEqual({
      platform: "source",
      architecture: undefined,
      name: "source.tar.xz",
      url: "https://download.ladybird.org/source.tar.xz",
      size: 7,
      sha256: hash,
      attestation: undefined,
      attestation_bundle: undefined,
      signature: undefined,
      minimum_macos_version: undefined,
    });
    expect(parsed!.thirdPartySources).toEqual([]);
  });

  test("The repositories of a release are read as they are", () => {
    const [parsed] = parseManifest(
      manifest([
        entry("2026.47.7", {
          repositories: {
            apt: {
              key: "https://apt.ladybird.org/ladybird.asc",
              package: "ladybird",
              systems: [
                {
                  system: "Ubuntu 24.04",
                  id: "ubuntu",
                  version_id: "24.04",
                  suite: "noble",
                  sources: "https://apt.ladybird.org/ladybird-noble.sources",
                  architectures: ["amd64"],
                },
              ],
            },
            rpm: {
              key: "https://rpm.ladybird.org/key",
              repository: "https://rpm.ladybird.org/ladybird.repo",
              package: "ladybird",
              systems: [
                {
                  system: "Fedora 44",
                  id: "fedora",
                  version_id: "44",
                  architectures: ["x86_64"],
                },
              ],
            },
            flatpak: {
              flatpakref: "https://flatpak.ladybird.org/ladybird.flatpakref",
              flatpakrepo: "https://flatpak.ladybird.org/ladybird.flatpakrepo",
              architectures: ["x86_64", "aarch64"],
            },
          },
          third_party_sources: [
            {
              name: "ffmpeg-9.0.2-0123456789ab.tar",
              url: "https://download.ladybird.org/third-party/ffmpeg.tar",
              size: 3,
              sha256: hash,
            },
          ],
        }),
      ])
    ).releases;
    expect(parsed!.repositories.apt!.systems[0]).toEqual({
      system: "Ubuntu 24.04",
      id: "ubuntu",
      version_id: "24.04",
      suite: "noble",
      sources: "https://apt.ladybird.org/ladybird-noble.sources",
      architectures: ["amd64"],
    });
    expect(parsed!.repositories.rpm!.systems[0]!.system).toBe("Fedora 44");
    expect(parsed!.repositories.flatpak!.architectures).toEqual([
      "x86_64",
      "aarch64",
    ]);
    expect(parsed!.thirdPartySources.map((each) => each.name)).toEqual([
      "ffmpeg-9.0.2-0123456789ab.tar",
    ]);
  });

  test("Anything that could end up in a shell command or a link is refused", () => {
    const download = (changes: Record<string, unknown>) =>
      manifest([
        entry("2026.47.7", {
          downloads: [
            {
              platform: "Linux",
              name: "file",
              url: "https://download.ladybird.org/file",
              size: 1,
              sha256: hash,
              ...changes,
            },
          ],
        }),
      ]);
    expect(() => parseManifest(download({}))).not.toThrow();
    expect(() => parseManifest(download({ name: "a/b" }))).toThrow();
    expect(() => parseManifest(download({ name: ".hidden" }))).toThrow();
    expect(() =>
      parseManifest(download({ url: "http://example.org/f" }))
    ).toThrow();
    expect(() =>
      parseManifest(download({ url: "https://user@example.org/f" }))
    ).toThrow();
    expect(() => parseManifest(download({ sha256: "abc" }))).toThrow();
    expect(() => parseManifest(download({ size: -1 }))).toThrow();
    expect(() =>
      parseManifest(download({ signature: "http://example.org/f.asc" }))
    ).toThrow();
    expect(() =>
      parseManifest(download({ minimum_macos_version: "14.x" }))
    ).toThrow();
  });

  test("A malformed document is refused", () => {
    expect(() => parseManifest({ format: 2, releases: [] })).toThrow();
    expect(() => parseManifest(manifest([entry("2026.x")]))).toThrow();
    expect(() =>
      parseManifest(manifest([entry("2026.47.7", { published: "never" })]))
    ).toThrow();
    expect(() =>
      parseManifest(manifest([entry("2026.47.7"), entry("2026.47.7")]))
    ).toThrow("Duplicate release versions.");
  });
});

/** The fingerprint of the first key in an armored OpenPGP v4 public key. */
function fingerprint(armored: string): string {
  const body = armored
    .split("\n")
    .filter(
      (line) => line && !line.startsWith("-----") && !line.startsWith("=")
    )
    .join("");
  const packets = Buffer.from(body, "base64");
  const tag = packets[0]!;
  let length: number;
  let start: number;
  if (tag & 0x40) {
    // The new packet format: a length of one or two bytes.
    const first = packets[1]!;
    [length, start] =
      first < 192 ? [first, 2] : [((first - 192) << 8) + packets[2]! + 192, 3];
  } else {
    // The old packet format, as gpg writes it: the low bits say how long the
    // length is.
    [length, start] =
      (tag & 3) === 0 ? [packets[1]!, 2] : [packets.readUInt16BE(1), 3];
  }
  const key = packets.subarray(start, start + length);
  const header = Buffer.from([0x99, key.length >> 8, key.length & 0xff]);
  return createHash("sha1")
    .update(Buffer.concat([header, key]))
    .digest("hex")
    .toUpperCase();
}

describe("Signing keys", () => {
  test.each([
    ["ladybird-apt.asc", signingKeys.apt],
    ["RPM-GPG-KEY-ladybird", signingKeys.rpm],
  ])("The website serves %s with the fingerprint it pins", (file, pinned) => {
    const key = readFileSync(
      new URL(`../public/keys/${file}`, import.meta.url),
      "utf8"
    );
    expect(fingerprint(key)).toBe(pinned);
  });
});
