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

## Pengujian

    npm test                # menjalankan test front-end
    npm run test:coverage   # test + coverage (coverage/lcov.info untuk SonarQube)

## Deployment online

- Front-end di Vercel. File `vercel.json` meneruskan semua permintaan `/api/*` ke back-end di `https://ifs24005-pabwe2026-proyek1-backend.vercel.app`, sehingga browser hanya melihat satu domain dan cookie login berfungsi.
- Back-end di Vercel dengan environment variable `AUTH_SECRET`, `SEED_USER_EMAIL`, dan `SEED_USER_PASSWORD`.
- Catatan: database SQLite di Vercel disimpan di folder sementara, jadi data demo bersifat sementara dan bisa kembali ke data awal.

Akun uji: `admin@skincare.test` dengan kata sandi `Admin123!`.

## CI/CD

Folder `frontend/dist/` sengaja ikut di-commit. Setiap `git push` memicu pipeline Jenkins: install, test + coverage, Trivy, SonarQube, Quality Gate, package, deploy.

## Struktur proyek

    frontend/   index.html, vite.config.js, src/, tests/, dist/ (hasil build)
    docs/       DOKUMEN_PROYEK_1.md
    package.json, vitest.config.js, vercel.json, Jenkinsfile, sonar-project.properties