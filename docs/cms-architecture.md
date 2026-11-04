# Decap CMS and Vercel handoff

## Current architecture

- Astro 7 builds a static site to `dist/`; no server adapter or CMS secrets are required for the public site.
- The GitHub content branch is `main`.
- `src/pages/admin/index.astro` serves `/admin/` in Astro dev and static output, loading the stable Decap CMS 3.17.0 bundle. `public/admin/config.yml` provides its CMS configuration. Turbo backends are included in that release.
- `public/admin/config.yml` uses `turbo-github`, omits `repo` as required by Turbo, and contains the Turbo site UUID supplied by the project owner.
- `src/data/id.json` and `src/data/en.json` remain the canonical homepage files. They are separate CMS file entries, matching the existing Astro imports and validation. Editors must maintain the same IDs, ordering, and publication status for service and FAQ entries in both files. The build rejects mismatches; there is no automatic translation.
- Room photos use the existing `roomGallery` collection in `src/content/room-gallery/`. Activity documentation uses `activityDocumentation` in `src/content/activities/`. Both store Indonesian and English strings together in one record.
- `public/images/bank-mini/` is the Git-backed media directory and `/images/bank-mini/` is its public URL prefix.

CMS content is consumed by the public Astro pages. Service items and FAQ items are repeatable lists inside the current bilingual JSON files. Gallery and activity records are Astro content collection entries. Public rendering filters the publication flags. Identifiable student photos cannot pass build validation as published unless the permission flag is confirmed.

## Finish Turbo setup

These account-level steps cannot be completed from this source tree:

1. Sign in to Decap Turbo and create or join an organization.
2. Connect GitHub using the official Decap Turbo GitHub App. Restrict its installation to `alvinrahmatulloh91-source/bankMini_Syariah`.
3. Create a Turbo site using that GitHub repository and the `main` branch.
4. Set the site configuration path to `public/admin/config.yml`.
5. Add `http://localhost:4321` to the site's allowed Admin Interface URLs. Add the exact Vercel production origin after the production domain exists. Turbo checks protocol, hostname, and port; do not add a broad `*.vercel.app` URL.
6. Confirm that the UUID in `backend.turbo_site_id` matches this site's Overview page.
7. Invite only the administrators who should edit this site's collections.

The GitHub repository is configured in the Turbo dashboard, not in `config.yml`. Turbo's GitHub backend does not use a `repo` value from this file. The project owner supplied the site UUID, but the repository connection, editor membership, and allowed origins still need confirmation in Turbo before login and repository access can be considered operational.

Reference: [Turbo getting started](https://decapcms.org/docs/turbo-getting-started/) and [connecting a site](https://decapcms.org/docs/turbo-connecting-a-site/).

## Content and language rules

- Edit both `Konten Bahasa Indonesia` and `English website content` when adding or removing a service or FAQ. Keep each item's `id`, `order`, `published`, and service `featured` values aligned. The Astro build fails on a mismatch, preventing the two routes from showing different entry sets.
- Translate the supplied official wording explicitly. The CMS does not machine-translate text.
- Gallery and activity entries store `title`, `description`, and `alt` as `{ id, en }` pairs, so both languages are required in the same saved record.
- Gallery category text remains editable. The list on the public page is a set of documentation prompts, not confirmation that a facility exists.
- Keep new records unpublished until wording, images, translation, dimensions, rights, and alt text have been checked.
- For activity photos, set `identifiableStudents` to true when a student can be recognized. Publishing then requires `permissionConfirmed: true`.

## Media rules

Decap's built-in image widget accepts image files, limits each configured upload to 5 MiB, converts supported JPEG/PNG/WebP images to WebP at quality 82, and strips metadata. Images are stored in `public/images/bank-mini/`; Astro copies them to the site unchanged at `/images/bank-mini/`. The build verifies referenced files exist and are no larger than 5 MiB. No real Bank Mini photos are present yet.

Use descriptive, unique filenames and reuse an existing media-library item instead of uploading a second copy. Decap's repository-backed media folder is not an external asset store, and the editor does not enforce a global duplicate-name policy. Build-time checks catch missing and oversized files but cannot establish image authenticity or rights.

## Vercel setup and verification

This is a static Astro project. Connect the existing GitHub repository to a Vercel project and use:

- Framework preset: Astro
- Build command: `npm run build`
- Output directory: `dist`
- Node.js: 22.x or newer; `package.json` requires `>=22.23.4`
- Environment variables: none for static rendering or Decap Turbo

Vercel supports static Astro deployments without an adapter. When Git integration is enabled, a commit to the production branch triggers a build. Do not set a production site URL in Decap until Vercel has assigned the intended domain. Then add that exact origin to the Turbo Admin Interface URLs and verify `/admin/`, `/admin/config.yml`, `/`, `/en/`, and uploaded image URLs on the deployed site.

This repository has not been connected to a Vercel project, and no deployment has been performed from this workspace.

## Automation and verification boundary

The implementation environment used for the latest local verification did not expose authenticated GitHub, Decap Turbo, or Vercel integrations. The `gh` and `vercel` command-line tools were also unavailable. Repository permissions, Turbo site settings, Vercel project settings, and production domains therefore could not be inspected or changed here. The supplied site ID identifies the configured Turbo site, but does not prove its GitHub connection or allowed origins are active.

`npm run build` succeeds and emits `dist/admin/index.html` and `dist/admin/config.yml`. Astro dev now serves `/admin/` and `/admin/config.yml` over HTTP. This does not establish that Turbo authentication, GitHub publishing, or uploads work.

To continue, an authorized administrator must use the official Decap Turbo flow to verify the intended GitHub repository connection and exact admin origins. Then connect that existing repository to Vercel through Vercel's GitHub authorization flow. Do not share passwords, personal access tokens, or private credentials in chat; provide the production origin after Vercel assigns it so the site can be configured and verified.
