# Carelinary landing page

Revisi konten dari website `www.carelinary.my.id`, berdasarkan `main` pada 11 November 2026. Situs sudah online; pendaftaran waiting list tetap nonaktif sampai Google Sheets, Apps Script, Vercel, dan kebijakan privasi siap.

## Mulai dari sini

1. Baca `PANDUAN_REVISI_DAN_GOOGLE_SHEETS.md` untuk alur GitHub → Kiro → Google Sheets/Apps Script → Vercel.
2. Buka `KIRO_PROMPT_REVISI_EN.md` dan tempel isinya ke AI Kiro untuk pemeriksaan lanjutan.
3. Baca `MENU_VALIDATION_STATUS.md` untuk status angka gizi yang saat ini tampil.
4. Untuk preview lokal, jalankan `node dev-server.mjs`; untuk tes, jalankan `node --test test/*.test.mjs`.

Website tetap dapat diterbitkan dengan formulir nonaktif. Formulir baru aktif ketika konfigurasi Apps Script tersedia dan variabel Vercel `REGISTRATION_ENABLED=true` serta `PRIVACY_APPROVED=true` disetel setelah pemeriksaan pemilik.

