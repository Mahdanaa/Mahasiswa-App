import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { Database } from './db/Database';
import { MahasiswaRepository } from './db/MahasiswaRepository';
let repo: MahasiswaRepository;
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
