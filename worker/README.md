# Design Lab Worker

The only server in this project. It holds the model key, caps spend, and proxies
the Design Lab's generation requests. The site itself stays a static GitHub
Pages deploy.

The request schema and validator are imported from `../src/lib/designlab/`
rather than copied, so the client and the Worker cannot disagree about the
contract.

## Deploy

```bash
cd worker
npx wrangler kv namespace create CACHE
```

Paste the returned id into `wrangler.toml` under `[[kv_namespaces]]`, then:

```bash
npx wrangler secret put GEMINI_API_KEY
```

```bash
npx wrangler deploy
```

Take the deployed URL and set it as a **repository variable** (not a secret,
it is public by design) named `VITE_DESIGNLAB_ENDPOINT`, pointing at the
Worker's `/` route. The build reads it in `.github/workflows/main.yml`.

For local development, put the same URL in `.env`:

```
VITE_DESIGNLAB_ENDPOINT=https://designlab.<your-subdomain>.workers.dev
```

## Without it

The site works with no Worker at all. `src/lib/designlab/client.ts` falls back
to the recorded runs in `fixtures.ts` for the three example briefs and says so
in the UI; a custom brief reports that live generation is off. Nothing renders
broken.

## Models

`MODEL` is primary, `FALLBACK_MODEL` is tried only on a transient 5xx or 429.
Both were verified against a real key with `scripts/probe_model.mjs`: each
returns schema-constrained JSON that passes referential validation and compiles
to OpenAPI with no unresolved refs.

| Model | Schema contract | Observed availability | Role |
|---|---|---|---|
| `gemini-3.6-flash` | PASS | 6 successes, 0 failures | primary |
| `gemini-3.7-flash` | PASS | 2 successes, 5x HTTP 503 | fallback |

Both satisfy the contract equally, so the order is set by availability rather
than version number. A 503 on the primary costs the reader a whole extra
sequential call: one measured request took 78s because the primary stalled
before erroring. Each call is now capped at 25s so a stalled primary hands over
quickly.

Before changing `MODEL`, run the probe. A model that quietly ignores
`responseSchema` breaks the entire design, and this catches it in one call
rather than after a deploy:

```bash
node --experimental-strip-types scripts/probe_model.mjs gemini-3.7-flash
```

## Limits

| Setting | Default | Purpose |
|---|---|---|
| `RATE_PER_HOUR` | 8 | Requests per IP per hour |
| `DAILY_CAP` | 300 | Hard ceiling on model calls per UTC day |
| cache TTL | 30 days | Identical briefs never hit the model twice |

KV is eventually consistent, so the counters are a budget guard rather than a
precise quota: a burst can leak a few extra calls. That is deliberate — the
worst case is a few cents, and the alternative (a durable object per IP) is more
moving parts than this demo justifies.
