// Meng-generate sitemap.xml dan robots.txt ke folder dist saat build.
// Domain dibaca dari environment variable VITE_SITE_URL (atau file .env),
// TIDAK di-hardcode — agar kompatibel dengan Netlify & Cloudflare Pages
// yang bisa mengatur env var per environment.

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

// Baca .env sederhana jika ada (tanpa dependensi dotenv)
const envFile = path.join(root, '.env')
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2]
  }
}

const PLACEHOLDER = 'https://example.com'
const siteUrl = (process.env.VITE_SITE_URL || '').replace(/\/+$/, '')

if (!siteUrl) {
  console.warn(
    `[generate-seo] VITE_SITE_URL belum di-set — memakai placeholder ${PLACEHOLDER}. ` +
      'Set env var ini (mis. di .env atau panel build hosting) sebelum deploy.'
  )
}
const base = siteUrl || PLACEHOLDER

const distDir = path.join(root, 'dist')
if (!existsSync(distDir)) {
  console.error('[generate-seo] folder dist tidak ditemukan — jalankan "vite build" dulu.')
  process.exit(1)
}

const today = new Date().toISOString().slice(0, 10)

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${base}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`

const robots = `User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml
`

writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8')
writeFileSync(path.join(distDir, 'robots.txt'), robots, 'utf8')
console.log(`[generate-seo] sitemap.xml & robots.txt ditulis untuk ${base}`)
