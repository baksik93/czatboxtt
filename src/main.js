const path = require('path');
const { app, BrowserWindow, shell, session } = require('electron');
const { autoUpdater } = require('electron-updater');

const APP_ORIGIN = 'https://czatbox-tt-mobile.p548bzdpmd.workers.dev';
const APP_URL = `${APP_ORIGIN}/?platform=desktop&appVersion=${encodeURIComponent(app.getVersion())}`;
const APP_VERSION = app.getVersion();
const UPDATE_INTERVAL_MS = 6 * 60 * 60 * 1000;

let mainWindow = null;
let updateTimer = null;
let quittingForUpdate = false;

function isAllowedAppUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    return url.origin === APP_ORIGIN;
  } catch {
    return false;
  }
}

function isSafeExternalUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    return ['https:', 'mailto:'].includes(url.protocol);
  } catch {
    return false;
  }
}

function applyDesktopBranding() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  return mainWindow.webContents.executeJavaScript(`(() => {
    document.title = 'Czatbox TT';
    document.documentElement.dataset.platform = 'desktop';
    const brand = document.querySelector('.brand strong');
    if (brand) brand.innerHTML = 'Czatbox TT';
    const subtitle = document.querySelector('.brand small');
    if (subtitle) subtitle.textContent = 'Desktopowy panel LIVE';
    const gateTitle = document.querySelector('#betaGate h1');
    if (gateTitle) gateTitle.textContent = 'Czatbox TT';
    const aboutBadge = document.querySelector('#about > .eyebrow');
    if (aboutBadge) aboutBadge.textContent = 'WERSJA DESKTOPOWA ${APP_VERSION}';
    const aboutTitle = document.querySelector('#about > h1');
    if (aboutTitle) aboutTitle.textContent = 'Czatbox TT';
    const aboutIntro = document.querySelector('#about .about-description > p');
    if (aboutIntro) aboutIntro.textContent = 'Czatbox TT to desktopowy panel do odczytu czatu transmisji TikTok LIVE. Wersja ${APP_VERSION} korzysta ze wspólnego interfejsu wersji mobilnej i synchronizuje dane z telefonami z Androidem oraz iOS.';
    if (!document.querySelector('#desktopUpdateOverlay')) {
      const style = document.createElement('style');
      style.textContent = '.desktop-update-overlay{position:fixed;inset:0;z-index:1200;display:grid;place-items:center;padding:20px;background:#000a;backdrop-filter:blur(8px)}.desktop-update-overlay[hidden]{display:none}.desktop-update-card{width:min(440px,100%);padding:26px;border:1px solid var(--line);border-radius:24px;background:var(--panel);color:var(--text);box-shadow:0 28px 90px #000b;text-align:center}.desktop-update-icon{width:68px;height:68px;margin:0 auto 17px;border:1px solid var(--line);border-radius:20px;background:linear-gradient(145deg,color-mix(in srgb,var(--cyan) 20%,var(--panel2)),color-mix(in srgb,var(--accent) 22%,var(--panel2)));display:grid;place-items:center;color:var(--cyan);font-size:30px}.desktop-update-card h2{margin:0 0 9px;font-size:22px}.desktop-update-card p{margin:0;color:var(--muted);font-size:13px;line-height:1.55}.desktop-update-progress{height:8px;margin:20px 0 0;border-radius:99px;background:var(--panel2);overflow:hidden}.desktop-update-progress i{display:block;width:0;height:100%;border-radius:inherit;background:linear-gradient(90deg,var(--cyan),var(--accent),var(--pink));transition:width .2s}.desktop-update-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:20px}.desktop-update-actions button{min-height:44px;border-radius:12px;font-weight:850}.desktop-update-primary{border:0;background:linear-gradient(135deg,var(--cyan),var(--accent) 60%,var(--pink));color:#fff}.desktop-update-secondary{border:1px solid var(--line);background:var(--panel2);color:var(--text)}';
      document.head.append(style);
      const overlay = document.createElement('div');
      overlay.id = 'desktopUpdateOverlay';
      overlay.className = 'desktop-update-overlay';
      overlay.hidden = true;
      overlay.innerHTML = '<section class="desktop-update-card" role="dialog" aria-modal="true" aria-labelledby="desktopUpdateTitle"><div class="desktop-update-icon">↻</div><h2 id="desktopUpdateTitle"></h2><p id="desktopUpdateText"></p><div class="desktop-update-progress" hidden><i></i></div><div class="desktop-update-actions"><button class="desktop-update-secondary" type="button">Później</button><button class="desktop-update-primary" type="button"></button></div></section>';
      document.body.append(overlay);
      const secondary = overlay.querySelector('.desktop-update-secondary');
      const primary = overlay.querySelector('.desktop-update-primary');
      secondary.onclick = () => { overlay.hidden = true; };
      primary.onclick = () => { const action = primary.dataset.action; if (action === 'dismiss') { overlay.hidden = true; return; } if (action) location.href = 'czatbox-update://' + action; };
      window.__czatboxUpdateUi = payload => {
        overlay.hidden = false;
        overlay.querySelector('#desktopUpdateTitle').textContent = payload.title || 'Aktualizacja Czatbox TT';
        overlay.querySelector('#desktopUpdateText').textContent = payload.text || '';
        const progress = overlay.querySelector('.desktop-update-progress');
        progress.hidden = payload.progress == null;
        progress.querySelector('i').style.width = Math.max(0, Math.min(100, Number(payload.progress) || 0)) + '%';
        primary.textContent = payload.button || 'OK';
        primary.dataset.action = payload.action || '';
        primary.disabled = !payload.action;
        secondary.hidden = payload.dismissible === false;
      };
    }
  })()`, true).catch(() => {});
}

function pushUpdateUi(payload) {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  void mainWindow.webContents.executeJavaScript(`window.__czatboxUpdateUi?.(${JSON.stringify(payload)})`, true).catch(() => {});
}

function startUpdateDownload() {
  pushUpdateUi({ title: 'Pobieranie aktualizacji', text: 'Pobieram nową wersję Czatbox TT…', progress: 0, button: 'Pobieranie…', dismissible: false });
  void autoUpdater.downloadUpdate().catch(error => pushUpdateUi({ title: 'Nie udało się pobrać aktualizacji', text: error?.message || 'Spróbuj ponownie później.', button: 'Zamknij', action: 'dismiss', dismissible: true }));
}

function installDownloadedUpdate() {
  quittingForUpdate = true;
  autoUpdater.quitAndInstall(true, true);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1120,
    height: 860,
    minWidth: 720,
    minHeight: 640,
    show: false,
    backgroundColor: '#080b12',
    title: 'Czatbox TT',
    icon: path.join(__dirname, 'assets', 'app-icon.ico'),
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false,
      partition: 'persist:czatbox-tt'
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isSafeExternalUrl(url)) void shell.openExternal(url);
    return { action: 'deny' };
  });
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (url.startsWith('czatbox-update://')) {
      event.preventDefault();
      const action = new URL(url).hostname;
      if (action === 'download') startUpdateDownload();
      if (action === 'install') installDownloadedUpdate();
      return;
    }
    if (isAllowedAppUrl(url)) return;
    event.preventDefault();
    if (isSafeExternalUrl(url)) void shell.openExternal(url);
  });
  mainWindow.webContents.on('dom-ready', async () => {
    await applyDesktopBranding();
    if (process.env.CZATBOX_UPDATE_PREVIEW === '1') {
      pushUpdateUi({ title: 'Dostępna aktualizacja', text: 'Dostępna jest wersja testowa 0.3.6. Pobrać ją teraz?', button: 'Pobierz', action: 'download', dismissible: true });
    }
  });
  mainWindow.webContents.on('did-fail-load', (_event, errorCode, _description, validatedUrl, isMainFrame) => {
    if (!isMainFrame || errorCode === -3 || !isAllowedAppUrl(validatedUrl)) return;
    void mainWindow.loadFile(path.join(__dirname, 'shell', 'offline.html'));
  });
  mainWindow.once('ready-to-show', () => mainWindow?.show());
  mainWindow.on('closed', () => { mainWindow = null; });
  void mainWindow.loadURL(APP_URL);
}

function configureUpdater() {
  if (!app.isPackaged) return;
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.logger = null;
  autoUpdater.on('update-available', info => {
    pushUpdateUi({ title: 'Dostępna aktualizacja', text: `Dostępna jest wersja ${info.version}. Pobrać ją teraz?`, button: 'Pobierz', action: 'download', dismissible: true });
  });
  autoUpdater.on('download-progress', progress => {
    mainWindow?.setProgressBar(Math.max(0, Math.min(1, progress.percent / 100)));
    pushUpdateUi({ title: 'Pobieranie aktualizacji', text: `Pobrano ${Math.round(progress.percent)}%. Możesz dalej korzystać z programu.`, progress: progress.percent, button: 'Pobieranie…', dismissible: false });
  });
  autoUpdater.on('update-downloaded', info => {
    mainWindow?.setProgressBar(-1);
    pushUpdateUi({ title: 'Aktualizacja gotowa', text: `Czatbox TT ${info.version} został pobrany. Uruchomić ponownie i zainstalować aktualizację?`, button: 'Uruchom ponownie', action: 'install', dismissible: true });
  });
  autoUpdater.on('error', error => {
    mainWindow?.setProgressBar(-1);
    pushUpdateUi({ title: 'Błąd aktualizacji', text: error?.message || 'Nie udało się sprawdzić lub pobrać aktualizacji.', button: 'Zamknij', action: 'dismiss', dismissible: true });
  });
  const check = () => autoUpdater.checkForUpdates().catch(() => {});
  setTimeout(check, 15000);
  updateTimer = setInterval(check, UPDATE_INTERVAL_MS);
}

const singleInstance = app.requestSingleInstanceLock();
if (!singleInstance) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  });

  app.whenReady().then(() => {
    session.fromPartition('persist:czatbox-tt').setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
    createWindow();
    configureUpdater();
  });

  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
  app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
  app.on('before-quit', event => {
    if (updateTimer) clearInterval(updateTimer);
    if (quittingForUpdate) return;
    if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.session.flushStorageData().catch(() => {});
  });
}
