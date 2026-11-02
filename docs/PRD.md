# PRD: Portofolio Dewa Bintang Nugroho

Dokumen ini berisi kebutuhan produk untuk situs portofolio pribadi. Status: perancangan, bukan implementasi.

---

## 1. Tujuan

Situs ini punya tiga tujuan utama:

1. **Menampilkan hasil kerja** kepada recruiter, klien, dan kolega akademik dengan cepat dan jelas.
2. **Mengelola konten tanpa kode**. Pemilik bisa menambah, mengubah, dan menghapus proyek, sertifikat, keahlian, pengalaman, pendidikan, dan data profil lewat antarmuka admin, tanpa menyentuh file kode dan tanpa deploy ulang manual.
3. **Menjadi mudah ditemukan** di mesin pencari dan media sosial dengan SEO dan structured data yang benar.

## 2. Target Pengunjung

| Pengunjung | Tujuan utama | Yang dicari | Waktu yang tersedia |
|------------|-------------|-------------|---------------------|
| Recruiter | Menilai kandidat dengan cepat | Keahlian, proyek relevan, kontak, CV | 30-60 detik |
| Klien (UMKM/startup) | Mencari developer untuk proyek | Proyek serupa, bukti hasil, cara menghubungi | 1-2 menit |
| Dosen/kolega akademik | Melihat konteks tugas akhir atau riset | Pendidikan, sertifikasi, proyek NLP | 2-3 menit |

## 3. User Persona

### Persona A: Andi, recruiter teknis (27 tahun)

Bekerja di startup yang sedang cari fullstack developer. Buka portofolio dari laptop, sering buka 10-20 tab kandidat sekaligus. Butuh ringkasan keahlian dan proyek dalam 30 detik. Jika tertarik, langsung cari tombol unduh CV dan email kontak. Tidak sabar dengan loading lambat atau navigasi yang membingungkan.

### Persona B: Bu Sari, pemilik usaha kuliner (45 tahun)

Mau buat sistem kasir online. Cari developer yang sudah punya pengalaman serupa. Buka portofolio dari HP saat istirahat. Tertarik dengan demo POS interaktif. Ingin melihat bukti bahwa sistem sudah dipakai sungguhan. Kalau cocok, langsung email atau WhatsApp.

### Persona C: Pak Joko, dosen pembimbing (50 tahun)

Ingin memastikan mahasiswanya punya portofolio yang layak untuk konteks akademik. Buka dari laptop kampus. Perhatikan pendidikan, sertifikasi, dan detail proyek tugas akhir (chatbot NLP). Peduli pada kerapian dan keterbacaan, bukan efek visual yang mencolok.

## 4. User Stories

### Pengunjung

- Sebagai recruiter, saya ingin melihat keahlian dan proyek utama di halaman pertama tanpa harus scroll jauh, supaya bisa menilai kandidat dengan cepat.
- Sebagai recruiter, saya ingin mengunduh CV dalam satu klik, supaya bisa menyimpan profil kandidat untuk proses seleksi.
- Sebagai klien, saya ingin melihat demo interaktif sistem kasir, supaya bisa menilai kemampuan teknis secara langsung.
- Sebagai klien, saya ingin menghubungi pemilik lewat form atau email, supaya bisa mulai diskusi proyek.
- Sebagai dosen, saya ingin melihat detail pendidikan dan proyek akademik, supaya bisa menilai kualitas lulusan.
- Sebagai pengunjung, saya ingin beralih mode gelap/terang sesuai preferensi, supaya nyaman dibaca di kondisi cahaya apa pun.
- Sebagai pengunjung dengan keterbatasan, saya ingin navigasi keyboard dan screen reader yang berfungsi, supaya bisa mengakses seluruh konten.

### Pemilik (admin)

- Sebagai pemilik, saya ingin menambah proyek baru lewat form, tanpa mengedit kode, supaya portofolio selalu mutakhir.
- Sebagai pemilik, saya ingin mengubah teks profil dan status ketersediaan kerja, supaya recruiter tahu saya sedang mencari peluang.
- Sebagai pemilik, saya ingin mengunggah gambar sertifikat dan screenshot proyek lewat admin, tanpa manually menaruh file di folder.
- Sebagai pemilik, saya ingin melihat pratinjau konten sebelum menerbitkan, supaya tidak ada typo atau data salah yang tampil ke publik.
- Sebagai pemilik, saya ingin menghapus proyek dengan konfirmasi, supaya tidak hapus secara tidak sengaja.
- Sebagai pemilik, saya ingin perubahan langsung tampil di situs tanpa deploy manual, supaya hemat waktu.

## 5. Fitur Wajib

| ID | Fitur | Untuk siapa | Status saat ini |
|----|-------|-------------|-----------------|
| F1 | Halaman beranda satu halaman: Hero, Proyek, Keahlian, Pendidikan, Pengalaman, Sertifikasi, Kontak | Semua pengunjung | Sudah ada, perlu perbaikan |
| F2 | Sistem pengelolaan konten tanpa kode (CMS) | Pemilik | Belum ada |
| F3 | Halaman admin: login, daftar koleksi, form tambah/edit, upload gambar, pratinjau, hapus dengan konfirmasi | Pemilik | Belum ada |
| F4 | Perbaikan temuan Kritis dan Tinggi dari audit (VITE_SITE_URL, security headers, dependensi, modal bug) | Semua | Belum dikerjakan |
| F5 | Halaman 404 | Semua pengunjung | Belum ada |
| F6 | OG image 1200x630 untuk social sharing | SEO | Belum ada |
| F7 | Isi konten yang masih kosong: LinkedIn, CV, contact lead, screenshot POS | Semua | Belum diisi |
| F8 | Dark mode dengan anti-flash | Semua pengunjung | Sudah ada |
| F9 | Aksesibilitas: skip link, focus trap, ARIA, keyboard nav | Pengunjung dengan keterbatasan | Sebagian ada, perlu lengkap |
| F10 | Validasi konten dengan Zod sebelum build | Developer | Sudah ada |

## 6. Fitur Opsional

| ID | Fitur | Catatan |
|----|-------|---------|
| O1 | Form kontak dengan penyimpanan pesan | Bisa pakai Netlify Forms atau Formspree (gratis) |
| O2 | Analytics privacy-first | Plausible atau Umami, bukan Google Analytics |
| O3 | PWA manifest + apple-touch-icon | Untuk instalasi di layar utama mobile |
| O4 | Halaman detail proyek | Routing per proyek, relevan jika konten bertambah |
| O5 | Tombol kembali ke atas | Muncul setelah scroll melewati Hero |
| O6 | Indikator section aktif di nav (scrollspy) | Bantu orientasi saat scroll panjang |
| O7 | Dukungan multi-bahasa (Inggris) | Skema LOCALE sudah disiapkan, tinggal isi |
| O8 | Error boundary | Cegah halaman blank saat komponen gagal render |

## 7. Kriteria Keberhasilan

- Pemilik bisa menambah, mengubah, dan menghapus entri konten (proyek, sertifikat, keahlian, pengalaman, pendidikan, profil) lewat halaman admin tanpa membuka editor kode.
- Perubahan konten terbit otomatis ke situs publik tanpa deploy manual.
- Biaya bulanan operasional: nol (hanya hosting gratis dan layanan CMS gratis).
- Skor Lighthouse Performance di atas 90 di mobile.
- Tidak ada temuan Kritis atau Tinggi dari audit yang belum ditangani sebelum CMS mulai dipakai.
- Situs tetap static (client-side rendered, konten ter-build ke bundle) untuk performa dan SEO terbaik.

## 8. Di Luar Cakupan

- Multi-user admin atau peran editor (hanya satu pemilik).
- E-commerce atau transaksi nyata (demo POS tetap simulasi).
- Blog atau sistem artikel (bukan fokus portofolio).
- Backend server khusus atau database runtime untuk konten publik.
- CMS yang menulis ke database eksternal untuk konten publik (konten tetap di repo Git).

## 9. Risiko

| Risiko | Dampak | Kemungkinan | Mitigasi |
|--------|--------|-------------|----------|
| Waktu publish ~2 menit (build CI) bukan instan | Rendah. Portofolio bukan situs real-time. | Pasti terjadi | Terima sebagai tradeoff. Jika butuh instan, pertimbangkan Supabase sebagai alternatif (lihat ARCHITECTURE.md). |
| Autentikasi CMS bermasalah (git-gateway/Identity) | Sedang. Pemilik tidak bisa edit. | Rendah | Sediakan recovery: re-deploy atau re-enable Netlify Identity. |
| Sveltia CMS belum versi 1.0 stabil | Sedang. Bug di admin. | Rendah (sudah feature complete) | Pin versi spesifik. Jika masalah, switch ke Decap CMS (API kompatibel). |
| Konten tidak valid lolos dari CMS | Sedang. Build gagal atau data salah tampil. | Rendah | Validasi Zod tetap jalan di prebuild. Build gagal = tidak ter-deploy. |
| Vendor lock-in hosting (Netlify) | Rendah. Bisa pindah. | Sedang | Konfigurasi CMS pakai format standar (config.yml). Repo bisa di-deploy ke mana saja. |
| Limit GitHub API untuk commit CMS | Rendah. Portofolio update jarang. | Rendah | Jangan update terlalu sering dalam waktu singkat. |
