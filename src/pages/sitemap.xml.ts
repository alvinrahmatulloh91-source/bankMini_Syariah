import type { APIRoute } from 'astro';

const paths = ['/', '/en/'];

export const GET: APIRoute = ({ site }) => {
  const urls = site
    ? paths.map((path) => `<url><loc>${new URL(path, site).href}</loc></url>`).join('')
    : '';
  const note = site ? '' : '<!-- Set SITE_URL to populate this sitemap. -->';
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${note}${urls}</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
  );
};
