# Guardian Site

Marketing site for Guardian, built with SvelteKit and deployed on Cloudflare Pages.

Live URLs:
- Production Pages URL: `https://guardianassistant.pages.dev`
- Custom domain: `https://guardianassistant.com`

## Local development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build the static site:

```bash
npm run build
```

## Deployment

This repo is configured for static output via `@sveltejs/adapter-static`.

Wrangler config is checked in at `wrangler.toml` so deploys are repeatable from any authenticated machine.

Deploy the current `build/` output to Cloudflare Pages:

```bash
npx wrangler pages deploy build --project-name guardianassistant --branch main
```

## Domain notes

- Cloudflare Pages project: `guardianassistant`
- The apex domain `guardianassistant.com` should point at `guardianassistant.pages.dev`
- If the live domain looks stale after a DNS change, verify the Cloudflare DNS record target and wait a few minutes for propagation
