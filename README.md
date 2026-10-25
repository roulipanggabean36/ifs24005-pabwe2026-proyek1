# 🌸 Skincare Routine & Inventory Tracker (Front-end)

Aplikasi web untuk **mencatat produk perawatan kulit**, **melacak tanggal kedaluwarsa**, dan **menulis jurnal kondisi kulit harian** dalam satu tempat yang rapi. Dibuat sebagai **Proyek 1** mata kuliah **Pengembangan Aplikasi Berbasis Web (PABWE)**.

Repository ini berisi bagian **front-end**. Back-end (REST API) ada di repository terpisah.

| Bagian | Teknologi | Repository |
|---|---|---|
| Front-end (repo ini) | Vue.js 3 (Composition API), Vite, Vue Router, Scoped CSS murni | `ifs24005-pabwe2026-proyek1` |
| Back-end | Express.js + SQLite (REST API) | `ifs24005-pabwe2026-proyek1-backend` |

---

## ✨ Fitur

- **Manajemen produk**: tambah, lihat, ubah, dan hapus produk (nama, merek, kategori, tanggal dibuka, tanggal kedaluwarsa, stok, harga, catatan).
- **Badge kedaluwarsa otomatis**:
  - `Masih aman` jika sisa lebih dari 30 hari
  - `X hari lagi` jika sisa 1 sampai 30 hari
  - `Kedaluwarsa hari ini` jika sisa 0 hari
  - `Sudah kedaluwarsa` jika tanggal sudah lewat
- **Pencarian dan filter**: cari berdasarkan nama atau merek, saring per kategori, dan tampilkan hanya produk yang segera kedaluwarsa.
- **Jurnal kondisi kulit**: catat produk yang dipakai, waktu pemakaian (pagi/malam), kondisi kulit, nilai 1 sampai 5, dan catatan.
- **Ringkasan**: total produk, produk yang segera kedaluwarsa, produk yang sudah kedaluwarsa, dan jumlah catatan jurnal.
- **Login** dengan email dan kata sandi. Sesi disimpan di cookie `httpOnly` yang dibuat oleh back-end, dan halaman yang dilindungi otomatis mengarahkan pengguna ke halaman login.

## 🎨 Desain dan aksesibilitas

- Tema **Coquette / Soft Girl**: palet pastel (soft pink, peach, lilac), `border-radius: 15px`, font **Playfair Display** dan **Poppins**.
- Kontras warna memenuhi **WCAG 2.0 AA** (tabel rasio ada di `docs/DOKUMEN_PROYEK_1.md`).
- Judul halaman (`document.title`) berubah mengikuti halaman yang dibuka.
- Setiap pindah halaman, fokus dipindahkan ke konten utama agar pembaca layar tahu halaman sudah berganti.
- Tujuan redirect setelah login hanya menerima path internal, untuk mencegah open redirect.

## 🗺️ Halaman

| Path | Halaman | Perlu login |
|---|---|---|
| `/` | Beranda | tidak |
| `/auth/login` | Masuk | tidak |
| `/produk` | Daftar dan pengelolaan produk | ya |
| `/jurnal` | Jurnal kondisi kulit | ya |
| `/ringkasan` | Ringkasan | ya |
| `/profil` | Profil | ya |
| path lain | Halaman tidak ditemukan | tidak |

## 🧰 Teknologi

- **Vue.js 3** (Composition API) dan **Vue Router 4**
- **Vite 7** sebagai build tool dan dev server
- **Scoped CSS** murni, tanpa framework CSS
- **Vitest** dengan coverage **v8** untuk pengujian
- **Jenkins**, **Trivy**, dan **SonarQube** untuk CI/CD

## ✅ Prasyarat

- Node.js **22.13** atau lebih baru
- Git

## 🚀 Menjalankan di localhost

Back-end dijalankan dari repository terpisah:

```bash
git clone https://github.com/roulipanggabean36/ifs24005-pabwe2026-proyek1-backend.git
cd ifs24005-pabwe2026-proyek1-backend
npm install
npm start
```

API berjalan di http://localhost:3000. Lalu, di terminal lain, jalankan front-end:

```bash
git clone https://github.com/roulipanggabean36/ifs24005-pabwe2026-proyek1.git
cd ifs24005-pabwe2026-proyek1
npm install
npm run dev
```

Buka http://localhost:5173. Permintaan `/api` diteruskan otomatis oleh Vite ke http://localhost:3000.

**Akun uji:** `admin@skincare.test` dengan kata sandi `Admin123!`

### Perintah yang tersedia

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Menjalankan dev server Vite di port 5173 |
| `npm run build` | Membuat build produksi ke folder `dist/` |
| `npm run preview` | Menjalankan hasil build secara lokal |
| `npm test` | Menjalankan seluruh test sekali |
| `npm run test:coverage` | Menjalankan test dan membuat laporan coverage |

### Konfigurasi

| Variabel | Fungsi | Bawaan |
|---|---|---|
| `VITE_API_BASE_URL` | Alamat dasar API yang dipanggil front-end | `/api` |

## 🔌 Endpoint API yang dipakai

Front-end memanggil endpoint berikut (didefinisikan di `src/api.js`). Semua respons berbentuk `{ success, data }`, dan kegagalan menampilkan pesan dari back-end.

| Kelompok | Endpoint |
|---|---|
| Autentikasi | `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` |
| Produk | `GET /products`, `POST /products`, `PUT /products/:id`, `DELETE /products/:id` |
| Jurnal | `GET /routines`, `POST /routines`, `PUT /routines/:id`, `DELETE /routines/:id` |

Jika API membalas `401` pada endpoint data, sesi dianggap habis dan pengguna dikembalikan ke halaman login.

## 🧪 Pengujian

```bash
npm test                # menjalankan test front-end
npm run test:coverage   # test + coverage (coverage/lcov.info untuk SonarQube)
```

File test ada di folder `tests/`:

| File | Yang diuji |
|---|---|
| `api-client.test.js` | Klien API (`src/api.js`) |
| `client-auth.test.js` | State login, route guard, dan alur sesi |
| `format.test.js` | Fungsi format tanggal, rupiah, dan status kedaluwarsa |
| `format-edge.test.js` | Kasus batas pada fungsi format |

## 🔄 CI/CD

Setiap `git push` ke GitHub memicu pipeline Jenkins (`Jenkinsfile` di root) dengan tahap berikut:

1. **Checkout**
2. **Install Dependencies**
3. **Test** (Vitest + coverage)
4. **Trivy Security Scan**
5. **SonarQube Analysis**
6. **Quality Gate**
7. **Package Application** (`latest-app.zip`)
8. **Publish Application**
9. **Deploy Application** (permintaan redeploy ke Delcom dan pemantauan statusnya)

Konfigurasi SonarQube ada di `sonar-project.properties`. Laporan coverage dibaca dari `coverage/lcov.info`.

## ☁️ Deployment

- Front-end dideploy lewat pipeline Jenkins ke Delcom.
- Catatan: database SQLite pada back-end di Vercel disimpan di folder sementara, jadi data demo bersifat sementara dan bisa kembali ke data awal.

## 📁 Struktur proyek

```text
.
├── src/
│   ├── components/   komponen UI (AppHeader, ProductCard, ProductForm, ProductList,
│   │                 RoutineForm, RoutineJournal, SummaryCards, ExpiryBadge,
│   │                 ModalDialog, NoticeBar, PageHero)
│   ├── views/        halaman (Home, Login, Products, Journal, Summary, Profile, NotFound)
│   ├── styles/       global.css
│   ├── utils/        format.js (format tanggal, rupiah, status kedaluwarsa)
│   ├── api.js        klien REST API
│   ├── auth.js       state login bersama
│   ├── collection.js data produk dan jurnal yang dipakai bersama
│   ├── router.js     rute dan route guard
│   ├── main.js
│   └── App.vue
├── tests/            test Vitest
├── public/           aset statis (robots.txt)
├── docs/             DOKUMEN_PROYEK_1.md
├── index.html
├── vite.config.js
├── vitest.config.js
├── vercel.json       aturan rewrite /api/* ke back-end
├── Jenkinsfile
├── sonar-project.properties
└── package.json
```

## 📄 Dokumentasi lain

Latar belakang, skema database, endpoint API lengkap, desain UI/UX, tabel kontras warna, dan penjelasan pengujian ada di [`docs/DOKUMEN_PROYEK_1.md`](docs/DOKUMEN_PROYEK_1.md).