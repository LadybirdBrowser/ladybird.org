import { desktopUserAgent, loadReleases } from "./client";
import { releaseTagURL } from "./config";
import {
  aptChoices,
  aptCommands,
  aptKeyCheck,
  architectureLabel,
  architectureList,
  architectureSet,
  detectPlatform,
  downloadsFor,
  flatpakCommand,
  flatpakKeyCheck,
  formatDate,
  hasLinux,
  linuxArchitectures,
  macMinimum,
  isMobile,
  rpmCommands,
  rpmKeyCheck,
  verification,
  type Check,
  type Download,
  type Manifest,
  type Release,
} from "./releases";

const root = document.querySelector<HTMLElement>("[data-downloads]");
if (root) setUp(root);

function setUp(root: HTMLElement) {
  function find<T extends HTMLElement = HTMLElement>(
    selector: string,
    scope: ParentNode = root
  ): T {
    const result = scope.querySelector<T>(selector);
    if (!result) throw new Error(`Missing download element: ${selector}`);
    return result;
  }
  const slot = (name: string) => find(`[data-slot="${name}"]`);
  const field = <T extends HTMLElement = HTMLElement>(
    scope: ParentNode,
    name: string
  ) => find<T>(`[data-field="${name}"]`, scope);

  function instantiate(name: string): DocumentFragment {
    const template = find<HTMLTemplateElement>(`[data-template="${name}"]`);
    return template.content.cloneNode(true) as DocumentFragment;
  }

  // ---- Feedback ----

  const toast = find("[data-toast]");
  let toastTimer: number | undefined;
  function notify(message: string) {
    toast.textContent = message;
    toast.dataset["visible"] = "";
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      delete toast.dataset["visible"];
    }, 3000);
  }

  function copyButton(button: HTMLButtonElement, text: string, what: string) {
    const label = button.textContent ?? "Copy";
    button.setAttribute("aria-label", `Copy ${what}`);
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(text);
        button.textContent = "Copied";
        button.dataset["copied"] = "";
        notify(`Copied ${what}`);
        setTimeout(() => {
          button.textContent = label;
          delete button.dataset["copied"];
        }, 2000);
      } catch {
        notify("Couldn’t access the clipboard. Select the text to copy it.");
      }
    });
  }

  function link(anchor: HTMLAnchorElement, url: string) {
    anchor.href = url;
    return anchor;
  }

  // ---- Building blocks ----

  /**
   * Shows commands one per line, each after a prompt. A long command wraps
   * between its arguments, and a path or URL after a slash, never at a hyphen
   * inside a name, with later lines indented past the prompt. Only the shown
   * text changes: Copy copies the commands as they are.
   */
  function showCommands(code: HTMLElement, text: string) {
    code.replaceChildren(
      ...text.split("\n").map((line) => {
        const block = document.createElement("span");
        block.className = "command__line";
        block.append(
          ...line.split(" ").flatMap((word, index) => {
            const span = document.createElement("span");
            span.className = "command__word";
            // A path or URL breaks after a slash: each piece between slashes
            // is a box of its own too.
            const pieces = word.split(/(?<=\/)(?!\/)/);
            if (pieces.length === 1) span.textContent = word;
            else
              span.append(
                ...pieces.map((piece) => {
                  const box = document.createElement("span");
                  box.className = "command__piece";
                  box.textContent = piece;
                  return box;
                })
              );
            return index ? [" ", span] : [span];
          })
        );
        return block;
      })
    );
  }

  function command(
    text: string,
    title: string,
    what: string
  ): DocumentFragment {
    const fragment = instantiate("command");
    field(fragment, "title").textContent = title;
    showCommands(field(fragment, "code"), text);
    copyButton(field<HTMLButtonElement>(fragment, "copy"), text, what);
    return fragment;
  }

  // ---- Verification ----

  let verifyCount = 0;

  /**
   * A quiet "Verification" toggle. Its details expand underneath, wherever the
   * caller puts them: below a button, a card's footer, a file row, or a table
   * row.
   */
  function disclosure(
    details: HTMLElement,
    label: string
  ): { trigger: HTMLButtonElement; details: HTMLElement } {
    const trigger = field<HTMLButtonElement>(
      instantiate("verify-trigger"),
      "trigger"
    );
    trigger.setAttribute("aria-label", label);
    details.id = `verify-${++verifyCount}`;
    details.hidden = true;
    trigger.setAttribute("aria-controls", details.id);
    trigger.setAttribute("aria-expanded", "false");
    trigger.addEventListener("click", () => {
      const open = details.hidden;
      details.hidden = !open;
      trigger.setAttribute("aria-expanded", String(open));
    });
    return { trigger, details };
  }

  /** Text with commands and output in backticks, which become code. */
  function withCode(element: HTMLElement, text: string) {
    text.split("`").forEach((part, index) => {
      if (index % 2 === 0) return element.append(part);
      const code = document.createElement("code");
      code.textContent = part;
      element.append(code);
    });
  }

  /** One check: what it checks, the command, and how to read the result. */
  function checkItem(check: Check, subject: string) {
    const item = instantiate("verify-check");
    field(item, "title").textContent = check.title;
    if (check.note) {
      field(item, "note").hidden = false;
      withCode(field(item, "note"), check.note);
    }
    if (check.command) {
      field(item, "command-row").hidden = false;
      showCommands(field(item, "command"), check.command);
      // Named after the tool that checks, on the last line, e.g. "codesign"
      // or "gh attestation verify", after any variables it is given.
      const words = check.command
        .split("\n")
        .at(-1)!
        .split(" ")
        .filter((word) => !/^[A-Z_]+=/.test(word));
      const tool = words
        .slice(
          0,
          words.findIndex((word) => /^[-'/]/.test(word))
        )
        .join(" ");
      copyButton(
        field<HTMLButtonElement>(item, "command-copy"),
        check.command,
        `${tool || words[0]} command for ${subject}`
      );
    }
    withCode(field(item, "outcome"), check.outcome);
    if (check.expected) {
      field(item, "expected").hidden = false;
      field(item, "expected-text").textContent = check.expected;
      copyButton(
        field<HTMLButtonElement>(item, "expected-copy"),
        check.expected,
        `${check.outcome.replace(/:$/, "").toLowerCase()} for ${subject}`
      );
    }
    if (check.link) {
      const anchor = link(
        field<HTMLAnchorElement>(item, "link"),
        check.link.url
      );
      anchor.textContent = check.link.text;
      anchor.hidden = false;
    }
    return item;
  }

  /** A panel of checks, for a file or for a repository. */
  function checksPanel(checks: Check[], subject: string, file?: string) {
    const fragment = instantiate("verify-file");
    if (file) field(fragment, "file").textContent = file;
    else field(fragment, "file").remove();
    field(fragment, "checks").replaceChildren(
      ...checks.map((check) => checkItem(check, subject))
    );
    return disclosure(
      field(fragment, "details"),
      `Verification for ${subject}`
    );
  }

  function verify(file: Download) {
    return checksPanel(verification(file), file.name, file.name);
  }

  /** The signing key a package manager verifies a repository with. */
  function verifyKey(name: string, what: string, check: Check) {
    const { trigger, details } = checksPanel([check], what);
    slot(`${name}-verify`).replaceChildren(details);
    return trigger;
  }

  function fileRow(file: Download, label: string): DocumentFragment {
    const fragment = instantiate("file");
    field(fragment, "label").textContent = label;
    field(fragment, "meta").textContent = file.name;
    link(field<HTMLAnchorElement>(fragment, "link"), file.url).setAttribute(
      "aria-label",
      `Download ${file.name}`
    );
    const { trigger, details } = verify(file);
    field(fragment, "verify").append(trigger);
    fragment.firstElementChild!.append(details);
    return fragment;
  }

  // ---- Sections ----

  function primaryButton(url: string, label: string): HTMLAnchorElement {
    const button = link(document.createElement("a"), url);
    button.className = "btn btn--primary";
    button.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11m-5-5 5 5 5-5M5 20h14"/></svg>`;
    button.append(label);
    return button;
  }

  function renderMac(release: Release): boolean {
    const files = downloadsFor(release, "macOS");
    if (!files.length) return false;
    const chips = architectureList(
      files.map((file) => file.architecture ?? ""),
      "macOS"
    );
    const mac = files.every((file) => file.architecture)
      ? `a Mac with ${chips === "Intel" ? "an Intel processor" : chips}`
      : "";
    const minimum = macMinimum(files);
    const system = minimum ? `macOS ${minimum} or later` : "";
    slot("mac-requirement").textContent =
      system && mac
        ? `Ladybird for macOS requires ${system} on ${mac}.`
        : system || mac
          ? `Ladybird for macOS requires ${system || mac}.`
          : "Ladybird is available for macOS.";
    const actions = slot("mac-actions");
    const panels = slot("mac-verify");
    actions.replaceChildren();
    panels.replaceChildren();
    for (const file of files) {
      const { trigger, details } = verify(file);
      actions.append(
        primaryButton(
          file.url,
          files.length === 1
            ? "Download for macOS"
            : `Download for ${architectureLabel(file.architecture, "macOS")}`
        ),
        trigger
      );
      panels.append(details);
    }
    return true;
  }

  function renderLinux(release: Release): boolean {
    if (!hasLinux(release)) return false;
    const { flatpak, apt, rpm } = release.repositories;
    const method = (name: string) => find(`[data-method="${name}"]`);

    // Supported CPUs are stated once, in the intro. A card mentions them only
    // when it supports fewer than the others, e.g. "x86-64 only".
    const supported = linuxArchitectures(release);
    slot("linux-requirement").textContent =
      `Ladybird for Linux is available for ${architectureList(supported.all, "Linux")}.`;
    const fewer = (architectures: string[]) =>
      !supported.uniform &&
      architectureSet(architectures).length < supported.all.length;
    const footer = (name: string, note: string, verify: HTMLButtonElement) => {
      slot(`${name}-foot`).replaceChildren(
        ...(note ? [document.createTextNode(note)] : []),
        verify
      );
    };
    const only = (architectures: string[]) =>
      fewer(architectures)
        ? `${architectureList(architectures, "Linux")} only`
        : "";

    method("flatpak").hidden = !flatpak;
    if (flatpak) {
      slot("flatpak-action").replaceChildren(
        primaryButton(flatpak.flatpakref, "Install with Flatpak")
      );
      slot("flatpak-command").replaceChildren(
        command(
          flatpakCommand(flatpak),
          "Or from a terminal",
          "Flatpak install command"
        )
      );
      footer(
        "flatpak",
        only(flatpak.architectures),
        verifyKey("flatpak", "Flatpak", flatpakKeyCheck(flatpak))
      );
    }

    method("apt").hidden = !apt?.systems.length;
    if (apt?.systems.length) {
      const versions = slot("apt-suites");
      const output = slot("apt-command");
      const key = verifyKey("apt", "Ubuntu packages", aptKeyCheck(apt));
      versions.querySelectorAll("label").forEach((each) => each.remove());
      aptChoices(apt.systems).forEach(({ label: name, system }, index) => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "apt-suite";
        input.value = system.suite;
        input.checked = index === 0;
        const show = () => {
          output.replaceChildren(
            command(
              aptCommands(apt, system),
              name,
              `install commands for ${name}`
            )
          );
          footer("apt", only(system.architectures), key);
        };
        input.addEventListener("change", show);
        if (input.checked) show();
        label.append(input, name.replace(/^Ubuntu\s+/, ""));
        versions.append(label);
      });
    }

    method("rpm").hidden = !rpm;
    if (rpm) {
      slot("rpm-command").replaceChildren(
        command(
          rpmCommands(rpm),
          new Intl.ListFormat("en").format(
            rpm.systems.map((system) => system.system)
          ),
          "Fedora install commands"
        )
      );
      // One package repository serves every Fedora version, so a version
      // with fewer CPUs is named, e.g. "Fedora 45: x86-64 only".
      const sets = new Set(
        rpm.systems.map((system) =>
          architectureSet(system.architectures).join()
        )
      );
      footer(
        "rpm",
        sets.size === 1
          ? only(rpm.systems[0]!.architectures)
          : rpm.systems
              .filter((system) => fewer(system.architectures))
              .map(
                (system) => `${system.system}: ${only(system.architectures)}`
              )
              .join("; "),
        verifyKey("rpm", "Fedora packages", rpmKeyCheck(rpm))
      );
    }

    const archives = downloadsFor(release, "Linux");
    method("archive").hidden = !archives.length;
    slot("linux-files").replaceChildren(
      ...archives.map((file) =>
        fileRow(file, architectureLabel(file.architecture, "Linux"))
      )
    );
    return true;
  }

  function renderSource(release: Release) {
    const files = downloadsFor(release, "source");
    slot("source-files").replaceChildren(
      ...files.map((file) => {
        const row = fileRow(file, `Ladybird ${release.version} source`);
        const tag = link(
          document.createElement("a"),
          releaseTagURL(release.version)
        );
        tag.className = "btn btn--outline btn--small";
        // The GitHub mark from /assets/img/github.svg, drawn in the text color.
        tag.innerHTML = `<svg width="16" height="16" viewBox="-5 -5 101 101" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"/></svg>`;
        tag.append("GitHub");
        tag.setAttribute(
          "aria-label",
          `View the ${release.version} release tag on GitHub`
        );
        field(row, "actions").prepend(tag);
        return row;
      }),
      ...thirdPartyRows(release)
    );
  }

  // The LGPL libraries go in one collapsed row: few people need their source.
  function thirdPartyRows(release: Release): DocumentFragment[] {
    const libraries = release.thirdPartySources;
    if (!libraries.length) return [];
    const group = instantiate("third-party");
    field(group, "count").textContent =
      libraries.length === 1 ? "1 archive" : `${libraries.length} archives`;
    field(group, "files").replaceChildren(
      ...libraries.map((library) =>
        // Named after the library, its version and a digest of what it holds.
        fileRow(
          { ...library, platform: "source" },
          library.name.replace(/-[0-9a-f]{12}\.tar$/, "")
        )
      )
    );
    return [group];
  }

  // ---- Platform switcher ----

  const tabs = Array.from(
    root.querySelectorAll<HTMLButtonElement>('[role="tab"]')
  );
  const panelFor = (tab: HTMLElement) =>
    find(`#${tab.getAttribute("aria-controls")}`);

  function select(tab: HTMLButtonElement, focus = false, remember = false) {
    for (const each of tabs) {
      const selected = each === tab;
      each.setAttribute("aria-selected", String(selected));
      each.tabIndex = selected ? 0 : -1;
      panelFor(each).hidden = !selected;
    }
    if (focus) tab.focus();
    if (remember)
      history.replaceState(null, "", `#${tab.getAttribute("aria-controls")}`);
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => select(tab, false, true));
    tab.addEventListener("keydown", (event: KeyboardEvent) => {
      const visible = tabs.filter((each) => !each.hidden);
      const position = visible.indexOf(tab);
      const target =
        event.key === "ArrowRight"
          ? visible[(position + 1) % visible.length]
          : event.key === "ArrowLeft"
            ? visible[(position - 1 + visible.length) % visible.length]
            : event.key === "Home"
              ? visible[0]
              : event.key === "End"
                ? visible.at(-1)
                : undefined;
      if (!target) return;
      event.preventDefault();
      select(target, true, true);
    });
  });

  function tabFromHash(): HTMLButtonElement | undefined {
    const id = location.hash.slice(1);
    return tabs.find(
      (tab) => !tab.hidden && tab.getAttribute("aria-controls") === id
    );
  }

  window.addEventListener("hashchange", () => {
    const tab = tabFromHash();
    if (tab) select(tab);
  });

  // ---- Start ----

  const agent = desktopUserAgent();
  const platform = detectPlatform(agent);
  const platformNotice = find("[data-platform-notice]");
  if (platform === "Windows" || isMobile(agent)) {
    platformNotice.hidden = false;
    platformNotice.textContent =
      platform === "Windows"
        ? "Ladybird isn’t available for Windows yet. Windows support is planned for a later stage."
        : "Ladybird runs on macOS and Linux computers. Visit this page from one of those to download it.";
  }

  function render(manifest: Manifest) {
    const [latest] = manifest.releases;
    if (!latest) throw new Error("No releases");
    slot("release-version").textContent = `Version ${latest.version}`;
    const date = slot("release-date");
    date.setAttribute("datetime", latest.published);
    date.textContent = formatDate(latest.published);
    find("#tab-macos").hidden = !renderMac(latest);
    find("#tab-linux").hidden = !renderLinux(latest);
    renderSource(latest);
    const available = tabs.filter((tab) => !tab.hidden);
    const detected = available.find(
      (tab) => tab.dataset["platform"] === platform
    );
    const initial = tabFromHash() ?? detected ?? available[0];
    if (initial) select(initial);
  }

  const loading = find("[data-loading]");
  const error = find("[data-error]");
  const content = find("[data-content]");

  async function initialize() {
    error.hidden = true;
    loading.hidden = false;
    root.setAttribute("aria-busy", "true");
    try {
      const manifest = await loadReleases();
      if (!manifest.releases.length) {
        loading.hidden = true;
        find("[data-empty]").hidden = false;
        return;
      }
      render(manifest);
      loading.hidden = true;
      content.hidden = false;
    } catch (reason) {
      console.error("Couldn’t show downloads:", reason);
      loading.hidden = true;
      error.hidden = false;
    } finally {
      root.removeAttribute("aria-busy");
    }
  }

  find("[data-retry]").addEventListener("click", () => void initialize());
  void initialize();
}
