# Revisi landing page Carelinary — 12 November 2026

## Yang berubah

1. Bagian pertama dibuat lebih ringkas: satu kalimat penjelas, satu pesan keunggulan, dan formulir waiting list. Video tetap berjalan otomatis tanpa suara.
2. Bagian tantangan memakai satu pertanyaan dan tiga jawaban: kebutuhan personal, gizi dan rasa, serta kemudahan rutinitas.
3. Setiap kartu menu menampilkan nama, foto, ringkasan, dan harga. Klik **“Pengen tahu lebih lanjut menu ini?”** untuk membaca komposisi, alasan pemilihan nutrisi, dan perkiraan kalori serta zat gizi.
4. Bagian **Why Carelinary?** diringkas menjadi empat prinsip: profil pribadi, gizi dan cita rasa, bahan pilihan, serta kemasan lebih bijak.
5. Bagian lain, termasuk formulir, program, membership, FAQ, dan kebijakan privasi, dipertahankan.

Angka gizi dan harga pada kartu menu masih bertanda perkiraan atau ilustratif. Menu akhir memerlukan penyesuaian individual.

## Cara termudah: dari branch GitHub yang sudah disiapkan

Revisi tersedia pada branch `feature/revisi-lp-carelinary-11nov` di repository `carelinary/carelinary-landing-page`. Pull request draft yang sama adalah **#4**.

1. Buka GitHub → repository **carelinary-landing-page** → tab **Pull requests** → buka **#4**.
2. Buka tab **Files changed**. Periksa terutama `index.html`, `enhancements.css`, dan `test/site.test.mjs`.
3. Tunggu pemeriksaan Vercel pada pull request menjadi **Ready**, lalu buka tautan **Preview** dari komentar Vercel.
4. Cek tampilan desktop dan ponsel: hero, pertanyaan dan tiga jawaban, buka-tutup ketiga rincian menu, harga tetap terlihat, empat kartu Why Carelinary, serta formulir waiting list.
5. Setelah Preview sesuai, ubah pull request dari **Draft** menjadi **Ready for review** bila perlu, lalu pilih **Merge pull request**. Penggabungan ke `main` memicu deployment Production melalui integrasi GitHub–Vercel yang sudah ada.
6. Setelah Production menjadi **Ready**, buka `https://www.carelinary.my.id/`, lakukan refresh, dan ulangi pemeriksaan singkat. Tidak perlu mengubah DNS untuk revisi konten ini.

## Jika ingin memakai ZIP dan mengunggah sendiri

ZIP berisi seluruh berkas website, bukan satu berkas yang diunggah sebagai ZIP ke GitHub.

1. Ekstrak ZIP di komputer.
2. Di GitHub Desktop, pilih repository **carelinary-landing-page** dan branch kerja yang ingin dipakai. Jangan salin folder `.git` dari tempat lain.
3. Klik **Repository → Show in Explorer**. Salin **isi** folder hasil ekstrak ke folder repository tersebut, dengan struktur `index.html`, `styles.css`, `enhancements.css`, `script.js`, `assets/`, `api/`, dan `apps-script/` tetap di tempatnya.
4. Kembali ke GitHub Desktop. Tinjau daftar perubahan; jangan ikut mengunggah file `.env` atau nilai rahasia Apps Script.
5. Isi ringkasan commit, klik **Commit to [nama branch]**, lalu **Push origin** atau **Publish branch**.
6. Buka repository di browser, buat pull request dari branch kerja menuju `main`, lalu ikuti pemeriksaan Preview di atas.

Untuk revisi saat ini, gunakan **cara termudah** karena branch dan pull request sudah tersedia. Mengunggah ZIP lagi akan membuat perubahan ganda.
