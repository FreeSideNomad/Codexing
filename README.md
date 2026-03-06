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

## GitHub Pages deployment (focus)

This repo deploys to GitHub Pages from `.github/workflows/deploy-pages.yml`.

### Required repository settings

1. **Settings → Pages → Source**: select **GitHub Actions**.
2. Ensure deploy branch is `main` (workflow trigger is `push` to `main`).

### Deployment behavior

- On every push to `main`, the workflow:
  - installs dependencies with Bun,
  - builds with `VITE_BASE_PATH=/<repo-name>/`,
  - uploads `dist/`,
  - deploys with `actions/deploy-pages`.
- The workflow also supports manual runs (`workflow_dispatch`) but only deploys when the ref is `main`.
- Base path is dynamic from repo name, so renaming the repo does not require workflow edits.
