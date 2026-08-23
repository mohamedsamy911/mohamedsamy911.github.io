#!/usr/bin/env node
/**
 * Is the Design Lab endpoint serving the API, or has something deployed over it?
 *
 * This has happened twice: a Git-connected Cloudflare build redeployed the
 * *site* onto the `designlab` Worker, which then answered every API call with
 * static HTML and a bare 405, and wiped the GEMINI_API_KEY secret. The symptom
 * in the browser is a CORS error, which points nowhere near the real cause.
 *
 * Usage: node scripts/verify_worker.mjs [url]
 * Exit 1 if the endpoint is not a healthy API.
 */
const URL_ = process.argv[2] || "https://designlab.mohamedadel74.workers.dev";
const ORIGIN = "https://mohamedsamy911.github.io";
let bad = 0;
const check = (ok, msg) => { if (!ok) bad++; console.log(`${ok ? "pass" : "FAIL"}  ${msg}`); };

// 1. A GET must be the Worker's JSON 405, never HTML.
const get = await fetch(URL_).catch(() => null);
const ctype = get?.headers.get("content-type") ?? "";
check(Boolean(get), "endpoint reachable");
check(!ctype.includes("text/html"), `GET is not HTML (content-type: ${ctype || "none"})`);
check(get?.status === 405, `GET returns 405 Use POST (got ${get?.status})`);

// 2. Preflight must be allowed for the site origin, with CORS headers present.
const pre = await fetch(URL_, {
  method: "OPTIONS",
  headers: {
    origin: ORIGIN,
    "access-control-request-method": "POST",
    "access-control-request-headers": "content-type",
  },
}).catch(() => null);
check(pre?.status === 204, `preflight returns 204 (got ${pre?.status})`);
check(
  pre?.headers.get("access-control-allow-origin") === ORIGIN,
  `preflight allows ${ORIGIN}`
);

// 3. An unknown origin must still be refused.
const badOrigin = await fetch(URL_, {
  method: "POST",
  headers: { origin: "https://evil.example", "content-type": "application/json" },
  body: JSON.stringify({ brief: "x" }),
}).catch(() => null);
check(badOrigin?.status === 403, `disallowed origin refused (got ${badOrigin?.status})`);

// 4. The secret must be present. An empty brief is rejected before any model
//    call, so this costs nothing and no quota.
const empty = await fetch(URL_, {
  method: "POST",
  headers: { origin: ORIGIN, "content-type": "application/json" },
  body: JSON.stringify({ brief: "   " }),
}).catch(() => null);
const body = await empty?.json().catch(() => ({}));
check(empty?.status === 400, `empty brief rejected with 400 (got ${empty?.status})`);
check(
  typeof body?.error === "string" && /brief/i.test(body.error),
  `error body is the Worker's own JSON (${JSON.stringify(body?.error ?? body).slice(0, 60)})`
);

console.log(bad === 0 ? "\nWORKER HEALTHY" : `\n${bad} CHECK(S) FAILED - the API has been overwritten or misconfigured`);
process.exit(bad ? 1 : 0);
