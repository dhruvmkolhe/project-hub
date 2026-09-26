import { connectToDatabase, db } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
    const SITE_URL = process.env.PUBLIC_APP_URL || url.origin || 'https://projecthub.com';
    let projectUrls = '';
    let userUrls = '';

    try {
        await connectToDatabase();
        const projects = await db.collection('projects').find({ status: 'approved' }).toArray();
        const users = await db.collection('users').find({}).toArray();

        projectUrls = projects
            .map(
                (p) => `
  <url>
    <loc>${SITE_URL}/projects/${p.id || p._id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
            )
            .join('');

        userUrls = users
            .map(
                (u) => `
  <url>
    <loc>${SITE_URL}/users/${encodeURIComponent(u.username)}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`
            )
            .join('');
    } catch (e) {
        // Fallback gracefully if database is not reachable at build time
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/projects</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${SITE_URL}/auth/login</loc>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${SITE_URL}/auth/register</loc>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${SITE_URL}/privacy</loc>
    <changefreq>yearly</changefreq>
    <priority>0.2</priority>
  </url>
  <url>
    <loc>${SITE_URL}/terms</loc>
    <changefreq>yearly</changefreq>
    <priority>0.2</priority>
  </url>${projectUrls}${userUrls}
</urlset>`;

    return new Response(sitemap.trim(), {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'max-age=0, s-maxage=3600'
        }
    });
};
