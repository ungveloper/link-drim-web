# LinkDrim Architecture (2026-10-29, stage 1)

The design pattern follows the **reference archive's route → section → common component → data** separation, without importing hospital-specific text, images, CSS tokens or Prisma models.

- `app/`: App Router screens and server endpoints.
- `components/templates/`: public presentation templates and shared analytics/link widgets, inspired by `about/doctors` detail sections and `academics` data-driven lists.
- `components/dashboard/`: two-menu customer dashboard, form-driven editor, super-admin console.
- `components/ui/`: reused primitive header and field styles. **UI is Tailwind `className` only**. The one global CSS file is `@import "tailwindcss"` exclusively.
- `lib/templates.ts`: typed common content, template registry, required fields. A template version is **not auto-upgraded**.
- `lib/actions.ts`, `lib/auth.ts`, `lib/supabase/`: server actions, role checks, Supabase Auth/DB.
- `db/migrations/001_core.sql`: RLS, atomic save with optimistic revision, one-time invitation and snapshots, analytics, storage.

## Implemented vertical slice

- Responsive marketing landing page and reusable profile, business-card, and link public templates; demo pages.
- Google/Kakao/Custom OAuth (`custom:naver`) sign-in wiring; one-use 7-day invitation flow.
- Multi-site membership, server-super-admin gate, scoped client dashboard, 2 menu items.
- Single-page editor: enabled templates, common profile data, required fields, slug check, links with up/down reordering/pinning, color theme, client-side optimized image upload, preview, explicit save.
- Server-side final slug uniqueness through PostgreSQL constraint; revision-guarded transactional saves; audit snapshots.
- Basic privacy-minimized public event ingestion, aggregated dashboard indicators; vCard download.
- Admin site creation, invitations, member revocation, recent error overview.

## Still required before production / not misrepresented as complete

- Full Notion **bidirectional** sync and webhook loop prevention, custom-domain DNS verification, SSL onboarding, canonical per-tenant domains.
- Scheduled analytics archival, comprehensive reporting periods, bot filtering, rate limits and production-quality charting.
- Template release management/version upgrade UI, private templates and no-rollback guarantees.
- Advanced admin history viewer, restore/reset UI; **SQL restore function exists but UI does not**.
- Provider configuration for Google, Kakao and Naver (needs real credentials, redirects), production secrets and separate Supabase environments.
- Image crop positioning/zoom interface (upload is currently optimized/compressed, not user-directed crop).
- Site lifecycle controls, reliable notifications, CSV export, and full automated test coverage.
- Site-specific SEO settings UI and multi-domain host routing.

**Do not connect real customers until security testing and provider configuration are complete.** Supabase RLS, invite and server-side role enforcement must be verified end to end.

## Security notes

Admin service role credentials exist **only on the server** and must never use `NEXT_PUBLIC_` prefix. Any client form is treated as untrusted. The analytics endpoint intentionally accepts anonymous events and is vulnerable to spoofed/bot traffic until rate limiting and additional measures are applied. Invites are hashed in database and used once. A leaked invite link can be claimed by its first holder; add confirmation before public launch.
