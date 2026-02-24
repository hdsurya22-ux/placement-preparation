## KodNest Premium Build System

This repository contains the **KodNest Premium Build System** design shell: a calm, intentional, coherent, and confident front-end layout and component foundation suitable for a serious B2C SaaS product.

The current state is **design system only**: layout, tokens, and base components are in place. **No product features or business logic have been added yet.**

### Design Principles

- **Tone**: Calm, intentional, coherent, confident. No flashy or playful UI.
- **Color system**:
  - Background: `#F7F6F3` (off‑white)
  - Primary text: `#111111`
  - Accent (primary): `#8B0000` (deep red)
  - Success: muted green
  - Warning: muted amber
- **Typography**:
  - Headings: serif, large, confident, generous spacing
  - Body: clean sans-serif, 16–18px, line-height 1.6–1.8, text blocks max-width 720px
- **Spacing scale** (only):
  - 8px, 16px, 24px, 40px, 64px

### Global Layout

Every page follows this structure:

1. **Top Bar**
   - Left: project name
   - Center: progress indicator (`Step X / Y`)
   - Right: status badge (`Not Started` / `In Progress` / `Shipped`)
2. **Context Header**
   - Large serif headline, 1-line subtext, clear purpose, no hype language
3. **Primary Workspace + Secondary Panel**
   - Primary workspace: ~70% width, main interaction surface
   - Secondary panel: ~30% width, step explanation, prompt, and controls
4. **Proof Footer**
   - Checklist-style verification: `UI Built`, `Logic Working`, `Test Passed`, `Deployed`
   - Each item has an associated free-text “proof” input

### Components & Interaction Rules

- **Buttons**
  - Primary: solid deep red background, white text
  - Secondary: outline style, neutral background
  - Shared radius and hover transitions across the system
- **Inputs**
  - Light borders, no heavy shadows
  - Clear focus states using accent color
- **Cards**
  - Subtle border
  - No drop shadows
  - Balanced padding using the spacing scale
- **Transitions**
  - 150–200ms, `ease-in-out`, no bounce or parallax
- **States**
  - Errors explain what went wrong and how to fix it
  - Empty states always recommend a next action

### Files

- `index.html` — Application shell markup for the layout and components.
- `styles.css` — Design tokens, layout primitives, and component styles.
- `package.json` — Minimal metadata and scripts placeholder (no runtime dependencies).

### Running

This is a static HTML/CSS implementation. You can open `index.html` directly in a browser, or serve it with any static HTTP server (for example: `npx serve .` from this directory).

