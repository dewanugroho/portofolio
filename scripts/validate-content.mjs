// Memvalidasi seluruh file konten di src/data terhadap skema Zod.
// Dijalankan otomatis oleh "npm run build" (prebuild) dan oleh CI.
// Gagal di sini = build gagal, jadi konten rusak tidak pernah ter-deploy.

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { contentSchema, placeholdersSchema } from '../src/data/schema.js'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const dataDir = path.join(root, 'src', 'data')

function readJson(name) {
  const file = path.join(dataDir, name)
  try {
    return JSON.parse(readFileSync(file, 'utf8'))
  } catch (err) {
    console.error(`[validate] Gagal membaca ${name}: ${err.message}`)
    process.exit(1)
  }
}

const content = {
  site: readJson('site.json'),
  ui: readJson('ui.json'),
  projects: readJson('projects.json'),
  education: readJson('education.json'),
  experience: readJson('experience.json'),
  skills: readJson('skills.json'),
  certifications: readJson('certifications.json'),
}

function report(label, result) {
  if (result.success) return true
  console.error(`[validate] ${label} tidak valid:`)
  for (const issue of result.error.issues) {
    const where = issue.path.length > 0 ? issue.path.join('.') : '(root)'
    console.error(`  - ${where}: ${issue.message}`)
  }
  return false
}

const okContent = report('konten', contentSchema.safeParse(content))
const okPlaceholders = report(
  'placeholders.json',
  placeholdersSchema.safeParse(readJson('placeholders.json'))
)

if (!okContent || !okPlaceholders) {
  console.error('[validate] Validasi gagal — perbaiki file di src/data/ lalu jalankan ulang.')
  process.exit(1)
}

const total = content.projects.length + content.education.length + content.experience.length
console.log(
  `[validate] Konten valid: ${content.projects.length} proyek, ${content.education.length} pendidikan, ` +
    `${content.experience.length} pengalaman, ${content.skills.length} grup keahlian, ` +
    `${content.certifications.length} sertifikasi (${total} entri).`
)
