# Rencana Implementasi: Portofolio Dewa Bintang Nugroho

Dokumen ini berisi tugas bertahap dengan urutan, estimasi, dan dependensi. Status: perancangan aktif.

Estimasi diberikan sebagai rentang (minimum-maksimum). Lihat `docs/AUDIT.md` untuk detail temuan yang dirujuk di tiap tugas, dan `docs/ARCHITECTURE.md` untuk detail teknis.

---

## Fase 0: Perbaikan Kritis dan Tinggi dari Audit

**Status: SELESAI** (lihat branch `fase-0-perbaikan`, tag `fase-0-selesai`).

| No | Tugas | Estimasi | Status |
|----|-------|----------|--------|
| 0.1 | Set `VITE_SITE_URL` ke domain final di panel hosting | 15-30 menit | Perlu dikerjakan saat deploy (Tahap E) |
| 0.2 | Header keamanan: dipindah ke `public/_headers` (netral hosting) | 30-60 menit | Selesai (direvisi di Tahap B) |
| 0.3 | Perbaiki kerentanan dependensi (vite 8.2.2 ke 8.3.5) | 30-60 menit | Selesai |
| 0.4 | Hapus `.env` dari tracking git | 15-30 menit | Selesai |
| 0.5 | Perbaiki modal sertifikat menutup saat gambar diklik | 15-30 menit | Selesai |
| 0.6 | Hapus `preview.log` | 15-30 menit | Selesai |

---

## Fase 1: Migrasi Struktur Konten

Pisahkan array JSON menjadi file per entri agar siap dikelola CMS. Lihat `docs/ARCHITECTURE.md` bagian 8 untuk detail.

| No | Tugas | File terkait | Estimasi | Dep. | Catatan |
|----|------|-------------|----------|------|---------|
| 1.1 | Buat folder: `src/data/projects/`, `src/data/skills/`, `src/data/experience/`, `src/data/education/`, `src/data/certifications/`. | struktur folder | 15-30 menit | - | - |
| 1.2 | Pisahkan `projects.json` jadi file per proyek: `pos.json`, `rasa.json`, `dialogflow.json`. Hapus `projects.json` lama. | `src/data/projects/*.json` | 30-60 menit | 1.1 | Gunakan id sebagai nama file |
| 1.3 | Pisahkan `skills.json` jadi file per grup: `frontend.json`, `backend.json`, `integrasi.json`, `ai-nlp.json`, `infra.json`. | `src/data/skills/*.json` | 30-60 menit | 1.1 | Gunakan nama grup yang dislugifikasi |
| 1.4 | Pisahkan `experience.json` jadi file per entri: `dimsum-gembul.json`. | `src/data/experience/*.json` | 15-30 menit | 1.1 | - |
| 1.5 | Pisahkan `education.json` jadi file per entri: `sahid.json`. | `src/data/education/*.json` | 15-30 menit | 1.1 | - |
| 1.6 | Pisahkan `certifications.json` jadi file per sertifikat: `usahid.json`, `hacktiv8.json`. | `src/data/certifications/*.json` | 15-30 menit | 1.1 | - |
| 1.7 | Update `content.js`: ganti import per-file dengan `import.meta.glob('./projects/*.json', { eager: true })` untuk koleksi yang dipecah. `site.json`, `ui.json`, `demo.json` tetap import biasa. | `src/data/content.js` | 1-2 jam | 1.2-1.6 | Output objek harus sama bentuknya |
| 1.8 | Update `validate-content.mjs`: baca folder lewat `fs.readdirSync`, validasi tiap file dengan skema entitas (bukan array). Pertahankan output log yang sama. | `scripts/validate-content.mjs` | 1-2 jam | 1.7 | - |
| 1.9 | Update `schema.js`: `contentSchema` tidak lagi membungkus koleksi sebagai array. Definisi skema entitas (projectSchema, dll) tidak berubah. | `src/data/schema.js` | 1-2 jam | 1.8 | - |
| 1.10 | Tambah tes data tidak valid: buat script atau test case yang memverifikasi `validate-content.mjs` memang gagal (exit 1) saat diberi data rusak. | `scripts/` | 30-60 menit | 1.9 | Build harus gagal bila data tidak valid |
| 1.11 | Jalankan `npm run validate` dan `npm run build`. Verifikasi tidak ada error. Periksa output dist sama seperti sebelumnya. | - | 30-60 menit | 1.10 | Smoke test harus lulus |
| 1.12 | Update `smoke-test.mjs` jika ada pemeriksaan yang merujuk file JSON lama. | `scripts/smoke-test.mjs` | 15-30 menit | 1.11 | Mungkin tidak perlu ubah |

Total estimasi Fase 1: 5-9 jam.

---

## Fase 2: Setup CMS (Sveltia CMS)

Pasang Sveltia CMS sebagai halaman admin dengan autentikasi GitHub PAT. Lihat `docs/ARCHITECTURE.md` bagian 6-14 untuk detail.

| No | Tugas | File terkait | Estimasi | Dep. | Catatan |
|----|------|-------------|----------|------|---------|
| 2.1 | Buat `public/admin/index.html` yang memuat Sveltia CMS dari bundle lokal `/admin/cms/sveltia-cms.js`. Tambah `meta name="robots" content="noindex"`. Bundle sudah dipasang lewat npm dan disalin otomatis saat build (lihat ARCHITECTURE.md 8.6). | `public/admin/index.html` | 15-30 menit | 1.11 | Sudah dibuat di Koreksi Tahap B |
| 2.2 | Buat `public/admin/config.yml` dengan backend GitHub (`repo: dewanugroho/portofolio, branch: main`), media folder, dan definisi semua koleksi (Profil, Proyek, Keahlian, Pengalaman, Pendidikan, Sertifikasi). Tambah `hint` pada field image. | `public/admin/config.yml` | 2-4 jam | 2.1 | Lihat ARCHITECTURE.md 8.5 |
| 2.3 | Buat GitHub fine-grained PAT: scope Contents (Read and write) + Metadata (Read, otomatis). Expiration 90 hari. | GitHub settings | 15-30 menit | - | Lihat ARCHITECTURE.md 12.2-12.3 |
| 2.4 | Deploy untuk tes ke Cloudflare (atau Netlify). Buka `/admin/`, klik "Sign In with Token", tempel PAT, verifikasi koleksi muncul dengan data yang sudah ada. | - | 30-60 menit | 2.2-2.3 | Butuh Tahap E (deploy) dulu |
| 2.5 | Tes tambah entri baru: buat proyek dummy lewat CMS, publish, verifikasi commit masuk repo dan build otomatis berjalan di Cloudflare. | - | 30-60 menit | 2.4 | - |
| 2.6 | Tes edit entri: ubah profil (mis. status), publish, verifikasi perubahan tampil di situs (~1-3 menit). | - | 30-60 menit | 2.4 | - |
| 2.7 | Tes hapus: hapus entri dummy, verifikasi dialog konfirmasi muncul, konfirmasi, verifikasi entri hilang dari repo dan situs. | - | 30-60 menit | 2.5 | - |
| 2.8 | Tes upload gambar: upload screenshot dummy lewat media library CMS, verifikasi file tersimpan di `public/` di repo. Periksa ukuran dan resolusi memenuhi batas (lihat ARCHITECTURE.md 6.4). | - | 30-60 menit | 2.4 | - |
| 2.9 | Tes validasi: simpan entri dengan data tidak valid (id huruf besar, field wajib kosong), verifikasi build gagal dengan pesan Zod yang jelas dan situs tidak ter-update. | - | 30-60 menit | 2.5 | Build gagal = aman |
| 2.10 | Sesuaikan locale CMS ke bahasa Indonesia di config.yml (`locale: id`) jika tersedia di Sveltia CMS. | `public/admin/config.yml` | 15-30 menit | 2.2 | - |
| 2.11 | Buat `scripts/validate-cms-config.mjs`: bandingkan field di `config.yml` dengan skema Zod di `schema.js`. Exit 1 jika ada ketidakcocokan. Lihat ARCHITECTURE.md 14.2. | `scripts/validate-cms-config.mjs` | 2-4 jam | 2.2, 1.9 | - |
| 2.12 | Tambah `npm run validate-cms-config` ke `package.json` scripts dan ke CI workflow (`ci.yml`) sebelum `npm run build`. | `package.json`, `.github/workflows/ci.yml` | 15-30 menit | 2.11 | - |
| 2.13 | Buat `scripts/optimize-images.mjs` dengan `sharp`: jalan sebagai langkah `postbuild`. Kompres gambar di `dist/` sesuai batas di ARCHITECTURE.md 6.4. Tambah `sharp` sebagai devDependency. | `scripts/optimize-images.mjs`, `package.json` | 1-2 jam | - | Lihat ARCHITECTURE.md 6.4 |
| 2.14 | Tambah pengecekan ukuran gambar di `validate-content.mjs`: beri peringatan (bukan gagal build) jika gambar di `public/` melebihi batas. | `scripts/validate-content.mjs` | 1-2 jam | 2.13 | Peringatan, bukan gagal build |

Total estimasi Fase 2: 9-14 jam (termasuk tes iteratif).

---

## Fase 3: Perbaikan UI/UX dari Audit

Perbaikan temuan Sedang dan Rendah. Lihat `docs/AUDIT.md` kategori 3, 4, 5, 6.

| No | Tugas | File terkait | Estimasi | Dep. | Tingkat audit |
|----|------|-------------|----------|------|---------------|
| 3.1 | Buat ulang favicon dengan palet teal (bukan ungu). Logo inisial "DB" sederhana. | `public/favicon.svg` | 30-60 menit | - | Sedang (audit 5) |
| 3.2 | Buat halaman 404 sederhana dengan pesan dan link ke beranda. Tambah konfigurasi di `public/_redirects`. | `public/404.html`, `public/_redirects` | 1-2 jam | 0.1 | Sedang (audit 5, 7). CSP enforce dikerjakan di Tahap E. |
| 3.3 | Buat og:image 1200x630 khusus social sharing (foto + nama + peran). Tambah `og:image:width`, `og:image:height`. Ganti Twitter card ke `summary_large_image`. | `index.html`, aset baru | 1-2 jam | 0.1 | Sedang (audit 3, 4) |
| 3.4 | Tambah `theme-color` meta di `index.html` untuk terang dan gelap (pakai media query). | `index.html` | 15-30 menit | - | Rendah (audit 4) |
| 3.5 | Perbaiki CommandPalette: tambah `role="combobox"`, `aria-expanded`, `aria-activedescendant` pada input. Set id unik per opsi. | `src/components/CommandPalette.jsx` | 1-2 jam | - | Sedang (audit 4) |
| 3.6 | Perbaiki alt text sertifikat di modal: gunakan judul sertifikat, bukan generik. | `src/components/Certifications.jsx` | 15-30 menit | - | Rendah (audit 4) |
| 3.7 | Tambah indikator section aktif di nav (scrollspy) dengan `IntersectionObserver`. | `src/components/Header.jsx` | 1-2 jam | - | Rendah (audit 4) |
| 3.8 | Hapus `aria-label` redundan pada span kuantitas keranjang di PosDemo. | `src/components/PosDemo.jsx` | 15-30 menit | - | Rendah (audit 4) |
| 3.9 | Tambah `fetchpriority="high"` pada gambar Hero. | `src/components/Hero.jsx` | 15-30 menit | - | Rendah (audit 3) |
| 3.10 | Tambah width/height pada gambar sertifikat di modal (atau aspect-ratio). | `src/components/Certifications.jsx` | 15-30 menit | - | Rendah (audit 3) |
| 3.11 | Ganti tahun footer hardcoded ke `new Date().getFullYear()`. | `src/components/Footer.jsx` | 15-30 menit | - | Rendah (audit 6) |
| 3.12 | Ganti inline `style={{ borderRadius: '6px' }}` dengan kelas `rounded-token` di 4 lokasi. | `Hero.jsx`, `Projects.jsx`, `Certifications.jsx` | 15-30 menit | - | Rendah (audit 6) |
| 3.13 | Tambah error boundary yang membungkus komponen utama di App.jsx. | `src/App.jsx`, file baru | 30-60 menit | - | Rendah (audit 6) |
| 3.14 | Tambah apple-touch-icon dan link ke manifest. | `index.html`, `public/` | 30-60 menit | 3.1 | Opsional (audit 7) |

Total estimasi Fase 3: 5-10 jam.

---

## Fase 4: Pengisian Konten

Isi data yang masih kosong. Sebagian bisa langsung lewat CMS setelah Fase 2 selesai.

| No | Tugas | File terkait | Estimasi | Dep. | Sumber |
|----|------|-------------|----------|------|--------|
| 4.1 | Isi URL LinkedIn di profil. | `src/data/site.json` | 15-30 menit | 2.4 atau langsung | placeholders.json |
| 4.2 | Buat CV PDF, taruh di `public/`, isi path `site.cv`. | `public/cv-dewa-bintang.pdf`, `src/data/site.json` | 1-2 jam | 2.8 atau langsung | placeholders.json |
| 4.3 | Isi kalimat ajakan kontak (`ui.contact.lead`). Edit langsung di `ui.json`. | `src/data/ui.json` | 15-30 menit | - | placeholders.json |
| 4.4 | Tambah screenshot untuk proyek POS. Siapkan gambar (maks 1200x800, 500 KB). | `src/data/projects/pos.json` | 1-2 jam | 2.8 atau langsung | placeholders.json |
| 4.5 | Konfirmasi klaim Nginx dan Linux VPS: ubah `verified: true` jika sudah yakin. | `projects/pos.json`, `skills/infra.json` | 15-30 menit | - | placeholders.json |

Total estimasi Fase 4: 2-5 jam.

---

## Fase 5: Polish dan Fitur Opsional

Urutan menurun berdasarkan nilai. Dikerjakan bertahap setelah inti berfungsi.

| No | Tugas | File terkait | Estimasi | Dep. | Prioritas |
|----|------|-------------|----------|------|-----------|
| 5.1 | Tambah form kontak dengan Formspree (lihat ARCHITECTURE.md bagian 13). Daftar akun Formspree, buat form di `Contact.jsx`, tambah honeypot field, set `VITE_FORMSPREE_ID` di panel hosting. | `src/components/Contact.jsx` | 2-4 jam | 0.4 | Tinggi |
| 5.2 | Tambah analytics privacy-first (Plausible self-host atau Umami cloud free). | `index.html` | 30-60 menit | 0.1 | Sedang |
| 5.3 | Code splitting PosDemo dengan `React.lazy` + `Suspense`. | `src/components/Projects.jsx`, `vite.config.js` | 1-2 jam | 1.11 | Sedang |
| 5.4 | Kompres ulang favicon dan sertifikat yang besar. Sederhanakan favicon SVG. | `public/favicon.svg`, sertifikat webp | 30-60 menit | 3.1 | Sedang |
| 5.5 | Buat versi gambar Hero ukuran display (112x112 dan 224x224 retina). | `public/` | 30-60 menit | - | Rendah |
| 5.6 | Tambah tombol kembali ke atas yang muncul setelah scroll melewati Hero. | komponen baru | 30-60 menit | - | Rendah |
| 5.7 | Tambah scroll progress indicator (garis tipis di atas). | komponen baru + CSS | 30-60 menit | - | Rendah |
| 5.8 | Tambah PWA manifest (`manifest.webmanifest`) dengan ikon 192x192 dan 512x512. | `public/manifest.webmanifest`, `index.html` | 1-2 jam | 3.1, 3.14 | Rendah |
| 5.9 | Tambah indikator scroll horizontal di nav mobile. | `src/components/Header.jsx` | 30-60 menit | - | Rendah |
| 5.10 | Rapikan sistem LOCALE di content.js (hapus atau dokumentasikan sebagai roadmap). | `src/data/content.js` | 15-30 menit | - | Rendah |
| 5.11 | Tambah structured data JSON-LD untuk proyek. | `index.html` atau `generate-seo.mjs` | 1-2 jam | 0.1 | Rendah |
| 5.12 | Tambah halaman detail proyek jika konten bertambah. Pertimbangkan React Router. | struktur baru | 4-8 jam | 5.3 | Rendah |

Total estimasi Fase 5: 11-22 jam (atau lebih jika semua dikerjakan).

---

## Tahap E: Deploy ke Hosting Gratis (Cloudflare Workers)

Dikerjakan setelah Fase 1-2 selesai. Lihat `docs/DEPLOY.md` untuk panduan langkah per langkah (akan dibuat di Tahap E).

| No | Tugas | File terkait | Estimasi | Dep. |
|----|-------|-------------|----------|------|
| E.1 | Set `VITE_SITE_URL=https://dewabintangn.my.id` di panel environment variable Cloudflare. Trigger rebuild. Verifikasi canonical, OG, sitemap pakai domain benar. | Dashboard Cloudflare | 15-30 menit | Deploy awal |
| E.2 | Aktifkan CSP mode enforce di `public/_headers`: ganti `Content-Security-Policy-Report-Only` ke `Content-Security-Policy`. Verifikasi tidak ada resource yang terblokir sebelum menghubungkan domain kustom. | `public/_headers` | 30-60 menit | E.1 |
| E.3 | Hubungkan domain kustom `dewabintangn.my.id` ke Worker di dashboard Cloudflare. | Dashboard Cloudflare | 15-30 menit | E.2 |
| E.4 | Jalankan daftar pemeriksaan deploy: situs tampil, header keamanan aktif, canonical dan OG pakai domain benar, sitemap valid, login admin berhasil, edit konten dari admin memicu deploy. | - | 30-60 menit | E.3 |
| E.5 | Set `VITE_FORMSPREE_ID` di panel environment variable Cloudflare (setelah form kontak diimplementasi di Fase 5). | Dashboard Cloudflare | 15-30 menit | 5.1 |

---

## Ringkasan Timeline

| Fase | Estimasi total | Dependensi utama |
|------|---------------|------------------|
| 0: Perbaikan kritis/tinggi | 2-4 jam | Selesai |
| 1: Migrasi struktur konten | 5-9 jam | Fase 0 selesai |
| 2: Setup CMS | 9-14 jam | Fase 1 selesai + deploy Tahap E |
| 3: Perbaikan UI/UX | 5-10 jam | Fase 0 selesai (bisa paralel dengan 1-2) |
| 4: Pengisian konten | 2-5 jam | Fase 2 selesai (atau langsung edit JSON) |
| 5: Polish dan opsional | 11-22 jam | Fase 0-2 selesai |
| **Total inti (0-4)** | **23-42 jam** | |
| **Total dengan Fase 5** | **34-64 jam** | |

Fase 1 dan 3 bisa dikerjakan paralel setelah Fase 0. Fase 2 harus menunggu Fase 1 dan deploy (Tahap E). Fase 4 sebagian bisa langsung tanpa menunggu Fase 2.
