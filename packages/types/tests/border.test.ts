import { describe, expect, it } from "vitest";
import { toBorderCss } from "../src";
import type { BorderValue } from "../src";

describe("toBorderCss", () => {
  it("formats a border as a CSS shorthand", () => {
    expect(toBorderCss({ width: 2, style: "dashed", color: "#cccccc" })).toBe(
      "2px dashed #cccccc",
    );
  });

  it("returns null when the border is absent", () => {
    expect(toBorderCss(undefined)).toBeNull();
  });

  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
    "returns null for a width of %s",
    (width) => {
      const border: BorderValue = { width, style: "solid", color: "#000000" };
      expect(toBorderCss(border)).toBeNull();
    },
  );
});
