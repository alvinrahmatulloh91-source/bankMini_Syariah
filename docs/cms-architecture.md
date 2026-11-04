# Decap CMS and Vercel handoff

## Architecture update — bilingual services and FAQ — 2026-11-04

- Services now live in `src/content/services/<id>.json`; FAQs live in `src/content/faqs/<id>.json`. Each entry stores `id` and `en` text together, plus shared stable ID, order, and publication state. The old `items` arrays were removed from `src/data/id.json` and `src/data/en.json`; section headings and labels remain there.
- Decap exposes `services` and `faqs` folder collections. The editor changes one entry to update both language versions. Astro renders the matching localized copy at `/` and `/en/`.
- A CMS draft can leave service/FAQ translations, description, details, image, alt text, and order incomplete. Service ID and icon remain necessary to create a valid record. Astro permits incomplete content only when `VERCEL_GIT_COMMIT_REF` starts with `cms/`; local/main builds require complete localized text, valid media/alt text, unique IDs and order, at least one entry per collection, and no more than one published featured service.
- The JSON migration preserved the existing Indonesian and English wording and shared state; it did not add institutional facts. All existing service claims still require school approval before publication.
- `location.map_link` is now defined once in each language's CMS form.
- Current branch is still `main`, the backend is still `turbo-github`, Site ID and `publish_mode: editorial_workflow` are unchanged. This architecture change is local and has not been tested through a Turbo account. Draft persistence, editing, review, publish, upload, and the exact Turbo branch/PR behavior remain unverified externally.
- GitHub branch protection cannot be enabled from this workspace. A repository administrator must require **Content validation / validate** for pull requests targeting `main`; without that setting a passing workflow is not a merge gate.

### CMS editor flow for service and FAQ

Create one item in `Services` or `FAQ bilingual`, enter its stable ID, and fill either/both language fields as available. Save it as an Editorial Workflow draft. Reopen the same workflow item to continue; complete both translations, unique order, and any image alt text before requesting review. The workflow must be tested with the official account before treating this as operational. Do not create matching ID and EN items separately.

### External handoff still required

The school must confirm contact details, service claims, costs, hours, address, and official image/logo assets. The owner must provide the chosen domain; then set Astro `SITE_URL` to its HTTPS origin and add the exact admin origin to the existing Turbo site. An authorized GitHub administrator must configure branch protection. No production deployment or domain is claimed here.

## CMS `site-content` Save validation — 2026-11-04

- The source audit found four optional list widgets that had no explicit `required: false`: `about.timeline`, `process.steps`, `advantages.items`, and `contact.people`, in both language forms. Decap fields are required by default when `required` is omitted, even when child fields are optional. This matches Astro's `default([])`/empty-array schema behavior for these lists.
- These four list widgets are now explicitly optional. Existing required structure remains: site-content section objects are present in the document, and the advantage icon select stays required with its `sharia` default. Core publication copy remains strict in `siteContentSchema` for non-CMS/local and `main` builds.
- Tests assert both language forms mark the optional lists optional, empty lists parse, and a blank essential hero headline is rejected. The live Decap/Turbo Save action is not available here, so the configuration fix has not been end-to-end verified in the authenticated CMS UI.
- For Decap's configuration rules, `required: false` marks a widget optional; omitted `required` defaults to true. See the official [configuration options](https://decapcms.org/docs/configuration-options/) and [widget documentation](https://decapcms.org/docs/widgets/).
- Follow-up status: the user reports the same toast after the local config change. Therefore the four list defaults are a confirmed config defect, but are not yet confirmed as the sole cause of the observed CMS failure. The worktree change is not committed or deployed; a live CMS still serves its existing deployed config. If the user is testing locally, the red field/section in the Decap form is needed to identify any remaining validation source.

## Current continuation status — 2026-11-04

- The repository still uses the existing bilingual section-based pages, CMS collections, Turbo backend, site ID, and `main` branch.
- `docs/admin-guide.md` provides step-by-step editor guidance. It does not represent a successful Turbo account test: login, partial draft save, resume, review, publish, and upload still need an authorized administrator to test.
- `npm run check`, `npm run build`, config/data parsing, and both Git diff whitespace checks passed in this continuation. The audit and CMS workflow test limits are recorded in `docs/project-audit.md`.
- The workflow source is present; GitHub branch protection must still require **Content validation / validate**. Vercel has not been configured, and production `SITE_URL` remains unset until the school chooses its domain.

## Phase 3.5 audit note — 2026-11-04

- The English content file's CMS labels were reviewed and ambiguous generic section labels were clarified in `public/admin/config.yml`. Interface labels are language-specific; the content values remain editor-managed bilingual copy.
- `src/data/siteContentSchema.ts` validates required copy, HTTPS map links, email/phone formats, media paths and alt text, stable IDs, unique order values, and featured-service constraints. `src/content.config.ts` requires paired Indonesian/English gallery/activity text and checks image dimensions; identifiable student photos require confirmed permission before publication. These checks cannot verify factual accuracy, image rights, or consent evidence on their own.
- SEO metadata, sitemap, and robots routes use Astro's `site` value. Set `SITE_URL` to the final production origin at build time. Until set, canonical and language-alternate links are omitted and the sitemap contains no page URLs. Do not substitute a guessed domain.
- Phase 3.5 local verification: `npm run check` (29 files, zero diagnostics), `npm run build` (4 pages/routes), YAML/JSON parsing, and `git diff --check` pass. Empty gallery/activity collection warnings are expected because no approved records exist.
- Browser checks were not repeated in this run: Firefox is installed but no WebDriver executable is available, and the Astro background dev server exited before becoming ready. Earlier browser results elsewhere in this document describe a prior run and do not verify changes from this audit.
- There are no real image assets. The favicon remains a placeholder; image performance/rights cannot be assessed, and Google Fonts remains a third-party performance/privacy dependency. CMS authentication and publish/upload still require authorized Turbo account access.

## Draft saving and publication workflow — 2026-11-04

`publish_mode: editorial_workflow` is enabled while keeping `backend.name: turbo-github`, the configured site ID, and publication branch `main`. Decap's official documentation lists Decap Turbo as a supported Editorial Workflow backend. It describes saving drafts to `cms/<collection>/<entry>` branches and publishing by merging the review pull request. See [Decap Editorial Workflows](https://decapcms.org/docs/editorial-workflows/) and [Turbo GitHub backend](https://www.npmjs.com/package/decap-cms-backend-turbo-github).

### How editors use it

1. Open an entry in Decap and enter its stable ID first when creating a service, FAQ item, room photo, or activity. IDs are required because they pair translations or define file paths.
2. Fill any available copy, contact details, dates, and media fields. Fields marked optional can stay blank while work is in progress. Existing values in the bilingual homepage files are preserved when editing; optional does not mean editors should erase verified content.
3. Save as a draft. Editorial Workflow stores the change on its `cms/...` branch and opens a review pull request; it does not commit the draft to `main`.
4. To continue later, reopen the entry from the Decap Workflow screen and its Draft/In review state, then save again. The update remains on the same workflow branch/pull request.
5. Before approval, complete required publication data: verified institution/contact information, both language versions, unique service/FAQ ID and order, image paths and alt text, and student-photo permission where applicable. Set the entry's separate `Show on site` flag when it should appear on the public site.
6. Move the workflow entry to review and use Decap's publish/approve action only after review. That action merges the pull request into `main`; publishing an entry whose separate on-site `published` flag is false still leaves it hidden from the public pages.

### Optional fields and validation boundary

- Editorial text, translations, descriptions, contact copy, and optional media metadata may be left blank temporarily. Stable IDs, schema shape, icon selections, and student-consent flags remain structurally available. The number/order fields may be left blank on draft branches; the strict production schema still requires integer, unique service/FAQ orders.
- Astro accepts incomplete content only when `VERCEL_GIT_COMMIT_REF` starts with `cms/`, matching Decap's documented branch pattern and [Vercel's system branch variable](https://vercel.com/docs/environment-variables/system-environment-variables). Local builds and builds of `main` remain strict. Production validation retains required copy, valid email and phone formats, HTTPS map links, safe/existing media paths, image alt text, bilingual service/FAQ text in the same entry, unique IDs/orders, minimum service/FAQ entries, and photo-permission checks.
- `.github/workflows/content-validation.yml` runs `npm run check` and `npm run build` in strict mode on pull requests to `main` and pushes to `main`. To block publishing an incomplete PR, a repository administrator must require the **Content validation / validate** check in GitHub branch protection. That account-level rule has not been inspected or enabled from this workspace; without it, CMS Editorial Workflow still keeps drafts on `cms/...` until someone publishes/merges, but GitHub does not enforce the new check as a merge gate.
- A local paired service fixture confirmed incomplete fields build on `cms/...`; after marking that incomplete fixture publishable, a strict `main` build rejected missing bilingual copy and order. The fixture was removed. `npm run check` alone does not run full content validation; the build is the content validation step in CI.
- The authenticated Decap 3.17.0 interface was not available in this session. Therefore the UI's Save draft/resume/publish interaction and required-field behavior were **not** end-to-end tested. Decap documents `required: false` as making a widget optional, but that documentation and the local schema/build tests do not prove the configured Turbo account can save or publish entries. Do not treat CMS draft saving as verified until an editor tests it in Turbo.

## Current architecture

- Astro 7 builds a static site to `dist/`; no server adapter or CMS secrets are required for the public site.
- The GitHub content branch is `main`.
- `src/pages/admin/index.astro` serves `/admin/` in Astro dev and static output, loading the stable Decap CMS 3.17.0 bundle. `public/admin/config.yml` provides its CMS configuration. Turbo backends are included in that release.
- `public/admin/config.yml` uses `turbo-github`, omits `repo` as required by Turbo, and contains the Turbo site UUID supplied by the project owner.
- `src/data/id.json` and `src/data/en.json` hold localized homepage section copy and remain separate CMS file entries. Service and FAQ entries use the paired folder collections described above.
- Room photos use the existing `roomGallery` collection in `src/content/room-gallery/`. Activity documentation uses `activityDocumentation` in `src/content/activities/`. Both store Indonesian and English strings together in one record.
- `public/images/bank-mini/` is the Git-backed media directory and `/images/bank-mini/` is its public URL prefix.

CMS content is consumed by the public Astro pages. Service, FAQ, gallery, and activity records are Astro content collection entries, with localized text in each item. Public rendering filters the publication flags. Identifiable student photos cannot pass build validation as published unless the permission flag is confirmed.

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

- Edit both `Konten Bahasa Indonesia` and `English website content` for general site copy. Add or change a service or FAQ once in its bilingual collection and fill both language fields before review.
- Service and FAQ IDs and display orders must be unique within their collection. The Astro build rejects duplicate IDs/orders.
- The operation section now has an optional photo and alt text. If a photo is set, alt text is required. The `practice_label` and `practice_title` fields control the overlay on both language pages.
- Advantage icons use the stable keys `sharia`, `education`, `location`, and `fees`; choose one from the CMS select field. The component has a fallback, but unknown keys fail schema validation.
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
