# Panduan dari draft hingga website online

## 1. Periksa paket ini

Simpan seluruh isi folder ini sebagai satu proyek. Folder `assets`, `api`, `apps-script`, dan `test` harus tetap di tempatnya. Jangan unggah berkas ZIP mentah ke GitHub; ekstrak dahulu. Pastikan `index.html`, `styles.css`, `enhancements.css`, `script.js`, `privacy.html`, `favicon.png`, dan `vercel.json` berada di akar repository.

Sebelum menayangkan penawaran voucher Rp100.000, tetapkan siapa yang berhak (misalnya satu voucher per akun Instagram), masa berlaku, cara penukaran, dan anggarannya. Kalimat promosi saat ini adalah bagian dari draft desain; kode waiting list belum menerbitkan voucher otomatis.

## 2. Buat branch GitHub untuk revisi

Di GitHub Desktop, pilih repository `carelinary-landing-page`, lakukan **Fetch origin**, lalu pilih branch `main` dan **Pull origin**. Buat branch baru, misalnya `feature/revou-brief-form`. Buka **Show in Explorer**. Salin isi folder paket ini ke dalam folder repository, mengganti file dengan nama yang sama. Jangan salin folder paket sebagai subfolder. Periksa daftar perubahan, commit, dan **Publish branch**. Buat Draft Pull Request ke `main`.

## 3. Siapkan Google Sheet tanpa menghapus data lama

Gunakan Google Sheet privat yang sudah Anda miliki. Tidak perlu mengubah tab `WaitingList` lama. Script baru akan membuat tab `Leads Brief` secara otomatis saat kiriman pertama. Tab baru berisi `submission_id`, `submitted_at_utc`, `name`, `instagram_username`, dan `submitted_at_wib`. Kolom WIB berformat `YYYY-MM-DD HH:mm:ss` (contoh `2026-11-11 16:30:00`) agar mudah dibaca dan diurutkan; UTC tetap tersimpan sebagai acuan. Hanya nama dan username Instagram yang diminta dari pengunjung. Jika tab `Leads Brief` sudah memiliki empat kolom awal, script akan menambahkan kolom WIB tanpa menghapus data lama.

## 4. Buat Apps Script baru untuk versi brief

Agar formulir lama di production tidak terganggu saat uji coba, buat **project Apps Script baru** dari Google Drive: **New → More → Google Apps Script**. Jangan gunakan **Extensions → Apps Script** pada Sheet yang sama untuk langkah ini karena itu membuka project terikat yang sudah ada. Salin seluruh isi `apps-script/Code.gs` ke `Code.gs` pada project baru, lalu simpan. Script ini membuka Sheet lewat ID, sehingga project baru tidak perlu terikat ke Sheet. Di **Project Settings → Script properties**, isi:

- `SPREADSHEET_ID`: hanya ID di antara `/d/` dan `/edit` pada URL Sheet.
- `SHARED_SECRET`: string acak baru yang panjang, disimpan secara privat. Pakai nilai yang sama pada Vercel.
- `NOTIFICATION_EMAIL`: alamat email bisnis penerima notifikasi.

Pilih **Deploy → New deployment → Web app**. Jalankan sebagai **Me**. Akses **Anyone** diperlukan agar endpoint dapat menerima kiriman dari Vercel; autentikasi kiriman dilakukan oleh shared secret di server. Setujui otorisasi akun Google Anda, lalu salin **Web app URL** yang berakhir `/exec`. Jangan membagikan shared secret. Bila kode Apps Script berubah, gunakan **Manage deployments → Edit → New version → Deploy** untuk memperbarui deployment yang sama.

## 5. Uji di Vercel Preview

Draft PR membuat deployment Preview. Di Vercel Project → **Settings → Environment Variables**, buat empat variabel pada tabel di `README_BRIEF.md`, dengan scope **Preview** untuk branch revisi. `GOOGLE_APPS_SCRIPT_URL` dan `APPS_SCRIPT_SHARED_SECRET` sebaiknya bertipe **Secret**. Deploy ulang Preview agar variabel baru terbaca. Buka URL Preview, lalu cek `/api/interest` menghasilkan `{"enabled":true}`. Isi form dengan **nama dan username Instagram milik Anda sendiri**. Pastikan:

1. Nama dan username masuk ke tab `Leads Brief` dalam beberapa detik.
2. Popup Thank You hanya muncul setelah baris baru masuk ke Sheet.
3. Email notifikasi diterima, bila izin MailApp telah diberikan.
4. Popup Kebijakan Privasi dapat dibuka tepat di bawah form.
5. Rating sudah tidak ada; video tetap berjalan; tampilan desktop, tablet, dan ponsel rapi.

Hapus baris uji dari Sheet jika tidak diperlukan. Jika form gagal, periksa Vercel Function Logs dan Apps Script Executions. Kesalahan umum: URL bukan `/exec`, secret berbeda, `SPREADSHEET_ID` berisi `/d/`, deployment Apps Script belum diperbarui, atau variabel Vercel belum memicu redeploy.

## 6. Rilis ke Production

Setelah Preview lolos, atur keempat variabel yang sama untuk scope **Production**, lalu merge PR ke `main` dan tunggu deployment Production **Ready**. Jika mengubah variabel setelah merge, lakukan redeploy Production. Buka `https://www.carelinary.my.id/api/interest`; hasilnya harus `{"enabled":true}`. Coba satu pengiriman dari website resmi dengan data Anda sendiri; cek baris di `Leads Brief` dan popup Thank You. Domain yang sudah terhubung tidak perlu diubah DNS-nya.

## 7. Perawatan setelah rilis

Perubahan konten dapat dilakukan melalui branch dan PR baru. Perubahan Apps Script perlu deployment versi baru. Simpan Google Sheet tetap privat. Tinjau serta hapus data sesuai kebijakan privasi. Bila terjadi kebocoran shared secret, ganti nilainya di Apps Script Properties dan Vercel, lalu redeploy.

## Catatan tugas

Website ini adalah konsep pra-peluncuran untuk tugas. Menu, harga, dan proses layanan yang belum final tetap ditandai sebagai konsep atau estimasi. Formulir mengumpulkan minat, bukan pesanan atau pembayaran.
