// Bare /p/demo/ — re-uses the catchall handler so the proxy logic
// lives in one place. Cloudflare Pages Functions doesn't always route
// a bare directory request through [[path]].ts, so this index file
// makes the root-of-prefix case explicit.
export { onRequest } from './[[path]]';
