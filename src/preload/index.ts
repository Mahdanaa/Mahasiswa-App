import { contextBridge, ipcRenderer } from 'electron';
import type { Mahasiswa } from '../main/models/Mahasiswa';
contextBridge.exposeInMainWorld('api', {
  getAll: (): Promise<Mahasiswa[]> => ipcRenderer.invoke('mahasiswa:getAll'),
  insert: (data: Omit<Mahasiswa, 'id'>): Promise<Mahasiswa> => ipcRenderer.invoke('mahasiswa:insert', data),
  update: (id: number, data: Partial<Mahasiswa>): Promise<Mahasiswa> =>
    ipcRenderer.invoke('mahasiswa:update', id, data),
  delete: (id: number): Promise<boolean> => ipcRenderer.invoke('mahasiswa:delete', id),
});
