import { contextBridge, ipcRenderer } from 'electron';
import type { Mahasiswa } from '../main/models/Mahasiswa';
import type { Dosen } from '../main/models/Dosen';
contextBridge.exposeInMainWorld('api', {
  getAll: (): Promise<Mahasiswa[]> => ipcRenderer.invoke('mahasiswa:getAll'),
  insert: (data: Omit<Mahasiswa, 'id'>): Promise<Mahasiswa> => ipcRenderer.invoke('mahasiswa:insert', data),
  update: (id: number, data: Partial<Mahasiswa>): Promise<Mahasiswa> =>
    ipcRenderer.invoke('mahasiswa:update', id, data),
  delete: (id: number): Promise<boolean> => ipcRenderer.invoke('mahasiswa:delete', id),
  search: (keyword: string): Promise<Mahasiswa[]> => ipcRenderer.invoke('mahasiswa:search', keyword),

  dosen: {
    getAll: (): Promise<Dosen[]> => ipcRenderer.invoke('dosen:getAll'),
    insert: (data: Omit<Dosen, 'id'>): Promise<Dosen> => ipcRenderer.invoke('dosen:insert', data),
    update: (id: number, data: Partial<Dosen>): Promise<Dosen> => ipcRenderer.invoke('dosen:update', id, data),
    delete: (id: number): Promise<boolean> => ipcRenderer.invoke('dosen:delete', id),
  },
});
