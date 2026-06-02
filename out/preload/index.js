"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("api", {
  getAll: () => electron.ipcRenderer.invoke("mahasiswa:getAll"),
  insert: (data) => electron.ipcRenderer.invoke("mahasiswa:insert", data),
  update: (id, data) => electron.ipcRenderer.invoke("mahasiswa:update", id, data),
  delete: (id) => electron.ipcRenderer.invoke("mahasiswa:delete", id),
  search: (keyword) => electron.ipcRenderer.invoke("mahasiswa:search", keyword),
  dosen: {
    getAll: () => electron.ipcRenderer.invoke("dosen:getAll"),
    insert: (data) => electron.ipcRenderer.invoke("dosen:insert", data),
    update: (id, data) => electron.ipcRenderer.invoke("dosen:update", id, data),
    delete: (id) => electron.ipcRenderer.invoke("dosen:delete", id)
  }
});
