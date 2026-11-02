# Sitemap dan Alur Pengguna: Portofolio Dewa Bintang Nugroho

Dokumen ini menjelaskan struktur halaman dan alur pengguna untuk pengunjung maupun pemilik. Status: perancangan.

---

## 1. Sitemap

```mermaid
flowchart TB
    Root["Portofolio"] --> Home["Beranda (/)"]
    Root --> NotFound["404 (/tidak-ditemukan)"]
    Root --> Admin["Admin (/admin/)"]

    Home --> Sections["Satu halaman, scroll vertical"]
    Sections --> S1["Hero"]
    Sections --> S2["Proyek (dengan demo POS)"]
    Sections --> S3["Keahlian"]
    Sections --> S4["Pendidikan"]
    Sections --> S5["Pengalaman"]
    Sections --> S6["Sertifikasi (modal gambar)"]
    Sections --> S7["Kontak"]

    Admin --> AdminLogin["Login (Netlify Identity)"]
    AdminLogin --> AdminDash["Dashboard koleksi"]
    AdminDash --> C1["Profil"]
    AdminDash --> C2["Proyek"]
    AdminDash --> C3["Keahlian"]
    AdminDash --> C4["Pengalaman"]
    AdminDash --> C5["Pendidikan"]
    AdminDash --> C6["Sertifikasi"]
```

### Daftar halaman

| URL | Halaman | Untuk siapa | Status |
|-----|---------|-------------|--------|
| `/` | Beranda (satu halaman, 7 section) | Pengunjung | Sudah ada, perlu perbaikan |
| `/admin/` | Admin CMS | Pemilik | Belum ada |
| `/*` (selain di atas) | 404 | Pengunjung | Belum ada |

Catatan: situs tetap satu halaman (single page) tanpa routing client-side. Navigasi pakai anchor link (`#projects`, `#skills`, dst.). Halaman admin adalah single-page app terpisah (Sveltia CMS) yang tidak ikut masuk bundle publik.

## 2. Alur Pengunjung

### 2.1 Flow: Recruiter menilai kandidat

```mermaid
flowchart TD
    Start["Recruiter buka situs"] --> Load["Halaman termuat"]
    Load --> Scan["Scan Hero: nama, peran, status ketersediaan"]
    Scan --> Q1{"Tertarik?"}
    Q1 -->|Ya| ScrollProj["Scroll ke Proyek"]
    Q1 -->|Tidak| Leave["Tutup tab"]
    ScrollProj --> ScanProj["Baca 3 proyek: context, tech, results"]
    ScanProj --> Q2{"Cocok dengan kebutuhan?"}
    Q2 -->|Ya| ScrollSkills["Scroll ke Keahlian"]
    Q2 -->|Tidak| Leave
    ScrollSkills --> ScanSkills["Verifikasi keahlian dengan proyek"]
    ScanSkills --> FindContact["Cari Kontak"]
    FindContact --> GetCV["Unduh CV / email"]
    GetContact --> Done["Selesai, simpan kandidat"]
```

Waktu ideal: 30-60 detik. Yang kritis: Hero harus langsung memberi tahu siapa dan apa keahliannya, tombol CV harus terlihat, kontak mudah ditemukan.

### 2.2 Flow: Klien mencari developer

```mermaid
flowchart TD
    Start["Klien buka situs (mungkin dari HP)"] --> Load["Halaman termuat"]
    Load --> Scan["Baca Hero"]
    Scan --> ScrollProj["Scroll ke Proyek"]
    ScrollProj --> SeePOS["Lihat proyek POS"]
    SeePOS --> TryDemo{"Coba demo interaktif?"}
    TryDemo -->|Ya| PlayDemo["Interaksi: tambah menu, bayar QRIS simulasi"]
    TryDemo -->|Tidak| SkipDemo["Lewati demo"]
    PlayDemo --> Impressed["Tertarik: ini relevan dengan kebutuhan"]
    SkipDemo --> Impressed
    Impressed --> Contact["Buka Kontak"]
    Contact --> Choose{"Email atau form?"}
    Choose -->|Email| Mailto["Buka aplikasi email"]
    Choose -->|Form| FillForm["Isi form kontak"]
    FillForm --> Submit["Kirim pesan"]
    Submit --> Done["Menunggu balasan"]
    Mailto --> Done
```

Waktu ideal: 1-2 menit. Yang kritis: demo POS harus berfungsi di mobile, tombol kontak harus jelas, form (jika ada) harus simpel.

### 2.3 Flow: Dosen/kolega akademik

```mermaid
flowchart TD
    Start["Dosen buka situs"] --> Load["Halaman termuat"]
    Load --> Scan["Baca Hero"]
    Scan --> ScrollEdu["Scroll ke Pendidikan"]
    ScrollEdu --> ReadEdu["Baca: S1 Informatika, IPK, cum laude"]
    ReadEdu --> ScrollProj["Scroll ke Proyek"]
    ScrollProj --> FindNLP["Cari proyek NLP (Rasa, Dialogflow)"]
    FindNLP --> ReadDetail["Baca context, role, results, confusion matrix"]
    ReadDetail --> ScrollCert["Scroll ke Sertifikasi"]
    ScrollCert --> ViewCert["Klik sertifikat, lihat gambar modal"]
    ViewCert --> Assess["Penilaian: cukup untuk konteks akademik"]
    Assess --> Done["Selesai"]
```

Waktu ideal: 2-3 menit. Yang kritis: detail pendidikan dan proyek akademik harus lengkap, sertifikat bisa dilihat dengan jelas (modal bug harus diperbaiki).

## 3. Alur Admin (Pemilik)

### 3.1 Flow: Menambah proyek baru

```mermaid
flowchart TD
    Start["Pemilik buka /admin/"] --> Login["Login Netlify Identity"]
    Login --> Dash["Lihat dashboard koleksi"]
    Dash --> ClickProj["Klik koleksi Proyek"]
    ClickProj --> SeeList["Lihat daftar 3 proyek"]
    SeeList --> ClickAdd["Klik Tambah baru"]
    ClickAdd --> FillForm["Isi form: id, title, context, role, tech, results, repo"]
    FillForm --> NeedImg{"Perlu screenshot?"}
    NeedImg -->|Ya| Upload["Upload gambar via media library"]
    NeedImg -->|Tidak| SkipImg["Lewati"]
    Upload --> Preview["Lihat pratinjau di panel kanan"]
    SkipImg --> Preview
    Preview --> Publish["Klik Terbitkan"]
    Publish --> Commit["CMS commit ke repo"]
    Commit --> Build["CI: validate + build + deploy"]
    Build --> Live["Proyek tampil di situs (~2 menit)"]
```

### 3.2 Flow: Mengubah profil

```mermaid
flowchart TD
    Start["Pemilik buka /admin/"] --> Login["Login"]
    Login --> Dash["Dashboard"]
    Dash --> ClickProfile["Klik koleksi Profil"]
    ClickProfile --> EditForm["Form profil: nama, peran, status, email, link"]
    EditForm --> Change["Ubah status: 'Sedang sibuk, tidak menerima proyek baru'"]
    Change --> Publish["Klik Simpan"]
    Publish --> Commit["CMS commit"]
    Commit --> Build["CI build"]
    Build --> Live["Status baru tampil di Hero"]
```

### 3.3 Flow: Menghapus sertifikat

```mermaid
flowchart TD
    Start["Pemilik buka /admin/"] --> Login["Login"]
    Login --> Dash["Dashboard"]
    Dash --> ClickCert["Klik koleksi Sertifikasi"]
    ClickCert --> SeeList["Lihat daftar 2 sertifikat"]
    SeeList --> ClickDelete["Klik Hapus pada sertifikat yang mau dihapus"]
    ClickDelete --> Confirm["Dialog: Yakin ingin menghapus?"]
    Confirm --> Q1{"Konfirmasi?"}
    Q1 -->|Ya| Delete["CMS commit penghapusan"]
    Q1 -->|Tidak| Cancel["Batal, kembali ke daftar"]
    Delete --> Build["CI build"]
    Build --> Live["Sertifikat hilang dari situs"]
```

### 3.4 Flow: Login pertama kali

```mermaid
flowchart TD
    Start["Pemilik buka /admin/"] --> SeeLogin["Lihat halaman login Sveltia CMS"]
    SeeLogin --> HasAccount{"Sudah punya akun Netlify Identity?"}
    HasAccount -->|Ya| Enter["Masukkan email + password"]
    HasAccount -->|Tidak| Invite["Buka Netlify dashboard, kirim undangan email"]
    Invite --> CheckEmail["Cek email, klik undangan, set password"]
    CheckEmail --> Enter
    Enter --> Verify["Netlify Identity verifikasi"]
    Verify --> Q1{"Berhasil?"}
    Q1 -->|Ya| Dash["Masuk dashboard"]
    Q1 -->|Tidak| Retry["Coba lagi atau reset password"]
    Retry --> Enter
```

## 4. Titik Masuk dan Keluar

### Pengunjung masuk dari

| Sumber | Harapan | Section yang pertama dilihat |
|--------|---------|------------------------------|
| Google search (nama + "portofolio") | Lihat profil dan proyek | Hero |
| LinkedIn / GitHub bio link | Kenali siapa dan apa keahliannya | Hero |
| Social media share (OG image) | Klik link, lihat situs | Hero |
| QR code di CV cetak | Lihat portofolio digital | Hero |
| Langsung ketik URL | Sama seperti di atas | Hero |

### Pengunjung keluar ke

| Aksi | Tujuan |
|------|--------|
| Klik "Unduh CV" | File PDF diunduh |
| Klik "Email saya" | Aplikasi email terbuka |
| Klik GitHub | Tab baru ke github.com/dewanugroho |
| Klik LinkedIn (jika sudah diisi) | Tab baru ke profil LinkedIn |
| Kirim form kontak (jika ada) | Konfirmasi pengiriman |
| Tutup tab | Selesai |

### Pemilik masuk ke

| Sumber | Aksi |
|--------|------|
| `/admin/` langsung | Login CMS |
| Notifikasi Netlify (build selesai/gagal) | Cek hasil deploy |
| Notifikasi email (pesan form kontak) | Baca pesan di dashboard Netlify |
