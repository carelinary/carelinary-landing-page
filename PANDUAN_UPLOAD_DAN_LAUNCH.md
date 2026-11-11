# Panduan Carelinary: GitHub → Kiro → Google Sheets → Vercel

> **Dokumen arsip.** Untuk revisi terbaru dan langkah integrasi yang sesuai dengan situs yang sudah tayang, baca `PANDUAN_REVISI_DAN_GOOGLE_SHEETS.md`. Jangan mengikuti nomor commit dan instruksi upload massal di bawah ini.

**Status saat paket diserahkan:** website lama sudah online di `www.carelinary.my.id`. Paket ini dibuat dari commit GitHub terbaru yang diperiksa pada 10 November 2026 (`1e4f441`). Revisi ini belum diterbitkan. Formulir baru tetap nonaktif sampai penyimpanan data dan kebijakan privasi siap.

## 1. Kenali berkas yang akan diunggah

Ekstrak ZIP. Buka folder `carelinary-landing-page`. Di dalamnya harus ada `index.html`, `styles.css`, `enhancements.css`, `script.js`, `favicon.png`, `privacy.html`, `vercel.json`, `.env.example`, folder `assets`, `api`, `apps-script`, `test`, dan dokumen panduan. **Unggah isi folder tersebut, bukan ZIP-nya.** Folder `api` harus berada sejajar dengan `index.html`.

Jangan unggah `.git`, `.env`, kata sandi, shared secret, URL Sheet privat yang berisi data pelanggan, atau hasil uji pelanggan.

## 2. Buat draft di GitHub tanpa mengubah website yang sedang tayang

Repository yang ditemukan: [carelinary/carelinary-landing-page](https://github.com/carelinary/carelinary-landing-page). Jika repository inilah yang terhubung dengan Vercel, perubahan pada branch `main` dapat langsung menayangkan versi baru. Karena itu, gunakan **branch revisi** terlebih dahulu.

### Cara paling mudah dengan GitHub Desktop

1. Pasang dan buka [GitHub Desktop](https://desktop.github.com/), lalu masuk dengan akun GitHub yang memiliki akses ke repository Carelinary. Jika sudah terpasang, lanjutkan.
2. Pilih **File → Clone repository**, pilih `carelinary/carelinary-landing-page`, lalu tentukan folder lokal.
3. Di GitHub Desktop pilih **Current branch → New branch**, beri nama `revisi-waiting-list-carelinary`.
4. Dari ZIP yang sudah diekstrak, salin **isi** folder `carelinary-landing-page` ke folder repository lokal tersebut. Pilih ganti berkas lama bila diminta. Jangan menghapus folder `.git` milik repository lokal. Pastikan `index.html` langsung berada pada root repository, bukan di subfolder bersarang.
5. Pastikan GitHub Desktop menunjukkan perubahan kode, gambar, dan video. Periksa tidak ada file `.env` atau data pribadi.
6. Isi ringkasan commit `Revise landing page and waiting list` → klik **Commit to revisi-waiting-list-carelinary** → **Publish branch**.
7. Di GitHub buat **Pull Request** dari branch revisi ke `main`. Biarkan PR terbuka sampai pemeriksaan Kiro dan Vercel selesai. [Panduan GitHub untuk berkas dan folder](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository).

Jika Anda memakai fitur **Add file → Upload files** pada website GitHub, pilih branch revisi dulu, lalu seret **file dan folder hasil ekstraksi**. ZIP tidak boleh menjadi satu-satunya file di repository. GitHub membatasi unggahan browser hingga 25 MiB per file; semua media di paket ini berada di bawah batas itu, tetapi GitHub Desktop lebih mudah untuk mempertahankan struktur folder.

## 3. Review draft di Kiro AI

1. Buka [Kiro](https://kiro.dev/docs/chat/vibe/) → **File → Open Folder** → pilih folder repository lokal yang sama dengan GitHub Desktop.
2. Buka `KIRO_PROMPT_EN.md`, salin seluruh prompt berbahasa Inggris ke chat Kiro. Kiro dapat membaca proyek dari folder yang terbuka; minta ia membaca semua berkas sebelum mengubah kode.
3. Minta Kiro meninjau perubahan dan menjalankan `node --test test/*.test.mjs` serta `node --check script.js` dan `node --check api/interest.mjs`.
4. Jalankan `node dev-server.mjs` di terminal Kiro. Buka alamat preview yang muncul, periksa desktop dan ponsel. Form lokal akan tetap nonaktif tanpa konfigurasi server; ini memang disengaja.
5. Cek lima video berganti otomatis tanpa suara, tombol jeda/putar, judul baru, logo piring, favicon, tiga kartu menu dengan estimasi makro, penjelasan empat kondisi, simulasi harga, form **sebelum FAQ**, dan pop-up privasi.
6. Setelah Kiro memperbaiki masalah yang ditemukan, periksa daftar file yang berubah di GitHub Desktop, commit, lalu **Push origin**. PR akan diperbarui. [Panduan chat Kiro](https://kiro.dev/docs/ide/chat/).

## 4. Siapkan Google Sheet privat

1. Masuk ke Google dengan akun yang akan mengelola lead Carelinary. Buat spreadsheet baru, misalnya `Carelinary Waiting List`.
2. Pastikan aksesnya **Restricted/Private**, hanya untuk petugas yang perlu menghubungi calon pelanggan.
3. Ubah nama tab pertama menjadi persis `WaitingList`.
4. Isi baris 1 dengan 12 header berikut, satu header per kolom, sesuai urutan:

   ```text
   submission_id | submitted_at_utc | name | email | phone | delivery_area_or_address | interested_program | interested_duration | meals_per_day | consent_to_contact | consent_text_version | source
   ```

5. Salin **Spreadsheet ID** dari URL Sheet (teks di antara `/d/` dan `/edit`). Simpan untuk Apps Script, jangan ditaruh dalam kode GitHub.

## 5. Pasang Google Apps Script dan notifikasi email

1. Dari Sheet, pilih **Extensions → Apps Script**.
2. Salin seluruh isi `apps-script/Code.gs` ke editor `Code.gs`. Simpan.
3. Buka **Project Settings → Script Properties**. Tambah tiga properti:
   - `SPREADSHEET_ID`: ID Sheet dari langkah 4.
   - `SHARED_SECRET`: string acak panjang minimal sekitar 32 karakter. Simpan di pengelola kata sandi; **jangan masukkan ke GitHub atau chat Kiro**.
   - `NOTIFICATION_EMAIL`: `carelinaryfoodcatering@gmail.com`.
4. Pilih **Deploy → New deployment → Web app**. Pilih **Execute as: Me** (akun pemilik Sheet). Pilih akses yang mengizinkan fungsi Vercel memanggil endpoint tanpa login Google, biasanya **Anyone**. Endpoint tersebut dapat diakses publik, sehingga kode memeriksa shared secret pada setiap permintaan. Jangan menganggap URL `/exec` sebagai rahasia.
5. Selesaikan izin Google untuk akses Sheet dan pengiriman email. Salin URL Web App yang berakhir `/exec`.
6. Bila kelak mengubah `Code.gs`, buka **Deploy → Manage deployments**, buat versi baru, lalu gunakan deployment terbaru. [Dokumentasi resmi Google Apps Script Web Apps](https://developers.google.com/apps-script/guides/web).

Email notifikasi dikirim dari akun Google yang menjalankan script menuju `carelinaryfoodcatering@gmail.com`. Jika jatah email Apps Script habis atau izin belum lengkap, baris Sheet tetap menjadi catatan utama; cek Sheet secara rutin.

## 6. Selesaikan keputusan privasi sebelum mengaktifkan form

`privacy.html` dan pop-up di `index.html` telah disesuaikan dengan formulir terbaru. Google Doc awal menyebut hanya nama dan username Instagram untuk waiting list, sedangkan formulir situs juga meminta email, telepon, area/alamat, dan pilihan paket. Pemilik bisnis perlu menyetujui **masa simpan usulan 12 bulan**, siapa yang dapat membuka Sheet, jadwal penghapusan, dan prosedur menjawab permintaan akses/penghapusan. Setelah disetujui, ubah catatan pra-peluncuran menjadi tanggal berlaku dan pastikan pop-up tetap konsisten.

Kategori program yang diminati dapat mengisyaratkan kondisi kesehatan. Form tidak meminta diagnosis atau hasil tes. Batasi akses Sheet dan jangan membagikan ekspor lead secara terbuka.

## 7. Periksa Vercel yang sudah menayangkan domain

1. Di Vercel, buka project yang menayangkan `www.carelinary.my.id` → **Settings → Git**. Pastikan repository terhubung adalah `carelinary/carelinary-landing-page` dan branch produksi adalah `main`. Jangan membuat project baru atau mengubah DNS jika project dan domain sudah bekerja.
2. Saat branch revisi di-push, Vercel biasanya membuat **Preview Deployment**. Buka URL preview dari PR atau dashboard dan cek tampilan.
3. Project ini memakai HTML statis di root dan fungsi `api/interest.mjs` di folder `api`. Gunakan Framework Preset **Other**, Root Directory `./`, dan jangan arahkan output ke `dist` karena paket ini tidak memiliki folder `dist`. [Panduan Vercel Git deployments](https://vercel.com/docs/git).
4. Di **Settings → Environment Variables**, tambah untuk **Preview** terlebih dahulu:

   ```text
   GOOGLE_APPS_SCRIPT_URL = URL /exec dari Apps Script
   APPS_SCRIPT_SHARED_SECRET = nilai yang sama persis dengan SHARED_SECRET
   REGISTRATION_ENABLED = true
   PRIVACY_APPROVED = true (hanya setelah langkah 6 selesai)
   ```

5. Buat deployment preview baru setelah variabel disimpan. Pastikan `/api/interest` menjawab `{"enabled":true}`. Jika `false`, periksa keempat variabel dan buat deployment baru. Jangan menaruh shared secret di `script.js`, `index.html`, atau `.env.example`.
6. Sebelum privasi disetujui atau Sheet siap, biarkan `REGISTRATION_ENABLED=false` atau `PRIVACY_APPROVED=false`; tombol akan menampilkan **Pendaftaran belum dibuka** tanpa berpura-pura menyimpan data. [Vercel Functions](https://vercel.com/docs/functions/runtimes/node-js).

## 8. Uji alur nyata di Preview

1. Gunakan **data uji milik Anda sendiri**. Buka URL preview, isi nama, email, nomor, area, program, durasi, dan jumlah makan. Centang persetujuan lalu kirim.
2. Pop-up **Terima kasih** hanya boleh muncul jika penyimpanan berhasil. Periksa satu baris baru pada tab `WaitingList` dengan `submission_id` yang sama. Pastikan email notifikasi diterima.
3. Coba kirim form tanpa centang persetujuan: browser harus menolak. Pastikan data gagal tidak memunculkan pop-up sukses.
4. Uji tampilan pada ponsel dan desktop; cek juga lima video, navigasi, privasi, gambar, FAQ, kalkulator, favicon, dan kontras teks.
5. Hapus baris uji setelah selesai sesuai prosedur pemilik.

## 9. Terbitkan di domain yang sudah online

1. Setelah preview lulus, masukkan variabel yang sama ke lingkungan **Production** di Vercel. Jika privasi atau Sheet belum siap, biarkan dua flag tetap `false`.
2. Merge Pull Request ke `main`. Vercel akan membuat deployment produksi otomatis jika Git integration aktif. Periksa URL deployment sebelum membagikan domain. [Vercel untuk GitHub](https://vercel.com/docs/git/vercel-for-github).
3. Buka `https://www.carelinary.my.id/` di komputer dan ponsel. Periksa `/api/interest`, form, serta Sheet sekali lagi menggunakan data uji.
4. Pastikan link dari domain tanpa `www` mengarah ke domain utama jika itu pengaturan yang Anda inginkan. Karena domain sudah online, **tidak perlu mengubah DNS** untuk revisi kode ini.

## 10. Tinjau angka gizi dan materi sebelum mengubahnya menjadi penawaran final

Tiga kartu menu sekarang menampilkan **estimasi contoh** untuk kalori, karbohidrat, protein dan lemak. Angka ini bukan hasil penghitungan resep final. Sebelum dipakai sebagai informasi nutrisi produk yang dijual, tetapkan berat bersih setiap bahan, saus dan minyak, metode memasak, ukuran porsi jadi, lalu hitung ulang menggunakan basis data pangan yang sesuai dan minta ahli gizi meninjau hasilnya. Gunakan `MENU_VALIDATION_TEMPLATE.csv` sebagai lembar kerja. Jangan gunakan contoh menu sebagai klaim bahwa suatu hidangan mengobati GERD, diabetes, kolesterol tinggi atau hipertensi.

## 11. Materi yang masih menunggu keputusan bisnis

Lihat `MATERIAL_DAN_KEPUTUSAN.md`. Harga final, nutrisi per porsi, radius pengantaran, status ahli gizi/chef, bahan organik, dan kemungkinan pemeriksaan kesehatan tidak boleh ditulis sebagai janji operasional sebelum dikonfirmasi.

## Pemeriksaan akhir

- [ ] Semua file hasil ekstraksi ada di branch GitHub; ZIP tidak diunggah sebagai satu file website.
- [ ] Kiro memeriksa dan tes lulus.
- [ ] Logo/favikon sesuai, lima video berputar tanpa suara dan bisa dijeda.
- [ ] Form berada sebelum FAQ dan memiliki nama, email, telepon, area/alamat, program, durasi, jumlah makan, dan persetujuan.
- [ ] Privasi final disetujui dan ditampilkan sebelum data dikumpulkan.
- [ ] Pendaftar uji masuk tepat sekali ke Sheet privat dan notifikasi email diterima.
- [ ] Pop-up Terima Kasih hanya muncul setelah penyimpanan berhasil.
- [ ] Preview Vercel lulus sebelum PR digabung ke `main`.
- [ ] Domain produksi diuji ulang setelah deployment.

