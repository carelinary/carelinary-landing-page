# Carelinary landing page

Revisi pra-peluncuran dari website `www.carelinary.my.id`, berdasarkan commit `1e4f441` pada 10 November 2026. Bagian yang tidak diminta untuk diubah dipertahankan.

## Mulai dari sini

1. Baca `PANDUAN_UPLOAD_DAN_LAUNCH.md` untuk alur GitHub → Kiro → Google Sheets/Apps Script → Vercel.
2. Buka `KIRO_PROMPT_EN.md` dan tempel isinya ke AI Kiro bila Anda ingin Kiro memeriksa atau melanjutkan kode.
3. Baca `MATERIAL_DAN_KEPUTUSAN.md` untuk hal yang perlu disetujui sebelum formulir dibuka.
4. Untuk preview lokal, jalankan `node dev-server.mjs`; untuk tes, jalankan `node --test test/*.test.mjs`.

Website tetap dapat diterbitkan dengan formulir nonaktif. Formulir baru aktif ketika konfigurasi Apps Script tersedia dan variabel Vercel `REGISTRATION_ENABLED=true` serta `PRIVACY_APPROVED=true` disetel setelah pemeriksaan pemilik.

