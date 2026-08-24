const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('czatboxDesktop', {
  synthesizeMrDrwina: text => ipcRenderer.invoke('desktop:synthesize-mr-drwina', String(text || '')),
  warmMrDrwina: () => ipcRenderer.invoke('desktop:warm-mr-drwina'),
  setMinimizeToTray: enabled => ipcRenderer.invoke('desktop:set-minimize-to-tray', Boolean(enabled))
});
