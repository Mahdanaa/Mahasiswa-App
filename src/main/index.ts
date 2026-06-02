import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { Database } from './db/Database';
import { MahasiswaRepository } from './db/MahasiswaRepository';
import { DosenRepository } from './db/DosenRepository';
let repo: MahasiswaRepository;
let repoDosen: DosenRepository;
function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      sandbox: false,
    },
  });
  win.loadFile(path.join(__dirname, '../renderer/index.html'));
  if (!app.isPackaged) {
    win.webContents.openDevTools();
  }
}
app.whenReady().then(() => {
  const db = Database.getInstance();
  repo = new MahasiswaRepository(db);
  repoDosen = new DosenRepository(db);
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
ipcMain.handle('mahasiswa:getAll', () => repo.findAll());
ipcMain.handle('mahasiswa:insert', (_, data) => repo.insert(data));
ipcMain.handle('mahasiswa:update', (_, id, data) => repo.update(id, data));
ipcMain.handle('mahasiswa:delete', (_, id) => repo.delete(id));
ipcMain.handle('mahasiswa:search', (_, keyword) => repo.search(keyword));
ipcMain.handle('dosen:getAll', () => repoDosen.findAll());
ipcMain.handle('dosen:insert', (_, data) => repoDosen.insert(data));
ipcMain.handle('dosen:update', (_, id, data) => repoDosen.update(id, data));
ipcMain.handle('dosen:delete', (_, id) => repoDosen.delete(id));
