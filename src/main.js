const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const readline = require('readline');
const { app, BrowserWindow, shell, session, ipcMain, Menu, Tray, screen } = require('electron');
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
const APP_ICON_PATH = path.join(__dirname, 'assets', 'app-icon.ico');

let mainWindow = null;
let updateTimer = null;
let quittingForUpdate = false;
let piperServer = null;
let piperWarmPromise = null;
let tray = null;
let minimizeToTrayOnClose = false;
let appIsQuitting = false;
let widgetWindow = null;
let widgetTimer = null;
let latestWidgetData = { events: [], notes: [], language: 'pl', theme: 'dark', radio: { active: false, playing: false, muted: false, station: '', description: '' } };
const WIDGET_PREF_PATH = path.join(app.getPath('userData'), 'desktop-widget.json');
const RENDERER_CACHE_EPOCH = 'workspace-v93';
const RENDERER_CACHE_EPOCH_PATH = path.join(app.getPath('userData'), 'renderer-cache-epoch.txt');
let desktopWidgetPinned = (() => { try { return JSON.parse(fs.readFileSync(WIDGET_PREF_PATH, 'utf8')).pinned === true; } catch { return false; } })();
function saveWidgetPreference() { try { fs.writeFileSync(WIDGET_PREF_PATH, JSON.stringify({ pinned: desktopWidgetPinned })); } catch {} }

async function refreshDesktopWidget() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  try {
    const data = await mainWindow.webContents.executeJavaScript(`(() => { try { const events=JSON.parse(localStorage.getItem('cttm-calendar-events')||'[]'); const categories=JSON.parse(localStorage.getItem('cttm-calendar-categories')||'[]'); const settings=JSON.parse(localStorage.getItem('cttm-settings')||'{}'); const notes=(Array.isArray(settings.notebook)?settings.notebook:[]).slice().sort((a,b)=>Number(b.updatedAt||0)-Number(a.updatedAt||0)).slice(0,5).map(note=>({id:String(note.id||''),title:String(note.title||'Notatka'),updatedAt:Number(note.updatedAt||0)})); const radio=JSON.parse(localStorage.getItem('cttm-radio-state')||'{}'); const theme=document.documentElement.dataset.theme||'dark'; return {events:events.map(event=>{const category=categories.find(item=>item.id===event.categoryId)||{};return {...event,code:category.code||'',category:category.name||'',palette:{bg:(category.color||'#4fdde5')+'24',text:category.color||'#4fdde5',border:category.color||'#4fdde5'}}),notes,language:'pl',theme,radio}; } catch { return null; } })()`);
    if (data?.events) latestWidgetData = data;
    if (widgetWindow && !widgetWindow.isDestroyed()) widgetWindow.webContents.send('desktop:widget-data', latestWidgetData);
  } catch {}
}

function createDesktopWidget() {
  if (widgetWindow && !widgetWindow.isDestroyed()) return widgetWindow;
  const area = screen.getPrimaryDisplay().workArea, width = 300, height = area.height;
  widgetWindow = new BrowserWindow({ width, height, minWidth: width, minHeight: height, x: area.x + area.width - width - 12, y: area.y, frame: false, transparent: true, resizable: false, movable: false, show: false, skipTaskbar: true, focusable: true, hasShadow: true, alwaysOnTop: false, webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true, preload: path.join(__dirname, 'desktop-preload.js'), partition: 'persist:czatbox-tt' } });
  widgetWindow.setMenuBarVisibility(false);
  widgetWindow.on('close', event => { if (!appIsQuitting) { event.preventDefault(); widgetWindow.hide(); } });
  widgetWindow.webContents.on('did-finish-load', () => widgetWindow?.webContents.send('desktop:widget-data', latestWidgetData));
  void widgetWindow.loadFile(path.join(__dirname, 'desktop-widget.html'));
  return widgetWindow;
}

function showDesktopWidget() { const widget=createDesktopWidget(); void refreshDesktopWidget().finally(()=>widget.showInactive()); if(!widgetTimer)widgetTimer=setInterval(refreshDesktopWidget,15000); }
function hideDesktopWidget(force = false) { if (!force && desktopWidgetPinned) return; if(widgetTimer){clearInterval(widgetTimer);widgetTimer=null}if(widgetWindow&&!widgetWindow.isDestroyed())widgetWindow.hide(); }

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

function getPiperServer() {
  if (piperServer?.child && !piperServer.child.killed) return piperServer;
  const child = spawn(PIPER_EXECUTABLE, ['--server', '--model', MR_DRWINA_MODEL], {
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
  piperWarmPromise = null;
}

function warmPiperServer() {
  if (piperWarmPromise) return piperWarmPromise;
  const output = path.join(app.getPath('temp'), `czatbox-mr-drwina-warm-${process.pid}.wav`);
  piperWarmPromise = getPiperServer().request('.', output).then(result => {
    if (!result?.ok) throw new Error(result?.error || 'piper-warm-failed');
    return { ok: true };
  }).catch(error => {
    piperWarmPromise = null;
    return { ok: false, error: error?.message || 'piper-warm-failed' };
  }).finally(() => {
    try { fs.rmSync(output, { force: true }); } catch {}
  });
  return piperWarmPromise;
}

function showMainWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.show();
  mainWindow.focus();
  hideDesktopWidget();
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
    { label: 'Przypnij widgety na pulpicie', type: 'checkbox', checked: desktopWidgetPinned, click: item => { desktopWidgetPinned = item.checked; saveWidgetPreference(); if (desktopWidgetPinned) showDesktopWidget(); else if (mainWindow && !mainWindow.isDestroyed() && mainWindow.isVisible() && !mainWindow.isMinimized()) hideDesktopWidget(true); ensureTray(); } },
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
    group.innerHTML = '<div class="group-head"><h2>Wersja desktopowa</h2><p>Zachowanie okna programu</p></div><div class="settings-card"><label class="setting-row"><span><b>Po kliknięciu X ukryj program w zasobniku</b><small>Czat i TTS nadal działają w tle. Program zamkniesz z menu ikony przy zegarze.</small></span><input id="desktopMinimizeToTray" class="switch" type="checkbox"></label></div>';
    desktopSettingsTarget.prepend(group);
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
  const ensurePiperOption = () => {
    if (!voiceSelect) return;
    if (!voiceSelect.querySelector('option[value="piper-mr-drwina"]')) {
      const option = document.createElement('option');
      option.value = 'piper-mr-drwina';
      option.textContent = 'Mr. Drwina — Piper (desktop)';
      voiceSelect.append(option);
    }
    try {
      const selected = JSON.parse(localStorage.getItem('cttm-settings') || '{}').voice;
      if (selected === 'piper-mr-drwina') voiceSelect.value = selected;
    } catch {}
  };
  ensurePiperOption();
  if (voiceSelect) {
    new MutationObserver(ensurePiperOption).observe(voiceSelect, { childList: true });
    voiceSelect.addEventListener('change', () => {
      if (voiceSelect.value === 'piper-mr-drwina') window.czatboxDesktop?.warmMrDrwina().catch(() => {});
    });
  }

  if (window.czatboxDesktop?.synthesizeMrDrwina && !window.speechSynthesis.__mrDrwinaPatched) {
    const speech = window.speechSynthesis;
    const originalSpeak = speech.speak.bind(speech);
    const originalCancel = speech.cancel.bind(speech);
    let piperAudio = null;
    let piperAudioContext = null;
    let piperAudioSource = null;
    let piperGain = null;
    speech.__mrDrwinaPatched = true;
    speech.speak = utterance => {
      let selected = '';
      let settings = {};
      try { settings = JSON.parse(localStorage.getItem('cttm-settings') || '{}'); selected = settings.voice || ''; } catch {}
      if (selected !== 'piper-mr-drwina') return originalSpeak(utterance);
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
      if (!settings.tts) return finish(false);
      if (settings.cleanSpeech) {
        const spokenText = String(utterance.text || '').toLowerCase();
        const rejected = /(.)\1{5,}/.test(spokenText) || /(https?:\/\/|www\.)/.test(spokenText) || spokenText.length > 320 || /\b(?:kurw\w*|chuj\w*|pierdol\w*|jeb\w*|skurwysyn\w*|pizd\w*|cipa\w*)\b/i.test(spokenText);
        if (rejected) return finish(false);
      }
      window.czatboxDesktop.synthesizeMrDrwina(utterance.text).then(result => {
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
      if (JSON.parse(localStorage.getItem('cttm-settings') || '{}').voice === 'piper-mr-drwina') window.czatboxDesktop.warmMrDrwina().catch(() => {});
    } catch {}
  }
}

function applyDesktopFeatures() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  return mainWindow.webContents.executeJavaScript(`(${desktopPageFeatures.toString()})()`, true).catch(() => {});
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

ipcMain.handle('desktop:warm-mr-drwina', async () => {
  if (!fs.existsSync(PIPER_EXECUTABLE) || !fs.existsSync(MR_DRWINA_MODEL)) {
    return { ok: false, error: 'piper-unavailable' };
  }
  try {
    return await warmPiperServer();
  } catch (error) {
    return { ok: false, error: error?.message || 'piper-failed' };
  }
});

ipcMain.handle('desktop:synthesize-mr-drwina', async (_event, rawText) => {
  if (!fs.existsSync(PIPER_EXECUTABLE) || !fs.existsSync(MR_DRWINA_MODEL)) {
    return { ok: false, error: 'piper-unavailable' };
  }
  const text = sanitizePiperText(rawText).slice(0, 600);
  if (!text) return { ok: false, error: 'empty-text' };
  const output = path.join(app.getPath('temp'), `czatbox-mr-drwina-${Date.now()}-${Math.random().toString(16).slice(2)}.wav`);
  try {
    const result = await getPiperServer().request(text, output);
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
ipcMain.on('desktop:radio-control', (event, action) => {
  if (!widgetWindow || event.sender !== widgetWindow.webContents || !['toggle-play','toggle-mute'].includes(action) || !mainWindow || mainWindow.isDestroyed()) return;
  void mainWindow.webContents.executeJavaScript(`window.dispatchEvent(new CustomEvent('cttm-radio-control',{detail:${JSON.stringify(action)}}))`);
  setTimeout(refreshDesktopWidget, 350);
});
ipcMain.on('desktop:open-note', (event, id) => {
  if (!widgetWindow || event.sender !== widgetWindow.webContents || !mainWindow || mainWindow.isDestroyed()) return;
  mainWindow.show();
  mainWindow.focus();
  void mainWindow.webContents.executeJavaScript(`window.dispatchEvent(new CustomEvent('cttm-widget-open-note',{detail:${JSON.stringify(String(id || ''))}}))`);
});
ipcMain.on('desktop:widget-refresh', event => {
  if (!mainWindow || event.sender !== mainWindow.webContents) return;
  void refreshDesktopWidget();
});
ipcMain.on('desktop:widget-sync', (event, data) => {
  if (!mainWindow || event.sender !== mainWindow.webContents || !data || !Array.isArray(data.events)) return;
  latestWidgetData = {
    events: data.events.slice(-2000),
    notes: Array.isArray(data.notes) ? data.notes.slice(0, 5) : [],
    language: 'pl',
    theme: String(data.theme || 'dark-titanium'),
    radio: data.radio && typeof data.radio === 'object' ? data.radio : { active: false, playing: false, muted: false, station: '', description: '' }
  };
  if (widgetWindow && !widgetWindow.isDestroyed()) widgetWindow.webContents.send('desktop:widget-data', latestWidgetData);
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
  mainWindow.on('restore', () => hideDesktopWidget());
  mainWindow.on('show', () => { if (!mainWindow?.isMinimized()) hideDesktopWidget(); });

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
    if (process.env.CZATBOX_UPDATE_PREVIEW === '1') {
      pushUpdateUi({ title: 'Dostępna aktualizacja', text: 'Dostępna jest wersja testowa 0.3.6. Pobrać ją teraz?', button: 'Pobierz', action: 'download', dismissible: true });
    }
  });
  mainWindow.webContents.on('did-fail-load', (_event, errorCode, _description, validatedUrl, isMainFrame) => {
    if (!isMainFrame || errorCode === -3 || !isAllowedAppUrl(validatedUrl)) return;
    void mainWindow.loadFile(path.join(__dirname, 'shell', 'offline.html'));
  });
  mainWindow.once('ready-to-show', () => mainWindow?.show());
  mainWindow.on('closed', () => { mainWindow = null; hideDesktopWidget(); if (!minimizeToTrayOnClose) destroyTray(); });
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
    if (desktopWidgetPinned) setTimeout(showDesktopWidget, 2500);
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
