# Puffy design rules

These are the rules for any person or AI agent writing UI in a project that uses Puffy. Copy this file to the project root as `AGENTS.md`, or paste it into `CLAUDE.md`. The full reference is at https://puffyui.com/system/.

## 1. Use tokens, never raw values

- Colours, shadows, radii, spacing, type and motion come from `puffy-tokens.css` (`--p-*`).
- Do not write a hex, `rgb()`, pixel shadow or easing curve in component code. If no token fits, stop and add one to the token file first.
- Pick tokens by job, not by looks:
  - `--p-bg-*` for backgrounds
  - `--p-text-*` for text
  - `--p-stroke-*` for borders and dividers
  - `--p-icon-*` for icons
  - `--p-elevation-*` for shadows
- Never use a `text` token as a background or a `bg` token as text.

## 2. The four switches

Only these change the look. Never fork component CSS to restyle.

| Switch | How | Values |
|---|---|---|
| Brand colour | `--glass-tint` on `:root` or a wrapper | any colour |
| Look | `data-glass-theme` | `quiet` (apps, dashboards), `puffy` (soft, playful) |
| Shape | `--glass-radius` | `12px` rounded … `999px` pill |
| Mode | `data-glass-mode` | `light`, `dark` |

Every token already responds to all four. Do not add `.dark` overrides for things that use tokens.

## 3. Colour

- Use the brand colour for one main action per view, plus selection and focus. Everything else stays neutral.
- Text on `--p-bg-brand` is always `--p-text-on-brand`.
- Status uses its own set and nothing else:
  - `--p-{info|success|warning|error}-base` for dots, bars and solid fills
  - `-light` for tinted grounds
  - `-text` for words on that ground
- Never show status by colour alone. Pair it with a word or an icon.
- Contrast must be at least 4.5:1 for body text and 3:1 for large text and icons. The text tokens are tuned for their matching backgrounds.

## 4. Elevation

Six heights, from low to high:

| Token | Use for |
|---|---|
| `card` | cards and tiles |
| `raised` | hovered cards, toolbars |
| `dropdown` | menus, selects, comboboxes |
| `popover` | popovers, hover cards, tooltips with content |
| `sticky` | sticky headers and footers |
| `modal` | dialogs, sheets, command palettes |

A child never sits lower than its parent. Use the token that names the job. Don't pick by how strong a shadow looks.

## 5. Shape and space

- Buttons, chips and fields use `--p-radius-control`, `--p-radius-chip` and `--p-radius-field`, so they follow the shape switch.
- Cards and panels use `--p-radius-card` and `--p-radius-panel`, so they stay calm even in pill mode.
- Nested corners: inner radius = outer radius − padding.
- Spacing is a 4px grid (`--p-space-1` = 4px … `--p-space-20` = 80px).
- Lay out with `gap`, not margins between siblings.
- Touch targets are at least `--p-size-hit` (44px), even when the visible control is smaller.

## 6. Type

- Use the type set:
  - `--p-type-display`
  - `--p-type-title`
  - `--p-type-heading`
  - `--p-type-body`
  - `--p-type-body-sm`
  - `--p-type-label`
  - `--p-type-caption`
  - `--p-type-overline`
  - `--p-type-code`
- Each heading level has a matching `-tracking` token. Apply it with the heading.
- Use the `p-trim` class on text that must sit exactly centred in a box, such as badges, buttons and avatars.
- Body text stays between 45 and 75 characters per line.
- Sentence case everywhere. No full stops in buttons, labels or headings.

## 7. Motion

- Durations:
  - `--p-duration-fast` for hover and press
  - `--p-duration-base` for most changes
  - `--p-duration-slow` for panels and pages
- Easing:
  - `--p-ease-standard` for most changes
  - `--p-ease-puff` for presses and pops (the squish)
  - `--p-ease-settle` for things coming to rest
- Animate `transform` and `opacity`, not layout.
- The tokens drop to zero under `prefers-reduced-motion`. Don't hard-code durations that would skip this.

## 8. Glass, puff and sound

- Glass (`--p-glass-*`) is for things floating over content: menus, docks, toolbars. Never use it for body text areas.
- Puff colours (`--p-puff-*`) are worked out from the brand colour. Use them for decoration only, never for text or status.
- Sound comes from `glass-sound.jsx` and is off until the user turns it on. Never autoplay it, and give a mute.

## 9. Components

- Use the Puffy part if one exists before building a new one: https://puffyui.com/#components
- Building an agent or assistant screen? The agent and AI parts (approvals, tool calls, thinking, streaming text) are in Puffy Pro; if the project has them, use them, and ask before anything that can't be undone.
- Keep each part's props. Restyle through the switches, not by overriding classes.
- Every interactive element needs:
  - a visible focus ring (`--p-focus-ring`)
  - hover and pressed states
  - a disabled state
  - an accessible name
- Every list or data view needs loading, empty and error states.

**Reuse a variant before adding one**

- First check whether an existing variant already does the job: `primary`, `secondary`, `ghost`, a size, or a status.
- A new look for one screen is not a new variant. Change it with the four switches, or by putting existing parts together.
- Add a variant only when the job is new (for example a destructive action) and it will be used in more than one place.
- Name a variant by its job (`danger`), never by its looks (`red`, `soft-blue`).
- A new variant uses tokens only. It must work in light and dark, in Quiet and Puffy, and with every shape.
- Icon-only buttons need `aria-label`.

## 10. Before you finish

Check each item:

- [ ] No raw colour, shadow or radius values outside the token file
- [ ] Works in light and dark
- [ ] Works in Quiet and Puffy
- [ ] Works with a pill and a 12px shape
- [ ] Works with a different brand colour
- [ ] Focus visible
- [ ] Keyboard reachable
- [ ] 44px targets
- [ ] Contrast passes
- [ ] No horizontal scroll at 375px width
- [ ] Reduced motion respected
