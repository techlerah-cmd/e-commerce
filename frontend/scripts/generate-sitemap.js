import { SitemapStream, streamToPromise } from "sitemap";
import fs from "fs";
import { writeFile } from "fs/promises";
import { Readable } from "stream";
import { fileURLToPath } from "url";
import path from "path";

// Fix for Windows paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, "../public");
const HOSTNAME = "https://www.lerah.in"; // ← set your domain

// 1) Static pages
const staticUrls = [
  { url: "/", changefreq: "daily", priority: 1.0 },
  { url: "/collections", changefreq: "daily", priority: 0.8 },
  { url: "/contact", changefreq: "monthly", priority: 0.4 },
];

// 2) Optional dynamic products
async function loadProductUrls() {
  try {
    const localPath = new URL("../data/products.json", import.meta.url)
      .pathname;
    if (fs.existsSync(localPath)) {
      const raw = await fs.promises.readFile(localPath, "utf8");
      const products = JSON.parse(raw);
      return products.map((p) => ({
        url: `/product/${p.slug}`,
        changefreq: "weekly",
        priority: 0.7,
        lastmod: p.updated_at || undefined,
      }));
    }
  } catch (err) {
    console.warn("Could not load product URLs:", err.message);
  }
  return [];
}

async function generate() {
  const productUrls = await loadProductUrls();
  const links = [...staticUrls, ...productUrls];

  // Create sitemap stream
  const smStream = new SitemapStream({ hostname: HOSTNAME });
  const xmlBuffer = await streamToPromise(Readable.from(links).pipe(smStream));

  // Ensure public dir exists
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });

  // Write sitemap.xml
  await writeFile(
    new URL("../public/sitemap.xml", import.meta.url).pathname,
    xmlBuffer.toString()
  );

  // Write robots.txt
  const robots = `User-agent: *
Allow: /

Sitemap: ${HOSTNAME}/sitemap.xml
`;
  await writeFile(
    new URL("../public/robots.txt", import.meta.url).pathname,
    robots
  );

  console.log("✅ sitemap.xml and robots.txt generated in /public");
}

generate().catch((err) => {
  console.error("Error generating sitemap:", err);
  process.exit(1);
});
