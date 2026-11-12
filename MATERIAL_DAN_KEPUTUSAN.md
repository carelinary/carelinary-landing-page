# Material dan keputusan sebelum pendaftaran dibuka

## Sudah tersedia di paket

- Kode website yang direvisi berdasarkan repository Carelinary saat ini.
- Logo piring dari repository terbaru, favicon, foto makanan yang saat ini dipakai situs, dan lima video konsep tanpa suara.
- Form waiting list, fungsi Vercel, Apps Script untuk Google Sheets dan pemberitahuan email, pop-up kebijakan privasi dan terima kasih.
- Panduan unggah dan prompt Kiro AI.

**Catatan media:** lima video dan foto tambahan adalah ilustrasi konsep. Pastikan hak penggunaan komersial dan kesesuaiannya dengan merek sebelum menayangkannya sebagai materi pemasaran. Jangan menggunakannya sebagai bukti bahwa proses produksi, kemitraan, atau pengiriman Carelinary sudah berjalan.

## Perlu disiapkan oleh pemilik bisnis

1. **Privasi:** nama pengelola data, petugas yang boleh membuka Sheet, periode retensi pendaftar, prosedur penghapusan, dan tanggal berlaku. Perbarui `privacy.html` dan pop-up di `index.html` dengan keputusan final.
2. **Google:** akun pemilik Sheet dan Apps Script, Sheet privat, Script Properties, URL `/exec`, serta shared secret panjang yang disimpan di pengelola kata sandi.
3. **Vercel:** akses ke project yang sudah menayangkan domain, izin mengubah Environment Variables, dan verifikasi bahwa repository terhubung adalah `carelinary/carelinary-landing-page`.
4. **Tim layanan:** nama dan peran chef/ahli gizi yang telah menyetujui keterlibatan mereka, SOP asesmen, serta batas kondisi yang dapat dilayani.
5. **Menu:** resep final, berat tiap bahan sebelum/sesudah masak, ukuran porsi, alergen, metode memasak, kandungan natrium, protein, lemak, karbohidrat, dan kalori yang dihitung atau diperiksa tenaga gizi. Angka makro di halaman sekarang berlabel estimasi konsep; jangan menjadikannya label gizi produk final tanpa data ini.
6. **Harga dan paket:** HPP, harga final tiap menu, apakah asesmen dan pengiriman termasuk, durasi 5/10 hari, jumlah makan per hari yang benar-benar bisa dilayani, ketentuan jeda dan pembatalan.
7. **Operasional:** alamat dapur, radius pengantaran yang diuji, jam pengiriman, pemasok, bukti klaim organik bila akan digunakan, serta spesifikasi kemasan kontak pangan.
8. **Pelayanan calon pelanggan:** siapa yang membuka Sheet setiap hari, kapan menghubungi pendaftar, dan bagaimana mencatat permintaan berhenti dihubungi.

## Bahan khusus untuk ahli gizi

Gunakan `MENU_VALIDATION_TEMPLATE.csv` sebagai daftar kerja. Isi hanya dari resep dan pengukuran yang benar. Setelah disetujui, berikan hasilnya kepada pengembang untuk memperbarui kartu menu. Jangan mengubah menu ilustratif menjadi rekomendasi untuk gangguan ginjal, hati, GERD, diabetes, atau kondisi lain tanpa asesmen individual.

## Syarat sebelum `REGISTRATION_ENABLED=true`

- [ ] Kebijakan privasi final disetujui dan `PRIVACY_APPROVED=true`.
- [ ] Sheet privat dan notifikasi email telah diuji dengan data uji milik sendiri.
- [ ] Tidak ada shared secret atau data pribadi di GitHub.
- [ ] Tim siap menanggapi pendaftar dan permintaan penghapusan.
- [ ] Preview Vercel menunjukkan pop-up Terima Kasih hanya sesudah satu baris tersimpan.
