
# DeyKit

### Offline Mobile Application Starter Kit by Debiyan

DeyKit adalah starter kit untuk membangun aplikasi mobile
berbasis React Native, Expo, TypeScript, dan SQLite dengan
pendekatan offline-first.

DeyKit menyediakan sistem pembuatan project baru, database
independen, dynamic branding, migrasi database, validasi
project, Android APK build, dan distribusi aplikasi melalui
GitHub Releases.

Setiap aplikasi yang dibuat melalui DeyKit memiliki
identitas dan lifecycle rilis sendiri.

---

## 1. Overview

### 1.1 Tujuan

DeyKit dikembangkan untuk mempermudah pembuatan aplikasi
mobile tanpa perlu melakukan konfigurasi project dari awal.

Dengan satu starter kit, developer dapat:

- Membuat aplikasi React Native baru.
- Menghasilkan Android Application ID secara otomatis.
- Membuat database SQLite independen.
- Mengatur nama dan branding aplikasi.
- Menggunakan UI Material Design 3.
- Menjalankan aplikasi tanpa server database.
- Melakukan migrasi database secara otomatis.
- Melakukan backup dan restore database.
- Membangun APK melalui EAS Build.
- Mendistribusikan APK melalui GitHub Releases.
- Memeriksa ketersediaan update aplikasi.
- Menjalankan validasi sebelum release.

### 1.2 Project Information

| Property | Value |
|---|---|
| Brand | Debiyan |
| Starter Kit | DeyKit |
| Main Repository | appBuilder |
| Framework | React Native |
| Platform | Android, iOS-ready, Web |
| Expo | Expo SDK 58 |
| UI Framework | React Native Paper |
| Navigation | Expo Router |
| Language | TypeScript |
| Database | SQLite |
| Build Service | Expo Application Services |
| Version Control | Git |
| CI/CD | GitHub Actions |
| Distribution | GitHub Releases |
| Architecture | Offline-first |

Platform Android menjadi target distribusi APK utama.

Dukungan iOS dan Web tetap mengikuti kompatibilitas
dependency serta hasil pengujian pada masing-masing platform.

---

## 2. Technology Stack

### Core

- React Native
- Expo
- Expo Router
- TypeScript
- React

### User Interface

- React Native Paper
- Material Design 3
- Lucide Icons
- React Native Safe Area Context

### Local Database

- expo-sqlite
- SQLite migrations
- SQLite schema validation

### Database Maintenance

- expo-file-system
- expo-sharing
- expo-document-picker

### Application Information

- expo-application
- expo-constants

### Development Tools

- Node.js
- npm
- Visual Studio Code
- Git
- GitHub
- EAS CLI

### CI/CD

- GitHub Actions
- Expo EAS Build
- GitHub Releases

---

## 3. System Architecture

DeyKit menggunakan pendekatan offline-first.

Aplikasi menjalankan proses bisnis dan menyimpan data
utama secara lokal menggunakan SQLite.

```text
                 DEYKIT STARTER KIT
                         |
                         v
                Project Generator
                         |
             +-----------+-----------+
             |           |           |
             v           v           v
          DeyLab      DeyNotes    StockManager
             |           |           |
             v           v           v
          SQLite      SQLite       SQLite
             |           |           |
             v           v           v
          EAS ID       EAS ID       EAS ID
             |           |           |
             v           v           v
          GitHub       GitHub       GitHub
          Release      Release      Release
```

Setiap aplikasi dibuat sebagai project independen.

Project turunan tidak menggunakan database, EAS Project ID,
Android Package, maupun GitHub Release milik project lain.

### 3.1 Prinsip Arsitektur

1. Local-first storage.
2. Independent application identity.
3. Independent database.
4. Migration-based schema management.
5. Configurable application branding.
6. Automated project validation.
7. Reproducible dependency installation.
8. Independent application release lifecycle.

---

## 4. Main Project Structure

```text
appBuilder/
|
|-- .github/
|   `-- workflows/
|
|-- assets/
|   `-- images/
|
|-- docs/
|   `-- DEYKIT.md
|
|-- scripts/
|   |-- create-app.mjs
|   |-- validate-project.mjs
|   `-- templates/
|       `-- release-android.yml
|
|-- src/
|   |-- app/
|   |   `-- _layout.tsx
|   |
|   |-- components/
|   |   `-- auto-update-checker.tsx
|   |
|   |-- contexts/
|   |   `-- theme-context.tsx
|   |
|   |-- constants/
|   |
|   |-- database/
|   |   |-- migrations.ts
|   |   |-- migrations-v2.ts
|   |   |-- initialize.ts
|   |   |-- validate-schema.ts
|   |   `-- verified-initialize.ts
|   |
|   |-- repositories/
|   |
|   |-- services/
|   |   `-- app-update.ts
|   |
|   |-- types/
|   |   `-- css.d.ts
|   |
|   `-- global.css
|
|-- app.json
|-- app.config.ts
|-- eas.json
|-- project.config.json
|-- package.json
|-- package-lock.json
`-- tsconfig.json
```

Beberapa komponen tambahan seperti backup, restore,
dashboard, dan navigation mengikuti struktur source code
starter kit yang sedang digunakan.

---

## 5. Development Environment

### 5.1 Requirements

Development environment yang direkomendasikan:

- Windows 10/11 atau Linux.
- Node.js yang kompatibel dengan Expo SDK.
- npm.
- Git.
- Visual Studio Code.
- Koneksi internet untuk instalasi dependency dan EAS Build.
- Akun Expo.
- Akun GitHub.

Android Studio tidak wajib untuk build APK menggunakan
EAS Cloud Build.

Namun, perangkat Android atau emulator diperlukan
untuk melakukan pengujian aplikasi native.

### 5.2 Verify Tools

Buka terminal atau CMD:

```cmd
node -v
npm -v
git --version
```

Pastikan setiap command menghasilkan informasi versi.

### 5.3 Install Dependencies

Masuk ke project utama:

```cmd
cd /d C:\laragon\project\appBuilder
```

Jalankan:

```cmd
npm ci
```

Perintah ini menggunakan dependency lockfile yang
tersedia pada package-lock.json.

### 5.4 Verify Expo Configuration

```cmd
npx expo config --type public
```

### 5.5 TypeScript Validation

```cmd
npx tsc --noEmit
```

### 5.6 Start Application

```cmd
npx expo start --web
```

Untuk membersihkan cache Metro:

```cmd
npx expo start --web --clear
```

---

## 6. Project Configuration

DeyKit menggunakan dua konfigurasi utama:

1. project.config.json
2. app.config.ts

### 6.1 project.config.json

File ini menyimpan identitas dan branding setiap aplikasi.

Contoh konfigurasi aplikasi baru:

```json
{
  "brand": {
    "name": "Debiyan"
  },
  "branding": {
    "primaryColor": "#2563EB",
    "backgroundColor": "#F8FAFC",
    "icon": "./assets/images/icon.png",
    "splashImage": "./assets/images/splash-icon.png"
  },
  "app": {
    "name": "DeyNotes",
    "key": "deynotes",
    "slug": "deynotes",
    "scheme": "deynotes",
    "androidPackage": "app.debiyan.deynotes",
    "iosBundleIdentifier": "app.debiyan.deynotes",
    "databaseName": "deynotes.db"
  },
  "release": {
    "owner": "GITHUB_OWNER",
    "repository": "deynotes",
    "apkPrefix": "deynotes"
  }
}
```

GITHUB_OWNER merupakan placeholder.

Nilai tersebut harus diganti dengan pemilik repository
GitHub yang sebenarnya sebelum menjalankan release.

### 6.2 Configuration Fields

#### brand

Identitas brand yang digunakan oleh aplikasi.

#### branding

Menyimpan warna utama, warna background, icon,
dan splash image.

#### app

Menyimpan nama aplikasi, App Key, Expo Slug,
Android Package, iOS Bundle Identifier, dan databaseName.

#### release

Mengatur GitHub owner, repository, dan prefix nama APK.

### 6.3 app.config.ts

File app.config.ts menggabungkan konfigurasi Expo
dengan informasi project.config.json.

Informasi aplikasi diekspos melalui:

```typescript
Constants.expoConfig?.extra?.project
```

Contoh penggunaan:

```typescript
import Constants from 'expo-constants';

const appName =
  Constants.expoConfig?.extra?.project?.appName;

const databaseName =
  Constants.expoConfig?.extra?.project?.databaseName;

const primaryColor =
  Constants.expoConfig?.extra?.project?.primaryColor;
```

---

## 7. Project Generator

Project Generator digunakan untuk membuat aplikasi baru
dari source DeyKit utama.

Lokasi:

```text
scripts/create-app.mjs
```

### 7.1 Basic Usage

```cmd
cd /d C:\laragon\project\appBuilder

npm run create:app -- --name "DeyNotes"
```

Generator membuat folder baru:

```text
C:\laragon\project\deynotes
```

### 7.2 Custom App Key

```cmd
npm run create:app -- --name "Stock Manager" --key "stock_manager"
```

Hasil:

```text
App Name        : Stock Manager
App Key         : stock_manager
Expo Slug       : stock-manager
Android Package : app.debiyan.stock_manager
Database        : stock_manager.db
```

### 7.3 Custom Branding

```cmd
npm run create:app -- --name "DeyNotes" --primary "#2563EB" --background "#F8FAFC"
```

### 7.4 Custom Icon

```cmd
npm run create:app -- --name "DeyNotes" --icon "C:\assets\deynotes.png"
```

Gunakan PNG persegi dengan resolusi yang memadai,
misalnya 1024 x 1024 piksel.

Untuk hasil produksi yang lebih baik, sediakan area
aman pada logo agar Android adaptive icon tidak terpotong.

Generator saat ini dapat menggunakan PNG yang sama
untuk icon utama, adaptive foreground, dan splash.

Desain khusus untuk masing-masing aset tetap
direkomendasikan apabila dibutuhkan.

### 7.5 GitHub Repository Configuration

```cmd
npm run create:app -- --name "DeyNotes" --owner "GITHUB_OWNER" --repo "deynotes"
```

### 7.6 Supported Arguments

| Argument | Required | Description |
|---|---|---|
| --name | Yes | Nama aplikasi |
| --key | No | Application key |
| --primary | No | Primary theme color |
| --background | No | Background color |
| --icon | No | PNG icon |
| --owner | No | GitHub owner |
| --repo | No | GitHub repository |

### 7.7 Generator Rules

Generator akan:

1. Memvalidasi nama dan App Key.
2. Memastikan folder tujuan belum tersedia.
3. Menyalin source aplikasi.
4. Mengabaikan Git history dan cache.
5. Mengabaikan credential dan database lama.
6. Membuat project.config.json baru.
7. Mengatur branding aplikasi.
8. Membuat Android Package baru.
9. Mengatur database SQLite independen.
10. Mereset versi aplikasi menjadi 1.0.0.
11. Menghapus EAS Project ID lama.
12. Menghasilkan Update Checker khusus aplikasi.
13. Menyalin GitHub Actions workflow.
14. Membuat README aplikasi.
15. Menyertakan Project Validator.

### 7.8 Files Excluded from Generated Apps

Project baru tidak membawa:

```text
.git/
.github/ dari project utama
.expo/
.eas/
node_modules/
android/
ios/
dist/
build/
coverage/
scripts/create-app.mjs
scripts/templates/
docs/DEYKIT.md
```

Credential dan file sensitif tertentu juga dikecualikan.

Workflow release baru akan dibuat secara terpisah
dari template universal.

### 7.9 Generated Project Structure

```text
deynotes/
|
|-- .github/
|   `-- workflows/
|       `-- release-android.yml
|
|-- assets/
|
|-- scripts/
|   `-- validate-project.mjs
|
|-- src/
|   |-- app/
|   |-- components/
|   |-- contexts/
|   |-- database/
|   |-- repositories/
|   `-- services/
|
|-- README.md
|-- app.json
|-- app.config.ts
|-- eas.json
|-- project.config.json
|-- package.json
`-- package-lock.json
```

Project hasil generator dapat dikembangkan dan
dirilis secara independen.

---

## 8. Development Workflow

Setelah membuat aplikasi baru:

### Step 1: Open Project

```cmd
cd /d C:\laragon\project\deynotes
```

### Step 2: Install Dependencies

```cmd
npm ci
```

### Step 3: Validate Configuration

```cmd
npm run validate
```

### Step 4: Start Expo

```cmd
npx expo start --web --clear
```

### Step 5: Develop Features

Tambahkan screen, component, repository,
dan business logic sesuai kebutuhan aplikasi.

### Step 6: Run Validation

```cmd
npm run validate
```

### Step 7: Commit Changes

```cmd
git add .

git commit -m "feat: implement application features"
```

---

## 9. SQLite Database

Setiap aplikasi menggunakan database SQLite lokal.

Database disimpan secara independen berdasarkan
konfigurasi databaseName.

Contoh:

```text
DeyKit       -> appbuilder.db
DeyNotes     -> deynotes.db
DeyLab       -> deylab.db
StockManager -> stock_manager.db
```

### 9.1 Database Initialization

Database diinisialisasi melalui SQLiteProvider.

```tsx
<SQLiteProvider
  databaseName={DATABASE_NAME}
  onInit={initializeVerifiedDatabase}
>
  {children}
</SQLiteProvider>
```

### 9.2 Initialization Flow

```text
Application Start
       |
       v
SQLiteProvider
       |
       v
Open Local Database
       |
       v
initializeDatabase()
       |
       v
Apply Pending Migrations
       |
       v
validateDatabaseSchema()
       |
       v
Application Ready
```

### 9.3 Database Migration Versions

#### Migration v1

File:

```text
src/database/migrations.ts
```

Membuat tabel utama:

```text
items
```

Kolom penting:

```text
id
name
sku
created_at
updated_at
```

#### Migration v2

File:

```text
src/database/migrations-v2.ts
```

Membuat tabel:

```text
app_settings
```

### 9.4 Migration Strategy

Migration digunakan untuk memperbarui struktur database
tanpa menghapus data pengguna yang sudah ada.

Aturan:

- Jangan menghapus database untuk melakukan upgrade.
- Jangan mengganti nama database setelah release.
- Jangan mengganti struktur tabel lama tanpa migrasi.
- Tambahkan migration baru untuk perubahan schema.
- Pastikan migration dijalankan sesuai urutan.
- Pertahankan kompatibilitas data pengguna.

### 9.5 Adding Migration v3

Jika aplikasi membutuhkan tabel baru:

1. Buat file migration baru.
2. Tambahkan logic pembuatan atau perubahan tabel.
3. Hubungkan ke initialize.ts.
4. Perbarui versi schema yang didukung.
5. Perbarui validasi schema.
6. Uji upgrade dari database versi sebelumnya.
7. Uji instalasi baru dengan database kosong.

Contoh nama file:

```text
src/database/migrations-v3.ts
```

Catatan:

Project Validator bawaan memeriksa file dan definisi
migration dasar v1/v2.

Validasi schema setelah database dibuka memastikan
tabel yang diwajibkan benar-benar tersedia.

### 9.6 SQLite Schema Validation

File:

```text
src/database/validate-schema.ts
```

Digunakan untuk memeriksa keberadaan tabel dan kolom
setelah proses migration selesai.

Wrapper:

```text
src/database/verified-initialize.ts
```

Jika schema yang diwajibkan tidak tersedia,
initialization akan menghasilkan error sehingga
masalah schema dapat diketahui sebelum operasi CRUD.

### 9.7 Database Maintenance

Starter kit menyediakan fitur maintenance database,
termasuk pemeriksaan integritas serta mekanisme
backup dan restore.

Untuk pengujian database:

- Tambahkan data melalui CRUD.
- Tutup aplikasi.
- Buka aplikasi kembali.
- Pastikan data tetap tersedia.
- Jalankan integrity check.
- Buat backup.
- Verifikasi restore menggunakan data pengujian.

Lakukan backup sebelum menguji restore atau perubahan
schema yang berisiko.

---

## 10. Dynamic Branding

DeyKit mendukung branding berbeda pada setiap aplikasi.

Branding dikonfigurasi melalui project.config.json.

### 10.1 Example

```json
{
  "branding": {
    "primaryColor": "#2563EB",
    "backgroundColor": "#F8FAFC",
    "icon": "./assets/images/icon.png",
    "splashImage": "./assets/images/splash-icon.png"
  }
}
```

### 10.2 Theme Integration

React Native Paper menggunakan MD3LightTheme
dan MD3DarkTheme.

AppThemeProvider membaca warna branding dari
Expo Constants.

Theme modes:

```text
system
light
dark
```

Warna primary mengikuti konfigurasi masing-masing
aplikasi.

### 10.3 Branding Rules

- Nama aplikasi mengikuti app.name.
- Primary color mengikuti branding.primaryColor.
- Background color mengikuti branding.backgroundColor
  sesuai implementasi tema.
- Icon Android mengikuti file icon aplikasi.
- Splash image mengikuti branding.splashImage.
- Nama database tidak dipengaruhi perubahan warna.

### 10.4 Native Branding

Perubahan ikon launcher dan splash screen membutuhkan
native build baru agar terlihat pada APK terpasang.

Expo Web tidak cukup untuk memvalidasi hasil icon
launcher dan splash screen Android.

---

## 11. Application Identity

Setiap aplikasi memiliki identitas unik.

### 11.1 Application Key

Contoh:

```text
deynotes
stock_manager
maintenance_checklist
```

Aturan:

- Diawali huruf kecil.
- Hanya menggunakan a-z, 0-9, dan underscore.
- Tidak menggunakan spasi.
- Tidak mengganti App Key setelah aplikasi dirilis
  tanpa memeriksa dampak konfigurasinya.

### 11.2 Android Application ID

Format aplikasi baru:

```text
app.debiyan.<app_key>
```

Contoh:

```text
app.debiyan.deynotes
app.debiyan.stock_manager
```

### 11.3 Legacy Application

Starter kit utama mempertahankan identitas teknis lama:

```text
App Name        : DeyKit
App Key         : deykit
Expo Slug       : appBuilder
Android Package : app.debiyan.builder
SQLite Database : appbuilder.db
```

Identitas ini tidak boleh diganti secara sembarangan
karena dapat memengaruhi kompatibilitas update APK
dan data SQLite dari instalasi sebelumnya.

### 11.4 Identity Changes After Release

Setelah APK didistribusikan:

- Jangan mengganti Android Application ID.
- Jangan mengganti signing certificate.
- Jangan mengganti database filename.
- Jangan menghubungkan project ke EAS Project
  milik aplikasi lain.

Perubahan nama tampilan dan branding dapat dilakukan,
tetapi membutuhkan build baru untuk perubahan native.

---

## 12. EAS Build

DeyKit menggunakan Expo Application Services
untuk membangun APK Android.

### 12.1 Login Check

```cmd
npx eas-cli@latest whoami
```

Jika belum login:

```cmd
npx eas-cli@latest login
```

### 12.2 Initialize EAS Project

Jalankan dari folder aplikasi baru:

```cmd
npx eas-cli@latest init
```

Gunakan EAS Project baru untuk setiap aplikasi.

Jangan menggunakan EAS Project ID milik DeyKit utama
untuk project turunan.

### 12.3 Verify Project

```cmd
npx eas-cli@latest project:info
```

### 12.4 APK Build Profile

Pastikan eas.json memiliki profile preview
yang menghasilkan APK.

Contoh bagian konfigurasi:

```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

Gabungkan dengan konfigurasi eas.json yang sudah ada;
jangan menghapus pengaturan lain yang diperlukan.

### 12.5 First Android Build

```cmd
npx eas-cli@latest build --platform android --profile preview
```

Jika diminta membuat keystore, gunakan keystore baru
untuk aplikasi baru.

Simpan dan kelola signing credentials dengan aman.

### 12.6 Important Notes

- Setiap aplikasi mempunyai EAS Project sendiri.
- Android Application ID harus konsisten.
- Android signing key harus konsisten untuk update.
- Build profile harus sesuai target distribusi.
- APK untuk instalasi langsung berbeda dari AAB
  untuk distribusi melalui Play Store.

---

## 13. GitHub Repository

Setiap aplikasi menggunakan repository GitHub sendiri.

Contoh:

```text
appBuilder
deylab
deynotes
stock_manager
```

### 13.1 Initialize Repository

Masuk ke folder aplikasi baru:

```cmd
cd /d C:\laragon\project\deynotes
```

Jika belum menjadi Git repository:

```cmd
git init -b master
```

Tambahkan source:

```cmd
git add .
```

Commit pertama:

```cmd
git commit -m "chore: initialize application"
```

Tambahkan remote:

```cmd
git remote add origin https://github.com/GITHUB_OWNER/deynotes.git
```

Push:

```cmd
git push -u origin master
```

Ganti GITHUB_OWNER dengan akun atau organisasi GitHub
yang digunakan.

Jika Git repository atau remote sudah tersedia,
jangan mengulang git init maupun remote add origin.

### 13.2 Repository Configuration

Pastikan project.config.json sesuai:

```json
{
  "release": {
    "owner": "GITHUB_OWNER",
    "repository": "deynotes",
    "apkPrefix": "deynotes"
  }
}
```

---

## 14. GitHub Actions CI/CD

DeyKit menggunakan workflow universal untuk
membangun dan mempublikasikan APK Android.

File template utama:

```text
scripts/templates/release-android.yml
```

Pada aplikasi hasil generate:

```text
.github/workflows/release-android.yml
```

### 14.1 Workflow Overview

```text
GitHub Actions
      |
      v
Checkout Repository
      |
      v
Setup Node.js
      |
      v
npm ci
      |
      v
Project Validation
      |
      v
TypeScript Check
      |
      v
EAS Authentication
      |
      v
Android APK Build
      |
      v
Download APK Artifact
      |
      v
GitHub Release
```

### 14.2 Required Secret

Nama secret:

```text
EXPO_TOKEN
```

Token dibuat melalui:

https://expo.dev/settings/access-tokens

Simpan token di:

```text
GitHub Repository
  -> Settings
  -> Secrets and variables
  -> Actions
  -> New repository secret
```

Nama:

```text
EXPO_TOKEN
```

Value:

```text
<nilai token Expo yang dibuat>
```

Jangan menyimpan nilai token pada source code.

### 14.3 Shared Token

Satu EXPO_TOKEN dapat digunakan pada beberapa project
selama identitas token memiliki akses yang diperlukan.

Untuk pengelolaan yang lebih aman, pertimbangkan token
CI/CD khusus dengan cakupan akses terbatas.

### 14.4 Run Workflow

Buka repository GitHub:

```text
Actions
  -> Debiyan Android Release
  -> Run workflow
```

Pilih branch sesuai workflow repository.

### 14.5 Release Output

Contoh:

```text
GitHub Releases
|
|-- v1.0.0
|   `-- deynotes-v1.0.0.apk
|
`-- v1.0.1
    `-- deynotes-v1.0.1.apk
```

Workflow membuat release berdasarkan versi aplikasi.

Jangan membuat tag yang sama secara manual sebelum
workflow yang membuat tag tersebut dijalankan.

### 14.6 Public Repository Requirement

Update Checker yang menggunakan GitHub Releases API
tanpa autentikasi memerlukan release yang dapat
diakses secara publik.

Untuk private repository, diperlukan mekanisme distribusi
APK lain yang aman.

Jangan memasukkan GitHub access token rahasia ke dalam APK.

---

## 15. Application Versioning

DeyKit menggunakan format semantic version dasar:

```text
MAJOR.MINOR.PATCH
```

Contoh:

```text
1.0.0
1.0.1
1.1.0
2.0.0
```

### 15.1 Version Definitions

MAJOR:

Perubahan besar yang berpotensi tidak kompatibel.

MINOR:

Penambahan fitur yang kompatibel.

PATCH:

Perbaikan bug atau perubahan kecil.

### 15.2 Update Version

Contoh menaikkan versi menjadi 1.0.1.

Ubah app.json:

```json
{
  "expo": {
    "version": "1.0.1"
  }
}
```

Contoh ini menunjukkan properti version saja,
bukan pengganti seluruh app.json.

Sinkronkan metadata npm:

```cmd
npm version 1.0.1 --no-git-tag-version
```

Perintah tersebut memperbarui versi pada package.json
dan package-lock.json.

### 15.3 Android versionCode

Selain expo.version, Android menggunakan versionCode
untuk membedakan versi build.

versionCode baru harus lebih tinggi daripada versi
yang sudah terpasang.

Gunakan strategi local atau remote versioning EAS
secara konsisten.

Jika menggunakan autoIncrement, pastikan konfigurasinya
sesuai dengan versioning source yang digunakan.

### 15.4 Release Process

```text
Update Code
    |
    v
Update Version
    |
    v
Validate
    |
    v
Commit
    |
    v
Push
    |
    v
Run GitHub Actions
    |
    v
New APK Release
```

---

## 16. APK Update Checker

Aplikasi menggunakan GitHub Releases API untuk
memeriksa ketersediaan APK versi baru.

File:

```text
src/services/app-update.ts
```

Komponen startup:

```text
src/components/auto-update-checker.tsx
```

### 16.1 Update Flow

```text
Application Open
       |
       v
Read Installed Version
       |
       v
Request GitHub Releases API
       |
       v
Compare Versions
       |
       +---- No Update ---> Continue Application
       |
       v
Show Update Dialog
       |
       +---- Later -------> Continue Application
       |
       v
Open APK Download URL
       |
       v
User Installs Update
```

### 16.2 Update Mechanism

Update Checker tidak memasang APK secara diam-diam.

Aplikasi membuka tautan unduhan APK dan proses
instalasi tetap mengikuti izin serta konfirmasi Android.

### 16.3 Offline Behavior

Jika perangkat tidak terhubung ke internet:

- Aplikasi tetap dapat dijalankan.
- SQLite tetap dapat digunakan.
- Pemeriksaan update dapat gagal tanpa menghentikan
  fungsi utama aplikasi.

### 16.4 Update Requirements

Agar APK baru memperbarui instalasi lama:

1. Android Application ID harus sama.
2. Signing certificate harus cocok.
3. versionCode harus meningkat.
4. APK harus kompatibel dengan perangkat.
5. Database migration harus kompatibel dengan data lama.

---

## 17. Project Validation

DeyKit menyediakan validator otomatis.

Lokasi:

```text
scripts/validate-project.mjs
```

### 17.1 Development Validation

```cmd
npm run validate
```

Digunakan saat development.

Pemeriksaan mencakup:

- Application identity.
- Android Package.
- Expo Slug.
- SQLite database name.
- Branding colors.
- Branding assets.
- Versioning metadata.
- Resolved Expo configuration.
- File migration SQLite.
- EAS build profile.
- GitHub release configuration.
- GitHub Actions workflow.
- Generator cleanup.
- TypeScript compilation.

### 17.2 Release Validation

```cmd
npm run validate:release
```

Digunakan sebelum GitHub Release.

Pemeriksaan tambahan mencakup:

- EAS Project ID tersedia.
- GitHub release owner terisi.
- Repository GitHub sesuai konfigurasi.
- Versi project konsisten.
- Workflow release siap digunakan.

### 17.3 Validation Rules

Apabila pemeriksaan gagal:

```text
[FAIL] ...
```

Validator keluar dengan exit code selain 0.

GitHub Actions harus menghentikan proses build
ketika validasi gagal.

### 17.4 Validation Limitations

Validator Node.js memeriksa konfigurasi dan
struktur source code.

Validasi ini tidak menggantikan:

- Runtime SQLite testing.
- Native Android testing.
- APK signing verification.
- Update installation testing.
- Data migration acceptance testing.

---

## 18. Testing Strategy

Setiap aplikasi baru harus melewati pengujian minimum.

### 18.1 Development Testing

- Application startup.
- Navigation.
- Light Mode.
- Dark Mode.
- Dynamic Branding.
- SQLite CRUD.
- SQLite migration.
- Database maintenance.
- Offline startup.

### 18.2 Native Android Testing

- Launcher icon.
- Splash screen.
- Application name.
- SQLite persistence.
- File permission handling.
- Backup export.
- Restore functionality.
- APK installation.

### 18.3 Release Testing

- EAS Project benar.
- GitHub repository benar.
- EXPO_TOKEN tersedia.
- GitHub Actions sukses.
- APK asset tersedia.
- Release tag sesuai versi.
- APK dapat dipasang.

### 18.4 Update Testing

Pengujian update menggunakan dua versi APK.

```text
v1.0.0 -> v1.0.1
```

Prosedur:

1. Instal APK v1.0.0.
2. Tambahkan data ke SQLite.
3. Tutup aplikasi.
4. Buat release v1.0.1.
5. Periksa update dari aplikasi lama.
6. Instal APK v1.0.1 tanpa uninstall.
7. Buka aplikasi terbaru.
8. Periksa data SQLite lama.
9. Jalankan integrity check.
10. Verifikasi seluruh fitur utama.

Acceptance criteria:

Data lama tidak hilang dan aplikasi terbaru
berfungsi tanpa kesalahan migration.

---

## 19. Troubleshooting

### 19.1 Invalid Expo Slug

Penyebab:

Nilai slug tidak sesuai pola yang diterima
konfigurasi Expo.

Solusi:

Periksa app.slug dan validasi pada app.config.ts.

Starter kit utama tetap menggunakan slug legacy:

```text
appBuilder
```

### 19.2 TypeScript Cannot Find CSS Module

Contoh:

```text
TS2307: Cannot find module '*.module.css'
```

Pastikan file berikut tersedia:

```text
src/types/css.d.ts
```

Deklarasi:

```typescript
declare module '*.module.css' {
  const styles: {
    readonly [className: string]: string;
  };

  export default styles;
}

declare module '*.css' {}
```

Pastikan file CSS yang di-import benar-benar tersedia
dengan nama yang sesuai, termasuk kapitalisasi.

### 19.3 EAS Project ID Missing

Penyebab:

Aplikasi baru belum terhubung ke EAS Project.

Solusi:

```cmd
npx eas-cli@latest init
```

Periksa:

```cmd
npx eas-cli@latest project:info
```

### 19.4 EXPO_TOKEN Missing

Penyebab:

GitHub Actions belum memiliki secret EXPO_TOKEN.

Solusi:

Tambahkan token pada repository GitHub melalui
Settings -> Secrets and variables -> Actions.

### 19.5 GitHub Release Owner Empty

Penyebab:

project.config.json masih memiliki:

```json
{
  "release": {
    "owner": ""
  }
}
```

Solusi:

Isi owner repository yang benar.

### 19.6 GitHub Release Already Exists

Penyebab:

Tag release versi tersebut sudah tersedia.

Solusi:

Periksa daftar releases dan pastikan versi aplikasi
belum pernah dipublikasikan.

Jika perubahan merupakan release baru,
naikkan versi secara benar.

### 19.7 APK Cannot Update Existing App

Periksa:

- Android Application ID.
- Signing certificate.
- Android versionCode.
- Instalasi APK sebelumnya.
- Kompatibilitas perangkat.

Jangan langsung uninstall aplikasi lama apabila
terdapat data SQLite yang perlu dipertahankan.

### 19.8 SQLite Missing Table

Contoh:

```text
[SQLite] Required table missing: items
```

Periksa:

- Migration file.
- initialize.ts.
- Migration execution order.
- SQLite database filename.
- Database schema validation.

Jangan menghapus database produksi sebagai
langkah pertama troubleshooting.

### 19.9 npm ci Failed

Pastikan package.json dan package-lock.json sinkron.

Jalankan:

```cmd
npm install
```

Periksa perubahan lockfile, kemudian:

```cmd
npm ci
```

Commit lockfile yang valid agar dependency CI/CD
menggunakan versi yang konsisten.

---

## 20. Security Guidelines

### 20.1 Never Commit Credentials

Jangan commit:

```text
EXPO_TOKEN
GitHub Personal Access Token
Android Keystore
Private Keys
Passwords
Production Database
Sensitive .env Files
```

### 20.2 GitHub Secrets

Simpan token CI/CD menggunakan GitHub Actions Secrets.

Batasi akses repository dan workflow sesuai kebutuhan.

### 20.3 Android Signing

Gunakan signing credentials yang konsisten
untuk setiap aplikasi.

Jangan membagikan keystore antar aplikasi tanpa
alasan dan pengelolaan yang jelas.

### 20.4 SQLite Backup

Backup aplikasi mungkin mengandung data pengguna.

Jangan menyimpan backup produksi pada repository publik.

Pastikan proses import dan restore hanya menggunakan
file yang memang diizinkan pengguna.

---

## 21. Development Standards

### 21.1 Source Code

- Gunakan TypeScript.
- Gunakan component reusable.
- Pisahkan UI dan database logic.
- Simpan query dalam repository atau service.
- Gunakan struktur Expo Router.
- Hindari hardcode identitas aplikasi.

### 21.2 Configuration

Gunakan project.config.json untuk identitas aplikasi.

Hindari menyimpan nama aplikasi, databaseName,
atau GitHub repository secara hardcode di banyak file.

### 21.3 Database

- Semua perubahan schema melalui migration.
- Hindari destructive migration tanpa strategi backup.
- Uji upgrade dari schema versi lama.
- Pertahankan data pengguna saat APK diperbarui.

### 21.4 Release

- Gunakan semantic version.
- Jalankan project validation.
- Pastikan Android versionCode meningkat.
- Gunakan GitHub Actions untuk publikasi APK.
- Simpan release notes.
- Uji APK sebelum distribusi ke pengguna.

### 21.5 Commit Convention

Contoh:

```text
feat: add new dashboard
fix: resolve sqlite migration issue
refactor: simplify repository layer
docs: update DeyKit documentation
chore: release v1.0.1
```

---

## 22. Recommended Development Workflow

Untuk setiap aplikasi baru, gunakan urutan berikut:

```text
1. Generate Application
          |
          v
2. Install Dependencies
          |
          v
3. Configure Branding
          |
          v
4. Develop Features
          |
          v
5. Run Project Validation
          |
          v
6. Test SQLite and UI
          |
          v
7. Initialize EAS Project
          |
          v
8. Create GitHub Repository
          |
          v
9. Configure EXPO_TOKEN
          |
          v
10. Build Android APK
          |
          v
11. Publish GitHub Release
          |
          v
12. Test Application Update
```

---

## 23. Maintenance Policy

DeyKit utama adalah source template untuk project baru.

### 23.1 Changes to Main Starter Kit

Perubahan pada appBuilder dapat memengaruhi
aplikasi yang dibuat setelah perubahan tersebut.

Contoh:

- Perubahan tema.
- Penambahan komponen.
- Perubahan migration template.
- Perbaikan generator.
- Perbaikan workflow release.

### 23.2 Existing Generated Applications

Aplikasi yang sudah dibuat tidak otomatis berubah
ketika starter kit utama diperbarui.

Perbaikan yang dibutuhkan aplikasi lama harus
diterapkan secara terpisah.

Jangan menyalin seluruh source starter kit terbaru
ke aplikasi produksi tanpa melakukan review perubahan.

### 23.3 Backward Compatibility

Pertahankan:

- Android Package.
- Database name.
- EAS Project identity.
- Signing credentials.
- Data migration compatibility.

---

## 24. Release Checklist

Sebelum menerbitkan APK:

- [ ] App Name benar.
- [ ] Android Package benar.
- [ ] Database name benar.
- [ ] Branding sesuai aplikasi.
- [ ] TypeScript validation berhasil.
- [ ] SQLite migration berhasil.
- [ ] SQLite schema validation berhasil.
- [ ] GitHub owner dan repository benar.
- [ ] EAS Project ID benar.
- [ ] EXPO_TOKEN tersedia di GitHub.
- [ ] Version sudah dinaikkan.
- [ ] Android versionCode meningkat.
- [ ] APK dibangun dengan signing key yang benar.
- [ ] GitHub Actions berhasil.
- [ ] GitHub Release tersedia.
- [ ] APK dapat dipasang.
- [ ] Data SQLite tetap tersedia setelah update.

---

## 25. Future Improvements

Pengembangan berikutnya dapat mencakup:

### Automated Testing

- Unit testing.
- Repository testing.
- SQLite migration testing.
- Component testing.
- CI smoke testing.

### Generator Enhancements

- Dedicated icon generation.
- Splash image generator.
- Additional brand color tokens.
- Automatic release configuration checks.
- Project creation wizard.

### Database Enhancements

- Migration rollback strategy.
- Migration compatibility tests.
- Backup metadata validation.
- Database export/import testing.

### Release Enhancements

- Automated release notes.
- APK metadata verification.
- Signed APK update verification.
- Version consistency enforcement.
- Release artifact retention policy.

---

## 26. Quick Reference

### Create Application

```cmd
npm run create:app -- --name "DeyNotes"
```

### Create with Branding

```cmd
npm run create:app -- --name "DeyNotes" --primary "#2563EB" --background "#F8FAFC"
```

### Install Dependencies

```cmd
npm ci
```

### Validate Development

```cmd
npm run validate
```

### Validate Release

```cmd
npm run validate:release
```

### Start Expo Web

```cmd
npx expo start --web --clear
```

### Initialize EAS

```cmd
npx eas-cli@latest init
```

### Build Android APK

```cmd
npx eas-cli@latest build --platform android --profile preview
```

### Check EAS Project

```cmd
npx eas-cli@latest project:info
```

### TypeScript Check

```cmd
npx tsc --noEmit
```

---

## 27. Final Notes

DeyKit dirancang sebagai fondasi reusable untuk
membangun banyak aplikasi mobile offline.

Setiap aplikasi yang dihasilkan harus memiliki
identitas, database, EAS Project, dan GitHub Release
yang independen.

Starter kit utama bertanggung jawab menyediakan
template, generator, validator, dan standar pengembangan.

Aplikasi turunan bertanggung jawab terhadap proses
bisnis, data pengguna, pengujian, dan release lifecycle
masing-masing.

**DeyKit — Build Once, Create Independently.**

Maintained under the Debiyan brand.


## Sinkronisasi DeyPocket — 2026-11-16

- Jangan samakan `icon.png`, `android-icon-foreground.png` dan splash portrait. Gunakan `--splash` secara eksplisit.
- Native Expo splash memakai gambar persegi transparan; fullscreen React Native memakai `resizeMode=contain` dan menunggu SQLite verified init.
- UI Tabs memiliki safe-area bottom, `tabBarHideOnKeyboard=true`. Form input sebaiknya `KeyboardAvoidingView` + ScrollView pada layar form masing-masing (tidak memaksa semua screen).
- Release APK kini otomatis menaikkan versi `patch/minor/major` dari tag Git, menjaga `app.json`, `package.json`, `package-lock.json` konsisten, dan menggunakan EAS remote `versionCode`.
- OTA tersedia sebagai opt-in: instal modul `expo-updates` dan `expo-network` yang sesuai SDK, lalu `npm run setup:ota`. Jangan melakukan OTA untuk perubahan native/SDK.
- `release.owner` dan `release.repository` wajib cocok dengan repository actual saat menjalankan GitHub Actions.
