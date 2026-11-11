---
name: puffy
description: Use when building or changing React UI in a project that uses Puffy UI (glass components, --glass-tint, puffy-tokens.css). Use Puffy parts and tokens before writing your own.
---

# Puffy UI

Before writing any UI, do these in order.

1. **Look for a part.** Read https://puffyui.com/agent/components.json (or call the Puffy MCP `list_parts`). If a part fits, install it and use it:
   `npx shadcn@latest add https://puffyui.com/r/<item>.json`
2. **Follow the rules.** Read https://puffyui.com/tokens/AGENTS.md once per project. The short version:
   - Colours, shadows, radii, spacing, type and motion come from `--p-*` tokens. Never write a raw hex, shadow or easing.
   - Pick tokens by job (`--p-bg-*`, `--p-text-*`, `--p-stroke-*`, `--p-elevation-*`), not by looks.
   - Restyle only with the four switches: `--glass-tint`, `data-glass-theme`, `--glass-radius`, `data-glass-mode`. Do not fork component CSS.
3. **Build only the gap.** If no part fits, build a new one from tokens, and give it focus, hover, pressed, disabled, loading, empty and error states and an accessible name.
4. **Check before finishing.** Light and dark, Quiet and Puffy, pill and 12px shape, a different brand colour, keyboard, 44px targets, contrast, no horizontal scroll at 375px, reduced motion.

Do not copy another library's design. Everything stays in Puffy's own style.
