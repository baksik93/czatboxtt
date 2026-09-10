const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('czatboxDesktop', {
  connectLive: (id, username) => ipcRenderer.send('desktop:live-connect', String(id), String(username)),
  disconnectLive: id => ipcRenderer.send('desktop:live-disconnect', String(id)),
  onLive: callback => {
    const listener = (_event, packet) => callback(packet);
    ipcRenderer.on('desktop:live-event', listener);
    return () => ipcRenderer.removeListener('desktop:live-event', listener);
  },
  synthesizePiper: (voice, text) => ipcRenderer.invoke('desktop:synthesize-piper', String(voice || ''), String(text || '')),
  warmPiper: voice => ipcRenderer.invoke('desktop:warm-piper', String(voice || '')),
  setMinimizeToTray: enabled => ipcRenderer.invoke('desktop:set-minimize-to-tray', Boolean(enabled)),
  onWidgetData: callback => ipcRenderer.on('desktop:widget-data', (_event, data) => callback(data)),
  openWorkspace: name => ipcRenderer.send('desktop:open-workspace', String(name || '')),
  openControlPanel: () => ipcRenderer.send('desktop:open-control-panel'),
  openDrive: drive => ipcRenderer.send('desktop:open-drive', String(drive || ''))
});
