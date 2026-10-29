<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## LinkDrim-specific development and delivery rules

Read `docs/DELIVERY_CONVENTIONS.md` before modifying or delivering LinkDrim code. In short: UI styling uses Tailwind `className`, reused UI lives in components, each delivery must include a ZIP and macOS apply script for `/Users/ungveloper/Desktop/UNG/link-drim-web`, and a verified successful application runs `git commit` then `git push -u origin main`. Commit messages use only `추가:`, `고침:`, or `변경:` according to purpose. Never push code if validation fails or overwrite uncommitted user work.
