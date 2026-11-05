# Brix Design System

Brix is a focused design system for call-operations workflows. This repository contains the token source, five documented components, executable Storybook stories, accessibility checks, and the public documentation site used by the Brix portfolio case study.

## What is included

- Palette, brand, semantic, and component tokens
- Primary Buttons, Multi-Select Combobox with Search, Call Center Card Badges, Live Call Card Compact, and Audio Transcript Player
- Literal selection guidance for designers, engineers, and AI interface agents
- Storybook interaction tests, axe checks, and visual review configuration
- Static Storybook publishing through GitHub Pages

## Local development

Use Node 24 and pnpm 11.

```bash
pnpm install
pnpm storybook
```

Storybook runs at `http://localhost:6006`.

## Quality checks

```bash
pnpm check
```

The command runs linting, TypeScript, browser-based story tests, accessibility checks, and a static Storybook build.

## Token layers

1. `primitive.tokens.json` stores raw palette values.
2. `brand.tokens.json` names identity roles.
3. `semantic.tokens.json` names interface purpose.
4. `component.tokens.json` adds domain aliases only where a shared semantic role is insufficient.

Product components use the documented token values. Exact artifact-parity treatments retain literal source values when substituting a broader semantic alias would change the rendered result.

## Publish with GitHub Pages

1. Create a **public** GitHub repository named `brix-storybook` and push this folder to `main`.
2. Open the repository's **Settings → Pages**.
3. Under **Build and deployment**, choose **GitHub Actions** as the source.
4. Open **Actions** and run **Publish Storybook to GitHub Pages** if the first push did not trigger it automatically.

The stable public URL will be `https://tyler-mag.github.io/brix-storybook/`. Every push to `main` rebuilds and republishes Storybook. Individual stories can be embedded in the Framer case study with their `iframe.html?id=…&viewMode=story` URL.

Chromatic is optional. Add it later if the project needs hosted visual diffs, review approvals, or version history; it is not required to make Brix public.

## Scope

Brix is maintained by one designer. It deliberately omits enterprise governance, migration tooling, and package-distribution overhead until a real team or product requirement justifies them.
