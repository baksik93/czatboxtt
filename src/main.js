const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawn, execFile } = require('child_process');
const readline = require('readline');
const { app, BrowserWindow, shell, session, ipcMain, Menu, Tray, screen, systemPreferences, powerMonitor } = require('electron');
const { autoUpdater } = require('electron-updater');

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

const APP_ORIGIN = 'https://czatbox-tt-mobile.p548bzdpmd.workers.dev';
const APP_URL = `${APP_ORIGIN}/?platform=desktop&appVersion=${encodeURIComponent(app.getVersion())}`;
const APP_VERSION = app.getVersion();
const UPDATE_INTERVAL_MS = 6 * 60 * 60 * 1000;
const PIPER_RESOURCE_DIR = app.isPackaged
  ? path.join(process.resourcesPath, 'piper')
  : path.join(app.getAppPath(), 'resources', 'piper');
const PIPER_EXECUTABLE = path.join(PIPER_RESOURCE_DIR, 'piper-tts.exe');
const MR_DRWINA_MODEL = path.join(PIPER_RESOURCE_DIR, 'pl_PL-jarvis_wg_glos-medium.onnx');
const HALINKA_MODEL = path.join(PIPER_RESOURCE_DIR, 'pl_PL-justyna_wg_glos-medium.onnx');
const PIPER_VOICES = Object.freeze({
  'piper-mr-drwina': { label: 'Mr. Drwina — Piper (desktop)', model: MR_DRWINA_MODEL, slug: 'mr-drwina' },
  'piper-halinka': { label: 'Halinka — Piper (desktop)', model: HALINKA_MODEL, slug: 'halinka' }
});
const APP_ICON_PATH = path.join(__dirname, 'assets', 'app-icon.ico');

let mainWindow = null;
let updateTimer = null;
let quittingForUpdate = false;
let piperServer = null;
const piperWarmPromises = new Map();
let tray = null;
let minimizeToTrayOnClose = false;
let appIsQuitting = false;
let widgetWindow = null;
let widgetTimer = null;
let lastDesktopGreetingAt = 0;
let latestWidgetData = { drives: [], accent: '#4fdde5' };
const RENDERER_CACHE_EPOCH = 'workspace-v98';
const RENDERER_CACHE_EPOCH_PATH = path.join(app.getPath('userData'), 'renderer-cache-epoch.txt');

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

function createDesktopWidget() {
  if (widgetWindow && !widgetWindow.isDestroyed()) return widgetWindow;
  const area = screen.getPrimaryDisplay().workArea, width = 184, height = area.height;
  widgetWindow = new BrowserWindow({ width, height, minWidth: width, minHeight: height, x: area.x + area.width - width, y: area.y, frame: false, transparent: true, resizable: false, movable: false, show: false, skipTaskbar: true, focusable: true, hasShadow: true, alwaysOnTop: false, webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true, preload: path.join(__dirname, 'desktop-preload.js'), partition: 'persist:czatbox-tt' } });
  widgetWindow.setMenuBarVisibility(false);
  widgetWindow.on('close', event => { if (!appIsQuitting) { event.preventDefault(); widgetWindow.hide(); } });
  widgetWindow.webContents.on('did-finish-load', () => widgetWindow?.webContents.send('desktop:widget-data', latestWidgetData));
  void widgetWindow.loadFile(path.join(__dirname, 'desktop-widget.html'));
  return widgetWindow;
}

function positionDesktopWidget(widget) {
  const area = screen.getPrimaryDisplay().workArea;
  widget.setBounds({ x: area.x + area.width - 184, y: area.y, width: 184, height: area.height });
}

function showDesktopWidget() {
  const widget = createDesktopWidget();
  positionDesktopWidget(widget);
  void refreshDesktopWidget().finally(() => {
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
  if (piperServer?.child && !piperServer.child.killed && piperServer.voice === voice) return piperServer;
  if (piperServer) stopPiperServer();
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
    piperServer = null;
  };
  child.on('error', () => stopPending('piper-error'));
  child.on('exit', () => stopPending('piper-exited'));
  piperServer = {
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
  return piperServer;
}

function stopPiperServer() {
  if (!piperServer) return;
  try { piperServer.child.stdin.end(); } catch {}
  try { piperServer.child.kill(); } catch {}
  piperServer = null;
  piperWarmPromises.clear();
}

function warmPiperServer(voice) {
  if (piperWarmPromises.has(voice.slug)) return piperWarmPromises.get(voice.slug);
  const output = path.join(app.getPath('temp'), `czatbox-${voice.slug}-warm-${process.pid}.wav`);
  const warmPromise = getPiperServer(voice).request('.', output).then(result => {
    if (!result?.ok) throw new Error(result?.error || 'piper-warm-failed');
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
  if (!mainWindow || mainWindow.isDestroyed()) return;
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.show();
  mainWindow.focus();
  showDesktopWidget();
}

function destroyTray() {
  if (!tray) return;
  tray.destroy();
  tray = null;
}

function ensureTray() {
  if (!tray) {
    tray = new Tray(APP_ICON_PATH);
    tray.setToolTip('Czatbox TT');
    tray.on('click', showMainWindow);
  }
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Pokaż Czatbox TT', click: showMainWindow },
    { type: 'separator' },
    { label: 'Pasek pulpitu jest stale aktywny', enabled: false },
    { type: 'separator' },
    { label: 'Zamknij', click: () => { appIsQuitting = true; app.quit(); } }
  ]));
  return tray;
}

function setMinimizeToTray(enabled) {
  minimizeToTrayOnClose = Boolean(enabled);
  ensureTray();
  return minimizeToTrayOnClose;
}

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

function desktopPageFeatures() {
  if (window.__czatboxDesktopFeaturesInstalled) return;
  window.__czatboxDesktopFeaturesInstalled = true;

  window.addEventListener('cttm-desktop-open-workspace', event => {
    const workspace = String(event.detail || '');
    const target = document.querySelector(`[data-workspace="${workspace}"]`);
    if (target instanceof HTMLElement) target.click();
  });

  const style = document.createElement('style');
  style.id = 'desktopFeatureStyles';
  style.textContent = `
    html[data-platform="desktop"] #stats{display:none!important}
    .desktop-widget-dock{position:fixed;z-index:90;right:0;top:50%;display:grid;gap:8px;transform:translateY(-50%);pointer-events:none}
    .desktop-side-widget{display:flex;justify-content:flex-end;min-height:70px;pointer-events:auto}
    .desktop-widget-panel{display:none;width:310px;max-height:min(68vh,620px);overflow:auto;padding:14px;border:1px solid var(--line);border-right:0;border-radius:18px 0 0 18px;background:var(--panel);box-shadow:0 18px 55px #0009}
    .desktop-side-widget[data-expanded="true"] .desktop-widget-panel{display:block}
    .desktop-widget-panel h2{margin:0 0 5px;font-size:14px}.desktop-widget-panel>p{margin:0 0 11px;color:var(--muted);font-size:10px}
    .desktop-widget-panel .stat-dialog-content{padding:0;overflow:visible}.desktop-widget-panel .stat-empty{padding:18px 8px}
    .desktop-widget-tab{width:46px;min-height:70px;display:grid;place-items:center;align-content:center;gap:5px;border:1px solid var(--line);border-right:0;border-radius:14px 0 0 14px;background:var(--panel2);color:var(--cyan);box-shadow:0 12px 35px #0006}
    .desktop-widget-tab svg{width:19px;height:19px}.desktop-widget-tab span{font-size:8px;font-weight:900;letter-spacing:.05em}
    .desktop-widget-tab[aria-expanded="true"]{background:var(--accent);color:#fff;border-radius:0}
    @media(max-width:760px){.desktop-widget-panel{width:min(310px,calc(100vw - 54px))}}
  `;
  document.head.append(style);

  const settingsPage = document.querySelector('#settings');
  const desktopSettingsTarget = document.querySelector('#settings-data') || settingsPage;
  if (desktopSettingsTarget && !document.querySelector('#desktopBehaviorSettings')) {
    const group = document.createElement('div');
    group.id = 'desktopBehaviorSettings';
    group.className = 'settings-group';
    group.innerHTML = '<div class="group-head"><h2>System</h2><p>Zachowanie okna programu</p></div><div class="settings-card"><label class="setting-row"><span><b>Po kliknięciu X ukryj program w zasobniku</b><small>Czat i TTS nadal działają w tle. Program zamkniesz z menu ikony przy zegarze.</small></span><input id="desktopMinimizeToTray" class="switch" type="checkbox"></label></div>';
    const codesSection = document.querySelector('#settings-codes');
    if (codesSection?.parentElement) codesSection.parentElement.insertBefore(group, codesSection);
    else desktopSettingsTarget.prepend(group);
    const toggle = group.querySelector('#desktopMinimizeToTray');
    toggle.checked = localStorage.getItem('cttm-desktop-minimize-to-tray') === 'true';
    window.czatboxDesktop?.setMinimizeToTray(toggle.checked).catch(() => {});
    toggle.onchange = () => {
      localStorage.setItem('cttm-desktop-minimize-to-tray', String(toggle.checked));
      window.czatboxDesktop?.setMinimizeToTray(toggle.checked).catch(() => {});
    };
  }

  const widgetDefinitions = [
    { kind: 'gift', label: 'GIFT', title: 'Prezenty', icon: 'gift', count: 'giftCount' },
    { kind: 'topGifters', label: 'TOP', title: 'Top Gifterzy', icon: 'coin', count: 'topGifterCount' },
    { kind: 'envelope', label: 'BOX', title: 'Skrzynki', icon: 'box', count: 'boxCount' },
    { kind: 'viewers', label: 'GUEST', title: 'Widzowie', icon: 'viewers', count: 'viewerCount' }
  ];
  const dock = document.createElement('aside');
  dock.className = 'desktop-widget-dock';
  dock.setAttribute('aria-label', 'Przybornik statystyk LIVE');
  dock.innerHTML = widgetDefinitions.map(item => `<section class="desktop-side-widget" data-desktop-widget="${item.kind}" data-expanded="false"><div class="desktop-widget-panel"><h2>${item.title}</h2><p></p><div class="stat-dialog-content"></div></div><button class="desktop-widget-tab" type="button" aria-expanded="false" aria-label="Rozwiń: ${item.title}"><svg><use href="/icons.svg#${item.icon}"></use></svg><span>${item.label}</span></button></section>`).join('');
  document.body.append(dock);
  const toolboxToggle = document.querySelector('#toolbox');
  const syncToolboxVisibility = () => { dock.hidden = Boolean(toolboxToggle && !toolboxToggle.checked); };
  toolboxToggle?.addEventListener('change', syncToolboxVisibility);
  syncToolboxVisibility();

  const refreshWidget = item => {
    const widget = dock.querySelector(`[data-desktop-widget="${item.kind}"]`);
    if (!widget || widget.dataset.expanded !== 'true') return;
    const source = document.querySelector(`[data-stat-detail="${item.kind}"]`);
    const backdrop = document.querySelector('#statDialogBackdrop');
    if (source) source.click();
    const meta = document.querySelector('#statDialogMeta');
    const content = document.querySelector('#statDialogContent');
    widget.querySelector('.desktop-widget-panel>p').textContent = meta?.textContent || `Wartość: ${document.querySelector('#' + item.count)?.textContent || '0'}`;
    widget.querySelector('.stat-dialog-content').innerHTML = content?.innerHTML || '<p class="stat-empty">Brak danych.</p>';
    if (backdrop) backdrop.hidden = true;
  };
  dock.querySelectorAll('.desktop-side-widget').forEach(widget => {
    const item = widgetDefinitions.find(candidate => candidate.kind === widget.dataset.desktopWidget);
    const button = widget.querySelector('.desktop-widget-tab');
    button.onclick = () => {
      const open = widget.dataset.expanded !== 'true';
      dock.querySelectorAll('.desktop-side-widget').forEach(other => {
        other.dataset.expanded = 'false';
        other.querySelector('.desktop-widget-tab').setAttribute('aria-expanded', 'false');
      });
      widget.dataset.expanded = String(open);
      button.setAttribute('aria-expanded', String(open));
      if (open) refreshWidget(item);
    };
  });
  const statsObserver = new MutationObserver(() => {
    const open = dock.querySelector('.desktop-side-widget[data-expanded="true"]');
    if (open) refreshWidget(widgetDefinitions.find(item => item.kind === open.dataset.desktopWidget));
  });
  const stats = document.querySelector('#stats');
  if (stats) statsObserver.observe(stats, { childList: true, subtree: true, characterData: true });

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
    try {
      const selected = JSON.parse(localStorage.getItem('cttm-settings') || '{}').voice;
      if (desktopPiperVoices.some(([value]) => value === selected)) window.czatboxDesktop.warmPiper(selected).catch(() => {});
    } catch {}
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
  mainWindow.on('close', event => {
    if (appIsQuitting || quittingForUpdate || !minimizeToTrayOnClose) return;
    event.preventDefault();
    ensureTray();
    mainWindow.hide();
    showDesktopWidget();
  });
  mainWindow.on('minimize', showDesktopWidget);
  mainWindow.on('restore', showDesktopWidget);
  mainWindow.on('show', () => { if (!mainWindow?.isMinimized()) showDesktopWidget(); });

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
  mainWindow.on('closed', () => { mainWindow = null; if (!minimizeToTrayOnClose) destroyTray(); });
  const loadApp = async () => {
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
    showMainWindow();
  });

  app.whenReady().then(() => {
    session.fromPartition('persist:czatbox-tt').setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
    createWindow();
    ensureTray();
    setTimeout(showDesktopWidget, 1200);
    powerMonitor.on('resume', () => setTimeout(speakDesktopGreeting, 1200));
    configureUpdater();
  });

  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
  app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
  app.on('before-quit', event => {
    appIsQuitting = true;
    if (updateTimer) clearInterval(updateTimer);
    stopPiperServer();
    destroyTray();
    if (quittingForUpdate) return;
    if (mainWindow && !mainWindow.isDestroyed()) {
      try { mainWindow.webContents.session.flushStorageData(); } catch {}
    }
  });
}
