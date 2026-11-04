# Panduan pengelola konten

Panduan ini menjelaskan konfigurasi yang ada. Admin sekolah perlu menguji alur Turbo pada akun yang berwenang sebelum mengandalkannya untuk menyimpan atau menerbitkan konten. Pengujian interaktif itu belum dilakukan dari workspace ini.

## Masuk ke CMS

1. Buka alamat situs diikuti `/admin/`.
2. Pilih **Login with Turbo** dan masuk melalui alur resmi Turbo.
3. Jika akses ditolak, minta administrator Turbo memeriksa keanggotaan editor, koneksi repository, dan daftar **Admin Interface URLs**. Jangan membagikan kata sandi atau token.

## Membuat atau mengedit draft

1. Pilih koleksi yang sesuai. Teks umum situs masih diedit pada koleksi Indonesia dan English. Layanan dan FAQ memiliki koleksi bilingual tersendiri; satu entri memuat kedua bahasa. Galeri dan dokumentasi aktivitas juga menyimpan kedua bahasa dalam satu entri.
2. Saat membuat layanan atau FAQ, isi ID stabil dengan huruf kecil dan tanda hubung, misalnya `layanan-baru`. Jangan mengganti ID setelah entri diterbitkan. Lengkapi bahasa Indonesia dan Inggris dalam entri yang sama.
3. Simpan pekerjaan sebagai draft melalui tindakan Editorial Workflow yang tersedia. Deskripsi, terjemahan, gambar, teks alternatif, rincian, dan urutan dapat dibiarkan belum lengkap saat draft. ID dan ikon layanan tetap diperlukan untuk membentuk entri.
4. Untuk melanjutkan, buka kembali entri yang sama melalui daftar Workflow/Drafts dan simpan perubahan. Alur Turbo pada akun proyek belum diuji, jadi admin perlu memastikan tindakan draft/resume berfungsi sebelum pemakaian rutin.
5. Sebelum review, lengkapi semua teks ID/EN, urutan unik, alt text jika memakai gambar, dan status publikasi yang dikehendaki. Reviewer harus memeriksa fakta, tautan, gambar, izin, terjemahan, dan status publikasi.

Decap mengatur Workflow pada konfigurasi CMS. Validasi Astro mengizinkan field parsial hanya pada build branch workflow `cms/...`; build lokal dan `main` tetap ketat. Layanan/FAQ Indonesia dan Inggris berada pada file yang sama per entri, sehingga perubahan struktur satu bahasa tidak dapat terpisah dari pasangannya. Administrator repository tetap perlu mewajibkan status check **Content validation / validate** sebelum merge. Tombol, perilaku simpan/lanjut, serta pemisahan branch harus diuji langsung di akun Turbo proyek ini.

## Memublikasikan

Sebelum menyetujui dan menerbitkan, pastikan:

- Informasi institusi, layanan, jam, biaya, syarat, kontak, dan alamat telah dikonfirmasi sekolah.
- Konten Indonesia dan Inggris selaras; layanan dan FAQ memakai ID, urutan, serta status publikasi yang sama.
- Item memiliki data wajib dan urutan unik. Item yang tidak boleh tampil di situs memiliki flag publikasi nonaktif.
- Gambar berada di folder media CMS, menggunakan nama file yang jelas, memiliki alt text dalam kedua bahasa, dan tidak melebihi batas konfigurasi 5 MiB.
- Foto siswa yang dapat dikenali hanya ditandai boleh dipublikasikan setelah izin dikonfirmasi oleh pihak sekolah.
- Pemeriksaan pull request **Content validation / validate** lulus. Jangan merge konten bila status check gagal.

Gunakan tindakan review/publish di CMS hanya setelah persetujuan sekolah dan reviewer yang berwenang. Penggabungan ke `main` menerbitkan perubahan pada deploy produksi jika integrasi hosting sudah aktif. Alur ini belum diuji pada akun Turbo atau deployment proyek ini.

## Mengunggah foto

Gunakan widget gambar di koleksi CMS dan simpan media ke `public/images/bank-mini/`. Pilih gambar dokumentasi resmi yang sudah disetujui, isi alt text yang menjelaskan informasi visual (bukan nama file), lalu periksa preview. Untuk galeri/activity, isi alt text ID dan EN. Jangan memakai foto stok atau gambar sintetis seolah-olah dokumentasi sekolah.

## Jika terjadi masalah

- **Tidak bisa login:** administrator memeriksa akun editor, GitHub App, koneksi repository, Site ID, dan origin admin yang diizinkan di Turbo.
- **Draft tidak tersimpan atau tidak terlihat:** jangan menyalin rahasia akun ke laporan. Catat pesan error, halaman koleksi, dan waktu; minta admin Turbo memeriksa workflow branch dan izin GitHub.
- **Pemeriksaan gagal:** baca pesan validasi di pemeriksaan pull request dan lengkapi data yang disebut. Draft parsial hanya diperbolehkan pada workflow branch; `main` tetap memerlukan konten lengkap dan valid.
- **Gambar gagal:** periksa format JPG/PNG/WebP, ukuran maksimum 5 MiB, nama/path media, dan teks alternatif.

Rincian schema, folder konten, keamanan media, dan pengaturan Turbo tersedia di [arsitektur CMS](cms-architecture.md). Status audit dan pengujian ada di [audit proyek](project-audit.md).
