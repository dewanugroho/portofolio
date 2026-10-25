// Poin tunggal sumber konten untuk seluruh situs.
// Tiap entitas punya file sendiri (site, ui, projects, education,
// experience, skills, certifications) dan tervalidasi skema Zod di
// src/data/schema.js oleh "npm run validate" (jalan otomatis saat build).
// placeholders.json sengaja TIDAK diimpor di sini — daftar itu untuk
// pemilik situs, tidak boleh masuk bundle maupun halaman publik.
//
// Menambah bahasa Inggris nanti: buat berkas setara dengan akhiran
// .en.json (mis. site.en.json), daftarkan di objek LOCALES di bawah,
// lalu ganti LOCALE (atau ubah jadi state preferensi pengguna).
import site from './site.json'
import ui from './ui.json'
import projects from './projects.json'
import education from './education.json'
import experience from './experience.json'
import skills from './skills.json'
import certifications from './certifications.json'

const LOCALE = 'id'

const LOCALES = {
  id: { site, ui, projects, education, experience, skills, certifications },
  // en: { site: siteEn, ui: uiEn, ... }
}

export default LOCALES[LOCALE]
