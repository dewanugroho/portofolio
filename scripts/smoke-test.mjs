// Smoke test hasil build: jalankan setelah `npm run build`.
// Memverifikasi artefak SEO/deploy dasar supaya regresi (tag hilang,
// placeholder URL tak terganti, sitemap tak ter-generate) ketahuan di CI.

import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const dist = path.join(root, 'dist')

const failures = []
const check = (name, ok) => {
  if (!ok) failures.push(name)
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`)
}

if (!existsSync(dist)) {
  console.error('FAIL  folder dist tidak ditemukan — jalankan "npm run build" dulu.')
  process.exit(1)
}

const html = readFileSync(path.join(dist, 'index.html'), 'utf8')

// index.html
check('lang="id"', html.includes('<html lang="id">'))
check('title deskriptif', /<title>[^<]{20,}<\/title>/.test(html))
check('meta description', /<meta\s+name="description"\s+content="[^"]{50,}"/s.test(html))
check('canonical', /<link\s+rel="canonical"\s+href="https?:\/\/[^"\s]+"/s.test(html))
check('Open Graph og:title', html.includes('property="og:title"'))
check('Open Graph og:image', html.includes('property="og:image"'))
check('tidak ada placeholder %VITE_SITE_URL% tersisa', !html.includes('%VITE_SITE_URL%'))

// JSON-LD Person valid
let jsonLdOk = false
try {
  const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
  const parsed = JSON.parse(m[1])
  jsonLdOk = parsed['@type'] === 'Person' && Boolean(parsed.name)
} catch {
  jsonLdOk = false
}
check('JSON-LD Person valid', jsonLdOk)

// Artefak deploy
const robots = existsSync(path.join(dist, 'robots.txt'))
  ? readFileSync(path.join(dist, 'robots.txt'), 'utf8')
  : ''
check('dist/sitemap.xml ada', existsSync(path.join(dist, 'sitemap.xml')))
check('dist/robots.txt ada & menyertakan Sitemap', robots.includes('Sitemap:'))
check('dist/_redirects (SPA fallback) ada', existsSync(path.join(dist, '_redirects')))

// Aset yang dirujuk index.html
for (const asset of ['favicon.svg', 'foto_formal.jpg']) {
  check(`aset dist/${asset} ada`, existsSync(path.join(dist, asset)))
}

// Bundle JS/CSS yang dirujuk benar-benar ada
for (const m of html.matchAll(/(?:src|href)="\/(assets\/[^"]+)"/g)) {
  check(`bundle ${m[1]} ada`, existsSync(path.join(dist, m[1])))
}

if (failures.length > 0) {
  console.error(`\n${failures.length} pemeriksaan gagal.`)
  process.exit(1)
}
console.log('\nSemua pemeriksaan smoke test lulus.')
