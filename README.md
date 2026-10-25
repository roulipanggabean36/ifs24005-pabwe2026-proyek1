# Skincare Routine & Inventory Tracker (Front-end)

Aplikasi web untuk mencatat produk perawatan kulit, melacak tanggal kedaluwarsa, dan menulis jurnal kondisi kulit harian. Proyek 1 mata kuliah **Pengembangan Aplikasi Berbasis Web (PABWE)**.

Proyek ini dibagi menjadi dua repository:

| Bagian | Teknologi | Repository |
|---|---|---|
| Front-end (repo ini) | Vue.js 3 + Vite, Scoped CSS murni | `ifs24005-pabwe2026-proyek1` |
| Back-end | Express.js + SQLite (REST API) | `ifs24005-pabwe2026-proyek1-backend` |

Tema: Coquette / Soft Girl (pastel, `border-radius: 15px`, Playfair Display + Poppins). Kontras warna memenuhi WCAG 2.0 AA (tabel rasio ada di `docs/DOKUMEN_PROYEK_1.md`). Pengujian: Vitest + coverage, Jenkins, SonarQube.

## Fitur

- CRUD produk skincare (nama, merek, kategori, tanggal dibuka, tanggal kedaluwarsa, stok, harga, catatan)
- Badge kedaluwarsa otomatis: Masih aman, X hari lagi, Sudah kedaluwarsa
- Pencarian, saring kategori, dan saring produk yang segera kedaluwarsa
- Jurnal kondisi kulit harian
- Ringkasan: total produk, segera kedaluwarsa, sudah kedaluwarsa, dan jumlah catatan jurnal
- Login dengan email dan kata sandi (cookie httpOnly dibuat oleh back-end)

## Prasyarat

- Node.js 22.13 atau lebih baru
- Git

## Menjalankan di localhost

Back-end dijalankan dari repository terpisah:

    git clone https://github.com/roulipanggabean36/ifs24005-pabwe2026-proyek1-backend.git
    cd ifs24005-pabwe2026-proyek1-backend
    npm install
    npm start

API berjalan di http://localhost:3000. Lalu, di terminal lain, jalankan front-end:

    git clone https://github.com/roulipanggabean36/ifs24005-pabwe2026-proyek1.git
    cd ifs24005-pabwe2026-proyek1
    npm install
    npm run dev

Buka http://localhost:5173. Permintaan `/api` diteruskan otomatis ke http://localhost:3000 oleh Vite.

Akun uji: `admin@skincare.test` dengan kata sandi `Admin123!`.

## Pengujian

    npm test                # menjalankan test front-end
    npm run test:coverage   # test + coverage (coverage/lcov.info untuk SonarQube)

## CI/CD

Setiap `git push` ke GitHub memicu pipeline Jenkins (`Jenkinsfile` di root) dengan tahap berikut:

1. Checkout
2. Install Dependencies
3. Test (Vitest + coverage)
4. Trivy Security Scan
5. SonarQube Analysis
6. Quality Gate
7. Package Application (`latest-app.zip`)
8. Publish Application
9. Deploy Application (permintaan redeploy ke Delcom dan pemantauan statusnya)

Konfigurasi SonarQube ada di `sonar-project.properties`.

## Deployment

- Front-end dideploy lewat pipeline Jenkins ke Delcom.
- Catatan: database SQLite pada back-end di Vercel disimpan di folder sementara, jadi data demo bersifat sementara dan bisa kembali ke data awal.

## Struktur proyek

    src/        kode Vue: components/, views/, styles/, utils/, api.js, auth.js,
                collection.js, router.js, main.js, App.vue
    tests/      test Vitest (api-client, client-auth, format, format-edge)
    public/     aset statis (robots.txt)
    docs/       DOKUMEN_PROYEK_1.md
    index.html, vite.config.js, vitest.config.js, vercel.json,
    Jenkinsfile, sonar-project.properties, package.json