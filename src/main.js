const fs = require('node:fs');
const path = require('node:path');
const { app, BaseWindow, WebContentsView, dialog, ipcMain, Menu, Tray, session, shell } = require('electron');
const { autoUpdater } = require('electron-updater');

[process.stdout, process.stderr].forEach((stream) => {
  if (stream && typeof stream.on === 'function') {
    stream.on('error', (error) => {
      if (!error || error.code !== 'EPIPE') {
        // Keep background/packaged runs alive even when no console is attached.
      }
    });
  }
});

let TikTokLiveConnection;
let WebcastEvent;
let ControlEvent;
let UserOfflineError;
let SignatureRateLimitError;

const LOGIN_URL = 'https://www.tiktok.com/login';
const PARTITION = 'persist:tiktok-live-session';
const ARCHIVE_DIR = path.join(app.isPackaged ? app.getPath('userData') : app.getAppPath(), 'archives');
const SYSTEM_SETTINGS_FILE = path.join(app.getPath('userData'), 'system-settings.json');
const NOTES_FILE = path.join(app.getPath('userData'), 'notes.json');
const UPDATE_COMPLETED_FILE = path.join(app.getPath('userData'), 'update-completed.json');
const TRANSMISSION_ARCHIVE_PREFIX = 'transmisja-';
const AVATAR_DIR = path.join(__dirname, 'pic');
const APP_ICON_PATH = path.join(__dirname, 'assets', 'app-icon.ico');
const AVATAR_EXTENSIONS = new Set(['.gif', '.jpg', '.jpeg', '.png', '.webp']);
const PROGRAM_AUTHOR_UNIQUE_ID = 'bakus.03';
const PROGRAM_AUTHOR_JOIN_TEXT = 'Budzimy śpiocha, Baksik dołączył do LIVE!';
const HONDA_UNIQUE_ID = 'grzegorzpawemisiu';
const HONDA_JOIN_TEXT = 'Honda wjechała na rejony.';
const APP_VERSION = app.getVersion();
const UPDATE_CHECK_INTERVAL_MS = 30 * 60 * 1000;
const RANKING_CACHE_TTL_MS = 60 * 1000;
const RANKING_VISIBLE_LIMIT = 20;
const RANKING_REGIONS_BY_LANGUAGE = {
  pl: {
    language: 'pl',
    country: 'Polska',
    slug: 'poland',
    apiSlug: 'poland',
    url: 'https://tik.tools/ranking/poland'
  },
  en: {
    language: 'en',
    country: 'North America',
    slug: 'north-america',
    apiSlug: 'north-america',
    url: 'https://tik.tools/ranking/united-states-region'
  },
  de: {
    language: 'de',
    country: 'Deutschland',
    slug: 'germany',
    apiSlug: 'germany',
    url: 'https://tik.tools/ranking/germany-region'
  }
};
const RELEASE_NOTES_012 = `Czatbox TT to aplikacja do obsługi czatu z transmisji TikTok LIVE. Program pozwala śledzić wiadomości z wybranego live'a w osobnym, czytelnym oknie. Aplikacja została stworzona z myślą o wygodnym podglądzie czatu, archiwizacji rozmów oraz dodatkowych zdarzeń z live'a.

Główne funkcje
- dodany został notatnik do zapisywania bieżących spraw
- program weryfikuje czy istnieje jego nowsza wersja, następnie pobiera ją i informuje o aktualizacji i restarcie.
- dodany został nowy motyw i jego wariacje w różnych ustawieniach - Enigma-Z
- wyróżnienie super fanów na czacie

Poprawki
- poprawione funkcje notatnika
- poprawione działanie widgetów na pulpicie

Znane błędy
- mnożnik bitewek to funkcja testowa, i działa na tak zwaną trytytkę, dlatego czasem w ostatniej minucie się buguje i pojawia mimo jego braku

Co dalej
- dodatkowe jÄ™zyki odczytu czatu TTS
- optymalizacja połączenia z danym twórcą
- powiadomienia dźwiękowe dla większych prezentów`;
const RECONNECT_BASE_DELAY_MS = 30 * 1000;
const RECONNECT_MAX_DELAY_MS = 5 * 60 * 1000;
const OFFLINE_RECONNECT_DELAY_MS = 10 * 60 * 1000;
const RATE_LIMIT_FALLBACK_DELAY_MS = 60 * 60 * 1000;
const BATTLE_EFFECT_STAGE_MS = 8000;
const BATTLE_TASK_NOTICE_MS = 6000;
const BATTLE_RESULT_BANNER_MS = 12000;
const START_BACKGROUND_ARG = '--czatbox-background';
const CHROMIUM_CACHE_DIR = path.join(app.getPath('temp'), 'CzatboxTT', `chromium-cache-${process.pid}`);
const DEFAULT_SYSTEM_SETTINGS = {
  autoLaunch: false,
  runInBackground: false,
  minimizeToTrayOnClose: false,
  language: 'pl',
  timeFormat: 'auto'
};

function removePathQuietly(targetPath, expectedRoot) {
  if (!targetPath || !expectedRoot) {
    return;
  }
  const resolvedTarget = path.resolve(targetPath);
  const resolvedRoot = path.resolve(expectedRoot);
  if (resolvedTarget !== resolvedRoot && !resolvedTarget.startsWith(`${resolvedRoot}${path.sep}`)) {
    return;
  }
  try {
    fs.rmSync(resolvedTarget, { recursive: true, force: true });
  } catch {
    // Chromium can recreate these caches; a failed cleanup should not block the app.
  }
}

function cleanChromiumCacheArtifacts() {
  const userDataDir = app.getPath('userData');
  const sessionDir = path.join(userDataDir, 'Partitions', 'tiktok-live-session');
  const cacheDirs = [
    path.join(userDataDir, 'Cache'),
    path.join(userDataDir, 'Code Cache'),
    path.join(userDataDir, 'GPUCache'),
    path.join(userDataDir, 'DawnGraphiteCache'),
    path.join(userDataDir, 'DawnWebGPUCache'),
    path.join(userDataDir, 'Shared Dictionary'),
    path.join(sessionDir, 'Cache'),
    path.join(sessionDir, 'Code Cache'),
    path.join(sessionDir, 'GPUCache'),
    path.join(sessionDir, 'DawnGraphiteCache'),
    path.join(sessionDir, 'DawnWebGPUCache'),
    path.join(sessionDir, 'Service Worker', 'CacheStorage'),
    path.join(sessionDir, 'Service Worker', 'Database'),
    path.join(sessionDir, 'Service Worker', 'ScriptCache'),
    path.join(sessionDir, 'Shared Dictionary'),
    path.join(sessionDir, 'VideoDecodeStats')
  ];
  const cacheFiles = [
    path.join(userDataDir, 'DevToolsActivePort'),
    path.join(userDataDir, 'QuotaManager'),
    path.join(userDataDir, 'QuotaManager-journal'),
    path.join(sessionDir, 'QuotaManager'),
    path.join(sessionDir, 'QuotaManager-journal')
  ];
  [...cacheDirs, ...cacheFiles].forEach((targetPath) => removePathQuietly(targetPath, userDataDir));
}

try {
  fs.mkdirSync(CHROMIUM_CACHE_DIR, { recursive: true });
  app.commandLine.appendSwitch('disk-cache-dir', CHROMIUM_CACHE_DIR);
  app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
} catch {
  app.commandLine.appendSwitch('disable-http-cache');
  app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
}
cleanChromiumCacheArtifacts();
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
    bio: 'TOP 1 24.12.25/16.01/08.04',
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
let latestRoomStats = { viewerCount: 0 };
let shellView;
let loginView;
let tiktokSession;
let authPoll;
let archiveFile;
let archiveSession;
let archiveWriteTimer;
let liveConnection;
let isConnecting = false;
let connectionAttemptId = 0;
let reconnectTimer;
let reconnectAttemptCount = 0;
let reconnectBlockedUntil = 0;
let battleActive = false;
let lastBattleAlertKey = '';
let lastBattleAlertAt = 0;
let battleTaskTimer;
let battlePublishTimer;
let battleResultTimer;
let battleState = createInitialBattleState();
const liveUserDirectory = new Map();
const battleUserDirectory = new Map();
const battleHostDirectory = new Map();
const battleSideByUser = new Map();
const recentBattleEffects = new Map();
const superFanUsers = new Set();
let currentCreatorLiveUserId = '';
const currentCreatorLiveAliases = new Set();
let tray;
let isQuitting = false;
let systemSettings = loadSystemSettings();
let customCreator = null;
const rankingCache = new Map();

const recentMessages = [];
const seenMessageKeys = new Map();
const likeTotalsByUser = new Map();
const state = {
  mode: 'login',
  connectionStatus: 'idle',
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

function getUniqueArchivePath(baseName, extension = '.json') {
  let candidate = path.join(ARCHIVE_DIR, `${baseName}${extension}`);
  let index = 2;

  while (fs.existsSync(candidate)) {
    candidate = path.join(ARCHIVE_DIR, `${baseName}-${index}${extension}`);
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
    startedAt: startedAt.toISOString(),
    endTime: '',
    endedAt: ''
  };
  recentMessages.length = 0;

  writeFullArchiveFile();
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
  const document = {
    version: 2,
    session: { ...archiveSession },
    messages: recentMessages
  };
  fs.writeFileSync(archiveFile, `${JSON.stringify(document, null, 2)}\n`, 'utf8');
}

function scheduleArchiveWrite() {
  clearTimeout(archiveWriteTimer);
  archiveWriteTimer = setTimeout(() => {
    archiveWriteTimer = null;
    writeFullArchiveFile();
  }, 250);
}

function finalizeArchiveSession(endDate = new Date()) {
  if (!archiveSession || !archiveFile || !fs.existsSync(archiveFile)) {
    return;
  }

  archiveSession.endTime = getLocalDateParts(endDate).time;
  archiveSession.endedAt = endDate.toISOString();
  clearTimeout(archiveWriteTimer);
  archiveWriteTimer = null;
  writeFullArchiveFile();
}

function resetChatBuffers() {
  recentMessages.length = 0;
  seenMessageKeys.clear();
  likeTotalsByUser.clear();
  latestRoomStats = { viewerCount: 0 };
  liveUserDirectory.clear();
  superFanUsers.clear();
  currentCreatorLiveUserId = '';
  currentCreatorLiveAliases.clear();
  battleActive = false;
  resetBattleState({ publish: false });
  clearTimeout(archiveWriteTimer);
  archiveWriteTimer = null;
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
    isSuperFan: Boolean(message.isSuperFan),
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
    'likeCount',
    'shareCount'
  ].forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(message, key)) {
      payload[key] = message[key];
    }
  });
  const existingIndex = payload.upsert && payload.id
    ? recentMessages.findIndex((item) => item.id === payload.id)
    : -1;

  if (existingIndex >= 0) {
    recentMessages[existingIndex] = payload;
    scheduleArchiveWrite();
    sendToShell('shell:chat-message', payload);
    return;
  }

  recentMessages.push(payload);
  scheduleArchiveWrite();
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
  } catch {}
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

function normalizeNote(value) {
  const note = value && typeof value === 'object' ? value : {};
  const now = new Date().toISOString();
  const id = normalizeMessageText(note.id) || `note-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const title = normalizeMessageText(note.title).slice(0, 120);
  const content = typeof note.content === 'string' ? note.content.slice(0, 20000) : '';
  const createdAt = Number.isNaN(new Date(note.createdAt || '').getTime()) ? now : new Date(note.createdAt).toISOString();
  const updatedAt = Number.isNaN(new Date(note.updatedAt || '').getTime()) ? createdAt : new Date(note.updatedAt).toISOString();
  const contentTitle = content.split(/\r?\n/).map((line) => line.trim()).find(Boolean);

  return {
    id,
    title: title || (contentTitle ? contentTitle.slice(0, 120) : 'Notatka'),
    content,
    createdAt,
    updatedAt
  };
}

function readNotesStore() {
  try {
    const document = JSON.parse(fs.readFileSync(NOTES_FILE, 'utf8'));
    const notes = Array.isArray(document && document.notes) ? document.notes : [];
    return notes.map(normalizeNote).sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt));
  } catch {
    return [];
  }
}

function writeNotesStore(notes) {
  fs.mkdirSync(path.dirname(NOTES_FILE), { recursive: true });
  fs.writeFileSync(NOTES_FILE, `${JSON.stringify({ version: 1, notes }, null, 2)}\n`, 'utf8');
}

function listNotes() {
  return readNotesStore().map((note) => ({
    id: note.id,
    title: note.title,
    updatedAt: note.updatedAt,
    createdAt: note.createdAt
  }));
}

function getNote(noteId) {
  const id = normalizeMessageText(noteId);
  const note = readNotesStore().find((item) => item.id === id);
  return note ? { ok: true, note } : { ok: false, error: 'note-not-found' };
}

function saveNote(patch) {
  const notes = readNotesStore();
  const now = new Date().toISOString();
  const incoming = patch && typeof patch === 'object' ? patch : {};
  const id = normalizeMessageText(incoming.id);
  const existingIndex = id ? notes.findIndex((note) => note.id === id) : -1;
  const existing = existingIndex >= 0 ? notes[existingIndex] : null;
  const note = normalizeNote({
    ...(existing || {}),
    id: existing ? existing.id : id,
    title: incoming.title,
    content: typeof incoming.content === 'string' ? incoming.content : '',
    createdAt: existing ? existing.createdAt : now,
    updatedAt: now
  });

  if (existingIndex >= 0) {
    notes[existingIndex] = note;
  } else {
    notes.unshift(note);
  }
  const sorted = notes.sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt));
  writeNotesStore(sorted);
  return { ok: true, note, notes: listNotes() };
}

function deleteNote(noteId) {
  const id = normalizeMessageText(noteId);
  const notes = readNotesStore();
  const nextNotes = notes.filter((note) => note.id !== id);
  if (nextNotes.length === notes.length) {
    return { ok: false, error: 'note-not-found' };
  }
  writeNotesStore(nextNotes);
  return { ok: true, notes: listNotes() };
}

function decodeHtmlEntities(value) {
  return String(value || '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_match, code) => String.fromCodePoint(Number(code) || 32))
    .replace(/&#x([a-f0-9]+);/gi, (_match, code) => String.fromCodePoint(Number.parseInt(code, 16) || 32));
}

function stripHtml(value) {
  return decodeHtmlEntities(String(value || '')
    .replace(/<span class="lb-lock-ico"[\s\S]*?<\/span>/g, '')
    .replace(/<!---->/g, '')
    .replace(/<[^>]*>/g, ''))
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeRankingLanguage(language) {
  return Object.prototype.hasOwnProperty.call(RANKING_REGIONS_BY_LANGUAGE, language)
    ? language
    : DEFAULT_SYSTEM_SETTINGS.language;
}

function absolutizeTikToolsUrl(url) {
  if (!url) {
    return '';
  }
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  return `https://tik.tools${url.startsWith('/') ? url : `/${url}`}`;
}

function formatRankingCompactNumber(value) {
  const number = Number(value) || 0;
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: number >= 100000 ? 1 : 0
  }).format(number);
}

function formatRankingUsd(value) {
  const number = Number(value) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: number >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: number >= 1000 ? 1 : 2
  }).format(number);
}

function isMaskedRankingEntry(entry) {
  const uniqueId = String(entry && (entry.uniqueId || entry.handle || '')).trim();
  const displayName = String(entry && (entry.displayName || entry.nickname || '')).trim();
  return Boolean(entry && entry.masked)
    || /^someone$/i.test(uniqueId)
    || /^someone$/i.test(displayName);
}

function parseTikToolsApiRanking(payload) {
  const current = payload && payload.current && typeof payload.current === 'object'
    ? payload.current
    : {};
  const channels = Array.isArray(current.channels) ? current.channels : [];
  const totalEntries = Number(current.total_entries) || channels.length;
  const maskedCount = channels.filter(isMaskedRankingEntry).length;

  const items = channels
    .filter((entry) => !isMaskedRankingEntry(entry))
    .map((entry, index) => {
      const score = Number(entry.score) || 0;
      const uniqueId = stripHtml(entry.uniqueId);
      return {
        rank: Number(entry.rank) || index + 1,
        uniqueId,
        displayName: stripHtml(entry.displayName || entry.nickname) || uniqueId,
        avatar: absolutizeTikToolsUrl(entry.profilePic || entry.avatar),
        live: Boolean(entry.alive || entry.isLive),
        diamonds: formatRankingCompactNumber(score),
        revenue: formatRankingUsd(score * 0.01),
        earnings: formatRankingUsd(score * 0.005)
      };
    })
    .filter((entry) => entry.uniqueId)
    .sort((left, right) => left.rank - right.rank)
    .slice(0, RANKING_VISIBLE_LIMIT);

  return {
    items,
    totalEntries,
    maskedCount,
    maskedNotice: Boolean(payload && payload.masked) || maskedCount > 0
  };
}

function parseTikToolsRanking(html) {
  const rows = [];
  const starts = [];
  const startPattern = /<div class="[^"]*\blb-row\b[^"]*"/g;
  let startMatch;

  while ((startMatch = startPattern.exec(html))) {
    starts.push(startMatch.index);
  }

  starts.forEach((start, index) => {
    const row = html.slice(start, starts[index + 1] || html.length);
    const rank = row.match(/class="[^"]*\blb-rank\b[^"]*"[\s\S]*?<span[^>]*>#?(\d+)<\/span>/);
    const name = row.match(/class="[^"]*\blb-name\b[^"]*"[^>]*>([\s\S]*?)<\/a>/);
    const uniqueId = row.match(/class="[^"]*\blb-uid\b[^"]*"[^>]*>@([^<]+)/);
    const avatar = row.match(/<img[^>]+class="[^"]*\blb-avatar\b[^"]*"[^>]+src="([^"]+)"/)
      || row.match(/<img[^>]+src="([^"]+)"[^>]+class="[^"]*\blb-avatar\b[^"]*"/);
    const diamonds = row.match(/class="[^"]*\bdiamond-value\b[^"]*"[^>]*>([^<]+)/);
    const revenue = row.match(/class="[^"]*\brev-val\b[^"]*"[^>]*>([^<]+)/);
    const earnings = row.match(/class="[^"]*\bearn-val\b[^"]*"[^>]*>([^<]+)/);
    const handle = stripHtml(uniqueId && uniqueId[1]);
    const displayName = stripHtml(name && name[1]) || handle;

    if (!rank || !handle || /^someone$/i.test(handle) || /^someone$/i.test(displayName)) {
      return;
    }

    rows.push({
      rank: Number(rank[1]) || rows.length + 1,
      uniqueId: handle,
      displayName,
      avatar: absolutizeTikToolsUrl(avatar && avatar[1]),
      live: row.includes('live-ring-avatar') || /\bLIVE\b/i.test(row),
      diamonds: stripHtml(diamonds && diamonds[1]),
      revenue: stripHtml(revenue && revenue[1]),
      earnings: stripHtml(earnings && earnings[1])
    });
  });

  const totalEntries = starts.length || rows.length;
  return {
    items: rows
      .sort((left, right) => left.rank - right.rank)
      .slice(0, RANKING_VISIBLE_LIMIT),
    totalEntries,
    maskedCount: Math.max(0, totalEntries - rows.length),
    maskedNotice: html.includes('@someone') || html.includes('>Someone')
  };
}

async function getCountryRanking(language) {
  const normalizedLanguage = normalizeRankingLanguage(language);
  const region = RANKING_REGIONS_BY_LANGUAGE[normalizedLanguage] || RANKING_REGIONS_BY_LANGUAGE.pl;
  const cached = rankingCache.get(region.slug);
  const now = Date.now();

  if (cached && now - cached.fetchedAt < RANKING_CACHE_TTL_MS) {
    return { ok: true, ...cached.payload, cached: true };
  }

  let parsed = null;
  const apiUrl = `https://tik.tools/api/leaderboards/country/${region.apiSlug || region.slug}`;
  try {
    const apiResponse = await fetch(apiUrl, {
      headers: {
        'user-agent': `CzatboxTT/${APP_VERSION}`,
        accept: 'application/json',
        'accept-language': 'pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });

    if (apiResponse.ok) {
      const apiPayload = await apiResponse.json();
      parsed = parseTikToolsApiRanking(apiPayload);
    }
  } catch {
    parsed = null;
  }

  if (!parsed || !parsed.items.length) {
    try {
      const response = await fetch(region.url, {
        headers: {
        'user-agent': `CzatboxTT/${APP_VERSION}`,
          accept: 'text/html,application/xhtml+xml',
          'accept-language': 'pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7'
        }
      });

      if (!response.ok) {
        throw new Error(`ranking-http-${response.status}`);
      }

      const html = await response.text();
      parsed = parseTikToolsRanking(html);
    } catch (error) {
      if (cached && cached.payload) {
        return { ok: true, ...cached.payload, cached: true, stale: true };
      }
      throw error;
    }
  }

  const payload = {
    language: normalizedLanguage,
    country: region.country,
    url: region.url,
    items: parsed.items,
    totalEntries: parsed.totalEntries,
    maskedCount: parsed.maskedCount,
    fetchedAt: now,
    maskedNotice: parsed.maskedNotice
  };
  rankingCache.set(region.slug, { fetchedAt: now, payload });
  return { ok: true, ...payload, cached: false };
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

  shellView.webContents.on('did-finish-load', () => {
    publishState();
    publishBattleState();
  });

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
  state.connectionStatus = 'connecting';
  state.lastMessage = 'Lacze z czatem LIVE';
  resetChatBuffers();
  layoutViews();
  publishState();
  await connectLiveChat();
}

async function showLoginMode() {
  finalizeArchiveSession();
  state.mode = 'login';
  state.connectionStatus = 'idle';
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
    enableExtendedGiftInfo: false,
    webClientOptions: {
      timeout: 15000
    }
  };
}

function getConnectionErrorMessage(error) {
  if (error && error.exception && typeof error.exception.message === 'string' && error.exception.message.trim()) {
    return error.exception.message.trim();
  }

  if (error && typeof error.message === 'string' && error.message.trim()) {
    return error.message.trim();
  }

  if (error && typeof error === 'object') {
    try {
      return JSON.stringify(error);
    } catch {
      return String(error);
    }
  }

  return String(error || 'Nieznany blad');
}

function classifyConnectionError(error) {
  const message = getConnectionErrorMessage(error);
  const normalized = message.toLowerCase();

  if (
    error instanceof SignatureRateLimitError
    || normalized.includes('rate limited')
    || normalized.includes('rate_limit')
    || normalized.includes('too many connections')
  ) {
    return 'rate-limited';
  }

  if (
    error instanceof UserOfflineError
    || normalized.includes('user is offline')
    || normalized.includes('live has ended')
    || normalized.includes('room is offline')
  ) {
    return 'offline';
  }

  return 'error';
}

function getRateLimitDelay(error) {
  const now = Date.now();
  const resetTime = Number(error && error.resetTime);
  if (Number.isFinite(resetTime) && resetTime > now) {
    return Math.max(60 * 1000, resetTime - now + 1000);
  }

  const retryAfter = Number(error && error.retryAfter);
  if (Number.isFinite(retryAfter) && retryAfter > 0) {
    return Math.max(60 * 1000, retryAfter + 1000);
  }

  return RATE_LIMIT_FALLBACK_DELAY_MS;
}

function getReconnectDelay() {
  const exponent = Math.max(0, reconnectAttemptCount - 1);
  return Math.min(RECONNECT_MAX_DELAY_MS, RECONNECT_BASE_DELAY_MS * (2 ** exponent));
}

function formatRetryClock(timestamp) {
  return new Intl.DateTimeFormat('pl-PL', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(timestamp));
}

async function connectLiveChat() {
  if (isConnecting || (liveConnection && liveConnection.isConnected)) {
    return;
  }

  clearTimeout(reconnectTimer);
  const now = Date.now();
  if (reconnectBlockedUntil > now) {
    state.connectionStatus = 'rate-limited';
    state.source = 'limit polaczen';
    state.lastMessage = `Limit polaczen z TikTok. Kolejna proba o ${formatRetryClock(reconnectBlockedUntil)}`;
    scheduleReconnect(reconnectBlockedUntil - now);
    publishState();
    return;
  }

  isConnecting = true;
  const attemptId = ++connectionAttemptId;
  const creator = getCurrentCreator();
  state.connectionStatus = 'connecting';
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

      if (hasSuperFanSignal(data)) {
        markSuperFanUser(data);
      }
      const event = formatMemberEvent(data);
      archiveChatMessage(event);
      if (isProgramAuthorEvent(event)) {
        sendProgramAuthorJoinAlert();
      }
      if (isHondaJoinEvent(event)) {
        sendHondaJoinAlert();
      }
    });

    connection.on(WebcastEvent.GIFT, (data) => {
      if (!eventBelongsToActiveConnection(connection, creator)) {
        return;
      }

      handleBattleGift(data);
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

    if (WebcastEvent.LINK_MIC_METHOD) {
      connection.on(WebcastEvent.LINK_MIC_METHOD, (data) => {
        if (!eventBelongsToActiveConnection(connection, creator)) {
          return;
        }

        handleBattleIdentityMessage(data, creator);
      });
    }

    if (WebcastEvent.LINK_STATE) {
      connection.on(WebcastEvent.LINK_STATE, (data) => {
        if (!eventBelongsToActiveConnection(connection, creator)) {
          return;
        }

        handleBattleLinkState(data);
      });
    }

    connection.on(WebcastEvent.LINK_MIC_BATTLE, (data) => {
      if (!eventBelongsToActiveConnection(connection, creator)) {
        return;
      }

      handleBattleMessage(data, creator);
      emitBattleMultiplierFromEvent(data);
    });

    connection.on(WebcastEvent.LINK_MIC_ARMIES, (data) => {
      if (!eventBelongsToActiveConnection(connection, creator)) {
        return;
      }

      handleBattleArmies(data, creator);
      emitBattleMultiplierFromEvent(data);
    });

    connection.on(WebcastEvent.LINK_MIC_BATTLE_TASK, (data) => {
      if (!eventBelongsToActiveConnection(connection, creator)) {
        return;
      }

      handleBattleTask(data);
      emitBattleMultiplierFromEvent(data);
    });

    if (WebcastEvent.BOOST_CARD) {
      connection.on(WebcastEvent.BOOST_CARD, (data) => {
        if (!eventBelongsToActiveConnection(connection, creator)) {
          return;
        }

        handleBattleBoostCard(data);
      });
    }

    if (WebcastEvent.SUPER_FAN) {
      connection.on(WebcastEvent.SUPER_FAN, (data) => {
        if (!eventBelongsToActiveConnection(connection, creator)) {
          return;
        }

        markSuperFanUser(data);
      });
    }

    if (WebcastEvent.SUPER_FAN_JOIN) {
      connection.on(WebcastEvent.SUPER_FAN_JOIN, (data) => {
        if (!eventBelongsToActiveConnection(connection, creator)) {
          return;
        }

        markSuperFanUser(data);
      });
    }

    if (WebcastEvent.BARRAGE) {
      connection.on(WebcastEvent.BARRAGE, (data) => {
        if (!eventBelongsToActiveConnection(connection, creator)) {
          return;
        }

        if (hasSuperFanSignal(data)) {
          markSuperFanUser(data);
        }
      });
    }

    if (WebcastEvent.LINK_MIC_BATTLE_PUNISH_FINISH) {
      connection.on(WebcastEvent.LINK_MIC_BATTLE_PUNISH_FINISH, (data) => {
        if (!eventBelongsToActiveConnection(connection, creator)) {
          return;
        }

        finishBattleState(data, 'finished');
      });
    }

    connection.on(ControlEvent.CONNECTED, (connectionState) => {
      if (!eventBelongsToActiveConnection(connection, creator)) {
        return;
      }

      reconnectAttemptCount = 0;
      reconnectBlockedUntil = 0;
      state.connectionStatus = 'online';
      state.source = `polaczono: room ${connectionState.roomId || '?'}`;
      state.lastMessage = `Polaczono z @${creator.username}`;
      registerRoomOwner(connectionState.roomInfo || connection.roomInfo, creator);
      publishState();
      if (typeof connection.fetchAvailableGifts === 'function') {
        connection.fetchAvailableGifts().catch(() => {});
      }
    });

    connection.on(ControlEvent.DISCONNECTED, () => {
      if (liveConnection !== connection || state.mode !== 'chat') {
        return;
      }

      if (state.connectionStatus === 'offline') {
        return;
      }

      battleActive = false;
      resetBattleState();
      state.connectionStatus = 'reconnecting';
      state.source = 'rozlaczono';
      reconnectAttemptCount += 1;
      const delay = getReconnectDelay();
      state.lastMessage = `Rozlaczono z czatem, ponawiam za ${Math.ceil(delay / 1000)}s`;
      publishState();
      scheduleReconnect(delay);
    });

    connection.on(WebcastEvent.STREAM_END, () => {
      if (!eventBelongsToActiveConnection(connection, creator)) {
        return;
      }

      battleActive = false;
      resetBattleState();
      clearTimeout(reconnectTimer);
      reconnectAttemptCount = 0;
      reconnectBlockedUntil = 0;
      state.connectionStatus = 'offline';
      state.source = 'live zakonczony';
      state.lastMessage = 'Live jest zakonczony albo offline';
      finalizeArchiveSession();
      publishState();
    });

    connection.on(ControlEvent.ERROR, (error) => {
      if (!eventBelongsToActiveConnection(connection, creator)) {
        return;
      }

      if (isConnecting) {
        return;
      }

      if (connection.isConnected) {
        state.connectionStatus = 'online';
        state.source = 'polaczono z ostrzezeniem';
        state.lastMessage = `Polaczono; chwilowy blad czatu: ${getConnectionErrorMessage(error)}`;
        publishState();
        return;
      }

      const failureType = classifyConnectionError(error);
      state.connectionStatus = failureType;
      state.source = failureType === 'rate-limited' ? 'limit polaczen' : 'blad';
      state.lastMessage = failureType === 'rate-limited'
        ? 'Osiagnieto limit polaczen z TikTok'
        : `Blad czatu: ${getConnectionErrorMessage(error)}`;
      publishState();
    });

    const connectedState = await connection.connect();
    if (connectionAttemptId !== attemptId || !eventBelongsToActiveConnection(connection, creator)) {
      return;
    }

    reconnectAttemptCount = 0;
    reconnectBlockedUntil = 0;
    registerRoomOwner(connectedState.roomInfo || connection.roomInfo, creator);
    state.connectionStatus = 'online';
    state.source = `polaczono: room ${connectedState.roomId || '?'}`;
    state.lastMessage = `Polaczono z @${creator.username}`;
  } catch (error) {
    if (connectionAttemptId !== attemptId || (connection && (liveConnection !== connection || state.creatorId !== creator.id))) {
      return;
    }

    const failureType = classifyConnectionError(error);
    if (failureType === 'rate-limited') {
      const delay = getRateLimitDelay(error);
      reconnectBlockedUntil = Date.now() + delay;
      state.connectionStatus = 'rate-limited';
      state.source = 'limit polaczen';
      state.lastMessage = `Limit polaczen z TikTok. Kolejna proba o ${formatRetryClock(reconnectBlockedUntil)}`;
      scheduleReconnect(delay);
    } else if (failureType === 'offline') {
      reconnectAttemptCount = 0;
      state.connectionStatus = 'offline';
      state.source = 'live offline';
      state.lastMessage = `@${creator.username} nie prowadzi teraz LIVE`;
      scheduleReconnect(OFFLINE_RECONNECT_DELAY_MS);
    } else {
      reconnectAttemptCount += 1;
      const delay = getReconnectDelay();
      state.connectionStatus = 'error';
      state.source = 'blad polaczenia';
      state.lastMessage = `Blad polaczenia. Ponawiam za ${Math.ceil(delay / 1000)}s: ${getConnectionErrorMessage(error)}`;
      scheduleReconnect(delay);
    }
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
    if (
      state.mode === 'chat'
      && !isConnecting
      && (!liveConnection || !liveConnection.isConnected)
      && reconnectBlockedUntil <= Date.now()
    ) {
      clearTimeout(reconnectTimer);
      await connectLiveChat();
    }
    return { ok: true, creator: publicCreator(creator) };
  }

  customCreator = creator.custom ? creator : null;
  syncCurrentCreatorState(creator);
  reconnectAttemptCount = 0;
  state.connectionStatus = state.mode === 'chat' ? 'connecting' : state.connectionStatus;
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

async function refreshCurrentChat() {
  if (state.mode !== 'chat') {
    return { ok: true, skipped: true };
  }

  const creator = getCurrentCreator();
  reconnectAttemptCount = 0;
  reconnectBlockedUntil = 0;
  finalizeArchiveSession();
  disconnectLiveConnection();
  resetChatBuffers();
  sendToShell('shell:chat-reset', {
    creatorId: state.creatorId,
    reason: 'manual-refresh'
  });
  state.connectionStatus = 'connecting';
  state.source = 'odswiezanie';
  state.lastMessage = `Odświeżam czat @${creator.username}`;
  publishState();
  await connectLiveChat();
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

function scheduleReconnect(delayMs = RECONNECT_BASE_DELAY_MS) {
  clearTimeout(reconnectTimer);
  if (state.mode !== 'chat') {
    return;
  }

  const safeDelay = Math.max(1000, Number(delayMs) || RECONNECT_BASE_DELAY_MS);
  reconnectTimer = setTimeout(() => {
    connectLiveChat().catch(() => {});
  }, safeDelay);
}

function formatChatEvent(data) {
  const user = getEventUser(data);
  const comment = getChatEventText(data);

  return createDisplayEvent(data, 'chat', user, comment, `${user.nickname} (@${user.uniqueId}): ${comment}`);
}

function getChatEventText(data) {
  const candidates = [
    data && data.comment,
    data && data.content,
    data && data.text,
    data && data.message,
    data && data.msg,
    data && data.chatMessage,
    data && data.event && data.event.comment,
    data && data.event && data.event.content,
    data && data.event && data.event.text,
    data && data.common && data.common.describe
  ];

  for (const value of candidates) {
    const normalized = normalizeMessageText(value);
    if (normalized) {
      return normalized;
    }
  }

  return '';
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

function isHondaJoinEvent(event) {
  return normalizeUniqueId(event && event.uniqueId) === HONDA_UNIQUE_ID;
}

function normalizeUniqueId(value) {
  return String(value || '').trim().replace(/^@/, '').toLowerCase();
}

function isUnknownIdentityValue(value) {
  const normalized = normalizeUniqueId(value);
  return !normalized || ['unknown', 'unknow', 'undefined', 'null'].includes(normalized);
}

function formatGiftEvent(data) {
  const giftType = Number(data && (
    data.giftType
    || (data.giftDetails && data.giftDetails.giftType)
    || (data.gift && data.gift.type)
  )) || 0;
  const isComboGift = giftType === 1;
  if (isComboGift && !Boolean(data && data.repeatEnd)) {
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
  const likeCount = getLikeEventCount(data);
  const key = `${state.creatorId}:${user.uniqueId}`;
  const total = (likeTotalsByUser.get(key) || 0) + likeCount;
  likeTotalsByUser.set(key, total);

  const text = `polubił(a) LIVE (łącznie ${total} polubień)`;
  const event = createDisplayEvent(data, 'like', user, text, `${user.nickname} (@${user.uniqueId}) ${text}`, {
    textKey: 'event.like',
    likeCount,
    total
  });
  event.id = `like:${key}`;
  event.upsert = true;
  return event;
}

function getLikeEventCount(data) {
  const value = data && typeof data === 'object' ? data : {};
  const directKeys = [
    'likeCount',
    'like_count',
    'likeCnt',
    'like_cnt',
    'tapCount',
    'tap_count',
    'tapCnt',
    'tap_cnt',
    'count'
  ];

  for (const key of directKeys) {
    const count = Number(value[key]);
    if (Number.isFinite(count) && count > 0) {
      return Math.max(1, Math.floor(count));
    }
  }

  const nestedCount = findNumericByKeys(value, new Set([
    'likeCount',
    'like_count',
    'likeCnt',
    'like_cnt',
    'tapCount',
    'tap_count',
    'tapCnt',
    'tap_cnt'
  ]), 4);

  return Math.max(1, Math.floor(nestedCount || 1));
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
    isSuperFan: isSuperFanEvent(data, user),
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

function getRawUserId(value, fallback = '') {
  value = value && typeof value === 'object' ? value : {};
  return normalizeBattleId(
    value.idStr
    || value.id
    || value.userIdStr
    || value.userId
    || value.user_id
    || fallback
  );
}

function getRawUserAliases(value = {}, fallbackId = '') {
  value = value && typeof value === 'object' ? value : {};
  const ownRoom = value.ownRoom || value.own_room || {};
  const values = [
    fallbackId,
    value.idStr,
    value.id,
    value.userIdStr,
    value.userId,
    value.user_id,
    value.roomId,
    value.roomIdStr,
    value.room_id,
    value.anchorId,
    value.anchorIdStr,
    value.anchor_id,
    ...(Array.isArray(value.aliases) ? value.aliases : []),
    ...(Array.isArray(ownRoom.roomIds) ? ownRoom.roomIds : []),
    ...(Array.isArray(ownRoom.roomIdsStr) ? ownRoom.roomIdsStr : []),
    ...(Array.isArray(ownRoom.room_ids) ? ownRoom.room_ids : []),
    ...(Array.isArray(ownRoom.room_ids_str) ? ownRoom.room_ids_str : [])
  ];
  return [...new Set(values.map(normalizeBattleId).filter(Boolean))];
}

function getRawUserDisplayId(value) {
  value = value && typeof value === 'object' ? value : {};
  return normalizeMessageText(
    value.displayId
    || value.uniqueId
    || value.display_id
    || value.unique_id
    || value.userName
    || value.username
  );
}

function getRawUserNickname(value) {
  value = value && typeof value === 'object' ? value : {};
  return normalizeMessageText(value.nickname || value.nickName || value.name);
}

function getRawUserAvatar(value) {
  value = value && typeof value === 'object' ? value : {};
  const image = value.avatarThumb
    || value.avatarMedium
    || value.avatarLarger
    || value.profilePicture
    || value.profilePictureUrl
    || value.profilePic
    || value.profilePicUrl
    || value.picture
    || value.avatar
    || value.avatar_thumb
    || value.avatar_medium
    || value.avatar_larger
    || value.profile_picture
    || value.profile_picture_url
    || value.profile_pic
    || value.profile_pic_url;
  const urls = image && (image.urlList || image.urls || image.url_list);
  if (Array.isArray(urls) && urls.length) {
    return String(urls[0]);
  }
  if (image && typeof image === 'object') {
    const uri = image.url || image.uri || image.href || image.src;
    if (typeof uri === 'string' && /^https?:\/\//i.test(uri)) {
      return uri;
    }
  }
  return typeof image === 'string' ? image : '';
}

function getCreatorDisplayName(creator = getCurrentCreator()) {
  const label = normalizeMessageText(creator && creator.label);
  if (label) {
    return label.replace(/\s+\(@[^)]+\)\s*$/, '').trim() || label;
  }
  return normalizeMessageText(creator && creator.username) || 'Twórca';
}

function isCurrentCreatorHandle(displayId) {
  const expected = normalizeMessageText(getCurrentCreator() && getCurrentCreator().username)
    .replace(/^@/, '')
    .toLowerCase();
  const actual = normalizeMessageText(displayId).replace(/^@/, '').toLowerCase();
  return Boolean(expected && actual && expected === actual);
}

function isCurrentCreatorAlias(value) {
  const id = normalizeBattleId(value);
  return Boolean(id && (id === currentCreatorLiveUserId || currentCreatorLiveAliases.has(id)));
}

function markCurrentCreatorAliases(value = {}, fallbackId = '') {
  getRawUserAliases(value, fallbackId).forEach((id) => currentCreatorLiveAliases.add(id));
}

function registerLiveUser(value = {}, fallbackId = '', options = {}) {
  const id = getRawUserId(value, fallbackId);
  if (!id) {
    return null;
  }

  const incomingAliases = getRawUserAliases(value, fallbackId);
  const existing = incomingAliases
    .map((alias) => liveUserDirectory.get(alias))
    .find((entry) => entry && (entry.nickname || entry.displayId || entry.avatar))
    || liveUserDirectory.get(id)
    || {};
  const aliases = [...new Set([
    ...incomingAliases,
    ...(Array.isArray(existing.aliases) ? existing.aliases : []),
    existing.id,
    id
  ].map(normalizeBattleId).filter(Boolean))];
  const displayId = getRawUserDisplayId(value) || existing.displayId || '';
  const nickname = getRawUserNickname(value) || existing.nickname || displayId || '';
  const user = {
    id: existing.id || id,
    displayId,
    nickname,
    avatar: getRawUserAvatar(value) || existing.avatar || '',
    aliases
  };
  aliases.forEach((alias) => liveUserDirectory.set(alias, user));
  liveUserDirectory.set(user.id, user);

  if (
    options.currentCreator
    || isCurrentCreatorHandle(displayId)
    || aliases.some(isCurrentCreatorAlias)
  ) {
    currentCreatorLiveUserId = user.id;
    aliases.forEach((alias) => currentCreatorLiveAliases.add(alias));
  }
  return user;
}

function registerRoomOwner(roomInfo, creator = getCurrentCreator()) {
  const root = roomInfo && typeof roomInfo === 'object' ? roomInfo : {};
  const data = root.data && typeof root.data === 'object' ? root.data : {};
  const candidates = [
    root.owner,
    root.user,
    root.ownerInfo,
    data.owner,
    data.user,
    data.ownerInfo
  ].filter((entry) => entry && typeof entry === 'object');
  let owner = null;
  for (const candidate of candidates) {
    const registered = registerLiveUser(candidate, '', { currentCreator: true });
    if (!registered) {
      continue;
    }
    owner = registered;
    if (isCurrentCreatorHandle(registered.displayId)) {
      break;
    }
  }

  if (owner && (!owner.nickname || isBattleFallbackName(owner.nickname, owner.id))) {
    owner.nickname = getCreatorDisplayName(creator);
    getRawUserAliases(owner, owner.id).forEach((id) => liveUserDirectory.set(id, owner));
  }
  if (owner) {
    currentCreatorLiveUserId = owner.id;
    markCurrentCreatorAliases(owner, owner.id);
    if (owner.avatar && !creator.avatar) {
      creator.avatar = owner.avatar;
      syncCurrentCreatorState(creator);
    }
  }
  return owner;
}

function getEventUser(data) {
  const user = data && data.user ? data.user : {};
  const registered = registerLiveUser(user, data && data.userId);
  const uniqueId = user.uniqueId
    || user.displayId
    || user.unique_id
    || user.display_id
    || registered && registered.displayId
    || user.idStr
    || user.id
    || (data && (data.uniqueId || data.displayId || data.userId))
    || 'unknown';
  const nickname = user.nickname
    || user.nickName
    || registered && registered.nickname
    || (data && data.nickname)
    || uniqueId;
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
  const user = data && data.user || {};
  const userAttr = user.userAttr || {};
  return Boolean(
    userAttr.isAdmin
    || userAttr.isSuperAdmin
    || userAttr.isChannelAdmin
    || hasTruthyKey(data, 'isModeratorOfAnchor', 5)
    || hasModeratorBadge(user)
  );
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
  if (!user) {
    return false;
  }

  const badges = [
    ...(Array.isArray(user.badges) ? user.badges : []),
    ...(Array.isArray(user.badgeList) ? user.badgeList : [])
  ];
  return badges.some((badge) => hasModeratorText(badge, 4));
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

function isSuperFanEvent(data, user = getEventUser(data)) {
  return Boolean(
    isKnownSuperFanUser(user)
    || hasTruthyKey(data, 'isSuperFan', 5)
    || hasTruthyKey(data, 'superFan', 5)
    || hasSuperFanBadgeMarker(user)
    || hasSuperFanBadgeMarker(data && data.user)
    || hasSuperFanSignal(data)
  );
}

function markSuperFanUser(data) {
  getSuperFanUserKeys(data).forEach((key) => superFanUsers.add(key));
}

function isKnownSuperFanUser(value) {
  return getSuperFanUserKeys(value).some((key) => superFanUsers.has(key));
}

function hasSuperFanBadgeMarker(value) {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const badgeSources = [
    value.badges,
    value.badgeList,
    value.userBadges,
    value.userBadgeList,
    value.badgeImageList
  ];
  return badgeSources.some((source) => hasSuperFanSignalValue(source, 5));
}

function getSuperFanUserKeys(value) {
  const user = value && value.user && typeof value.user === 'object' ? value.user : value;
  const registered = user && typeof user === 'object' ? registerLiveUser(user, user.userId || user.id) : null;
  const keys = [
    user && user.uniqueId,
    user && user.displayId,
    user && user.unique_id,
    user && user.display_id,
    user && user.nickname,
    user && user.nickName,
    user && user.name,
    registered && registered.displayId,
    registered && registered.nickname
  ];
  return [...new Set(keys.map((key) => normalizeUniqueId(key)).filter(Boolean))];
}

function hasSuperFanSignal(data) {
  return hasSuperFanSignalValue(data, 4);
}

function hasSuperFanSignalValue(value, depth) {
  if (!value || depth < 0) {
    return false;
  }

  if (typeof value === 'string') {
    return /ttlive[_-]?superfan|ttlive[_-]?superFan|super[_\s-]*fan|becameSuperFan|superFanJoined/i.test(value);
  }

  if (Array.isArray(value)) {
    return value.some((item) => hasSuperFanSignalValue(item, depth - 1));
  }

  if (typeof value !== 'object') {
    return false;
  }

  const signalKeys = new Set([
    'type',
    'displayType',
    'display_type',
    'label',
    'defaultPattern',
    'pattern',
    'content'
  ]);

  return Object.entries(value).some(([key, item]) => (
    signalKeys.has(key) && hasSuperFanSignalValue(item, depth - 1)
  ));
}

function getGiftName(data) {
  return normalizeMessageText(
    data && (
      data.giftName
      || (data.giftDetails && data.giftDetails.giftName)
      || (data.gift && (data.gift.name || data.gift.describe))
      || (data.extendedGiftInfo && (data.extendedGiftInfo.name || data.extendedGiftInfo.giftName))
      || (data.giftId ? `gift ${data.giftId}` : '')
    )
  ) || 'prezent';
}

function getGiftCost(data) {
  return Number(
    data && (
      data.giftCost
      || (data.giftDetails && data.giftDetails.diamondCount)
      || (data.giftDetails && (data.giftDetails.diamond_count || data.giftDetails.cost || data.giftDetails.price))
      || (data.gift && data.gift.diamondCount)
      || (data.gift && (data.gift.diamond_count || data.gift.cost || data.gift.price))
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
      || (data.gift && data.gift.isBoxGift)
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
  const direct = Number(data && (data.total || data.totalUser));
  if (Number.isFinite(direct) && direct >= 0) {
    return direct;
  }
  return findNumericByKeys(data, new Set([
    'total',
    'viewerCount',
    'userCount',
    'totalUser',
    'totalUserCount',
    'memberCount',
    'onlineUserCount',
    'audienceCount'
  ]), 5);
}

function sendRoomStats(data) {
  const viewerCount = getViewerCount(data);
  if (!Number.isFinite(viewerCount) || viewerCount < 0) {
    return;
  }
  latestRoomStats = { viewerCount };
  sendToShell('shell:room-stats', latestRoomStats);
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

function createInitialBattleState() {
  return {
    active: false,
    battleId: '',
    status: 'idle',
    startedAt: '',
    endsAt: '',
    endedAt: '',
    showResultBanner: false,
    creatorSideId: '',
    winnerSideId: '',
    phase: 'idle',
    phaseEndsAt: '',
    sides: [],
    task: {
      status: 'idle',
      progress: 0,
      target: 0,
      rewardMultiple: 0,
      detail: '',
      actorName: '',
      missionEndsAt: '',
      rewardEndsAt: '',
      noticeEndsAt: '',
      contributors: []
    },
    effects: [],
    rewards: []
  };
}

function resetBattleState(options = {}) {
  clearTimeout(battleTaskTimer);
  clearTimeout(battlePublishTimer);
  clearTimeout(battleResultTimer);
  battleTaskTimer = null;
  battlePublishTimer = null;
  battleResultTimer = null;
  battleState = createInitialBattleState();
  battleUserDirectory.clear();
  battleHostDirectory.clear();
  battleSideByUser.clear();
  recentBattleEffects.clear();
  battleActive = false;
  if (options.publish !== false) {
    publishBattleState();
  }
}

function publishBattleState(options = {}) {
  clearTimeout(battlePublishTimer);
  battlePublishTimer = null;
}

function getBattlePeriodEnd(config, startKeys = []) {
  const period = config || {};
  const startValue = startKeys.map((key) => period[key]).find(Boolean);
  const startAt = normalizeBattleTimestamp(startValue);
  const duration = normalizeBattleNumber(period.duration);
  if (!duration) {
    return '';
  }
  const startMs = startAt ? new Date(startAt).getTime() : Date.now();
  return new Date(startMs + duration * 1000).toISOString();
}

function resetBattleTask() {
  battleState.task = createInitialBattleState().task;
  if (battleState.active && ['mission', 'mission-success'].includes(battleState.phase)) {
    battleState.phase = 'battle';
    battleState.phaseEndsAt = '';
  }
}

function scheduleBattleTaskReset(expiresAt) {
  clearTimeout(battleTaskTimer);
  battleTaskTimer = null;
  const endMs = new Date(expiresAt || '').getTime();
  if (!Number.isFinite(endMs)) {
    return;
  }
  const delay = Math.max(0, endMs - Date.now());
  battleTaskTimer = setTimeout(() => {
    if (battleState.task.noticeEndsAt !== expiresAt && battleState.task.missionEndsAt !== expiresAt) {
      return;
    }
    resetBattleTask();
    publishBattleState();
  }, delay);
}

function setTemporaryBattlePhase(phase, duration = BATTLE_EFFECT_STAGE_MS) {
  battleState.phase = phase;
  battleState.phaseEndsAt = new Date(Date.now() + duration).toISOString();
}

function normalizeBattleNumber(value) {
  if (value === undefined || value === null || value === '') {
    return 0;
  }

  const number = Number(String(value).replace(/[^\d.-]/g, ''));
  return Number.isFinite(number) ? number : 0;
}

function getLargestBattleNumber(...values) {
  return Math.max(0, ...values.map(normalizeBattleNumber));
}

function normalizeBattleId(value) {
  return value === undefined || value === null ? '' : String(value);
}

function normalizeBattleTimestamp(value) {
  const numeric = normalizeBattleNumber(value);
  if (!numeric) {
    return '';
  }

  const milliseconds = numeric < 100000000000 ? numeric * 1000 : numeric;
  const date = new Date(milliseconds);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}

function getBattleSetting(data) {
  return data && (data.battleSettings || data.battleSetting) || {};
}

function getBattleId(data) {
  const setting = getBattleSetting(data);
  return normalizeBattleId(data && data.battleId || setting.battleId);
}

function getKeyedBattleEntries(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((entry, index) => {
      if (entry && typeof entry === 'object' && 'value' in entry) {
        return [normalizeBattleId(entry.key || index), entry.value || {}];
      }
      return [normalizeBattleId(index), entry || {}];
    });
  }

  if (typeof value === 'object') {
    return Object.entries(value);
  }

  return [];
}

function getBattleAvatar(value) {
  return getRawUserAvatar(value);
}

function registerBattleUser(userId, value = {}) {
  const id = getRawUserId(value, userId);
  if (!id) {
    return null;
  }

  const liveUser = registerLiveUser(value, id) || liveUserDirectory.get(id) || {};
  const existing = battleUserDirectory.get(id) || liveUser;
  const incomingDisplayId = getRawUserDisplayId(value) || liveUser.displayId || '';
  const incomingNickname = getRawUserNickname(value) || liveUser.nickname || '';
  const existingNickname = isBattleFallbackName(existing.nickname, id) ? '' : existing.nickname;
  const displayId = incomingDisplayId || existing.displayId || '';
  const nickname = incomingNickname || incomingDisplayId || existingNickname || existing.displayId;
  const user = {
    id,
    displayId,
    nickname: nickname || displayId || '',
    avatar: getBattleAvatar(value) || liveUser.avatar || existing.avatar || ''
  };
  battleUserDirectory.set(id, user);
  getRawUserAliases(value, userId).forEach((alias) => battleUserDirectory.set(alias, user));
  return user;
}

function getBattleUser(userId) {
  const id = normalizeBattleId(userId);
  const known = battleUserDirectory.get(id) || liveUserDirectory.get(id);
  if (known) {
    return known;
  }
  if (isCurrentCreatorAlias(id)) {
    return {
      id,
      displayId: normalizeMessageText(getCurrentCreator() && getCurrentCreator().username),
      nickname: getCreatorDisplayName(),
      avatar: normalizeMessageText(getCurrentCreator() && getCurrentCreator().avatar)
    };
  }
  return {
    id,
    displayId: '',
    nickname: '',
    avatar: ''
  };
}

function isBattleFallbackName(value, userId = '') {
  const normalized = normalizeMessageText(value).toLowerCase();
  const id = normalizeBattleId(userId).toLowerCase();
  return !normalized
    || normalized === id
    || /^\d{8,}$/.test(normalized)
    || /\d{12,}/.test(normalized)
    || /^(użytkownik|user)\s+\d{8,}$/.test(normalized)
    || normalized === `użytkownik ${id}`
    || normalized === `user ${id}`
    || normalized === 'nieznany gracz'
    || normalized === 'nieznany uczestnik'
    || normalized === 'przeciwnik'
    || normalized === 'uczestnik bitwy'
    || /^tw.*rca\s+\d+$/.test(normalized);
}

function getBattleSideFallbackName(sideId, index = -1) {
  const id = normalizeBattleId(sideId);
  if (id && (id === battleState.creatorSideId || isCurrentCreatorAlias(id))) {
    return getCreatorDisplayName();
  }
  if (battleState.creatorSideId) {
    return 'Przeciwnik';
  }
  return index >= 0 ? `Twórca ${index + 1}` : 'Uczestnik bitwy';
}

function upsertBattleSide(sideId, patch = {}) {
  const id = normalizeBattleId(sideId || patch.id);
  if (!id) {
    return null;
  }

  let side = battleState.sides.find((item) => item.id === id);
  if (!side) {
    const user = battleHostDirectory.get(id) || {};
    const sideIndex = battleState.sides.length;
    side = {
      id,
      name: !isBattleFallbackName(patch.name, id)
        ? patch.name
        : !isBattleFallbackName(user.nickname, id)
          ? user.nickname
          : getBattleSideFallbackName(id, sideIndex),
      displayId: patch.displayId || user.displayId,
      avatar: patch.avatar || user.avatar,
      score: 0,
      result: '',
      contributors: []
    };
    battleState.sides.push(side);
  }
  battleSideByUser.set(id, id);
  if (isCurrentCreatorAlias(id)) {
    battleState.creatorSideId = id;
  }

  Object.entries(patch).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (key === 'name' && isBattleFallbackName(value, id)) {
        return;
      }
      side[key] = value;
    }
  });
  return side;
}

function associateBattleSideWithUser(sideId, user, source = {}) {
  const id = normalizeBattleId(sideId);
  if (!id || !user) {
    return;
  }
  const aliases = [...new Set([
    id,
    user.id,
    ...(Array.isArray(user.aliases) ? user.aliases : []),
    ...getRawUserAliases(source)
  ].map(normalizeBattleId).filter(Boolean))];
  const identity = {
    ...user,
    aliases: [...new Set([
      ...(Array.isArray(user.aliases) ? user.aliases : []),
      ...aliases
    ])]
  };
  aliases.forEach((alias) => {
    battleUserDirectory.set(alias, identity);
    liveUserDirectory.set(alias, identity);
    battleSideByUser.set(alias, id);
  });
  battleHostDirectory.set(id, identity);
  if (aliases.some(isCurrentCreatorAlias) || isCurrentCreatorHandle(identity.displayId)) {
    aliases.forEach((alias) => currentCreatorLiveAliases.add(alias));
    battleState.creatorSideId = id;
  }
}

function prepareBattleState(data, creator, activate = true) {
  const wasActive = battleState.active;
  const battleId = getBattleId(data);
  if (battleId && battleState.battleId && battleState.battleId !== battleId) {
    battleState = createInitialBattleState();
    battleUserDirectory.clear();
    battleHostDirectory.clear();
    battleSideByUser.clear();
    recentBattleEffects.clear();
  }

  if (battleId) {
    battleState.battleId = battleId;
  }
  const setting = getBattleSetting(data);
  const startedAt = normalizeBattleTimestamp(setting.startTimeMs || setting.startTime);
  let endsAt = normalizeBattleTimestamp(setting.endTimeMs || setting.endTime);
  if (!endsAt && startedAt && normalizeBattleNumber(setting.duration) > 0) {
    endsAt = new Date(new Date(startedAt).getTime() + normalizeBattleNumber(setting.duration) * 1000).toISOString();
  }
  battleState.startedAt = startedAt || battleState.startedAt;
  battleState.endsAt = endsAt || battleState.endsAt;

  getKeyedBattleEntries(data && (data.anchorsInfo || data.anchorInfo)).forEach(([key, wrapper]) => {
    const value = wrapper && (wrapper.user || wrapper.value && wrapper.value.user || wrapper.value) || wrapper || {};
    const user = registerBattleUser(value.userId || key, value);
    if (!user) {
      return;
    }
    const sideId = normalizeBattleId(key || value.roomId || value.userId || user.id);
    associateBattleSideWithUser(sideId, user, value);
    upsertBattleSide(sideId, {
      name: user.nickname,
      displayId: user.displayId,
      avatar: user.avatar
    });
  });

  const creatorName = String(creator && creator.username || '').replace(/^@/, '').toLowerCase();
  if (creatorName) {
    const creatorSide = battleState.sides.find((side) => String(side.displayId || '').replace(/^@/, '').toLowerCase() === creatorName);
    battleState.creatorSideId = creatorSide ? creatorSide.id : battleState.creatorSideId;
  }

  if (activate) {
    clearTimeout(battleResultTimer);
    battleResultTimer = null;
    battleActive = true;
    battleState.active = true;
    battleState.status = 'active';
    battleState.showResultBanner = false;
    if (!wasActive || ['idle', 'finished', 'cancelled'].includes(battleState.phase)) {
      battleState.phase = battleState.task.status === 'active' ? 'mission' : 'battle';
      battleState.phaseEndsAt = battleState.task.missionEndsAt || '';
    }
    battleState.endedAt = '';
    battleState.winnerSideId = '';
  }
}

function applyBattleArmies(value) {
  getKeyedBattleEntries(value).forEach(([key, army]) => {
    army = army || {};
    const sideId = normalizeBattleId(army.anchorIdStr || army.anchorId || key);
    if (!sideId) {
      return;
    }
    battleSideByUser.set(sideId, sideId);

    const allContributors = (army.userArmies || army.userArmy || [])
      .map((entry) => {
        const user = registerBattleUser(entry.userIdStr || entry.userId, entry);
        if (!user) {
          return null;
        }
        battleSideByUser.set(user.id, sideId);
        return {
          id: user.id,
          name: user.nickname,
          displayId: user.displayId,
          avatar: user.avatar,
          score: getLargestBattleNumber(entry.score, entry.diamondScore, entry.enigmaScore)
        };
      })
      .filter(Boolean)
      .sort((left, right) => right.score - left.score);
    const contributors = allContributors.slice(0, 5);
    const contributorScore = allContributors.reduce((total, entry) => total + entry.score, 0);

    const user = battleHostDirectory.get(sideId) || {};
    upsertBattleSide(sideId, {
      name: user.nickname,
      displayId: user.displayId,
      avatar: user.avatar,
      score: getLargestBattleNumber(army.hostscore, army.hostScore, army.score, contributorScore),
      contributors
    });
  });
  reconcileBattlePeople();
}

function applyBattleTeamArmies(value) {
  const teams = Array.isArray(value) ? value : [];
  teams.forEach((team) => {
    team = team || {};
    const teamId = normalizeBattleId(team.teamId);
    const members = Array.isArray(team.teamUser) ? team.teamUser : [];
    const army = team.userArmies || {};
    const armySideId = normalizeBattleId(army.anchorIdStr || army.anchorId);
    const allContributors = (army.userArmies || army.userArmy || [])
      .map((entry) => {
        const user = registerBattleUser(entry.userIdStr || entry.userId, entry);
        if (!user) {
          return null;
        }
        if (armySideId) {
          battleSideByUser.set(user.id, armySideId);
        }
        return {
          id: user.id,
          name: user.nickname,
          displayId: user.displayId,
          avatar: user.avatar,
          score: getLargestBattleNumber(entry.score, entry.diamondScore, entry.enigmaScore)
        };
      })
      .filter(Boolean)
      .sort((left, right) => right.score - left.score);

    members.forEach((member) => {
      const sideId = normalizeBattleId(member && (member.userIdStr || member.userId));
      if (!sideId) {
        return;
      }
      const knownHost = getBattleUser(sideId);
      if (!battleHostDirectory.has(sideId) && !isBattleFallbackName(knownHost.nickname, sideId)) {
        associateBattleSideWithUser(sideId, knownHost, member);
      }
      const contributors = sideId === armySideId ? allContributors.slice(0, 5) : [];
      upsertBattleSide(sideId, {
        teamId,
        score: getLargestBattleNumber(member.score, member.enigmaScore),
        contributors
      });
    });

    if (!members.length && armySideId) {
      applyBattleArmies([{ key: armySideId, value: army }]);
    }
  });
  reconcileBattlePeople();
}

function resolveBattleSideId(actorId, targetIds = [], explicitSideId = '') {
  const direct = normalizeBattleId(explicitSideId);
  if (direct && battleState.sides.some((side) => side.id === direct)) {
    return direct;
  }

  const actorSideId = battleSideByUser.get(normalizeBattleId(actorId));
  if (actorSideId) {
    return actorSideId;
  }

  return '';
}

function reconcileBattlePeople() {
  battleState.sides = battleState.sides.map((side, index) => {
    const user = battleHostDirectory.get(side.id) || {};
    if (isCurrentCreatorAlias(side.id) || isCurrentCreatorHandle(user.displayId)) {
      battleState.creatorSideId = side.id;
    }
    const fallbackName = getBattleSideFallbackName(side.id, index);
    const resolvedName = !isBattleFallbackName(user.nickname, side.id)
      ? user.nickname
      : fallbackName;
    return {
      ...side,
      name: !isBattleFallbackName(user.nickname, side.id)
        ? user.nickname
        : isBattleFallbackName(side.name, side.id) || side.name === fallbackName
          ? resolvedName
          : side.name,
      displayId: user.displayId || side.displayId,
      avatar: user.avatar || side.avatar
    };
  });
  battleState.effects = battleState.effects.map((effect) => {
    const actor = effect.system ? null : getBattleUser(effect.actorId);
    return {
      ...effect,
      actorName: actor && !isBattleFallbackName(actor.nickname, actor.id)
        ? actor.nickname
        : effect.actorName,
      sideId: effect.system
        ? ''
        : effect.sideId || resolveBattleSideId(effect.actorId, effect.targetIds)
    };
  });
  battleState.rewards = battleState.rewards.map((reward) => {
    const user = getBattleUser(reward.userId);
    return {
      ...reward,
      userName: !isBattleFallbackName(user.nickname, user.id) ? user.nickname : reward.userName,
      sideId: reward.sideId || resolveBattleSideId(reward.userId)
    };
  });
  battleState.task.contributors = (battleState.task.contributors || []).map((entry) => ({
    ...entry,
    name: !isBattleFallbackName(getBattleUser(entry.id).nickname, entry.id)
      ? getBattleUser(entry.id).nickname
      : entry.name
  }));
}

function registerLinkedBattleAliases(userId, roomId) {
  const userKey = normalizeBattleId(userId);
  const roomKey = normalizeBattleId(roomId);
  if (!userKey && !roomKey) {
    return null;
  }
  const user = registerLiveUser({
    id: userKey,
    roomId: roomKey
  }, userKey || roomKey);
  if (!user) {
    return null;
  }
  const matchingSide = battleState.sides.find((side) => (
    side.id === userKey
    || side.id === roomKey
    || (Array.isArray(user.aliases) && user.aliases.includes(side.id))
  ));
  if (matchingSide) {
    associateBattleSideWithUser(matchingSide.id, user, { roomId: roomKey, userId: userKey });
  }
  return user;
}

function handleBattleLinkState(data) {
  const states = Array.isArray(data && data.userStates) ? data.userStates : [];
  let changed = false;
  states.forEach((entry) => {
    const player = entry && entry.user || {};
    const before = getBattleUser(player.roomId || player.userId);
    const user = registerLinkedBattleAliases(player.userId, player.roomId);
    if (
      user
      && (!before || before.nickname !== user.nickname || before.displayId !== user.displayId)
    ) {
      changed = true;
    }
  });
  if (states.length && (battleActive || battleState.active)) {
    reconcileBattlePeople();
    publishBattleState();
  } else if (changed) {
    reconcileBattlePeople();
  }
}

function handleBattleIdentityMessage(data, creator) {
  const users = Array.isArray(data && data.linkedUsers) ? data.linkedUsers : [];
  let changed = false;
  users.forEach((value) => {
    const id = getRawUserId(value);
    const before = id ? liveUserDirectory.get(id) : null;
    const user = registerLiveUser(value);
    if (!user) {
      return;
    }
    registerBattleUser(user.id, user);
    const matchingSide = battleState.sides.find((side) => (
      side.id === user.id
      || (Array.isArray(user.aliases) && user.aliases.includes(side.id))
    ));
    if (matchingSide) {
      associateBattleSideWithUser(matchingSide.id, user, value);
    }
    if (!before || before.nickname !== user.nickname || before.displayId !== user.displayId) {
      changed = true;
    }
  });
  const linkedAliasUser = registerLinkedBattleAliases(
    data && data.fromUserId,
    data && data.fromRoomId
  );

  if (!currentCreatorLiveUserId) {
    const creatorHandle = normalizeMessageText(creator && creator.username).replace(/^@/, '').toLowerCase();
    const creatorUser = users
      .map((value) => registerLiveUser(value))
      .find((user) => normalizeMessageText(user && user.displayId).replace(/^@/, '').toLowerCase() === creatorHandle);
    if (creatorUser) {
      currentCreatorLiveUserId = creatorUser.id;
      (creatorUser.aliases || []).forEach((alias) => currentCreatorLiveAliases.add(alias));
      changed = true;
    }
  }

  if ((changed || users.length || linkedAliasUser) && (battleActive || battleState.active)) {
    reconcileBattlePeople();
    publishBattleState();
  }
}

function applyBattleResults(value) {
  getKeyedBattleEntries(value).forEach(([key, result]) => {
    result = result || {};
    const sideId = normalizeBattleId(result.userId || key);
    const side = upsertBattleSide(sideId, {
      score: getLargestBattleNumber(result.score, result.diamondScore, result.enigmaScore)
    });
    if (!side) {
      return;
    }
    const resultValue = Number(result.result);
    side.result = resultValue === 0 ? 'win' : resultValue === 1 ? 'lose' : resultValue === 2 ? 'draw' : side.result;
    if (side.result === 'win') {
      battleState.winnerSideId = side.id;
    }
  });
}

function applyBattleTeamResults(value) {
  const teams = Array.isArray(value) ? value : [];
  teams.forEach((team) => {
    const teamId = normalizeBattleId(team && team.teamId);
    const teamResult = Number(team && team.result);
    const members = Array.isArray(team && team.teamUser) ? team.teamUser : [];
    members.forEach((member) => {
      const sideId = normalizeBattleId(member && (member.userIdStr || member.userId));
      const side = upsertBattleSide(sideId, {
        teamId,
        score: getLargestBattleNumber(member && member.score, member && member.enigmaScore)
      });
      if (!side) {
        return;
      }
      side.result = teamResult === 0 ? 'win' : teamResult === 1 ? 'lose' : teamResult === 2 ? 'draw' : side.result;
      if (side.result === 'win' && !battleState.winnerSideId) {
        battleState.winnerSideId = side.id;
      }
    });
  });
}

function handleBattleMessage(data, creator) {
  const action = Number(data && data.action);
  const opensBattle = action === 4 || Number(getBattleSetting(data).status) === 1;
  prepareBattleState(data, creator, opensBattle || battleActive);
  applyBattleArmies(data && data.armies);
  applyBattleTeamArmies(data && data.teamArmies);
  applyBattleResults(data && data.battleResult);
  applyBattleTeamResults(data && data.teamBattleResult);
  applyBattleEffectInfos(data, { recordEffects: false });

  if (action === 5 || action === 6 || Number(getBattleSetting(data).status) >= 2) {
    finishBattleState(data, action === 6 ? 'cancelled' : 'finished');
    return;
  }

  publishBattleState();
}

function handleBattleArmies(data, creator) {
  prepareBattleState(data, creator, true);
  applyBattleArmies(data && (data.armies || data.battleItems));
  applyBattleTeamArmies(data && data.teamArmies);

  const recognizedEffect = applyBattleEffectInfos(data, {
    recordEffects: Number(data && data.triggerReason) === 5
  });
  const actorId = normalizeBattleId(data && data.fromUserId);
  if (data && data.triggerCriticalStrike && actorId && !recognizedEffect) {
    addBattleEffect({
      type: 'critical',
      actorId,
      detail: 'critical-strike',
      sourceKey: data.logId || getMessageId(data)
    });
  }
  if (Number(data && data.triggerReason) === 5 || data && data.triggerCriticalStrike) {
    setTemporaryBattlePhase('booster');
  }

  if (Number(data && data.triggerReason) === 2) {
    finishBattleState(data, 'finished');
    return;
  }

  publishBattleState({ throttle: true });
}

function applyBattleEffectInfos(data, options = {}) {
  const actorId = normalizeBattleId(data && data.fromUserId);
  const effectInfos = data && data.effectInfos;
  const effects = effectInfos && (effectInfos.effectInfoList || effectInfos.effects) || [];
  let recognizedEffect = false;
  effects.forEach((effect, index) => {
    const rawType = `${effect && effect.type || ''} ${effect && effect.effectExtra || ''}`;
    const type = detectBattleEffectType(rawType);
    const targetIds = Array.isArray(effect && effect.uidList) ? effect.uidList : [];
    if (options.recordEffects && type !== 'effect' && (actorId || type === 'freeze')) {
      recognizedEffect = true;
      addBattleEffect({
        type,
        actorId: type === 'freeze' ? '' : actorId,
        system: type === 'freeze',
        targetIds,
        detail: normalizeMessageText(effect && effect.effectExtra || effect && effect.type || ''),
        sourceKey: `${data.logId || getMessageId(data) || Date.now()}:${index}`
      });
    }
    updateBattleRewards(type, targetIds);
  });
  return recognizedEffect;
}

function readBattlePrompt(prompt) {
  const elements = prompt && (prompt.elems || prompt.promptElements) || [];
  return normalizeMessageText(elements
    .map((entry) => entry && (entry.value || entry.promptField || entry.promptFieldKey))
    .filter(Boolean)
    .join(' '));
}

function handleBattleTask(data) {
  prepareBattleState(data, getCurrentCreator(), true);
  const type = Number(data && (data.taskMessageType ?? data.battleTaskMessageType));
  const start = data && (data.start || data.taskStart);
  const update = data && (data.taskUpdate || data.update);
  const settle = data && (data.taskSettle || data.settle);
  const reward = data && (data.reward || data.rewardSettle);

  if (type === 0 && start) {
    const config = start.config || {};
    const targetConfig = config.targetConfig || {};
    const rewardConfig = config.rewardConfig || {};
    const missionEndsAt = getBattlePeriodEnd(targetConfig, ['targetStartTimestamp', 'targetStartTime']);
    const rewardEndsAt = getBattlePeriodEnd(rewardConfig, ['rewardStartTimestamp', 'rewardStartTime']);
    battleState.task = {
      status: 'active',
      progress: 0,
      target: normalizeBattleNumber(targetConfig.progressTarget),
      rewardMultiple: normalizeBattleNumber(rewardConfig.rewardMultiple),
      detail: readBattlePrompt(targetConfig.staticPrompt || targetConfig.clickPrompt),
      actorName: '',
      missionEndsAt,
      rewardEndsAt,
      noticeEndsAt: '',
      contributors: []
    };
    battleState.phase = 'mission';
    battleState.phaseEndsAt = missionEndsAt;
    scheduleBattleTaskReset(missionEndsAt);
  } else if (type === 1 && update) {
    const actor = getBattleUser(update.fromUserId);
    battleState.task.status = 'active';
    battleState.task.progress = normalizeBattleNumber(update.progress);
    battleState.task.actorName = actor.nickname;
    battleState.task.detail = normalizeMessageText(update.promptKey) || battleState.task.detail;
    addBattleTaskContributor(update.fromUserId);
    battleState.phase = 'mission';
  } else if (type === 2 && settle) {
    const result = Number(settle.result);
    battleState.task.status = result === 0 || result === 2 ? 'success' : 'failed';
    battleState.phase = battleState.task.status === 'success' ? 'mission-success' : 'battle';
    battleState.task.noticeEndsAt = new Date(Date.now() + BATTLE_TASK_NOTICE_MS).toISOString();
    battleState.phaseEndsAt = battleState.task.noticeEndsAt;
    scheduleBattleTaskReset(battleState.task.noticeEndsAt);
  } else if (type === 3 && reward) {
    battleState.task.status = Number(reward.status) === 0 ? 'reward' : 'failed';
    battleState.task.detail = readBattlePrompt(reward.prompt) || battleState.task.detail;
    battleState.task.noticeEndsAt = new Date(Date.now() + BATTLE_TASK_NOTICE_MS).toISOString();
    battleState.phase = 'battle';
    battleState.phaseEndsAt = '';
    scheduleBattleTaskReset(battleState.task.noticeEndsAt);
  }

  publishBattleState();
}

function addBattleTaskContributor(userId) {
  const id = normalizeBattleId(userId);
  if (!id) {
    return false;
  }
  const user = getBattleUser(id);
  const contributors = Array.isArray(battleState.task.contributors) ? battleState.task.contributors : [];
  const existing = contributors.find((entry) => entry.id === id);
  if (existing) {
    const nextName = user.nickname;
    const changed = existing.name !== nextName;
    existing.name = nextName;
    existing.updates += 1;
    return changed;
  } else {
    contributors.push({
      id,
      name: user.nickname,
      updates: 1
    });
  }
  battleState.task.contributors = contributors.slice(-20);
  return true;
}

function handleBattleBoostCard(data) {
  if (!battleActive && !battleState.active) {
    return;
  }

  const cards = data && data.cards || [];
  const detected = cards
    .map((card) => detectBattleEffectType(card && (card.mCardId || card.cardId || card.taskId)))
    .find((type) => type !== 'effect');
  if (detected) {
    setTemporaryBattlePhase('booster');
    publishBattleState();
  }
}

function handleBattleGift(data) {
  registerLiveUser(data && data.user, data && data.userId);
  registerLiveUser(
    data && data.toUser,
    data && (data.toUserId || data.toMemberId || data.toMemberIdInt)
  );
  if (!battleActive && !battleState.active) {
    return;
  }

  let shouldPublish = false;
  const senderValue = data && data.user || {};
  const senderId = normalizeBattleId(
    senderValue.idStr
    || senderValue.id
    || senderValue.userIdStr
    || senderValue.userId
    || data && data.userId
  );
  const sender = registerBattleUser(senderId, senderValue);
  const receiverValue = data && data.toUser || {};
  const receiverId = normalizeBattleId(
    receiverValue.idStr
    || receiverValue.id
    || receiverValue.userIdStr
    || receiverValue.userId
    || data && (data.toUserId || data.toMemberId || data.toMemberIdInt)
  );
  const receiver = registerBattleUser(receiverId, receiverValue);
  if (sender) {
    const receiverSideId = receiver ? resolveBattleSideId(receiver.id) : '';
    if (receiverSideId) {
      battleSideByUser.set(sender.id, receiverSideId);
    }
    if (battleState.task.status === 'active') {
      shouldPublish = addBattleTaskContributor(sender.id) || shouldPublish;
    }
  }

  if (shouldPublish) {
    reconcileBattlePeople();
    publishBattleState();
  }
}

function detectBattleEffectType(value) {
  const normalized = String(value || '').trim().toLowerCase();
  if (/^4\b/.test(normalized) || /vault.?glove/.test(normalized)) {
    return 'glove';
  }
  if (/^1\b/.test(normalized) || /critical.?strike/.test(normalized)) {
    return 'critical';
  }
  if (/^2\b/.test(normalized) || /\btop.?2\b/.test(normalized)) {
    return 'top2';
  }
  if (/^3\b/.test(normalized) || /\btop.?3\b/.test(normalized)) {
    return 'top3';
  }
  if (/fog|mist|smoke|mg[łl]a/.test(normalized)) {
    return 'fog';
  }
  if (/glove|r[eÄ™]kawic/.test(normalized)) {
    return 'glove';
  }
  if (/hammer|m[łl]ot/.test(normalized)) {
    return 'hammer';
  }
  if (/freeze|frozen|ice|snow|zamro|l[oó]d/.test(normalized)) {
    return 'freeze';
  }
  if (/shield|tarcza|protect/.test(normalized)) {
    return 'shield';
  }
  if (/boost|power|multiplier|bonus|x[2345]/.test(normalized)) {
    return 'boost';
  }
  return 'effect';
}

function updateBattleRewards(type, userIds) {
  if (type === 'freeze') {
    battleState.rewards = battleState.rewards.filter((reward) => reward.type !== 'freeze');
    return;
  }
  if (!Array.isArray(userIds) || !userIds.length) {
    return;
  }
  const retained = battleState.rewards.filter((reward) => reward.type !== type);
  const next = userIds
    .map(normalizeBattleId)
    .filter(Boolean)
    .map((userId) => {
      const user = getBattleUser(userId);
      return {
        id: `${type}:${userId}`,
        type,
        userId,
        userName: user.nickname,
        sideId: resolveBattleSideId(userId),
        awardedAt: new Date().toISOString()
      };
    });
  battleState.rewards = [...retained, ...next].slice(-30);
  reconcileBattlePeople();
}

function addBattleEffect(options = {}) {
  const system = Boolean(options.system);
  const actor = system ? { id: '', nickname: '' } : getBattleUser(options.actorId);
  const targetIds = Array.isArray(options.targetIds) ? options.targetIds.map(normalizeBattleId).filter(Boolean) : [];
  const targetNames = targetIds.map((id) => getBattleUser(id).nickname);
  const targetSideIds = [...new Set(targetIds
    .map((id) => resolveBattleSideId(id))
    .filter(Boolean))];
  const type = options.type || 'effect';
  const multiplier = normalizeMultiplier(options.multiplier);
  const sideId = system ? '' : resolveBattleSideId(options.actorId, targetIds, options.sideId);
  const now = Date.now();
  const signature = `${type}:${sideId}:${actor.id}:${targetIds.join(',')}:${multiplier}:${options.detail || ''}`;

  for (const [key, timestamp] of recentBattleEffects) {
    if (now - timestamp > 15000) {
      recentBattleEffects.delete(key);
    }
  }
  if (recentBattleEffects.has(signature) && now - recentBattleEffects.get(signature) < 5000) {
    return;
  }
  recentBattleEffects.set(signature, now);

  const effect = {
    id: normalizeBattleId(options.sourceKey) || `${now}-${battleState.effects.length}`,
    timestamp: new Date(now).toISOString(),
    type,
    sideId,
    actorId: actor.id,
    actorName: !system && options.actorId ? actor.nickname : '',
    system,
    targetIds,
    targetNames,
    targetSideIds,
    multiplier,
    expiresAt: new Date(now + BATTLE_EFFECT_STAGE_MS).toISOString(),
    detail: normalizeMessageText(options.detail || '')
  };
  battleState.effects = [effect, ...battleState.effects].slice(0, 16);
  setTemporaryBattlePhase('booster');

  if (options.notify !== false && type !== 'effect') {
    sendBattleEffectAlert(effect);
  }
}

function sendBattleEffectAlert(effect) {
  sendToShell('shell:battle-alert', {
    tone: 'battle-effect',
    textKey: 'battle.effectAlert',
    uppercase: false,
    effectType: effect.type,
    actorName: effect.actorName,
    multiplier: effect.multiplier
  });
}

function finishBattleState(data, status = 'finished') {
  clearTimeout(battleTaskTimer);
  clearTimeout(battleResultTimer);
  battleTaskTimer = null;
  battleResultTimer = null;
  prepareBattleState(data, getCurrentCreator(), false);
  applyBattleArmies(data && (data.armies || data.battleItems));
  applyBattleTeamArmies(data && data.teamArmies);
  applyBattleResults(data && data.battleResult);
  applyBattleTeamResults(data && data.teamBattleResult);
  applyBattleEffectInfos(data, { recordEffects: false });
  battleState.active = false;
  battleState.status = status;
  battleState.phase = status === 'cancelled' ? 'cancelled' : 'finished';
  battleState.endedAt = new Date().toISOString();
  battleState.showResultBanner = true;
  battleState.phaseEndsAt = '';
  resetBattleTask();
  battleState.rewards = battleState.rewards.filter((reward) => reward.type !== 'freeze');
  battleActive = false;
  lastBattleAlertKey = '';
  lastBattleAlertAt = 0;

  if (!battleState.winnerSideId && battleState.sides.length) {
    const ranked = [...battleState.sides].sort((left, right) => right.score - left.score);
    if (ranked.length === 1 || ranked[0].score > ranked[1].score) {
      battleState.winnerSideId = ranked[0].id;
      ranked[0].result = 'win';
    } else if (ranked.length > 1) {
      ranked[0].result = 'draw';
      ranked[1].result = 'draw';
    }
  }

  publishBattleState();
  battleResultTimer = setTimeout(() => {
    battleResultTimer = null;
    battleState.showResultBanner = false;
    publishBattleState();
  }, BATTLE_RESULT_BANNER_MS);
  sendToShell('shell:battle-alert', {
    tone: 'battle-result',
    textKey: status === 'cancelled' ? 'battle.cancelled' : 'battle.finished',
    uppercase: false
  });
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

function sendHondaJoinAlert() {
  sendToShell('shell:battle-alert', {
    tone: 'honda',
    uppercase: false,
    text: HONDA_JOIN_TEXT
  });
}

function publishState() {
  sendToShell('shell:state', { ...state });
}

function sendToShell(channel, payload) {
  if (shellView && !shellView.webContents.isDestroyed()) {
    shellView.webContents.send(channel, payload);
  }
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

function summarizeArchiveMessages(messages) {
  const kinds = {
    chat: 0,
    like: 0,
    gift: 0,
    box: 0,
    repost: 0,
    share: 0,
    member: 0
  };
  const moderators = new Set();
  let giftCoins = 0;

  messages.forEach((message) => {
    const kind = Object.prototype.hasOwnProperty.call(kinds, message.kind) ? message.kind : 'chat';
    kinds[kind] += 1;
    giftCoins += kind === 'gift' || kind === 'box' ? Math.max(0, Number(message.giftCost) || 0) : 0;
    if (message.isModerator) {
      moderators.add(String(message.uniqueId || message.authorName || '').toLowerCase());
    }
  });

  return {
    total: messages.length,
    kinds,
    giftCoins,
    moderators: Array.from(moderators).filter(Boolean).length
  };
}

function readStructuredArchive(fullPath) {
  const document = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  const sessionData = document && document.session && typeof document.session === 'object'
    ? document.session
    : {};
  const messages = Array.isArray(document && document.messages) ? document.messages : [];
  return {
    version: Number(document && document.version) || 2,
    session: sessionData,
    messages
  };
}

function parseLegacyArchiveTimestamp(value, fallbackDate) {
  const match = String(value || '').match(/^(\d{2})\.(\d{2})\.(\d{4}),\s*(\d{2}:\d{2}:\d{2})$/);
  if (match) {
    return `${match[3]}-${match[2]}-${match[1]}T${match[4]}`;
  }

  const time = String(value || '').match(/(\d{2}:\d{2}:\d{2})/);
  return time && fallbackDate ? `${fallbackDate}T${time[1]}` : new Date().toISOString();
}

function inferLegacyArchiveKind(text) {
  const normalized = String(text || '').toLowerCase();
  if (normalized.includes('skrzyn') || normalized.includes('portal')) {
    return 'box';
  }
  if (normalized.includes('prezent') || normalized.includes('gift')) {
    return 'gift';
  }
  if (normalized.includes('polubi') || normalized.includes('like')) {
    return 'like';
  }
  if (normalized.includes('repost')) {
    return 'repost';
  }
  if (normalized.includes('udost') || normalized.includes('share')) {
    return 'share';
  }
  if (normalized.includes('dołączy') || normalized.includes('dolacz') || normalized.includes('joined')) {
    return 'member';
  }
  return 'chat';
}

function parseLegacyArchive(fullPath, entry) {
  const text = fs.readFileSync(fullPath, 'utf8');
  const messages = [];
  const linePattern = /^\[([^\]]+)\]\s+(.+)$/gm;
  let match;

  while ((match = linePattern.exec(text)) !== null) {
    const raw = match[2].trim();
    const authorMatch = raw.match(/^(.+?)\s+\(@([^)]+)\)\s*:?\s*(.*)$/);
    const authorName = authorMatch ? authorMatch[1].trim() : '';
    const uniqueId = authorMatch ? authorMatch[2].trim() : '';
    const messageText = authorMatch ? authorMatch[3].trim() : raw;
    messages.push({
      id: `legacy:${messages.length + 1}`,
      timestamp: parseLegacyArchiveTimestamp(match[1], entry.date),
      kind: inferLegacyArchiveKind(messageText),
      authorName,
      uniqueId,
      isModerator: false,
      isSuperFan: false,
      text: messageText,
      archiveText: raw
    });
  }

  return { text, messages };
}

function buildStructuredArchiveEntry(fileName) {
  const fullPath = path.join(ARCHIVE_DIR, fileName);
  const stats = fs.statSync(fullPath);
  const document = readStructuredArchive(fullPath);
  const sessionData = document.session;
  const startedAt = sessionData.startedAt ? new Date(sessionData.startedAt) : stats.birthtime;
  const endedAt = sessionData.endedAt
    ? new Date(sessionData.endedAt)
    : (document.messages.length ? new Date(document.messages[document.messages.length - 1].timestamp) : stats.mtime);
  const startParts = getLocalDateParts(Number.isNaN(startedAt.getTime()) ? stats.birthtime : startedAt);
  const endParts = getLocalDateParts(Number.isNaN(endedAt.getTime()) ? stats.mtime : endedAt);
  const startTime = sessionData.time || startParts.time;
  const endTime = sessionData.endTime || endParts.time;

  return {
    id: fileName,
    format: 'structured',
    date: sessionData.date || startParts.date,
    time: startTime && endTime && startTime !== endTime ? `${startTime} - ${endTime}` : startTime,
    name: sessionData.name || (sessionData.username ? `@${sessionData.username}` : 'Archiwum'),
    username: sessionData.username || '',
    startedAt: sessionData.startedAt || startedAt.toISOString(),
    endedAt: sessionData.endedAt || endedAt.toISOString(),
    modifiedAt: stats.mtimeMs,
    summary: summarizeArchiveMessages(document.messages)
  };
}

function buildLegacyArchiveEntry(fileName) {
  const fullPath = path.join(ARCHIVE_DIR, fileName);
  const stats = fs.statSync(fullPath);
  const modified = getLocalDateParts(stats.mtime);
  const transmissionMatch = fileName.match(/^transmisja-(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2}-\d{2})-(.+?)(?:-\d+)?\.txt$/);
  if (transmissionMatch) {
    const startTime = transmissionMatch[2].replace(/-/g, ':');
    const range = getArchiveLineTimeRange(fullPath, transmissionMatch[1], startTime, modified.time);
    const entry = {
      id: fileName,
      format: 'legacy',
      date: range.date,
      time: range.time,
      name: `@${transmissionMatch[3]}`,
      username: transmissionMatch[3],
      modifiedAt: stats.mtimeMs
    };
    entry.summary = summarizeArchiveMessages(parseLegacyArchive(fullPath, entry).messages);
    return entry;
  }

  const dailyMatch = fileName.match(/^chat-archiwum-(\d{4}-\d{2}-\d{2})\.txt$/);
  if (dailyMatch) {
    const range = getArchiveLineTimeRange(fullPath, dailyMatch[1], '', modified.time);
    const entry = {
      id: fileName,
      format: 'legacy',
      date: range.date,
      time: range.time,
      name: 'Archiwum dzienne',
      username: '',
      modifiedAt: stats.mtimeMs
    };
    entry.summary = summarizeArchiveMessages(parseLegacyArchive(fullPath, entry).messages);
    return entry;
  }

  return null;
}

function listArchiveEntries() {
  ensureArchiveDir();
  return fs.readdirSync(ARCHIVE_DIR, { withFileTypes: true })
    .filter((item) => item.isFile() && ['.json', '.txt'].includes(path.extname(item.name).toLowerCase()) && item.name !== 'ostatnie-100-wiadomosci.txt')
    .map((item) => {
      try {
        return path.extname(item.name).toLowerCase() === '.json'
          ? buildStructuredArchiveEntry(item.name)
          : buildLegacyArchiveEntry(item.name);
      } catch {
        return null;
      }
    })
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
  if (archiveFile && path.resolve(fullPath) === path.resolve(archiveFile) && archiveWriteTimer) {
    clearTimeout(archiveWriteTimer);
    archiveWriteTimer = null;
    writeFullArchiveFile();
  }
  if (entry.format === 'structured') {
    const document = readStructuredArchive(fullPath);
    return {
      ok: true,
      entry,
      messages: document.messages,
      legacy: false
    };
  }

  const legacy = parseLegacyArchive(fullPath, entry);
  return {
    ok: true,
    entry,
    messages: legacy.messages,
    legacy: true,
    text: legacy.text
  };
}

function buildArchiveExportText(entry, messages) {
  const timeRange = entry.time || '';
  const username = entry.username || String(entry.name || '').replace(/^@/, '');
  const header = [
    'Czatbox TT - archiwum transmisji',
    `Data: ${entry.date || ''}`,
    `Godzina: ${timeRange}`,
    `Nazwa live: ${entry.name || ''}`,
    `Tworca: ${username ? `@${username}` : ''}`,
    '',
    '-----------------------------------------------------------------------------',
    ''
  ].join('\n');
  const body = messages
    .map((message) => `[${formatArchiveTime(message.timestamp)}] ${message.archiveText || buildArchiveText(message)}`)
    .join('\n');
  return `${header}${body}${body ? '\n' : ''}`;
}

async function exportArchive(archiveId) {
  const content = getArchiveContent(archiveId);
  if (!content.ok) {
    return content;
  }

  const defaultName = path.basename(content.entry.id, path.extname(content.entry.id));
  const result = await dialog.showSaveDialog({
    title: 'Eksportuj archiwum',
    defaultPath: `${defaultName}.txt`,
    filters: [{ name: 'Plik tekstowy', extensions: ['txt'] }]
  });
  if (result.canceled || !result.filePath) {
    return { ok: false, canceled: true };
  }

  fs.writeFileSync(result.filePath, buildArchiveExportText(content.entry, content.messages), 'utf8');
  return { ok: true, filePath: result.filePath };
}

function deleteArchive(archiveId) {
  ensureArchiveDir();
  const safeId = path.basename(String(archiveId || ''));
  const fullPath = path.join(ARCHIVE_DIR, safeId);
  if (!safeId || !fs.existsSync(fullPath)) {
    return { ok: false, error: 'archive-not-found' };
  }
  if (archiveFile && path.resolve(fullPath) === path.resolve(archiveFile)) {
    return { ok: false, error: 'archive-active' };
  }

  fs.unlinkSync(fullPath);
  return { ok: true };
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

  handleShell('shell:refresh-chat', async () => refreshCurrentChat());

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
  handleShell('shell:export-archive', async (archiveId) => exportArchive(archiveId));
  handleShell('shell:delete-archive', async (archiveId) => deleteArchive(archiveId));
  handleShell('shell:list-notes', async () => ({ ok: true, notes: listNotes() }));
  handleShell('shell:get-note', async (noteId) => getNote(noteId));
  handleShell('shell:save-note', async (note) => saveNote(note));
  handleShell('shell:delete-note', async (noteId) => deleteNote(noteId));
  handleShell('shell:get-ranking', async (language) => getCountryRanking(language));
  handleShell('shell:open-archive-folder', async () => {
    ensureArchiveDir();
    const error = await shell.openPath(ARCHIVE_DIR);
    return error ? { ok: false, error } : { ok: true };
  });
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

let autoUpdatesConfigured = false;
let updatePromptVisible = false;
let updateInstallInProgress = false;
let updateDownloadReject = null;

function normalizeVersionParts(version) {
  return String(version || '')
    .split(/[.-]/)
    .map((part) => Number.parseInt(part, 10))
    .map((part) => (Number.isFinite(part) ? part : 0));
}

function isVersionNewer(candidate, current) {
  const candidateParts = normalizeVersionParts(candidate);
  const currentParts = normalizeVersionParts(current);
  const length = Math.max(candidateParts.length, currentParts.length);
  for (let index = 0; index < length; index += 1) {
    const candidatePart = candidateParts[index] || 0;
    const currentPart = currentParts[index] || 0;
    if (candidatePart > currentPart) {
      return true;
    }
    if (candidatePart < currentPart) {
      return false;
    }
  }
  return false;
}

function getReleaseNotesText() {
  const candidates = [
    path.join(app.getAppPath(), `release-notes-${APP_VERSION}.md`),
    path.join(app.getAppPath(), 'RELEASE_NOTES.md')
  ];
  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        const text = fs.readFileSync(candidate, 'utf8').trim();
        if (text) {
          return text;
        }
      }
    } catch {
      // Fall back below.
    }
  }
  return RELEASE_NOTES_012;
}

function getUpdateNotes(info) {
  const releaseNotes = info && info.releaseNotes;
  if (Array.isArray(releaseNotes)) {
    return releaseNotes
      .map((entry) => {
        if (!entry) {
          return '';
        }
        if (typeof entry === 'string') {
          return entry;
        }
        return entry.note || entry.notes || '';
      })
      .filter(Boolean)
      .join('\n\n');
  }
  if (typeof releaseNotes === 'string' && releaseNotes.trim()) {
    return releaseNotes.trim();
  }
  return getReleaseNotesText();
}

function markUpdateCompleted(version, notes = '') {
  try {
    fs.writeFileSync(UPDATE_COMPLETED_FILE, JSON.stringify({
      version: version || '',
      notes: String(notes || '').trim(),
      completedAt: new Date().toISOString()
    }), 'utf8');
  } catch (error) {
    // The update must not fail only because the completion notice marker could not be saved.
  }
}

function consumeUpdateCompletedMarker() {
  try {
    if (!fs.existsSync(UPDATE_COMPLETED_FILE)) {
      return null;
    }
    const raw = fs.readFileSync(UPDATE_COMPLETED_FILE, 'utf8');
    fs.unlinkSync(UPDATE_COMPLETED_FILE);
    return JSON.parse(raw);
  } catch (error) {
    try {
      fs.unlinkSync(UPDATE_COMPLETED_FILE);
    } catch (cleanupError) {
      // Ignore cleanup problems.
    }
    return {};
  }
}

function showUpdateCompletedDialogIfNeeded() {
  const marker = consumeUpdateCompletedMarker();
  if (!marker) {
    return;
  }

  dialog.showMessageBox({
    type: 'info',
    title: 'Aktualizacja ukończona',
    message: 'Aktualizacja ukończona',
    detail: marker.notes || getReleaseNotesText(),
    buttons: ['OK'],
    defaultId: 0,
    noLink: true
  }).catch(() => {});
}

function configureAutoUpdates() {
  if (!app.isPackaged || isSmokeRun()) {
    return false;
  }

  if (autoUpdatesConfigured) {
    return true;
  }

  autoUpdatesConfigured = true;
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.logger = {
    info() {},
    warn() {},
    error() {},
    debug() {}
  };

  autoUpdater.on('update-available', (info) => {
    setUpdateMessage(`Dostępna aktualizacja ${info && info.version ? info.version : ''}`.trim());
  });

  autoUpdater.on('update-downloaded', async (info) => {
    setUpdateMessage(`Aktualizacja ${info && info.version ? info.version : ''} pobrana.`.trim());
    if (!updateInstallInProgress) {
      return;
    }

    markUpdateCompleted(info && info.version ? info.version : '', getUpdateNotes(info));
    await dialog.showMessageBox({
      type: 'info',
      title: 'Aktualizacja pobrana',
      message: 'Aktualizacja pobrana',
      detail: 'Program zostanie teraz zamknięty i uruchomiony ponownie, aby dokończyć instalację.',
      buttons: ['OK'],
      defaultId: 0,
      noLink: true
    }).catch(() => {});
    autoUpdater.quitAndInstall(true, true);
  });

  autoUpdater.on('error', (error) => {
    setUpdateMessage(`Błąd aktualizacji: ${getConnectionErrorMessage(error)}`);
    if (updateDownloadReject) {
      const reject = updateDownloadReject;
      updateDownloadReject = null;
      reject(error);
    }
  });

  return true;
}

async function beginUpdateInstall(info) {
  updateInstallInProgress = true;
  await dialog.showMessageBox({
    type: 'info',
    title: 'Aktualizacja',
    message: 'Rozpoczynam aktualizację',
    detail: 'Funkcje programu będą niedostępne do czasu zakończenia aktualizacji i ponownego uruchomienia aplikacji.',
    buttons: ['OK'],
    defaultId: 0,
    noLink: true
  }).catch(() => {});

  setUpdateMessage(`Pobieram aktualizację ${info && info.version ? info.version : ''}`.trim());
  await new Promise((resolve, reject) => {
    updateDownloadReject = reject;
    autoUpdater.downloadUpdate()
      .then(resolve)
      .catch(reject);
  });
}

async function promptForUpdate(info) {
  if (!info || !info.version || updatePromptVisible || updateInstallInProgress) {
    return false;
  }

  if (!isVersionNewer(info.version, APP_VERSION)) {
    return false;
  }

  updatePromptVisible = true;
  const result = await dialog.showMessageBox({
    type: 'question',
    title: 'Dostępna aktualizacja',
    message: `Dostępna jest aktualizacja ${info.version}`,
    detail: `${getUpdateNotes(info)}\n\nObecna wersja: ${APP_VERSION}`,
    buttons: ['Aktualizuj teraz', 'Uruchom bez aktualizacji'],
    defaultId: 0,
    cancelId: 1,
    noLink: true
  }).catch(() => ({ response: 1 }));
  updatePromptVisible = false;

  if (result.response !== 0) {
    return false;
  }

  try {
    await beginUpdateInstall(info);
    return true;
  } catch (error) {
    updateInstallInProgress = false;
    updateDownloadReject = null;
    await dialog.showMessageBox({
      type: 'error',
      title: 'Błąd aktualizacji',
      message: 'Nie udało się pobrać aktualizacji',
      detail: getConnectionErrorMessage(error),
      buttons: ['OK'],
      defaultId: 0,
      noLink: true
    }).catch(() => {});
    return false;
  }
}

async function runStartupUpdateCheck() {
  if (!configureAutoUpdates()) {
    return false;
  }

  try {
    const result = await autoUpdater.checkForUpdates();
    const info = result && result.updateInfo ? result.updateInfo : null;
    if (!info || !isVersionNewer(info.version, APP_VERSION)) {
      return false;
    }
    return promptForUpdate(info);
  } catch (error) {
    return false;
  }
}

function setupAutoUpdates() {
  if (!configureAutoUpdates()) {
    return;
  }

  const checkForUpdates = () => {
    if (updateInstallInProgress || updatePromptVisible) {
      return;
    }

    autoUpdater.checkForUpdates()
      .then((result) => {
        const info = result && result.updateInfo ? result.updateInfo : null;
        return promptForUpdate(info);
      })
      .catch(() => {});
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

  finalizeArchiveSession();
  disconnectLiveConnection();
  resetChatBuffers();
  sendToShell('shell:chat-reset', {
    creatorId: state.creatorId,
    reason: 'reload'
  });
  state.connectionStatus = 'connecting';
  state.source = 'ponowne laczenie';
  state.lastMessage = `Ponownie lacze z @${getCurrentCreator().username}`;
  publishState();
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

const singleInstanceLock = app.requestSingleInstanceLock();
if (!singleInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (typeof mainWindow.isMinimized === 'function' && mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      if (typeof mainWindow.focus === 'function') {
        mainWindow.focus();
      }
    }
  });
}

if (singleInstanceLock) {
app.whenReady().then(async () => {
  const updateStarted = await runStartupUpdateCheck();
  if (updateStarted) {
    return new Promise(() => {});
  }

  const connector = await import('tiktok-live-connector');
  ({
    TikTokLiveConnection,
    WebcastEvent,
    ControlEvent,
    UserOfflineError,
    SignatureRateLimitError
  } = connector);

  return createWindow().then(() => {
    showUpdateCompletedDialogIfNeeded();
    setupAutoUpdates();

    if (isSmokeRun()) {
      setTimeout(() => app.quit(), 5000);
    }
  });
});
}

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

