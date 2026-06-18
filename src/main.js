const fs = require('node:fs');
const path = require('node:path');
const { app, BaseWindow, WebContentsView, ipcMain, Menu, Tray, session, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const { TikTokLiveConnection, WebcastEvent, ControlEvent } = require('tiktok-live-connector');

const LOGIN_URL = 'https://www.tiktok.com/login';
const PARTITION = 'persist:tiktok-live-session';
const ARCHIVE_DIR = path.join(app.isPackaged ? app.getPath('userData') : app.getAppPath(), 'archives');
const SYSTEM_SETTINGS_FILE = path.join(app.getPath('userData'), 'system-settings.json');
const TRANSMISSION_ARCHIVE_PREFIX = 'transmisja-';
const AVATAR_DIR = path.join(__dirname, 'pic');
const APP_ICON_PATH = path.join(__dirname, 'assets', 'app-icon.ico');
const AVATAR_EXTENSIONS = new Set(['.gif', '.jpg', '.jpeg', '.png', '.webp']);
const PROGRAM_AUTHOR_UNIQUE_ID = 'bakus.03';
const PROGRAM_AUTHOR_JOIN_TEXT = 'Budzimy śpiocha, Baksik dołączył do LIVE!';
const APP_VERSION = app.getVersion();
const UPDATE_CHECK_INTERVAL_MS = 30 * 60 * 1000;
const START_BACKGROUND_ARG = '--czatbox-background';
const DEFAULT_SYSTEM_SETTINGS = {
  autoLaunch: false,
  runInBackground: false,
  minimizeToTrayOnClose: false,
  language: 'pl',
  timeFormat: 'auto'
};
const SYSTEM_LANGUAGES = new Set(['pl', 'en', 'de']);
const SYSTEM_TIME_FORMATS = new Set(['auto', '12', '24']);
const LIVE_CREATORS = [
  {
    id: 'teambibii',
    label: 'Kama (@teambibii)',
    username: 'teambibii',
    avatar: 'assets/recommended/teambibii.jpg',
    bio: '🌺 Live codziennie! 🌺\nIg: kama_sarnat',
    liveUrl: 'https://www.tiktok.com/@teambibii/live?enter_from_merge=others_homepage&enter_method=others_photo'
  },
  {
    id: 'wiktoriaartystycznie',
    label: 'Wiktoria (@wiktoriaartystycznie)',
    username: 'wiktoriaartystycznie',
    avatar: 'assets/recommended/wiktoriaartystycznie.jpg',
    bio: 'Live codziennie!🥀',
    liveUrl: 'https://www.tiktok.com/@wiktoriaartystycznie/live?enter_from_merge=homepage_hot&enter_method=live_entrance_hover_list'
  },
  {
    id: 'panzwarzywniaka',
    label: 'Pan z warzywniaka (@panzwarzywniaka)',
    username: 'panzwarzywniaka',
    avatar: 'assets/recommended/panzwarzywniaka.jpg',
    bio: 'TOP 1 24.12.25/16.01/08.04\n@Polishciuciu 💥💥💥 @🐺Tarocistka Tarrin🐺 @iss142816 @DJ Pedro 🎶🎶 @Beny 🧔🎶 @💙Dawid_Montana🩷🐺💜🦁☠️🐸',
    liveUrl: 'https://www.tiktok.com/@panzwarzywniaka/live?enter_from_merge=homepage_hot&enter_method=live_entrance_hover_list'
  },
  {
    id: 'ko_bial',
    label: 'Ko Bial (@ko_bial)',
    username: 'ko_bial',
    avatar: 'assets/recommended/ko_bial.jpg',
    bio: 'Fico-@Lombard🎯 Wokalista',
    liveUrl: 'https://www.tiktok.com/@ko_bial/live?enter_from_merge=homepage_hot&enter_method=live_entrance_hover_list'
  },
  {
    id: 'milusia313',
    label: 'Milusia (@milusia313)',
    username: 'milusia313',
    liveUrl: 'https://www.tiktok.com/@milusia313/live?enter_from_merge=homepage_hot&enter_method=live_entrance_hover_list'
  },
  {
    id: 'lovecraft331',
    label: 'Lovecraft (@lovecraft331)',
    username: 'lovecraft331',
    avatar: 'assets/recommended/lovecraft331.jpg',
    bio: 'Oddaje Obserwacje 💗💗',
    liveUrl: 'https://www.tiktok.com/@lovecraft331/live?enter_from_merge=others_homepage&enter_method=others_photo'
  },
  {
    id: 'chill.serwis',
    label: 'Chill Serwis (@chill.serwis)',
    username: 'chill.serwis',
    avatar: 'assets/recommended/chill-serwis.jpg',
    bio: 'Serwisant z wieloletnim doświadczeniem 👊\nIG: chillserwis',
    liveUrl: 'https://www.tiktok.com/@chill.serwis/live?enter_from_merge=homepage_hot&enter_method=live_entrance_hover_list'
  },
  {
    id: 'patryyyk176',
    label: 'Patryk (@patryyyk176)',
    username: 'patryyyk176',
    avatar: 'assets/recommended/patryyyk176.jpg',
    bio: '🇵🇱 w 🇳🇱\nNie biuro. Budowa 🛠️🏗️\nŻycie i praca w Holandii\nWieczorami 🎮⚽️\n🔴Live na przerwie i wieczorami',
    liveUrl: 'https://www.tiktok.com/@patryyyk176/live'
  },
  {
    id: 'krzysztofzdziars9',
    label: 'Krzysztof (@krzysztofzdziars9)',
    username: 'krzysztofzdziars9',
    liveUrl: 'https://www.tiktok.com/@krzysztofzdziars9/live?enter_from_merge=homepage_hot&enter_method=live_entrance_hover_list'
  },
  {
    id: 'szwagierkaqueen',
    label: 'Szwagierka Queen (@szwagierkaqueen)',
    username: 'szwagierkaqueen',
    liveUrl: 'https://www.tiktok.com/@szwagierkaqueen/live?enter_from_merge=live_detail&enter_method=live_entrance_hover_list'
  }
];
const DEFAULT_CREATOR_ID = LIVE_CREATORS[0].id;
const TIKTOK_POLISH_PARAMS = {
  app_language: 'pl',
  browser_language: 'pl-PL',
  webcast_language: 'pl',
  language: 'pl-PL',
  locale: 'pl-PL',
  priority_region: 'PL',
  region: 'PL'
};

const REQUIRED_AUTH_COOKIE_NAMES = new Set([
  'sessionid',
  'sessionid_ss',
  'sid_tt',
  'sid_guard',
  'multi_sids'
]);

const SUPPORTING_AUTH_COOKIE_NAMES = new Set([
  'uid_tt',
  'uid_tt_ss',
  'passport_auth_status',
  'passport_auth_status_ss',
  'sid_ucp_v1',
  'ssid_ucp_v1',
  'tt_session_tlb_tag'
]);

const TIKTOK_OWNED_HOSTS = [
  'tiktok.com',
  'tiktokv.com',
  'tiktokw.eu',
  'tiktokcdn.com',
  'tiktokcdn-us.com',
  'tiktokcdn-eu.com',
  'muscdn.com',
  'musical.ly',
  'byteoversea.com',
  'byteintlapi.com',
  'ibytedtos.com'
];

const OAUTH_HOSTS = [
  'accounts.google.com',
  'google.com',
  'gstatic.com',
  'recaptcha.net',
  'appleid.apple.com',
  'facebook.com',
  'fb.com',
  'line.me',
  'access.line.me',
  'kauth.kakao.com',
  'twitter.com',
  'x.com',
  'open.weixin.qq.com',
  'oauth.telegram.org'
];

let mainWindow;
let shellView;
let loginView;
let tiktokSession;
let authPoll;
let archiveFile;
let archiveSession;
let liveConnection;
let isConnecting = false;
let connectionAttemptId = 0;
let reconnectTimer;
let battleActive = false;
let lastBattleAlertKey = '';
let lastBattleAlertAt = 0;
let tray;
let isQuitting = false;
let systemSettings = loadSystemSettings();
let customCreator = null;

const recentMessages = [];
const seenMessageKeys = new Map();
const likeTotalsByUser = new Map();
const state = {
  mode: 'login',
  loggedIn: false,
  lastMessage: 'Logowanie',
  archiveDir: ARCHIVE_DIR,
  source: 'rozlaczony',
  appVersion: APP_VERSION,
  systemSettings: getPublicSystemSettings(),
  creatorId: DEFAULT_CREATOR_ID,
  currentCreator: publicCreator(LIVE_CREATORS[0]),
  creators: LIVE_CREATORS.map(({ id, label, username, avatar, bio }) => ({ id, label, username, avatar, bio })),
  avatarImages: getAvatarImages()
};

function normalizeSystemSettings(value) {
  const next = { ...DEFAULT_SYSTEM_SETTINGS, ...(value && typeof value === 'object' ? value : {}) };
  return {
    autoLaunch: Boolean(next.autoLaunch),
    runInBackground: Boolean(next.runInBackground),
    minimizeToTrayOnClose: Boolean(next.minimizeToTrayOnClose),
    language: SYSTEM_LANGUAGES.has(next.language) ? next.language : DEFAULT_SYSTEM_SETTINGS.language,
    timeFormat: SYSTEM_TIME_FORMATS.has(next.timeFormat) ? next.timeFormat : DEFAULT_SYSTEM_SETTINGS.timeFormat
  };
}

function loadSystemSettings() {
  try {
    return normalizeSystemSettings(JSON.parse(fs.readFileSync(SYSTEM_SETTINGS_FILE, 'utf8')));
  } catch {
    return { ...DEFAULT_SYSTEM_SETTINGS };
  }
}

function saveSystemSettings() {
  fs.mkdirSync(path.dirname(SYSTEM_SETTINGS_FILE), { recursive: true });
  fs.writeFileSync(SYSTEM_SETTINGS_FILE, JSON.stringify(systemSettings, null, 2), 'utf8');
}

function getPublicSystemSettings() {
  return { ...systemSettings };
}

function syncSystemSettingsState() {
  state.systemSettings = getPublicSystemSettings();
}

function getCurrentCreator() {
  return LIVE_CREATORS.find((creator) => creator.id === state.creatorId)
    || customCreator
    || LIVE_CREATORS[0];
}

function publicCreator(creator) {
  return {
    id: creator.id,
    label: creator.label || `@${creator.username}`,
    username: creator.username,
    avatar: creator.avatar || '',
    bio: creator.bio || '',
    custom: Boolean(creator.custom)
  };
}

function syncCurrentCreatorState(creator = getCurrentCreator()) {
  state.creatorId = creator.id;
  state.currentCreator = publicCreator(creator);
}

function normalizeCreatorHandle(value) {
  if (typeof value !== 'string') {
    return '';
  }

  const raw = value.trim();
  if (!raw) {
    return '';
  }

  const labelMatch = raw.match(/\(@([^)]+)\)/);
  if (labelMatch) {
    return normalizeCreatorHandle(labelMatch[1]);
  }

  try {
    const parsed = new URL(raw.includes('://') ? raw : `https://${raw}`);
    const pathMatch = parsed.pathname.match(/\/@([^/?#]+)/);
    if (pathMatch) {
      return normalizeCreatorHandle(pathMatch[1]);
    }
  } catch {
    // Fall back to plain text normalization below.
  }

  return raw
    .replace(/^@+/, '')
    .replace(/^https?:\/\/(?:www\.)?tiktok\.com\/@?/i, '')
    .replace(/\/live(?:[/?#].*)?$/i, '')
    .replace(/[?#].*$/, '')
    .replace(/[^\w.]+/g, '')
    .toLowerCase();
}

function resolveCreator(input) {
  const handle = normalizeCreatorHandle(input);
  if (!handle) {
    return null;
  }

  const known = LIVE_CREATORS.find((creator) => (
    normalizeCreatorHandle(creator.id) === handle
    || normalizeCreatorHandle(creator.username) === handle
    || normalizeCreatorHandle(creator.label) === handle
  ));
  if (known) {
    return known;
  }

  return {
    id: `custom:${handle}`,
    label: `@${handle}`,
    username: handle,
    custom: true,
    liveUrl: `https://www.tiktok.com/@${encodeURIComponent(handle)}/live`
  };
}

function getAvatarImages() {
  try {
    return fs.readdirSync(AVATAR_DIR, { withFileTypes: true })
      .filter((item) => item.isFile() && AVATAR_EXTENSIONS.has(path.extname(item.name).toLowerCase()))
      .map((item) => `../pic/${encodeURIComponent(item.name)}`)
      .sort((a, b) => a.localeCompare(b));
  } catch {
    return [];
  }
}

function eventBelongsToActiveConnection(connection, creator) {
  return liveConnection === connection && state.creatorId === creator.id;
}

function ensureArchiveDir() {
  fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
}

function getLocalDateParts(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return {
    date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    time: `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`,
    fileTime: `${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`
  };
}

function getUniqueArchivePath(baseName) {
  let candidate = path.join(ARCHIVE_DIR, `${baseName}.txt`);
  let index = 2;

  while (fs.existsSync(candidate)) {
    candidate = path.join(ARCHIVE_DIR, `${baseName}-${index}.txt`);
    index += 1;
  }

  return candidate;
}

function buildArchiveHeader(session) {
  const timeRange = session.endTime ? `${session.time} - ${session.endTime}` : session.time;
  return [
    'Czatbox TT - archiwum transmisji',
    `Data: ${session.date}`,
    `Godzina: ${timeRange}`,
    `Nazwa live: ${session.name}`,
    `Tworca: @${session.username}`,
    '',
    '-----------------------------------------------------------------------------',
    ''
  ].join('\n');
}

function startArchiveSession(creator) {
  ensureArchiveDir();

  const startedAt = new Date();
  const parts = getLocalDateParts(startedAt);
  const safeUsername = creator.username.replace(/[^\w.-]+/g, '_');
  const baseName = `${TRANSMISSION_ARCHIVE_PREFIX}${parts.date}_${parts.fileTime}-${safeUsername}`;
  archiveFile = getUniqueArchivePath(baseName);
  archiveSession = {
    id: path.basename(archiveFile),
    path: archiveFile,
    creatorId: creator.id,
    username: creator.username,
    name: `@${creator.username}`,
    date: parts.date,
    time: parts.time,
    startedAt: startedAt.toISOString()
  };
  recentMessages.length = 0;

  fs.writeFileSync(archiveFile, buildArchiveHeader(archiveSession), 'utf8');
}

function ensureArchiveSession() {
  if (!archiveSession || !archiveFile) {
    startArchiveSession(getCurrentCreator());
  }
}

function buildArchiveBody() {
  return recentMessages
    .map((item) => `[${formatArchiveTime(item.timestamp)}] ${item.archiveText || item.text}`)
    .join('\n');
}

function writeFullArchiveFile() {
  ensureArchiveSession();
  const body = buildArchiveBody();
  const text = `${buildArchiveHeader(archiveSession)}${body}${body ? '\n' : ''}`;
  fs.writeFileSync(archiveFile, text, 'utf8');
}

function finalizeArchiveSession(endDate = new Date()) {
  if (!archiveSession || !archiveFile || !fs.existsSync(archiveFile)) {
    return;
  }

  archiveSession.endTime = getLocalDateParts(endDate).time;
  writeFullArchiveFile();
}

function resetChatBuffers() {
  recentMessages.length = 0;
  seenMessageKeys.clear();
  likeTotalsByUser.clear();
  battleActive = false;
  archiveFile = '';
  archiveSession = null;
}

function archiveChatMessage(message) {
  message = message || {};
  const text = normalizeMessageText(message && message.text);
  const archiveText = normalizeMessageText(message && message.archiveText) || buildArchiveText(message);
  if (!text && !archiveText) {
    return;
  }

  if (isDuplicateMessage(message, archiveText || text)) {
    return;
  }

  ensureArchiveSession();

  const timestamp = message.time || new Date().toISOString();
  const payload = {
    id: message.id ? String(message.id) : '',
    timestamp,
    text,
    archiveText: archiveText || text,
    kind: message.kind || 'chat',
    authorName: normalizeMessageText(message.authorName),
    uniqueId: normalizeMessageText(message.uniqueId),
    isModerator: Boolean(message.isModerator),
    upsert: Boolean(message.upsert)
  };
  [
    'textKey',
    'giftName',
    'repeatCount',
    'giftCost',
    'boxKey',
    'audienceCount',
    'total',
    'shareCount'
  ].forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(message, key)) {
      payload[key] = message[key];
    }
  });
  const line = `[${formatArchiveTime(timestamp)}] ${payload.archiveText}\n`;

  const existingIndex = payload.upsert && payload.id
    ? recentMessages.findIndex((item) => item.id === payload.id)
    : -1;

  if (existingIndex >= 0) {
    recentMessages[existingIndex] = payload;
    writeFullArchiveFile();
    sendToShell('shell:chat-message', payload);
    return;
  }

  fs.appendFileSync(archiveFile, line, 'utf8');

  recentMessages.push(payload);
  sendToShell('shell:chat-message', payload);
}

function buildArchiveText(message) {
  const author = normalizeMessageText(message && message.authorName);
  const uniqueId = normalizeMessageText(message && message.uniqueId);
  const text = normalizeMessageText(message && message.text);

  if (author && uniqueId) {
    return `${author} (@${uniqueId}): ${text}`;
  }

  if (author) {
    return `${author}: ${text}`;
  }

  return text;
}

function isDuplicateMessage(message, text) {
  if (message && message.upsert) {
    return false;
  }

  const now = Date.now();
  const id = message && message.id ? String(message.id) : '';
  const key = id || text;
  const ttl = id ? 10 * 60 * 1000 : 6000;

  for (const [cachedKey, timestamp] of seenMessageKeys) {
    if (now - timestamp > 10 * 60 * 1000) {
      seenMessageKeys.delete(cachedKey);
    }
  }

  const lastSeen = seenMessageKeys.get(key);
  if (lastSeen && now - lastSeen < ttl) {
    return true;
  }

  seenMessageKeys.set(key, now);
  return false;
}

function normalizeMessageText(text) {
  if (typeof text !== 'string') {
    return '';
  }

  return text
    .replace(/\s+/g, ' ')
    .replace(/\u200b/g, '')
    .trim()
    .slice(0, 1200);
}

function formatArchiveTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

function remoteWebPreferences() {
  return {
    partition: PARTITION,
    nodeIntegration: false,
    contextIsolation: true,
    nativeWindowOpen: true,
    sandbox: true,
    webSecurity: true,
    javascript: true,
    devTools: true
  };
}

function createRemoteView() {
  const view = new WebContentsView({ webPreferences: remoteWebPreferences() });
  view.webContents.setUserAgent(chromeLikeUserAgent());
  view.webContents.setAudioMuted(true);
  installRemoteGuards(view);
  installShortcuts(view);
  installMediaMute(view);
  return view;
}

function getTikTokRequestUrlPatterns() {
  return TIKTOK_OWNED_HOSTS.flatMap((host) => [
    `https://${host}/*`,
    `https://*.${host}/*`
  ]);
}

function installTikTokSessionTweaks() {
  tiktokSession.webRequest.onBeforeSendHeaders(
    { urls: getTikTokRequestUrlPatterns() },
    (details, callback) => {
      details.requestHeaders['Accept-Language'] = 'pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7';
      details.requestHeaders['User-Agent'] = chromeLikeUserAgent();
      callback({ requestHeaders: details.requestHeaders });
    }
  );
}

function installLoginStateWatchers(view) {
  const check = () => {
    if (state.mode === 'login') {
      checkLoginState().catch(() => {});
    }
  };

  view.webContents.on('did-navigate', check);
  view.webContents.on('did-navigate-in-page', check);
  view.webContents.on('did-redirect-navigation', check);
  view.webContents.on('did-finish-load', check);
  view.webContents.on('did-fail-load', (_event, code, description, url) => {
    if (code === -3 || state.mode !== 'login') {
      return;
    }

    state.lastMessage = `Nie udało się załadować logowania: ${description || url || code}`;
    publishState();
  });
}

function chromeLikeUserAgent() {
  const fallback = app.userAgentFallback || '';
  const userAgent = fallback
    .replace(/\sElectron\/[^\s]+/g, '')
    .replace(/\sTiktokLiveElectron\/[^\s]+/g, '')
    .trim();

  return userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36';
}

function installRemoteGuards(view) {
  view.webContents.on('will-navigate', (event, url) => {
    if (!isAllowedNavigation(url)) {
      event.preventDefault();
      shell.openExternal(url).catch(() => {});
    }
  });

  view.webContents.setWindowOpenHandler(({ url }) => {
    if (!isAllowedNavigation(url)) {
      shell.openExternal(url).catch(() => {});
      return { action: 'deny' };
    }

    return {
      action: 'allow',
      overrideBrowserWindowOptions: {
        width: 960,
        height: 760,
        backgroundColor: '#101114',
        webPreferences: remoteWebPreferences()
      }
    };
  });
}

function isAllowedNavigation(url) {
  try {
    if (url === 'about:blank' || url.startsWith('chrome-error://')) {
      return true;
    }

    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') {
      return false;
    }

    const host = parsed.hostname.toLowerCase();
    return TIKTOK_OWNED_HOSTS.some((allowed) => host === allowed || host.endsWith(`.${allowed}`))
      || OAUTH_HOSTS.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
  } catch {
    return false;
  }
}

function installShortcuts(view) {
  view.webContents.on('before-input-event', (event, input) => {
    const key = input.key.toLowerCase();

    if (key === 'f5' || ((input.control || input.meta) && key === 'r')) {
      event.preventDefault();
      reloadCurrentMode();
    }

    if ((input.control || input.meta) && input.shift && key === 'i') {
      event.preventDefault();
      view.webContents.openDevTools({ mode: 'detach' });
    }

    if ((input.control || input.meta) && input.shift && key === 'l') {
      event.preventDefault();
      showLoginMode().catch(() => {});
    }
  });
}

function installMediaMute(view) {
  const mute = () => {
    view.webContents.setAudioMuted(true);
    view.webContents.executeJavaScript(`(${muteRemoteMedia.toString()})()`, true).catch(() => {});
  };

  view.webContents.on('dom-ready', mute);
  view.webContents.on('did-finish-load', mute);
}

function getTrayLabels() {
  const language = systemSettings.language;
  if (language === 'en') {
    return { show: 'Show Czatbox TT', quit: 'Quit' };
  }
  if (language === 'de') {
    return { show: 'Czatbox TT anzeigen', quit: 'Beenden' };
  }
  return { show: 'Pokaż Czatbox TT', quit: 'Zamknij' };
}

function shouldKeepTray() {
  return Boolean(systemSettings.runInBackground || systemSettings.minimizeToTrayOnClose);
}

function showMainWindow() {
  if (!mainWindow) {
    return;
  }

  mainWindow.show();
  mainWindow.focus();
  layoutViews();
}

function ensureTray() {
  if (tray) {
    updateTrayMenu();
    return;
  }

  tray = new Tray(APP_ICON_PATH);
  tray.setToolTip('Czatbox TT');
  tray.on('click', showMainWindow);
  updateTrayMenu();
}

function updateTrayMenu() {
  if (!tray) {
    return;
  }

  const labels = getTrayLabels();
  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: labels.show,
      click: showMainWindow
    },
    { type: 'separator' },
    {
      label: labels.quit,
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]));
}

function syncTray() {
  if (shouldKeepTray()) {
    ensureTray();
    return;
  }

  if (tray) {
    tray.destroy();
    tray = null;
  }
}

function hideMainWindowToTray() {
  if (!mainWindow) {
    return;
  }

  ensureTray();
  mainWindow.hide();
}

function syncLoginItemSettings() {
  try {
    app.setLoginItemSettings({
      openAtLogin: Boolean(systemSettings.autoLaunch),
      path: app.getPath('exe'),
      args: systemSettings.runInBackground ? [START_BACKGROUND_ARG] : []
    });
  } catch (error) {
    console.error('Login item update failed:', error);
  }
}

function applySystemSettings() {
  syncSystemSettingsState();
  syncLoginItemSettings();
  syncTray();
}

function updateSystemSettings(patch) {
  systemSettings = normalizeSystemSettings({ ...systemSettings, ...(patch || {}) });
  saveSystemSettings();
  applySystemSettings();
  publishState();
  return getPublicSystemSettings();
}

async function createWindow() {
  Menu.setApplicationMenu(null);
  ensureArchiveDir();
  applySystemSettings();

  tiktokSession = session.fromPartition(PARTITION);
  tiktokSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    callback(permission === 'notifications');
  });
  installTikTokSessionTweaks();

  mainWindow = new BaseWindow({
    width: 1180,
    height: 820,
    minWidth: 720,
    minHeight: 520,
    minimizable: true,
    maximizable: true,
    resizable: true,
    title: 'Czatbox TT - czat LIVE',
    icon: APP_ICON_PATH,
    backgroundColor: '#101114'
  });

  loginView = createRemoteView();
  installLoginStateWatchers(loginView);
  shellView = new WebContentsView({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      devTools: true
    }
  });

  mainWindow.contentView.addChildView(loginView);
  mainWindow.contentView.addChildView(shellView);

  shellView.webContents.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  loginView.webContents.loadURL(LOGIN_URL).catch(() => {});
  loginView.webContents.setAudioMuted(true);

  shellView.webContents.on('did-finish-load', () => publishState());

  mainWindow.on('resize', layoutViews);
  mainWindow.on('maximize', layoutViews);
  mainWindow.on('unmaximize', layoutViews);
  mainWindow.on('enter-full-screen', layoutViews);
  mainWindow.on('leave-full-screen', layoutViews);
  mainWindow.on('close', (event) => {
    if (isQuitting || !systemSettings.minimizeToTrayOnClose) {
      return;
    }

    event.preventDefault();
    hideMainWindowToTray();
  });
  mainWindow.on('closed', () => {
    finalizeArchiveSession();
    clearInterval(authPoll);
    clearTimeout(reconnectTimer);
    disconnectLiveConnection();
    [shellView, loginView].forEach((view) => {
      if (view && !view.webContents.isDestroyed()) {
        view.webContents.close();
      }
    });
    mainWindow = null;
  });

  tiktokSession.cookies.on('changed', () => {
    checkLoginState().catch(() => {});
  });

  layoutViews();
  authPoll = setInterval(() => {
    if (state.mode === 'login') {
      checkLoginState().catch(() => {});
    }
  }, 2500);

  await checkLoginState();

  if ((systemSettings.runInBackground || process.argv.includes(START_BACKGROUND_ARG)) && !isSmokeRun()) {
    hideMainWindowToTray();
  }
}

function layoutViews() {
  if (!mainWindow || !shellView) {
    return;
  }

  const { width, height } = mainWindow.getContentBounds();

  if (state.mode === 'login') {
    loginView.setVisible(true);
    loginView.setBounds({ x: 0, y: 0, width, height });
    shellView.setVisible(false);
  } else {
    loginView.setVisible(false);

    shellView.setVisible(true);
    shellView.setBounds({ x: 0, y: 0, width, height });
    mainWindow.contentView.addChildView(shellView);
  }
}

async function checkLoginState() {
  const loggedIn = await hasTikTokLoginCookie();
  state.loggedIn = loggedIn;

  if (loggedIn && state.mode === 'login') {
    await showChatMode();
    return;
  }

  publishState();
}

async function hasTikTokLoginCookie() {
  const cookieGroups = await Promise.all([
    tiktokSession.cookies.get({ domain: '.tiktok.com' }),
    tiktokSession.cookies.get({ url: 'https://www.tiktok.com' }),
    tiktokSession.cookies.get({ domain: '.tiktokw.eu' })
  ]);
  const authCookieNames = new Set(cookieGroups
    .flat()
    .filter(isUsableAuthCookie)
    .map((cookie) => cookie.name));

  return [...REQUIRED_AUTH_COOKIE_NAMES].some((name) => authCookieNames.has(name))
    || (
      (authCookieNames.has('uid_tt') || authCookieNames.has('uid_tt_ss'))
      && (authCookieNames.has('passport_auth_status') || authCookieNames.has('passport_auth_status_ss'))
    );
}

function isUsableAuthCookie(cookie) {
  if (!cookie || typeof cookie.name !== 'string') {
    return false;
  }

  const name = cookie.name;
  if (!REQUIRED_AUTH_COOKIE_NAMES.has(name) && !SUPPORTING_AUTH_COOKIE_NAMES.has(name)) {
    return false;
  }

  const value = typeof cookie.value === 'string' ? cookie.value.trim() : '';
  if (value.length < 6 || value === '0' || value.toLowerCase() === 'null') {
    return false;
  }

  if (cookie.expirationDate && cookie.expirationDate * 1000 <= Date.now()) {
    return false;
  }

  return true;
}

async function showChatMode() {
  if (state.mode === 'chat' && (isConnecting || liveConnection)) {
    publishState();
    return;
  }

  state.mode = 'chat';
  state.lastMessage = 'Lacze z czatem LIVE';
  resetChatBuffers();
  layoutViews();
  publishState();
  await connectLiveChat();
}

async function showLoginMode() {
  finalizeArchiveSession();
  state.mode = 'login';
  state.lastMessage = 'Logowanie';
  state.source = 'rozlaczony';
  disconnectLiveConnection();
  layoutViews();
  if (!loginView.webContents.isLoading()) {
    await loginView.webContents.loadURL(LOGIN_URL).catch(() => {});
  }
  publishState();
}

function getConnectorOptions() {
  return {
    processInitialData: false,
    fetchRoomInfoOnConnect: true,
    enableExtendedGiftInfo: true,
    requestPollingIntervalMs: 1500,
    webClientParams: TIKTOK_POLISH_PARAMS,
    wsClientParams: TIKTOK_POLISH_PARAMS,
    webClientOptions: {
      timeout: 15000
    }
  };
}

async function connectLiveChat() {
  if (isConnecting || (liveConnection && liveConnection.isConnected)) {
    return;
  }

  clearTimeout(reconnectTimer);
  isConnecting = true;
  const attemptId = ++connectionAttemptId;
  const creator = getCurrentCreator();
  state.source = 'laczenie';
  state.lastMessage = `Lacze z @${creator.username}`;
  publishState();

  disconnectLiveConnection({ keepAttempt: true, preserveConnecting: true });

  let connection;
  try {
    const options = getConnectorOptions();
    connection = new TikTokLiveConnection(creator.username, options);
    liveConnection = connection;

    connection.on(WebcastEvent.CHAT, (data) => {
      if (!eventBelongsToActiveConnection(connection, creator)) {
        return;
      }

      archiveChatMessage(formatChatEvent(data));
    });

    connection.on(WebcastEvent.MEMBER, (data) => {
      if (!eventBelongsToActiveConnection(connection, creator)) {
        return;
      }

      const event = formatMemberEvent(data);
      archiveChatMessage(event);
      if (isProgramAuthorEvent(event)) {
        sendProgramAuthorJoinAlert();
      }
    });

    connection.on(WebcastEvent.GIFT, (data) => {
      if (!eventBelongsToActiveConnection(connection, creator)) {
        return;
      }

      emitBattleMultiplierFromEvent(data);
      const event = formatGiftEvent(data);
      if (event) {
        archiveChatMessage(event);
      }
    });

    connection.on(WebcastEvent.ENVELOPE, (data) => {
      if (!eventBelongsToActiveConnection(connection, creator)) {
        return;
      }

      archiveChatMessage(formatEnvelopeEvent(data));
    });

    connection.on(WebcastEvent.LIKE, (data) => {
      if (!eventBelongsToActiveConnection(connection, creator)) {
        return;
      }

      archiveChatMessage(formatLikeEvent(data));
    });

    connection.on(WebcastEvent.ROOM_USER, (data) => {
      if (!eventBelongsToActiveConnection(connection, creator)) {
        return;
      }

      sendRoomStats(data);
    });

    connection.on(WebcastEvent.SHARE, (data) => {
      if (!eventBelongsToActiveConnection(connection, creator)) {
        return;
      }

      archiveChatMessage(formatSocialEvent(data, 'share'));
    });

    connection.on(WebcastEvent.SOCIAL, (data) => {
      if (!eventBelongsToActiveConnection(connection, creator)) {
        return;
      }

      const event = formatSocialEvent(data);
      if (event) {
        archiveChatMessage(event);
      }
    });

    connection.on(WebcastEvent.LINK_MIC_BATTLE, (data) => {
      if (!eventBelongsToActiveConnection(connection, creator)) {
        return;
      }

      battleActive = true;
      emitBattleMultiplierFromEvent(data);
    });

    connection.on(WebcastEvent.LINK_MIC_ARMIES, (data) => {
      if (!eventBelongsToActiveConnection(connection, creator)) {
        return;
      }

      battleActive = true;
      emitBattleMultiplierFromEvent(data);
    });

    connection.on(WebcastEvent.LINK_MIC_BATTLE_TASK, (data) => {
      if (!eventBelongsToActiveConnection(connection, creator)) {
        return;
      }

      battleActive = true;
      emitBattleMultiplierFromEvent(data);
    });

    connection.on(ControlEvent.CONNECTED, (connectionState) => {
      if (!eventBelongsToActiveConnection(connection, creator)) {
        return;
      }

      state.source = `polaczono: room ${connectionState.roomId || '?'}`;
      state.lastMessage = `Polaczono z @${creator.username}`;
      publishState();
    });

    connection.on(ControlEvent.DISCONNECTED, () => {
      if (liveConnection !== connection || state.mode !== 'chat') {
        return;
      }

      battleActive = false;
      state.source = 'rozlaczono';
      state.lastMessage = 'Rozlaczono z czatem, ponawiam za 5s';
      publishState();
      scheduleReconnect();
    });

    connection.on(WebcastEvent.STREAM_END, () => {
      if (!eventBelongsToActiveConnection(connection, creator)) {
        return;
      }

      battleActive = false;
      state.source = 'live zakonczony';
      state.lastMessage = 'Live jest zakonczony albo offline';
      finalizeArchiveSession();
      publishState();
    });

    connection.on(ControlEvent.ERROR, (error) => {
      if (!eventBelongsToActiveConnection(connection, creator)) {
        return;
      }

      state.source = 'blad';
      state.lastMessage = `Blad czatu: ${error && error.message ? error.message : String(error)}`;
      publishState();
    });

    const connectedState = await connection.connect();
    if (connectionAttemptId !== attemptId || !eventBelongsToActiveConnection(connection, creator)) {
      return;
    }

    state.source = `polaczono: room ${connectedState.roomId || '?'}`;
    state.lastMessage = `Polaczono z @${creator.username}`;
  } catch (error) {
    if (connectionAttemptId !== attemptId || (connection && (liveConnection !== connection || state.creatorId !== creator.id))) {
      return;
    }

    state.source = 'blad polaczenia';
    state.lastMessage = `Nie moge pobrac czatu: ${error && error.message ? error.message : String(error)}`;
    scheduleReconnect();
  } finally {
    if (connectionAttemptId === attemptId) {
      isConnecting = false;
      publishState();
    }
  }
}

async function selectCreator(creatorInput) {
  const creator = resolveCreator(creatorInput);
  if (!creator) {
    return { ok: false, error: 'creator-not-found' };
  }

  if (state.creatorId === creator.id) {
    syncCurrentCreatorState(creator);
    publishState();
    return { ok: true, creator: publicCreator(creator) };
  }

  customCreator = creator.custom ? creator : null;
  syncCurrentCreatorState(creator);
  state.lastMessage = `Wybrano @${creator.username}`;
  state.source = state.mode === 'chat' ? 'przelaczam' : state.source;
  finalizeArchiveSession();
  resetChatBuffers();
  sendToShell('shell:chat-reset', { creatorId: state.creatorId });
  publishState();

  if (state.mode === 'chat') {
    disconnectLiveConnection();
    await connectLiveChat();
  }

  return { ok: true, creator: publicCreator(creator) };
}

function disconnectLiveConnection(options = {}) {
  clearTimeout(reconnectTimer);
  if (!options.keepAttempt) {
    connectionAttemptId += 1;
  }

  if (liveConnection) {
    const connection = liveConnection;
    liveConnection = null;
    try {
      connection.disconnect();
    } catch {
      // Ignore disconnect errors from an already closed connection.
    }
  }

  if (!options.preserveConnecting) {
    isConnecting = false;
  }
}

function scheduleReconnect() {
  clearTimeout(reconnectTimer);
  if (state.mode !== 'chat') {
    return;
  }

  reconnectTimer = setTimeout(() => {
    connectLiveChat().catch(() => {});
  }, 5000);
}

function formatChatEvent(data) {
  const user = getEventUser(data);
  const comment = data && data.comment ? data.comment : '';

  return createDisplayEvent(data, 'chat', user, comment, `${user.nickname} (@${user.uniqueId}): ${comment}`);
}

function formatMemberEvent(data) {
  const user = getEventUser(data);
  const text = 'dołączył(a) do LIVE';
  return createDisplayEvent(data, 'member', user, text, `${user.nickname} (@${user.uniqueId}) ${text}`, {
    textKey: 'event.member.join'
  });
}

function isProgramAuthorEvent(event) {
  return normalizeUniqueId(event && event.uniqueId) === PROGRAM_AUTHOR_UNIQUE_ID;
}

function normalizeUniqueId(value) {
  return String(value || '').trim().replace(/^@/, '').toLowerCase();
}

function isUnknownIdentityValue(value) {
  const normalized = normalizeUniqueId(value);
  return !normalized || ['unknown', 'unknow', 'undefined', 'null'].includes(normalized);
}

function formatGiftEvent(data) {
  const giftType = Number(data && (data.giftType || (data.giftDetails && data.giftDetails.giftType))) || 0;
  if (giftType === 1 && !Boolean(data && data.repeatEnd)) {
    return null;
  }

  const user = getEventUser(data);
  const giftName = getGiftName(data);
  const repeatCount = Math.max(1, Number(data && (data.repeatCount || data.comboCount || data.groupCount)) || 1);
  const giftCost = getGiftCost(data);
  const countText = repeatCount > 1 ? ` x${repeatCount}` : '';
  const costText = giftCost > 0 ? ` (🪙 ${giftCost * repeatCount})` : '';

  if (isBoxLikeGift(data, giftName)) {
    if (isUnknownIdentityValue(user.nickname) && isUnknownIdentityValue(user.uniqueId)) {
      return null;
    }

    const boxName = /portal/i.test(giftName) ? 'portal' : 'skrzynię';
    const boxKey = /portal/i.test(giftName) ? 'portal' : 'chest';
    const audienceCount = getAudienceCount(data);
    const audienceText = audienceCount > 0 ? ` dla (👥 ${audienceCount})` : '';
    const text = `wysyła ${boxName}${costText}${audienceText}`;
    return createDisplayEvent(data, 'box', user, text, `${user.nickname} (@${user.uniqueId}) ${text}`, {
      textKey: 'event.box',
      boxKey,
      giftCost: giftCost * repeatCount,
      audienceCount
    });
  }

  const text = `wysłał(a) prezent: ${giftName}${countText}${costText}`;
  return createDisplayEvent(data, 'gift', user, text, `${user.nickname} (@${user.uniqueId}) ${text}`, {
    textKey: 'event.gift',
    giftName,
    repeatCount,
    giftCost: giftCost * repeatCount
  });
}

function formatEnvelopeEvent(data) {
  const info = data && data.envelopeInfo ? data.envelopeInfo : {};
  const senderName = String(info.sendUserName || '').trim();
  const senderId = String(info.sendUserId || '').trim();
  if (isUnknownIdentityValue(senderName) && isUnknownIdentityValue(senderId)) {
    return null;
  }

  const user = {
    nickname: senderName || senderId,
    uniqueId: senderId || senderName
  };
  const coinCount = Number(info.diamondCount) || 0;
  const peopleCount = Number(info.peopleCount) || 0;
  const coinText = coinCount > 0 ? ` (🪙 ${coinCount})` : '';
  const peopleText = peopleCount > 0 ? ` dla (👥 ${peopleCount})` : '';
  const text = `wysyła skrzynię${coinText}${peopleText}`;
  return createDisplayEvent(data, 'box', user, text, `${user.nickname} (@${user.uniqueId}) ${text}`, {
    textKey: 'event.box',
    boxKey: 'chest',
    giftCost: coinCount,
    audienceCount: peopleCount
  });
}

function formatLikeEvent(data) {
  const user = getEventUser(data);
  const likeCount = Math.max(1, Number(data && data.likeCount) || 1);
  const key = `${state.creatorId}:${user.uniqueId}`;
  const total = (likeTotalsByUser.get(key) || 0) + likeCount;
  likeTotalsByUser.set(key, total);

  const text = `polubił(a) LIVE (łącznie ${total} polubień)`;
  const event = createDisplayEvent(data, 'like', user, text, `${user.nickname} (@${user.uniqueId}) ${text}`, {
    textKey: 'event.like',
    total
  });
  event.id = `like:${key}`;
  event.upsert = true;
  return event;
}

function formatSocialEvent(data, forcedKind) {
  const user = getEventUser(data);
  const kind = forcedKind || getSocialKind(data);
  if (!kind) {
    return null;
  }

  if (kind === 'repost') {
    const text = '🔁 repostował live';
    return createDisplayEvent(data, 'repost', user, text, `${user.nickname} (@${user.uniqueId}) ${text}`, {
      textKey: 'event.repost'
    });
  }

  const shareCount = getShareAudienceCount(data);
  const countText = shareCount > 0 ? ` (👥 ${shareCount})` : '';
  const text = `↩️ udostępnia live${countText}`;
  return createDisplayEvent(data, 'share', user, text, `${user.nickname} (@${user.uniqueId}) ${text}`, {
    textKey: 'event.share',
    shareCount
  });
}

function createDisplayEvent(data, kind, user, text, archiveText, extra = {}) {
  return {
    id: getMessageId(data),
    time: new Date().toISOString(),
    kind,
    authorName: user.nickname,
    uniqueId: user.uniqueId,
    isModerator: isModeratorEvent(data),
    text: normalizeMessageText(text),
    archiveText: normalizeMessageText(archiveText),
    ...extra
  };
}

function getMessageId(data) {
  return data && data.common
    ? data.common.msgId || data.common.messageId || data.common.createTime
    : data && (data.msgId || data.messageId || data.createTime || data.id);
}

function getEventUser(data) {
  const user = data && data.user ? data.user : {};
  const uniqueId = user.uniqueId || (data && data.uniqueId) || 'unknown';
  const nickname = user.nickname || (data && data.nickname) || uniqueId;
  return { uniqueId: String(uniqueId), nickname: String(nickname) };
}

function getSocialKind(data) {
  const marker = [
    data && data.action,
    data && data.shareType,
    data && data.shareTarget,
    getTextFromDisplay(data && data.common && data.common.displayText),
    getTextFromDisplay(data && data.displayText)
  ].filter(Boolean).join(' ').toLowerCase();

  if (/repost|re-post|repostow/.test(marker)) {
    return 'repost';
  }

  if (/share|udost|forward|send/.test(marker)) {
    return 'share';
  }

  return '';
}

function getShareAudienceCount(data) {
  const textCount = getShareAudienceCountFromText(data);
  if (textCount > 0) {
    return textCount;
  }

  const eventCount = findNumericByKeys(data, new Set([
    'peopleCount',
    'targetUserCount',
    'targetCount',
    'recipientCount',
    'receiverCount',
    'friendCount'
  ]), 4);
  if (eventCount > 0) {
    return eventCount;
  }

  const fallbackShareCount = Number(data && data.shareCount) || 0;
  return fallbackShareCount > 0 && fallbackShareCount <= 20 ? fallbackShareCount : 0;
}

function getShareAudienceCountFromText(data) {
  const text = [
    getTextFromDisplay(data && data.common && data.common.displayText),
    getTextFromDisplay(data && data.displayText),
    getTextFromDisplay(data && data.displayTextForAnchor),
    getTextFromDisplay(data && data.displayTextForAudience)
  ].filter(Boolean).join(' ').toLowerCase();

  if (!text) {
    return 0;
  }

  const match = text.match(/(?:^|[^\d])(\d{1,3})\s*(?:os(?:o|ó)b|osobom|znajom|ludzi|odbior|people|persons?|friends?|recipients?|users?|personen|freunden?)(?:[^\w]|$)/i);
  if (!match) {
    return 0;
  }

  const count = Number(match[1]) || 0;
  return count > 0 && count <= 200 ? count : 0;
}

function getTextFromDisplay(displayText) {
  if (!displayText || typeof displayText !== 'object') {
    return '';
  }

  const parts = [displayText.displayType, displayText.defaultPattern];
  if (Array.isArray(displayText.piecesList)) {
    displayText.piecesList.forEach((piece) => {
      if (piece && piece.stringValue) {
        parts.push(piece.stringValue);
      }
      if (piece && piece.patternRefValue && piece.patternRefValue.defaultPattern) {
        parts.push(piece.patternRefValue.defaultPattern);
      }
    });
  }

  return parts.filter(Boolean).join(' ');
}

function isModeratorEvent(data) {
  return hasTruthyKey(data, 'isModeratorOfAnchor', 5) || hasModeratorBadge(data && data.user);
}

function hasTruthyKey(value, key, depth) {
  if (!value || depth < 0 || typeof value !== 'object') {
    return false;
  }

  if (value[key] === true) {
    return true;
  }

  return Object.values(value).some((item) => hasTruthyKey(item, key, depth - 1));
}

function hasModeratorBadge(user) {
  if (!user || !Array.isArray(user.badges)) {
    return false;
  }

  return user.badges.some((badge) => hasModeratorText(badge, 4));
}

function hasModeratorText(value, depth) {
  if (!value || depth < 0) {
    return false;
  }

  if (typeof value === 'string') {
    return /\bmod\b|moderator/i.test(value);
  }

  if (typeof value !== 'object') {
    return false;
  }

  return Object.values(value).some((item) => hasModeratorText(item, depth - 1));
}

function getGiftName(data) {
  return normalizeMessageText(
    data && (
      data.giftName
      || (data.giftDetails && data.giftDetails.giftName)
      || (data.extendedGiftInfo && (data.extendedGiftInfo.name || data.extendedGiftInfo.giftName))
      || (data.giftId ? `gift ${data.giftId}` : '')
    )
  ) || 'prezent';
}

function getGiftCost(data) {
  return Number(
    data && (
      (data.giftDetails && data.giftDetails.diamondCount)
      || (data.extendedGiftInfo && (
        data.extendedGiftInfo.diamondCount
        || data.extendedGiftInfo.diamond_count
        || data.extendedGiftInfo.cost
      ))
      || data.diamondCount
    )
  ) || 0;
}

function isBoxLikeGift(data, giftName) {
  return Boolean(
    data && (
      data.giftsInBox
      || (data.giftDetails && data.giftDetails.isBoxGift)
      || /portal|skrzyn|skrzyni|chest|treasure|box/i.test(giftName)
    )
  );
}

function getAudienceCount(data) {
  return findNumericByKeys(data, new Set([
    'peopleCount',
    'audienceCount',
    'viewerCount',
    'userCount',
    'targetUserCount',
    'winnerCount',
    'claimCount',
    'availableCount'
  ]), 5);
}

function getViewerCount(data) {
  return findNumericByKeys(data, new Set([
    'viewerCount',
    'userCount',
    'totalUser',
    'totalUserCount',
    'onlineUserCount',
    'audienceCount'
  ]), 5);
}

function sendRoomStats(data) {
  sendToShell('shell:room-stats', {
    viewerCount: getViewerCount(data)
  });
}

function findNumericByKeys(value, keys, depth) {
  if (!value || depth < 0 || typeof value !== 'object') {
    return 0;
  }

  for (const key of keys) {
    const found = Number(value[key]);
    if (Number.isFinite(found) && found > 0) {
      return found;
    }
  }

  for (const child of Object.values(value)) {
    const found = findNumericByKeys(child, keys, depth - 1);
    if (found > 0) {
      return found;
    }
  }

  return 0;
}

function emitBattleMultiplierFromEvent(data) {
  const multiplier = getBattleMultiplier(data);
  if (multiplier !== 2 && multiplier !== 3) {
    return;
  }

  sendBattleAlert(multiplier);
}

function getBattleMultiplier(data) {
  const direct = normalizeMultiplier(
    data && data.matchInfo && (
      data.matchInfo.multiplierValue
      || data.matchInfo.critical
    )
  );
  if (direct) {
    return direct;
  }

  return findMultiplier(data, 6);
}

function findMultiplier(value, depth) {
  if (!value || depth < 0 || typeof value !== 'object') {
    return 0;
  }

  const candidate = normalizeMultiplier(value.multiplierValue || value.rewardMultiple);
  if (candidate) {
    return candidate;
  }

  for (const child of Object.values(value)) {
    const found = findMultiplier(child, depth - 1);
    if (found) {
      return found;
    }
  }

  return 0;
}

function normalizeMultiplier(value) {
  if (value === undefined || value === null || value === '') {
    return 0;
  }

  const numeric = Number(String(value).replace(/[^\d.]/g, ''));
  if (!Number.isFinite(numeric)) {
    return 0;
  }

  return Math.round(numeric);
}

function sendBattleAlert(multiplier) {
  const now = Date.now();
  const key = `x${multiplier}`;
  if (lastBattleAlertKey === key && now - lastBattleAlertAt < 8000) {
    return;
  }

  battleActive = true;
  lastBattleAlertKey = key;
  lastBattleAlertAt = now;
  sendToShell('shell:battle-alert', {
    multiplier,
    textKey: 'battle.multiplier',
    tone: 'battle',
    uppercase: true,
    text: `BITWA: ZA CHWILĘ MNOŻNIK X${multiplier}`
  });
}

function sendProgramAuthorJoinAlert() {
  sendToShell('shell:battle-alert', {
    tone: 'author',
    textKey: 'battle.authorJoin',
    uppercase: false,
    text: PROGRAM_AUTHOR_JOIN_TEXT
  });
}

function publishState() {
  sendToShell('shell:state', { ...state });
}

function sendToShell(channel, payload) {
  if (!shellView || shellView.webContents.isDestroyed()) {
    return;
  }

  shellView.webContents.send(channel, payload);
}

function getArchiveLineTimeRange(fullPath, fallbackDate, fallbackStartTime, fallbackEndTime) {
  let first;
  let last;

  try {
    const text = fs.readFileSync(fullPath, 'utf8');
    const headerDate = text.match(/^Data:\s*(\d{4}-\d{2}-\d{2})$/m);
    const headerTime = text.match(/^Godzina:\s*(\d{2}:\d{2}:\d{2}(?:\s*-\s*\d{2}:\d{2}:\d{2})?)$/m);
    if (headerTime && headerTime[1].includes('-')) {
      return {
        date: headerDate ? headerDate[1] : fallbackDate,
        time: headerTime[1]
      };
    }

    const pattern = /\[(\d{2})\.(\d{2})\.(\d{4}),\s*(\d{2}:\d{2}:\d{2})\]/g;
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const item = {
        date: `${match[3]}-${match[2]}-${match[1]}`,
        time: match[4]
      };
      if (!first) {
        first = item;
      }
      last = item;
    }
  } catch {
    // Fall back to metadata below.
  }

  const date = first ? first.date : fallbackDate;
  const startTime = first ? first.time : fallbackStartTime;
  const endTime = last ? last.time : fallbackEndTime;
  const time = startTime && endTime && startTime !== endTime
    ? `${startTime} - ${endTime}`
    : startTime || endTime || '';

  return { date, time };
}

function buildArchiveEntry(fileName) {
  const fullPath = path.join(ARCHIVE_DIR, fileName);
  const stats = fs.statSync(fullPath);
  const modified = getLocalDateParts(stats.mtime);
  const transmissionMatch = fileName.match(/^transmisja-(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2}-\d{2})-(.+?)(?:-\d+)?\.txt$/);
  if (transmissionMatch) {
    const startTime = transmissionMatch[2].replace(/-/g, ':');
    const range = getArchiveLineTimeRange(fullPath, transmissionMatch[1], startTime, modified.time);
    return {
      id: fileName,
      date: range.date,
      time: range.time,
      name: `@${transmissionMatch[3]}`,
      modifiedAt: stats.mtimeMs
    };
  }

  const dailyMatch = fileName.match(/^chat-archiwum-(\d{4}-\d{2}-\d{2})\.txt$/);
  if (dailyMatch) {
    const range = getArchiveLineTimeRange(fullPath, dailyMatch[1], '', modified.time);
    return {
      id: fileName,
      date: range.date,
      time: range.time,
      name: 'Archiwum dzienne',
      modifiedAt: stats.mtimeMs
    };
  }

  return null;
}

function listArchiveEntries() {
  ensureArchiveDir();
  return fs.readdirSync(ARCHIVE_DIR, { withFileTypes: true })
    .filter((item) => item.isFile() && item.name.endsWith('.txt') && item.name !== 'ostatnie-100-wiadomosci.txt')
    .map((item) => buildArchiveEntry(item.name))
    .filter(Boolean)
    .sort((a, b) => b.modifiedAt - a.modifiedAt);
}

function getArchiveContent(archiveId) {
  ensureArchiveDir();
  const safeId = path.basename(String(archiveId || ''));
  const entry = listArchiveEntries().find((item) => item.id === safeId);
  if (!entry) {
    return { ok: false, error: 'archive-not-found' };
  }

  const fullPath = path.join(ARCHIVE_DIR, entry.id);
  return {
    ok: true,
    entry,
    text: fs.readFileSync(fullPath, 'utf8')
  };
}

function senderIsShell(event) {
  return shellView && event.sender.id === shellView.webContents.id;
}

function handleShell(channel, handler) {
  ipcMain.handle(channel, async (event, ...args) => {
    if (!senderIsShell(event)) {
      return { ok: false };
    }

    return handler(...args);
  });
}

function installIpc() {
  handleShell('shell:start-live', async () => {
    await showChatMode();
    return { ok: true };
  });

  handleShell('shell:show-login', async () => {
    await showLoginMode();
    return { ok: true };
  });

  handleShell('shell:reload', async () => {
    reloadCurrentMode();
    return { ok: true };
  });

  handleShell('shell:clear-session', async () => {
    finalizeArchiveSession();
    await tiktokSession.clearStorageData();
    disconnectLiveConnection();
    resetChatBuffers();
    state.loggedIn = false;
    await showLoginMode();
    return { ok: true };
  });

  handleShell('shell:set-creator', async (creatorId) => selectCreator(creatorId));

  handleShell('shell:open-devtools', async (target) => {
    const targets = { shell: shellView, login: loginView };
    const view = targets[target] || (state.mode === 'login' ? loginView : shellView);
    view.webContents.openDevTools({ mode: 'detach' });
    return { ok: true };
  });

  handleShell('shell:list-archives', async () => ({ ok: true, archives: listArchiveEntries() }));
  handleShell('shell:get-archive-content', async (archiveId) => getArchiveContent(archiveId));
  handleShell('shell:get-system-settings', async () => ({ ok: true, settings: getPublicSystemSettings() }));
  handleShell('shell:set-system-settings', async (patch) => ({ ok: true, settings: updateSystemSettings(patch) }));

  handleShell('shell:open-in-browser', async () => {
    await shell.openExternal(getCurrentCreator().liveUrl);
    return { ok: true };
  });
}

function isSmokeRun() {
  return process.env.CZATBOX_SMOKE === '1'
    || process.env.TTKAMA_SMOKE === '1'
    || process.env.TIKTOK_LIVE_SMOKE === '1';
}

function setUpdateMessage(text) {
  state.lastMessage = text;
  publishState();
}

function setupAutoUpdates() {
  if (!app.isPackaged || isSmokeRun()) {
    return;
  }

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('update-available', (info) => {
    setUpdateMessage(`Pobieram aktualizacje ${info && info.version ? info.version : ''}`.trim());
  });

  autoUpdater.on('update-downloaded', (info) => {
    setUpdateMessage(`Aktualizacja ${info && info.version ? info.version : ''} pobrana. Zainstaluje sie po zamknieciu aplikacji.`.trim());
  });

  autoUpdater.on('error', (error) => {
    console.error('Auto update error:', error);
  });

  const checkForUpdates = () => {
    autoUpdater.checkForUpdatesAndNotify().catch((error) => {
      console.error('Auto update check failed:', error);
    });
  };

  setTimeout(checkForUpdates, 15000);
  const updateTimer = setInterval(checkForUpdates, UPDATE_CHECK_INTERVAL_MS);
  if (typeof updateTimer.unref === 'function') {
    updateTimer.unref();
  }
}

function reloadCurrentMode() {
  if (state.mode === 'login') {
    loginView.webContents.reload();
    return;
  }

  disconnectLiveConnection();
  connectLiveChat().catch(() => {});
}

function muteRemoteMedia() {
  function apply() {
    document.querySelectorAll('video, audio').forEach((media) => {
      media.muted = true;
      media.volume = 0;
    });
  }

  apply();
  clearInterval(window.__ttKamaMuteTimer);
  window.__ttKamaMuteTimer = setInterval(apply, 750);

  if (!window.__ttKamaPatchedMediaPlay) {
    window.__ttKamaPatchedMediaPlay = true;
    const originalPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function patchedPlay() {
      this.muted = true;
      this.volume = 0;
      return originalPlay.apply(this, arguments).catch((error) => error);
    };
  }
}

app.setName('Czatbox TT');
app.setAppUserModelId('pl.czatboxtt.app');
installIpc();

app.whenReady().then(() => {
  return createWindow().then(() => {
    setupAutoUpdates();

    if (isSmokeRun()) {
      setTimeout(() => app.quit(), 5000);
    }
  });
});

app.on('activate', () => {
  if (!mainWindow) {
    createWindow();
  }
});

app.on('before-quit', () => {
  isQuitting = true;
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
