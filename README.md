# Mohamed Samy, portfolio

Personal site and portfolio. Live at
**[mohamedsamy911.github.io](https://mohamedsamy911.github.io/)**.

A static React site on GitHub Pages, plus one Cloudflare Worker that backs the
Design Lab. The Worker exists only because the site is static and a model API
key must never reach the browser.

---

## Design

The whole site renders from a single token layer in
[`src/index.css`](src/index.css). No component holds a colour.

| | Light | Dark |
|---|---|---|
| paper (page) | `#FAF7F2` | `#131211` |
| ink (text) | `#1B1917` | `#F0EBE2` |
| accent | `#A33B12` | `#E8944B` |

Type is a system stack: Charter (falling back through Georgia) for display, the
system sans for body, system mono for labels and metadata. No web fonts, so
there is no font request and no layout shift.

Layout follows one rhythm everywhere: a hairline rule, a mono section index in
the left gutter, content set against it. Sections are numbered `01`–`05`.

Themes swap by class. Tailwind v4 is CSS-first and ignores `tailwind.config.js`,
so `@custom-variant dark` in `index.css` is what makes `dark:` follow the toggle
rather than the operating system.

---

## The Design Lab

The interesting part. Type a project brief; get back a service split, a domain
model, an HTTP surface, and the reasoning, plus a downloadable `openapi.yaml`.

The model is never asked for a document. It is constrained to a typed graph, and
everything on screen is compiled from that graph by ordinary TypeScript:

```
brief -> responseSchema -> ProposalGraph (JSON)
                                 |
              +------------------+------------------+
              v                  v                  v
        validate.ts         openapi.ts          layout.ts
     referential           graph -> OAS 3.1   graph -> SVG
      integrity              (no model)        (no model)
              |
       fails -> one repair pass with the errors fed back, then rejected honestly
```

A JSON schema can guarantee shape but not meaning. `validate.ts` checks what
schemas cannot: every endpoint resolves to a declared service, every request and
response body names a declared entity, no duplicate routes, no service depending
on itself, no `GET` carrying a body. Failures are fed back for exactly one repair
pass; if the design still fails, it is rejected rather than rendered.

The "Show the machinery" panel exposes the schema sent, the raw graph returned,
latency, token counts and whether the repair pass ran.

**Without a Worker configured the section still works.** It seeds from recorded
runs in `fixtures.ts` with no network call at all, labelled as recorded. Only an
explicit submit reaches the model.

| Path | Files |
|---|---|
| Core (pure, no network) | [`src/lib/designlab/`](src/lib/designlab/) |
| UI | [`src/components/DesignLab.tsx`](src/components/DesignLab.tsx), [`src/components/designlab/`](src/components/designlab/) |
| Proxy | [`worker/`](worker/) — see [worker/README.md](worker/README.md) |

---

## Stack

- **React 19** + **TypeScript**, built by **Vite 7**
- **Tailwind CSS v4** (CSS-first, no config file)
- **No animation library.** Scroll reveals are `IntersectionObserver` plus a CSS transition; the hero does not animate at all, because its entrance was costing 3.3s of LCP on a throttled phone
- **lucide-react** icons, **react-scroll** for section navigation
- **EmailJS** for the contact form
- **Cloudflare Workers** + KV for the Design Lab proxy, cache and spend cap
- **Playwright** for the quality gates, asset generation and performance measurement

Deployed to GitHub Pages by [`.github/workflows/main.yml`](.github/workflows/main.yml).
The build runs `tsc`, the unit tests, `vite build`, then `prerender.mjs`, which
renders the SPA headlessly and writes real HTML back to `dist/index.html` so
crawlers and social scrapers see content without executing JavaScript.

---

## Setup

```bash
git clone https://github.com/mohamedsamy911/mohamedsamy911.github.io.git
cd mohamedsamy911.github.io && npm install
```

```bash
npm run dev
```

Runs on `http://localhost:5173`.

### Environment

All variables are `VITE_`-prefixed and therefore **inlined into the public
bundle**. Only ever put public values here.

```env
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
VITE_GA_MEASUREMENT_ID=G-...
VITE_DESIGNLAB_ENDPOINT=https://designlab.<subdomain>.workers.dev
```

The model API key is **not** in this list and must never be added to it. It
lives as a Cloudflare Worker secret. Analytics stay denied until the visitor
accepts the consent banner.

### Scripts

| Command | Does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Typecheck, build, prerender to `dist/` |
| `npm test` | Unit tests for the Design Lab core, no network |
| `npm run lint` | ESLint |
| `npm run preview` | Serve the production build |

---

## Performance

Measured on the production build at 4G with 4x CPU throttling, medians of four
runs. The numbers below are from `scripts/`-style Playwright runs, not estimates.

| | LCP | Bundle (gzip) |
|---|---|---|
| Before | 4448 ms | 129.8 KB |
| Hero entrance animation removed | 2636 ms | 129.8 KB |
| Animation library removed | **2448 ms** | **91.0 KB** |

CLS is 0 throughout. The hero portrait is also emitted at 2x display size and
pre-desaturated rather than being a 1.35-megapixel source filtered in CSS,
though that turned out to be worth only ~3% at 4G: the entrance animation was
the real cost, not the image.

## Quality gates

Correctness here is measured, not asserted. Everything below produces real
output from a real render.

```bash
npm test                                 # 44 unit tests: compiler, validator, layout
node scripts/verify_live.mjs             # contrast, focus, target size, axe, responsive
node scripts/verify_interactions.mjs     # theme, nav, skip link, reduced motion, the lab
```

`verify_live.mjs` walks every rendered text node computing real composited
contrast in both themes, checks focus indicators and target sizes, runs axe-core
against WCAG 2.2 AA, and asserts no horizontal overflow at 280/320/414px. Both
gate scripts need the dev server running.

Two further scripts talk to the model and are therefore manual:

```bash
node --experimental-strip-types scripts/probe_model.mjs gemini-3.6-flash
node --experimental-strip-types scripts/eval_designlab.mjs <worker-url>
```

`probe_model.mjs` verifies a model actually honours the response schema; run it
before changing `MODEL`, because a model that ignores the schema breaks the
whole design. `eval_designlab.mjs` runs the example briefs against the deployed
Worker and reports a pass rate; it is wired to `workflow_dispatch` only, never to
a push, since model output is non-deterministic.

---

## Brand assets

Icons and the social card are generated from source rather than committed as
mystery binaries:

```bash
node scripts/generate_brand_assets.mjs
```

Produces `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` (180),
`icon-192.png`, `icon-512.png` and `og-image.png` from the same palette the site
uses. Rendering depends on the local system serif, so outputs are committed
rather than rebuilt in CI.

---

## Deployment

**Site** — push to `master`; GitHub Actions builds and publishes to Pages.
`VITE_DESIGNLAB_ENDPOINT` is a repository *variable*; the rest are secrets.

**Worker** — deployed separately:

```bash
cd worker && npx wrangler deploy
```

Full setup, model choice and rate limits are in [worker/README.md](worker/README.md).

---

## License

MIT.

## Contact

- Email: [mohamedadel74@gmail.com](mailto:mohamedadel74@gmail.com)
- LinkedIn: [mohamed-samy-ba0107141](https://www.linkedin.com/in/mohamed-samy-ba0107141/)
- GitHub: [mohamedsamy911](https://github.com/mohamedsamy911)
