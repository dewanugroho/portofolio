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
```

## Struktur proyek

```
index.html              Meta SEO (title, description, Open Graph, JSON-LD Person),
                        skrip anti-flash tema. Semua URL dari env VITE_SITE_URL.
public/                 Aset statis: foto, sertifikat (WebP), screenshot proyek,
                        _redirects (SPA fallback), favicon.
scripts/
  generate-seo.mjs      Meng-generate dist/sitemap.xml & robots.txt saat postbuild.
src/
  App.jsx               Penyusun halaman (SkipLink → Header → main → Footer).
  components/           Header, Hero, Projects, Skills, Experience,
                        Certifications, Contact, Footer, SkipLink, icons.
  data/
    content.js          Titik tunggal konten + konstanta LOCALE ('id').
    portfolio.json      Seluruh konten & string UI (lihat di bawah).
  index.css             Design token sebagai CSS variable (mode terang/gelap).
```

### Konten & antarmuka

Semua teks situs ada di [`src/data/portfolio.json`](src/data/portfolio.json), termasuk
string UI (label nav, judul section, CTA). Field proyek berformat case study:
`context`, `role`, `tech`, `results`, `repo`, `demo`, `screenshot`.

Placeholder konten yang belum terisi ditandai `[ISI: ...]` dan tampil apa adanya di
halaman supaya mudah ditemukan.

**Menambah bahasa Inggris nanti:** buat `src/data/portfolio.en.json` (salinan struktur
`id`), lalu di [`src/data/content.js`](src/data/content.js) daftarkan dan ganti `LOCALE`.

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
dan `build` pada setiap push/PR.

## Teknologi

- [React 19](https://react.dev/) + [Vite 8](https://vite.dev/)
- [Tailwind CSS 3.4](https://tailwindcss.com/) (design token via CSS variable)
- [lucide-react](https://lucide.dev/) (ikon; ikon brand GitHub/LinkedIn SVG inline)
- Prettier + ESLint
