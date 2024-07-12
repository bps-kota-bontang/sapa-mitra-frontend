# SAPAMITRA

SAPAMITRA adalah aplikasi yang dirancang untuk membantu dalam manajemen dokumen Surat Perjanjian Kerja (SPK), Berita Acara Serah Terima (BAST) serta pemantauan honorarium. Aplikasi ini menyediakan solusi yang efisien dan efektif untuk pembuatan dokumen dan identifikasi mitra yang melampaui batas penerimaan honor.

## Fitur

### 1. Generate dokumen Surat Perjanjian Kerja para Mitra

> Aplikasi ini memungkinkan pengguna untuk membuat dan mengelola dokumen Surat Perjanjian Kerja dengan mudah dan cepat. Pengguna hanya perlu memasukkan data yang diperlukan, dan dokumen akan dihasilkan secara otomatis dalam format yang sudah ditentukan.

### 2. Generate dokumen Berita Acara Serah Terima

> Dengan fitur ini, pengguna dapat membuat dokumen Berita Acara Serah Terima dengan cepat. Fitur ini membantu dalam memastikan semua proses serah terima dicatat dengan baik dan dapat diakses kapan saja.

### 3. Mengidentifikasi mitra yang melebihi batas terima honor dalam satu periode

> Aplikasi ini dilengkapi dengan sistem monitoring yang dapat mengidentifikasi mitra yang menerima honorarium melebihi batas yang ditentukan dalam satu periode (satu bulan).

## Teknologi yang Digunakan

1. TypeScript: Bahasa pemrograman yang digunakan untuk mengembangkan fitur-fitur aplikasi.
2. Bun: JavaScript runtime yang digunakan untuk menjalankan server-side aplikasi ini.
3. Hono.js: Framework web yang digunakan untuk mengelola server-side operasi.
4. Vue.js: Framework JavaScript yang digunakan untuk membangun antarmuka pengguna.
5. MongoDB: Database yang digunakan untuk menyimpan data aplikasi.
6. Puppeteer: Library yang digunakan untuk otomatisasi proses pembuatan dokumen.
7. Docker: Platform untuk mengemas aplikasi ke dalam kontainer sehingga mudah untuk dijalankan di berbagai lingkungan.

## Cara Instalasi

1. _Clone repository_ ke komputer Anda:

```sh
git clone http://git.bps.go.id/sapa-mitra/sapa-mitra-frontend.git
```

2. Masuk ke direktori proyek:

```sh
cd sapa-mitra-frontend
```

3. _Install dependencies_:

```sh
bun install
```

4. Konfigurasi .env secara umum:

```sh
VITE_APP_TITLE=SAPAMITRA                    #Nama Aplikasi
VITE_API_BASE_URL=http://localhost:4000     #Alamat API lingkungan local
```

5. Konfigurasi .env berdasarkan lingkungan

- Untuk lingkungan _production_ atur `Alamat API` pada file `.env.production`

```sh
VITE_API_BASE_URL=http://api.website.com     #Alamat API lingkungan production
```

6. Menjalankan di lingkungan _local_:

```sh
bun run dev
```

7. Menyiapkan untuk lingkungan _production_:

```sh
bun run build
```

8. Menjalankan di lingkungan _production_:

```sh
bun run start
```

## Kontribusi

Kami sangat terbuka terhadap kontribusi dari siapa saja. Jika Anda ingin berkontribusi, silakan _fork repository_ ini dan kirimkan _pull request_ dengan perubahan yang Anda buat.

## Lisensi

Aplikasi ini dilisensikan di bawah [MIT License](http://git.bps.go.id/sapa-mitra/sapa-mitra-frontend/blob/main/LICENSE).

## Kontak

Jika Anda memiliki pertanyaan atau masukan, silakan hubungi kami di arif.hakim@bps.go.id.
