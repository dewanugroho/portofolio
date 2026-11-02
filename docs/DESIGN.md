# Panduan Desain: Portofolio Dewa Bintang Nugroho

Dokumen ini memandu keputusan desain visual dan interaksi. Status: perancangan. Arah desain: editorial-minimal, interaktif, kreatif, tetap profesional.

---

## 1. Prinsip Editorial-Minimal

Inspirasi: majalah editorial dan koran kualitas tinggi. Bukan dashboard, bukan landing page SaaS. Tujuannya: konten adalah pahlawan, bukan dekorasi.

Prinsip yang pegang:

- **Konten lebih penting dari chrome.** Header ramping, banyak ruang putih, tipografi yang kuat. Tidak ada kotak berbayang, tidak ada gradient berlebih, tidak ada glassmorphism.
- **Satu kolom, fokus vertikal.** Lebar maksimum konten 48rem (sudah ada di `max-w-content`). Pembaca mengikuti alur dari atas ke bawah seperti membaca esai.
- **Hierarki tipografi yang jelas.** Heading pakai ukuran dan ketebalan, bukan warna mencolok. Label section pakai mono kecil, uppercase, tracking lebar (sudah ada pola ini).
- **Warna sebagai aksen, bukan dekorasi.** Palet netral (paper, ink, muted, rule) dengan satu warna aksen (teal). Aksen hanya di tombol, link aktif, dan highlight. Jangan oleskan aksen ke background besar.
- **Batas dan garis, bukan bayangan.** Pemisah section pakai border tipis (`border-rule`), bukan shadow. Modal dan kartu pakai border, bukan elevation.

## 2. Tipografi

### Family font

| Kegunaan | Font | Catatan |
|----------|------|--------|
| Body, heading | System UI sans-serif | Sudah dikonfigurasi di `tailwind.config.js`: ui-sans-serif, system-ui, Segoe UI, Roboto, Helvetica Neue, Arial. Tidak load font eksternal, sehingga cepat dan tidak ada layout shift. |
| Label, mono detail | System UI monospace | ui-monospace, SFMono-Regular, Menlo, Consolas. Dipakai untuk: nomor urut proyek, label section, tag teknologi, tekanan angka. |

Pertimbangan: bisa tambah font display (mis. Inter, Fraunces, atau Newsreader) lewat `@font-face` atau Fontsource untuk karakter yang lebih khas. Tapi ini opsional. Font sistem sudah terlihat rapi dan cepat. Jika ditambah, prioritaskan variable font satu bobot untuk menghemat ukuran.

### Skala ukuran

| Elemen | Ukuran | Saat ini |
|--------|--------|----------|
| H1 (nama di Hero) | `clamp(2.25rem, 6vw, 3.5rem)` | Sudah ada |
| H2 (label section) | `text-xs` uppercase tracking-wider | Sudah ada, sengaja kecil agar tidak mengganggu konten |
| H3 (judul proyek) | `text-xl` atau `text-2xl` untuk proyek pertama | Sudah ada |
| Body | `text-sm` (14px) | Sudah ada. Cukup untuk densitas editorial. |
| Detail | `text-xs` (12px) | Sudah ada, untuk mono detail. |

### Praktik

- Line-height body: `leading-relaxed` (sudah ada).
- Letter-spacing H1: `-0.02em` (sudah ada, rapikan judul besar).
- Jangan pakai font-weight di atas 600. 500 dan 600 sudah cukup untuk hierarki.
- Jangan ubah ukuran font dengan inline style secara berulang. Pakai kelas Tailwind atau token CSS.

## 3. Warna

### Token yang sudah ada

| Token | Terang | Gelap | Penggunaan |
|-------|--------|-------|------------|
| paper | `#fafaf9` | `#1c1917` | Background halaman |
| surface | `#ffffff` | `#292524` | Background kartu, modal, tombol |
| ink | `#1c1917` | `#fafaf9` | Teks utama |
| muted | `#57534e` | `#a8a29e` | Teks sekunder, label |
| rule | `#e7e5e4` | `#44403c` | Garis pemisah, border |
| accent | `#0f766e` | `#2dd4bf` | Tombol, link aktif, highlight |
| accent-strong | `#115e59` | `#5eead4` | Hover state tombol |

Token ini didefinisikan sebagai CSS variable di `src/index.css` dan dipetakan ke kelas Tailwind di `tailwind.config.js`. Sudah benar. Pertahankan pola ini.

### Aturan pemakaian

- Background selalu paper atau surface. Jangan pakai accent sebagai background besar.
- Teks selalu ink (utama) atau muted (sekunder). Teks accent hanya untuk feedback (mis. "Email disalin") dan link aktif.
- Border selalu rule. Jangan pakai accent sebagai border kecuali untuk focus ring.
- Tombol: background accent, teks surface. Hover: accent-strong. Disabled: opacity 50%.
- Focus ring: `outline-2 outline-accent outline-offset-2` (sudah ada di CSS global). Wajib terlihat di kedua mode.

### Kontras (hasil verifikasi audit)

- muted on paper (terang): 7.3:1 (lolos AAA).
- muted on paper (gelap): 7.0:1 (lolos AAA).
- accent on surface (terang): 5.6:1 (lolos AA).
- accent on surface (gelap): 8.1:1 (lolos AAA).

Tingkat kontras sudah baik. Jangan tambah warna baru tanpa mengecek rasio kontras.

### Favicon

Saat ini favicon berwarna ungu (`#863bff`) yang tidak cocok dengan aksen teal. Harus diganti dengan warna situs atau logo inisial. Lihat TASKS.md fase perbaikan.

## 4. Dark Mode

### Mekanisme saat ini (sudah benar, pertahankan)

- Theme ditentukan saat load lewat inline script di `index.html` (anti-flash). Cek `localStorage.theme`, fallback ke `prefers-color-scheme`.
- Toggle di Header menyimpan ke `localStorage.theme`.
- Token warna beralih via class `.dark` di `<html>`, yang mengganti CSS variable.

### Aturan

- Semua warna harus pakai token (paper, ink, muted, rule, accent). Jangan hardcode hex.
- Jangan gunakan `bg-white`, `text-black`, `bg-gray-100`, atau kelas warna Tailwind default. Selalu pakai token kustom.
- Cek setiap komponen baru di kedua mode. Jangan tambahkan warna yang hanya terlihat bagus di satu mode.
- SVG inline (ikon GitHub, LinkedIn) pakai `fill="currentColor"` (sudah ada) agar mengikuti warna teks.

## 5. Interaksi Kreatif (tetap profesional)

### 5.1 Yang sudah ada (pertahankan dan sempurnakan)

**Command palette (Ctrl+K)**

- Buka dengan Ctrl+K atau Cmd+K. Cari perintah: navigasi section, salin email, ganti tema, buka GitHub.
- Bagus untuk recruiter yang terbiasa keyboard shortcut.
- Perbaikan yang dirinci di audit: tambah semantik ARIA combobox.

**Demo POS interaktif**

- Pengunjung bisa menambah menu ke keranjang, lihat total, "bayar QRIS" (simulasi).
- Menunjukkan kemampuan teknis secara langsung, bukan klaim.
- Bagus untuk klien yang mencari developer sistem kasir.

**Modal sertifikat**

- Klik sertifikat, gambar tampil di modal dengan fokus-trap dan Escape.
- Pratinjau tanpa pindah halaman.

**Smooth scroll dengan reduced-motion respect**

- Anchor link scroll halus, tapi matikan jika user set `prefers-reduced-motion`.

**Tema toggle tanpa kilatan**

- Inline script di HTML mencegah flash of wrong theme.

### 5.2 Ide interaksi baru (opsional, jangan berlebihan)

**Scroll progress indicator**

- Garis tipis di atas halaman yang mengisi sesuai progress scroll. Memberi tahu pembaca seberapa jauh mereka sudah baca. Implementasi: satu elemen `div` fixed dengan `scaleX` berbasis `scrollY`. Ringan, tidak mengganggu.

**Active section highlight di nav**

- Link nav yang sesuai section yang sedang dilihat diberi warna ink (bukan muted). Pakai `IntersectionObserver`. Memberi orientasi saat scroll panjang.

**Hover state pada daftar proyek**

- Saat hover proyek, nomor urut atau judul berubah warna ke accent. Subtle, tidak berlebihan. Hanya transisi warna 150ms.

**Sertifikat: expand ke fullscreen**

- Saat klik sertifikat, gambar tampil modal. Tambahkan opsi klik lagi untuk fullscreen (zoom ke detail). Bantu dosen yang ingin baca teks sertifikat dengan jelas.

**Kartu kontak dengan mailto interaktif**

- Saat klik "Email saya", alih-alih langsung buka mailto, tampilkan dulu kartu kecil dengan alamat email dan tombol "Salin" dan "Buka email". Lebih ramah mobile (mailto bisa mengganggu di HP).

### 5.3 Batas: jangan lakukan

- **Jangan parallax atau scroll-jacking.** Mengganggu pembacaan, menyebabkan motion sickness.
- **Jangan animasi entrance berlebihan.** Fade-in tiap section saat scroll terlihat bagus pada demo tapi mengganggu pada kunjungan kedua. Jika dipakai, hanya sekali dan 200ms maksimal.
- **Jangan auto-play media atau video.** Portofolio profesional tidak butuh itu.
- **Jangan efek 3D, WebGL, atau canvas berat.** Tidak relevan dengan tujuan. Mengorbankan performa.
- **Jangan lebih dari 2 warna aksen.** Satu aksen (teal) sudah cukup. Tambah warna hanya untuk status (mis. hijau untuk sukses, merah untuk error) dan hanya di tempat yang tepat.
- **Jangan modal yang menutup saat konten diklik.** Ini bug yang ada di modal sertifikat saat ini. Backdrop tutup, konten jangan.
- **Jangan sembunyikan scrollbar tanpa indikator alternatif.** Nav mobile saat ini sembunyikan scrollbar tanpa memberi tahu bisa scroll horizontal.
- **Jangan animasi yang tidak hormati `prefers-reduced-motion`.** Sudah ada CSS global untuk ini. Pertahankan.

## 6. Spasi dan Tata Letak

| Elemen | Spasi | Catatan |
|--------|-------|---------|
| Section padding vertical | `py-16` (4rem) | Sudah ada. Cukup ruang napas antar section. |
| Container max width | `48rem` (max-w-content) | Sudah ada. Satu kolom, fokus. |
| Padding horizontal | `px-6` (1.5rem) | Sudah ada. Cukup untuk mobile. |
| Gap antar item di section | `space-y-12` untuk proyek, `space-y-6` untuk lainnya | Sudah ada. |
| Header height | `h-14` (3.5rem) | Sudah ada. Ramping. |

Aturan: jangan tambah section tanpa konsistensi spasi. Setiap section punya `py-16 px-6 border-b border-rule`. Pengecualian: Hero dan Footer.

## 7. Responsif

### Breakpoint (Tailwind default)

| Breakpoint | Lebar | Target |
|------------|------|--------|
| sm | 640px | HP landscape, tablet portrait |
| md | 768px | Tablet landscape, laptop kecil |
| lg | 1024px | Laptop, desktop |

### Aturan responsif

- **Mobile-first.** Default kelas tanpa prefix untuk mobile. Tambah `sm:` atau `md:` untuk layar lebih besar.
- **Hero**: flex-col di mobile, flex-row di md ke atas. Foto di bawah teks di mobile, di samping (kanan) di desktop. Sudah ada.
- **Nav**: horizontal scroll di mobile. Pertimbangkan menu hamburger jika item bertambah. Untuk sekarang 6 item masih muat dengan scroll.
- **Skills, Education, Experience**: grid 1 kolom di mobile, 2 kolom di sm ke atas. Sudah ada.
- **Demo POS**: grid 1 kolom di mobile, 2 kolom di md. Sudah ada.
- **Target utama mobile**: bukan tablet atau desktop. Pastikan semua bisa diakses di layar 360px lebar.

## 8. Aksesibilitas sebagai Bagian Desain

Aksesibilitas bukan add-on, tapi bagian dari desain. Lihat detail temuan di `docs/AUDIT.md` kategori 4. Prinsip:

- Setiap section punya `aria-labelledby` ke heading-nya (sudah ada).
- Modal punya focus trap, Escape untuk tutup, dan kembalikan fokus ke pemicu (sudah ada di CommandPalette dan PosDemo, perlu perbaikan di Certifications).
- Skip link di awal halaman (sudah ada).
- `prefers-reduced-motion` dihormati (sudah ada di CSS).
- Kontras warna lolos AA minimum (sudah ada, jangan rusak).
- Semua elemen interaktif terjangkau via keyboard (tab, enter, escape, arrow).
- Alt text gambar deskriptif, bukan generik.
