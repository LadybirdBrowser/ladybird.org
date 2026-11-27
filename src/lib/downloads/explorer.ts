import { desktopUserAgent, loadReleases } from "./client";
import {
  appImages,
  aptChoices,
  aptCommands,
  aptKeyCheck,
  architectureLabel,
  architectureList,
  architectureSet,
  detectArchitecture,
  detectPlatform,
  downloadsFor,
  flatpakCommand,
  flatpakKeyCheck,
  formatDate,
  hasLinux,
  linuxArchitectures,
  macMinimum,
  normalizeArchitecture,
  isMobile,
  otherDownloads,
  rpmCommands,
  rpmKeyCheck,
  sizeLabel,
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
    field(item, "links").replaceChildren(
      ...(check.links ?? []).map(({ text, url }) => {
        const anchor = link(document.createElement("a"), url);
        anchor.className = "verify__link";
        anchor.textContent = text;
        return anchor;
      })
    );
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

  /**
   * A row of a file list: the file, as the link that downloads it, its
   * size, and its checks, which link its signature if it has one.
   */
  function fileRow(file: Download): DocumentFragment {
    const fragment = instantiate("file");
    const anchor = link(field<HTMLAnchorElement>(fragment, "link"), file.url);
    anchor.textContent = file.name;
    field(fragment, "size").textContent = sizeLabel(file.size);
    const { trigger, details } = verify(file);
    field(fragment, "verify").append(trigger);
    fragment.firstElementChild!.append(details);
    return fragment;
  }

  // ---- Architecture ----

  // The visitor's CPU, which every architecture picker shows chosen. A choice
  // in one picker goes for all of them, which are all about one computer.
  const agent = desktopUserAgent();
  let architecture = detectArchitecture(agent);
  let architectureChosen = false;
  const pickers = new Map<string, (architecture?: string) => void>();

  function chooseArchitecture(chosen: string | undefined) {
    architecture = chosen;
    pickers.forEach((select) => select(chosen));
  }

  // Chromium tells its CPU only when asked. Its answer counts unless the
  // visitor chose already.
  (
    navigator as Navigator & {
      userAgentData?: {
        getHighEntropyValues(
          hints: string[]
        ): Promise<{ architecture?: string; bitness?: string }>;
      };
    }
  ).userAgentData
    ?.getHighEntropyValues(["architecture", "bitness"])
    .then((values) => {
      if (!architectureChosen)
        chooseArchitecture(detectArchitecture(agent, values) ?? architecture);
    })
    .catch(() => {});

  const matches = (file: Download, chosen: string) =>
    normalizeArchitecture(file.architecture ?? "") === chosen;

  /**
   * Fills a picker with the CPUs of the files, and shows what goes with the
   * chosen one: the visitor's, or else the first. A picker with one CPU to
   * choose from stays hidden.
   */
  function architecturePicker(
    name: string,
    files: Download[],
    show: (architecture: string) => void
  ) {
    const picker = slot(name);
    const choices = architectureSet(
      files.map((file) => file.architecture ?? "").filter(Boolean)
    );
    picker.hidden = choices.length < 2;
    picker.querySelectorAll("label").forEach((each) => each.remove());
    const inputs = choices.map((choice) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = name;
      input.value = choice;
      input.addEventListener("change", () => {
        architectureChosen = true;
        chooseArchitecture(choice);
      });
      label.append(input, architectureLabel(choice, "Linux"));
      picker.append(label);
      return input;
    });
    function select(wanted?: string) {
      const input = inputs.find((each) => each.value === wanted) ?? inputs[0];
      if (input) input.checked = true;
      show(input?.value ?? "");
    }
    pickers.set(name, select);
    select(architecture);
  }

  // ---- Sections ----

  function primaryButton(url: string, label: string): HTMLAnchorElement {
    const button = link(document.createElement("a"), url);
    button.className = "btn btn--primary";
    button.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11m-5-5 5 5 5-5M5 20h14"/></svg>`;
    button.append(label);
    return button;
  }

  /**
   * One download button for the AppImage of one CPU, which a picker chooses
   * if there are several. The button shows the file's size, and its one
   * Verification toggle shows the checks of the file that it downloads.
   */
  function renderAppImages(images: Download[]) {
    const actions = slot("appimage-actions");
    const panels = slot("appimage-verify");

    let open = false;
    function show(file: Download) {
      const { trigger, details } = verify(file);
      // The checks stay open when another CPU is chosen, now for its file.
      trigger.addEventListener("click", () => (open = !details.hidden));
      if (open) {
        details.hidden = false;
        trigger.setAttribute("aria-expanded", "true");
      }
      const meta = document.createElement("span");
      meta.className = "method__meta";
      meta.textContent = sizeLabel(file.size);
      // The size and the toggle share a line, beside the button or, on a
      // narrow screen, below it.
      const info = document.createElement("span");
      info.className = "method__info";
      info.append(meta, trigger);
      actions.replaceChildren(
        primaryButton(file.url, "Download AppImage"),
        info
      );
      panels.replaceChildren(details);
    }

    architecturePicker("appimage-architectures", images, (chosen) =>
      show(images.find((file) => matches(file, chosen)) ?? images[0]!)
    );
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
      const choices = aptChoices(apt.systems);
      choices.forEach(({ label: name, system }, index) => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "apt-suite";
        input.value = system.suite;
        input.checked = index === choices.length - 1;
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

    const images = appImages(release);
    method("appimage").hidden = !images.length;
    if (images.length) renderAppImages(images);

    const files = otherDownloads(release);
    method("other").hidden = !files.length;
    // Only the packages of the chosen CPU, so that the last row is the last
    // child, which the card draws no line below.
    const list = slot("linux-files");
    architecturePicker("linux-files-architectures", files, (chosen) =>
      list.replaceChildren(
        ...files
          .filter((file) => !file.architecture || matches(file, chosen))
          .map(fileRow)
      )
    );

    return true;
  }

  function renderSource(release: Release) {
    slot("source-files").replaceChildren(
      ...downloadsFor(release, "source").map(fileRow),
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
      ...libraries.map((library) => fileRow({ ...library, platform: "source" }))
    );
    return [group];
  }

  // ---- Platform switcher ----

  // Two rows of tabs: the platforms, and the ways to install on Linux. A tab
  // switches between the tabs of its own row.
  const tabs = Array.from(
    root.querySelectorAll<HTMLButtonElement>('[role="tab"]')
  );
  const panelFor = (tab: HTMLElement) =>
    find(`#${tab.getAttribute("aria-controls")}`);
  const rowOf = (tab: HTMLElement) =>
    tabs.filter((each) => each.parentElement === tab.parentElement);
  const linuxTab = find<HTMLButtonElement>("#tab-linux");

  function select(tab: HTMLButtonElement, focus = false, remember = false) {
    for (const each of rowOf(tab)) {
      const selected = each === tab;
      each.setAttribute("aria-selected", String(selected));
      each.tabIndex = selected ? 0 : -1;
      panelFor(each).hidden = !selected;
    }
    reveal(tab);
    if (focus) tab.focus();
    if (remember)
      history.replaceState(null, "", `#${tab.getAttribute("aria-controls")}`);
  }

  /**
   * Scrolls a row that scrolls sideways to show the whole tab, without
   * scrolling the page as scrollIntoView() would. A hidden row has no size,
   * so this waits until it shows.
   */
  function reveal(tab: HTMLElement) {
    const list = tab.parentElement!;
    const row = list.getBoundingClientRect();
    const box = tab.getBoundingClientRect();
    if (box.right > row.right) list.scrollLeft += box.right - row.right;
    else if (box.left < row.left) list.scrollLeft -= row.left - box.left;
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => select(tab, false, true));
    tab.addEventListener("keydown", (event: KeyboardEvent) => {
      const visible = rowOf(tab).filter((each) => !each.hidden);
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

  // A way to install counts only while the release is available for Linux.
  function tabFromHash(): HTMLButtonElement | undefined {
    const id = location.hash.slice(1);
    return tabs.find(
      (tab) =>
        !tab.hidden &&
        !(tab.dataset["method"] && linuxTab.hidden) &&
        tab.getAttribute("aria-controls") === id
    );
  }

  // A way to install, e.g. #linux-appimage, shows on the Linux tab.
  function show(tab: HTMLButtonElement) {
    if (tab.dataset["method"]) select(linuxTab);
    select(tab);
  }

  window.addEventListener("hashchange", () => {
    const tab = tabFromHash();
    if (tab) show(tab);
  });

  // ---- Start ----

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
    linuxTab.hidden = !renderLinux(latest);
    renderSource(latest);
    // The first way to install, Flatpak, unless the release has none.
    const method = tabs.find((tab) => tab.dataset["method"] && !tab.hidden);
    if (method) select(method);
    const available = tabs.filter(
      (tab) => tab.dataset["platform"] && !tab.hidden
    );
    const detected = available.find(
      (tab) => tab.dataset["platform"] === platform
    );
    const initial = tabFromHash() ?? detected ?? available[0];
    if (initial) show(initial);
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
      const method = root.querySelector<HTMLElement>(
        '.method-tabs [aria-selected="true"]'
      );
      if (method) reveal(method);
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
