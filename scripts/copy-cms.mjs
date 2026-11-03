/**
 * Salin bundle Sveltia CMS dari node_modules ke public/admin/cms/.
 * Dijalankan sebagai bagian dari build: npm run prebuild.
 *
 * Dengan cara ini Sveltia CMS disajikan dari domain sendiri,
 * bukan dari CDN pihak ketiga (unpkg.com), sehingga:
 * - CSP /admin/* bisa dikunci ke 'self' saja.
 * - Tidak ada ketergantungan jaringan eksternal untuk halaman admin.
 * - Versi dikunci di package.json, tidak berubah tiba-tiba.
 */

import { copyFileSync, mkdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const src = path.join(root, 'node_modules', '@sveltia', 'cms', 'dist', 'sveltia-cms.js')
const destDir = path.join(root, 'public', 'admin', 'cms')
const dest = path.join(destDir, 'sveltia-cms.js')

if (!existsSync(src)) {
  console.error('[copy-cms] @sveltia/cms tidak ditemukan di node_modules. Jalankan npm install.')
  process.exit(1)
}

mkdirSync(destDir, { recursive: true })
copyFileSync(src, dest)
console.log(`[copy-cms] @sveltia/cms 0.257.0 disalin ke public/admin/cms/sveltia-cms.js`)
