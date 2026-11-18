import { test, expect, describe } from "bun:test";
import { aptChoices, type AptSystem } from "../src/lib/downloads/releases";

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
