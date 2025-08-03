import { format } from "date-fns";

/**
 * Dynamically generates `sitemap.xml` for the site at request time.
 *
 * You can add additional dynamic routes here (e.g. blog posts)
 * by fetching them from your CMS or database.
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"; // <-- CHANGE ME

  // List all the static routes of your site here. For dynamic routes, fetch the
  // slugs and push them to this array.
  const staticRoutes: string[] = [
    "", // homepage
    "cookie-policy",
    "privacy-policy",
    "terms-of-service",
  ];

  const urls = staticRoutes.map((route) => {
    const path = route ? `/${route}` : "/";
    return {
      loc: `${baseUrl}${path}`,
      lastmod: format(new Date(), "yyyy-MM-dd"),
    };
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(({ loc, lastmod }) => {
        return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
      })
      .join("\n") +
    "\n</urlset>";

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
