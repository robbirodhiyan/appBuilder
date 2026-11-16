# DeyKit / appBuilder — update dari source ZIP terbaru

**Sumber:** `appBuilder-master.zip` yang disediakan pemilik proyek. Paket ini adalah *full repository replacement* (bukan patch generik / installer). Perubahan hanya dilakukan pada salinan source yang diunggah, tidak menulis langsung ke GitHub.

## Perubahan utama

1. **Branding terpisah:** Generator `--icon` hanya mengubah `icon.png` dan `android-icon-foreground.png`. `--splash` baru untuk gambar portrait. Tidak lagi menyamakan keduanya. `android.adaptiveIcon` memakai foreground + warna, tanpa menyisakan `backgroundImage`/`monochromeImage` lama.
2. **Splash Android:** Plugin native selalu menggunakan logo persegi; gambar `splash-icon.png` dipakai secara fullscreen React Native menggunakan `contain`, tanpa zoom. Splash menunggu *verified SQLite initialization* sebelum menghilang.
3. **Stabilitas UI:** Tabs diberi ukuran/padding sesuai *safe area* dan disembunyikan saat keyboard tampil; tidak ada padding atas otomatis yang mendobel SafeAreaView pada screen existing.
4. **Android Release otomatis:** Workflow `patch`, `minor`, `major` menghitung versi berikutnya dari sumber + tag Git. Sinkronisasi `expo.version` / `package.json` / `package-lock.json`, EAS remote Android `versionCode` auto-increment, build APK, push commit versi, dan GitHub Release dengan nama aplikasi dinamis.
5. **Pemeriksaan rilis:** validator menangkap native splash portrait, hilangnya startup database readiness, mismatch versi dan skrip CI, channel preview, serta konfigurasi workflow.
6. **Opsi OTA:** Aplikasi baru mewarisi manual update mode pada Expo config. Template OTA disediakan **opt-in** melalui `npm run setup:ota` setelah menginstal modul native dengan `npx expo install expo-updates expo-network` (perintah ini juga memperbarui `package-lock.json` sesuai SDK). Tidak menambahkan dependensi baru secara palsu ke lockfile.
7. **Update APK:** GitHub Release check tetap tersedia di Pengaturan; source GitHub release tidak lagi menggunakan owner/repo hardcoded dari starter.
8. **Identitas:** proyek yang sudah dibuat tidak diubah, database/migrations tidak dihapus, tidak ada perubahan signing key.

## Cara pasang tanpa installer (Windows)

1. Backup source appBuilder yang saat ini digunakan.
2. Ekstrak ZIP ini **di luar** folder proyek yang sedang digunakan.
3. Ganti source appBuilder lokal dengan isi folder `appBuilder-master` dalam ZIP. Jangan letakkan ZIP atau folder `appBuilder-master` sebagai subfolder di `src`.
4. Di CMD pada root appBuilder, jalankan:

```cmd
npm ci
npm run validate
```

Tidak perlu menyalin atau mengubah file satu per satu. **Jangan overwrite `.env`, `.git`, atau credential lokal**; ZIP tidak membawa `.git`.

## Membuat aplikasi baru

```cmd
npm run create:app -- --name "Contoh Apps" --key contohapps --icon "C:\assets\icon-square.png" --splash "C:\assets\splash-portrait.png" --owner "ORGANISASI" --repo "nama-repository"
```

Folder baru dibuat **sejajar** dengan root appBuilder. Generator memvalidasi PNG dan tidak menerima target folder existing, agar tidak menghapus aplikasi yang sudah ada.

```cmd
cd /d C:\path\to\contohapps
npm ci
npm run validate
npx eas-cli@latest init
npx eas-cli@latest update:configure
```

**OTA (opsional, sekali per aplikasi baru):**

```cmd
npx expo install expo-updates expo-network
npm run setup:ota
npm run validate
```

Setelah setup OTA, `src/app/_layout.tsx` memakai dialog OTA startup. GitHub APK check tersedia manual di Settings. **Modul OTA native mengharuskan APK baru** setelah modul ditambahkan, sebelum perubahan berikutnya bisa dikirim lewat OTA.

**Android Release:** GitHub Actions → `Debiyan Android Release` → pilih `patch/minor/major`. Atur `release.owner`, `release.repository`, EAS Project ID, `EXPO_TOKEN`, permissions Contents write, serta EAS Android credentials/signing sebelum release. Workflow memakai profile `preview` untuk menghasilkan APK internal.

## Penting

- Untuk native splash/logo, build ulang APK. Gambar portrait/React Native dapat diubah melalui OTA bila runtime kompatibel.
- Jika GitHub repository privat, pengecekan APK lewat API GitHub publik tidak dapat mengambil release tanpa autentikasi; jangan taruh token di APK.
- `expo-updates` / `expo-network` sengaja **tidak** ditambah ke `package.json` dalam ZIP ini karena registry paket tidak dapat diakses saat pembuatan sehingga `package-lock.json` yang valid tidak dapat dihasilkan. `npm ci` tetap konsisten; gunakan perintah setup OTA pada mesin developer saat akses npm tersedia.
- Workflow CI akan membuat commit versi setelah **build EAS berhasil**; bila branch protection menolak push bot, konfigurasi repo perlu disesuaikan.
- Periksa `git diff` sebelum commit dan push ke repository.
