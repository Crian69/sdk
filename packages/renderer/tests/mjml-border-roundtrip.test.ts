import { describe, expect, it } from "vitest";
import mjml2html from "mjml";
import {
  createButtonBlock,
  createImageBlock,
  createSectionBlock,
} from "@templatical/types";
import type { BorderValue } from "@templatical/types";
import { renderBlock, RenderContext } from "../src";

/**
 * `border` on `mj-section`, `mj-image` and `mj-button` compiles into an inline
 * style — the only place a recipient's client sees it. A string check on the
 * MJML alone would not prove the attribute survives (MJML silently drops
 * attributes an element does not accept), so these compile the renderer's
 * output and assert on the HTML.
 */

const ctx = new RenderContext(600, [], "Arial, sans-serif", true);

const BORDER: BorderValue = { width: 2, style: "dashed", color: "#ff0000" };

async function compile(mjml: string): Promise<string> {
  const result = await mjml2html(mjml);
  expect(result.errors).toEqual([]);
  return result.html.replace(/\s+/g, " ");
}

function wrapInColumn(blockMjml: string): string {
  return `<mjml><mj-body><mj-section><mj-column>${blockMjml}</mj-column></mj-section></mj-body></mjml>`;
}

function wrapInBody(sectionMjml: string): string {
  return `<mjml><mj-body>${sectionMjml}</mj-body></mjml>`;
}

describe("border round-trip through MJML compiler", () => {
  it("borders the image itself", async () => {
    const block = createImageBlock({
      src: "https://example.com/img.png",
      width: 300,
      border: BORDER,
    });

    const mjml = renderBlock(block, ctx);
    expect(mjml).toContain('border="2px dashed #ff0000"');

    const img = (await compile(wrapInColumn(mjml))).match(/<img[^>]*>/);
    expect(img).not.toBeNull();
    expect(img![0]).toContain("border:2px dashed #ff0000");
  });

  it("borders the button", async () => {
    const block = createButtonBlock({ border: BORDER });

    const mjml = renderBlock(block, ctx);
    expect(mjml).toContain('border="2px dashed #ff0000"');

    expect(await compile(wrapInColumn(mjml))).toContain(
      "border:2px dashed #ff0000",
    );
  });

  it("borders the section box", async () => {
    const block = createSectionBlock({ border: BORDER });

    const mjml = renderBlock(block, ctx);
    expect(mjml).toMatch(/<mj-section[^>]*border="2px dashed #ff0000"/);

    expect(await compile(wrapInBody(mjml))).toContain(
      "border:2px dashed #ff0000",
    );
  });

  it("emits nothing when the border is unset or has no width", () => {
    const borders: (BorderValue | undefined)[] = [
      undefined,
      { ...BORDER, width: 0 },
      { ...BORDER, width: -1 },
    ];

    for (const border of borders) {
      const blocks = [
        createImageBlock({ src: "https://example.com/img.png", border }),
        createButtonBlock({ border }),
        createSectionBlock({ border }),
      ];

      for (const block of blocks) {
        expect(renderBlock(block, ctx)).not.toMatch(/\sborder="/);
      }
    }
  });

  it("strips characters that would break out of the CSS declaration", async () => {
    const block = createButtonBlock({
      border: {
        width: 1,
        style: "solid",
        color: "red; background: url('//attacker/log')",
      },
    });

    const mjml = renderBlock(block, ctx);
    expect(mjml).not.toContain(";");

    // The payload survives only as part of one (invalid) `border` value, never
    // as a declaration of its own.
    expect(await compile(wrapInColumn(mjml))).not.toMatch(
      /;\s*background:\s*url\(/,
    );
  });
});
