# Epitome Kia Whitefield — Customer Review Portal

A mobile-first web app that customers open by scanning a QR code at the
showroom. They pick what they appreciated about their visit, an AI drafts a
short, genuine-sounding Google review from **only** what they selected, they
can edit it freely, then copy it and finish posting it on Google themselves.

The app never submits anything to Google automatically — the customer always
does the final paste-and-submit step by hand.

---

## 1. What the application does

1. Customer scans a QR code → opens the portal on their phone.
2. Welcome screen with Epitome + Kia branding → **Share Your Experience**.
3. Customer selects one or more experience categories (Sales Experience,
   Staff, Hospitality, Finance, Insurance, Accessories, etc.).
4. The app calls OpenAI (server-side) to draft a first-person review that
   mentions **only** the selected categories — no invented names, models,
   prices, discounts, or events.
5. Customer edits the draft freely in a textarea, or taps **Generate
   Another** for a different version.
6. Customer taps **Copy Review & Continue** → the review is copied to their
   clipboard.
7. **Open Google Reviews** opens the dealership's Google review page in a new
   tab, where the customer pastes and submits it themselves.

Only one outlet is live in V1: **Epitome Kia Whitefield**. The codebase is
already structured to add more outlets later (see §8).

---

## 2. Tech stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- OpenAI API (official `openai` SDK), called only from a server route
- Self-hosted fonts (`@fontsource/inter`, `@fontsource/manrope`) — no
  third-party font requests at runtime
- No database. No customer data is stored anywhere.

---

## 3. Install and run locally

Requires Node.js 20+ (Node 22 recommended) and npm.

```bash
npm install
cp .env.example .env.local
# edit .env.local and paste your real OpenAI key
npm run dev
```

Open http://localhost:3000 — it redirects to `/review/whitefield`.

To type-check, lint, and build exactly as CI/Vercel would:

```bash
npx tsc --noEmit
npm run lint
npm run build
npm start
```

All three currently pass cleanly on this codebase.

---

## 4. Configuring `OPENAI_API_KEY`

The key is read **only** in `app/api/generate-review/route.ts`, a
server-side API route. It is never sent to the browser and never appears in
any client-side bundle.

Local development: put it in `.env.local` (already git-ignored):

```
OPENAI_API_KEY=sk-...your key...
```

Optional variables (see `.env.example`):

- `OPENAI_MODEL` — defaults to `gpt-4o-mini` if unset.
- `NEXT_PUBLIC_ANALYTICS_ENABLED` — `true` to enable the anonymous event
  hook in `lib/analytics.ts` (off by default).

**Never commit a real key.** `.gitignore` already excludes `.env*`.

---

## 5. Deploying to Vercel

1. Push this repository to GitHub (or GitLab/Bitbucket).
2. In Vercel: **New Project** → import the repo → framework preset
   "Next.js" is auto-detected.
3. Under **Environment Variables**, add:
   - `OPENAI_API_KEY` = your real key
   - (optional) `OPENAI_MODEL`, `NEXT_PUBLIC_ANALYTICS_ENABLED`
4. Deploy. No other configuration is required — there's no database to
   provision for V1.
5. After your first deploy, update `metadataBase` in `app/layout.tsx` from
   the placeholder `https://reviews.epitomekia.example` to your real
   production domain (used for Open Graph tags).

---

## 6. Adding the logo files

The repo ships with clearly-labeled **placeholder** wordmark images so the
app never shows a broken image:

```
public/epitome-logo.png   ← replace with the real Epitome Automobiles logo
public/kia-logo.png       ← replace with the real Kia logo
```

To use the real logos:

1. Export each logo as a PNG with a transparent background, roughly
   300–600px wide (the component scales height automatically).
2. Replace the two files above, keeping the same filenames.
3. Also replace `app/favicon.ico` with a real favicon if you have brand
   guidelines for one (a generator like realfavicongenerator.net works well).

If a logo file is ever missing or fails to load, `components/BrandHeader.tsx`
automatically falls back to a plain text wordmark instead of a broken image
icon, so the app degrades gracefully either way.

---

## 7. Changing the Google Review URL

Edit `lib/config.ts`:

```ts
whitefield: {
  ...
  googleReviewUrl: "https://maps.app.goo.gl/r2dWCvdDfYWdHF6Q6",
  ...
}
```

Replace the URL with the correct Google review link for that outlet (Google
Business Profile → "Ask for reviews" gives you this short link).

---

## 8. Adding future dealerships

Every outlet is defined in one place: `lib/config.ts`. To bring a new
outlet online:

1. Open `lib/config.ts` and find its (already scaffolded) entry — Yelahanka,
   Kolar, Avalahalli, and Varthur are already present but inactive.
2. Fill in the real `googleReviewUrl` and any other details.
3. Set `active: true`.
4. Generate a QR code that points at `/review/<slug>`, e.g.
   `https://yourdomain.com/review/yelahanka`.

No other code changes are needed — the page, its SEO metadata, and the API
route all read from this same config. Outlets left `active: false` show a
friendly "coming soon" screen instead of the review flow, and unknown slugs
show a branded 404.

---

## 9. Generating a QR code

Any QR generator works since it just needs to encode a URL:

1. Decide the final URL, e.g. `https://reviews.epitomekia.com/review/whitefield`
   (or just the root domain, which redirects to Whitefield in V1).
2. Use a QR tool such as the free generator at https://www.qr-code-generator.com
   or the `qrencode` CLI:
   ```bash
   qrencode -o whitefield-qr.png -s 10 "https://reviews.epitomekia.com/review/whitefield"
   ```
3. Print it and place it at the showroom counter / delivery desk / service
   reception — wherever the customer's positive experience concludes.

---

## 10. Security considerations

- **API key**: only read server-side in the API route; never exposed to the
  client, never logged.
- **Input validation**: the API route only accepts category ids from a fixed
  server-side whitelist (the customer never types free text that reaches the
  AI prompt), rejects unknown dealership slugs, caps the number of
  categories, and rejects malformed JSON.
- **Body size limit**: requests over 4KB are rejected before parsing.
- **Rate limiting**: an in-memory limiter (10 requests / 5 minutes per IP) is
  applied to `/api/generate-review`. This is a reasonable V1 trade-off for a
  single-showroom, low-traffic QR flow, but it resets on cold start and is
  per-instance, not global, in a serverless environment. For higher-traffic
  or multi-region production use, swap in a persistent store — see the
  comments in `lib/rate-limit.ts` for a drop-in path using
  `@upstash/ratelimit` + Upstash Redis (works natively on Vercel) or Vercel
  KV, without changing any calling code.
- **No data storage**: no database is used. Generated review text is never
  logged or persisted anywhere on the server; only generic error types are
  logged (never request content).
- **Error handling**: OpenAI/network errors are caught and translated into
  a single friendly message; raw errors and stack traces are never sent to
  the client.
- **Clipboard failures**: if `navigator.clipboard.writeText` is blocked (e.g.
  by browser permissions), the customer is told to copy manually from the
  textarea and can still continue to Google Reviews.
- **Dependency audit**: `npm audit` currently flags some advisories in
  build-time tooling (ESLint plugins, PostCSS via Next's build pipeline,
  and `sharp`'s image-optimization library). These affect the build/tooling
  chain rather than a runtime attack surface exposed to customers, but it's
  worth re-running `npm audit` periodically and updating dependencies as
  patched versions become available.

---

## 11. Project structure

```
app/
  api/generate-review/route.ts   AI generation endpoint (server-only)
  review/[location]/page.tsx     Per-dealership review portal page
  layout.tsx, page.tsx           Root layout + redirect to default outlet
  not-found.tsx                  Branded 404
  globals.css                    Design tokens, fonts, base styles

components/
  BrandHeader.tsx        Logo lockup with graceful fallback
  WelcomeScreen.tsx      Step 1
  ExperienceSelector.tsx Step 2 (category multi-select)
  ReviewGenerator.tsx    Step 3 (loading state)
  GenerationError.tsx    Step 3 failure state ("Try Again")
  ReviewEditor.tsx       Step 4 (editable draft + actions)
  SuccessScreen.tsx      Step 5 (copied + open Google)
  ComingSoon.tsx         Placeholder for not-yet-active outlets
  ProgressIndicator.tsx  The "road" progress motif
  icons.tsx              Small hand-built line-icon set (no icon dependency)

lib/
  config.ts          Central dealership registry + experience categories
  review-prompts.ts  System/user prompt construction, tone variation
  rate-limit.ts       Rate limiter abstraction (in-memory for V1)
  analytics.ts        Optional, anonymous-only event hook
  types.ts            Shared TypeScript types

public/
  epitome-logo.png, kia-logo.png   Placeholder logos — replace per §6
```

---

## 12. What was verified before delivery

- `npx tsc --noEmit` — no type errors
- `npm run lint` — no lint errors
- `npm run build` — production build succeeds
- Manual route smoke tests: root redirect, active outlet (200), inactive
  outlet ("coming soon"), unknown slug (branded 404), favicon/logo assets
  (200)
- API route validation tested directly: missing API key, invalid category
  id, empty category list, inactive/unknown dealership, malformed JSON,
  too many categories, and wrong HTTP method all return the correct
  friendly errors/status codes without leaking internal details
- Server logs checked to confirm no review text or category selections are
  ever written to logs
