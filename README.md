# Tokoku Admin — 3D Motion Redesign

Redesign halaman admin Tokoku berdasarkan gambar referensi: dashboard utama, grafik trafik, rating & ulasan, katalog produk, serta riwayat pesanan. Gaya visual: clean mint/emerald, kartu floating, hero isometrik dengan CSS 3D, dan grafik interaktif.

## Tech stack
- Next.js 16 (App Router)
- React 19 + TypeScript strict
- Motion for React (`motion/react`) untuk transisi dan animasi
- Recharts untuk grafik dan tooltip
- Lucide React untuk ikon
- CSS responsif custom (tanpa Tailwind / UI-kit)

## Menjalankan

Pastikan **Node.js 20.9+** sudah tersedia.

```bash
npm install
npm run dev
```

Buka http://localhost:3000

Untuk pemeriksaan dan build:
```bash
npm run typecheck
npm run build
npm run start
```

## Routing

| URL | Fitur |
|-----|-------|
| `/` | Ringkasan KPI, grafik penjualan, trafik, produk terlaris, pesanan, status |
| `/trafik-kunjungan` | Area/line chart, tabel trafik, filter perangkat, ekspor CSV |
| `/rating-ulasan` | Ringkasan rating, pencarian, tambah ulasan simulasi |
| `/kelola-produk` | Cari, sortir, filter, tambah, edit, hapus, ubah stok produk |
| `/riwayat-pesanan` | Filter status, pencarian, detail, ubah status, opsi metode bayar |
| URL menu lainnya | Placeholder rapi untuk modul fase berikutnya |

## Interaksi yang dapat dicoba
- **Mouse/touchpad**: gerakkan pointer di banner hijau untuk gerakan perspektif 3D pada scene toko. Kartu KPI juga merespons tilt pointer.
- **Dashboard**: ubah periode 7/30/90 hari, hover titik grafik, pilih Omset / Pesanan, ekspor CSV.
- **Pencarian cepat**: tekan `Ctrl+K` / `⌘K`, ketik nama menu, tekan Enter.
- **Ulasan**: klik Tambah Rating Pembeli dan simpan contoh rating.
- **Produk**: buat/edit/hapus produk demo dan ubah stok link.
- **Pesanan**: filter, buka Detail, ubah status pesanan demo, buat email melalui aplikasi email.
- **Pengiriman**: alihkan simulasi Otomatis / Manual di sidebar maupun halaman Pesanan.
- **Mobile**: menu drawer dan layout menyesuaikan layar kecil.

## Integrasi yang masih diperlukan
Project ini adalah **UI demonstrasi**, bukan sistem pembayaran/penjualan aktif:
- Data histori/KPI/charts adalah data contoh dari screenshot; tidak real-time.
- CRUD produk, status order, rating, dan mode pengiriman disimpan di `localStorage` browser (bukan database). Data dapat bertahan setelah refresh pada browser yang sama.
- Payment provider, autentikasi, notifikasi push, stok link aman, pengiriman instan, dan pengiriman email sungguhan **belum** diintegrasikan.
- Tombol **Lihat Toko** dan **Keluar** menampilkan info simulasi.
- Nilai pembatalan histori diperbaiki menjadi 102 agar total status 921 sesuai dengan 799 Lunas + 17 Pre-Order + 3 Refund + 102 Batal.

## Struktur kode
```
app/
  layout.tsx
  page.tsx
  trafik-kunjungan/page.tsx
  rating-ulasan/page.tsx
  kelola-produk/page.tsx
  riwayat-pesanan/page.tsx
  [slug]/page.tsx
  globals.css
components/
  app-shell.tsx
  dashboard-context.tsx
  hero-3d.tsx
  ui.tsx
  charts.tsx
  pages/
    dashboard-home.tsx
    traffic-page.tsx
    reviews-page.tsx
    products-page.tsx
    orders-page.tsx
lib/data.ts
```

## Produksi
Sebelum dipakai untuk toko asli: tambahkan API/DB (PostgreSQL/Prisma atau setara), autentikasi/otorisasi per role, validasi server-side, audit trail, webhooks payment, real-time events dan penyimpanan aman untuk link digital; hindari menyimpan kredensial API di komponen client. Pertahankan dukungan `prefers-reduced-motion` agar animasi tetap aksesibel.
