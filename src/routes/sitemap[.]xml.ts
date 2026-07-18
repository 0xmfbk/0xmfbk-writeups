import { createFileRoute } from "@tanstack/react-router";
import { listPublishedPosts } from "@/lib/posts.functions";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const posts = await listPublishedPosts();
        const entries = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/writeups", changefreq: "weekly", priority: "0.9" },
          ...posts.map((p) => ({
            path: `/writeups/${p.slug}`,
            lastmod: new Date(p.published_at ?? p.created_at).toISOString(),
            changefreq: "monthly",
            priority: "0.8",
          })),
        ];

        const urls = entries.map((e) => [
          `  <url>`,
          `    <loc>${BASE_URL}${e.path}</loc>`,
          "lastmod" in e && e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
          `    <changefreq>${e.changefreq}</changefreq>`,
          `    <priority>${e.priority}</priority>`,
          `  </url>`,
        ].filter(Boolean).join("\n"));

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
