# LKM Mitra Siswa Abadi

Bilingual static website for the Bank Mini Perbankan Syariah at SMKN 1 Bantul. Built with Astro, TypeScript, and Tailwind CSS. The Indonesian homepage is `/`; the English homepage is `/en/`. Both use shared section components and content files in `src/data/`.

## Local development

Requires Node.js `>=22.23.4` and npm.

```sh
npm ci
npm run dev
npm run check
npm run build
npm run preview
```

Astro writes the static site to `dist/`. The build validates the bilingual content and referenced media. Gallery and activity collections can be empty until approved material is available.

## Content and CMS

Decap CMS is served at `/admin/`; its configuration is `/admin/config.yml`. The configured backend is Decap Turbo GitHub, with the project's existing Turbo Site ID and `main` publication branch. The site content lives in `src/data/id.json`, `src/data/en.json`, `src/content/room-gallery/`, and `src/content/activities/`.

Editorial Workflow is configured for drafts and review. The actual Turbo login, save/resume, upload, and publish flow still requires an authorized administrator to verify. Read [the CMS architecture and handoff](docs/cms-architecture.md) before editing content. Do not publish institutional details, contact information, or photos until the school has confirmed them and any required permission.

## Deployment

The project builds as a static Astro site. For Vercel use the Astro preset, `npm run build`, and output directory `dist`. Set `SITE_URL` to the final HTTPS production origin at build time to populate canonical, language-alternate, Open Graph URL, sitemap, and robots metadata. No production domain is configured in this repository. See [the audit and deployment handoff](docs/project-audit.md) and [Vercel/CMS setup](docs/cms-architecture.md).

## Current verification boundary

`npm run check` and `npm run build` are the local code and content gates. Browser/accessibility checks, CMS account operations, GitHub branch protection, and a Vercel deployment require external access and are not implied by a successful local build. The audit document tracks what remains.
