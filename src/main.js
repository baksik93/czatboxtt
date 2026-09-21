const path = require('path');
const fs = require('fs');
const http = require('http');
const os = require('os');
const { spawn, execFile } = require('child_process');
const readline = require('readline');
const { app, BrowserWindow, shell, session, ipcMain, Menu, Tray, screen, systemPreferences, powerMonitor, powerSaveBlocker } = require('electron');
const { autoUpdater } = require('electron-updater');
const { LocalLive } = require('./local-live');
const LOCAL_UI_PREVIEW = process.argv.includes('--local-ui-preview');
const localLive = new LocalLive();

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows');
function prioritizeAudioProcess(pid) {
  try { os.setPriority(pid, os.constants.priority.PRIORITY_ABOVE_NORMAL); } catch (error) { console.warn('Process priority unavailable:', error.code); }
}
prioritizeAudioProcess(process.pid);
app.on('web-contents-created', (_event, contents) => {
  contents.on('did-finish-load', () => prioritizeAudioProcess(contents.getOSProcessId()));
});

const APP_ORIGIN = 'https://czatbox-tt-mobile.p548bzdpmd.workers.dev';
const APP_URL = `${APP_ORIGIN}/?platform=desktop&appVersion=${encodeURIComponent(app.getVersion())}`;
const APP_VERSION = app.getVersion();
const UPDATE_INTERVAL_MS = 6 * 60 * 60 * 1000;
const PIPER_RESOURCE_DIR = app.isPackaged
  ? path.join(process.resourcesPath, 'piper')
  : path.join(app.getAppPath(), 'resources', 'piper');
const PIPER_EXECUTABLE = path.join(PIPER_RESOURCE_DIR, 'piper-tts.exe');
const AUDIO_DUCK_SCRIPT = app.isPackaged
  ? path.join(process.resourcesPath, 'audio-duck.ps1')
  : path.join(app.getAppPath(), 'resources', 'audio-duck.ps1');
const AUDIO_DUCK_STATE = path.join(app.getPath('userData'), 'audio-duck-state.json');
const MR_DRWINA_MODEL = path.join(PIPER_RESOURCE_DIR, 'pl_PL-jarvis_wg_glos-medium.onnx');
const HALINKA_MODEL = path.join(PIPER_RESOURCE_DIR, 'pl_PL-justyna_wg_glos-medium.onnx');
const PIPER_VOICES = Object.freeze({
  'piper-mr-drwina': { label: 'Mr. Drwina — Piper (desktop)', model: MR_DRWINA_MODEL, slug: 'mr-drwina' },
  'piper-halinka': { label: 'Halinka — Piper (desktop)', model: HALINKA_MODEL, slug: 'halinka' }
});
const APP_ICON_PATH = path.join(__dirname, 'assets', 'app-icon.ico');

let mainWindow = null;
let localPreviewServer = null;
let localPreviewOrigin = '';
let bundledAssetOverrideInstalled = false;
let updateTimer = null;
let quittingForUpdate = false;
const piperServers = new Map();
const piperWarmPromises = new Map();
const piperWarmedVoices = new Set();
let tray = null;
let minimizeToTrayOnClose = true;
let appIsQuitting = false;
let widgetWindow = null;
let widgetTimer = null;
let lastDesktopGreetingAt = 0;
let latestWidgetData = { drives: [], accent: '#4fdde5' };
let livePowerBlockerId = null;
let audioDuckDepth = 0;
let audioDuckChain = Promise.resolve();
const RENDERER_CACHE_EPOCH = 'workspace-v152-gift-sound-hotfix';
const RENDERER_CACHE_EPOCH_PATH = path.join(app.getPath('userData'), 'renderer-cache-epoch.txt');
const CANONICAL_USER_DATA_PATH = path.join(app.getPath('userData'), 'canonical-user-data.json');
const CANONICAL_USER_DATA_BACKUP_DIR = path.join(app.getPath('userData'), 'canonical-user-data-backups');
let canonicalUserDataCache = '';

function readCanonicalUserData() {
  try {
    const parsed = JSON.parse(fs.readFileSync(CANONICAL_USER_DATA_PATH, 'utf8'));
    if (parsed && typeof parsed.values === 'object') {
      canonicalUserDataCache = JSON.stringify(parsed.values);
      return parsed;
    }
    return { schema: 1, updatedAt: 0, values: {} };
  } catch { return { schema: 1, updatedAt: 0, values: {} }; }
}

function backupCanonicalUserData() {
  if (!fs.existsSync(CANONICAL_USER_DATA_PATH)) return;
  fs.mkdirSync(CANONICAL_USER_DATA_BACKUP_DIR, { recursive: true });
  const backupPath = path.join(CANONICAL_USER_DATA_BACKUP_DIR, `canonical-user-data-${Date.now()}.json`);
  fs.copyFileSync(CANONICAL_USER_DATA_PATH, backupPath);
  const backups = fs.readdirSync(CANONICAL_USER_DATA_BACKUP_DIR)
    .filter(name => /^canonical-user-data-\d+\.json$/.test(name))
    .sort()
    .reverse();
  for (const staleName of backups.slice(10)) fs.rmSync(path.join(CANONICAL_USER_DATA_BACKUP_DIR, staleName), { force: true });
}

function saveCanonicalUserData(values) {
  if (!values || typeof values !== 'object') return false;
  const safeValues = Object.fromEntries(Object.entries(values).filter(([key, value]) => key.startsWith('cttm-') && typeof value === 'string'));
  const valuesSnapshot = JSON.stringify(safeValues);
  if (valuesSnapshot === canonicalUserDataCache) return true;
  const payload = JSON.stringify({ schema: 1, updatedAt: Date.now(), values: safeValues }, null, 2);
  if (Buffer.byteLength(payload) > 32 * 1024 * 1024) return false;
  const temporaryPath = `${CANONICAL_USER_DATA_PATH}.tmp`;
  fs.writeFileSync(temporaryPath, payload, 'utf8');
  backupCanonicalUserData();
  fs.renameSync(temporaryPath, CANONICAL_USER_DATA_PATH);
  canonicalUserDataCache = valuesSnapshot;
  return true;
}

function runAudioDuck(mode) {
  return new Promise(resolve => {
    execFile('powershell.exe', ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', AUDIO_DUCK_SCRIPT, '-Mode', mode, '-StatePath', AUDIO_DUCK_STATE], { windowsHide: true, timeout: 12000 }, error => {
      if (error) console.warn(`Audio ${mode.toLowerCase()} unavailable:`, error.message);
      resolve(!error);
    });
  });
}

function queueAudioDuck(mode) {
  audioDuckChain = audioDuckChain.then(() => runAudioDuck(mode), () => runAudioDuck(mode));
  return audioDuckChain;
}

function forceRestoreAudio() {
  audioDuckDepth = 0;
  return queueAudioDuck('Restore');
}

function normalizeAccentColor(value) {
  const hex = String(value || '').replace(/[^a-f0-9]/gi, '').slice(0, 6);
  return /^[a-f0-9]{6}$/i.test(hex) ? `#${hex}` : '#4fdde5';
}

function fallbackPartitions() {
  const partitions = [];
  for (let code = 67; code <= 90; code += 1) {
    const root = `${String.fromCharCode(code)}:\\`;
    try {
      if (!fs.existsSync(root) || typeof fs.statfsSync !== 'function') continue;
      const stats = fs.statfsSync(root);
      const size = Number(stats.blocks) * Number(stats.bsize);
      const free = Number(stats.bfree) * Number(stats.bsize);
      if (size > 0) partitions.push({ id: root.slice(0, 2), name: '', size, free });
    } catch {}
  }
  return partitions;
}

function readLocalPartitions() {
  const command = "$ErrorActionPreference='Stop'; Get-CimInstance -ClassName Win32_LogicalDisk -Filter 'DriveType=3' | Select-Object DeviceID,VolumeName,Size,FreeSpace | ConvertTo-Json -Compress";
  return new Promise(resolve => {
    execFile('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', command], { windowsHide: true, timeout: 8000, maxBuffer: 1024 * 1024 }, (error, stdout) => {
      if (error || !stdout.trim()) return resolve(fallbackPartitions());
      try {
        const source = JSON.parse(stdout);
        const values = Array.isArray(source) ? source : [source];
        const partitions = values.map(item => ({
          id: String(item.DeviceID || '').trim(),
          name: String(item.VolumeName || '').trim(),
          size: Number(item.Size) || 0,
          free: Number(item.FreeSpace) || 0
        })).filter(item => /^[A-Z]:$/i.test(item.id) && item.size > 0).sort((a, b) => a.id.localeCompare(b.id));
        resolve(partitions.length ? partitions : fallbackPartitions());
      } catch { resolve(fallbackPartitions()); }
    });
  });
}

async function refreshDesktopWidget() {
  const drives = await readLocalPartitions();
  latestWidgetData = { drives, accent: normalizeAccentColor(systemPreferences.getAccentColor?.()) };
  if (widgetWindow && !widgetWindow.isDestroyed()) widgetWindow.webContents.send('desktop:widget-data', latestWidgetData);
}

function desktopWidgetDisplay() {
  if (mainWindow && !mainWindow.isDestroyed()) return screen.getDisplayMatching(mainWindow.getBounds());
  return screen.getPrimaryDisplay();
}

function createDesktopWidget() {
  if (widgetWindow && !widgetWindow.isDestroyed()) return widgetWindow;
  const area = desktopWidgetDisplay().workArea, width = 184, height = area.height;
  widgetWindow = new BrowserWindow({ width, height, minWidth: width, minHeight: height, x: area.x + area.width - width, y: area.y, frame: false, transparent: true, resizable: false, movable: false, show: false, skipTaskbar: true, focusable: true, hasShadow: true, alwaysOnTop: false, webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true, preload: path.join(__dirname, 'desktop-preload.js'), partition: 'persist:czatbox-tt' } });
  widgetWindow.setMenuBarVisibility(false);
  widgetWindow.setAlwaysOnTop(false);
  widgetWindow.on('close', event => { if (!appIsQuitting) { event.preventDefault(); widgetWindow.hide(); } });
  widgetWindow.webContents.on('did-finish-load', () => widgetWindow?.webContents.send('desktop:widget-data', latestWidgetData));
  void widgetWindow.loadFile(path.join(__dirname, 'desktop-widget.html'));
  return widgetWindow;
}

function positionDesktopWidget(widget) {
  const area = desktopWidgetDisplay().workArea;
  widget.setBounds({ x: area.x + area.width - 184, y: area.y, width: 184, height: area.height });
}

function showDesktopWidget() {
  if (LOCAL_UI_PREVIEW) return;
  const widget = createDesktopWidget();
  positionDesktopWidget(widget);
  void refreshDesktopWidget().finally(() => {
    if (widget.isDestroyed()) return;
    positionDesktopWidget(widget);
    widget.setAlwaysOnTop(false);
    widget.showInactive();
    if (mainWindow && !mainWindow.isDestroyed() && mainWindow.isVisible() && !mainWindow.isMinimized()) mainWindow.moveTop();
  });
  if (!widgetTimer) widgetTimer = setInterval(refreshDesktopWidget, 60000);
}

function stringifyPiperRequest(value) {
  return JSON.stringify(value).replace(/[\u007f-\uffff]/g, character =>
    `\\u${character.charCodeAt(0).toString(16).padStart(4, '0')}`
  );
}

const DECORATIVE_LETTER_MAP = Object.freeze({
  'ᴀ': 'a', 'ʙ': 'b', 'ᴄ': 'c', 'ᴅ': 'd', 'ᴇ': 'e', 'ꜰ': 'f',
  'ɢ': 'g', 'ʜ': 'h', 'ɪ': 'i', 'ᴊ': 'j', 'ᴋ': 'k', 'ʟ': 'l',
  'ᴍ': 'm', 'ɴ': 'n', 'ᴏ': 'o', 'ᴘ': 'p', 'ʀ': 'r', 'ꜱ': 's',
  'ᴛ': 't', 'ᴜ': 'u', 'ᴠ': 'v', 'ᴡ': 'w', 'ʏ': 'y', 'ᴢ': 'z'
});

function normalizeDecorativeText(value) {
  return [...String(value || '').normalize('NFKC')]
    .map(character => DECORATIVE_LETTER_MAP[character] || character)
    .join('');
}

function sanitizePiperText(value) {
  return normalizeDecorativeText(value)
    .replace(/<3/gi, ' ')
    .replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}\p{S}]/gu, ' ')
    .replace(/\[[\p{L}\p{N}_ -]{1,40}\]/gu, ' ')
    .replace(/:[a-z0-9_+-]+:/gi, ' ')
    .replace(/(^|\s)(?:<3|x+d+|[:;=8][-']?[)\]([{}dDpPoO/\\|])(?=$|[\s.!?,])/gi, ' ')
    .replace(/[\u200d\ufe0e\ufe0f]/gi, '')
    .replace(/[\u{1f1e6}-\u{1f1ff}\u{1f3fb}-\u{1f3ff}]/gu, ' ')
    .replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}\p{S}]/gu, ' ')
    .replace(/[@#_*~`^|<>{}[\]\\]/g, ' ')
    .replace(/[^\p{L}\p{N}\s.,!?;:'"()\-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.!?;:])/g, '$1')
    .trim();
}

function getPiperVoice(value) {
  return PIPER_VOICES[String(value || '')] || null;
}

function getPiperServer(voice) {
  const existing = piperServers.get(voice.slug);
  if (existing?.child && !existing.child.killed && existing.child.exitCode == null) return existing;
  const child = spawn(PIPER_EXECUTABLE, ['--server', '--model', voice.model], {
    windowsHide: true,
    stdio: ['pipe', 'pipe', 'ignore']
  });
  child.stdin.setDefaultEncoding('utf8');
  const pending = new Map();
  const lines = readline.createInterface({ input: child.stdout });
  lines.on('line', line => {
    try {
      const result = JSON.parse(line);
      const job = pending.get(result.id);
      if (job) {
        pending.delete(result.id);
        job(result);
      }
    } catch {}
  });
  const stopPending = error => {
    for (const job of pending.values()) job({ ok: false, error });
    pending.clear();
    if (piperServers.get(voice.slug)?.child === child) piperServers.delete(voice.slug);
    piperWarmedVoices.delete(voice.slug);
    piperWarmPromises.delete(voice.slug);
  };
  child.on('error', () => stopPending('piper-error'));
  child.on('exit', () => stopPending('piper-exited'));
  const server = {
    child,
    voice,
    pending,
    nextId: 1,
    request(text, output) {
      return new Promise(resolve => {
        const id = String(this.nextId++);
        const timeout = setTimeout(() => {
          pending.delete(id);
          resolve({ ok: false, error: 'piper-timeout' });
        }, 30000);
        pending.set(id, result => {
          clearTimeout(timeout);
          resolve(result);
        });
        try {
          child.stdin.write(`${stringifyPiperRequest({ id, text, output })}\n`, 'utf8');
        } catch {
          clearTimeout(timeout);
          pending.delete(id);
          resolve({ ok: false, error: 'piper-write-failed' });
        }
      });
    }
  };
  piperServers.set(voice.slug, server);
  return server;
}

function stopPiperServer(voiceSlug = '') {
  const servers = voiceSlug
    ? [[voiceSlug, piperServers.get(voiceSlug)]]
    : [...piperServers.entries()];
  for (const [slug, server] of servers) {
    if (!server) continue;
    piperServers.delete(slug);
    piperWarmedVoices.delete(slug);
    piperWarmPromises.delete(slug);
    try { server.child.stdin.end(); } catch {}
    try { server.child.kill(); } catch {}
  }
  if (!voiceSlug) {
    piperWarmPromises.clear();
    piperWarmedVoices.clear();
  }
}

function warmPiperServer(voice) {
  const existing = piperServers.get(voice.slug);
  if (piperWarmedVoices.has(voice.slug) && existing?.child && !existing.child.killed && existing.child.exitCode == null) {
    return Promise.resolve({ ok: true, cached: true });
  }
  if (piperWarmPromises.has(voice.slug)) return piperWarmPromises.get(voice.slug);
  const output = path.join(app.getPath('temp'), `czatbox-${voice.slug}-warm-${process.pid}.wav`);
  const warmPromise = getPiperServer(voice).request('start', output).then(result => {
    if (!result?.ok) throw new Error(result?.error || 'piper-warm-failed');
    piperWarmedVoices.add(voice.slug);
    return { ok: true };
  }).catch(error => {
    return { ok: false, error: error?.message || 'piper-warm-failed' };
  }).finally(() => {
    piperWarmPromises.delete(voice.slug);
    try { fs.rmSync(output, { force: true }); } catch {}
  });
  piperWarmPromises.set(voice.slug, warmPromise);
  return warmPromise;
}

function showMainWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    createWindow();
    return;
  }
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.show();
  mainWindow.focus();
  if (!LOCAL_UI_PREVIEW) showDesktopWidget();
}

function destroyTray() {
  if (!tray) return;
  tray.destroy();
  tray = null;
}

function ensureTray() {
  if (LOCAL_UI_PREVIEW) return null;
  if (!tray) {
    tray = new Tray(APP_ICON_PATH);
    tray.setToolTip('Czatbox TT');
    tray.on('click', showMainWindow);
  }
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Pokaż Czatbox TT', click: showMainWindow },
    { type: 'separator' },
    { label: 'Widget pulpitu działa razem z oknem programu', enabled: false },
    { type: 'separator' },
    { label: 'Zamknij', click: () => { appIsQuitting = true; app.quit(); } }
  ]));
  return tray;
}

function setMinimizeToTray(enabled) {
  if (LOCAL_UI_PREVIEW) {
    minimizeToTrayOnClose = true;
    return true;
  }
  minimizeToTrayOnClose = true;
  ensureTray();
  return true;
}

function localPreviewDirectory() {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'web-client')
    : path.join(app.getAppPath(), 'web-client', 'public');
}

function localPreviewContentType(filePath) {
  return ({
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.m3u8': 'application/vnd.apple.mpegurl',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.png': 'image/png',
    '.svg': 'image/svg+xml; charset=utf-8',
    '.webmanifest': 'application/manifest+json; charset=utf-8'
  })[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
}

function startLocalUiPreview() {
  if (localPreviewServer && localPreviewOrigin) return Promise.resolve(localPreviewOrigin);
  const root = path.resolve(localPreviewDirectory());
  return new Promise((resolve, reject) => {
    const server = http.createServer(async (request, response) => {
      let pathname = '/';
      try { pathname = decodeURIComponent(new URL(request.url || '/', 'http://127.0.0.1').pathname); } catch {}
      if (pathname.startsWith('/api/')) {
        try {
          const chunks = [];
          for await (const chunk of request) chunks.push(chunk);
          const body = chunks.length ? Buffer.concat(chunks) : undefined;
          const headers = {
            accept: request.headers.accept || 'application/json',
            'content-type': request.headers['content-type'] || 'application/json',
            origin: APP_ORIGIN
          };
          if (request.headers.cookie) headers.cookie = request.headers.cookie;
          const upstream = await fetch(`${APP_ORIGIN}${request.url || pathname}`, {
            method: request.method,
            headers,
            body: ['GET', 'HEAD'].includes(request.method || 'GET') ? undefined : body,
            redirect: 'manual'
          });
          const responseHeaders = {
            'Content-Type': upstream.headers.get('content-type') || 'application/json; charset=utf-8',
            'Cache-Control': 'no-store',
            'X-Content-Type-Options': 'nosniff'
          };
          const setCookie = upstream.headers.get('set-cookie');
          if (setCookie) responseHeaders['Set-Cookie'] = setCookie.replace(/;\s*Secure/gi, '');
          response.writeHead(upstream.status, responseHeaders);
          response.end(Buffer.from(await upstream.arrayBuffer()));
        } catch (error) {
          response.writeHead(502, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});
          response.end(JSON.stringify({error:'Lokalny podgląd nie może połączyć się z usługą kont.'}));
        }
        return;
      }
      const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^[/\\]+/, '');
      const filePath = path.resolve(root, relativePath);
      if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
        response.writeHead(403).end('Forbidden');
        return;
      }
      fs.readFile(filePath, (error, data) => {
        if (error) {
          response.writeHead(error.code === 'ENOENT' ? 404 : 500).end('Not found');
          return;
        }
        response.writeHead(200, {
          'Content-Type': localPreviewContentType(filePath),
          'Cache-Control': 'no-store',
          'Access-Control-Allow-Origin': '*',
          'X-Content-Type-Options': 'nosniff'
        });
        response.end(data);
      });
    });
    server.once('error', reject);
    // Stały port zachowuje ten sam origin, więc lokalny podgląd nie traci
    // zapamiętanych twórców i ustawień pomiędzy kolejnymi uruchomieniami.
    server.listen(47821, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        server.close();
        reject(new Error('Nie udało się ustalić portu lokalnego podglądu.'));
        return;
      }
      localPreviewServer = server;
      localPreviewOrigin = `http://127.0.0.1:${address.port}`;
      resolve(localPreviewOrigin);
    });
  });
}

async function installBundledAssetOverrides() {
  if (bundledAssetOverrideInstalled) return;
  const bundledOrigin = await startLocalUiPreview();
  const root = path.resolve(localPreviewDirectory());
  const appSession = session.fromPartition('persist:czatbox-tt');
  appSession.webRequest.onBeforeRequest({ urls: [`${APP_ORIGIN}/*`] }, (details, callback) => {
    try {
      const pathname = decodeURIComponent(new URL(details.url).pathname);
      if (pathname === '/' || pathname === '/index.html' || pathname === '/icons.svg' || pathname.startsWith('/api/')) {
        callback({});
        return;
      }
      const relativePath = pathname.replace(/^[/\\]+/, '');
      const filePath = path.resolve(root, relativePath);
      if ((filePath === root || filePath.startsWith(`${root}${path.sep}`)) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        callback({ redirectURL: `${bundledOrigin}/${relativePath.replace(/\\/g, '/')}` });
        return;
      }
    } catch {}
    callback({});
  });
  bundledAssetOverrideInstalled = true;
}

function isAllowedAppUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    return url.origin === APP_ORIGIN || (LOCAL_UI_PREVIEW && url.origin === localPreviewOrigin);
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

function desktopPageFeatures() {
  if (window.__czatboxDesktopFeaturesInstalled) return;
  window.__czatboxDesktopFeaturesInstalled = true;

  window.addEventListener('cttm-desktop-open-workspace', event => {
    const workspace = String(event.detail || '');
    const target = document.querySelector(`[data-workspace="${workspace}"]`);
    if (target instanceof HTMLElement) target.click();
  });

  const settingsPage = document.querySelector('#settings');
  const desktopSettingsTarget = document.querySelector('#settings-data') || settingsPage;
  if (desktopSettingsTarget && !document.querySelector('#desktopBehaviorSettings')) {
    const group = document.createElement('div');
    group.id = 'desktopBehaviorSettings';
    group.className = 'settings-section';
    group.innerHTML = '<div class="group-head"><h2>System</h2><p>Zachowanie okna programu</p></div><div class="settings-card"><div class="setting-row"><span><b>Przycisk X ukrywa program w zasobniku</b><small>Główne okno i widget zostają ukryte, a czat i TTS nadal działają w tle. Program zamkniesz całkowicie z menu ikony przy zegarze.</small></span></div></div>';
    const codesSection = document.querySelector('#settings-codes');
    if (codesSection?.parentElement) codesSection.parentElement.insertBefore(group, codesSection);
    else desktopSettingsTarget.prepend(group);
    localStorage.setItem('cttm-desktop-minimize-to-tray', 'true');
    window.czatboxDesktop?.setMinimizeToTray(true).catch(() => {});
  }

  const voiceSelect = document.querySelector('#voice');
  const desktopPiperVoices = [
    ['piper-mr-drwina', 'Mr. Drwina — Piper (desktop)'],
    ['piper-halinka', 'Halinka — Piper (desktop)']
  ];
  const ensurePiperOption = () => {
    if (!voiceSelect) return;
    desktopPiperVoices.forEach(([value, label]) => {
      if (voiceSelect.querySelector(`option[value="${value}"]`)) return;
      const option = document.createElement('option');
      option.value = value;
      option.textContent = label;
      voiceSelect.append(option);
    });
    try {
      const selected = JSON.parse(localStorage.getItem('cttm-settings') || '{}').voice;
      if (desktopPiperVoices.some(([value]) => value === selected)) voiceSelect.value = selected;
    } catch {}
  };
  ensurePiperOption();
  if (voiceSelect) {
    new MutationObserver(ensurePiperOption).observe(voiceSelect, { childList: true });
    voiceSelect.addEventListener('change', () => {
      if (desktopPiperVoices.some(([value]) => value === voiceSelect.value)) window.czatboxDesktop?.warmPiper(voiceSelect.value).catch(() => {});
    });
  }

  window.__czatboxSpeakGreeting = payload => {
    const data = payload && typeof payload === 'object' ? payload : {};
    const userName = String(data.userName || 'użytkowniku').trim() || 'użytkowniku';
    const now = new Date();
    const time = new Intl.DateTimeFormat('pl-PL', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(now);
    const utterance = new SpeechSynthesisUtterance(`Witaj ${userName} ponownie. Jest ${time}. Z którym twórcą się łączymy?`);
    let settings = {};
    try { settings = JSON.parse(localStorage.getItem('cttm-settings') || '{}'); } catch {}
    utterance.rate = Math.max(0.6, Math.min(1.6, Number(settings.rate) || 1));
    const configuredVolume = Number(settings.volume);
    utterance.volume = Number.isFinite(configuredVolume) ? Math.max(0, Math.min(1, configuredVolume)) : 0.85;
    utterance.__czatboxForce = true;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  if (window.czatboxDesktop?.synthesizePiper && !window.speechSynthesis.__desktopPiperPatched) {
    const speech = window.speechSynthesis;
    const originalSpeak = speech.speak.bind(speech);
    const originalCancel = speech.cancel.bind(speech);
    let piperAudio = null;
    let piperAudioContext = null;
    let piperAudioSource = null;
    let piperGain = null;
    const feminineHoursAfterO = ['zerowej', 'pierwszej', 'drugiej', 'trzeciej', 'czwartej', 'piątej', 'szóstej', 'siódmej', 'ósmej', 'dziewiątej', 'dziesiątej', 'jedenastej', 'dwunastej', 'trzynastej', 'czternastej', 'piętnastej', 'szesnastej', 'siedemnastej', 'osiemnastej', 'dziewiętnastej', 'dwudziestej', 'dwudziestej pierwszej', 'dwudziestej drugiej', 'dwudziestej trzeciej'];
    const feminineHoursStandalone = ['zero', 'pierwsza', 'druga', 'trzecia', 'czwarta', 'piąta', 'szósta', 'siódma', 'ósma', 'dziewiąta', 'dziesiąta', 'jedenasta', 'dwunasta', 'trzynasta', 'czternasta', 'piętnasta', 'szesnasta', 'siedemnasta', 'osiemnasta', 'dziewiętnasta', 'dwudziesta', 'dwudziesta pierwsza', 'dwudziesta druga', 'dwudziesta trzecia'];
    const spokenMinute = value => {
      const ones = ['zero', 'jeden', 'dwa', 'trzy', 'cztery', 'pięć', 'sześć', 'siedem', 'osiem', 'dziewięć'];
      const teens = ['dziesięć', 'jedenaście', 'dwanaście', 'trzynaście', 'czternaście', 'piętnaście', 'szesnaście', 'siedemnaście', 'osiemnaście', 'dziewiętnaście'];
      const tens = ['', '', 'dwadzieścia', 'trzydzieści', 'czterdzieści', 'pięćdziesiąt'];
      if (value < 10) return ones[value];
      if (value < 20) return teens[value - 10];
      return `${tens[Math.floor(value / 10)]}${value % 10 ? ` ${ones[value % 10]}` : ''}`;
    };
    const masculineOrdinal = value => {
      const direct = ['zerowy', 'pierwszy', 'drugi', 'trzeci', 'czwarty', 'piąty', 'szósty', 'siódmy', 'ósmy', 'dziewiąty', 'dziesiąty', 'jedenasty', 'dwunasty', 'trzynasty', 'czternasty', 'piętnasty', 'szesnasty', 'siedemnasty', 'osiemnasty', 'dziewiętnasty'];
      const tens = ['', '', 'dwudziesty', 'trzydziesty', 'czterdziesty', 'pięćdziesiąty', 'sześćdziesiąty', 'siedemdziesiąty', 'osiemdziesiąty', 'dziewięćdziesiąty'];
      if (value < 20) return direct[value];
      return `${tens[Math.floor(value / 10)]}${value % 10 ? ` ${direct[value % 10]}` : ''}`;
    };
    const genitiveOrdinal = value => {
      const direct = ['', 'pierwszego', 'drugiego', 'trzeciego', 'czwartego', 'piątego', 'szóstego', 'siódmego', 'ósmego', 'dziewiątego', 'dziesiątego', 'jedenastego', 'dwunastego', 'trzynastego', 'czternastego', 'piętnastego', 'szesnastego', 'siedemnastego', 'osiemnastego', 'dziewiętnastego'];
      const tens = ['', '', 'dwudziestego', 'trzydziestego', 'czterdziestego', 'pięćdziesiątego', 'sześćdziesiątego', 'siedemdziesiątego', 'osiemdziesiątego', 'dziewięćdziesiątego'];
      if (value < 20) return direct[value];
      return `${tens[Math.floor(value / 10)]}${value % 10 ? ` ${direct[value % 10]}` : ''}`;
    };
    const months = ['', 'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
    const spokenYear = value => {
      const year = Number(value), remainder = year % 100;
      if (year >= 2000 && year <= 2099) return `dwa tysiące${remainder ? ` ${genitiveOrdinal(remainder)}` : ''}`;
      if (year >= 1900 && year <= 1999) return `tysiąc dziewięćset${remainder ? ` ${genitiveOrdinal(remainder)}` : ''}`;
      return String(year);
    };
    const normalizePiperDates = value => String(value || '').replace(/\b(?:(20\d{2})[-/.](\d{1,2})[-/.](\d{1,2})|(\d{1,2})[-/.](\d{1,2})[-/.](20\d{2}))\b/gu, (match, isoYear, isoMonth, isoDay, localDay, localMonth, localYear) => {
      const day = Number(isoDay || localDay), month = Number(isoMonth || localMonth), year = Number(isoYear || localYear);
      if (day < 1 || day > 31 || month < 1 || month > 12) return match;
      return `${masculineOrdinal(day)} ${months[month]} ${spokenYear(year)} roku`;
    });
    const normalizePiperTimes = value => String(value || '').replace(/(?:\bo\s+)?\b([01]?\d|2[0-3]):([0-5]\d)\b/giu, (match, rawHour, rawMinute) => {
      const afterO = /^o\s/i.test(match), prefix = afterO ? 'o ' : '';
      const hour = Number(rawHour), minute = Number(rawMinute);
      return `${prefix}${(afterO ? feminineHoursAfterO : feminineHoursStandalone)[hour]}${minute ? ` ${spokenMinute(minute)}` : ''}`;
    });
    const normalizePiperText = value => normalizePiperTimes(normalizePiperDates(value));
    speech.__desktopPiperPatched = true;
    speech.speak = utterance => {
      let selected = '';
      let settings = {};
      try { settings = JSON.parse(localStorage.getItem('cttm-settings') || '{}'); selected = settings.voice || ''; } catch {}
      if (!desktopPiperVoices.some(([value]) => value === selected)) return originalSpeak(utterance);
      const finish = (error = false) => {
        if (piperAudio) {
          piperAudio.onended = null;
          piperAudio.onerror = null;
          piperAudio = null;
        }
        try { piperAudioSource?.disconnect(); } catch {}
        try { piperGain?.disconnect(); } catch {}
        piperAudioSource = null;
        piperGain = null;
        const callback = error ? utterance.onerror : utterance.onend;
        if (typeof callback === 'function') callback.call(utterance, { type: error ? 'error' : 'end', utterance });
      };
      if (!settings.tts && !utterance.__czatboxForce) return finish(false);
      if (settings.privileged && !utterance.__czatboxTtsApproved && !utterance.__czatboxForce) return finish(false);
      if (settings.cleanSpeech) {
        const spokenText = String(utterance.text || '').toLowerCase();
        const rejected = /(.)\1{5,}/.test(spokenText) || /(https?:\/\/|www\.)/.test(spokenText) || spokenText.length > 320 || /\b(?:kurw\w*|chuj\w*|pierdol\w*|jeb\w*|skurwysyn\w*|pizd\w*|cipa\w*)\b/i.test(spokenText);
        if (rejected) return finish(false);
      }
      const textForVoice = normalizePiperText(utterance.text);
      window.czatboxDesktop.synthesizePiper(selected, textForVoice).then(result => {
        if (!result?.ok || !result.audio) throw new Error(result?.error || 'piper-failed');
        const audio = new Audio(`data:audio/wav;base64,${result.audio}`);
        piperAudio = audio;
        const requestedVolume = Math.max(0, Math.min(2, Number(settings.volume ?? utterance.volume) || 0));
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          piperAudioContext ||= new AudioContextClass();
          piperAudioSource = piperAudioContext.createMediaElementSource(audio);
          piperGain = piperAudioContext.createGain();
          piperGain.gain.value = requestedVolume;
          piperAudioSource.connect(piperGain).connect(piperAudioContext.destination);
          audio.volume = 1;
          if (piperAudioContext.state === 'suspended') void piperAudioContext.resume();
        } else {
          audio.volume = Math.min(1, requestedVolume);
        }
        audio.playbackRate = Math.max(0.5, Math.min(2, Number(utterance.rate) || 1));
        audio.preservesPitch = true;
        audio.onended = () => finish(false);
        audio.onerror = () => finish(true);
        return audio.play();
      }).catch(() => finish(true));
    };
    speech.cancel = () => {
      if (piperAudio) {
        piperAudio.pause();
        piperAudio.src = '';
        piperAudio = null;
      }
      try { piperAudioSource?.disconnect(); } catch {}
      try { piperGain?.disconnect(); } catch {}
      piperAudioSource = null;
      piperGain = null;
      originalCancel();
    };
    window.setTimeout(async () => {
      let selected = '';
      try { selected = JSON.parse(localStorage.getItem('cttm-settings') || '{}').voice || ''; } catch {}
      const orderedVoices = desktopPiperVoices.map(([value]) => value).sort(value => value === selected ? -1 : 1);
      for (const value of orderedVoices) await window.czatboxDesktop.warmPiper(value).catch(() => {});
    }, 350);
  }
}

function applyDesktopFeatures() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  return mainWindow.webContents.executeJavaScript(`(${desktopPageFeatures.toString()})()`, true).catch(() => {});
}

function speakDesktopGreeting() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  const now = Date.now();
  if (now - lastDesktopGreetingAt < 5000) return;
  lastDesktopGreetingAt = now;
  let userName = 'użytkowniku';
  try { userName = os.userInfo().username || userName; } catch {}
  void mainWindow.webContents.executeJavaScript(`window.__czatboxSpeakGreeting?.(${JSON.stringify({ userName })})`, true).catch(() => {});
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

ipcMain.handle('desktop:warm-piper', async (_event, requestedVoice) => {
  const voice = getPiperVoice(requestedVoice);
  if (!voice || !fs.existsSync(PIPER_EXECUTABLE) || !fs.existsSync(voice.model)) {
    return { ok: false, error: 'piper-unavailable' };
  }
  try {
    return await warmPiperServer(voice);
  } catch (error) {
    return { ok: false, error: error?.message || 'piper-failed' };
  }
});

ipcMain.handle('desktop:synthesize-piper', async (_event, requestedVoice, rawText) => {
  const voice = getPiperVoice(requestedVoice);
  if (!voice || !fs.existsSync(PIPER_EXECUTABLE) || !fs.existsSync(voice.model)) {
    return { ok: false, error: 'piper-unavailable' };
  }
  const text = sanitizePiperText(rawText).slice(0, 600);
  if (!text) return { ok: false, error: 'empty-text' };
  const output = path.join(app.getPath('temp'), `czatbox-${voice.slug}-${Date.now()}-${Math.random().toString(16).slice(2)}.wav`);
  try {
    const result = await getPiperServer(voice).request(text, output);
    if (!result?.ok || !fs.existsSync(output)) return { ok: false, error: result?.error || 'piper-failed' };
    return { ok: true, audio: fs.readFileSync(output).toString('base64') };
  } catch (error) {
    return { ok: false, error: error?.message || 'piper-failed' };
  } finally {
    try { fs.rmSync(output, { force: true }); } catch {}
  }
});

ipcMain.handle('desktop:set-minimize-to-tray', (_event, enabled) => ({
  ok: true,
  enabled: setMinimizeToTray(enabled)
}));
ipcMain.on('desktop:open-workspace', (event, name) => {
  if (!widgetWindow || event.sender !== widgetWindow.webContents || !mainWindow || mainWindow.isDestroyed()) return;
  const workspace = String(name || '');
  if (!['calendar', 'notes', 'radio'].includes(workspace)) return;
  mainWindow.show();
  mainWindow.focus();
  void mainWindow.webContents.executeJavaScript(`window.dispatchEvent(new CustomEvent('cttm-desktop-open-workspace',{detail:${JSON.stringify(workspace)}}))`);
  showDesktopWidget();
});
ipcMain.on('desktop:open-control-panel', event => {
  if (!widgetWindow || event.sender !== widgetWindow.webContents) return;
  try { spawn('control.exe', [], { detached: true, stdio: 'ignore', windowsHide: true }).unref(); } catch {}
});
ipcMain.on('desktop:open-drive', (event, drive) => {
  if (!widgetWindow || event.sender !== widgetWindow.webContents) return;
  const root = String(drive || '').trim().toUpperCase();
  if (!/^[A-Z]:$/.test(root)) return;
  void shell.openPath(`${root}\\`);
});

ipcMain.on('desktop:user-data-load', event => {
  event.returnValue = mainWindow && event.sender === mainWindow.webContents ? readCanonicalUserData() : { schema: 1, updatedAt: 0, values: {} };
});
ipcMain.handle('desktop:user-data-save', (event, values) => {
  if (!mainWindow || event.sender !== mainWindow.webContents) return false;
  return saveCanonicalUserData(values);
});

function isLiveSender(event) {
  return mainWindow && !mainWindow.isDestroyed() && event.sender === mainWindow.webContents
    && event.senderFrame === event.sender.mainFrame && isAllowedAppUrl(event.senderFrame.url);
}
ipcMain.handle('desktop:audio-duck-start', async event => {
  if (!isLiveSender(event)) return { ok: false };
  audioDuckDepth += 1;
  if (audioDuckDepth === 1) await queueAudioDuck('Duck');
  return { ok: true, depth: audioDuckDepth };
});
ipcMain.handle('desktop:audio-duck-stop', async event => {
  if (!isLiveSender(event)) return { ok: false };
  audioDuckDepth = Math.max(0, audioDuckDepth - 1);
  if (audioDuckDepth === 0) await queueAudioDuck('Restore');
  return { ok: true, depth: audioDuckDepth };
});
ipcMain.on('desktop:live-connect', (event, id, username) => {
  if (!isLiveSender(event) || typeof id !== 'string' || !/^[\w-]{1,80}$/.test(id)
      || typeof username !== 'string' || !/^[a-zA-Z0-9_.]{1,64}$/.test(username)) return;
  const owner = event.sender;
  if (livePowerBlockerId == null || !powerSaveBlocker.isStarted(livePowerBlockerId)) livePowerBlockerId = powerSaveBlocker.start('prevent-app-suspension');
  void localLive.start(id, username, packet => {
    if (!owner.isDestroyed()) owner.send('desktop:live-event', packet);
  });
});
ipcMain.on('desktop:live-disconnect', (event, id) => {
  if (isLiveSender(event) && typeof id === 'string') {
    localLive.stop(id);
    if (livePowerBlockerId != null && powerSaveBlocker.isStarted(livePowerBlockerId)) powerSaveBlocker.stop(livePowerBlockerId);
    livePowerBlockerId = null;
  }
});
app.on('before-quit', () => { localLive.stop(); if (livePowerBlockerId != null && powerSaveBlocker.isStarted(livePowerBlockerId)) powerSaveBlocker.stop(livePowerBlockerId); livePowerBlockerId = null; void forceRestoreAudio(); });

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1120,
    height: 860,
    minWidth: 720,
    minHeight: 640,
    show: false,
    backgroundColor: '#080b12',
    title: 'Czatbox TT',
    icon: APP_ICON_PATH,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(__dirname, 'desktop-preload.js'),
      backgroundThrottling: false,
      spellcheck: false,
      partition: 'persist:czatbox-tt'
    }
  });
  mainWindow.webContents.setBackgroundThrottling(false);
  mainWindow.on('close', event => {
    if (LOCAL_UI_PREVIEW) {
      appIsQuitting = true;
      return;
    }
    if (appIsQuitting || quittingForUpdate) return;
    event.preventDefault();
    ensureTray();
    mainWindow.hide();
    if (widgetWindow && !widgetWindow.isDestroyed()) widgetWindow.hide();
  });
  if (!LOCAL_UI_PREVIEW) {
    mainWindow.on('minimize', showDesktopWidget);
    mainWindow.on('restore', showDesktopWidget);
    mainWindow.on('show', () => { if (!mainWindow?.isMinimized()) showDesktopWidget(); });
  }

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
    await applyDesktopFeatures();
    setTimeout(speakDesktopGreeting, 700);
    if (process.env.CZATBOX_UPDATE_PREVIEW === '1') {
      pushUpdateUi({ title: 'Dostępna aktualizacja', text: 'Dostępna jest wersja testowa 0.3.6. Pobrać ją teraz?', button: 'Pobierz', action: 'download', dismissible: true });
    }
  });
  mainWindow.webContents.on('did-fail-load', (_event, errorCode, _description, validatedUrl, isMainFrame) => {
    if (!isMainFrame || errorCode === -3 || !isAllowedAppUrl(validatedUrl)) return;
    void mainWindow.loadFile(path.join(__dirname, 'shell', 'offline.html'));
  });
  mainWindow.once('ready-to-show', () => mainWindow?.show());
  mainWindow.webContents.on('did-start-navigation', (_event, _url, isInPlace, isMainFrame) => {
    if (isMainFrame && !isInPlace) localLive.stop();
  });
  mainWindow.on('closed', () => { localLive.stop(); void forceRestoreAudio(); mainWindow = null; if (!minimizeToTrayOnClose) destroyTray(); });
  const loadApp = async () => {
    if (LOCAL_UI_PREVIEW) {
      const previewOrigin = await startLocalUiPreview();
      await mainWindow.loadURL(`${previewOrigin}/?platform=desktop&localPreview=1&appVersion=${encodeURIComponent(APP_VERSION)}`);
      return;
    }
    await installBundledAssetOverrides();
    let applied = '';
    try { applied = fs.readFileSync(RENDERER_CACHE_EPOCH_PATH, 'utf8').trim(); } catch {}
    if (applied !== RENDERER_CACHE_EPOCH) {
      try {
        await mainWindow.webContents.session.clearCache();
        await mainWindow.webContents.session.clearStorageData({ storages: ['serviceworkers'] });
        fs.writeFileSync(RENDERER_CACHE_EPOCH_PATH, RENDERER_CACHE_EPOCH, 'utf8');
      } catch {}
    }
    await mainWindow.loadURL(APP_URL);
  };
  void loadApp();
}

function configureUpdater() {
  if (!app.isPackaged || LOCAL_UI_PREVIEW) return;
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
    showMainWindow();
  });

  app.whenReady().then(async () => {
    await forceRestoreAudio();
    session.fromPartition('persist:czatbox-tt').setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
    createWindow();
    if (!LOCAL_UI_PREVIEW) {
      ensureTray();
      setTimeout(showDesktopWidget, 1200);
      const repositionWidget = () => {
        if (widgetWindow && !widgetWindow.isDestroyed() && widgetWindow.isVisible()) positionDesktopWidget(widgetWindow);
      };
      screen.on('display-added', repositionWidget);
      screen.on('display-removed', repositionWidget);
      screen.on('display-metrics-changed', repositionWidget);
    }
    powerMonitor.on('resume', () => setTimeout(speakDesktopGreeting, 1200));
    configureUpdater();
  });

  app.on('activate', () => {
    if (!mainWindow || mainWindow.isDestroyed()) createWindow();
    else showMainWindow();
  });
  app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
  app.on('before-quit', event => {
    appIsQuitting = true;
    if (updateTimer) clearInterval(updateTimer);
    stopPiperServer();
    if (localPreviewServer) {
      localPreviewServer.close();
      localPreviewServer = null;
      localPreviewOrigin = '';
    }
    destroyTray();
    if (quittingForUpdate) return;
    if (mainWindow && !mainWindow.isDestroyed()) {
      try { mainWindow.webContents.session.flushStorageData(); } catch {}
    }
  });
}
