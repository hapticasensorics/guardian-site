// Proxy haptica.ai/p/demo/* → 1context-demo.pages.dev/*
//
// Why a Function, not a _redirects rule: Cloudflare Pages _redirects
// with status 200 only rewrites paths on the same project. Cross-Pages
// proxying needs a Function that fetches the upstream and streams back
// the response. URL bar stays on haptica.ai/p/demo/...; content comes
// from the wiki Pages project.
//
// HTML responses are streamed through HTMLRewriter to prefix every
// root-absolute asset path (/assets/foo.js, /agent-ux.html, /agent-ux.md)
// with /p/demo/ so the browser routes them back through this function
// instead of hitting haptica.ai's root (which doesn't have those files).
// We never modify the upstream — the wiki keeps its absolute paths
// untouched and the rewriting happens at the proxy layer.
//
// The wiki itself is its own self-contained Pages project (preview/dist
// of bookstack-opcontext-module, deployed via wrangler pages deploy
// --project-name=1context-demo).

const UPSTREAM = 'https://1context-demo.pages.dev';
const PREFIX = '/p/demo';

// Selectors → attributes whose absolute /-rooted values must be re-rooted
// under /p/demo so they re-enter this proxy. Covers everything that
// vite emits + everything the source HTML hand-authors.
const REWRITE_TARGETS: Array<[string, string]> = [
  ['a', 'href'],
  ['link', 'href'],
  ['script', 'src'],
  ['img', 'src'],
  ['source', 'src'],
  ['video', 'src'],
  ['audio', 'src'],
  ['iframe', 'src'],
  ['form', 'action'],
];

function maybeRewrite(value: string | null): string | null {
  if (!value) return value;
  // protocol-relative (//cdn.com/foo) — leave alone
  if (value.startsWith('//')) return value;
  // already prefixed — idempotent
  if (value.startsWith(PREFIX + '/') || value === PREFIX) return value;
  // root-absolute — prefix it
  if (value.startsWith('/')) return PREFIX + value;
  // relative, hash, mailto:, http(s):// — leave alone
  return value;
}

export const onRequest: PagesFunction = async (context) => {
  const inUrl = new URL(context.request.url);
  let upstreamPath = inUrl.pathname.replace(/^\/p\/demo/, '') || '/';
  // Demo entry point is the 1Context project page, not the Einstein
  // wiki sample that the upstream's index.html happens to contain.
  // Remap the bare slash (and /index.html) so visitors landing at
  // haptica.ai/p/demo/ see the project overview without a redirect.
  if (upstreamPath === '/' || upstreamPath === '/index.html') {
    upstreamPath = '/1context-project.html';
  }
  const upstreamUrl = UPSTREAM + upstreamPath + inUrl.search;

  const init: RequestInit = {
    method: context.request.method,
    headers: new Headers(context.request.headers),
    body: ['GET', 'HEAD'].includes(context.request.method)
      ? undefined
      : context.request.body,
    redirect: 'manual',
  };
  (init.headers as Headers).delete('host');

  const upstreamRes = await fetch(upstreamUrl, init);

  // Re-anchor any Location header (Pages 308's /agent-ux.html → /agent-ux)
  // so the user stays under haptica.ai/p/demo/...
  const headers = new Headers(upstreamRes.headers);
  const location = headers.get('location');
  if (location) {
    if (location.startsWith('/')) {
      headers.set('location', PREFIX + location);
    } else if (location.startsWith(UPSTREAM)) {
      headers.set('location', PREFIX + location.slice(UPSTREAM.length));
    }
  }

  // Only HTML needs path rewriting. Markdown / CSS / JS / images pass through.
  const contentType = upstreamRes.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) {
    return new Response(upstreamRes.body, {
      status: upstreamRes.status,
      statusText: upstreamRes.statusText,
      headers,
    });
  }

  // Stream the HTML through HTMLRewriter, prefixing root-absolute URLs.
  let rewriter = new HTMLRewriter();
  for (const [selector, attr] of REWRITE_TARGETS) {
    rewriter = rewriter.on(selector, {
      element(el) {
        const next = maybeRewrite(el.getAttribute(attr));
        if (next !== null) el.setAttribute(attr, next);
      },
    });
  }

  return rewriter.transform(
    new Response(upstreamRes.body, {
      status: upstreamRes.status,
      statusText: upstreamRes.statusText,
      headers,
    }),
  );
};
