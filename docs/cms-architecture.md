# CMS architecture and deployment requirements

## Current project state

The public site is built as static Astro output. The repository has no Git remote, deployment host configuration, administrator identity provider, or uploaded Bank Mini photographs. Static output can host the Decap editor, but it cannot itself authenticate administrators or write commits to a repository.

## Recommended first deployment

Use Decap CMS with the GitHub backend and Decap Turbo for hosted authentication and repository access. Decap Turbo is the preferred low-operations route for a static Astro deployment. The site owner must create and authorize the Turbo organization/site, connect the production GitHub repository, and configure the deployed admin origin. Those account-level connections cannot be completed from this source workspace.

An alternative is Netlify Identity with Git Gateway on a Netlify deployment. A self-hosted OAuth/Git Gateway is also possible, but requires an independently operated authentication service and secure server-side credentials. Do not use a client-side password or expose a Git token in the browser.

## Content model

The bilingual site JSON is validated at build time for the hero, profile, services, FAQ, contact, and location fields. The `roomGallery` Astro content collection validates paired Indonesian and English title, description, and alternative text, plus category, image path, image dimensions, ordering, featured state, and publication state. Missing publication state defaults to draft. Public pages render only published records. These schemas are ready for CMS integration, but administrators cannot edit them through a CMS until the Decap editor configuration is connected to the chosen Git backend.

Put original, approved image files in `public/images/bank-mini/` and reference them with `/images/bank-mini/<filename>`. Add a JSON record under `src/content/room-gallery/` with both locales. Record the real pixel dimensions. Set `published` to `true` only after checking image rights, alt text, translation, and content accuracy. The fixed category suggestions on the public page are documentation prompts; they do not assert that each facility exists.

## Remaining deployment inputs

Before implementing `/admin` and the Decap configuration, the site owner must provide or establish:

- The GitHub repository to which CMS edits should commit.
- The production host and public site origin (including the admin origin).
- An authorized Decap Turbo connection, or confirmation of Netlify Identity/Git Gateway instead.
- Approved contact details and any real facility or activity content intended for publication.

Until then, this project intentionally has no login page or client-side authorization masquerading as a CMS.
