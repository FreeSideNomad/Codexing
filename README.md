# Visual Impact SA Workspace Prototype

Client-only React + Tailwind + Zustand demo for rental-kit collaboration.

## Local development

```bash
bun install
bun run dev
```

## Quality checks

```bash
bun run lint
bun run build
```

## GitHub Pages deployment

A workflow is included at `.github/workflows/deploy-pages.yml`.

### One-time repo settings

1. In **Settings → Pages**, set **Source** to **GitHub Actions**.
2. Ensure your default deploy branch is `main` (or update the workflow trigger branch).

### How deployment works

- On push to `main`, Actions installs deps with Bun and builds the app.
- The workflow sets `VITE_BASE_PATH=/Codexing/` so assets resolve correctly on Pages.
- It uploads `dist/` and deploys using the official Pages actions.

If you rename the repository, update `VITE_BASE_PATH` in `.github/workflows/deploy-pages.yml`.
