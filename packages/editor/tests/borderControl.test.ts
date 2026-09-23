// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import type { BorderValue } from "@templatical/types";
import BorderControl from "../src/components/toolbar/BorderControl.vue";
import { mountEditor } from "./helpers/mount";

function mountIt(modelValue: BorderValue | undefined) {
  return mountEditor(BorderControl, {
    props: { modelValue, testidPrefix: "test" },
  });
}

function lastEmitted(
  wrapper: ReturnType<typeof mountIt>,
): BorderValue | undefined {
  const emitted = wrapper.emitted("update:modelValue")!;
  return emitted[emitted.length - 1][0] as BorderValue | undefined;
}

describe("BorderControl", () => {
  it("shows only the width input while there is no border", () => {
    const wrapper = mountIt(undefined);
    const input = wrapper.find('[data-testid="test-border-width-input"]');
    expect((input.element as HTMLInputElement).value).toBe("0");
    expect(wrapper.findAll("button")).toHaveLength(0);
  });

  it("fills in a solid black border the first time a width is entered", async () => {
    const wrapper = mountIt(undefined);
    await wrapper.find('[data-testid="test-border-width-input"]').setValue("2");

    expect(lastEmitted(wrapper)).toEqual({
      width: 2,
      style: "solid",
      color: "#000000",
    });
  });

  it("keeps the existing style and color when the width changes", async () => {
    const wrapper = mountIt({ width: 1, style: "dotted", color: "#ff0000" });
    await wrapper.find('[data-testid="test-border-width-input"]').setValue("4");

    expect(lastEmitted(wrapper)).toEqual({
      width: 4,
      style: "dotted",
      color: "#ff0000",
    });
  });

  it("clears the border when the width goes to 0", async () => {
    const wrapper = mountIt({ width: 1, style: "solid", color: "#000000" });
    await wrapper.find('[data-testid="test-border-width-input"]').setValue("0");

    expect(wrapper.emitted("update:modelValue")).toHaveLength(1);
    expect(lastEmitted(wrapper)).toBeUndefined();
  });
});
