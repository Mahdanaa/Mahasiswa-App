"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("api", {
  getAll: () => electron.ipcRenderer.invoke("mahasiswa:getAll"),
  insert: (data) => electron.ipcRenderer.invoke("mahasiswa:insert", data),
  update: (id, data) => electron.ipcRenderer.invoke("mahasiswa:update", id, data),
  delete: (id) => electron.ipcRenderer.invoke("mahasiswa:delete", id)
});
