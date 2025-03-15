import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";

// (Optional) Adjust if your site URL differs
const BASE_URL = "https://www.paperanalysis.com";

export async function GET() {
  // 1. Fetch all blog posts from Sanity
  const posts = await client.fetch(`*[_type == "post"]{ _id, publishedAt }`);

  // 2. Build the <url> entries for each blog post
  const postUrls = posts
    .map((post: { _id: string; publishedAt: string }) => {
      const lastMod = post.publishedAt
        ? new Date(post.publishedAt).toISOString()
        : new Date().toISOString();
      return `
        <url>
          <loc>${BASE_URL}/post/${post._id}</loc>
          <lastmod>${lastMod}</lastmod>
          <priority>0.7</priority>
        </url>`;
    })
    .join("");

  // 3. Combine static URLs (home, blog listing, etc.) with dynamic post URLs
  const staticUrls = `
    <url>
      <loc>${BASE_URL}/</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>1.0</priority>
    </url>
    <url>
      <loc>${BASE_URL}/blog</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>0.8</priority>
    </url>
  `;

  // 4. Construct the final XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticUrls}
    ${postUrls}
  </urlset>`;

  // 5. Return the XML sitemap
  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
