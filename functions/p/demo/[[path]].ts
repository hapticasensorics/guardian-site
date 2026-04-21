// Proxy haptica.ai/p/demo/* → 1context-demo.pages.dev/*
//
// Why a Function, not a _redirects rule: Cloudflare Pages _redirects
// with status 200 only rewrites paths on the same project. Cross-Pages
// proxying needs a Function that fetches the upstream and streams back
// the response. URL bar stays on haptica.ai/p/demo/...; content comes
// from the wiki Pages project.
//
// The wiki is its own self-contained project (preview/dist of
// bookstack-opcontext-module, deployed via wrangler pages deploy
// --project-name=1context-demo) so we never need to graft it into the
// SvelteKit build, sed-rewrite paths, or duplicate assets.

const UPSTREAM = 'https://1context-demo.pages.dev';

export const onRequest: PagesFunction = async (context) => {
  const inUrl = new URL(context.request.url);
  // Strip the /p/demo prefix; keep what follows (defaulting to "/").
  const upstreamPath = inUrl.pathname.replace(/^\/p\/demo/, '') || '/';
  const upstreamUrl = UPSTREAM + upstreamPath + inUrl.search;

  // Forward the request method, headers, and body. Drop the Host header
  // so fetch sets the upstream's Host correctly.
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

  // Pages projects sometimes 308 redirect file extensions to clean URLs
  // (e.g. /agent-ux.html → /agent-ux). Re-anchor the Location header so
  // the user stays on haptica.ai/p/demo/... rather than getting bounced
  // to 1context-demo.pages.dev.
  const headers = new Headers(upstreamRes.headers);
  const location = headers.get('location');
  if (location) {
    if (location.startsWith('/')) {
      headers.set('location', '/p/demo' + location);
    } else if (location.startsWith(UPSTREAM)) {
      headers.set('location', '/p/demo' + location.slice(UPSTREAM.length));
    }
  }

  return new Response(upstreamRes.body, {
    status: upstreamRes.status,
    statusText: upstreamRes.statusText,
    headers,
  });
};
