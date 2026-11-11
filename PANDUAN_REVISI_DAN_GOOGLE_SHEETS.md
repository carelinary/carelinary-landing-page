# Carelinary: revisi website sampai waiting list masuk Google Sheets

## 1. Apa yang ada dalam paket ini

Paket ini berasal dari versi `main` Carelinary yang sudah tayang, lalu mengubah dua bagian yang berulang: **Tantangan + Pendekatan** menjadi satu bagian, dan **Program + Kondisi Kesehatan** menjadi satu bagian. Penjelasan GERD, diabetes, hipertensi, dan kolesterol tetap ada. Bagian lain, video hero, menu, form sebelum FAQ, dan kebijakan privasi tetap dipertahankan. Ada contoh proses penilaian menu tanpa menyebut nama ahli gizi.

Di bawah tombol hero terdapat **lima ikon bintang, skor 4,5/5, dan narasi survei 100 responden** untuk kebutuhan visual tugas RevoU. Judul singkat “Simulasi survei kepuasan” menandai bahwa angka tersebut bagian dari konsep tugas. Jika suatu saat proyek dipakai sebagai bisnis sungguhan, hapus angka ini sampai tersedia hasil survei yang dapat diperiksa, termasuk tanggal, pertanyaan, jumlah responden, dan cara menghitung rata-ratanya.

File website yang berubah: `index.html`, `enhancements.css`, dan `test/site.test.mjs`. File panduan, prompt Kiro, dan catatan validasi merupakan bahan pendukung. Backend waiting list sudah tersedia dalam `api/interest.mjs` dan `apps-script/Code.gs`; tidak perlu dibuat ulang.

**Jangan unggah ZIP langsung ke GitHub.** Ekstrak dulu, lalu salin isi file/folder yang diperlukan ke repositori. Jangan unggah `.env` berisi nilai rahasia, Spreadsheet ID, atau shared secret.

## 2. Mulai dari GitHub Desktop dan Kiro

1. Buka GitHub Desktop. Pilih repositori `carelinary/carelinary-landing-page`.
2. Pastikan tidak ada perubahan lokal yang belum disimpan. Klik **Fetch origin**, lalu pilih branch `main` dan **Pull origin**.
3. Buat branch baru dari `main`, misalnya `feature/ringkas-konten-sheets`. Jangan mengerjakan revisi langsung di `main`.
4. Klik **Show in Explorer** untuk membuka folder repositori lokal. Dari paket yang diekstrak, salin `index.html`, `enhancements.css`, dan `test/site.test.mjs` ke lokasi yang sama di folder repositori. Salin juga dokumen panduan dan `KIRO_PROMPT_REVISI_EN.md` bila ingin menyimpannya di repo.
5. Buka folder repositori itu di Kiro melalui **File → Open Folder**. Berikan prompt dari `KIRO_PROMPT_REVISI_EN.md`. Minta Kiro memeriksa hasil dan memperbaiki masalah nyata tanpa menulis ulang situs.
6. Cek tampilan komputer dan ponsel. Pastikan tautan menu, video, tombol, formulir, privacy popup, dan FAQ bekerja. Di terminal Kiro jalankan `node --test test/*.test.mjs` jika Node.js tersedia.
7. Di GitHub Desktop, telaah file yang berubah, tulis pesan commit, misalnya `Merge overlapping landing page sections`, klik **Commit**, lalu **Push origin**.
8. Di GitHub, buka **Compare & pull request** dari branch baru ke `main`. Periksa **Vercel Preview** dari PR. Gabungkan PR setelah tampilan Preview benar. Situs produksi akan menerima pembaruan melalui integrasi GitHub–Vercel yang sudah ada.

## 3. Siapkan Google Sheet privat

1. Masuk dengan akun Google bisnis yang akan mengelola data. Buat spreadsheet baru bernama `Carelinary Waiting List`.
2. Pastikan berbagi file diatur **Restricted**. Hanya orang yang memang menangani calon pelanggan yang mendapat akses. Jangan pilih “Anyone with the link”.
3. Ubah nama tab pertama menjadi **`WaitingList`** persis demikian, tanpa spasi tambahan.
4. Isi baris pertama kolom A sampai L dengan header berikut, masing-masing satu kolom dan urutannya persis:

   `submission_id | submitted_at_utc | name | email | phone | delivery_area_or_address | interested_program | interested_duration | meals_per_day | consent_to_contact | consent_text_version | source`

5. Simpan **Spreadsheet ID** secara privat. Ini adalah bagian di antara `/d/` dan `/edit` pada alamat spreadsheet.

## 4. Pasang Google Apps Script

1. Dari Sheet tersebut, buka **Extensions → Apps Script**.
2. Hapus contoh kode yang ada di `Code.gs`, lalu salin seluruh isi file paket `apps-script/Code.gs`. Simpan.
3. Di Apps Script buka **Project Settings → Script Properties**. Tambahkan:
   - `SPREADSHEET_ID`: ID spreadsheet dari langkah 3.
   - `SHARED_SECRET`: string acak panjang yang Anda buat sendiri, idealnya sekurangnya 32 karakter. Simpan di pengelola kata sandi. Nilai ini nanti harus **sama persis** dengan `APPS_SCRIPT_SHARED_SECRET` di Vercel.
   - `NOTIFICATION_EMAIL`: `carelinaryfoodcatering@gmail.com`.
4. Pilih **Deploy → New deployment → Web app**. Set **Execute as: Me** dan **Who has access: Anyone** agar Vercel Function dapat memanggil endpoint tanpa login Google. Spreadsheet **tetap Restricted**; akses web app dilindungi oleh shared secret dan validasi server. Salin URL deployment yang berakhir `/exec`. Jangan gunakan URL `/dev`.
5. Saat Google meminta izin, tinjau lalu izinkan akses yang diperlukan ke Sheet dan pengiriman email. Jika Anda memperbarui `Code.gs` kelak, buat versi/deployment baru agar perubahan benar-benar aktif.

## 5. Hubungkan Vercel Preview terlebih dahulu

1. Buka proyek Vercel `carelinary-landing-page` → **Settings → Environment Variables**.
2. Tambahkan empat variabel berikut untuk **Preview**:
   - `GOOGLE_APPS_SCRIPT_URL` = URL `/exec` dari langkah 4.
   - `APPS_SCRIPT_SHARED_SECRET` = nilai yang sama dengan `SHARED_SECRET` di Apps Script.
   - `REGISTRATION_ENABLED` = `true`.
   - `PRIVACY_APPROVED` = `true` **hanya sesudah** teks privasi, masa simpan data, dan proses permintaan akses/penghapusan disetujui pemilik bisnis. Jika belum, gunakan `false` dan formulir akan tetap nonaktif.
3. Buat **deployment Preview baru** atau redeploy Preview setelah menambahkan variabel. Variabel baru tidak mengubah deployment lama.
4. Buka URL Preview dari PR. Kunjungi `/api/interest`; Anda harus melihat `{"enabled":true}` jika semua syarat terpenuhi.
5. Uji formulir dengan data **milik Anda sendiri**, centang persetujuan, lalu kirim sekali. Pastikan popup “Terima kasih” muncul **hanya setelah** data tersimpan. Buka Sheet dan cocokkan nama, `submission_id`, program, durasi, jumlah makan, serta persetujuan. Periksa email notifikasi juga. Hapus baris uji setelahnya sesuai prosedur bisnis Anda.
6. Uji kegagalan sederhana: kosongkan satu kolom wajib atau jangan centang persetujuan; form harus menolak. Bila popup sukses muncul tetapi tidak ada baris di Sheet, jangan aktifkan Production.

## 6. Aktifkan Production

1. Setelah Preview lulus, set empat variabel yang sama untuk **Production**. `REGISTRATION_ENABLED=true` dan `PRIVACY_APPROVED=true` hanya jika kebijakan privasi sudah disetujui dan Anda siap menerima serta mengelola data pelanggan.
2. Buat deployment Production baru atau redeploy commit `main` yang sudah digabung. **Tidak perlu mengubah DNS** karena `www.carelinary.my.id` sudah terhubung ke proyek yang sama.
3. Buka `https://www.carelinary.my.id/api/interest` dan pastikan `enabled` bernilai `true`. Lalu kirim satu pendaftaran uji lewat situs resmi, periksa baris Sheet, notifikasi email, dan popup sukses pada komputer dan ponsel. Hapus data uji.
4. Bila ingin menghentikan pendaftaran, ubah `REGISTRATION_ENABLED=false` untuk Production lalu redeploy. Formulir akan menunjukkan “Pendaftaran belum dibuka”.

## 7. Jika ada masalah

| Gejala | Pemeriksaan pertama |
| --- | --- |
| Tombol pendaftaran nonaktif | Cek keempat variabel di lingkungan Vercel yang benar, lalu redeploy. Buka `/api/interest`. |
| Form mengirim tetapi gagal | Cek URL `/exec`, kecocokan kedua shared secret, dan deployment Apps Script. |
| Apps Script merespons `sheet_missing` | Nama tab harus `WaitingList`. |
| Apps Script merespons `headers_mismatch` | Periksa ke-12 header dan urutannya. |
| Baris ada tetapi email tidak masuk | Periksa folder Spam, izin MailApp, `NOTIFICATION_EMAIL`, dan kuota Apps Script. Sheet adalah catatan utama. |
| Website lama masih tampil | Pastikan PR sudah masuk `main` dan deployment Production memakai commit terbaru. |

Jangan kirim diagnosis, hasil pemeriksaan, nomor telepon pelanggan, atau shared secret melalui chat/issue publik. Perubahan desain dan teks masih dapat dilakukan setelah integrasi aktif selama struktur data formulir tetap sama. Bila field atau header Sheet diubah, perbarui frontend, API, Apps Script, dan Sheet bersama-sama lalu uji ulang di Preview.
