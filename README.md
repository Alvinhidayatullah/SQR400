# SQR400 - Enterprise Financial Node Gateway (v5.8)

SQR400 adalah aplikasi portal terdesentralisasi berskala *enterprise* berbasis Next.js. Aplikasi ini dirancang untuk memproses, memvisualisasikan, dan mensimulasikan pencetakan data transaksi keuangan standar **SWIFT MT103** untuk berbagai institusi perbankan dengan keamanan tingkat tinggi.

Aplikasi ini menggunakan desain antarmuka *premium* dengan *glassmorphism*, ikon elegan, dan animasi halus, yang mencerminkan sistem perbankan internal kelas atas.

## 🚀 Fitur Premium

- **Autentikasi Aman:** Sistem *login* menggunakan JWT (NextAuth.js) dengan peran pengguna (*User* & *Admin*).
- **Admin Console:** Dasbor administratif untuk memantau sesi aktif, kelola akun pengguna (tambah, hapus), dan memantau riwayat log aktivitas transaksi dalam buku besar (*Ledger*).
- **Public Document Gateway (QR Code):** Kemampuan untuk menghasilkan cetakan dokumen yang dilampiri *QR Code*. Ketika dipindai, ia akan membuka halaman dokumen *online* (*Public View*) yang akan otomatis terhapus dengan sendirinya (*expired*) setelah **30 Hari**.
- **Enterprise UI/UX:** Animasi tingkat lanjut menggunakan **Framer Motion** dan **GSAP**, dipadukan dengan desain *Tailwind CSS* premium, ikon dari **Lucide React**, dan struktur antarmuka modern.
- **Dukungan Bank Multinasional:** Modul transaksi untuk HSBC, BNI, Deutsche Bank (V2, V3), Mandiri, BCA, CitiBank, DBS, Standard Chartered, CIS, dan POF.

## 🛠️ Teknologi Utama

- **Framework**: [Next.js v14.2.5](https://nextjs.org/) (App Router)
- **Database**: PostgreSQL (Neon Database)
- **Authentication**: NextAuth.js (v4)
- **Styling**: Tailwind CSS, SCSS, Framer Motion, GSAP, Lucide React
- **QR Code & Barcode**: react-qr-code

## ⚙️ Persiapan & Menjalankan Aplikasi

Aplikasi ini menggunakan **PostgreSQL** (melalui platform cloud Neon DB) sebagai basis datanya.

1. **Instalasi Dependensi**
   Pastikan Anda telah menginstal Node.js di sistem Anda, kemudian jalankan:
   ```bash
   npm install
   ```

2. **Konfigurasi Database (PostgreSQL)**
   Salin atau buat file `.env` di *root* proyek. Isi dengan koneksi database Neon Anda (serta secret JWT):
   ```env
   DATABASE_URL=postgresql://<user>:<password>@<host>/<dbname>?sslmode=require&channel_binding=require
   NEXTAUTH_SECRET=rahasia-jwt-super-aman
   ```

3. **Inisialisasi & Migrasi Database**
   Jalankan skrip migrasi untuk secara otomatis membangun struktur tabel dan menyiapkan pengguna admin bawaan:
   ```bash
   npm run migrate
   ```

4. **Menjalankan Server Lokal**
   Untuk memulai server dalam mode pengembangan (*development*):
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) pada peramban Anda. Anda dapat login menggunakan kredensial yang dibuat selama inisiasi database.

5. **Kompilasi Produksi**
   Untuk membangun aplikasi pada *server* produksi:
   ```bash
   npm run build
   npm run start
   ```

## 📜 Lisensi & Penggunaan

Proyek ini dibuat untuk keperluan simulasi transaksi SWIFT MT103 dan pengembangan sistem informasi finansial berskala *enterprise*. Hanya untuk keperluan pengujian dan demonstrasi sistem.
