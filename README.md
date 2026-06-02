# 📚 Mahasiswa-App

[![Node.js Version](https://img.shields.io/badge/Node.js->=16.x-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg)](https://www.typescriptlang.org/)
[![Electron](https://img.shields.io/badge/Electron-33.4-9feaf9.svg)](https://www.electronjs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen.svg)]()

Aplikasi desktop untuk **manajemen data mahasiswa** yang dibangun dengan **Electron**, **TypeScript**, dan **SQLite3**. Aplikasi ini menyediakan fitur lengkap untuk mengelola informasi mahasiswa termasuk CRUD (Create, Read, Update, Delete) operations.

## 📑 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#️-tech-stack)
- [Struktur Project](#-struktur-project)
- [Prasyarat](#-prasyarat)
- [Instalasi](#-instalasi)
- [Cara Memulai](#-cara-memulai)
- [Konfigurasi Environment](#-konfigurasi-environment)
- [Data Model](#-data-model)
- [IPC Communication](#-ipc-communication)
- [Arsitektur](#️-arsitektur)
- [Development](#-development)
- [Building & Deployment](#-building--deployment)
- [Testing](#-testing)
- [Code Standards](#-code-standards)
- [Security](#️-security)
- [Troubleshooting](#-troubleshooting)
- [Known Issues](#-known-issues)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [References](#-referensi)
- [Authors](#-authors)
- [License](#-license)

## ✨ Fitur Utama

- ✅ **Tambah Data Mahasiswa** - Menambahkan data mahasiswa baru
- ✅ **Lihat Semua Data** - Menampilkan daftar seluruh mahasiswa dalam tabel
- ✅ **Edit Data Mahasiswa** - Mengubah informasi mahasiswa yang sudah ada
- ✅ **Hapus Data Mahasiswa** - Menghapus data mahasiswa dari database
- ✅ **Database Lokal** - Menggunakan SQLite3 untuk penyimpanan data yang persisten
- ✅ **Interface yang User-Friendly** - UI sederhana dan intuitif

## 🛠️ Tech Stack

| Teknologi            | Versi    | Kegunaan                                       |
| -------------------- | -------- | ---------------------------------------------- |
| **Electron**         | ^33.4.11 | Framework untuk desktop application            |
| **TypeScript**       | ^6.0.3   | Bahasa pemrograman dengan type safety          |
| **Electron Vite**    | ^5.0.0   | Build tool & dev server untuk Electron         |
| **better-sqlite3**   | ^12.10.0 | SQLite3 database driver dengan performa tinggi |
| **Node.js**          | >=16.x   | Runtime environment                            |
| **Vite**             | ^8.0.13  | Frontend build tool                            |
| **electron-rebuild** | ^4.0.4   | Native module builder                          |

## 📁 Struktur Project

```
mahasiswa-app/
├── src/
│   ├── main/                      # Backend (Electron Main Process)
│   │   ├── index.ts              # Entry point & IPC handlers
│   │   ├── db/
│   │   │   ├── Database.ts       # Singleton database instance
│   │   │   ├── Repository.ts     # Base repository class
│   │   │   └── MahasiswaRepository.ts  # CRUD operations
│   │   └── models/
│   │       └── Mahasiswa.ts      # Data model interface
│   ├── preload/                   # Preload script (Security bridge)
│   │   └── index.ts
│   └── renderer/                  # Frontend (UI)
│       ├── index.html            # HTML template
│       └── renderer.js           # Frontend logic
├── out/                          # Compiled output (generated)
├── electron.vite.config.ts       # Electron Vite configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Project dependencies
└── README.md                     # Dokumentasi ini
```

## 📊 Database Schema

### Tabel: `mahasiswa`

```sql
CREATE TABLE mahasiswa (
  id INTEGER PRIMARY KEY AUTOINCREMENT,    -- ID unik (auto increment)
  nim TEXT NOT NULL UNIQUE,                -- Nomor Induk Mahasiswa (unique)
  nama TEXT NOT NULL,                      -- Nama lengkap mahasiswa
  jurusan TEXT NOT NULL,                   -- Program studi/jurusan
  angkatan INTEGER NOT NULL,               -- Tahun masuk (contoh: 2023)
  ipk REAL NOT NULL DEFAULT 0              -- Index Prestasi Kumulatif (0.0 - 4.0)
)
```

### Penjelasan Kolom

| Kolom      | Tipe    | Constraint        | Keterangan                                 |
| ---------- | ------- | ----------------- | ------------------------------------------ |
| `id`       | INTEGER | PRIMARY KEY, AUTO | ID unik, auto-increment                    |
| `nim`      | TEXT    | NOT NULL, UNIQUE  | Nomor Induk Mahasiswa (harus unique)       |
| `nama`     | TEXT    | NOT NULL          | Nama lengkap mahasiswa                     |
| `jurusan`  | TEXT    | NOT NULL          | Program studi (contoh: Teknik Informatika) |
| `angkatan` | INTEGER | NOT NULL          | Tahun masuk (contoh: 2023)                 |
| `ipk`      | REAL    | NOT NULL, DEFAULT | IPK (0.0 - 4.0, default: 0)                |

## � Prasyarat

Sebelum memulai, pastikan sistem Anda memenuhi persyaratan berikut:

### Persyaratan Minimum

- **Node.js**: >= 16.x (Tested dengan versi 18.x dan 20.x)
- **npm**: >= 8.x atau **yarn** >= 1.22.x
- **Git**: Untuk cloning repository
- **RAM**: Minimal 2GB
- **Disk Space**: 500MB untuk development, 300MB untuk runtime

### Sistem Operasi yang Didukung

- ✅ **Windows** 7 dan lebih baru
- ✅ **macOS** 10.13 dan lebih baru
- ✅ **Linux** (Ubuntu 16.04+, Fedora, Debian, dll)

### Tools Opsional (Recommended)

- **Visual Studio Code** - Untuk development
- **Git** - Version control

### Verifikasi Instalasi

```bash
# Cek Node.js version
node --version

# Cek npm version
npm --version
```

## 💻 Instalasi

### Langkah 1: Clone Repository

```bash
git clone https://github.com/yourusername/mahasiswa-app.git
cd mahasiswa-app
```

### Langkah 2: Install Dependencies

```bash
npm install
```

**Notes**:

- Package `better-sqlite3` akan di-rebuild otomatis melalui `postinstall` script
- Proses ini mungkin memakan waktu 2-5 menit tergantung kecepatan internet
- Pastikan tidak ada error saat instalasi, khususnya pada `electron-rebuild`

### Langkah 3: Verifikasi Instalasi

```bash
# Cek apakah semua dependencies terinstall dengan benar
npm list

# Jalankan development server untuk test
npm run dev
```

## 🚀 Cara Memulai

### Development Mode

Jalankan aplikasi dalam mode development dengan hot-reload:

```bash
npm run dev
```

Aplikasi akan terbuka di Electron window dengan:

- ✅ Hot module replacement (HMR)
- ✅ DevTools terintegrasi
- ✅ Source maps untuk debugging
- ✅ Automatic reload saat ada perubahan file

### Production Build

```bash
npm run build
```

Proses ini akan:

- ✅ Compile TypeScript ke JavaScript
- ✅ Bundle aplikasi dengan Vite
- ✅ Generate distributable di folder `out/`
- ✅ Optimasi untuk production

### Preview Production Build

```bash
npm start
```

Menjalankan versi production yang sudah di-built untuk testing.

## 🔧 Konfigurasi Environment

### Environment Variables

Aplikasi mendukung konfigurasi melalui environment variables. Buat file `.env` di root project jika diperlukan:

```bash
# .env (contoh)
NODE_ENV=development
ELECTRON_DEBUG=false
DATABASE_PATH=/custom/path/to/db
```

### Database Configuration

Database SQLite disimpan di lokasi berikut tergantung sistem operasi:

| OS      | Path                                                       |
| ------- | ---------------------------------------------------------- |
| Windows | `%APPDATA%/mahasiswa-app/mahasiswa.db`                     |
| macOS   | `~/Library/Application Support/mahasiswa-app/mahasiswa.db` |
| Linux   | `~/.config/mahasiswa-app/mahasiswa.db`                     |

Jika ingin mengubah lokasi database, buat file `.env` dengan:

```
DATABASE_PATH=/path/to/custom/location
```

## 📝 Data Model

### Interface: Mahasiswa

```typescript
export interface Mahasiswa {
  id?: number; // Auto-generated oleh database
  nim: string; // Nomor Induk Mahasiswa (unique)
  nama: string; // Nama lengkap mahasiswa
  jurusan: string; // Program studi/jurusan
  angkatan: number; // Tahun masuk (contoh: 2023)
  ipk: number; // Index Prestasi Kumulatif (0.0 - 4.0)
}
```

### Contoh Data

```typescript
const mahasiswa: Mahasiswa = {
  id: 1,
  nim: '2023001',
  nama: 'Budi Santoso',
  jurusan: 'Teknik Informatika',
  angkatan: 2023,
  ipk: 3.85,
};
```

## 🔌 IPC Communication (Main ↔ Renderer)

Komunikasi antara Main Process dan Renderer Process menggunakan IPC (Inter-Process Communication) dengan Electron's `ipcRenderer.invoke()` dan `ipcMain.handle()`.

### Architecture

```
┌─────────────────────────────────┐
│   Renderer Process (UI)         │
│  - HTML/CSS/JavaScript          │
│  - window.electron.ipcRenderer  │
└─────────────┬───────────────────┘
              │ IPC invoke()
              ↓
┌─────────────────────────────────┐
│   Main Process                  │
│  - ipcMain.handle()             │
│  - Business Logic               │
└─────────────┬───────────────────┘
              │
              ↓
┌─────────────────────────────────┐
│   MahasiswaRepository           │
│  - Database Operations          │
└─────────────────────────────────┘
```

### Available Handlers

| Handler            | Parameter                                | Return                   | Keterangan                 |
| ------------------ | ---------------------------------------- | ------------------------ | -------------------------- |
| `mahasiswa:getAll` | -                                        | `Mahasiswa[]`            | Ambil semua data mahasiswa |
| `mahasiswa:insert` | `Omit<Mahasiswa, 'id'>`                  | `Mahasiswa`              | Tambah mahasiswa baru      |
| `mahasiswa:update` | `(id: number, data: Partial<Mahasiswa>)` | `Mahasiswa \| undefined` | Update data mahasiswa      |
| `mahasiswa:delete` | `id: number`                             | `boolean`                | Hapus mahasiswa            |

### Contoh Penggunaan di Renderer

#### Get All Data

```javascript
try {
  const allMahasiswa = await window.electron.ipcRenderer.invoke('mahasiswa:getAll');
  console.log('Data mahasiswa:', allMahasiswa);
} catch (error) {
  console.error('Error fetching data:', error.message);
}
```

#### Insert Data Baru

```javascript
try {
  const newMahasiswa = await window.electron.ipcRenderer.invoke('mahasiswa:insert', {
    nim: '12345678',
    nama: 'Budi Santoso',
    jurusan: 'Teknik Informatika',
    angkatan: 2023,
    ipk: 3.85,
  });
  console.log('Data berhasil ditambahkan:', newMahasiswa);
} catch (error) {
  console.error('Error inserting data:', error.message);
  // Handle error - misal NIM sudah exist
}
```

#### Update Data

```javascript
try {
  const updated = await window.electron.ipcRenderer.invoke('mahasiswa:update', 1, {
    nama: 'Budi Santoso Updated',
    jurusan: 'Teknik Informatika Terapan',
    ipk: 3.92,
  });
  console.log('Data berhasil diupdate:', updated);
} catch (error) {
  console.error('Error updating data:', error.message);
}
```

#### Delete Data

```javascript
try {
  const success = await window.electron.ipcRenderer.invoke('mahasiswa:delete', 1);
  if (success) {
    console.log('Data berhasil dihapus');
  }
} catch (error) {
  console.error('Error deleting data:', error.message);
}
```

### Error Handling

Semua IPC handlers mengimplementasikan error handling yang proper:

```javascript
// Contoh error handling di renderer
async function deleteMahasiswa(id) {
  try {
    const result = await window.electron.ipcRenderer.invoke('mahasiswa:delete', id);
    if (result) {
      // Success
      showNotification('Data berhasil dihapus');
    } else {
      // Not found
      showError('Data tidak ditemukan');
    }
  } catch (error) {
    // IPC error
    showError(`Gagal menghapus data: ${error.message}`);
  }
}
```

### Performance Tips

1. **Batch operations** - Jika butuh multiple operations, consider implement batch handler
2. **Caching** - Cache data di renderer untuk reduce IPC calls
3. **Pagination** - Untuk large datasets, implement pagination di backend

## 🏗️ Arsitektur

### Architecture Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                  Electron Application                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────┐         ┌──────────────────────────┐  │
│  │ RENDERER LAYER  │         │   MAIN LAYER            │  │
│  │   (Frontend)    │         │   (Backend)             │  │
│  ├─────────────────┤         ├──────────────────────────┤  │
│  │                 │         │                          │  │
│  │ • index.html    │◄────────┤ • IPC Handlers          │  │
│  │ • renderer.js   │  IPC    │ • Window Management     │  │
│  │ • CSS Styles    │Invoke   │ • preload.ts            │  │
│  │                 │         │                          │  │
│  └─────────────────┘         ├──────────────────────────┤  │
│                              │   REPOSITORY LAYER      │  │
│                              ├──────────────────────────┤  │
│                              │                          │  │
│                              │ • Repository.ts          │  │
│                              │ • MahasiswaRepository.ts │  │
│                              │ • Database.ts            │  │
│                              │ • Models (interfaces)    │  │
│                              │                          │  │
│                              └──────────────────────────┘  │
│                                       │                    │
│                                       ▼                    │
│                              ┌──────────────────────┐      │
│                              │  SQLite3 Database    │      │
│                              │   mahasiswa.db       │      │
│                              └──────────────────────┘      │
│                                                            │
└──────────────────────────────────────────────────────────────┘
```

### Pattern yang Digunakan

1. **Singleton Pattern**
   - Database instance hanya dibuat sekali di application startup
   - Ensures single database connection
   - File: `src/main/db/Database.ts`

   ```typescript
   export class Database {
     private static instance: Database;

     private constructor() {}

     static getInstance(): Database {
       if (!Database.instance) {
         Database.instance = new Database();
       }
       return Database.instance;
     }
   }
   ```

2. **Repository Pattern**
   - Data access logic terpisah dari business logic
   - Abstraction layer untuk database operations
   - Facilitates testing dan maintenance
   - Files:
     - `src/main/db/Repository.ts` - Base class
     - `src/main/db/MahasiswaRepository.ts` - CRUD implementation

   ```typescript
   abstract class Repository<T> {
     abstract getAll(): T[];
     abstract insert(data: Omit<T, 'id'>): T;
     abstract update(id: number, data: Partial<T>): T | undefined;
     abstract delete(id: number): boolean;
   }
   ```

3. **Electron IPC Pattern**
   - Secure communication antara main dan renderer process
   - Using `ipcRenderer.invoke()` dan `ipcMain.handle()`
   - Async handlers dengan error handling

   ```typescript
   // Main process
   ipcMain.handle('mahasiswa:getAll', () => {
     return mahasiswaRepository.getAll();
   });

   // Renderer process
   const data = await window.electron.ipcRenderer.invoke('mahasiswa:getAll');
   ```

4. **Layered Architecture**
   - **Presentation Layer** - HTML/CSS/JavaScript (Renderer)
   - **Communication Layer** - IPC & Preload Scripts
   - **Business Logic Layer** - Main Process Handlers
   - **Data Access Layer** - Repository Pattern
   - **Data Storage Layer** - SQLite3 Database

### Data Flow

```
User Action (Click button, Submit form)
    ↓
Renderer Event Handler (renderer.js)
    ↓
IPC Invoke → Main Process Handler (index.ts)
    ↓
Repository Method Call (MahasiswaRepository)
    ↓
Database Query (SQLite3)
    ↓
Result back through same path
    ↓
Update UI (renderer.js)
```

### Technology Stack Details

| Layer             | Technology     | Reason                              |
| ----------------- | -------------- | ----------------------------------- |
| Desktop Framework | Electron       | Cross-platform desktop apps         |
| Language          | TypeScript     | Type safety & better DX             |
| Build Tool        | Electron Vite  | Fast dev server & optimized builds  |
| Database          | SQLite3        | Lightweight, local, no setup needed |
| Database Driver   | better-sqlite3 | Synchronous, high performance       |
| Styling           | Vanilla CSS    | Simplicity, no dependencies         |
| Package Manager   | npm            | Standard Node.js package manager    |

## 🗂️ Penjelasan Folder Utama

### `src/main/`

Berisi logika backend aplikasi Electron:

- **index.ts** - Entry point, setup window, dan IPC handlers
- **db/Database.ts** - Singleton untuk database connection
- **db/Repository.ts** - Base class untuk repository pattern
- **db/MahasiswaRepository.ts** - CRUD operations untuk mahasiswa
- **models/Mahasiswa.ts** - TypeScript interface untuk data model

### `src/renderer/`

Berisi user interface:

- **index.html** - HTML template dengan form dan tabel
- **renderer.js** - Frontend logic untuk interaksi dengan IPC

### `src/preload/`

Security bridge antara main dan renderer process (context isolation).

## 📦 Perintah NPM

```bash
npm run dev       # Jalankan development server dengan hot-reload
npm run build     # Build aplikasi untuk production
npm start         # Preview production build
npm run rebuild   # Rebuild native modules (better-sqlite3)
```

## � Development

### Project Structure untuk Development

```
src/
├── main/                    # Main Process (Backend)
│   ├── index.ts            # IPC handlers & main logic
│   ├── db/
│   │   ├── Database.ts     # Database singleton & initialization
│   │   ├── Repository.ts   # Base repository class
│   │   └── MahasiswaRepository.ts  # CRUD implementations
│   └── models/
│       └── Mahasiswa.ts    # Type definitions
├── preload/                # Preload script
│   └── index.ts           # IPC expose untuk renderer
└── renderer/              # Renderer Process (Frontend)
    ├── index.html         # Main HTML
    └── renderer.js        # Frontend logic
```

### Workflow Development

1. **Start development server**

   ```bash
   npm run dev
   ```

2. **Open DevTools**
   - Windows/Linux: `Ctrl + Shift + I`
   - macOS: `Cmd + Option + I`

3. **Make changes**
   - Modifikasi file TypeScript/JavaScript
   - HMR akan auto-reload

4. **Check console untuk errors**
   - DevTools Console untuk renderer errors
   - Terminal untuk main process errors

### Best Practices untuk Development

- ✅ Gunakan TypeScript untuk type safety
- ✅ Ikuti naming convention (camelCase untuk variabel, PascalCase untuk class)
- ✅ Pisahkan business logic dari UI logic
- ✅ Gunakan async/await untuk IPC communication
- ✅ Validate input sebelum database operations
- ✅ Handle errors dengan proper error messages

## 🏗️ Building & Deployment

### Build untuk Development

```bash
npm run build
```

Output files akan tersimpan di `out/` folder.

### Build Configuration

File konfigurasi tersimpan di `electron.vite.config.ts`:

- Production optimization settings
- Asset handling configuration
- Output directory configuration

### Distributing Aplikasi

Untuk membuat installer (.exe untuk Windows, .dmg untuk macOS, etc), gunakan electron-builder atau cairosvg:

```bash
# Pastikan electron-builder sudah terinstall
npm install -D electron-builder

# Build executable
electron-builder --publish never
```

### Platform-Specific Building

**Windows:**

```bash
npm run build
npm run build:win
```

**macOS:**

```bash
npm run build:mac
```

**Linux:**

```bash
npm run build:linux
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] **CRUD Operations**
  - [ ] Create: Tambah data mahasiswa baru
  - [ ] Read: Display semua data dengan benar
  - [ ] Update: Edit data mahasiswa
  - [ ] Delete: Hapus data mahasiswa

- [ ] **Data Validation**
  - [ ] NIM harus unique
  - [ ] Semua required fields tidak boleh kosong
  - [ ] Angkatan harus valid (number)
  - [ ] IPK harus valid range (0.0 - 4.0)

- [ ] **Database**
  - [ ] Database file created correctly
  - [ ] Data persist setelah aplikasi ditutup
  - [ ] Database recovery dari corruption

- [ ] **UI/UX**
  - [ ] Form submit bekerja dengan baik
  - [ ] Error messages ditampilkan dengan benar
  - [ ] Table updates otomatis setelah CRUD

- [ ] **Performance**
  - [ ] Loading data tidak lambat
  - [ ] UI responsive dengan banyak data

### Automated Testing (Future)

Untuk menambah automated testing, pertimbangkan:

- Jest untuk unit tests
- Spectron untuk integration tests
- Cypress untuk E2E tests

## 🎯 Code Standards

### TypeScript Configuration

Menggunakan strict mode untuk type safety:

```json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Code Style Guidelines

1. **Naming Convention**

   ```typescript
   // Classes: PascalCase
   class MahasiswaRepository {}

   // Functions & variables: camelCase
   const getMahasiswa = () => {};

   // Constants: UPPER_SNAKE_CASE
   const MAX_RETRIES = 3;

   // Interfaces: PascalCase with I prefix (optional)
   interface IMahasiswa {}
   ```

2. **File Organization**
   - Satu class/interface per file
   - Reusable code di utils/helpers
   - Related files di folder yang sama

3. **Comments & Documentation**

   ```typescript
   /**
    * Menambahkan mahasiswa baru ke database
    * @param data - Data mahasiswa tanpa ID
    * @returns Data mahasiswa yang telah disimpan
    * @throws Error jika NIM sudah exist
    */
   async insertMahasiswa(data: Omit<Mahasiswa, 'id'>): Promise<Mahasiswa>
   ```

4. **Error Handling**
   ```typescript
   try {
     // operation
   } catch (error) {
     const message = error instanceof Error ? error.message : 'Unknown error';
     console.error('Operation failed:', message);
   }
   ```

## 🔒 Security

### Security Features

- ✅ **Context Isolation** - Renderer process terisolasi dari main process
- ✅ **Preload Script** - Secure bridge untuk IPC communication (no direct access)
- ✅ **Sandbox Mode** - Renderer process berjalan di sandbox environment
- ✅ **Database Validation** - SQLite3 dengan prepared statements (SQL Injection prevention)
- ✅ **Input Validation** - Semua user input divalidasi sebelum processing

### Security Best Practices

1. **IPC Communication**
   - Jangan expose sensitive data
   - Validate semua parameters dari renderer
   - Use async handlers dengan proper error handling

2. **Database**
   - Gunakan prepared statements (already implemented)
   - Validate input data types
   - Use transactions untuk critical operations

3. **File System Access**
   - Restrict akses ke specific directories
   - Validate file paths sebelum access

## 🐛 Troubleshooting

### Error: Module not found 'better-sqlite3'

Rebuild native modules:

```bash
npm run rebuild
```

Atau jika masih tidak bekerja:

```bash
npm install --save-optional better-sqlite3
npm run rebuild
```

### Dev tools tidak terbuka

Pastikan development build sedang berjalan dengan `npm run dev`, bukan `npm start`.

Coba tekan shortcut:

- **Windows/Linux**: `Ctrl + Shift + I`
- **macOS**: `Cmd + Option + I`

### Database file tidak ditemukan

Database file akan otomatis dibuat di:

| OS      | Default Path                                               |
| ------- | ---------------------------------------------------------- |
| Windows | `%APPDATA%/mahasiswa-app/mahasiswa.db`                     |
| macOS   | `~/Library/Application Support/mahasiswa-app/mahasiswa.db` |
| Linux   | `~/.config/mahasiswa-app/mahasiswa.db`                     |

Untuk manual testing, bisa ubah database path via environment variable:

```bash
DATABASE_PATH=/tmp/test.db npm run dev
```

### Hot reload tidak bekerja

1. Pastikan hanya 1 instance aplikasi yang running
2. Check apakah file watcher limit tidak tercapai (Linux):
   ```bash
   cat /proc/sys/fs/inotify/max_user_watches
   # Jika terlalu rendah, tingkatkan dengan:
   # echo 524288 | sudo tee /proc/sys/fs/inotify/max_user_watches
   ```

### Performance Issues

Jika aplikasi lambat:

1. Check database file size (gunakan vacuum jika perlu)
2. Monitor Node process memory usage
3. Check apakah ada infinite loops di IPC handlers

## 📋 Known Issues

### Current Limitations

- ❌ Tidak support multiple database files
- ❌ Belum ada export/import data functionality
- ❌ Belum ada backup automation
- ❌ Belum ada search/filter feature
- ❌ Belum ada validasi IPK range (0.0 - 4.0)
- ❌ UI belum responsive untuk mobile (desktop only)

### Workarounds

| Issue              | Workaround                                |
| ------------------ | ----------------------------------------- |
| NIM sudah exist    | Clear database dan start fresh            |
| Database corrupted | Delete `mahasiswa.db` dan restart app     |
| Build gagal        | `npm run rebuild` dan `npm install` ulang |

## 🚀 Roadmap

### Phase 1 (Current - v1.0.0)

- ✅ Basic CRUD operations
- ✅ SQLite database integration
- ✅ Electron UI implementation

### Phase 2 (v1.1.0)

- 🔲 Search dan filter features
- 🔲 Data export to CSV/Excel
- 🔲 Sorting capabilities
- 🔲 Pagination untuk large datasets

### Phase 3 (v1.2.0)

- 🔲 Import data dari file
- 🔲 Backup dan restore functionality
- 🔲 Advanced reporting
- 🔲 User authentication

### Phase 4 (Future)

- 🔲 Multi-user support
- 🔲 Cloud sync
- 🔲 Mobile app version
- 🔲 REST API

## 🤝 Contributing

Kontribusi sangat diterima! Berikut cara untuk berkontribusi:

### Langkah-Langkah Berkontribusi

1. **Fork Repository**

   ```bash
   # Klik fork button di GitHub
   ```

2. **Clone Fork Anda**

   ```bash
   git clone https://github.com/YOUR_USERNAME/mahasiswa-app.git
   cd mahasiswa-app
   ```

3. **Create Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Changes**
   - Ikuti code standards
   - Test perubahan secara manual
   - Add comments untuk complex logic

5. **Commit Changes**

   ```bash
   git add .
   git commit -m "feat: deskripsi singkat perubahan"
   ```

   Format commit:
   - `feat:` - untuk feature baru
   - `fix:` - untuk bug fixes
   - `refactor:` - untuk code improvements
   - `docs:` - untuk dokumentasi
   - `test:` - untuk testing

6. **Push ke Fork**

   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create Pull Request**
   - Di GitHub, click "Compare & pull request"
   - Jelaskan perubahan dengan detail
   - Reference related issues

### Code Review Process

- Minimal 1 approval sebelum merge
- CI checks harus pass
- Code style harus sesuai guidelines

## 📚 Referensi

- [Electron Documentation](https://www.electronjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [better-sqlite3 API](https://github.com/WiseLibs/better-sqlite3/wiki)
- [Vite Documentation](https://vitejs.dev/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)

## 👨‍💻 Authors

- **Your Name** - Initial work and project creator
  - GitHub: [@yourusername](https://github.com/yourusername)
  - Email: your.email@example.com

## 📄 License

Project ini dibuat untuk keperluan pembelajaran **Pemrograman Berbasis Objek (Semester 4)** dan dirilis di bawah lisensi **MIT**.

```
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
...
```

Untuk detail lengkap, lihat file [LICENSE](LICENSE).

## 🙏 Acknowledgments

- Terima kasih kepada komunitas Electron
- Thanks to better-sqlite3 contributors
- Inspirasi dari best practices Electron apps

---

### Quick Links

- 📋 [Issues](https://github.com/yourusername/mahasiswa-app/issues)
- 🔀 [Pull Requests](https://github.com/yourusername/mahasiswa-app/pulls)
- 💬 [Discussions](https://github.com/yourusername/mahasiswa-app/discussions)

**Last Updated**: Juni 2026
**Version**: 1.0.0
**Status**: ✅ Active Development
