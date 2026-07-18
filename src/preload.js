const { contextBridge, ipcRenderer } = require('electron');

const api = {
  startLive: () => ipcRenderer.invoke('shell:start-live'),
  showLogin: () => ipcRenderer.invoke('shell:show-login'),
  reload: () => ipcRenderer.invoke('shell:reload'),
  refreshChat: () => ipcRenderer.invoke('shell:refresh-chat'),
  clearSession: () => ipcRenderer.invoke('shell:clear-session'),
  setCreator: (creatorId) => ipcRenderer.invoke('shell:set-creator', creatorId),
  openDevTools: (target) => ipcRenderer.invoke('shell:open-devtools', target),
  openInBrowser: () => ipcRenderer.invoke('shell:open-in-browser'),
  openExternalUrl: (url) => ipcRenderer.invoke('shell:open-external-url', url),
  listArchives: () => ipcRenderer.invoke('shell:list-archives'),
  getArchiveContent: (archiveId) => ipcRenderer.invoke('shell:get-archive-content', archiveId),
  exportArchive: (archiveId) => ipcRenderer.invoke('shell:export-archive', archiveId),
  deleteArchive: (archiveId) => ipcRenderer.invoke('shell:delete-archive', archiveId),
  listNotes: () => ipcRenderer.invoke('shell:list-notes'),
  getNote: (noteId) => ipcRenderer.invoke('shell:get-note', noteId),
  saveNote: (note) => ipcRenderer.invoke('shell:save-note', note),
  deleteNote: (noteId) => ipcRenderer.invoke('shell:delete-note', noteId),
  getCzesterAiStatus: () => ipcRenderer.invoke('shell:get-czester-ai-status'),
  installCzesterAiPack: () => ipcRenderer.invoke('shell:install-czester-ai-pack'),
  openArchiveFolder: () => ipcRenderer.invoke('shell:open-archive-folder'),
  getSystemSettings: () => ipcRenderer.invoke('shell:get-system-settings'),
  setSystemSettings: (settings) => ipcRenderer.invoke('shell:set-system-settings', settings),
  setBigPicture: (enabled) => ipcRenderer.invoke('shell:set-big-picture', enabled),
  setQuietMode: (enabled) => ipcRenderer.invoke('shell:set-quiet-mode', enabled),
  synthesizePiper: (text, voice, lengthScale) => ipcRenderer.invoke('shell:synthesize-piper', { text, voice, lengthScale }),
  getCurrentViewers: () => ipcRenderer.invoke('shell:get-current-viewers'),
  checkForUpdates: () => ipcRenderer.invoke('shell:check-for-updates'),
  downloadUpdate: () => ipcRenderer.invoke('shell:download-update'),
  installUpdate: () => ipcRenderer.invoke('shell:install-update'),
  onState: (callback) => {
    const listener = (_event, state) => callback(state);
    ipcRenderer.on('shell:state', listener);
    return () => ipcRenderer.removeListener('shell:state', listener);
  },
  onChatMessage: (callback) => {
    const listener = (_event, message) => callback(message);
    ipcRenderer.on('shell:chat-message', listener);
    return () => ipcRenderer.removeListener('shell:chat-message', listener);
  },
  onChatReset: (callback) => {
    const listener = (_event, payload) => callback(payload);
    ipcRenderer.on('shell:chat-reset', listener);
    return () => ipcRenderer.removeListener('shell:chat-reset', listener);
  },
  onRoomStats: (callback) => {
    const listener = (_event, payload) => callback(payload);
    ipcRenderer.on('shell:room-stats', listener);
    return () => ipcRenderer.removeListener('shell:room-stats', listener);
  },
  onBattleAlert: (callback) => {
    const listener = (_event, payload) => callback(payload);
    ipcRenderer.on('shell:battle-alert', listener);
    return () => ipcRenderer.removeListener('shell:battle-alert', listener);
  }
};

contextBridge.exposeInMainWorld('tiktokLive', api);
