# Project Audit — LKM Mitra Siswa Abadi

Audit date: 2026-11-04
Repository: `alvinrahmatulloh91-source/bankMini_Syariah` (local folder: `dimensional-disk`)
Scope: repository structure, Astro site, content, CMS, build, routes, accessibility basics.

## Follow-up: Decap `site-content` save validation — 2026-11-04

- Read-only inspection found four list widgets in `public/admin/config.yml` whose values may be empty but had no explicit `required: false`: `about.timeline`, `process.steps`, `advantages.items`, and `contact.people`, in both Indonesian and English forms. Decap treats omitted `required` as true; their Astro schema already accepts/defaults empty arrays. This is a confirmed config defect, but the user reports the same toast after the local fix, so it is not confirmed as the only cause of the observed failure.
- Added `required: false` to those list widgets only. Other nested structure stays present, and `advantages.items.icon` remains required with default `sharia`. Production Astro validation of essential text, URL, email/phone, and content collection rules remains strict.
- Added two config tests verifying both language forms and one schema test verifying optional lists can be empty while the essential hero headline remains required.
- `npm test` passes. The package script reports the three test files as three top-level tests; running each file directly confirms 26 individual assertions/subtests pass.
- Firefox is installed, but no Chromium, browser automation driver, or authorized Turbo session is available. The actual Decap Save interaction was not tested. Do not treat the fix as externally verified until a CMS editor retries saving `site-content` with empty lists.
- The repository change remains local and uncommitted. A deployed/live CMS will continue using its deployed config until an approved commit and deployment. If the failure reproduces in local `/admin/`, record the red-outlined field or form section to locate any remaining validation source.

This audit does not commit, push, or redesign anything. The repository already contains staged and unstaged work that must be reviewed before committing.

## Antigravity continuation & finishing audit — 2026-11-04

### Scope and objective
Comprehensive finishing audit and continuation of the LKM Mitra Siswa Abadi repository following Codex's bilingual services/FAQ migration. Validated all local code, content collections, schemas, CMS configuration, Astro builds, responsive layouts, motion tokens, accessibility features, and automated validation gates.

### Read-only audit of Codex bilingual implementation
1. **`src/content/services/`**:
   - Two entries (`bsi-agen.json`, `tabungan-siswa.json`) thoroughly verified.
   - All details, transaction items, deposit requirements, and fees from previous per-language arrays preserved verbatim with zero content loss.
   - One featured item (`bsi-agen`), unique orders (1, 2), valid icon keys (`bank`, `savings`).
2. **`src/content/faqs/`**:
   - Four entries (`faq-identity.json`, `faq-wadiah.json`, `faq-customer.json`, `faq-hours.json`) verified against historical `id.json`/`en.json`.
   - Questions and answers preserved in full across both languages; display orders 1–4 are unique.
3. **Schemas and validation**:
   - `src/data/pairedContentSchema.ts` validates stable IDs (`^[a-z0-9]+(?:-[a-z0-9]+)*$`), localized strings, and alternative image text.
   - `src/data/validatePairedContent.ts` enforces unique IDs, unique orders (in strict mode), at least one entry, and at most one published featured service.
   - Bug identified & resolved: fixed missing `.ts` file extension in `src/data/validatePairedContent.ts` ESM import of `contentValidationMode`.
4. **`src/content.config.ts` & `src/data/siteContent.ts`**:
   - Service and FAQ collections correctly registered with `astro:content` loaders and paired schemas.
   - `siteContentSchema` streamlined: `services` and `faq` only retain section headers/labels; no duplicated data arrays remain in `id.json` or `en.json`.
5. **Components (`Services.astro`, `FAQ.astro`)**:
   - `Services.astro` isolates the featured card with responsive grid, accessible arrow link, and supporting service list.
   - `FAQ.astro` uses semantic `<details>`/`<summary>` with animated chevron indicator.
6. **Bilingual pages (`/` and `/en/`)**:
   - Correct `<html lang>` attributes (`id` vs `en`).
   - Query collections, execute validation (`validatePairedContent`, `validateContentMedia`), pass localized props.
7. **`public/admin/config.yml`**:
   - Retains backend `turbo-github`, branch `main`, site UUID `91bdd6ab-6820-4e2f-8de1-1c23b7d6f065`, and `publish_mode: editorial_workflow`.
   - Automated diff audit confirmed 100% field parity between CMS file fields and `id.json`/`en.json` (0 missing fields, 0 extra fields).
   - Collections for `services` and `faqs` correctly mirror paired schema with drafts allowed.

### Quality gate and verification results
- **Automated test suite**: current test files contain 26 passing assertions/subtests across `site-content.test.ts`, `paired-content.test.ts`, and `cms-config.test.ts`. `npm test` passes all three test files.
- **Astro type check**: latest recorded `npm run check` passes across 32 files with 0 errors, 0 warnings, 0 hints.
- **Production static build**: `npm run build` succeeds, emitting `/`, `/en/`, `/admin/`, `/404.html`, `/robots.txt`, `/sitemap.xml`.
- **Git diff check**: `git diff --check` and `git diff --cached --check` clean.
- **Live HTTP route audit**: Headless verification against running dev server confirms HTTP 200 for `/`, `/en/`, `/admin/`, `/admin/config.yml`, `/robots.txt`, `/sitemap.xml`, `/favicon.svg`, `/favicon.ico`, and HTTP 404 for unmapped paths.
- **CI/CD pipeline**: `.github/workflows/content-validation.yml` updated to execute `npm test` before `npm run check` and `npm run build`.

---

## Phase 12 implementation continuation — 2026-11-04

### Implemented locally in this continuation

- Migrated the existing two service records and four FAQ records out of duplicated per-language arrays into one bilingual JSON entry per service/FAQ under `src/content/services/` and `src/content/faqs/`. Existing copy and shared flags were carried over; no institutional facts were added.
- Added paired Astro schemas and collection validation. A CMS branch whose name starts with `cms/` may hold incomplete localized text, optional image/alt, and order fields. Local and `main` builds stay strict; production checks enforce bilingual text, safe image paths/alt text, stable unique IDs/orders, at least one service/FAQ, and at most one published featured service.
- Updated the ID and EN homepage routes and reusable service/FAQ components to render the same collection with language-specific copy.
- Added Decap `services` and `faqs` folder collections with bilingual editors, draft-optional text and order fields, stable IDs, and shared publish flags. Removed the old duplicated service/FAQ arrays from the language file forms.
- Removed the duplicated `location.map_link` field from each language form.
- Updated CMS and editor documentation to describe the new entry flow and state that Turbo workflow behavior remains untested.

### Not completed / external prerequisites

- GitHub branch protection cannot be configured from this local workspace. An authorized repository administrator must require **Content validation / validate** on PRs to `main`.
- School approval is still needed for existing service capabilities, transaction details, fees, hours, address/contact details, and official media. These values were preserved and are not represented as newly verified.
- No production domain was provided. `SITE_URL` and the exact allowed Turbo admin origin cannot safely be set until the owner supplies that domain and an administrator changes the existing Turbo site settings.
- Turbo login, partial draft save/resume, review, publish, and upload remain untested with the authorized account. This implementation does not claim the draft round trip works externally.
- Commit/push approvals, Vercel connection, preview, and production deployment remain pending.

### Latest local verification

- `npm run check`: passed with 32 Astro files and zero diagnostics.
- `npm run build`: passed; emitted `/`, `/en/`, `/admin/`, `/404.html`, robots, and sitemap outputs. Warnings only report empty gallery/activity collections, as expected while no approved media records exist.
- Draft-mode schema exercise: an incomplete service record passed `npm run check` and `npm run build` with `VERCEL_GIT_COMMIT_REF=cms/...`. After marking the same incomplete fixture publishable, a strict `VERCEL_GIT_COMMIT_REF=main npm run build` failed with missing bilingual title/description and order errors. The temporary fixture was removed.
- PyYAML and JSON parsing passed. The CMS identity remained `turbo-github`, the existing Site ID, branch `main`, and `editorial_workflow`; both language forms have exactly one `location.map_link`; the new service and FAQ collections exist.
- `git diff --check` and `git diff --cached --check` passed. No changes were staged, committed, pushed, or removed. The initial `npm run check` exposed blank alt fields on services without images; the schema now allows blank alt only when no image is selected.
- These local tests do not verify the live Decap form, Turbo draft storage, review/publish flow, upload, GitHub branch protection, or Vercel behavior.

## Continuation review: Phase 4–10 (2026-11-04)

### Work completed locally in this continuation

- Re-read this audit and `docs/cms-architecture.md`; reviewed repository status, current routes/components, content schema, CMS config, workflow, and deploy metadata.
- Replaced the Astro starter README with project setup, content, CMS, and deployment information.
- Added `docs/admin-guide.md` with editor-oriented instructions. It clearly marks Turbo UI save/resume/publish as untested.
- Improved the English translation for clarity and natural phrasing without changing the stored numeric service/savings terms. Those facts still need school approval.
- Added a `prefers-reduced-motion` CSS fallback that disables smooth scrolling and reduces transitions/animations.
- Re-ran `npm run check` (30 files, 0 diagnostics) and `npm run build` (4 pages/routes, success). The two empty-collection warnings are expected while no approved gallery/activity records exist.
- Parsed both content JSON files and the Decap YAML; confirmed `publish_mode: editorial_workflow`, Turbo Site ID, `turbo-github`, `main`, and the three expected collections.
- `git diff --check` and `git diff --cached --check` pass. No commit, push, reset, clean, or branch switch was performed.

### Current implementation and limits

- Public pages use one bilingual, section-based homepage (`/` and `/en/`) rather than separate About/Services/Savings/Teaching Factory routes. The relevant sections and CMS data exist. A second set of pages would duplicate the current content model and is not added in this handoff.
- Sitemap, robots, canonical, hreflang, and Open Graph metadata are implemented. `SITE_URL` is not set because the final production domain is unknown. The default local build therefore omits absolute canonical/alternate URLs and writes an empty sitemap URL set. This is an explicit deployment handoff, not a verified production SEO result.
- Static output is 288 KiB in this build, with about 76 KiB of generated CSS. There are no actual photographs to optimize or assess; Google Fonts still loads externally. This is a size inventory, not a Lighthouse or network performance measurement.
- Firefox exists, but Chromium, WebDriver, Lighthouse, `gh`, and `vercel` are unavailable. Previous attempts in this environment could not bind a local preview server. No browser, viewport, live HTTP, CMS, or production test is claimed for this continuation.
- `npm audit` could not reach `registry.npmjs.org` (`EAI_AGAIN`); dependency advisories are not verified. No dependency was added in this continuation.
- A source scan found no TypeScript `any` in `.ts`/`.astro`. The only `set:html` use renders one of four hard-coded SVG strings selected by the schema-validated icon key; editorial text is rendered through Astro's normal escaped expressions. A local scan found no credential-shaped secret markers. These source checks do not replace a dependency advisory scan or deployed security review.
- The GitHub Actions workflow has read-only `contents` permission and runs Astro check/build on pull requests to `main` and pushes to `main`. Its required status-check protection is an administrator setting and remains unverified.

### Status before handoff

- **Locally complete and tested:** bilingual static build, schema/type check, config/data parsing, reduced-motion fallback, project README, admin handoff guide, strict content validation workflow source, static sitemap/robots routes, and existing CMS configuration.
- **Locally implemented but not browser-tested:** keyboard interaction, gallery dialog/filter, responsive navigation/layout, metadata rendering with a real origin, and CMS routing/UI.
- **Requires administrator access:** test Turbo login, draft creation/save/resume, review, publish, upload, GitHub App/repository connection, allowed origins, branch protection, Vercel project, production deployment, and production domain/SITE_URL.
- **Requires school confirmation:** contact numbers, email publication, services and transaction capability, rates/fees/eligibility, hours, address, consent and official photos/logo. No new institution data or media was invented.

### Repository state

The first status/log read in this continuation showed HEAD `3fbfcd5` and staged/unstaged work. During this same session, HEAD advanced to `77f2162 feat: setup initial site CMS and content tooling` at 2026-11-04 09:24 +0700. This agent did not invoke `git commit` or `git push`; the reflog records the commit, and its origin cannot be established from this workspace. At final review the branch was one commit ahead of `origin/main`, with no staged entries; modified files are unstaged and new files untracked. Preserve the commit and all worktree changes, and review both before any future commit.

Phase 2 update: the duplicate admin route has been consolidated into `src/pages/admin/index.astro`; `public/admin/index.html` was removed after a line-by-line comparison showed it was identical except for the final newline. `public/admin/config.yml` and all CMS assets are preserved.

Phase 2.5/3 update: the English operation overlay is now bilingual, a favicon set exists, the operation image is CMS-managed, and advantage icons use stable keys. CMS schema and config validation were tightened. At the initial audit these changes were in the worktree; the later local commit and current uncommitted status are described in the continuation/repository notes above.

Phase 3.5 update (2026-11-04): the locally present SEO, accessibility, responsive, typing, data-validation, favicon, and 404 work was audited. English CMS field labels were clarified where they previously said only “Label”. Local checks are recorded below. Changes from earlier phases were preserved; this phase did not redo their implementation.

Phase 3.6 update (2026-11-04): Editorial Workflow is enabled for the existing Turbo GitHub backend. Copy fields can be incomplete on Decap `cms/...` draft branches; local/main schemas and a new strict PR validation workflow retain publication checks. Draft saving and publishing were not tested in the authenticated Decap UI, and GitHub branch protection must require the new validation check before merge.

## Phase 3.5 audit and verification (2026-11-04)

### Completed or verified locally

- Reviewed all CMS collection and field labels. Indonesian labels remain Indonesian and English labels are English; English section-label fields now name their context (for example, “Services section label” and “FAQ section label”). The English copy labels are distinct from the CMS interface labels and were not rewritten as institutional content.
- `rg` audit found no TypeScript `any` in `src` TypeScript/Astro files.
- Institution data validation covers non-empty required copy, email format, 8–15 digit WhatsApp numbers, HTTPS map links, safe media paths, image alt text when an image is set, unique IDs/orders, at most one published featured service, and student-photo permission before publication.
- Bilingual routes set `lang`; metadata includes descriptions, canonical URL, Open Graph/Twitter fields, and ID/EN plus x-default alternates when Astro `site` is configured. Sitemap and robots routes exist. They require `SITE_URL` to emit absolute URLs; without it, canonical/alternate metadata is omitted and the sitemap is empty.
- Accessibility implementation includes skip link, viewport scale, focusable main targets, SVG hiding in audited components, and reduced-motion handling. Responsive styles are present. These were source-reviewed, not verified through a browser or assistive-technology session in this run.
- `public/favicon.svg` and `.ico` exist. They remain unapproved placeholders pending official brand assets.
- Build output contains `/`, `/en/`, `/admin/`, `/404.html`, `/robots.txt`, and `/sitemap.xml`.
- `npm run check`: pass, 29 files, 0 errors/warnings/hints.
- `npm run build`: pass, 4 routes/pages; expected warnings remain because room gallery and activity collections contain no records.
- `git diff --check`, JSON parsing for `src/data/id.json` and `src/data/en.json`, and Python YAML parsing for `public/admin/config.yml`: pass.

### Not verified in this run / remaining

- Browser testing was unavailable: Firefox is installed, but no WebDriver executable was found. The repository's earlier Firefox/WebDriver production-preview results are historical and were not repeated for this audit. Astro dev/preview exited before readiness, and the environment denied binding a local HTTP server socket, so no live route HTTP or browser check was performed in this run.
- Build does not set `SITE_URL`; therefore the generated sitemap has no URLs and page canonical/hreflang/og:url tags are absent unless deployment supplies it. The production origin is unknown and was not invented.
- Responsive behavior, keyboard flow, screen-reader output, and browser console/network behavior still need manual browser verification.
- No image assets are present; asset authenticity, rights, image weight, and visual performance cannot be established. Google Fonts remains an external font request.
- Phone numbers, service capabilities, and eligibility rules remain institutional facts requiring school confirmation. No content was fabricated or removed.
- Turbo authentication, CMS save/upload/publish, GitHub permissions, and Vercel settings require account access. No secrets were requested.

## Phase 3.6 draft workflow audit (2026-11-04)

- Official Decap documentation says Editorial Workflow supports Decap Turbo. Save-draft creates a `cms/<collection>/<entry>` branch and review pull request; publishing merges to the configured publication branch. The existing `turbo-github` backend, Site ID, and `main` branch remain unchanged.
- `public/admin/config.yml` now enables `publish_mode: editorial_workflow`. Editorial copy, descriptions, contact fields, translation leaves, and optional gallery/activity media metadata can be blank temporarily. Entry IDs and safety flags remain available; service/FAQ order may be omitted in a draft branch.
- `src/data/contentValidationMode.ts` only permits incomplete schemas for Vercel builds whose `VERCEL_GIT_COMMIT_REF` begins `cms/`. Local builds and production branch builds remain strict. Services and FAQs now store both languages together in one entry; their paired content schema validates both localized values.
- `src/content.config.ts` keeps incomplete, unpublished gallery/activity records out of strict draft-preview schema errors, but strict branch validation still checks content, dimensions, image paths, and student permission. `src/data/siteContentSchema.ts` keeps required copy, identifiers, email/phone formats, HTTPS URLs, unique IDs/orders, alt text, and published service/FAQ checks strict outside draft previews.
- `.github/workflows/content-validation.yml` runs `npm run check` and `npm run build` with strict mode on PRs targeting `main` and pushes to `main`. A repository administrator still needs to require the `Content validation / validate` check in GitHub branch protection to prevent merging a failing/incomplete PR.
- Local test: direct schema parse accepted temporarily blank homepage copy/order/contact email on `cms/...` and rejected the same incomplete homepage in strict mode. A temporary incomplete gallery entry built successfully on `cms/...` and failed validation on `main`; the temporary fixture was removed. Build/check and YAML configuration are also tested below/in the handoff.
- Not verified: authenticated Decap 3.17.0 UI actions to save a draft, reopen it, or publish it. Official docs say `required: false` makes a field optional, but the configured Turbo login and actual field-level UI validation still need an authorized browser test. No successful CMS save is claimed.

## Executive summary

The project is a functional bilingual single-page institutional website built with Astro 7 and Tailwind CSS 4. It has validated content, an empty-but-wired gallery/activity content model, and a Decap CMS configuration for Turbo/GitHub. The production build succeeds.

The reported CMS error was a wrong-URL problem: Decap's default relative `config.yml` resolves to `/config.yml` when the editor visits `/admin` without a trailing slash. The admin page uses an absolute `<link rel="cms-config-url" href="/admin/config.yml">`, and browser verification confirms Decap fetches `/admin/config.yml` with HTTP 200 on both `/admin` and `/admin/`.

The duplicate admin route is resolved. `src/pages/admin/index.astro` is now the only admin implementation; the build emits `/admin/index.html` without the previous duplicate-route warning.

## Earlier verification (historical baseline; not repeated in this session)

| Check | Result |
| --- | --- |
| `npm run build` | Passes, 3 pages built; no duplicate-route warning |
| `git diff --check` | Clean |
| `/` | HTTP 200, `text/html` |
| `/en/` | HTTP 200, `text/html` |
| `/admin/` | HTTP 200, `text/html`; built from `src/pages/admin/index.astro` |
| `/admin` (no trailing slash) | HTTP 200, `text/html`; built from the same route |
| `/admin/config.yml` | HTTP 200, `text/yaml`, 17 KB |
| `/favicon.svg` | HTTP 200, `image/svg+xml` |
| `/favicon.ico` | HTTP 200, `image/x-icon` |
| English operation overlay | English labels present; no hardcoded Indonesian operation text |
| Advantages icons | 4 inline SVGs rendered; icon keys are CMS-managed |
| Decap config fetch in Firefox | `/admin/config.yml`, HTTP 200 on `/admin` and `/admin/` |
| Decap UI | "Login with Turbo" screen rendered |
| Turbo config endpoint | HTTP 200 for configured site UUID |
| Turbo authentication/publishing | Not verified; requires account access |

Browser verification used Firefox 159 headless through WebDriver BiDi against a production preview (`dist/`). It confirms configuration loading, not authorization, repository access, or publishing.

### Phase 2 CMS status

Verified:

- `public/admin/index.html` was removed; no unique functionality was lost (the files were identical except for the trailing newline).
- `src/pages/admin/index.astro` is the single source for `/admin/`.
- `public/admin/config.yml` is preserved and copied to `dist/admin/config.yml`.
- The absolute `cms-config-url` link is preserved in source and built output.
- `/admin`, `/admin/`, and `/admin/config.yml` return HTTP 200 in dev and production preview.
- Decap fetches the config successfully and renders the Turbo login screen.
- Site ID, `turbo-github` backend, and `main` branch are unchanged.

Not verifiable from this workspace:

- Turbo account login and editor membership.
- GitHub repository connection and permissions in the Turbo dashboard.
- Draft/publish workflow, media uploads, and repository commits from the CMS.
- Allowed admin origins for the future Vercel production domain.
- Any production deployment.

### Phase 2.5 and Phase 3 CMS completeness status

Completed locally:

- Added `practice_label` and `practice_title` to the bilingual operation model, schema, CMS config, and `OperationInfo.astro`. `/en/` no longer renders the hardcoded Indonesian overlay.
- Added optional `operation.image` and `operation.image_alt`; media existence and alt-text validation now cover the operation image.
- Added a brand-aligned `public/favicon.svg` plus a generated `public/favicon.ico`; both return HTTP 200. These are neutral placeholders pending official institutional approval.
- Replaced the fixed four-item advantage icon array with the stable keys `sharia`, `education`, `location`, and `fees`, a typed map, and a fallback icon. The icon is now a CMS select field.
- Added unique display-order validation for services and FAQ entries.
- Added CMS hints for service order/featured state, FAQ order, and the `{year}` copyright placeholder.
- Confirmed the CMS YAML parses with backend `turbo-github`, branch `main`, and site UUID `91bdd6ab-6820-4e2f-8de1-1c23b7d6f065`.
- Rebuilt and verified `/`, `/en/`, `/admin`, `/admin/`, `/admin/config.yml`, `/favicon.svg`, and `/favicon.ico` against the production preview.

Remaining CMS limitations:

- English CMS field labels were reviewed in Phase 3.5; formerly ambiguous generic section labels now identify their section.
- Gallery and activity collections remain empty, so build warnings persist until approved records are added.
- CMS save/upload/publish behavior still requires Turbo account access.
- The favicon is a placeholder, not an approved official logo.
- The previous `any` concern has been audited for Phase 3.5: no TypeScript `any` remains in `src` TS/Astro files.

## Repository handoff comparison (2026-11-04)

- The initial `git status`/log read showed branch `main` at `3fbfcd5`, with both staged and unstaged changes. Later, the reflog showed HEAD advanced to `77f2162 feat: setup initial site CMS and content tooling` at 2026-11-04 09:24 +0700. This agent did not issue a commit/push command and cannot identify what process created that commit.
- At final review, `main` was one commit ahead of `origin/main`; the index had no staged changes, with tracked modifications and untracked files remaining. All worktree changes were preserved. No merge conflict was reported.
- Review the current `git status` and both the commit and working tree before any later commit. Do not assume the commit was created by this continuation.
- The working tree matches the prior handoff's SEO routes, accessibility hooks, media validation, and typing work. This continuation added reduced-motion handling, project-specific README/admin guide documentation, and English copy edits.

## What already works

- Astro static routing for `/` and `/en/` with correct `<html lang>` values.
- Shared bilingual content in `src/data/id.json` and `src/data/en.json`.
- Zod validation of both language files in `src/data/siteContentSchema.ts`.
- Shared bilingual service/FAQ entry schemas and unique ID/order validation.
- Media path validation and 5 MB size check in `src/data/validateContentMedia.ts`.
- Content collections for room gallery and activity documentation with publication and photo-permission rules.
- Public rendering filters unpublished services, FAQ entries, gallery items, and activities.
- Accessible gallery dialog with keyboard navigation, focus return, filter state, and empty state.
- Reduced-motion handling in `src/scripts/motion.ts` and `src/styles/global.css`.
- CMS configuration for both language files and both content collections.
- Turbo backend configuration present; site UUID matches the supplied project information.
- Build-time failure on missing or oversized referenced images.
- No real transaction, account, or payment functionality is implemented, matching project scope.

## Findings

### High priority

1. **Duplicate admin route shadows the Astro page — resolved**
   - `src/pages/admin/index.astro` was staged, while an untracked `public/admin/index.html` contained the same page.
   - `npm run build` previously reported: `Skipping src/pages/admin/index.astro because a file with the same name exists in the public folder`.
   - Resolution: the public duplicate was removed after owner approval and a line-by-line comparison. The Astro page is now authoritative and builds without the duplicate-route warning.

2. **CMS work is uncommitted**
   - `public/admin/config.yml`, the admin route, gallery/activity collections, and content changes are staged or untracked, but not committed.
   - Deploying the current `main` commit would not include the CMS configuration or recent content work.
   - Do not commit automatically; review the staged diff first, then commit when authorized.

3. **Missing favicon — resolved with placeholder**
   - `public/favicon.svg` and `public/favicon.ico` now exist and return HTTP 200.
   - The artwork is a neutral brand-aligned placeholder; replace it when an official institutional asset is approved.

4. **Mixed-language UI on the English page — resolved**
   - `OperationInfo.astro` now reads `practice_label` and `practice_title` from the bilingual content.
   - The Indonesian page is unchanged; `/en/` no longer contains the hardcoded Indonesian overlay.

5. **Institutional facts need confirmation**
   - The verified source lists contact persons but not phone numbers. The current data includes two WhatsApp numbers.
   - The verified source only states that BSI Agen (Laku Pandai) is the main service. The current data presents specific transaction capabilities (PDAM/BPJS, SPP, e-wallet top-up, PLN, etc.).
   - The verified customer list includes active students, student organizations, teachers, and school staff. The current FAQ says all students, teachers, and employees, omitting student organizations and the "active" qualifier.
   - Do not remove existing data blindly, but have the school confirm these details before treating them as published institutional facts.

### Medium priority

6. **SEO output depends on deployment origin — partially resolved**
   - Metadata, canonical URLs, `hreflang`, sitemap, and robots routes exist.
   - `astro.config.mjs` reads `SITE_URL` at build time. Without it, canonical/alternate/og:url tags are omitted and the sitemap is empty. The final production origin is not available in this workspace.

7. **Single-page architecture may not match the requested page scope**
   - The master brief mentions About, Services, Savings, and Teaching Factory pages. The current site is one homepage per language with anchored sections.
   - Keep the one-page architecture unless separate routes are explicitly required. Adding pages by duplicating content would create a second source of truth.
   - If separate pages are required, extract shared section data/components first.

8. **No real media yet**
   - `public/images/bank-mini/` and both content collections are empty.
   - The empty states are honest and well written. Do not replace them with generated or stock images presented as school documentation.
   - Build warnings for empty collections are expected but noisy.

9. **Weak typing outside the content layer — resolved in current source**
   - Phase 3.5 `rg` audit found no `any` in source TypeScript/Astro files. `npm run check` reports no type/content diagnostics.

10. **`Advantages` icon indexing is brittle — resolved**
    - The component now maps the CMS-managed keys `sharia`, `education`, `location`, and `fees` to icons and has a fallback.
    - The schema validates the icon key, so unknown values fail the build instead of rendering an empty icon.

11. **Accessibility and responsive behavior — source-reviewed, browser verification pending**
    - Skip link, viewport scale, focusable main targets, reduced-motion handling, and decorative SVG semantics are implemented in source.
    - Responsive styles are present. Keyboard, screen-reader, breakpoint, and browser console checks were not performed in this run.

12. **404 page — resolved locally**
    - `src/pages/404.astro` provides bilingual recovery links and noindex metadata; `/404.html` is emitted by the build.

13. **External font dependency**
    - Plus Jakarta Sans is loaded from Google Fonts. It works, but self-hosting would reduce third-party dependency and improve privacy/performance.
    - Not urgent.

### Low priority / cleanup

14. `README.md` now documents the project, CMS and local commands.
15. `src/layouts/Layout.astro`, `src/components/Welcome.astro`, `src/assets/astro.svg`, and `src/assets/background.svg` appear unused.
16. No separate lint script is configured. `npm test`, `npm run check`, and `npm run build` are automated local/CI gates.
17. `siteContentSchema` validates the bilingual site files; paired services/FAQs use `pairedContentSchema` and `validatePairedContent` for unique IDs/orders and collection requirements.
18. `ActivityDocumentation` and `RoomGallery` are implemented well, but no tests cover filtering, pagination, or dialog keyboard behavior.
19. The English copy would benefit from a language review ("Contact Manager", "Safe and Halal with Sharia", service wording).
20. The scroll progress bar and reveal animations depend on progressive enhancement; fallback behavior is correct without JavaScript.

## Risks

- **Deployment risk:** uncommitted CMS work will not reach production until reviewed and committed.
- **Draft merge protection:** the repository must require the Content validation check before merging to `main`; workflow code alone cannot enable a GitHub ruleset.
- **Content risk:** unverified transaction capabilities, contact numbers, and customer eligibility could misrepresent the institution.
- **SEO risk:** the final domain must be supplied as `SITE_URL`; without it, canonical/hreflang/og:url are omitted and the sitemap contains no URLs.
- **Content risk:** both language fields are structurally stored together and required by strict builds, but CI cannot prove translations are accurate or institutional statements are factually approved.
- **Media risk:** no build-time check can prove photo authenticity, consent, or institutional approval.

## Prioritized development plan

### Phase 1 — CMS integrity (completed locally)

1. Consolidated the admin route so only `src/pages/admin/index.astro` is authoritative. Done.
2. Kept the absolute `cms-config-url` link. Done.
3. Rebuilt and confirmed no duplicate-route warning. Done.
4. Verified `/admin` and `/admin/` in a browser against the production preview. Done.
5. Confirm Turbo dashboard settings separately: repository, branch, config path, allowed origins, and site UUID. Requires owner access.
6. Review and commit the CMS/content work only when authorized. Pending.

### Phase 2 — Content accuracy and bilingual consistency (partially completed locally)

1. Move hardcoded Indonesian strings out of `OperationInfo.astro`. Done.
2. Confirm phone numbers, service capabilities, and customer eligibility with the school.
3. Review English copy for natural institutional tone.
4. Review the new paired service/FAQ collections with school editors before production use.
5. Keep all unverified content unpublished or clearly qualified.

### Phase 2.5 — CMS completeness and media safety (completed locally)

1. Add optional operation image and alt text to the bilingual data, schema, CMS config, and component. Done.
2. Replace fixed advantage icon indexes with validated CMS-managed keys and a fallback. Done.
3. Enforce unique service and FAQ display order. Done.
4. Add CMS hints for order, featured state, and the copyright year token. Done.
5. Replace missing favicons with valid placeholder assets. Done.
6. Confirm CMS save/upload/publish behavior. Requires owner access.

### Phase 3.5 — Local audit and fixes

1. Review CMS labels and clarify ambiguous English labels. Done locally.
2. Audit TypeScript `any`, institutional data validation, SEO metadata/routes, accessibility, responsive styling, performance dependencies, favicon, and metadata. Source/build audit done; browser checks pending.
3. Run build, Astro type/content checks, YAML/JSON validation, and diff check. Done locally.
4. Supply the production `SITE_URL`, then rebuild and verify canonical/hreflang, sitemap, robots, and deployed routes. Pending owner/deployment input.
5. Replace the placeholder favicon when approved official branding is available. Pending approved asset.

### Phase 4 — Content pages and gallery

1. Decide whether the one-page architecture remains or separate About/Services/Savings/Teaching Factory pages are required.
2. If separate pages are added, share one content source and avoid duplication.
3. Add real, approved gallery and activity records through the CMS.
4. Verify alt text, dimensions, consent flags, and publication status.

### Phase 5 — Quality gate

1. Add lint/typecheck scripts if the project adopts them.
2. Add focused automated tests for paired content schema and gallery behavior.
3. Verify build, routes, console, responsive layouts, keyboard navigation, reduced motion, and both languages. Build/check done; browser verification remains.
4. Re-run the CMS verification after any admin or config change.

## Decisions needed from the owner

1. Are the current WhatsApp numbers, school email, and transaction details verified for publication?
2. Should the site remain a one-page site, or should About/Services/Savings/Teaching Factory become separate routes?
3. When real Bank Mini photos and official branding assets are available, who approves their publication and alt text?
