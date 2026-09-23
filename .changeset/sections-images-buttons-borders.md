---
"@templatical/types": minor
"@templatical/renderer": minor
"@templatical/editor": minor
"@templatical/template-tools": minor
---

Sections, images and buttons take a border

There was no way to draw a border around a block — an outlined card section, a framed product shot, or an outline ("ghost") button all needed an HTML block.

`SectionBlock`, `ImageBlock` and `ButtonBlock` gain an optional `border: BorderValue` — `{ width, style, color }`, with `style` one of `"solid"`, `"dashed"` or `"dotted"`. It renders as MJML's native `border` attribute on `mj-section`, `mj-image` and `mj-button`, so it survives every email client those elements already work in. Leave it out (or set `width` to `0`) for no border, which is what every existing template already renders — nothing changes for templates that don't ask for one.

The editor's section, image and button settings get a border control (width, style, color). Entering a width starts a solid black border; setting it back to `0` removes the border.

`toBorderCss()` is exported from `@templatical/types` so the canvas and the renderer format a border identically.

Other block types (text, menu, social, video) have no native MJML border and are not covered.
