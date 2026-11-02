# Audit Portofolio Web

Tanggal audit: 2 November 2026
Stack: React 19 + Vite 8 + Tailwind CSS 3.4
Status build: lulus | Status lint: lulus | Status smoke test: lulus

Catatan: audit ini hanya pemeriksaan, tidak ada perubahan kode. Nomor baris merujuk kondisi file saat audit.

---

## Ringkasan Eksekutif

Portofolio ini sudah punya fondasi yang rapi: konten dipisah ke file JSON, tervalidasi skema Zod, ada command palette, dark mode tanpa kilatan, fokus-trap di modal, dan smoke test di CI. Yang perlu diperhatikan ada di beberapa arah: kerentanan dependensi dev, VITE_SITE_URL masih placeholder, modal sertifikat yang menutup saat gambar diklik, beberapa celah SEO, dan sejumlah data konten yang belum diisi (LinkedIn, CV, screenshot POS).

---

## 1. Kesalahan dan Bug

| Temuan | Lokasi | Tingkat | Saran perbaikan |
|--------|--------|---------|-----------------|
| Modal sertifikat menutup saat gambar diklik. `onClick={closeModal}` dipasang di div container, bukan backdrop terpisah, jadi klik gambar ikut menutup modal. Komponen lain (CommandPalette, PosDemo) sudah pakai cek `event.target === event.currentTarget`. | `src/components/Certifications.jsx:94` | Sedang | Pisahkan backdrop dan konten. Pasang `onClick` hanya di backdrop, atau tambahkan cek `event.target === event.currentTarget`. |
| `npm audit` menemukan 10 kerentanan (3 high, 7 moderate) di devDependencies: vite 8.2.2 rentan command injection dan path traversal di Windows, brace-expansion DoS, source-map-js DoS, minimatch DoS, postcss-selector-parser DoS, serta rantai eslint. | `package.json` (dependensi) | Tinggi | Jalankan `npm audit fix` untuk yang bisa otomatis. Untuk vite, upgrade ke versi di atas 8.2.2. Kerentanan ini ada di devDependencies sehingga tidak masuk bundle produksi, tapi tetap berisiko di lingkungan pengembangan Windows. |
| File `.env` terlacak di git. Saat ini hanya berisi `VITE_SITE_URL=https://example.com` (bukan secret), tapi praktik ini berbahaya jika nanti ada nilai sensitif yang ditambahkan. | `.env`, `.gitignore` | Sedang | Tambahkan `.env` ke `.gitignore`. Sudah ada `.env.example` sebagai template, jadi `.env` cukup lokal. |
| `preview.log` tersisa di workspace (hasil `vite preview`). Sudah ter-ignore git via pola `*.log`, jadi tidak ikut commit, tapi tetap harus dibersihkan. | `preview.log` | Rendah | Hapus file. Tidak perlu tindakan pada `.gitignore` karena sudah tercakup. |

---

## 2. Celah Keamanan

| Temuan | Lokasi | Tingkat | Saran perbaikan |
|--------|--------|---------|-----------------|
| Tidak ada security headers di konfigurasi deploy. `netlify.toml` hanya berisi build command dan SPA redirect, tanpa CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, atau Permissions-Policy. | `netlify.toml` | Sedang | Tambahkan header keamanan di `netlify.toml` lewat blok `[[headers]]`. Untuk situs statis tanpa form, minimal pasang X-Content-Type-Options, X-Frame-Options, Referrer-Policy, dan Permissions-Policy. CSP bisa menyusul setelah diuji. |
| `.env` terlacak di git (lihat kategori 1). Walau saat ini tidak ada secret, ini kebiasaan yang berisiko. | `.env` | Sedang | Pindahkan `.env` ke `.gitignore` dan `git rm --cached .env`. |
| Email terekspos di JSON-LD structured data (`mailto:dewanugroho004@gmail.com`). Bot scraper bisa membaca alamat ini dari markup. | `index.html:35` | Rendah | Ini pilihan sah untuk schema.org Person, tapi jika khawatir spam, bisa dihapus dari JSON-LD dan biarkan email hanya tampil di UI. Pertimbangkan obfuscasi atau form kontak. |
| Kerentanan dependensi dev (lihat kategori 1 untuk detail). | `package.json` | Tinggi | Lihat saran di kategori 1. |

---

## 3. Performa

| Temuan | Lokasi | Tingkat | Saran perbaikan |
|--------|--------|---------|-----------------|
| Tidak ada code splitting atau lazy loading. Seluruh bundle JS (225 KB / 70 KB gzip) dimuat sekaligus, termasuk PosDemo yang cukup besar dan hanya tampil di satu proyek. | `src/App.jsx`, `vite.config.js` | Sedang | Pertimbangkan `React.lazy` + `Suspense` untuk PosDemo, atau set `build.rollupOptions.output.manualChunks` di Vite config untuk memisahkan vendor. Dampaknya kecil untuk situs satu halaman, tapi membantu jika konten bertambah. |
| `favicon.svg` berukuran 9.3 KB. Cukup besar untuk favicon karena berisi banyak filter SVG (blur) dan ellips. | `public/favicon.svg` | Rendah | Sederhanakan SVG atau sediakan versi yang lebih ringkas. Bisa juga tambah favicon PNG 32x32 sebagai fallback yang lebih kecil. |
| `sertifikat-usahid.webp` berukuran 137 KB, dimuat di modal. Ukuran wajar untuk gambar sertifikat resolusi tinggi, tapi bisa diperberat di koneksi lambat. | `public/sertifikat-usahid.webp` | Rendah | Kompres ulang atau sediakan versi preview lebih kecil untuk modal, dengan link ke versi full-res. |
| `foto_formal.jpg` 354x472 piksel (17 KB) ditampilkan hanya 112x112. Ukuran asli berlebih untuk display. | `public/foto_formal.jpg`, `src/components/Hero.jsx:88-92` | Rendah | Buat versi 112x112 atau 224x224 (untuk retina) untuk Hero. Simpan versi besar hanya untuk og:image. |
| `og:image` memakai `foto_formal.jpg` (354x472), bukan rasio 1200x630 yang direkomendasikan untuk pratinjau sosial. Hasilnya bisa terpotong atau terlalu kecil di platform sosial. | `index.html:25`, `public/foto_formal.jpg` | Sedang | Buat gambar OG khusus 1200x630 (mis. foto + nama + peran). Tambahkan `og:image:width` dan `og:image:height`. |
| Tidak ada `fetchpriority="high"` pada gambar Hero (di atas lipat). | `src/components/Hero.jsx:88` | Rendah | Tambah `fetchpriority="high"` pada img Hero untuk membantu prioritas pemuatan. Dampak kecil karena gambar kecil, tapi praktik baik. |
| Gambar sertifikat di modal tidak punya atribut `width`/`height`, berpotensi menyebabkan layout shift saat gambar termuat. | `src/components/Certifications.jsx:108-114` | Rendah | Tambahkan `width`/`height` (atau `aspect-ratio`) untuk mengurangi CLS. Karena dimensi dinamis, bisa simpan di data sertifikasi. |

---

## 4. SEO dan Aksesibilitas

### SEO

| Temuan | Lokasi | Tingkat | Saran perbaikan |
|--------|--------|---------|-----------------|
| `VITE_SITE_URL` masih bernilai placeholder `https://example.com`. Akibatnya canonical, Open Graph, JSON-LD, sitemap.xml, dan robots.txt semua menunjuk ke domain contoh. | `.env:6`, `index.html:12,20,26`, `dist/sitemap.xml`, `dist/robots.txt` | Tinggi | Set `VITE_SITE_URL` ke domain final sebelum deploy. Bisa lewat `.env` atau environment variable di panel build hosting. README sudah dokumentasikan ini, tapi tetap perlu diingat. |
| Twitter card pakai `summary`, padahal `summary_large_image` lebih cocok untuk portofolio dengan gambar. | `index.html:27` | Sedang | Ganti ke `summary_large_image` dan pastikan og:image sudah 1200x630. |
| Tidak ada `og:image:width` dan `og:image:height`. Beberapa platform butuh dua tag ini untuk menampilkan pratinjau tanpa harus memuat gambar dulu. | `index.html` | Rendah | Tambahkan kedua meta tag sesuai dimensi gambar OG. |
| Tidak ada `theme-color` meta. Browser mobile tidak akan mewarnai address bar sesuai tema. | `index.html` | Rendah | Tambah `<meta name="theme-color" content="#0f766e">` (atau media query untuk dark: `content="#1c1917"`). |
| Tidak ada structured data untuk proyek. JSON-LD hanya ada `Person`. Proyek bisa diperkaya dengan `SoftwareApplication` atau `CreativeWork`. | `index.html` | Rendah | Tambah JSON-LD `ItemList` berisi proyek dengan `SoftwareApplication` per item. Opsional, dampak SEO kecil tapi memperkuat penelusuran terstruktur. |

### Aksesibilitas

| Temuan | Lokasi | Tingkat | Saran perbaikan |
|--------|--------|---------|-----------------|
| Command palette: input pencarian kurang semantik combobox ARIA. Input punya `aria-controls` ke listbox, tapi tidak ada `role="combobox"`, `aria-expanded`, dan `aria-activedescendant`. Screen reader tidak akan mengumumkan opsi aktif saat navigasi panah. | `src/components/CommandPalette.jsx:215-220` | Sedang | Tambah `role="combobox"`, `aria-expanded="true"`, dan `aria-activedescendant` yang menunjuk id opsi aktif pada input. Set id unik per opsi. |
| Alt text gambar sertifikat generik: `"Pratinjau sertifikat"` tidak mengidentifikasi sertifikat mana. | `src/components/Certifications.jsx:111` | Rendah | Gunakan judul sertifikat: `alt={\`Pratinjau sertifikat ${cert.title}\`}`. |
| Nav mobile pakai `overflow-x-auto` dengan `no-scrollbar` (scrollbar disembunyikan). Tidak ada indikator visual bahwa menu bisa di-scroll horizontal. | `src/components/Header.jsx:38-43` | Rendah | Tambahkan indikator visual (gradient fade di tepi, atau panah) atau pertimbangkan menu hamburger di mobile. |
| `aria-label` pada span kuantitas keranjang redundan: nilainya sama persis dengan teks tampilan. | `src/components/PosDemo.jsx:201` | Rendah | Hapus `aria-label` atau ganti jadi lebih deskriptif (mis. `aria-label={\`Jumlah: ${cart[item.id]}\`}`). |
| Tidak ada indikator section aktif di navigasi (scrollspy). Pengguna tidak tahu sedang di bagian mana saat scroll. | `src/components/Header.jsx:38-50` | Rendah | Tambah `IntersectionObserver` untuk menandai link nav sesuai section yang terlihat. |

---

## 5. UI/UX

| Temuan | Lokasi | Tingkat | Saran perbaikan |
|--------|--------|---------|-----------------|
| Favicon berwarna ungu (`#863bff`, `#7e14ff`) tidak cocok dengan aksen situs yang teal (`#0f766e` terang / `#2dd4bf` gelap). Inkonsistensi identitas visual. | `public/favicon.svg` | Sedang | Buat ulang favicon dengan palet warna situs (teal) atau logo inisial yang konsisten. |
| Beberapa data konten masih kosong: LinkedIn (`""`), CV (`""`), contact lead (`""`), dan screenshot proyek POS (`""`). Bagian Kontak dan Hero terasa belum lengkap. | `src/data/site.json:9-10`, `src/data/ui.json` (contact.lead), `src/data/projects.json:6` | Sedang | Isi LinkedIn, unggah CV PDF, tambah kalimat ajakan kontak, dan screenshot POS. Daftar ini sudah tertata di `src/data/placeholders.json`. |
| Tidak ada halaman 404. SPA fallback menyajikan `index.html` untuk semua path, jadi URL salah tidak memberi sinyal jelas. | `netlify.toml:9-12`, `public/_redirects` | Sedang | Buat halaman 404 sederhana. Atur redirect 404 terpisah di `_redirects` (mis. `/* /index.html 200` dipertahankan, tapi tambah halaman 404 dengan `/* /404.html 404`). |
| Modal sertifikat memakai `bg-paper` (opaque penuh), sementara CommandPalette dan PosDemo pakai `bg-ink/30` (semi-transparan). Tidak konsisten. | `src/components/Certifications.jsx:94` | Rendah | Samakan pola overlay. Pakai backdrop semi-transparan dengan konten terpisah. |
| Navigasi mobile hanya horizontal scroll tanpa menu khusus. Bisa sulit dipakai di layar kecil dengan banyak item. | `src/components/Header.jsx:38-43` | Rendah | Pertimbangkan menu hamburger atau drawer di mobile, dengan nav penuh tetap di desktop. |
| Tidak ada tombol "kembali ke atas" setelah scroll panjang. | `src/App.jsx` | Rendah | Tambah tombol sticky yang muncul setelah scroll melewati Hero. |

---

## 6. Kualitas Kode

| Temuan | Lokasi | Tingkat | Saran perbaikan |
|--------|--------|---------|-----------------|
| `.env` terlacak di git (lihat kategori 1 dan 2). | `.env` | Sedang | Pindahkan ke `.gitignore`. |
| Tahun di footer di-hardcode (`2026`), bukan diambil dari tanggal sistem. | `src/components/Footer.jsx:9` | Rendah | Ganti dengan `new Date().getFullYear()`. |
| Inline style `borderRadius: '6px'` diulang 4 kali, padahal `tailwind.config.js` sudah definisikan `borderRadius.token: '6px'`. | `src/components/Hero.jsx:44,91`, `src/components/Projects.jsx:28`, `src/components/Certifications.jsx:112` | Rendah | Ganti inline style dengan class Tailwind `rounded-token`. |
| Tidak ada TypeScript. Seluruh kode pakai JSX polos tanpa tipe, padahal `@types/react` dan `@types/react-dom` sudah terpasang. | seluruh `src/` | Rendah | Opsional: migrasi bertahap ke TS, atau tambah JSDoc untuk prop komponen. Tidak mendesak untuk proyek skala ini. |
| Sistem LOCALE di `content.js` punya entri `en` yang dikomentari. Abstraksi belum terpakai dan bisa menyesatkan. | `src/data/content.js:17-19` | Rendah | Jika belum akan pakai multi-bahasa dalam waktu dekat, pertimbangkan hapus komentar sampai benar-benar dibutuhkan, atau dokumentasikan sebagai roadmap. |
| Tidak ada error boundary. Jika satu komponen error saat render (mis. data rusak lolos validasi), seluruh halaman blank. | `src/App.jsx` | Rendah | Bungkus komponen utama dengan `ErrorBoundary` class component yang menampilkan fallback. |

---

## 7. Hal yang Perlu Ditambahkan

| Temuan | Lokasi | Tingkat | Saran |
|--------|--------|---------|-------|
| CV/Resume yang bisa diunduh. Field `site.cv` ada tapi kosong. Tombol unduh tidak tampil karena `hasCv` false. | `src/data/site.json:10`, `src/components/Hero.jsx:20-24` | Sedang | Buat CV PDF, taruh di `public/`, isi `site.cv` dengan path. Tombol "Unduh CV" akan otomatis muncul menggantikan "Lihat proyek". |
| Link profil LinkedIn. Field `site.linkedin` kosong, jadi ikon LinkedIn tidak tampil di Hero maupun Kontak. | `src/data/site.json:9` | Sedang | Isi URL LinkedIn. Ikon akan otomatis tampil. |
| Halaman 404 (lihat kategori 5). | tidak ada | Sedang | Lihat saran di kategori 5. |
| Analytics. Tidak ada pelacakan kunjungan sama sekali. | tidak ada | Rendah | Tambah analytics privacy-first (mis. Plausible, Umami) lewat snippet di `index.html` atau komponen. Hindari Google Analytics jika privasi jadi prioritas. |
| Form kontak yang berfungsi. Saat ini hanya link `mailto:`. Form memberi pengalaman lebih baik untuk recruiter/klien dan bisa dikaitkan ke layanan (Formspree, Netlify Forms). | `src/components/Contact.jsx` | Rendah | Tambah form sederhana dengan validasi dan anti-spam (honeypot atau reCAPTCHA). Kirim ke endpoint Formspree/Netlify Forms. |
| og:image 1200x630 khusus social sharing (lihat kategori 3 dan 4). | tidak ada | Sedang | Lihat saran di kategori 3. |
| Security headers di konfigurasi hosting (lihat kategori 2). | `netlify.toml` | Sedang | Lihat saran di kategori 2. |
| PWA manifest dan apple-touch-icon. Tidak ada `manifest.webmanifest`, `theme-color`, atau `apple-touch-icon`. | `index.html`, `public/` | Rendah | Tambah `manifest.webmanifest` dengan ikon 192x192 dan 512x512, plus `<link rel="apple-touch-icon">`. |
| Halaman detail proyek. Saat ini semua proyek dalam satu halaman. Halaman detail per proyek bisa memuat screenshot lebih besar, deskripsi teknis, dan link live demo. | `src/components/Projects.jsx` | Rendah | Opsional untuk skala saat ini. Jika konten proyek bertambah, pertimbangkan routing per proyek (mis. React Router atau hash route). |

---

## Prioritas Perbaikan Berurutan

Urutan ini mempertimbangkan dampak terhadap pengguna, keamanan, dan kesiapan deploy.

1. **Set `VITE_SITE_URL` ke domain final** sebelum deploy. Tanpa ini, canonical, OG, sitemap, dan robots semua salah. (Kategori 4, Tinggi)

2. **Perbaiki modal sertifikat yang menutup saat gambar diklik.** Pisahkan backdrop dari konten agar gambar bisa dilihat tanpa modal tertutup. (Kategori 1, Sedang)

3. **Tangani kerentanan dependensi.** Jalankan `npm audit fix` dan upgrade vite ke atas 8.2.2. (Kategori 1 dan 2, Tinggi)

4. **Tambahkan security headers di `netlify.toml`.** Minimal X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy. (Kategori 2, Sedang)

5. **Hentikan tracking `.env` di git.** Tambah ke `.gitignore` dan `git rm --cached .env`. (Kategori 1, 2, 6, Sedang)

6. **Isi konten yang masih kosong:** LinkedIn, CV PDF, contact lead, dan screenshot POS. (Kategori 5 dan 7, Sedang)

7. **Buat og:image 1200x630** dan tambahkan `og:image:width`/`height`. Ganti Twitter card ke `summary_large_image`. (Kategori 3 dan 4, Sedang)

8. **Perbaiki aksesibilitas command palette.** Tambah `role="combobox"`, `aria-expanded`, `aria-activedescendant` pada input. (Kategori 4, Sedang)

9. **Buat halaman 404.** Atur redirect terpisah agar URL salah tidak menyajikan halaman utama tanpa sinyal. (Kategori 5 dan 7, Sedang)

10. **Samakan favicon dengan palet situs.** Ganti warna ungu ke teal. (Kategori 5, Sedang)

11. **Tahun footer jadi dinamis** dan ganti inline `borderRadius` dengan class Tailwind `rounded-token`. (Kategori 6, Rendah)

12. **Tambahkan `theme-color` meta, `fetchpriority` pada gambar Hero, dan pertimbangkan code splitting untuk PosDemo.** (Kategori 3 dan 4, Rendah)

13. **Tambahkan error boundary** untuk mencegah halaman blank saat komponen gagal render. (Kategori 6, Rendah)

14. **Tambahkan analytics, form kontak, dan PWA manifest** sebagai peningkatan berikutnya. (Kategori 7, Rendah)
