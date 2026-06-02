# 📚 Mahasiswa-App

Aplikasi desktop untuk **manajemen data mahasiswa** yang dibangun dengan **Electron**, **TypeScript**, dan **SQLite3**. Aplikasi ini menyediakan fitur lengkap untuk mengelola informasi mahasiswa termasuk CRUD (Create, Read, Update, Delete) operations.

## ✨ Fitur Utama

- ✅ **Tambah Data Mahasiswa** - Menambahkan data mahasiswa baru
- ✅ **Lihat Semua Data** - Menampilkan daftar seluruh mahasiswa dalam tabel
- ✅ **Edit Data Mahasiswa** - Mengubah informasi mahasiswa yang sudah ada
- ✅ **Hapus Data Mahasiswa** - Menghapus data mahasiswa dari database
- ✅ **Database Lokal** - Menggunakan SQLite3 untuk penyimpanan data yang persisten
- ✅ **Interface yang User-Friendly** - UI sederhana dan intuitif

## 🛠️ Tech Stack

| Teknologi          | Versi    | Kegunaan                                       |
| ------------------ | -------- | ---------------------------------------------- |
| **Electron**       | ^33.4.11 | Framework untuk desktop application            |
| **TypeScript**     | ^6.0.3   | Bahasa pemrograman dengan type safety          |
| **Electron Vite**  | ^5.0.0   | Build tool & dev server untuk Electron         |
| **better-sqlite3** | ^12.10.0 | SQLite3 database driver dengan performa tinggi |
| **Node.js**        | -        | Runtime environment                            |

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
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nim TEXT NOT NULL UNIQUE,           -- Nomor Induk Mahasiswa
  nama TEXT NOT NULL,                 -- Nama mahasiswa
  jurusan TEXT NOT NULL,              -- Program studi/jurusan
  angkatan INTEGER NOT NULL           -- Tahun masuk
)
```

## 🚀 Cara Memulai

### Prerequisites

Pastikan sudah terinstall:

- **Node.js** >= 16.x
- **npm** atau **yarn**

### 1. Instalasi Dependencies

```bash
npm install
```

Catatan: Paket `better-sqlite3` akan di-rebuild otomatis melalui `postinstall` script.

### 2. Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan terbuka di Electron window dengan hot-reload enabled.

### 3. Build untuk Production

```bash
npm run build
```

Output akan tersimpan di folder `out/`.

### 4. Preview Build

```bash
npm start
```

Menjalankan versi production yang sudah di-build.

## 📝 Data Model

### Interface: Mahasiswa

```typescript
export interface Mahasiswa {
  id?: number; // Auto-generated oleh database
  nim: string; // Nomor Induk Mahasiswa (unique)
  nama: string; // Nama lengkap
  jurusan: string; // Program studi
  angkatan: number; // Tahun masuk (contoh: 2023)
}
```

## 🔌 IPC Communication (Main ↔ Renderer)

Komunikasi antara Main Process dan Renderer Process menggunakan IPC (Inter-Process Communication):

### Available Handlers

| Handler            | Parameter                                | Return                   | Keterangan                 |
| ------------------ | ---------------------------------------- | ------------------------ | -------------------------- |
| `mahasiswa:getAll` | -                                        | `Mahasiswa[]`            | Ambil semua data mahasiswa |
| `mahasiswa:insert` | `Omit<Mahasiswa, 'id'>`                  | `Mahasiswa`              | Tambah mahasiswa baru      |
| `mahasiswa:update` | `(id: number, data: Partial<Mahasiswa>)` | `Mahasiswa \| undefined` | Update data mahasiswa      |
| `mahasiswa:delete` | `id: number`                             | `boolean`                | Hapus mahasiswa            |

### Contoh Penggunaan di Renderer

```javascript
// Ambil semua data
const allMahasiswa = await window.electron.ipcRenderer.invoke('mahasiswa:getAll');

// Tambah data baru
const newMahasiswa = await window.electron.ipcRenderer.invoke('mahasiswa:insert', {
  nim: '12345678',
  nama: 'Budi Santoso',
  jurusan: 'Teknik Informatika',
  angkatan: 2023,
});

// Update data
const updated = await window.electron.ipcRenderer.invoke('mahasiswa:update', 1, {
  nama: 'Budi Santoso Updated',
});

// Hapus data
await window.electron.ipcRenderer.invoke('mahasiswa:delete', 1);
```

## 🏗️ Arsitektur

### Pattern yang Digunakan

1. **Singleton Pattern** - Database instance hanya dibuat sekali
2. **Repository Pattern** - Data access logic terpisah di layer repository
3. **Electron IPC** - Komunikasi secure antara main dan renderer process

### Flow Aplikasi

```
User Interface (HTML/CSS/JS)
         ↓
   IPC Communication
         ↓
   Main Process (index.ts)
         ↓
   MahasiswaRepository
         ↓
   Database (SQLite3)
```

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

## 🔒 Security

- ✅ **Context Isolation** - Renderer process terisolasi dari main process
- ✅ **Preload Script** - Secure bridge untuk IPC communication
- ✅ **Sandbox Mode** - Renderer process berjalan di sandbox
- ✅ **Database Validation** - SQLite3 dengan prepared statements

## 🐛 Troubleshooting

### Error: Module not found 'better-sqlite3'

```bash
npm run rebuild
```

### Dev tools tidak terbuka

Pastikan development build sedang berjalan dengan `npm run dev`, bukan `npm start`.

### Database file tidak ditemukan

Database file akan otomatis dibuat di:

- **Windows**: `%APPDATA%/mahasiswa-app/mahasiswa.db`
- **macOS**: `~/Library/Application Support/mahasiswa-app/mahasiswa.db`
- **Linux**: `~/.config/mahasiswa-app/mahasiswa.db`

## 📚 Referensi

- [Electron Documentation](https://www.electronjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [better-sqlite3 API](https://github.com/WiseLibs/better-sqlite3/wiki)
- [Vite Documentation](https://vitejs.dev/)

## 👨‍💻 Development Notes

- Project menggunakan **TypeScript** untuk type safety
- Database menggunakan **WAL mode** (Write-Ahead Logging) untuk performa optimal
- IPC communication menggunakan `invoke` (async) untuk komunikasi yang lebih aman
- UI menggunakan vanilla CSS untuk kesederhanaan

## 📄 License

Project ini dibuat untuk keperluan pembelajaran **Pemrograman Berbasis Objek (Semester 4)**.

---

**Last Updated**: Juni 2026
