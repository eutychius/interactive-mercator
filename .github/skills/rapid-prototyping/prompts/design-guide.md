# Glass Design System

## What this is

- **`glass.css`** — The stylesheet to copy into every prototype. It provides a complete light-mode, glassmorphic design system with layout, cards, controls, and interactive components. It is the source of truth.
- **`showcase-glass.html`** — A reference page showing how to use the CSS classes. It is **not** a template. Do not copy its structure wholesale. Use it to understand how the classes combine.

## How to use

1. Copy `glass.css` into your project and link it.
2. Add the Inter font: `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap`
3. Build your layout using the classes below.

## Layout

| Class | Purpose |
|-------|---------|
| `.container` | Centered content column (1120px max), scrollable with custom scrollbar |
| `.split` | Two-column grid, equal height |
| `.stack` | Vertical flex column with gap |
| `.row` | Horizontal flex row with gap and wrap |
| `.grid-auto` | Auto-fill grid (min 240px columns) |
| `.section-header` | Flex row for heading + trailing label |

## Surfaces

| Class | Purpose |
|-------|---------|
| `.glass-card` | Frosted translucent card with blur, edge highlights, hover lift, and shimmer |
| `.card` | Solid white card with subtle border and shadow |
| `.inner-block` | Semi-transparent block inside a glass card (for non-glass child content) |

## Background

| Class | Purpose |
|-------|---------|
| `.bg-shapes` | Fixed container for decorative background shapes |
| `.bg-shapes span` | Individual shape — use shape classes: `.shape-circle`, `.shape-square`, `.shape-dot`, `.shape-bar`, `.shape-ring`, `.shape-diamond`, `.shape-dot-sm`, `.shape-pill`, `.shape-circle-md` |

The shapes are soft indigo at low opacity. They give the glass cards something visible to blur against.

## Controls

| Class | Purpose |
|-------|---------|
| `.btn` | Base button (combine with a modifier) |
| `.btn--primary` | Accent-filled button |
| `.btn--ghost` | Bordered transparent button |
| `.btn--glass` | Frosted translucent button |
| `.input` | Standard text input |
| `.input--glass` | Frosted translucent input |
| `.slider` | Range input with accent fill (set `--val` via `oninput` for fill color) |
| `.toggle` | Wraps a hidden `<input type="checkbox">` + `.toggle__track` for an on/off switch |

## Data & Content

| Class | Purpose |
|-------|---------|
| `.table-wrap` | Scrollable wrapper for a table |
| `.table` | Styled table with hover rows and optional `contenteditable` cells |
| `.list-item` | Horizontal row with `.list-item__content` (auto-separated by border) |
| `.ilist-item` | Interactive checklist row — toggle `.checked` class on click |
| `.badge` | Inline pill label (use `.badge--accent` or `.badge--muted`) |
| `.avatar` | Circle with initials (`.avatar--sm` for small) |
| `.progress` | Track bar with `.progress__bar` inside (set width% inline) |
| `.stat` | Vertical metric: `.stat__value` + `.stat__label` |
| `.divider` | Horizontal gradient line |
| `.card-deck` | Stacked tilted cards that fan on hover (children: `.deck-card`) |

## CSS variables

Override these in `:root` to theme the system:

```
--bg-start, --bg-end, --bg-accent    Background gradient stops
--glass-bg, --glass-blur, --glass-radius   Glass card tuning
--card-bg, --card-radius              Solid card tuning
--accent, --accent-soft, --accent-hover    Accent color
--text-primary, --text-secondary, --text-muted   Type colors
--sp-1 through --sp-16               Spacing scale (4px base)
--duration, --ease-out                Transitions
```
