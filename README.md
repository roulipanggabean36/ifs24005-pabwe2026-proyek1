# 🎀 Skincare Routine & Inventory Tracker

Aplikasi web untuk mencatat produk perawatan kulit, melacak tanggal kedaluwarsa, dan menulis jurnal kondisi kulit harian. Proyek 1 mata kuliah **Pengembangan Aplikasi Berbasis Web (PABWE)**.

| | |
|---|---|
| Back-end | Express.js + SQLite (REST API), folder `backend/` |
| Front-end | Vue.js 3 + Vite, Scoped CSS murni, folder `frontend/` |
| Tema | Coquette / Soft Girl (pastel, `border-radius: 15px`, Playfair Display + Poppins) |
| Aksesibilitas | Kontras warna memenuhi WCAG 2.0 AA (tabel rasio ada di `docs/DOKUMEN_PROYEK_1.md`) |
| Pengujian | Vitest + coverage, Jenkins, SonarQube |

## Fitur

- CRUD produk skincare (nama, merek, kategori, tanggal dibuka, tanggal kedaluwarsa, stok, harga, catatan)
- Badge kedaluwarsa otomatis: **Masih aman**, **X hari lagi**, **Sudah kedaluwarsa**
- Pencarian, saring kategori, dan saring produk yang segera kedaluwarsa
- Jurnal kondisi kulit harian (produk yang dipakai, pagi/malam, kondisi, nilai 1-5, catatan)
- Menghapus produk ikut menghapus jurnalnya (relasi `ON DELETE CASCADE`)

## Prasyarat

- [Node.js](https://nodejs.org) **versi 22.13 atau lebih baru** (LTS terbaru direkomendasikan). Dicek dengan `node -v`.
- [Git](https://git-scm.com)

> SQLite memakai modul bawaan runtime (`node:sqlite`, atau `bun:sqlite` di Bun), jadi tidak ada library native yang perlu dikompilasi.

## Menjalankan di localhost (dari `git clone`)

Ganti `<username-github>` dengan username GitHub-mu.

```bash
git clone https://github.com/<username-github>/ifs24005-pabwe2026-proyek1.git
cd ifs24005-pabwe2026-proyek1
npm install
```

### Cara 1: satu terminal (disarankan untuk demo video)

```bash
npm run build
npm start
```

Buka **http://localhost:3000**. Express menyajikan API sekaligus tampilan Vue. Database `data/skincare.db` dibuat otomatis dan langsung berisi dummy data.

### Cara 2: mode pengembangan (dua terminal)

```bash
# Terminal 1: API di http://localhost:3000
npm run dev:api

# Terminal 2: Vue di http://localhost:5173 (request /api diteruskan ke Express)
npm run dev:web
```

Buka **http://localhost:5173**.

### Konfigurasi opsional

Semua variabel punya nilai default, jadi file `.env` tidak wajib. Untuk mengubahnya, salin contohnya di folder `backend`:

```bash
# Windows PowerShell
Copy-Item backend/.env.example backend/.env
# macOS / Linux
cp backend/.env.example backend/.env
```

| Variabel | Default | Fungsi |
|---|---|---|
| `PORT` | `3000` | Port server |
| `DB_PATH` | `backend/data/skincare.db` | Lokasi file SQLite |
| `SEED` | `true` | Isi dummy data saat database kosong |

Untuk mengulang dari data awal, hentikan server lalu hapus folder `backend/data/`.

## Pengujian

```bash
npm test                # menjalankan semua test (backend dan frontend), dari folder root
npm run test:coverage   # test + laporan coverage (coverage/lcov.info untuk SonarQube)
```

## Struktur proyek

Dua folder terpisah dalam satu repository (npm workspaces):

```
.
├── backend/                      # REST API
│   ├── server.js                 # entry point Express
│   ├── package.json
│   ├── .env.example
│   ├── src/
│   │   ├── app.js                # susunan aplikasi Express
│   │   ├── db/                   # database.js, schema.sql, seed.sql
│   │   ├── controllers/          # logika endpoint
│   │   ├── routes/               # routing REST API
│   │   ├── middleware/           # penanganan error
│   │   └── utils/                # validasi dan HttpError
│   └── tests/                    # Vitest untuk API dan database
├── frontend/                     # antarmuka Vue
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── src/
│   │   ├── App.vue
│   │   ├── api.js                # klien REST API
│   │   ├── components/           # komponen dengan Scoped CSS
│   │   ├── styles/global.css     # design token pastel (variabel CSS)
│   │   └── utils/format.js
│   └── tests/                    # Vitest untuk klien API dan util
├── docs/DOKUMEN_PROYEK_1.md      # dokumen proyek
├── package.json                  # workspaces + skrip dari root
├── vitest.config.js              # menjalankan tes backend + frontend
├── Jenkinsfile                   # pipeline CI/CD
└── sonar-project.properties      # konfigurasi SonarQube
```

Semua perintah `npm` dijalankan dari folder **root** proyek. `npm install` di root memasang dependency backend dan frontend sekaligus.

## Endpoint REST API

Base URL: `/api`. Respons sukses: `{ "success": true, "data": ... }`. Respons gagal: `{ "success": false, "message": "...", "errors": [...] }`.

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/api/health` | Cek status server |
| GET | `/api/products` | Daftar produk (`?category=`, `?search=`, `?expiring=30`) |
| GET | `/api/products/:id` | Detail produk |
| POST | `/api/products` | Tambah produk |
| PUT | `/api/products/:id` | Ubah produk |
| DELETE | `/api/products/:id` | Hapus produk beserta jurnalnya |
| GET | `/api/products/:id/routines` | Jurnal milik satu produk |
| GET | `/api/routines` | Daftar jurnal (`?date=`, `?time_of_day=`, `?product_id=`) |
| GET | `/api/routines/:id` | Detail catatan jurnal |
| POST | `/api/routines` | Tambah catatan jurnal |
| PUT | `/api/routines/:id` | Ubah catatan jurnal |
| DELETE | `/api/routines/:id` | Hapus catatan jurnal |

Contoh uji di PowerShell (server harus sedang berjalan):

```powershell
(Invoke-RestMethod http://localhost:3000/api/products).data | Format-Table id, name, brand, expiry_date, days_left
```

## CI/CD dan deployment (Delcom, Jenkins, SonarQube)

Mengikuti panduan "Submit CI/CD - Jenkins & SonarQube":

1. Buat repository GitHub dengan nama sesuai kriteria submission, lalu push proyek ini.
2. Sebelum push, jalankan `npm run build` dan ikut commit folder `frontend/dist/` (agar halaman Vue langsung tersedia di server).
3. Tambahkan webhook GitHub, website dan `.env` di Delcom, credentials dan item Pipeline di Jenkins, serta proyek dan webhook di SonarQube.
4. Pastikan `projectKey` di `sonar-project.properties` sama dengan nama item Jenkins dan repository.
5. Setiap `git push` memicu pipeline: install, test + coverage, Trivy, SonarQube, Quality Gate, package, deploy.

## Checklist rekam video demo

1. `git clone`, `cd`, `npm install`
2. `npm run build` lalu `npm start`
3. Buka `http://localhost:3000`, tunjukkan ringkasan dan badge kedaluwarsa
4. Tambah, ubah, dan hapus produk
5. Pindah ke tab Jurnal Kulit, tambah catatan
6. Tunjukkan navigasi keyboard (Tab) dan tampilan di layar kecil
7. Tunjukkan `npm run test:coverage`
8. Tunjukkan URL deployment online dan pipeline Jenkins/SonarQube yang hijau

## Login (email dan kata sandi)

Aplikasi sekarang memakai login. Halaman publik: `/` dan `/auth/login`. Halaman yang butuh login: `/produk`, `/jurnal`, `/ringkasan`, `/profil`.

Akun uji dibuat otomatis saat tabel `users` masih kosong (hanya jika `SEED` tidak `false`):

| Email | Kata sandi |
|---|---|
| `admin@skincare.test` | `Admin123!` |

Endpoint: `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`. Endpoint `/api/products` dan `/api/routines` membalas 401 jika belum login. Variabel `.env` tambahan: `AUTH_SECRET`, `SEED_USER_EMAIL`, `SEED_USER_PASSWORD`, `COOKIE_SECURE` (lihat `backend/.env.example`).

**Vercel:** isi `AUTH_SECRET` (string acak panjang) di Project Settings, Environment Variables, lalu redeploy. Tanpa itu, login bisa gagal karena tiap instance fungsi membuat kunci acak sendiri.
