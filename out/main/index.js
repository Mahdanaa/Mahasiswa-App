"use strict";
const electron = require("electron");
const path = require("path");
const BetterSqlite3 = require("better-sqlite3");
class Database {
  static instance;
  static getInstance() {
    if (!Database.instance) {
      const dbPath = path.join(electron.app.getPath("userData"), "mahasiswa.db");
      Database.instance = new BetterSqlite3(dbPath);
      Database.instance.pragma("journal_mode = WAL");
      Database.migrate(Database.instance);
    }
    return Database.instance;
  }
  static migrate(db) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS mahasiswa (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nim TEXT NOT NULL UNIQUE,
        nama TEXT NOT NULL,
        jurusan TEXT NOT NULL,
        angkatan INTEGER NOT NULL,
        ipk REAL NOT NULL DEFAULT 0
      )
    `);
    try {
      db.exec(`ALTER TABLE mahasiswa ADD COLUMN ipk REAL NOT NULL DEFAULT 0`);
    } catch {
    }
  }
}
class Repository {
  db;
  table;
  constructor(db, table) {
    this.db = db;
    this.table = table;
  }
  findAll() {
    return this.db.prepare(`SELECT * FROM ${this.table}`).all();
  }
  findById(id) {
    return this.db.prepare(`SELECT * FROM ${this.table} WHERE id = ?`).get(id);
  }
  delete(id) {
    const result = this.db.prepare(`DELETE FROM ${this.table} WHERE id = ?`).run(id);
    return result.changes > 0;
  }
}
class MahasiswaRepository extends Repository {
  constructor(db) {
    super(db, "mahasiswa");
  }
  insert(data) {
    const stmt = this.db.prepare(`
    INSERT INTO mahasiswa (nim, nama, jurusan, angkatan, ipk)
    VALUES (@nim, @nama, @jurusan, @angkatan, @ipk)
  `);
    const result = stmt.run(data);
    return { id: Number(result.lastInsertRowid), ...data };
  }
  update(id, data) {
    const existing = this.findById(id);
    if (!existing) return void 0;
    const updated = { ...existing, ...data };
    this.db.prepare(
      `
    UPDATE mahasiswa
    SET nim = @nim, nama = @nama, jurusan = @jurusan, angkatan = @angkatan, ipk = @ipk
    WHERE id = @id
  `
    ).run(updated);
    return updated;
  }
  findByNim(nim) {
    return this.db.prepare(`SELECT * FROM mahasiswa WHERE nim = ?`).get(nim);
  }
  findByJurusan(jurusan) {
    return this.db.prepare(`SELECT * FROM mahasiswa WHERE jurusan = ?`).all(jurusan);
  }
}
let repo;
function createWindow() {
  const win = new electron.BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      sandbox: false
    }
  });
  win.loadFile(path.join(__dirname, "../renderer/index.html"));
  if (!electron.app.isPackaged) {
    win.webContents.openDevTools();
  }
}
electron.app.whenReady().then(() => {
  const db = Database.getInstance();
  repo = new MahasiswaRepository(db);
  createWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") electron.app.quit();
});
electron.ipcMain.handle("mahasiswa:getAll", () => repo.findAll());
electron.ipcMain.handle("mahasiswa:insert", (_, data) => repo.insert(data));
electron.ipcMain.handle("mahasiswa:update", (_, id, data) => repo.update(id, data));
electron.ipcMain.handle("mahasiswa:delete", (_, id) => repo.delete(id));
