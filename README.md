# Portofolio — Dewa Bintang Nugroho

Situs portofolio pribadi: satu halaman editorial-minimal berisi proyek (format case study), keahlian, pengalaman, sertifikasi, dan kontak. Dibangun dengan React 19 + Vite + Tailwind CSS, tanpa backend — ringan, cepat, dan siap deploy statis.

## Menjalankan

```bash
npm install
npm run dev        # server development (Vite)
npm run build      # build produksi ke dist/ (+ generate sitemap.xml & robots.txt)
npm run preview    # pratinjau hasil build
npm run lint       # ESLint
npm run format     # format kode dengan Prettier
npm run validate   # validasi konten (Zod) — juga jalan otomatis sebelum build
```

## Struktur proyek

```
index.html              Meta SEO (title, description, Open Graph, JSON-LD Person),
                        skrip anti-flash tema. Semua URL dari env VITE_SITE_URL.
public/                 Aset statis: foto, sertifikat (WebP), screenshot proyek,
                        _redirects (SPA fallback), favicon.
scripts/
  generate-seo.mjs          Meng-generate dist/sitemap.xml & robots.txt saat postbuild.
  validate-content.mjs      Validasi Zod seluruh konten; jalan sebagai prebuild & di CI.
src/
  App.jsx                   Penyusun halaman (SkipLink → Header → main → Footer).
  components/               Header, Hero, Projects, Skills, Education, Experience,
                            Certifications, Contact, Footer, SkipLink, icons.
  data/
    content.js              Merakit seluruh entitas + konstanta LOCALE ('id').
    schema.js               Skema Zod untuk semua file konten.
    site.json, ui.json, projects.json, education.json, experience.json,
    skills.json, certifications.json
                            Satu file per entitas (lihat di bawah).
    placeholders.json       Daftar konten yang belum terisi — TIDAK dibundel,
                            tidak tampil di halaman publik.
  index.css                 Design token sebagai CSS variable (mode terang/gelap).
```

### Konten & antarmuka

Semua teks situs ada di `src/data/*.json`, satu file per entitas. Komponen hanya me-render
data, tidak ada teks hardcode di dalamnya. Field proyek berformat case study: `context`,
`role`, `tech`, `results`, `repo`, `demo`, `screenshot`.

Klaim yang belum diverifikasi (mis. Nginx/VPS) disimpan dengan `verified: false` dan tidak
tampil sampai kamu ubah jadi `true`. Konten yang belum terisi didaftarkan di
[`src/data/placeholders.json`](src/data/placeholders.json) dan tidak pernah tampil di
halaman publik.

Setiap perubahan konten divalidasi skema Zod ([`src/data/schema.js`](src/data/schema.js))
lewat `npm run validate` — otomatis sebelum `npm run build` dan di CI. Konten rusak
(field hilang, typo, URL salah) memblokir build.

**Menambah bahasa Inggris nanti:** buat berkas setara dengan akhiran `.en.json`
(mis. `site.en.json`), daftarkan di objek `LOCALES` di
[`src/data/content.js`](src/data/content.js), lalu ganti `LOCALE`.

### Cara menambah konten

Semua langkah di bawah cukup edit file JSON lalu jalankan `npm run validate`.
Komponen tidak perlu diubah.

**Proyek baru** — buka [`src/data/projects.json`](src/data/projects.json), tambahkan objek
baru di array dengan field: `id` (huruf kecil, unik), `title`, `context` (masalah/konteks,
1-2 kalimat), `role`, `tech` (array), `results` (array), `repo`, `demo` (`""` bila kosong),
`screenshot` (path dari `public/`, `""` bila belum ada — lengkapi `screenshotWidth/Height`
dan `screenshotAlt` bila pakai gambar).

**Sertifikasi baru** — tambahkan `{ "title", "issuer", "image" }` di
[`src/data/certifications.json`](src/data/certifications.json). Taruh file gambar di `public/`
(rekomen WebP, kompres dulu supaya modal cepat terbuka).

**Pengalaman baru** — tambahkan `{ "period", "role", "organization", "description" }` di
[`src/data/experience.json`](src/data/experience.json).

**Pendidikan baru** — tambahkan `{ "period", "degree", "institution", "detail" }` di
[`src/data/education.json`](src/data/education.json).

**Keahlian baru** — edit array `items` per grup di
[`src/data/skills.json`](src/data/skills.json). Klaim yang belum dikonfirmasi pakai
`itemsUnverified` dengan `verified: false`.

### Mode gelap

Token warna didefinisikan sebagai CSS variable di `src/index.css` (`:root` = terang,
`.dark` = gelap). Toggle ada di header (tersimpan di `localStorage`, default mengikuti
preferensi sistem, tanpa kilatan saat muat halaman).

## Konfigurasi domain (wajib sebelum deploy)

URL absolut (canonical, Open Graph, sitemap) dibaca dari env `VITE_SITE_URL` — tidak
di-hardcode. Set salah satu:

- Di file `.env` (lihat [.env.example](.env.example)), atau
- Sebagai environment variable di panel build hosting (menimpa `.env`).

## Deploy

Build command: `npm run build` · Output direktori: `dist` · SPA fallback: sudah disediakan
(`public/_redirects` untuk Cloudflare Pages, `[[redirects]]` di `netlify.toml` untuk Netlify).

**Netlify:** impor repo → build command & publish dir terbaca dari `netlify.toml` →
set `VITE_SITE_URL` di Site configuration → Environment variables.

**Cloudflare Pages:** Create project → build command `npm run build`, output `dist` →
set `VITE_SITE_URL` di Settings → Environment variables → Deploy.

Kedua platform memberi HTTPS + domain `*.netlify.app` / `*.pages.dev` gratis.

## CI

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) menjalankan `format:check`, `lint`,
`validate` (Zod), `build`, dan smoke test pada setiap push/PR.

## Teknologi

- [React 19](https://react.dev/) + [Vite 8](https://vite.dev/)
- [Tailwind CSS 3.4](https://tailwindcss.com/) (design token via CSS variable)
- [lucide-react](https://lucide.dev/) (ikon; ikon brand GitHub/LinkedIn SVG inline)
- Prettier + ESLint
