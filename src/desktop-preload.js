const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('czatboxDesktop', {
  synthesizeMrDrwina: text => ipcRenderer.invoke('desktop:synthesize-mr-drwina', String(text || '')),
  warmMrDrwina: () => ipcRenderer.invoke('desktop:warm-mr-drwina'),
  setMinimizeToTray: enabled => ipcRenderer.invoke('desktop:set-minimize-to-tray', Boolean(enabled)),
  onWidgetData: callback => ipcRenderer.on('desktop:widget-data', (_event, data) => callback(data)),
  controlRadio: action => ipcRenderer.send('desktop:radio-control', String(action || '')),
  refreshDesktopWidget: () => ipcRenderer.send('desktop:widget-refresh'),
  syncDesktopWidget: data => ipcRenderer.send('desktop:widget-sync', data),
  openNote: id => ipcRenderer.send('desktop:open-note', String(id || ''))
});
