# Rencana Implementasi: Portofolio Dewa Bintang Nugroho

Dokumen ini berisi tugas bertahap dengan urutan, estimasi, dan dependensi. Status: perancangan, belum implementasi.

Estimasi diberikan sebagai rentang (minimum-maksimum). Lihat `docs/AUDIT.md` untuk detail temuan yang dirujuk di tiap tugas.

---

## Fase 0: Perbaikan Kritis dan Tinggi dari Audit

Dikerjakan dulu sebelum perombakan UI dan sistem admin. Tujuannya menutup celah keamanan dan bug yang berdampak besar, lalu jadi fondasi bersih untuk fase berikutnya.

| No | Tugas | File terkait | Estimasi | Dep. | Tingkat audit |
|----|------|-------------|----------|------|---------------|
| 0.1 | Set `VITE_SITE_URL` ke domain final. Ubah di `.env` dan di environment variable hosting (Netlify atau Vercel). Jalankan ulang build untuk verifikasi canonical, OG, sitemap, robots sudah benar. | `.env`, dashboard hosting | 15-30 menit | - | Tinggi (audit 4) |
| 0.2 | Tambah security headers di `netlify.toml`. Pasang blok `[[headers]]` dengan X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy. Untuk CSP, mulai dengan `report-only` dulu. | `netlify.toml` | 30-60 menit | - | Sedang (audit 2) |
| 0.3 | Jalankan `npm audit fix`. Upgrade vite ke versi di atas 8.2.2 (lihat advisory GHSA-587h dan GHSA-9jrq). Verifikasi build dan lint lulus setelah upgrade. | `package.json`, `package-lock.json` | 30-60 menit | - | Tinggi (audit 1) |
| 0.4 | Hentikan tracking `.env` di git. Tambahkan `.env` ke `.gitignore`. Jalankan `git rm --cached .env`. Commit. | `.gitignore`, `.env` | 15-30 menit | - | Sedang (audit 1, 2, 6) |
| 0.5 | Perbaiki modal sertifikat yang menutup saat gambar diklik. Pisahkan backdrop dari konten: pasang `onClick` hanya di backdrop, atau tambahkan cek `event.target === event.currentTarget`. | `src/components/Certifications.jsx:94` | 15-30 menit | - | Sedang (audit 1, 4) |
| 0.6 | Hapus `preview.log` dari workspace. | `preview.log` | 15-30 menit | - | Rendah (audit 1) |

Total estimasi Fase 0: 2-4 jam.

---

## Fase 1: Migrasi Struktur Konten

Pisahkan array JSON menjadi file per entri agar siap dikelola CMS. Lihat `docs/ARCHITECTURE.md` bagian 8 untuk detail.

| No | Tugas | File terkait | Estimasi | Dep. | Catatan |
|----|------|-------------|----------|------|---------|
| 1.1 | Buat folder: `src/data/projects/`, `src/data/skills/`, `src/data/experience/`, `src/data/education/`, `src/data/certifications/`. | struktur folder | 15-30 menit | 0.1-0.6 | - |
| 1.2 | Pisahkan `projects.json` jadi file per proyek: `pos.json`, `rasa.json`, `dialogflow.json`. Hapus `projects.json` lama. | `src/data/projects/*.json` | 30-60 menit | 1.1 | Gunakan id sebagai nama file |
| 1.3 | Pisahkan `skills.json` jadi file per grup: `frontend.json`, `backend.json`, `integrasi.json`, `ai-nlp.json`, `infra.json`. | `src/data/skills/*.json` | 30-60 menit | 1.1 | Gunakan nama grup yang dislugifikasi |
| 1.4 | Pisahkan `experience.json` jadi file per entri: `dimsum-gembul.json`. | `src/data/experience/*.json` | 15-30 menit | 1.1 | - |
| 1.5 | Pisahkan `education.json` jadi file per entri: `sahid.json`. | `src/data/education/*.json` | 15-30 menit | 1.1 | - |
| 1.6 | Pisahkan `certifications.json` jadi file per sertifikat: `usahid.json`, `hacktiv8.json`. | `src/data/certifications/*.json` | 15-30 menit | 1.1 | - |
| 1.7 | Update `content.js`: ganti import per-file dengan `import.meta.glob('./projects/*.json', { eager: true })` untuk koleksi yang dipecah. `site.json`, `ui.json`, `demo.json` tetap import biasa. | `src/data/content.js` | 1-2 jam | 1.2-1.6 | Output objek harus sama bentuknya |
| 1.8 | Update `validate-content.mjs`: baca folder lewat `fs.readdirSync`, validasi tiap file dengan skema entitas (bukan array). Pertahankan output log yang sama. | `scripts/validate-content.mjs` | 1-2 jam | 1.7 | - |
| 1.9 | Update `schema.js`: `contentSchema` tidak lagi membungkus koleksi sebagai array. Buat fungsi validasi per file untuk proyek, skill, pendidikan, pengalaman, sertifikat. Definisi skema entitas (projectSchema, dll) tidak berubah. | `src/data/schema.js` | 1-2 jam | 1.8 | - |
| 1.10 | Jalankan `npm run validate` dan `npm run build`. Verifikasi tidak ada error. Periksa output dist sama seperti sebelumnya. | - | 30-60 menit | 1.9 | Smoke test harus lulus |
| 1.11 | Update `smoke-test.mjs` jika ada pemeriksaan yang merujuk file JSON lama. | `scripts/smoke-test.mjs` | 15-30 menit | 1.10 | Mungkin tidak perlu ubah |

Total estimasi Fase 1: 4-7 jam.

---

## Fase 2: Setup CMS (Sveltia CMS)

Pasang Sveltia CMS sebagai halaman admin dengan autentikasi GitHub PAT. Lihat `docs/ARCHITECTURE.md` bagian 6-13 untuk detail.

| No | Tugas | File terkait | Estimasi | Dep. | Catatan |
|----|------|-------------|----------|------|---------|
| 2.1 | Buat `public/admin/index.html` yang memuat Sveltia CMS dari CDN. Tidak perlu widget tambahan. | `public/admin/index.html` | 15-30 menit | 1.10 | Lihat ARCHITECTURE.md 8.6 |
| 2.2 | Buat `public/admin/config.yml` dengan konfigurasi backend GitHub (`name: github, repo: dewanugroho/portofolio, branch: main`), media folder, dan definisi semua koleksi (Profil, Proyek, Keahlian, Pengalaman, Pendidikan, Sertifikasi). Peta field dari skema Zod ke widget CMS. Tambah `hint` pada field image dengan resolusi dan ukuran yang disarankan (lihat ARCHITECTURE.md 6.4). | `public/admin/config.yml` | 2-4 jam | 2.1 | Koleksi terbesar |
| 2.3 | Buat GitHub fine-grained PAT dengan scope minimum: Contents (Read and write) + Metadata (Read, otomatis). Set expiration 90 hari. Simpan sementara untuk login. | GitHub settings | 15-30 menit | - | Lihat ARCHITECTURE.md 11.2-11.3 |
| 2.4 | Deploy untuk tes: push ke repo, tunggu build. Buka `/admin/`, klik "Sign In with Token", tempel PAT, verifikasi koleksi muncul dengan data yang sudah ada. | - | 30-60 menit | 2.2-2.3 | - |
| 2.5 | Tes tambah entri baru: buat proyek dummy lewat CMS, publish, verifikasi commit masuk repo dan build jalan. | - | 30-60 menit | 2.4 | - |
| 2.6 | Tes edit entri: ubah profil (mis. status), publish, verifikasi perubahan tampil di situs. | - | 30-60 menit | 2.4 | - |
| 2.7 | Tes hapus: hapus entri dummy, verifikasi dialog konfirmasi muncul, konfirmasi, verifikasi entri hilang dari repo dan situs. | - | 30-60 menit | 2.5 | - |
| 2.8 | Tes upload gambar: upload screenshot dummy lewat media library CMS, verifikasi file tersimpan di `public/` di repo. Periksa ukuran dan resolusi memenuhi batas (lihat ARCHITECTURE.md 6.4). | - | 30-60 menit | 2.4 | - |
| 2.9 | Tes validasi: coba simpan entri dengan data tidak valid (id dengan huruf besar, field kosong yang wajib), verifikasi build gagal dengan pesan Zod yang jelas. | - | 30-60 menit | 2.5 | Build gagal = aman, tidak ter-deploy |
| 2.10 | Sesuaikan locale CMS ke bahasa Indonesia di config.yml (`locale: id`) jika tersedia. | `public/admin/config.yml` | 15-30 menit | 2.2 | - |
| 2.11 | Buat `scripts/validate-cms-config.mjs`: script yang membandingkan field di `config.yml` dengan skema Zod di `schema.js`. Cek: field wajib vs `required`, field ada di config tapi tidak di skema (peringatan), field ada di skema tapi tidak di config (peringatan). Exit 1 jika ada ketidakcocokan. | `scripts/validate-cms-config.mjs` | 2-4 jam | 2.2, 1.9 | Lihat ARCHITECTURE.md 13.2 |
| 2.12 | Tambah `npm run validate-cms-config` ke `package.json` scripts dan ke CI workflow (`ci.yml`) sebelum `npm run build`. | `package.json`, `.github/workflows/ci.yml` | 15-30 menit | 2.11 | - |
| 2.13 | Buat `scripts/optimize-images.mjs` dengan `sharp`: jalan sebagai `postbuild`. Proses gambar di `dist/` (hasil copy dari `public/`), kompres dan ubah ukuran sesuai batas di ARCHITECTURE.md 6.4. Tambah `sharp` sebagai devDependency. | `scripts/optimize-images.mjs`, `package.json` | 1-2 jam | - | Lihat ARCHITECTURE.md 6.4 |
| 2.14 | Tambah pengecekan ukuran dan dimensi gambar di build: tambah fungsi di `validate-content.mjs` atau script terpisah yang memeriksa gambar di `public/` dan memberi peringatan jika melebihi batas (lihat ARCHITECTURE.md 6.4). | `scripts/validate-content.mjs` atau file baru | 1-2 jam | 2.13 | Peringatan, bukan gagal build |

Total estimasi Fase 2: 8-13 jam (termasuk tes iteratif).

---

## Fase 3: Perbaikan UI/UX dari Audit

Perbaikan temuan Sedang dan Rendah yang tidak ditangani di Fase 0. Lihat `docs/AUDIT.md` kategori 3, 4, 5, 6.

| No | Tugas | File terkait | Estimasi | Dep. | Tingkat audit |
|----|------|-------------|----------|------|---------------|
| 3.1 | Buat ulang favicon dengan palet teal (bukan ungu). Bisa logo inisial "DB" sederhana. | `public/favicon.svg` | 30-60 menit | - | Sedang (audit 5) |
| 3.2 | Buat halaman 404 sederhana dengan pesan dan link ke beranda. Tambah konfigurasi redirect di `_redirects` dan `netlify.toml`. | `public/404.html`, `public/_redirects`, `netlify.toml` | 1-2 jam | 0.1 | Sedang (audit 5, 7) |
| 3.3 | Buat og:image 1200x630 khusus social sharing (foto + nama + peran). Tambah `og:image:width`, `og:image:height`. Ganti Twitter card ke `summary_large_image`. | `index.html`, aset baru | 1-2 jam | 0.1 | Sedang (audit 3, 4) |
| 3.4 | Tambah `theme-color` meta di `index.html` untuk terang dan gelap (pakai media query). | `index.html` | 15-30 menit | - | Rendah (audit 4) |
| 3.5 | Perbaiki CommandPalette: tambah `role="combobox"`, `aria-expanded="true"`, `aria-activedescendant` pada input. Set id unik per opsi. | `src/components/CommandPalette.jsx` | 1-2 jam | - | Sedang (audit 4) |
| 3.6 | Perbaiki alt text sertifikat di modal: gunakan judul sertifikat, bukan generik. | `src/components/Certifications.jsx:111` | 15-30 menit | - | Rendah (audit 4) |
| 3.7 | Tambah indikator section aktif di nav (scrollspy) dengan `IntersectionObserver`. | `src/components/Header.jsx` | 1-2 jam | - | Rendah (audit 4) |
| 3.8 | Hapus `aria-label` redundan pada span kuantitas keranjang di PosDemo. | `src/components/PosDemo.jsx:201` | 15-30 menit | - | Rendah (audit 4) |
| 3.9 | Tambah `fetchpriority="high"` pada gambar Hero. | `src/components/Hero.jsx:88` | 15-30 menit | - | Rendah (audit 3) |
| 3.10 | Tambah width/height pada gambar sertifikat di modal (atau aspect-ratio). | `src/components/Certifications.jsx:108-114` | 15-30 menit | - | Rendah (audit 3) |
| 3.11 | Ganti tahun footer hardcoded ke `new Date().getFullYear()`. | `src/components/Footer.jsx:9` | 15-30 menit | - | Rendah (audit 6) |
| 3.12 | Ganti inline `style={{ borderRadius: '6px' }}` dengan kelas `rounded-token` di 4 lokasi. | `Hero.jsx`, `Projects.jsx`, `Certifications.jsx` | 15-30 menit | - | Rendah (audit 6) |
| 3.13 | Tambah error boundary yang membungkus komponen utama di App.jsx. | `src/App.jsx`, file baru | 30-60 menit | - | Rendah (audit 6) |
| 3.14 | Tambah apple-touch-icon dan link ke manifest. | `index.html`, `public/` | 30-60 menit | 3.1 | Opsional (audit 7) |

Total estimasi Fase 3: 5-10 jam.

---

## Fase 4: Pengisian Konten

Isi data yang masih kosong. Sebagian bisa langsung lewat CMS setelah Fase 2 selesai.

| No | Tugas | File terkait | Estimasi | Dep. | Sumber |
|----|------|-------------|----------|------|--------|
| 4.1 | Isi URL LinkedIn di profil. Bisa lewat CMS atau langsung edit `site.json`. | `src/data/site.json` | 15-30 menit | 2.4 atau langsung | placeholders.json |
| 4.2 | Buat CV PDF, taruh di `public/`, isi path `site.cv`. Bisa lewat CMS (upload) atau langsung. | `public/cv-dewa-bintang.pdf`, `src/data/site.json` | 1-2 jam | 2.8 atau langsung | placeholders.json |
| 4.3 | Isi kalimat ajakan kontak (`ui.contact.lead`). Tidak dikelola CMS, edit langsung. | `src/data/ui.json` | 15-30 menit | - | placeholders.json |
| 4.4 | Tambah screenshot untuk proyek POS. Siapkan gambar (resolusi maks 1200x800, ukuran maks 500 KB), upload lewat CMS atau taruh di `public/projects/`. Isi field screenshot, width, height, alt. | `src/data/projects/pos.json` | 1-2 jam | 2.8 atau langsung | placeholders.json |
| 4.5 | Konfirmasi klaim Nginx dan Linux VPS: ubah `verified` ke true di proyek POS dan grup Keahlian jika sudah yakin. | `projects/pos.json`, `skills/infra.json` | 15-30 menit | - | placeholders.json |

Total estimasi Fase 4: 2-5 jam.

---

## Fase 5: Polish dan Fitur Opsional

Urutan menurun berdasarkan nilai. Bisa dikerjakan bertahap setelah inti berfungsi.

| No | Tugas | File terkait | Estimasi | Dep. | Prioritas |
|----|------|-------------|----------|------|-----------|
| 5.1 | Tambah form kontak dengan Formspree (lihat ARCHITECTURE.md bagian 12). Daftar akun Formspree gratis, buat form, tambah form HTML di `Contact.jsx` dengan `action` ke endpoint Formspree. Tambah honeypot field. Set `VITE_FORMSPREE_ID` di `.env`. | `src/components/Contact.jsx`, `.env` | 2-4 jam | 0.2, 0.4 | Tinggi di antara opsional |
| 5.2 | Tambah analytics privacy-first (Plausible self-host atau Umami cloud free). Sisipkan snippet di `index.html`. | `index.html` | 30-60 menit | 0.1 | Sedang |
| 5.3 | Code splitting PosDemo dengan `React.lazy` + `Suspense`. Atur manualChunks di vite.config. | `src/components/Projects.jsx`, `vite.config.js` | 1-2 jam | 1.10 | Sedang |
| 5.4 | Kompres ulang favicon dan sertifikat yang besar. Sederhanakan favicon SVG. | `public/favicon.svg`, sertifikat webp | 30-60 menit | 3.1 | Sedang |
| 5.5 | Buat versi gambar Hero ukuran display (112x112 dan 224x224 retina) untuk kurangi ukuran unduhan. | `public/` | 30-60 menit | - | Rendah |
| 5.6 | Tambah tombol kembali ke atas yang muncul setelah scroll melewati Hero. | `src/App.jsx` atau komponen baru | 30-60 menit | - | Rendah |
| 5.7 | Tambah scroll progress indicator (garis tipis di atas). | komponen baru + CSS | 30-60 menit | - | Rendah |
| 5.8 | Tambah PWA manifest (`manifest.webmanifest`) dengan ikon 192x192 dan 512x512. | `public/manifest.webmanifest`, `index.html` | 1-2 jam | 3.1, 3.14 | Rendah |
| 5.9 | Tambah indikator scroll horizontal di nav mobile (gradient fade di tepi atau panah). | `src/components/Header.jsx` | 30-60 menit | - | Rendah |
| 5.10 | Hapus sistem LOCALE yang dikomentari di content.js sampai benar-benar dibutuhkan, atau dokumentasikan sebagai roadmap. | `src/data/content.js` | 15-30 menit | - | Rendah |
| 5.11 | Tambah structured data JSON-LD untuk proyek (SoftwareApplication atau CreativeWork). | `index.html` atau generate-seo.mjs | 1-2 jam | 0.1 | Rendah |
| 5.12 | Tambah halaman detail proyek jika konten bertambah. Pertimbangkan React Router atau hash routing. | struktur baru | 4-8 jam | 5.3 | Rendah, mungkin tidak perlu |

Total estimasi Fase 5: 11-22 jam (atau lebih jika semua dikerjakan).

---

## Ringkasan Timeline

| Fase | Estimasi total | Dependensi utama |
|------|---------------|------------------|
| 0: Perbaikan kritis/tinggi | 2-4 jam | Tidak ada |
| 1: Migrasi struktur konten | 4-7 jam | Fase 0 selesai |
| 2: Setup CMS | 8-13 jam | Fase 1 selesai + akun GitHub |
| 3: Perbaikan UI/UX | 5-10 jam | Fase 0 selesai (bisa paralel dengan 1-2) |
| 4: Pengisian konten | 2-5 jam | Fase 2 selesai (atau langsung edit JSON) |
| 5: Polish dan opsional | 11-22 jam | Fase 0-2 selesai |
| **Total** | **32-61 jam** | |

Rentang bawah adalah skenario cepat (konten sederhana, tanpa hambatan). Rentang atas termasuk tes iteratif, revisi, dan tugas opsional. Fase 5 opsional sehingga total inti (Fase 0-4) adalah 21-39 jam.

Fase 0 dan 3 bisa dikerjakan paralel (3 tidak bergantung 1-2). Fase 1 dan 2 harus berurutan. Fase 4 butuh Fase 2 untuk CMS, tapi sebagian bisa langsung edit JSON. Fase 5 opsional dan bisa disebar sesuai prioritas.

## Urutan Eksekusi yang Disarankan

1. Fase 0 (semua) selesai dulu.
2. Fase 1 dan Fase 3 paralel (berbeda file, tidak bentrok).
3. Fase 2 setelah Fase 1 selesai.
4. Fase 4 setelah Fase 2 selesai (sebagian bisa langsung edit JSON kapan saja).
5. Fase 5 bertahap sesuai prioritas.
