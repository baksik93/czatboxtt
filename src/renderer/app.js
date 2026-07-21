const TTS_SETTINGS_KEY = 'czatbox.tts.settings';
const TALARKI_KEY = 'czatbox.talarki';
const CHAT_DELAY_SETTINGS_KEY = 'czatbox.chat.delay';
const CHAT_STYLE_SETTINGS_KEY = 'czatbox.chat.style';
const CHAT_FILTER_SETTINGS_KEY = 'czatbox.chat.filters';
const ARCHIVE_FILTER_SETTINGS_KEY = 'czatbox.archive.filters';
const APP_THEME_SETTINGS_KEY = 'czatbox.app.theme';
const APP_APPEARANCE_SETTINGS_KEY = 'czatbox.app.appearance';
const APP_LANGUAGE_SETTINGS_KEY = 'czatbox.app.language';
const TIME_FORMAT_SETTINGS_KEY = 'czatbox.time.format';
const GENERAL_SETTINGS_KEY = 'czatbox.general.settings';
const RECENT_CREATORS_KEY = 'czatbox.recent.creators';
const FAVORITE_CREATORS_KEY = 'czatbox.favorite.creators';
const CZESTER_MEMORY_KEY = 'czatbox.czester.memory';
const ACHIEVEMENTS_KEY = 'czatbox.achievements';
const REDEEMED_FEATURES_KEY = 'czatbox.redeemed.features';
const COINS_REFERRAL_CODE = 'ZD3TKFBV';
const COINS_REFERRAL_URL = 'https://www.tiktok.com/coin?rc=ZD3TKFBV';
const COINS_PROMO_INTERVAL_MS = 30 * 60 * 1000;
const DEFAULT_CHAT_DELAY_MS = 500;
const CHAT_DELAY_OPTIONS = [500, 800, 1000, 1500, 1800, 2200, 2800];
const CHAT_DELAY_DEFAULT_MIGRATION_KEY = 'czatbox.chat.delay.default.500.v1';
const CHAT_STYLES = ['compact', 'spacious', 'testowy'];
const APP_THEMES = ['rose-black', 'white-titanium', 'chill-serwis', 'rose-gold-glass', 'lazarskie-rejony', 'miami-vice', 'dzika-galaktyka', 'swiat-brikersa'];
const WILD_GALAXY_STORE_CODE = 'STORE_WILD_GALAXY';
const RADIO_ACHIEVEMENT_TARGET_MS = 20 * 60 * 1000;
const DEV_TALARKI_CODE = 'CZTT DEV 50K 2026';
const MAX_VISIBLE_MESSAGES = 800;
const MAX_FAVORITE_CREATORS = 12;
const DEFAULT_EVENT_FILTERS = ['chat', 'like', 'gift', 'box', 'repost', 'share', 'member'];
const APP_APPEARANCES = ['standard', 'ozdobny', 'retro-kb2'];
const APP_LANGUAGES = ['pl', 'en', 'de', 'hu'];
const APP_LANGUAGE_VERSION_KEY = 'czatbox.language.version';
const TIME_FORMATS = ['auto', '12', '24'];
const TOP_GIFTERS_LIMIT = 5;
const TOP_TAPPERS_LIMIT = 5;
const MODERATOR_ACTIVE_WINDOW_MS = 5 * 60 * 1000;
const ACTIVE_MODERATORS_LIMIT = 20;
const MAX_RECENT_CREATORS = 100;
const HEART_ME_GIFT_NAME = 'heart me';
const RECENT_CREATOR_META_KEY = 'czatbox.recent.creator.meta';
const HONDA_CHAT_UNIQUE_ID = 'grzegorzpawemisiu';
const HONDA_ON_CHAT_TEXT = 'Honda jest na czacie.';
const HONDA_ONLINE_CHECK_INTERVAL_MS = 10 * 1000;
const HONDA_ONLINE_ALERT_COOLDOWN_MS = 60 * 1000;
const HONDA_REDEEM_CODE = '10FDBF47H0NDA250';
const OLLAMA_REDEEM_CODE = '19BM9ARV9IN1K4M4';
const BOXES_REDEEM_CODE = '1THU3GS6TO7OL6S2';
const MIAMI_VICE_REDEEM_CODE = 'LEAVEME0ALONE173';
const TALARKI_BONUS_CODE = 'AEZAKMI1GO23BENG';
const OLLAMA_PROMPT_DECLINED_KEY = 'czatbox.czester.ollamaPromptDeclined';
const CZESTER_AVATAR_SRC = './assets/czester-avatar.svg';
const CZESTER_USER_AVATAR_KEY = 'czatbox.czester.userAvatar';
const CZESTER_SPAM_WINDOW_MS = 5 * 1000;
const CZESTER_SPAM_MIN_REPEAT = 3;
const CZESTER_SPAM_ALERT_COOLDOWN_MS = 30 * 1000;
const CZESTER_CREATOR_RECENCY_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
const CZESTER_LIVE_ANALYSIS_INTERVAL_MS = 60 * 1000;
const CZESTER_LIVE_ANALYSIS_WINDOW_MS = 60 * 1000;
const CZESTER_QUESTIONS_WINDOW_MS = 5 * 60 * 1000;
const CZESTER_LIVE_ANALYSIS_MIN_MESSAGES = 8;
const CZESTER_LIVE_ANALYSIS_MAX_BUFFER = 600;
const CZESTER_ARCHIVE_INDEX_BATCH_LIMIT = 10;
const CZESTER_MAX_MESSAGES = 120;
const BOXES_ARCHIVE_REFRESH_DEBOUNCE_MS = 2500;
const SECTION_AUTO_REFRESH_COOLDOWN_MS = 15 * 1000;
const CZESTER_VIEWER_PROFILE_LIMIT = 500;
const KAMA_CREATOR_HANDLE = 'teambibii';
const ACHIEVEMENT_DEFINITIONS = [
  {
    id: 'first-login',
    icon: '🪄',
    titleKey: 'achievements.firstLogin.title',
    descriptionKey: 'achievements.firstLogin.description',
    talarki: 10
  },
  {
    id: 'kama-10-connections',
    icon: '🏠',
    titleKey: 'achievements.kamaConnections.title',
    descriptionKey: 'achievements.kamaConnections.description',
    talarki: 100
  },
  {
    id: 'ten-creators',
    icon: '🚀',
    titleKey: 'achievements.tenCreators.title',
    descriptionKey: 'achievements.tenCreators.description',
    talarki: 100
  },
  {
    id: 'first-note',
    icon: '📝',
    titleKey: 'achievements.firstNote.title',
    descriptionKey: 'achievements.firstNote.description',
    talarki: 10
  },
  {
    id: 'retro-kb2',
    icon: '💾',
    titleKey: 'achievements.retroKb2.title',
    descriptionKey: 'achievements.retroKb2.description',
    talarki: 100
  },
  {
    id: 'true-friend',
    icon: '🐾',
    titleKey: 'achievements.trueFriend.title',
    descriptionKey: 'achievements.trueFriend.description',
    talarki: 100
  },
  {
    id: 'telegraphist',
    icon: '📻',
    titleKey: 'achievements.telegraphist.title',
    descriptionKey: 'achievements.telegraphist.description',
    talarki: 100
  }
];
const UI_ICONS = {
  'chevron-down': '<path d="m7 10 5 5 5-5"/>',
  lock: '<rect x="5.5" y="10" width="13" height="9.5" rx="2"/><path d="M8.5 10V7.75a3.5 3.5 0 0 1 7 0V10"/><path d="M12 14v2"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  calendar: '<rect x="4" y="5.5" width="16" height="14" rx="2"/><path d="M8 3.5v4M16 3.5v4M4 9.5h16"/>',
  inbox: '<path d="M5 6.5h14a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 19 18.5H5A1.5 1.5 0 0 1 3.5 17V8A1.5 1.5 0 0 1 5 6.5Z"/><path d="M3.5 14h4l1.5 2h6l1.5-2h4"/>',
  chest: '<path d="M4.5 9.25h15v9.5h-15z"/><path d="M3.75 7.25h16.5v3.25H3.75z"/><path d="M7 7.25V5.8A2.05 2.05 0 0 1 9.05 3.75h5.9A2.05 2.05 0 0 1 17 5.8v1.45"/><path d="M12 7.25v11.5"/><path d="M8 13h8"/><circle cx="12" cy="13" r="1.65"/>',
  users: '<circle cx="9" cy="9" r="3"/><path d="M3.75 19c.55-3.15 2.3-5 5.25-5s4.7 1.85 5.25 5"/><path d="M15.5 6.75a3 3 0 0 1 0 5.5M15.75 14.25c2.45.3 3.9 1.9 4.4 4.75"/>',
  user: '<circle cx="12" cy="8" r="3.5"/><path d="M5.5 20c.7-3.7 2.8-5.75 6.5-5.75s5.8 2.05 6.5 5.75"/>',
  'shopping-bag': '<path d="M5 8.5h14l1 11H4l1-11Z"/><path d="M9 8.5V6a3 3 0 0 1 6 0v2.5"/>',
  message: '<path d="M5.5 5.5h13A1.5 1.5 0 0 1 20 7v8a1.5 1.5 0 0 1-1.5 1.5H10L6 19v-2.5h-.5A1.5 1.5 0 0 1 4 15V7a1.5 1.5 0 0 1 1.5-1.5Z"/><path d="M8 9.5h8M8 12.5h5"/>',
  questions: '<path d="M5.5 5.5h13A1.5 1.5 0 0 1 20 7v8a1.5 1.5 0 0 1-1.5 1.5H10L6 19v-2.5h-.5A1.5 1.5 0 0 1 4 15V7a1.5 1.5 0 0 1 1.5-1.5Z"/><path d="M9.25 9.25a2.5 2.5 0 1 1 3.85 2.1c-.65.4-1.1.8-1.1 1.65"/><path d="M12 15.35h.01"/>',
  'questions-list': '<path d="M5.5 5.5h13A1.5 1.5 0 0 1 20 7v8a1.5 1.5 0 0 1-1.5 1.5H10L6 19v-2.5h-.5A1.5 1.5 0 0 1 4 15V7a1.5 1.5 0 0 1 1.5-1.5Z"/><path d="M8 9h4.25M8 12h3"/><path d="M15.1 8.35a1.55 1.55 0 1 1 2.25 1.38c-.42.28-.72.55-.72 1.12"/><path d="M16.62 13.1h.01"/>',
  'moderators-list': '<path d="M9.5 4.25 16 6.8v4.1c0 3.55-2.18 6.22-6.5 7.35C5.18 17.12 3 14.45 3 10.9V6.8l6.5-2.55Z"/><path d="m6.65 11 1.75 1.72 3.65-3.72"/><path d="M17.5 8.5h3.25M17.5 12h3.25M15.75 15.5h5"/>',
  heart: '<path d="M12 19.25 5.35 13A4.65 4.65 0 0 1 12 6.55 4.65 4.65 0 0 1 18.65 13L12 19.25Z"/>',
  'heart-off': '<path d="m4 4 16 16"/><path d="M9.3 6.05A4.65 4.65 0 0 1 12 7.2 4.65 4.65 0 0 1 18.65 13l-1.15 1.1M14.5 16.9 12 19.25 5.35 13A4.65 4.65 0 0 1 7 5.4"/>',
  chart: '<path d="M5 19V11h3v8M10.5 19V5h3v14M16 19V8h3v11"/><path d="M3.5 19.5h17"/>',
  trophy: '<path d="M8 5h8v4.5a4 4 0 0 1-8 0V5Z"/><path d="M8 7H5v1.5A3.5 3.5 0 0 0 8.5 12M16 7h3v1.5a3.5 3.5 0 0 1-3.5 3.5M12 13.5V17M8.5 19h7M10 17h4"/>',
  shield: '<path d="M12 3.75 19 6.5v5.25c0 4.1-2.35 7.1-7 8.5-4.65-1.4-7-4.4-7-8.5V6.5l7-2.75Z"/><path d="m8.75 12 2.1 2.1 4.4-4.45"/>',
  check: '<path d="m5 12.5 4.25 4.25L19 7"/>',
  swords: '<path d="m5 4 6.5 6.5M4 5l2-2 7.5 7.5-2 2L4 5Z"/><path d="m19 4-6.5 6.5M20 5l-2-2-7.5 7.5 2 2L20 5Z"/><path d="m8.5 13.5-4.75 4.75M5.5 16.5l2 2M15.5 13.5l4.75 4.75M18.5 16.5l-2 2"/>',
  glove: '<path d="M7.5 12V7.5a1.5 1.5 0 0 1 3 0V11M10.5 10V5.5a1.5 1.5 0 0 1 3 0V10M13.5 10V6.5a1.5 1.5 0 0 1 3 0V11M16.5 11V9a1.5 1.5 0 0 1 3 0v5c0 4-2.4 6.25-6.5 6.25h-1.25C7.5 20.25 5 17.75 5 14v-2a1.5 1.5 0 0 1 2.5-1.1l2 1.85"/>',
  fog: '<path d="M4 8.5h11M8 12h12M3 15.5h12M7 19h13"/><path d="M16.5 8.5H20M3 12h2"/>',
  hammer: '<path d="m13.5 5.5 5 5M12 7l3.5-3.5 4 4L16 11l-4-4Z"/><path d="m13.5 9.5-8 9a1.4 1.4 0 0 1-2-2l9-8"/>',
  crown: '<path d="M4.75 17.5h14.5l-1.1-8.3-4 3.4L12 5.5l-2.15 7.1-4-3.4-1.1 8.3Z"/><path d="M6.25 20h11.5"/>',
  star: '<path d="m12 3.8 2.55 5.16 5.7.83-4.12 4.02.97 5.68L12 16.8l-5.1 2.69.97-5.68-4.12-4.02 5.7-.83L12 3.8Z"/>',
  snowflake: '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"/><path d="m9.5 5.5 2.5 2 2.5-2M9.5 18.5l2.5-2 2.5 2M5 10.5l3-.5.5-3M19 13.5l-3 .5-.5 3M5 13.5l3 .5.5 3M19 10.5l-3-.5-.5-3"/>',
  zap: '<path d="M13 2.75 5.5 13h6L11 21.25 18.5 11h-6L13 2.75Z"/>',
  sparkle: '<path d="M12 3.5c.6 3.1 2.4 4.9 5.5 5.5-3.1.6-4.9 2.4-5.5 5.5-.6-3.1-2.4-4.9-5.5-5.5 3.1-.6 4.9-2.4 5.5-5.5Z"/><path d="M18.5 14.5c.3 1.6 1.2 2.5 2.8 2.8-1.6.3-2.5 1.2-2.8 2.8-.3-1.6-1.2-2.5-2.8-2.8 1.6-.3 2.5-1.2 2.8-2.8Z"/>',
  coin: '<circle cx="12" cy="12" r="8.25"/><circle cx="12" cy="12" r="4.25"/><path d="M12 9.5v5M10.75 10.25h1.9a1.1 1.1 0 0 1 0 2.2h-1.3a1.1 1.1 0 0 0 0 2.2h1.9"/>',
  dinosaur: '<path d="M5 18v-5.5a6.5 6.5 0 0 1 6.5-6.5h3a4.5 4.5 0 0 1 4.5 4.5V13h-4v3.5M8 18h3M15 18h3M18 10h2.5M8 9h.01"/>',
  apple: '<path d="M12 8c-3-2-6 .5-6 4.5S8.5 19 12 19s6-2.5 6-6.5S15 6 12 8Z"/><path d="M12 7c0-2 1.5-3 3-3M12 5c-1.5-1.5-3-1.5-4-1"/>',
  cake: '<path d="M5 11h14v8H5zM4 11h16M8 7v4M12 7v4M16 7v4"/><path d="M8 7a2 2 0 1 1 4 0 2 2 0 1 1 4 0"/>',
  syringe: '<path d="m14 4 6 6M12 6l6 6M4 20l7-7M7 17l-3 3M11 9l4 4"/>',
  shower: '<path d="M4 8h10a5 5 0 0 1 5 5v1M4 8V5a2 2 0 0 1 4 0v3M16 16h.01M13 16h.01M10 16h.01M7 16h.01"/>',
  broom: '<path d="m16 4 4 4M5 20l11-11M3 21h6"/>',
  bed: '<path d="M4 18v-6M4 15h16v3M7 12V9h4a3 3 0 0 1 3 3M20 18v3M4 21v-3"/>',
  folder: '<path d="M3.5 7.5h6l1.7 2H20a1.5 1.5 0 0 1 1.5 1.5v6.5A1.5 1.5 0 0 1 20 19H4a1.5 1.5 0 0 1-1.5-1.5V6A1.5 1.5 0 0 1 4 4.5h5l1.5 2H20"/>',
  refresh: '<path d="M19 8a7.5 7.5 0 1 0 .35 7"/><path d="M19 4.5V8h-3.5"/>',
  settings: '<circle cx="12" cy="12" r="3.25"/><path d="M9.8 3.8h4.4l.65 2.15 1.75 1 2.2-.55 2.2 3.8-1.55 1.6v2l1.55 1.6-2.2 3.8-2.2-.55-1.75 1-.65 2.15H9.8l-.65-2.15-1.75-1-2.2.55L3 15.4l1.55-1.6v-2L3 10.2l2.2-3.8 2.2.55 1.75-1 .65-2.15Z"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.25 15.25 4.25 4.25"/>',
  archive: '<path d="M4.5 7.5h15v11h-15z"/><path d="M3.5 4.5h17v3h-17zM9 11h6"/>',
  broadcast: '<circle cx="12" cy="12" r="2.25"/><path d="M7.4 7.4a6.5 6.5 0 0 0 0 9.2M16.6 7.4a6.5 6.5 0 0 1 0 9.2M4.25 4.25a11 11 0 0 0 0 15.5M19.75 4.25a11 11 0 0 1 0 15.5"/>',
  download: '<path d="M12 4v10M8 10l4 4 4-4"/><path d="M5 18.5h14"/>',
  trash: '<path d="M5.5 7h13M9 4.5h6l1 2.5H8l1-2.5ZM7.5 7l.75 12h7.5l.75-12M10 10v6M14 10v6"/>',
  chat: '<path d="M5 5.5h14A1.5 1.5 0 0 1 20.5 7v8A1.5 1.5 0 0 1 19 16.5h-8L6 20v-3.5H5A1.5 1.5 0 0 1 3.5 15V7A1.5 1.5 0 0 1 5 5.5Z"/>'
};
const DEFAULT_SYSTEM_SETTINGS = {
  autoLaunch: false,
  runInBackground: false,
  minimizeToTrayOnClose: false,
  language: 'pl',
  timeFormat: 'auto'
};
const DEFAULT_GENERAL_SETTINGS = {
  multiplierNotifications: true,
  statsToolbox: true,
  galleryAvatars: true,
  deleteOldArchives: false,
  bigPictureMode: false,
  quietMode: false
};
const LANGUAGE_LOCALES = {
  pl: 'pl-PL',
  en: 'en-US',
  de: 'de-DE',
  hu: 'hu-HU'
};
const TTS_LANGUAGE_PREFIXES = {
  pl: /^pl\b/i,
  en: /^en\b/i,
  de: /^de\b/i,
  hu: /^hu\b/i
};
// Keep TTS close to the live chat. A long backlog made Piper read messages
// that were already several lines behind during active transmissions.
const MAX_SPEECH_QUEUE = 2;
const VULGAR_SPEECH_PATTERNS = [
  /\b(?:kurw\w*|chuj\w*|huj\w*|jeb\w*|pierd\w*|wypierd\w*|spierd\w*|skurw\w*|zjeb\w*)\b/u,
  /\b(?:cwel\w*|kutas\w*|cip\w*|dziwk\w*)\b/u
];
const SPAM_SPEECH_PATTERNS = [
  /^(?:ob|obs|obsik|obserwacja|obserwacje)$/u,
  /\bobs\s*(?:za|4|\/)\s*obs\b/u,
  /\bob\s*za\s*ob\b/u,
  /\bobserwacj\w*\s*(?:za|4|\/)\s*obserwacj\w*\b/u,
  /\bfollow\s*(?:for|4|za|\/)\s*follow\b/u,
  /\bf4f\b/u,
  /\bodd(?:am|aje|a[cm])\s+(?:ob|obs|obserwacj\w*|follow\w*)\b/u,
  /\b(?:daj|dajcie|wbij|wbijajcie)\s+(?:ob|obs|obserwacj\w*|follow\w*)\b/u
];

const I18N = {
  pl: {
    'app.tagline': 'Śledź i zarządzaj czatem live w czasie rzeczywistym.',
    'nav.chatbox': 'Czatbox',
    'nav.archive': 'Archiwum',
    'nav.settings': 'Ustawienia',
    'nav.notes': 'Notatki',
    'nav.achievements': 'Osiągnięcia',
    'nav.coins': 'Monetki',
    'nav.boxes': 'Skrzyneczki',
    'nav.radio': 'Radio',
    'nav.czester': 'Asystent Czester',
    'nav.about': 'O programie',
    'creator.label': 'Twórca',
    'creator.refresh': 'Odśwież czat',
    'creator.noMatches': 'Brak pasujących twórców',
    'recentCreators.aria': 'Ostatni twórcy',
    'recentCreators.online': 'Wybrany',
    'recentCreators.offline': 'Niewybrany',
    'recentCreators.delete': 'Usuń twórcę z listy',
    'achievements.title': 'Osiągnięcia',
    'achievements.note': 'Odblokowane osiągnięcia za aktywność w programie.',
    'achievements.emptyTitle': 'Brak odblokowanych osiągnięć.',
    'achievements.emptyDescription': 'Osiągnięcia pojawią się tutaj dopiero po ich zdobyciu.',
    'achievements.firstLogin.title': 'Uroczyście oświadczam, że knuję coś niedobrego!',
    'achievements.firstLogin.description': 'Zaloguj się po raz pierwszy w programie.',
    'achievements.kamaConnections.title': 'Nie ma to jak w domu...',
    'achievements.kamaConnections.description': 'Połącz się z Kamą 10 razy.',
    'achievements.tenCreators.title': 'Dopiero się rozkręcam!',
    'achievements.tenCreators.description': 'Połącz się z 10 różnymi twórcami.',
    'achievements.firstNote.title': 'Pisać muszę, bo się uduszę!',
    'achievements.firstNote.description': 'Napisz swoją pierwszą notatkę.',
    'achievements.retroKb2.title': 'Retrospekcja',
    'achievements.retroKb2.description': 'Zmień aplikację na wersję lite.',
    'coins.title': 'Monetki',
    'coins.note': 'Wesprzyj rozwój programu, kupując monetki TikTok z rabatem.',
    'coins.cardTitle': 'Wsparcie przez monetki TikTok',
    'coins.description': 'Możesz wesprzeć autora programu, kupując monetki na stronie TikToka z 25% rabatem przez kod ZD3TKFBV.',
    'coins.codeLabel': 'Kod rabatowy:',
    'coins.link': 'Przejdź do TikToka',
    'coins.chatPromo': 'Wesprzyj autora Czatbox TT: kup monetki TikTok z 25% rabatem kodem ZD3TKFBV albo przejdź bezpośrednio:',
    'boxes.title': 'Skrzyneczki',
    'boxes.note': 'Archiwum skrzyneczek zapisanych z transmisji LIVE.',
    'boxes.liveTitle': 'Skrzyneczki z transmisji',
    'boxes.liveDescription': 'Wybierz transmisję z listy, aby zobaczyć wykryte skrzyneczki.',
    'boxes.refresh': 'Odśwież',
    'boxes.searchPlaceholder': 'Szukaj twórcy lub daty...',
    'boxes.noSessions': 'Brak zapisanych transmisji ze skrzyneczkami.',
    'boxes.noMatches': 'Brak transmisji pasujących do wyszukiwania.',
    'boxes.loading': 'Wczytywanie skrzyneczek...',
    'boxes.loadFailed': 'Nie udało się wczytać skrzyneczek.',
    'boxes.sessionCount': '{count} skrzyneczek',
    'boxes.summary.count': 'Skrzyneczki',
    'boxes.summary.coins': 'Monetki',
    'boxes.summary.people': 'Miejsca',
    'boxes.emptyTitle': 'Wybierz transmisję.',
    'boxes.emptyDescription': 'Po lewej znajdziesz transmisje, w których wykryto skrzyneczki.',
    'boxes.sender': 'Od:',
    'boxes.coins': 'Monetki:',
    'boxes.people': 'Miejsca:',
    'boxes.type.chest': 'Skrzyneczka',
    'boxes.type.portal': 'Portal',
    'settings.redeem.unlockedBoxes': 'Kod przyjęty. Zakładka Skrzyneczki jest aktywna.',
    'settings.redeem.unlockedMiamiVice': 'Kod przyjęty. Motyw Miami Vice jest aktywny w ustawieniach wyglądu.',
    'czester.title': 'Asystent Czester',
    'czester.note.before': 'Dzień dobry! Jestem Czester i spróbuję rozwiązać twój problem z tik tok. Pamiętaj, że dopiero ',
    'czester.note.learning': 'uczę się',
    'czester.note.after': ' i mogę jeszcze wiele nie rozumieć...',
    'czester.welcome': 'Dzień dobry! Jestem Czester i spróbuję rozwiązać twój problem z tik tok. Pamiętaj, że dopiero uczę się i mogę jeszcze wiele nie rozumieć...',
    'czester.userLabel': 'Ty',
    'czester.botLabel': 'Czester',
    'czester.open': 'Otwórz Czestera',
    'czester.close': 'Zamknij Czestera',
    'czester.questionsButton': 'Pokaż pytania z ostatnich 5 minut',
    'czester.questions.none': 'Nie widzę pytań z ostatnich 5 minut.',
    'czester.moderatorsButton': 'Pokaż aktywnych moderatorów',
    'czester.moderators.none': 'Brak aktywnych moderatorów w ostatnich 5 minutach.',
    'czester.moderators.title': 'Aktywni moderatorzy:',
    'czester.notice.creatorFavorite': 'Podsunąłem wyżej twórcę @{creator}, bo często do niego wracasz.',
    'czester.notice.spam': 'Wykryłem możliwy spam: {author} wysłał(a) tę samą wiadomość {count} razy w 5 sekund.',
    'czester.notice.superfanJoin': 'Dołącza superfan {name}.',
    'czester.notice.connection': 'Zapamiętałem to połączenie. Im częściej wracasz do twórcy, tym wyżej będzie na liście.',
    'czester.ai.title': 'Lokalny mózg Czestera',
    'czester.ai.checking': 'Sprawdzam pakiet lokalny...',
    'czester.ai.ready': 'Gotowe lokalnie: {model}',
    'czester.ai.noModel': 'Ollama działa, brakuje modelu Czestera.',
    'czester.ai.noOllama': 'Pakiet lokalny nie jest jeszcze zainstalowany.',
    'czester.ai.install': 'Zainstaluj pakiet AI',
    'czester.ai.installing': 'Instaluję...',
    'czester.ai.installerStarted': 'Instalator Ollama został uruchomiony. Po zakończeniu kliknij ponownie, żeby pobrać model.',
    'czester.ai.error': 'Nie udało się przygotować lokalnego pakietu AI.',
    'czester.ollama.prompt': 'Odblokowano lokalny mózg Czestera. Ollama to lokalny silnik AI działający na twoim komputerze. W programie pozwala Czesterowi lepiej analizować czat, pytania, spam i kontekst live bez wysyłania rozmów do zewnętrznego czatu. Chcesz pobrać i zainstalować Ollamę lokalnie?',
    'czester.ollama.accept': 'Pobierz i zainstaluj',
    'czester.ollama.decline': 'Nie teraz',
    'czester.ollama.declined': 'Jasne. Przypomnę o tym przy kolejnym uruchomieniu programu, dopóki Ollama nie będzie gotowa.',
    'czester.ollama.installing': 'Przygotowuję instalację Ollamy. Jeśli pojawi się instalator, dokończ go normalnie w systemie.',
    'czester.ollama.ready': 'Ollama jest gotowa. Czester może korzystać z lokalnego modelu.',
    'czester.ollama.error': 'Nie udało się przygotować Ollamy. Spróbuj ponownie później.',
    'filters.chat': 'Czat',
    'filters.like': 'Polubienia',
    'filters.gift': 'Prezenty',
    'filters.box': 'Skrzyneczki',
    'filters.repost': 'Reposty',
    'filters.share': 'Udostępnienia',
    'filters.member': 'Dołączenia',
    'archive.title': 'Archiwum',
    'archive.status': 'Zapisane transmisje',
    'archive.refresh': 'Odśwież',
    'archive.openFolder': 'Otwórz folder',
    'archive.searchPlaceholder': 'Szukaj twórcy lub daty...',
    'archive.selectTitle': 'Wybierz transmisję',
    'archive.selectDescription': 'Po lewej znajdziesz wszystkie zapisane czaty.',
    'archive.export': 'Eksportuj TXT',
    'archive.delete': 'Usuń',
    'archive.summaryAria': 'Podsumowanie transmisji',
    'archive.summary.events': 'Zdarzenia',
    'archive.summary.messages': 'Wiadomości',
    'archive.summary.coins': 'Monety',
    'archive.summary.moderators': 'Moderatorzy',
    'archive.filtersAria': 'Filtry archiwum',
    'notes.title': 'Notatki',
    'notes.status': 'Twój notes na zapiski',
    'notes.new': 'Nowa',
    'notes.save': 'Zapisz',
    'notes.delete': 'Usuń',
    'notes.edit': 'Edytuj',
    'notes.searchPlaceholder': 'Szukaj notatki...',
    'notes.titlePlaceholder': 'Tytuł notatki',
    'notes.contentPlaceholder': 'Napisz notatkę...',
    'notes.unsaved': 'Nowa niezapisana notatka',
    'notes.empty': 'Brak zapisanych notatek.',
    'notes.noMatches': 'Brak notatek pasujących do wyszukiwania.',
    'notes.previewEmpty': 'Brak treści notatki.',
    'notes.saved': 'Notatka zapisana.',
    'notes.deleted': 'Notatka usunięta.',
    'notes.loadFailed': 'Nie udało się wczytać notatek.',
    'notes.saveFailed': 'Nie udało się zapisać notatki.',
    'notes.deleteFailed': 'Nie udało się usunąć notatki.',
    'notes.deleteConfirm': 'Usunąć notatkę „{title}”?',
    'notes.updatedAt': 'Edytowano: {time}',
    'notes.formatToolbar': 'Formatowanie notatki',
    'notes.format.bold': 'Pogrubienie',
    'notes.format.italic': 'Kursywa',
    'notes.format.underline': 'Podkreślenie',
    'notes.format.strike': 'Przekreślenie',
    'notes.format.code': 'Kod',
    'notes.format.codeblock': 'Blok kodu',
    'notes.format.quote': 'Cytat',
    'notes.format.list': 'Lista',
    'settings.title': 'Ustawienia',
    'settings.subtitle': 'Dostosuj działanie i wygląd aplikacji.',
    'settings.reset': 'Przywróć domyślne',
    'settings.tabs.general': 'Czat i archiwa',
    'settings.tabs.appearance': 'Wygląd',
    'settings.tabs.accessibility': 'Audio',
    'settings.tabs.system': 'System',
    'settings.tabs.redeem': 'Kody',
    'settings.general.note': 'Ustawienia czatu, archiwów i trybu Big Picture.',
    'settings.general.multiplierNotifications': 'Powiadomienia o mnożnikach',
    'settings.general.statsToolbox': 'Przybornik statystyk',
    'settings.general.galleryAvatars': 'Awatary z galerii',
    'settings.general.deleteOldArchives': 'Wyczyść archiwa starsze niż 7 dni',
    'settings.general.bigPicture': 'Big Picture (pełny ekran)',
    'settings.appearance.chatStyle': 'Styl czatu:',
    'settings.appearance.theme': 'Motyw:',
    'settings.appearance.appAppearance': 'Wygląd aplikacji:',
    'settings.chatStyle.compact.name': 'Kompaktowy',
    'settings.chatStyle.compact.description': 'Standardowy styl pojawiających się wiadomości TikTok.',
    'settings.chatStyle.spacious.name': 'Przestrzenny',
    'settings.chatStyle.spacious.description': 'Bardziej przejrzysty układ wiadomości.',
    'settings.chatStyle.modern.name': 'Nowoczesny',
    'settings.chatStyle.modern.description': 'Nowoczesny styl czatu w dymkach.',
    'settings.theme.roseBlack.name': 'Rose Black (Domyślny)',
    'settings.theme.roseBlack.description': 'Standardowe kolory aplikacji.',
    'settings.theme.whiteTitanium.description': 'Jasny wygląd aplikacji, w odcieniach białego tytanu.',
    'settings.theme.chillSerwis.description': 'Najbardziej wyczillowany motyw aplikacji dla hanysów i hanysek.',
    'settings.theme.roseGlass.description': 'Nieco bardziej kobiecy, delikatny motyw.',
    'settings.theme.lazarskieRejony.name': 'Enigma-Z',
    'settings.theme.lazarskieRejony.description': 'Półprzezroczysty, ciemno szaro-niebieski styl z neonowymi akcentami.',
    'settings.theme.miamiVice.name': 'Miami Vice',
    'settings.theme.miamiVice.description': 'Pastelowe odcienie Miami inspirowane klimatem GTA Vice City.',
    'settings.theme.locked': 'Zablokowany',
    'settings.appAppearance.default.name': 'Domyślny',
    'settings.appAppearance.default.description': 'Obecny układ headera, lewego sidebara, okien i buttonów.',
    'settings.appAppearance.decorative.name': 'Ozdobny',
    'settings.appAppearance.decorative.description': 'Elegancki, nowoczesny układ aplikacji.',
    'settings.appAppearance.retroKb2.name': 'Retro KB2',
    'settings.appAppearance.retroKb2.description': 'Lekki, archaiczny układ inspirowany starym blogowym K2: nagłówek i linki zamiast przycisków.',
    'settings.accessibility.tts': 'Wiadomości TTS:',
    'settings.accessibility.readAloud': 'Czytaj czat na głos',
    'settings.accessibility.skipVulgarNicknames': 'Pomijaj wulgarne nicki',
    'settings.accessibility.skipVulgarMessages': 'Pomijaj wulgarne wiadomości',
    'settings.accessibility.skipSpamMessages': 'Pomijaj spamowe wiadomości (obs za obs, ob, oddam obs itd.)',
    'settings.accessibility.rolesOnly': 'Czytaj tylko wiadomości moderatorów i superfanów',
    'settings.accessibility.rolesOnlyDescription': 'TTS czyta wyłącznie wiadomości osób z czerwonym lub złotym nickiem.',
    'settings.accessibility.voice': 'Głos',
    'settings.accessibility.systemVoice': 'Systemowy',
    'settings.accessibility.rate': 'Tempo',
    'settings.accessibility.volume': 'Głośność czytania wiadomości',
    'settings.accessibility.delay': 'Opóźnienie czatu:',
    'settings.system.note': 'Informacje i ustawienia systemowe.',
    'settings.redeem.note': 'Wprowadź kod, aby odblokować dodatkowe funkcje.',
    'settings.redeem.codeLabel': 'Kod aktywacyjny',
    'settings.redeem.button': 'Aktywuj',
    'settings.redeem.waiting': 'Podaj kod aktywacyjny.',
    'settings.redeem.unlocked': 'Kod przyjęty. Niebieskie powiadomienie Hondy jest aktywne.',
    'settings.redeem.unlockedOllama': 'Kod przyjęty. Odblokowano propozycję lokalnej Ollamy dla Czestera.',
    'settings.redeem.invalid': 'Nieprawidłowy kod.',
    'settings.redeem.alreadyUsed': 'Ten kod został już wcześniej zrealizowany.',
    'settings.system.autoLaunch': 'Automatycznie otwieraj Czatbox TT po uruchomieniu komputera',
    'settings.system.runInBackground': 'Uruchom program w tle by nie przeszkadzał',
    'settings.system.minimizeToTray': 'Minimalizuj Czatbox TT do zasobnika systemowego po kliknięciu X',
    'settings.system.language': 'Wybierz język aplikacji',
    'settings.system.language.pl': 'Polski',
    'settings.system.language.en': 'Angielski',
    'settings.system.language.de': 'Niemiecki',
    'settings.system.language.hu': 'Węgierski',
    'settings.system.timeFormat': 'Format czasu',
    'settings.system.timeFormat.auto': 'Automatyczny (wykrywa czas w systemie)',
    'settings.system.timeFormat.12': '12-godzinny',
    'settings.system.timeFormat.24': '24-godzinny',
    'settings.system.clearSessionDescription': 'Problem z logowaniem lub sesją TikTok',
    'settings.system.clearSession': 'Wyczyść sesję TikTok',
    'settings.system.clearSessionConfirm': 'Wyczyścić sesję TikTok i wrócić do ekranu logowania?',
    'about.title': 'O programie',
    'about.tabs.program': 'O programie',
    'about.tabs.news': 'Co nowego?',
    'about.tabs.faq': 'FAQ',
    'radio.title': 'Radio',
    'radio.note': 'Słuchaj wybranej stacji podczas pracy z czatem.',
    'radio.aria': 'Stacje radiowe',
    'about.tabs.aria': 'Zakładki o programie',
    'about.program.p1': 'Czatbox TT to aplikacja do obsługi czatu z transmisji TikTok LIVE. Program pozwala śledzić wiadomości z wybranego live’a w osobnym, czytelnym oknie. Aplikacja została stworzona z myślą o wygodnym podglądzie czatu, archiwizacji rozmów oraz dodatkowych zdarzeń z live’a.',
    'about.program.p2': 'Program po zalogowaniu do TikToka pobiera czat z wybranego twórcy LIVE i wyświetla go w uporządkowanej formie. Użytkownik może przełączać się między obsługiwanymi twórcami, filtrować typy zdarzeń oraz dostosować wygląd aplikacji do własnych preferencji.',
    'about.program.how': 'Jak działa program:',
    'about.program.how.p1': 'Po uruchomieniu aplikacji użytkownik loguje się do TikToka. Gdy sesja zostanie wykryta, aplikacja przełącza się do widoku czatu i łączy się z wybranym live’em. Czat jest pobierany w tle i wyświetlany w aplikacji jako osobna lista zdarzeń.',
    'about.program.how.p2': 'Wiadomości czatu mogą być pokazywane z ustawionym opóźnieniem, aby łatwiej było je śledzić przy aktywnych transmisjach. Pozostałe zdarzenia, takie jak prezenty, dołączenia czy polubienia, mogą pojawiać się na bieżąco. Użytkownik może w każdej chwili zmienić filtr, styl czatu, motyw lub opóźnienie.',
    'about.program.how.p3': 'Podczas działania programu wszystkie zdarzenia z transmisji są zapisywane do archiwum. Po zakończeniu lub zmianie transmisji archiwum można otworzyć w zakładce Archiwum i wrócić do wcześniejszych rozmów.',
    'about.news.version': 'Wersja programu',
    'about.news.versionSuffix': '',
    'about.news.statement.title': 'Oświadczenie:',
    'about.news.statement.p1': `Moi drodzy, obecna aktualizacja jest naprawdę potężna, że tak pozwolę sobie to ująć. Dotychczas wdrażałem wszystko to co miało większy lub mniejszy sens ale o co mnie prosiliście. Na wstępie zacznę od tego, że z kilku funkcji zrezygnowałem i już tłumaczę się bez bicia dlaczego? Pomysłem na program była chęć pomocy rozwoju wszystkim twórcom, i tym większym i tym mniejszym ale przede wszystkim ułatwienie moderacji w ich pracy, przy aktywniejszej społeczności, niestety pewne funkcje sprawiły, że program zamiast służyć i wspierać, stał się narzędziem do szpiegowania innych, ich zarobków i rankingów. Dla mnie to nie do pomyślenia, że coś co tworzę ma szkodzić, a nie pomagać, bo nigdy to nie było moją intencją, w tym też momencie od tej aktualizacji program faktycznie będzie pokazywać tylko statystyki twórcy, z którym jesteśmy połączeni, a wszelkie rankingi, czy przebiegi bitewek u przeciwnika zostają wycofane.`,
    'about.news.statement.p2': `Czy to już wszystko? Oczywiście, że nie. Nie mam w zwyczaju czegoś zabierać ale nie zostawić nic w zamian. Chociaż to modne w gamedevie i u twórców różnej maści aplikacji ja raz jeszcze podkreślę, że jestem jak wy, zwykłym użytkownikiem, moderatorem, odbiorcą twórców jak inni odbiorcy. W związku z tym, mówiąc szczerze... Dostaniemy coś, czego bałem się wdrażać, ze względu na drewniane komputery, wciąż funkcjonujące u wielu ludzi na starszych wersjach Windowsa jak 10 czy słabszym połączeniu internetowym ale... Jak to kilku testerów stwierdziło, tacy ludzie to mniejszość, a program powinien się rozwijać.`,
    'about.news.statement.p3': `Po namyśle jednak podjąłem tą decyzję i wszczepiłem w program AI, które pozwoli lepiej kontrolować czat i statystyki dla twórcy i moderacji. I od teraz daje nam możliwość lepszej personalizacji i przepływu informacji na czacie live. Jak działa program w połączeniu z AI? Po wprowadzeniu specjalnego kodu w ustawieniach → Zrealizuj kod odblokowuje nam się opcja AI. Wtedy program automatycznie zacznie pobierać Ollamę która zajmuje ponad 1 GB, a następnie ją zaktualizuje o kolejną podobną wartość GB. Tak wiem, dla ludzi z drewnianym internetem może to być problematyczne jednak jest to opcja dodatkowa, a sam program nadal może działać bez tego, jednak gdy zdecydujecie się na aktywację Czester ulegnie on diametralnym zmianom, i będzie wam służył z lepszą wygodą operacyjną. Jeżeli jesteście ciekawi zmian zapraszam do wprowadzenia kodu AI: 19BM 9ARV 9IN1 K4M4.`,
    'about.news.changes.title': 'Zmiany:',
    'about.news.changes.removeRanking': 'System odczytu wrzucanych skrzyneczek na transmisji live - opcja wsparcia dla live wzrastających.',
    'about.news.changes.ai': 'Optymalizacja menu - kilka funkcji ciągle się odświeżało, powodując po czasie wolniejsze działanie programu.',
    'about.news.changes.codes': 'Odświeżona zakładka O programie.',
    'about.news.changes.multiplier': 'Poprawione błędy w wyglądzie aplikacji Retro KB2.',
    'about.news.changes.optimization': '',
    'about.news.changes.radio': 'Dodano radio.',
    'about.news.changes.viceCity': '',
    'about.news.024.layout': 'Przebudowa wyglądu aplikacji',
    'about.news.024.launcher': 'Wprowadzenie launchera z okienkami u dołu aplikacji',
    'about.news.024.archives': 'Wprowadzenie automatycznego czyszczenia archiwów powyżej 7 dni w ustawieniach (by program wam nie zamulał i działał sprawniej).',
    'about.news.024.ttsVolume': 'Możliwość zmiany głośności czytania wiadomości TTS na czacie.',
    'about.news.024.icon': 'Nowa ikona programu.',
    'about.news.024.bigPicture': 'Wprowadzono Big Picture.',
    'about.news.024.about': 'Zmiany w zakładce O programie (polecam zajrzeć).',
    'about.news.next.ai': 'Dodatkowe funkcje AI w programie.',
    'about.news.intro': 'Czatbox TT to aplikacja do obsługi czatu z transmisji TikTok LIVE. Program pozwala śledzić wiadomości z wybranego live\'a w osobnym, czytelnym oknie. Aplikacja została stworzona z myślą o wygodnym podglądzie czatu, archiwizacji rozmów oraz dodatkowych zdarzeń z live\'a.',
    'about.news.features.title': 'Główne funkcje:',
    'about.news.features.achievements': 'dodano system osiągnięć, są widoczne w zakładce „Osiągnięcia”',
    'about.news.features.redeemCode': 'dodano zakładkę „Zrealizuj kod” w ustawieniach',
    'about.news.features.retroKb2': 'wygląd aplikacji: Retro KB2, który jest odciążoną wersją programu tzw. Lite',
    'about.news.features.desktopWidgetsRemoved': 'Usunięcie opcji widgetów na pulpicie i przypinania ich na wierzchu. Ta mechanika była mocno bugogenna i obciążała dodatkowo aplikacje, w połączeniu z cięższymi motywami spadała jakość używania mojego programu przez konsumentów ze słabszymi sprzętami. Nie to było moim celem, zależy mi na jakości, dlatego w obecnej wersji funkcja ta zostaje zawieszona.',
    'about.news.features.topTappers': 'dodany został nowy widget rankingu taperów.',
    'about.news.features.events': 'wyświetlanie wiadomości z czatu TikTok LIVE, z obsługą filtrów wiadomości, polubień, prezentów, dołączeń, repostów, udostępnień, skrzyneczek i portali',
    'about.news.features.moderators': 'wyróżnianie moderatorów czerwonym nickiem',
    'about.news.features.avatars': 'losowe avatary użytkowników z lokalnej puli grafik programu, by pobierać jak najmniej pakietów i nie spowalniać internetu podczas transmisji',
    'about.news.features.multiplier': 'pasek informacji o mnożniku podczas bitwy',
    'about.news.features.tts': 'czytanie wiadomości na głos przez TTS',
    'about.news.features.archive': 'archiwizowanie czatu całej transmisji do pliku',
    'about.news.features.styles': 'różne style czatu: Kompaktowy, Przestrzenny, Nowoczesny',
    'about.news.features.themes': 'różne motywy kolorystyczne aplikacji',
    'about.news.features.appearances': 'różne wyglądy aplikacji: Domyślny, Ozdobny i Retro KB2',
    'about.news.features.delay': 'regulowane opóźnienie wyświetlania wiadomości czatu',
    'about.news.features.stats': 'przybornik statystyk live',
    'about.news.features.widgets': 'przybornik live został zastąpiony widgetami. Od teraz możesz sprawdzić moderację online na czacie, statystyki i top 5 giftujących osób',
    'about.news.features.flexibleWidgets': 'wszystkie widgety w aplikacji są elastyczne tj. możesz je ukryć i pokazać według potrzeb',
    'about.news.features.archiveCenter': 'poprawione i rozbudowane centrum archiwizacji czatu live, z podziałem na filtry, podsumowaniami ilości zdarzeń, wiadomości na czacie, monetami, moderatorami online podczas sesji',
    'about.news.features.archiveActions': 'archiwum można eksportować do pliku *.txt, kasować, odświeżać.',
    'about.news.features.languages': 'język polski, angielski i niemiecki aplikacji',
    'about.news.fixes.title': 'Poprawki:',
    'about.news.fixes.recentCreators': 'poprawiono działanie ostatnich twórców i przywrócono ich poprawne wyświetlanie poza Retro KB2',
    'about.news.fixes.box': 'poprawiony został komunikat o wysłanej skrzyneczce gdy pękała na czacie "unknow wysyła skrzyneczkę"',
    'about.news.fixes.optimization': 'optymalizacja działania programu',
    'about.news.known.title': 'Znane błędy:',
    'about.news.known.box': 'czasem po wysłaniu skrzyneczki gdy pęka pojawia się wiadomość na czacie "unknow wysyła skrzyneczkę"',
    'about.news.known.multiplier': 'mnożnik bitewek nadal pozostaje funkcją testową i może czasem błędnie pojawić się pod koniec bitwy',
    'about.news.known.enigmaPerformance': 'Wygląd Motyw: Enigma-Z i wygląd aplikacji: ozdobny zamulają aplikację na słabszych sprzętach, niestety na chwilę obecną nie jestem w stanie tego rozwiązać ponieważ działa to na półprzezroczystych powierzchniach zgodnie z założeniem i wymaga nieco więcej mocy od twojego PC, na te konto masz wiele innych opcji wizualnych aplikacji, które śmigają na słabszych komputerach',
    'about.news.next.title': 'Co dalej:',
    'about.news.next.archive': 'Poprawki nad odczytem archiwizowanych czatów. Będąc szczerym jestem niezadowolony z obecnej wersji i potrzebuje ona przebudowy.',
    'about.news.next.fixes': 'Dźwięki dla giftów od xxx wartości monet.',
    'about.news.next.widgets': 'rozbudowa systemu widgetów',
    'about.news.next.ttsLanguages': '',
    'about.news.next.superFans': 'wyróżnienie super fanów na czacie',
    'about.news.next.achievements': 'Rozbudowa osiągnięć.',
    'about.news.next.redeemCodes': 'dodanie kolejnych kodów aktywacyjnych',
    'about.news.next.specialNotifications': 'dalsze porządkowanie funkcji specjalnych i powiadomień',
    'about.news.next.connection': 'optymalizacja stabilności połączenia z twórcą',
    'about.news.next.giftSounds': 'powiadomienia dźwiękowe dla większych prezentów',
    'about.faq.title': 'FAQ',
    'about.faq.idea.question': 'Skąd pomysł na aplikację?',
    'about.faq.idea.answer': 'Głównie ze względu na pobugowany czat Tiktoka, który wrzuca wszystko na raz i treści szybko znikają. Na pomysł wpadłem podczas moderowania czatu u Kamy (@teambibii), którą serdecznie pozdrawiam.',
    'about.faq.systems.question': 'Program jest tylko na Windowsa?',
    'about.faq.systems.answer': 'Tak. Program jest tylko na system Windows, nie planuję go rozszerzać na inne platformy czy systemy - kwestia kosztów. Nie pobieram za niego opłat, a zawiera wiele funkcji, które w innych programach są płatne dlatego radujmy się, że wgl. na coś powstał...',
    'about.faq.support.question': 'Czy mogę ciebie jakoś wesprzeć?',
    'about.faq.support.answer': 'Powiedziałbym, że możesz mi postawić jakąś okrutną pizzę margaritę albo energola ale nie potrzebuję wsparcia. Jak chcesz się odwdzięczyć, to kliknij w zakładkę Monetki i użyj mojego reflinka.',
    'about.faq.future.question': 'Czy planuje rozwijać dalej projekt?',
    'about.faq.future.answer': 'Kropla drąży skałę, a czas wszystko pokaże. Nie żyjmy tym co było wczoraj, żyjmy tym co będzie jutro, a jutro jest już dzisiaj. Jej, jak enigmatycznie wyszło...',
    'about.faq.codes.question': 'Skąd wziąć kody do Zrealizuj kod?',
    'about.faq.codes.answer': 'Zazwyczaj kody skrywają ukryte funkcje dla testerów bądź jakiś drobny prezent za wsparcie. Oficjalnie jest dostępny jeden, publiczny kod, który pobiera mózg Czestera, by był w stanie analizować co dzieje się na czacie: 19BM 9ARV 9IN1 K4M4. Powiedźmy, ze mam dobry humor, a rzadko mam zły, to łapcie coś, co przyda się na live wzrastające, nie ma za co: 1THU 3GS6 TO7O L6S2. Jak pojawią się w przyszłości jakieś kody, to pewnie będą to nagrody dla aktywnych członków społeczności Kamy, dlatego warto ją obserwować i wspierać.',
    'about.faq.magic.question': 'A jest jakiś tajny, magiczny kod?',
    'about.faq.magic.answer': 'Hm… Nie ma żadnych magicznych kodów, jest tylko tryb deweloperski, na którym sobie dodaje nowości i czasem je ukrywam pod kodem, by testerzy mogli sobie posprawdzać i przetestować nim wy je otrzymacie osobiście.',
    'statsWidget.title': 'Statystyki LIVE',
    'statsWidget.viewers': 'Osoby na czacie',
    'statsWidget.messages': 'Wysłane wiadomości',
    'statsWidget.activeHearts': 'Odbite serca',
    'statsWidget.inactiveHearts': 'Nieodbite serca',
    'statsWidget.dock': 'Narzędzia LIVE',
    'statsWidget.expand': 'Rozwiń statystyki LIVE',
    'statsWidget.collapse': 'Zwiń statystyki LIVE',
    'topGifters.title': 'Top giftujący',
    'topGifters.expand': 'Rozwiń top giftujących',
    'topGifters.collapse': 'Zwiń top giftujących',
    'topTappers.title': 'Top tapnięć',
    'topTappers.empty': 'Brak polubień LIVE od dołączenia do transmisji.',
    'topTappers.expand': 'Rozwiń top tapnięć',
    'topTappers.collapse': 'Zwiń top tapnięć',
    'moderatorsWidget.title': 'Aktywni moderatorzy',
    'moderatorsWidget.empty': 'Brak aktywnych moderatorów w ostatnich 5 minutach.',
    'moderatorsWidget.expand': 'Rozwiń listę aktywnych moderatorów',
    'moderatorsWidget.collapse': 'Zwiń listę aktywnych moderatorów',
    'battle.stage.battle': 'BITWA TRWA',
    'battle.stage.multiplier': 'MNOŻNIK X{multiplier}',
    'battle.stage.mission': 'MISJA BONUSOWA {progress}/{target}',
    'battle.stage.missionSuccess': 'MISJA WYKONANA — MNOŻNIK X{multiplier}',
    'battle.stage.booster': 'BOOSTERY W GRZE',
    'battle.stage.finished': 'KONIEC BITWY',
    'battle.stage.cancelled': 'BITWA PRZERWANA',
    'battle.stage.score': '{left} {leftScore} : {rightScore} {right}',
    'battle.stage.winner': 'Wygrywa: {name}',
    'battle.stage.missionBy': 'Cel: {names}',
    'battle.stage.rewards': 'Nagrody: {rewards}',
    'status.connecting': 'Łączę...',
    'status.online': 'Online',
    'status.offline': 'Offline',
    'status.reconnecting': 'Ponawiam...',
    'status.rateLimited': 'Limit połączeń',
    'status.error': 'Błąd połączenia',
    'chat.empty': 'Po zalogowaniu pojawia się tutaj spowolniony czat LIVE.',
    'archive.loading': 'Wczytuję archiwum...',
    'archive.loadFailed': 'Nie udało się odczytać archiwum.',
    'archive.loadFailedWithError': 'Nie udało się odczytać archiwum: {error}',
    'archive.empty': 'Brak zapisanych archiwów.',
    'archive.defaultName': 'Archiwum',
    'archive.refreshing': 'Odświeżam archiwum...',
    'archive.listFailed': 'Nie udało się odczytać listy archiwów: {error}',
    'archive.noMatches': 'Brak archiwów pasujących do wyszukiwania.',
    'archive.filteredEmpty': 'Brak zdarzeń pasujących do wybranych filtrów.',
    'archive.legacy': 'Stary format TXT',
    'archive.deleteConfirm': 'Usunąć archiwum „{name}”? Tej operacji nie można cofnąć.',
    'archive.deleteFailed': 'Nie udało się usunąć archiwum.',
    'archive.activeDeleteFailed': 'Nie można usunąć aktualnie zapisywanej transmisji.',
    'archive.exported': 'Archiwum wyeksportowano.',
    'archive.exportFailed': 'Nie udało się wyeksportować archiwum.',
    'archive.folderFailed': 'Nie udało się otworzyć folderu archiwów.',
    'topGifters.empty': 'Brak giftów od dołączenia do transmisji.',
    'event.member.join': 'dołączył(a) do LIVE',
    'event.gift': 'wysłał(a) prezent: {giftName}{countText}{costText}',
    'event.box': 'wysyła {boxName}{costText}{audienceText}',
    'event.box.chest': 'skrzynię',
    'event.box.portal': 'portal',
    'event.audience': ' dla (👥 {count})',
    'event.like': 'polubił(a) LIVE (łącznie {total} polubień)',
    'event.repost': '🔁 repostował live',
    'event.share': '↩️ udostępnia LIVE',
    'battle.multiplier': 'BITWA: ZA CHWILĘ MNOŻNIK X{multiplier}',
    'battle.effectAlert': '{effect}: {name}',
    'battle.finished': 'Bitwa zakończona',
    'battle.cancelled': 'Bitwa została przerwana',
    'czester.notice.multiplier': 'Uwaga, zaraz w bitwie będzie mnożnik x{multiplier}.',
    'czester.notice.creatorFreeze': 'Twórca został zamrożony.',
    'czester.battle.start': 'Rozpoczęła się walka: {fighters}.',
    'czester.battle.score': 'Aktualny wynik bitwy: {score}.',
    'czester.battle.finished': 'Walka zakończona: {score}.',
    'czester.battle.cancelled': 'Bitwa została przerwana.',
    'czester.battle.missionStart': 'Wpadła misja bitewna: {detail} Cel: {target}. Nagroda: mnożnik x{multiplier}.',
    'czester.battle.missionProgress': '{actor} ruszył(a) cel misji: {progress}/{target}.',
    'czester.battle.missionSuccess': 'Misja bitewna wykonana. Wchodzi nagroda: mnożnik x{multiplier}.',
    'czester.battle.missionFailed': 'Misja bitewna nie została wykonana.',
    'czester.battle.missionReward': 'Nagroda z misji została rozliczona.',
    'czester.battle.effect': 'Efekt w bitwie: {effect}{actor}{targets}.',
    'czester.battle.booster': 'W bitwie pojawił się booster: {effect}.',
    'battle.effect.freeze': 'Zamrożenie',
    'battle.effect.glove': 'Rękawice',
    'battle.effect.fog': 'Mgła',
    'battle.effect.hammer': 'Młot',
    'battle.effect.shield': 'Tarcza',
    'battle.effect.critical': 'Krytyczny strzał',
    'battle.effect.top2': 'Top 2',
    'battle.effect.top3': 'Top 3',
    'battle.effect.boost': 'Boost',
    'battle.effect.effect': 'Efekt'
  },
  en: {
    'app.tagline': 'Track and manage live chat in real time.',
    'nav.chatbox': 'Chatbox',
    'nav.archive': 'Archive',
    'nav.settings': 'Settings',
    'nav.notes': 'Notes',
    'nav.achievements': 'Achievements',
    'nav.coins': 'Coins',
    'nav.boxes': 'Boxes',
    'nav.radio': 'Radio',
    'nav.czester': 'Assistant Czester',
    'nav.about': 'About',
    'creator.label': 'Creator',
    'creator.refresh': 'Refresh chat',
    'creator.noMatches': 'No matching creators',
    'recentCreators.aria': 'Recent creators',
    'recentCreators.online': 'Selected',
    'recentCreators.offline': 'Not selected',
    'recentCreators.delete': 'Remove creator from the list',
    'achievements.title': 'Achievements',
    'achievements.note': 'Unlocked achievements for activity in the app.',
    'achievements.emptyTitle': 'No unlocked achievements yet.',
    'achievements.emptyDescription': 'Achievements will appear here only after you earn them.',
    'achievements.firstLogin.title': 'I solemnly swear that I am up to no good!',
    'achievements.firstLogin.description': 'Log in for the first time in the program.',
    'achievements.kamaConnections.title': 'There is no place like home...',
    'achievements.kamaConnections.description': 'Connect to Kama 10 times.',
    'achievements.tenCreators.title': 'I am just getting started!',
    'achievements.tenCreators.description': 'Connect to 10 different creators.',
    'achievements.firstNote.title': 'I must write or I will burst!',
    'achievements.firstNote.description': 'Write your first note.',
    'achievements.retroKb2.title': 'Retrospection',
    'achievements.retroKb2.description': 'Switch the app to the Lite version.',
    'coins.title': 'Coins',
    'coins.note': 'Support the app by buying TikTok coins with a discount.',
    'coins.cardTitle': 'Support through TikTok coins',
    'coins.description': 'You can support the app author by buying TikTok coins on TikTok with a 25% discount using code ZD3TKFBV.',
    'coins.codeLabel': 'Discount code:',
    'coins.link': 'Open TikTok',
    'coins.chatPromo': 'Support the Czatbox TT author: buy TikTok coins with a 25% discount using code ZD3TKFBV or open directly:',
    'boxes.title': 'Boxes',
    'boxes.note': 'Archive of boxes saved from LIVE sessions.',
    'boxes.liveTitle': 'Boxes from session',
    'boxes.liveDescription': 'Select a session from the list to see detected boxes.',
    'boxes.refresh': 'Refresh',
    'boxes.searchPlaceholder': 'Search creator or date...',
    'boxes.noSessions': 'No saved sessions with boxes.',
    'boxes.noMatches': 'No sessions match the search.',
    'boxes.loading': 'Loading boxes...',
    'boxes.loadFailed': 'Could not load boxes.',
    'boxes.sessionCount': '{count} boxes',
    'boxes.summary.count': 'Boxes',
    'boxes.summary.coins': 'Coins',
    'boxes.summary.people': 'Slots',
    'boxes.emptyTitle': 'Select a session.',
    'boxes.emptyDescription': 'On the left you will find sessions where boxes were detected.',
    'boxes.sender': 'From:',
    'boxes.coins': 'Coins:',
    'boxes.people': 'Slots:',
    'boxes.type.chest': 'Box',
    'boxes.type.portal': 'Portal',
    'settings.redeem.unlockedBoxes': 'Code accepted. The Boxes tab is active.',
    'settings.redeem.unlockedMiamiVice': 'Code accepted. The Miami Vice theme is active in appearance settings.',
    'czester.title': 'Assistant Czester',
    'czester.note.before': 'Good day! I am Czester and I will try to solve your TikTok problem. Remember that I am still ',
    'czester.note.learning': 'learning',
    'czester.note.after': ' and may still misunderstand a lot...',
    'czester.welcome': 'Good day! I am Czester and I will try to solve your TikTok problem. Remember that I am still learning and may still misunderstand a lot...',
    'czester.userLabel': 'You',
    'czester.botLabel': 'Czester',
    'czester.open': 'Open Czester',
    'czester.close': 'Close Czester',
    'czester.questionsButton': 'Show questions from last 5 minutes',
    'czester.questions.none': 'I do not see questions from the last 5 minutes.',
    'czester.moderatorsButton': 'Show active moderators',
    'czester.moderators.none': 'No active moderators in the last 5 minutes.',
    'czester.moderators.title': 'Active moderators:',
    'czester.notice.creatorFavorite': 'I moved @{creator} higher because you often return to this creator.',
    'czester.notice.spam': 'Possible spam detected: {author} sent the same message {count} times in 5 seconds.',
    'czester.notice.superfanJoin': 'Superfan {name} joined.',
    'czester.notice.connection': 'I saved this connection. The more often you return to a creator, the higher they will appear.',
    'czester.ai.title': 'Czester local brain',
    'czester.ai.checking': 'Checking local package...',
    'czester.ai.ready': 'Ready locally: {model}',
    'czester.ai.noModel': 'Ollama is running, Czester model is missing.',
    'czester.ai.noOllama': 'Local package is not installed yet.',
    'czester.ai.install': 'Install AI package',
    'czester.ai.installing': 'Installing...',
    'czester.ai.installerStarted': 'Ollama installer has started. After it finishes, click again to download the model.',
    'czester.ai.error': 'Could not prepare the local AI package.',
    'czester.ollama.prompt': 'Czester local brain has been unlocked. Ollama is a local AI engine running on your computer. In this app it lets Czester analyze chat, questions, spam and LIVE context better without sending conversations to an external chat. Do you want to download and install Ollama locally?',
    'czester.ollama.accept': 'Download and install',
    'czester.ollama.decline': 'Not now',
    'czester.ollama.declined': 'Sure. I will remind you on the next app launch until Ollama is ready.',
    'czester.ollama.installing': 'Preparing the Ollama installation. If an installer appears, finish it normally in the system.',
    'czester.ollama.ready': 'Ollama is ready. Czester can use the local model.',
    'czester.ollama.error': 'Could not prepare Ollama. Try again later.',
    'filters.chat': 'Chat',
    'filters.like': 'Likes',
    'filters.gift': 'Gifts',
    'filters.box': 'Boxes',
    'filters.repost': 'Reposts',
    'filters.share': 'Shares',
    'filters.member': 'Joins',
    'archive.title': 'Archive',
    'archive.status': 'Saved streams',
    'archive.refresh': 'Refresh',
    'archive.openFolder': 'Open folder',
    'archive.searchPlaceholder': 'Search creator or date...',
    'archive.selectTitle': 'Select a stream',
    'archive.selectDescription': 'All saved chats are listed on the left.',
    'archive.export': 'Export TXT',
    'archive.delete': 'Delete',
    'archive.summaryAria': 'Stream summary',
    'archive.summary.events': 'Events',
    'archive.summary.messages': 'Messages',
    'archive.summary.coins': 'Coins',
    'archive.summary.moderators': 'Moderators',
    'archive.filtersAria': 'Archive filters',
    'notes.title': 'Notes',
    'notes.status': 'Your notebook for notes',
    'notes.new': 'New',
    'notes.save': 'Save',
    'notes.delete': 'Delete',
    'notes.edit': 'Edit',
    'notes.searchPlaceholder': 'Search notes...',
    'notes.titlePlaceholder': 'Note title',
    'notes.contentPlaceholder': 'Write a note...',
    'notes.unsaved': 'New unsaved note',
    'notes.empty': 'No saved notes.',
    'notes.noMatches': 'No notes match your search.',
    'notes.previewEmpty': 'No note content.',
    'notes.saved': 'Note saved.',
    'notes.deleted': 'Note deleted.',
    'notes.loadFailed': 'Could not load notes.',
    'notes.saveFailed': 'Could not save the note.',
    'notes.deleteFailed': 'Could not delete the note.',
    'notes.deleteConfirm': 'Delete note “{title}”?',
    'notes.updatedAt': 'Edited: {time}',
    'notes.formatToolbar': 'Note formatting',
    'notes.format.bold': 'Bold',
    'notes.format.italic': 'Italic',
    'notes.format.underline': 'Underline',
    'notes.format.strike': 'Strikethrough',
    'notes.format.code': 'Code',
    'notes.format.codeblock': 'Code block',
    'notes.format.quote': 'Quote',
    'notes.format.list': 'List',
    'settings.title': 'Settings',
    'settings.subtitle': 'Adjust how the application works and looks.',
    'settings.reset': 'Restore defaults',
    'settings.tabs.general': 'Chat and archives',
    'settings.tabs.appearance': 'Appearance',
    'settings.tabs.accessibility': 'Audio',
    'settings.tabs.system': 'System',
    'settings.tabs.redeem': 'Codes',
    'settings.general.note': 'Chat, archive and Big Picture settings.',
    'settings.general.multiplierNotifications': 'Multiplier notifications',
    'settings.general.statsToolbox': 'Statistics toolbox',
    'settings.general.galleryAvatars': 'Gallery avatars',
    'settings.general.deleteOldArchives': 'Clear archives older than 7 days',
    'settings.general.bigPicture': 'Big Picture (fullscreen)',
    'settings.appearance.chatStyle': 'Chat style:',
    'settings.appearance.theme': 'Theme:',
    'settings.appearance.appAppearance': 'Application appearance:',
    'settings.chatStyle.compact.name': 'Compact',
    'settings.chatStyle.compact.description': 'Standard TikTok message style.',
    'settings.chatStyle.spacious.name': 'Spacious',
    'settings.chatStyle.spacious.description': 'A clearer message layout.',
    'settings.chatStyle.modern.name': 'Modern',
    'settings.chatStyle.modern.description': 'Modern bubble chat style.',
    'settings.theme.roseBlack.name': 'Rose Black (Default)',
    'settings.theme.roseBlack.description': 'Standard application colors.',
    'settings.theme.whiteTitanium.description': 'Light application look in white titanium tones.',
    'settings.theme.chillSerwis.description': 'The most chilled theme for the app.',
    'settings.theme.roseGlass.description': 'A slightly softer, delicate theme.',
    'settings.theme.lazarskieRejony.name': 'Enigma-Z',
    'settings.theme.lazarskieRejony.description': 'A translucent dark grey-blue style with neon accents.',
    'settings.theme.miamiVice.name': 'Miami Vice',
    'settings.theme.miamiVice.description': 'Pastel Miami tones inspired by GTA Vice City.',
    'settings.theme.locked': 'Locked',
    'settings.appAppearance.default.name': 'Default',
    'settings.appAppearance.default.description': 'Current header, sidebar, panel and button layout.',
    'settings.appAppearance.decorative.name': 'Decorative',
    'settings.appAppearance.decorative.description': 'Elegant, modern application layout.',
    'settings.appAppearance.retroKb2.name': 'Retro KB2',
    'settings.appAppearance.retroKb2.description': 'Lightweight old-blog layout inspired by K2: header and links instead of buttons.',
    'settings.accessibility.tts': 'Message TTS:',
    'settings.accessibility.readAloud': 'Read chat aloud',
    'settings.accessibility.skipVulgarNicknames': 'Skip vulgar nicknames',
    'settings.accessibility.skipVulgarMessages': 'Skip vulgar messages',
    'settings.accessibility.skipSpamMessages': 'Skip spam messages (follow for follow, obs, etc.)',
    'settings.accessibility.rolesOnly': 'Read messages from moderators and superfans only',
    'settings.accessibility.rolesOnlyDescription': 'TTS reads only messages from people with a red or gold nickname.',
    'settings.accessibility.voice': 'Voice',
    'settings.accessibility.systemVoice': 'System',
    'settings.accessibility.rate': 'Rate',
    'settings.accessibility.volume': 'Message reading volume',
    'settings.accessibility.delay': 'Chat delay:',
    'settings.system.note': 'System information and settings.',
    'settings.redeem.note': 'Enter a code to unlock extra features.',
    'settings.redeem.codeLabel': 'Activation code',
    'settings.redeem.button': 'Activate',
    'settings.redeem.waiting': 'Enter an activation code.',
    'settings.redeem.unlocked': 'Code accepted. Honda blue notification is active.',
    'settings.redeem.unlockedOllama': 'Code accepted. Czester local Ollama prompt has been unlocked.',
    'settings.redeem.invalid': 'Invalid code.',
    'settings.redeem.alreadyUsed': 'This code has already been redeemed.',
    'settings.system.autoLaunch': 'Automatically open Czatbox TT when the computer starts',
    'settings.system.runInBackground': 'Start the program in the background so it does not get in the way',
    'settings.system.minimizeToTray': 'Minimize Czatbox TT to the system tray after clicking X',
    'settings.system.language': 'Choose application language',
    'settings.system.language.pl': 'Polish',
    'settings.system.language.en': 'English',
    'settings.system.language.de': 'German',
    'settings.system.language.hu': 'Hungarian',
    'settings.system.timeFormat': 'Time format',
    'settings.system.timeFormat.auto': 'Automatic (detect system time)',
    'settings.system.timeFormat.12': '12-hour',
    'settings.system.timeFormat.24': '24-hour',
    'settings.system.clearSessionDescription': 'Problem with TikTok login or session',
    'settings.system.clearSession': 'Clear TikTok session',
    'settings.system.clearSessionConfirm': 'Clear the TikTok session and return to the login screen?',
    'about.title': 'About',
    'about.tabs.program': 'About',
    'about.tabs.news': 'What’s new?',
    'about.tabs.faq': 'FAQ',
    'radio.title': 'Radio',
    'radio.note': 'Listen to a selected station while working with the chat.',
    'radio.aria': 'Radio stations',
    'about.tabs.aria': 'About application tabs',
    'about.program.p1': 'Czatbox TT is an application for handling TikTok LIVE chat. It lets you follow messages from a selected live stream in a separate, readable window. The app was created for comfortable chat preview, conversation archiving and extra live events.',
    'about.program.p2': 'After logging in to TikTok, the program reads chat from the selected LIVE creator and displays it in an organized form. You can switch between supported creators, filter event types and adjust the application look to your preferences.',
    'about.program.how': 'How the program works:',
    'about.program.how.p1': 'After launching the application, the user logs in to TikTok. When the session is detected, the app switches to chat view and connects to the selected live stream. Chat is fetched in the background and displayed as a separate event list.',
    'about.program.how.p2': 'Chat messages can be shown with a configured delay, making them easier to follow during active streams. Other events, such as gifts, joins and likes, can appear live. You can change the filter, chat style, theme or delay at any time.',
    'about.program.how.p3': 'While the program is running, all stream events are saved to the archive. After ending or changing a stream, you can open the archive tab and return to earlier conversations.',
    'about.news.version': 'Program version',
    'about.news.versionSuffix': '',
    'about.news.statement.title': 'Statement:',
    'about.news.statement.p1': `This update is a major one. Until now I have been adding features that made more or less sense, but were requested by users. I want to start by saying that I have removed some features, and I want to explain why. The idea behind this program was to help creators grow, both larger and smaller ones, and above all to make moderation easier when the community is active. Unfortunately, some features made the program feel less like support and more like a tool for spying on other creators, their income and rankings. That was never my intention. From this update onward, the program will show only the statistics of the creator you are connected to, while rankings and opponent battle tracking are being withdrawn.`,
    'about.news.statement.p2': `Is that all? No. I do not like taking something away without leaving something useful in return. I am a regular user, moderator and viewer like many others. After thinking it through, I decided to add something I had been afraid to introduce because many people still use weaker computers, older Windows versions such as Windows 10, or slower internet connections. Still, several testers made a fair point: the program should keep developing.`,
    'about.news.statement.p3': `After considering it, I embedded AI into the program. It can help control chat and creator/moderation statistics better, and it gives more personalization and better information flow during LIVE chat. How does it work? After entering a special code in Settings → Redeem code, the AI option unlocks. The program can then download Ollama, which takes over 1 GB, and then update it by a similar amount. This is optional. The program can still work without it, but after activation Czester changes significantly and becomes more useful operationally. If you want to try it, enter the AI code: 19BM 9ARV 9IN1 K4M4.`,
    'about.news.changes.title': 'Changes:',
    'about.news.changes.removeRanking': 'Added reading of treasure boxes sent during LIVE streams - support for growing LIVE rooms.',
    'about.news.changes.ai': 'Optimized the menu - several functions were refreshing constantly and made the program slower over time.',
    'about.news.changes.codes': 'Refreshed the About section.',
    'about.news.changes.multiplier': 'Fixed bugs in the Retro KB2 application appearance.',
    'about.news.changes.optimization': '',
    'about.news.changes.radio': 'Added radio.',
    'about.news.changes.viceCity': '',
    'about.news.024.layout': 'Redesigned application appearance',
    'about.news.024.launcher': 'Added the bottom launcher with application windows',
    'about.news.024.archives': 'Added automatic cleanup of archives older than 7 days for better performance.',
    'about.news.024.ttsVolume': 'Added TTS message reading volume control.',
    'about.news.024.icon': 'New application icon.',
    'about.news.024.bigPicture': 'Added Big Picture mode.',
    'about.news.024.about': 'Updated the About section.',
    'about.news.next.ai': 'Additional AI features in the program.',
    'about.news.intro': 'Czatbox TT is an application for handling TikTok LIVE chat. It lets you follow messages from a selected live stream in a separate, readable window. The app was created for comfortable chat preview, conversation archiving and extra live events.',
    'about.news.features.title': 'Main features:',
    'about.news.features.achievements': 'added an achievements system, available in the “Achievements” tab',
    'about.news.features.redeemCode': 'added the “Redeem code” tab in settings',
    'about.news.features.retroKb2': 'application appearance: Retro KB2, a lighter Lite version of the program',
    'about.news.features.desktopWidgetsRemoved': 'removed desktop widget pinning and always-on-top desktop widgets. This mechanism was highly bug-prone and added extra load to the application. Combined with heavier themes, it reduced the quality of use for people on weaker computers. That was not the goal, quality matters, so this feature is suspended in the current version.',
    'about.news.features.topTappers': 'added a new top tappers ranking widget.',
    'about.news.features.events': 'displaying TikTok LIVE chat messages with filters for messages, likes, gifts, joins, reposts, shares, boxes and portals',
    'about.news.features.moderators': 'highlighting moderators with a red nickname',
    'about.news.features.avatars': 'random user avatars from the local application image pool to reduce network usage during streams',
    'about.news.features.multiplier': 'multiplier information banner during battles',
    'about.news.features.tts': 'reading chat messages aloud using TTS',
    'about.news.features.archive': 'archiving the entire stream chat to a file',
    'about.news.features.styles': 'multiple chat styles: Compact, Spacious and Modern',
    'about.news.features.themes': 'multiple application color themes',
    'about.news.features.appearances': 'multiple application layouts: Default, Decorative and Retro KB2',
    'about.news.features.delay': 'adjustable chat message display delay',
    'about.news.features.stats': 'live statistics toolbox',
    'about.news.features.widgets': 'the live toolbox has been replaced with widgets. You can now check online moderation, statistics and the top 5 gifters',
    'about.news.features.flexibleWidgets': 'all in-app widgets are flexible: you can hide and show them as needed',
    'about.news.features.archiveCenter': 'improved and expanded live chat archive center with filters and summaries for events, chat messages, coins and moderators online during the session',
    'about.news.features.archiveActions': 'archives can be exported to *.txt, deleted and refreshed.',
    'about.news.features.languages': 'Polish, English and German application languages',
    'about.news.fixes.title': 'Fixes:',
    'about.news.fixes.recentCreators': 'fixed recent creators and restored their correct display outside Retro KB2',
    'about.news.fixes.box': 'fixed the coin box message that could show "unknow sends a box" when a box opened in chat',
    'about.news.fixes.optimization': 'program performance optimization',
    'about.news.known.title': 'Known issues:',
    'about.news.known.box': 'after a coin box opens, the chat may sometimes show the message "unknow sends a box"',
    'about.news.known.multiplier': 'battle multipliers remain experimental and may sometimes appear incorrectly near the end of a battle',
    'about.news.next.title': 'What comes next:',
    'about.news.next.archive': 'Improvements to archived chat reading. To be honest, I am not satisfied with the current version and it needs to be rebuilt.',
    'about.news.next.fixes': 'Sounds for gifts above xxx coin value.',
    'about.news.next.widgets': 'expanding the widget system',
    'about.news.next.ttsLanguages': 'additional TTS chat reading languages',
    'about.news.next.superFans': 'highlighting super fans in chat',
    'about.news.next.achievements': 'Expanding achievements.',
    'about.news.next.redeemCodes': 'adding more activation codes',
    'about.news.next.specialNotifications': 'further cleanup of special features and notifications',
    'about.news.next.connection': 'optimizing creator connection stability',
    'about.news.next.giftSounds': 'sound notifications for larger gifts',
    'about.faq.title': 'FAQ',
    'about.faq.idea.question': 'Where did the idea for the application come from?',
    'about.faq.idea.answer': 'Mainly because TikTok chat can be buggy, throw everything in at once and make messages disappear quickly. The idea came to me while moderating Kama\'s chat (@teambibii), whom I warmly greet.',
    'about.faq.systems.question': 'Is the program only for Windows?',
    'about.faq.systems.answer': 'Yes. The program is only for Windows. I do not plan to expand it to other platforms or systems because of costs. I do not charge for it, and it includes many features that are paid in other programs, so let us be glad that something was created at all...',
    'about.faq.support.question': 'Can I support you somehow?',
    'about.faq.support.answer': 'I would say you can buy me some brutal margherita pizza or an energy drink, but I do not need support. If you want to give something back, click the Coins tab and use my referral link.',
    'about.faq.future.question': 'Do I plan to continue developing the project?',
    'about.faq.future.answer': 'A drop hollows the stone, and time will tell. Let us not live by what happened yesterday, let us live by what comes tomorrow, and tomorrow is already today. That came out strangely enigmatic...',
    'about.faq.codes.question': 'Where can I get codes for Redeem code?',
    'about.faq.codes.answer': 'Codes usually hide features for testers or small gifts for support. Officially there is one public code that downloads Czester\'s brain so it can analyze what is happening in chat: 19BM 9ARV 9IN1 K4M4. Let us say I am in a good mood, and I am rarely in a bad one, so here is something useful for growing LIVE streams: 1THU 3GS6 TO7O L6S2. If more codes appear in the future, they will probably be rewards for active members of Kama\'s community, so it is worth following and supporting her.',
    'about.faq.magic.question': 'Is there any secret, magical code?',
    'about.faq.magic.answer': 'There are no magical codes. There is only a developer mode where I add new features and sometimes hide them behind a code so testers can check them before everyone receives them.',
    'statsWidget.title': 'LIVE statistics',
    'statsWidget.viewers': 'People in chat',
    'statsWidget.messages': 'Messages sent',
    'statsWidget.activeHearts': 'Heart Me sent',
    'statsWidget.inactiveHearts': 'Heart Me not sent',
    'statsWidget.dock': 'LIVE tools',
    'statsWidget.expand': 'Expand LIVE statistics',
    'statsWidget.collapse': 'Collapse LIVE statistics',
    'topGifters.title': 'Top gifters',
    'topGifters.expand': 'Expand top gifters',
    'topGifters.collapse': 'Collapse top gifters',
    'topTappers.title': 'Top taps',
    'topTappers.empty': 'No LIVE likes since joining this stream.',
    'topTappers.expand': 'Expand top taps',
    'topTappers.collapse': 'Collapse top taps',
    'moderatorsWidget.title': 'Active moderators',
    'moderatorsWidget.empty': 'No active moderators in the last 5 minutes.',
    'moderatorsWidget.expand': 'Expand active moderators',
    'moderatorsWidget.collapse': 'Collapse active moderators',
    'battle.stage.battle': 'BATTLE IN PROGRESS',
    'battle.stage.multiplier': 'MULTIPLIER X{multiplier}',
    'battle.stage.mission': 'BONUS MISSION {progress}/{target}',
    'battle.stage.missionSuccess': 'MISSION COMPLETE — MULTIPLIER X{multiplier}',
    'battle.stage.booster': 'BOOSTERS ACTIVE',
    'battle.stage.finished': 'BATTLE FINISHED',
    'battle.stage.cancelled': 'BATTLE CANCELLED',
    'battle.stage.score': '{left} {leftScore} : {rightScore} {right}',
    'battle.stage.winner': 'Winner: {name}',
    'battle.stage.missionBy': 'Goal: {names}',
    'battle.stage.rewards': 'Rewards: {rewards}',
    'status.connecting': 'Connecting...',
    'status.online': 'Online',
    'status.offline': 'Offline',
    'status.reconnecting': 'Retrying...',
    'status.rateLimited': 'Connection limit',
    'status.error': 'Connection error',
    'chat.empty': 'After logging in, delayed LIVE chat will appear here.',
    'archive.loading': 'Loading archive...',
    'archive.loadFailed': 'Could not read the archive.',
    'archive.loadFailedWithError': 'Could not read the archive: {error}',
    'archive.empty': 'No saved archives.',
    'archive.defaultName': 'Archive',
    'archive.refreshing': 'Refreshing archive...',
    'archive.listFailed': 'Could not read archive list: {error}',
    'archive.noMatches': 'No archives match your search.',
    'archive.filteredEmpty': 'No events match the selected filters.',
    'archive.legacy': 'Legacy TXT format',
    'archive.deleteConfirm': 'Delete archive “{name}”? This cannot be undone.',
    'archive.deleteFailed': 'Could not delete the archive.',
    'archive.activeDeleteFailed': 'The stream currently being saved cannot be deleted.',
    'archive.exported': 'Archive exported.',
    'archive.exportFailed': 'Could not export the archive.',
    'archive.folderFailed': 'Could not open the archive folder.',
    'topGifters.empty': 'No gifts since joining this stream.',
    'event.member.join': 'joined the LIVE',
    'event.gift': 'sent a gift: {giftName}{countText}{costText}',
    'event.box': 'sends {boxName}{costText}{audienceText}',
    'event.box.chest': 'a box',
    'event.box.portal': 'a portal',
    'event.audience': ' for (👥 {count})',
    'event.like': 'liked the LIVE ({total} likes total)',
    'event.repost': '🔁 reposted the live',
    'event.share': '↩️ shares the LIVE',
    'battle.multiplier': 'BATTLE: MULTIPLIER X{multiplier} SOON',
    'battle.effectAlert': '{effect}: {name}',
    'battle.finished': 'Battle finished',
    'battle.cancelled': 'The battle was cancelled',
    'czester.notice.multiplier': 'Heads up, battle multiplier x{multiplier} is coming.',
    'czester.notice.creatorFreeze': 'The creator has been frozen.',
    'czester.battle.start': 'Battle started: {fighters}.',
    'czester.battle.score': 'Current battle score: {score}.',
    'czester.battle.finished': 'Battle finished: {score}.',
    'czester.battle.cancelled': 'The battle was cancelled.',
    'czester.battle.missionStart': 'Battle mission started: {detail} Goal: {target}. Reward: multiplier x{multiplier}.',
    'czester.battle.missionProgress': '{actor} progressed the mission: {progress}/{target}.',
    'czester.battle.missionSuccess': 'Battle mission completed. Reward incoming: multiplier x{multiplier}.',
    'czester.battle.missionFailed': 'The battle mission was not completed.',
    'czester.battle.missionReward': 'The mission reward has been settled.',
    'czester.battle.effect': 'Battle effect: {effect}{actor}{targets}.',
    'czester.battle.booster': 'Battle booster appeared: {effect}.',
    'battle.effect.freeze': 'Freeze',
    'battle.effect.glove': 'Gloves',
    'battle.effect.fog': 'Fog',
    'battle.effect.hammer': 'Hammer',
    'battle.effect.shield': 'Shield',
    'battle.effect.critical': 'Critical strike',
    'battle.effect.top2': 'Top 2',
    'battle.effect.top3': 'Top 3',
    'battle.effect.boost': 'Boost',
    'battle.effect.effect': 'Effect'
  },
  de: {
    'app.tagline': 'Live-Chat in Echtzeit verfolgen und verwalten.',
    'nav.chatbox': 'Chatbox',
    'nav.archive': 'Archiv',
    'nav.settings': 'Einstellungen',
    'nav.notes': 'Notizen',
    'nav.achievements': 'Erfolge',
    'nav.coins': 'Münzen',
    'nav.boxes': 'Boxen',
    'nav.radio': 'Radio',
    'nav.czester': 'Assistent Czester',
    'nav.about': 'Über das Programm',
    'creator.label': 'Creator',
    'creator.refresh': 'Chat aktualisieren',
    'creator.noMatches': 'Keine passenden Creator',
    'recentCreators.aria': 'Letzte Creator',
    'recentCreators.online': 'Ausgewählt',
    'recentCreators.offline': 'Nicht ausgewählt',
    'recentCreators.delete': 'Creator aus der Liste entfernen',
    'achievements.title': 'Erfolge',
    'achievements.note': 'Freigeschaltete Erfolge für Aktivität in der App.',
    'achievements.emptyTitle': 'Noch keine Erfolge freigeschaltet.',
    'achievements.emptyDescription': 'Erfolge erscheinen hier erst, nachdem du sie freigeschaltet hast.',
    'achievements.firstLogin.title': 'Ich schwöre feierlich, dass ich etwas im Schilde führe!',
    'achievements.firstLogin.description': 'Melde dich zum ersten Mal im Programm an.',
    'achievements.kamaConnections.title': 'Zu Hause ist es doch am schönsten...',
    'achievements.kamaConnections.description': 'Verbinde dich 10 Mal mit Kama.',
    'achievements.tenCreators.title': 'Ich komme gerade erst in Fahrt!',
    'achievements.tenCreators.description': 'Verbinde dich mit 10 verschiedenen Creatorn.',
    'achievements.firstNote.title': 'Ich muss schreiben, sonst platze ich!',
    'achievements.firstNote.description': 'Schreibe deine erste Notiz.',
    'achievements.retroKb2.title': 'Retrospektion',
    'achievements.retroKb2.description': 'Schalte die App auf die Lite-Version um.',
    'coins.title': 'Münzen',
    'coins.note': 'Unterstütze die App, indem du TikTok-Münzen mit Rabatt kaufst.',
    'coins.cardTitle': 'Unterstützung über TikTok-Münzen',
    'coins.description': 'Du kannst den Autor der App unterstützen, indem du TikTok-Münzen mit 25% Rabatt über den Code ZD3TKFBV kaufst.',
    'coins.codeLabel': 'Rabattcode:',
    'coins.link': 'TikTok öffnen',
    'coins.chatPromo': 'Unterstütze den Autor von Czatbox TT: Kaufe TikTok-Münzen mit 25% Rabatt über den Code ZD3TKFBV oder öffne direkt:',
    'boxes.title': 'Boxen',
    'boxes.note': 'Archiv der aus LIVE-Sitzungen gespeicherten Boxen.',
    'boxes.liveTitle': 'Boxen aus der Sitzung',
    'boxes.liveDescription': 'Wähle links eine Sitzung aus, um erkannte Boxen zu sehen.',
    'boxes.refresh': 'Aktualisieren',
    'boxes.searchPlaceholder': 'Creator oder Datum suchen...',
    'boxes.noSessions': 'Keine gespeicherten Sitzungen mit Boxen.',
    'boxes.noMatches': 'Keine passenden Sitzungen gefunden.',
    'boxes.loading': 'Boxen werden geladen...',
    'boxes.loadFailed': 'Boxen konnten nicht geladen werden.',
    'boxes.sessionCount': '{count} Boxen',
    'boxes.summary.count': 'Boxen',
    'boxes.summary.coins': 'Münzen',
    'boxes.summary.people': 'Plätze',
    'boxes.emptyTitle': 'Sitzung auswählen.',
    'boxes.emptyDescription': 'Links findest du Sitzungen, in denen Boxen erkannt wurden.',
    'boxes.sender': 'Von:',
    'boxes.coins': 'Münzen:',
    'boxes.people': 'Plätze:',
    'boxes.type.chest': 'Box',
    'boxes.type.portal': 'Portal',
    'settings.redeem.unlockedBoxes': 'Code angenommen. Der Boxen-Tab ist aktiv.',
    'settings.redeem.unlockedMiamiVice': 'Code akzeptiert. Das Miami-Vice-Theme ist in den Darstellungseinstellungen aktiv.',
    'czester.title': 'Assistent Czester',
    'czester.note.before': 'Guten Tag! Ich bin Czester und versuche, dein TikTok-Problem zu lösen. Denk daran, dass ich noch ',
    'czester.note.learning': 'lerne',
    'czester.note.after': ' und vieles noch falsch verstehen kann...',
    'czester.welcome': 'Guten Tag! Ich bin Czester und versuche, dein TikTok-Problem zu lösen. Denk daran, dass ich noch lerne und vieles noch falsch verstehen kann...',
    'czester.userLabel': 'Du',
    'czester.botLabel': 'Czester',
    'czester.open': 'Czester öffnen',
    'czester.close': 'Czester schließen',
    'czester.questionsButton': 'Fragen der letzten 5 Minuten zeigen',
    'czester.questions.none': 'Ich sehe keine Fragen aus den letzten 5 Minuten.',
    'czester.moderatorsButton': 'Aktive Moderatoren zeigen',
    'czester.moderators.none': 'Keine aktiven Moderatoren in den letzten 5 Minuten.',
    'czester.moderators.title': 'Aktive Moderatoren:',
    'czester.notice.creatorFavorite': 'Ich habe @{creator} höher gesetzt, weil du oft zu diesem Creator zurückkehrst.',
    'czester.notice.spam': 'Möglicher Spam erkannt: {author} hat dieselbe Nachricht {count} Mal in 5 Sekunden gesendet.',
    'czester.notice.superfanJoin': 'Superfan {name} tritt bei.',
    'czester.notice.connection': 'Ich habe diese Verbindung gespeichert. Je öfter du zu einem Creator zurückkehrst, desto höher erscheint er.',
    'czester.ai.title': 'Lokales Gehirn von Czester',
    'czester.ai.checking': 'Lokales Paket wird geprüft...',
    'czester.ai.ready': 'Lokal bereit: {model}',
    'czester.ai.noModel': 'Ollama läuft, aber das Czester-Modell fehlt.',
    'czester.ai.noOllama': 'Das lokale Paket ist noch nicht installiert.',
    'czester.ai.install': 'AI-Paket installieren',
    'czester.ai.installing': 'Installation läuft...',
    'czester.ai.installerStarted': 'Der Ollama-Installer wurde gestartet. Klicke nach der Installation erneut, um das Modell zu laden.',
    'czester.ai.error': 'Das lokale AI-Paket konnte nicht vorbereitet werden.',
    'czester.ollama.prompt': 'Das lokale Gehirn von Czester wurde freigeschaltet. Ollama ist eine lokale AI-Engine, die auf deinem Computer läuft. Im Programm kann Czester damit Chat, Fragen, Spam und LIVE-Kontext besser analysieren, ohne Gespräche an einen externen Chat zu senden. Möchtest du Ollama lokal herunterladen und installieren?',
    'czester.ollama.accept': 'Herunterladen und installieren',
    'czester.ollama.decline': 'Nicht jetzt',
    'czester.ollama.declined': 'Okay. Ich erinnere dich beim nächsten Programmstart daran, bis Ollama bereit ist.',
    'czester.ollama.installing': 'Ich bereite die Ollama-Installation vor. Wenn ein Installer erscheint, schließe ihn normal im System ab.',
    'czester.ollama.ready': 'Ollama ist bereit. Czester kann das lokale Modell nutzen.',
    'czester.ollama.error': 'Ollama konnte nicht vorbereitet werden. Versuche es später erneut.',
    'filters.chat': 'Chat',
    'filters.like': 'Likes',
    'filters.gift': 'Geschenke',
    'filters.box': 'Boxen',
    'filters.repost': 'Reposts',
    'filters.share': 'Teilen',
    'filters.member': 'Beitritte',
    'archive.title': 'Archiv',
    'archive.status': 'Gespeicherte Streams',
    'archive.refresh': 'Aktualisieren',
    'archive.openFolder': 'Ordner öffnen',
    'archive.searchPlaceholder': 'Creator oder Datum suchen...',
    'archive.selectTitle': 'Stream auswählen',
    'archive.selectDescription': 'Alle gespeicherten Chats befinden sich links.',
    'archive.export': 'TXT exportieren',
    'archive.delete': 'Löschen',
    'archive.summaryAria': 'Stream-Zusammenfassung',
    'archive.summary.events': 'Ereignisse',
    'archive.summary.messages': 'Nachrichten',
    'archive.summary.coins': 'Münzen',
    'archive.summary.moderators': 'Moderatoren',
    'archive.filtersAria': 'Archivfilter',
    'notes.title': 'Notizen',
    'notes.status': 'Dein Notizbuch für Notizen',
    'notes.new': 'Neu',
    'notes.save': 'Speichern',
    'notes.delete': 'Löschen',
    'notes.edit': 'Bearbeiten',
    'notes.searchPlaceholder': 'Notizen suchen...',
    'notes.titlePlaceholder': 'Notiztitel',
    'notes.contentPlaceholder': 'Notiz schreiben...',
    'notes.unsaved': 'Neue ungespeicherte Notiz',
    'notes.empty': 'Keine gespeicherten Notizen.',
    'notes.noMatches': 'Keine Notizen entsprechen der Suche.',
    'notes.previewEmpty': 'Kein Notizinhalt.',
    'notes.saved': 'Notiz gespeichert.',
    'notes.deleted': 'Notiz gelöscht.',
    'notes.loadFailed': 'Notizen konnten nicht geladen werden.',
    'notes.saveFailed': 'Notiz konnte nicht gespeichert werden.',
    'notes.deleteFailed': 'Notiz konnte nicht gelöscht werden.',
    'notes.deleteConfirm': 'Notiz „{title}“ löschen?',
    'notes.updatedAt': 'Bearbeitet: {time}',
    'notes.formatToolbar': 'Notizformatierung',
    'notes.format.bold': 'Fett',
    'notes.format.italic': 'Kursiv',
    'notes.format.underline': 'Unterstrichen',
    'notes.format.strike': 'Durchgestrichen',
    'notes.format.code': 'Code',
    'notes.format.codeblock': 'Codeblock',
    'notes.format.quote': 'Zitat',
    'notes.format.list': 'Liste',
    'settings.title': 'Einstellungen',
    'settings.subtitle': 'Passe Verhalten und Aussehen der Anwendung an.',
    'settings.reset': 'Standards wiederherstellen',
    'settings.tabs.general': 'Chat und Archive',
    'settings.tabs.appearance': 'Aussehen',
    'settings.tabs.accessibility': 'Audio',
    'settings.tabs.system': 'System',
    'settings.tabs.redeem': 'Codes',
    'settings.general.note': 'Einstellungen für Chat, Archive und Big Picture.',
    'settings.general.multiplierNotifications': 'Multiplikator-Benachrichtigungen',
    'settings.general.statsToolbox': 'Statistik-Werkzeugleiste',
    'settings.general.galleryAvatars': 'Avatare aus der Galerie',
    'settings.general.deleteOldArchives': 'Archive löschen, die älter als 7 Tage sind',
    'settings.general.bigPicture': 'Big Picture (Vollbild)',
    'settings.appearance.chatStyle': 'Chat-Stil:',
    'settings.appearance.theme': 'Theme:',
    'settings.appearance.appAppearance': 'App-Aussehen:',
    'settings.chatStyle.compact.name': 'Kompakt',
    'settings.chatStyle.compact.description': 'Standardstil für TikTok-Nachrichten.',
    'settings.chatStyle.spacious.name': 'Geräumig',
    'settings.chatStyle.spacious.description': 'Übersichtlichere Nachrichtenansicht.',
    'settings.chatStyle.modern.name': 'Modern',
    'settings.chatStyle.modern.description': 'Moderner Chat-Stil mit Sprechblasen.',
    'settings.theme.roseBlack.name': 'Rose Black (Standard)',
    'settings.theme.roseBlack.description': 'Standardfarben der Anwendung.',
    'settings.theme.whiteTitanium.description': 'Helles App-Design in weißem Titan.',
    'settings.theme.chillSerwis.description': 'Das entspannteste Theme der App.',
    'settings.theme.roseGlass.description': 'Ein etwas weicheres, dezentes Theme.',
    'settings.theme.lazarskieRejony.name': 'Enigma-Z',
    'settings.theme.lazarskieRejony.description': 'Halbtransparentes dunkelgrau-blaues Design mit Neon-Akzenten.',
    'settings.theme.miamiVice.name': 'Miami Vice',
    'settings.theme.miamiVice.description': 'Pastellige Miami-Farben, inspiriert von GTA Vice City.',
    'settings.theme.locked': 'Gesperrt',
    'settings.appAppearance.default.name': 'Standard',
    'settings.appAppearance.default.description': 'Aktuelles Layout von Header, Sidebar, Fenstern und Buttons.',
    'settings.appAppearance.decorative.name': 'Dekorativ',
    'settings.appAppearance.decorative.description': 'Elegantes, modernes App-Layout.',
    'settings.appAppearance.retroKb2.name': 'Retro KB2',
    'settings.appAppearance.retroKb2.description': 'Leichtes altes Blog-Layout inspiriert von K2: Header und Links statt Buttons.',
    'settings.accessibility.tts': 'Nachrichten-TTS:',
    'settings.accessibility.readAloud': 'Chat laut vorlesen',
    'settings.accessibility.skipVulgarNicknames': 'Vulgäre Nicknames überspringen',
    'settings.accessibility.skipVulgarMessages': 'Vulgäre Nachrichten überspringen',
    'settings.accessibility.skipSpamMessages': 'Spam-Nachrichten überspringen (Follow for Follow usw.)',
    'settings.accessibility.rolesOnly': 'Nur Nachrichten von Moderatoren und Superfans vorlesen',
    'settings.accessibility.rolesOnlyDescription': 'TTS liest nur Nachrichten von Personen mit rotem oder goldenem Namen vor.',
    'settings.accessibility.voice': 'Stimme',
    'settings.accessibility.systemVoice': 'System',
    'settings.accessibility.rate': 'Tempo',
    'settings.accessibility.volume': 'Lautstärke beim Vorlesen von Nachrichten',
    'settings.accessibility.delay': 'Chat-Verzögerung:',
    'settings.system.note': 'Systeminformationen und Einstellungen.',
    'settings.redeem.note': 'Gib einen Code ein, um zusätzliche Funktionen freizuschalten.',
    'settings.redeem.codeLabel': 'Aktivierungscode',
    'settings.redeem.button': 'Aktivieren',
    'settings.redeem.waiting': 'Gib einen Aktivierungscode ein.',
    'settings.redeem.unlocked': 'Code akzeptiert. Die blaue Honda-Benachrichtigung ist aktiv.',
    'settings.redeem.unlockedOllama': 'Code akzeptiert. Der lokale Ollama-Hinweis für Czester wurde freigeschaltet.',
    'settings.redeem.invalid': 'Ungültiger Code.',
    'settings.redeem.alreadyUsed': 'Dieser Code wurde bereits eingelöst.',
    'settings.system.autoLaunch': 'Czatbox TT automatisch beim Computerstart öffnen',
    'settings.system.runInBackground': 'Programm im Hintergrund starten, damit es nicht stört',
    'settings.system.minimizeToTray': 'Czatbox TT beim Klick auf X in den Infobereich minimieren',
    'settings.system.language': 'Sprache der Anwendung wählen',
    'settings.system.language.pl': 'Polnisch',
    'settings.system.language.en': 'Englisch',
    'settings.system.language.de': 'Deutsch',
    'settings.system.language.hu': 'Ungarisch',
    'settings.system.timeFormat': 'Zeitformat',
    'settings.system.timeFormat.auto': 'Automatisch (Systemzeit erkennen)',
    'settings.system.timeFormat.12': '12-Stunden',
    'settings.system.timeFormat.24': '24-Stunden',
    'settings.system.clearSessionDescription': 'Problem mit TikTok-Anmeldung oder Sitzung',
    'settings.system.clearSession': 'TikTok-Sitzung löschen',
    'settings.system.clearSessionConfirm': 'TikTok-Sitzung löschen und zum Anmeldebildschirm zurückkehren?',
    'about.title': 'Über das Programm',
    'about.tabs.program': 'Über das Programm',
    'about.tabs.news': 'Was ist neu?',
    'about.tabs.faq': 'FAQ',
    'radio.title': 'Radio',
    'radio.note': 'Höre einen ausgewählten Sender während der Arbeit mit dem Chat.',
    'radio.aria': 'Radiostationen',
    'about.tabs.aria': 'Registerkarten über das Programm',
    'about.program.p1': 'Czatbox TT ist eine Anwendung zur Bedienung des TikTok-LIVE-Chats. Sie zeigt Nachrichten aus einem ausgewählten Live in einem separaten, gut lesbaren Fenster. Die App wurde für eine bequeme Chat-Ansicht, Archivierung und zusätzliche Live-Ereignisse erstellt.',
    'about.program.p2': 'Nach der Anmeldung bei TikTok lädt das Programm den Chat des ausgewählten LIVE-Creators und zeigt ihn geordnet an. Du kannst zwischen unterstützten Creators wechseln, Ereignistypen filtern und das Aussehen anpassen.',
    'about.program.how': 'So funktioniert das Programm:',
    'about.program.how.p1': 'Nach dem Start der Anwendung meldet sich der Benutzer bei TikTok an. Sobald die Sitzung erkannt wird, wechselt die App zur Chatansicht und verbindet sich mit dem ausgewählten Live. Der Chat wird im Hintergrund geladen und als separate Ereignisliste angezeigt.',
    'about.program.how.p2': 'Chatnachrichten können mit einer festgelegten Verzögerung angezeigt werden, damit sie bei aktiven Streams leichter zu verfolgen sind. Andere Ereignisse wie Geschenke, Beitritte oder Likes können live erscheinen. Filter, Chat-Stil, Theme und Verzögerung können jederzeit geändert werden.',
    'about.program.how.p3': 'Während das Programm läuft, werden alle Stream-Ereignisse im Archiv gespeichert. Nach dem Ende oder Wechsel eines Streams kannst du das Archiv öffnen und zu früheren Gesprächen zurückkehren.',
    'about.news.version': 'Programmversion',
    'about.news.versionSuffix': '',
    'about.news.statement.title': 'Erklärung:',
    'about.news.statement.p1': `Dieses Update ist wirklich groß. Bisher habe ich vieles umgesetzt, was mehr oder weniger sinnvoll war, aber von euch gewünscht wurde. Zuerst möchte ich erklären, warum ich einige Funktionen entfernt habe. Die Idee hinter dem Programm war, Creatorn beim Wachstum zu helfen, größeren wie kleineren, und vor allem Moderation bei aktiven Communities zu erleichtern. Leider haben manche Funktionen das Programm weniger zu einem Werkzeug der Unterstützung und mehr zu einem Werkzeug zum Ausspähen anderer Creator, ihrer Einnahmen und Rankings gemacht. Das war nie meine Absicht. Ab diesem Update zeigt das Programm deshalb nur noch Statistiken des Creators, mit dem man verbunden ist. Rankings und Battle-Verläufe von Gegnern werden zurückgezogen.`,
    'about.news.statement.p2': `Ist das alles? Nein. Ich nehme ungern etwas weg, ohne etwas Sinnvolles zurückzugeben. Ich bin wie ihr ein normaler Nutzer, Moderator und Zuschauer. Nach längerer Überlegung habe ich mich entschieden, etwas einzubauen, vor dem ich mich wegen schwächerer Computer, älterer Windows-Versionen wie Windows 10 und langsamerer Internetverbindungen lange gedrückt habe. Einige Tester hatten aber recht: Das Programm sollte sich weiterentwickeln.`,
    'about.news.statement.p3': `Nach dieser Entscheidung habe ich AI in das Programm eingebaut. Sie soll helfen, Chat und Statistiken für Creator und Moderation besser zu kontrollieren, und ermöglicht mehr Personalisierung sowie besseren Informationsfluss im LIVE-Chat. Wie funktioniert das? Nach Eingabe eines speziellen Codes unter Einstellungen → Code einlösen wird die AI-Option freigeschaltet. Danach kann das Programm Ollama herunterladen, das über 1 GB benötigt, und anschließend eine Aktualisierung in ähnlicher Größe durchführen. Diese Funktion ist optional. Das Programm funktioniert weiterhin ohne sie, aber nach der Aktivierung verändert sich Czester deutlich und wird operativ nützlicher. Wenn du es testen möchtest, gib den AI-Code ein: 19BM 9ARV 9IN1 K4M4.`,
    'about.news.changes.title': 'Änderungen:',
    'about.news.changes.removeRanking': 'System zum Lesen von Schatzkisten während LIVE-Streams hinzugefügt - Unterstützung für wachsende LIVE-Räume.',
    'about.news.changes.ai': 'Menü optimiert - mehrere Funktionen wurden ständig aktualisiert und machten das Programm mit der Zeit langsamer.',
    'about.news.changes.codes': 'Der Bereich Über das Programm wurde aufgefrischt.',
    'about.news.changes.multiplier': 'Fehler im App-Aussehen Retro KB2 wurden behoben.',
    'about.news.changes.optimization': '',
    'about.news.changes.radio': 'Radio hinzugefügt.',
    'about.news.changes.viceCity': '',
    'about.news.024.layout': 'Das Erscheinungsbild der Anwendung wurde überarbeitet',
    'about.news.024.launcher': 'Launcher mit Fenstern am unteren Rand hinzugefügt',
    'about.news.024.archives': 'Automatische Bereinigung von Archiven älter als 7 Tage hinzugefügt.',
    'about.news.024.ttsVolume': 'Lautstärkeregelung für das Vorlesen von TTS-Nachrichten hinzugefügt.',
    'about.news.024.icon': 'Neues Programmsymbol.',
    'about.news.024.bigPicture': 'Big Picture wurde hinzugefügt.',
    'about.news.024.about': 'Der Bereich Über das Programm wurde aktualisiert.',
    'about.news.next.ai': 'Weitere AI-Funktionen im Programm.',
    'about.news.intro': 'Czatbox TT ist eine Anwendung zur Bedienung des TikTok-LIVE-Chats. Sie zeigt Nachrichten aus einem ausgewählten Live in einem separaten, gut lesbaren Fenster. Die App wurde für eine bequeme Chat-Ansicht, Archivierung und zusätzliche Live-Ereignisse erstellt.',
    'about.news.features.title': 'Hauptfunktionen:',
    'about.news.features.achievements': 'ein Erfolgssystem wurde hinzugefügt, sichtbar im Tab „Erfolge“',
    'about.news.features.redeemCode': 'der Tab „Code einlösen“ wurde in den Einstellungen hinzugefügt',
    'about.news.features.retroKb2': 'App-Aussehen: Retro KB2, eine entlastete Lite-Version des Programms',
    'about.news.features.desktopWidgetsRemoved': 'Desktop-Widgets und das Anheften über anderen Fenstern wurden entfernt. Diese Mechanik war stark fehleranfällig und belastete die App zusätzlich. In Kombination mit schwereren Themes sank die Nutzungsqualität auf schwächeren Computern. Das war nicht das Ziel; Qualität ist wichtiger, deshalb wird diese Funktion in der aktuellen Version ausgesetzt.',
    'about.news.features.topTappers': 'ein neues Widget für das Ranking der Tapper wurde hinzugefügt.',
    'about.news.features.events': 'Anzeige von TikTok-LIVE-Chatnachrichten mit Filtern für Nachrichten, Likes, Geschenke, Beitritte, Reposts, Teilen, Boxen und Portale',
    'about.news.features.moderators': 'Moderatoren werden mit einem roten Nickname hervorgehoben',
    'about.news.features.avatars': 'zufällige Benutzeravatare aus dem lokalen Bilderpool der App, um während des Streams möglichst wenig Daten zu laden',
    'about.news.features.multiplier': 'Informationsleiste für Multiplikatoren während eines Battles',
    'about.news.features.tts': 'Vorlesen von Chatnachrichten per TTS',
    'about.news.features.archive': 'Archivierung des gesamten Stream-Chats in einer Datei',
    'about.news.features.styles': 'verschiedene Chat-Stile: Kompakt, Geräumig und Modern',
    'about.news.features.themes': 'verschiedene Farbthemen der Anwendung',
    'about.news.features.appearances': 'verschiedene App-Layouts: Standard, Dekorativ und Retro KB2',
    'about.news.features.delay': 'einstellbare Verzögerung für Chatnachrichten',
    'about.news.features.stats': 'LIVE-Statistik-Werkzeugleiste',
    'about.news.features.widgets': 'die Live-Werkzeugleiste wurde durch Widgets ersetzt. Ab jetzt kannst du Online-Moderation, Statistiken und die Top 5 Geschenkgeber sehen',
    'about.news.features.flexibleWidgets': 'alle Widgets in der App sind flexibel: du kannst sie nach Bedarf ausblenden und anzeigen',
    'about.news.features.archiveCenter': 'verbessertes und erweitertes Archivzentrum für Live-Chats mit Filtern und Zusammenfassungen zu Ereignissen, Chatnachrichten, Münzen und während der Sitzung aktiven Moderatoren',
    'about.news.features.archiveActions': 'Archive können als *.txt exportiert, gelöscht und aktualisiert werden.',
    'about.news.features.languages': 'Polnisch, Englisch und Deutsch als App-Sprachen',
    'about.news.fixes.title': 'Korrekturen:',
    'about.news.fixes.recentCreators': 'die letzten Creator wurden korrigiert und ihre richtige Anzeige außerhalb von Retro KB2 wiederhergestellt',
    'about.news.fixes.box': 'die Nachricht zur Münzbox wurde korrigiert, wenn beim Öffnen im Chat „unknow sendet eine Box“ erscheinen konnte',
    'about.news.fixes.optimization': 'Optimierung der Programmleistung',
    'about.news.known.title': 'Bekannte Fehler:',
    'about.news.known.box': 'nach dem Öffnen einer Münzbox kann gelegentlich die Nachricht „unknow sendet eine Box“ im Chat erscheinen',
    'about.news.known.multiplier': 'Battle-Multiplikatoren bleiben eine Testfunktion und können gegen Ende eines Battles gelegentlich fälschlich erscheinen',
    'about.news.next.title': 'Wie geht es weiter:',
    'about.news.next.archive': 'Verbesserungen beim Lesen archivierter Chats. Ehrlich gesagt bin ich mit der aktuellen Version nicht zufrieden und sie muss überarbeitet werden.',
    'about.news.next.fixes': 'Sounds für Gifts ab xxx Münzwert.',
    'about.news.next.widgets': 'Ausbau des Widget-Systems',
    'about.news.next.ttsLanguages': 'zusätzliche Sprachen für das Vorlesen des Chats per TTS',
    'about.news.next.superFans': 'Hervorhebung von Superfans im Chat',
    'about.news.next.achievements': 'Ausbau der Erfolge.',
    'about.news.next.redeemCodes': 'Hinzufügen weiterer Aktivierungscodes',
    'about.news.next.specialNotifications': 'weitere Bereinigung von Sonderfunktionen und Benachrichtigungen',
    'about.news.next.connection': 'Optimierung der Verbindungsstabilität zum Creator',
    'about.news.next.giftSounds': 'Tonbenachrichtigungen für größere Geschenke',
    'about.faq.title': 'FAQ',
    'about.faq.idea.question': 'Wie entstand die Idee für die Anwendung?',
    'about.faq.idea.answer': 'Hauptsächlich wegen des fehlerhaften TikTok-Chats, der alles auf einmal anzeigt und Inhalte schnell verschwinden lässt. Die Idee kam mir beim Moderieren des Chats von Kama (@teambibii), die ich herzlich grüße.',
    'about.faq.systems.question': 'Ist das Programm nur für Windows?',
    'about.faq.systems.answer': 'Ja. Das Programm ist nur für Windows. Ich plane nicht, es auf andere Plattformen oder Systeme zu erweitern - aus Kostengründen. Ich verlange kein Geld dafür, und es enthält viele Funktionen, die in anderen Programmen kostenpflichtig sind. Freuen wir uns also, dass überhaupt etwas entstanden ist...',
    'about.faq.support.question': 'Kann ich dich irgendwie unterstützen?',
    'about.faq.support.answer': 'Ich würde sagen, du kannst mir eine brutale Margherita-Pizza oder einen Energy-Drink spendieren, aber ich brauche keine Unterstützung. Wenn du dich revanchieren möchtest, klicke auf den Tab Coins und nutze meinen Empfehlungslink.',
    'about.faq.future.question': 'Plane ich, das Projekt weiterzuentwickeln?',
    'about.faq.future.answer': 'Steter Tropfen höhlt den Stein, und die Zeit wird es zeigen. Leben wir nicht von dem, was gestern war, sondern von dem, was morgen kommt, und morgen ist schon heute. Klingt ziemlich rätselhaft...',
    'about.faq.codes.question': 'Woher bekomme ich Codes für Code einlösen?',
    'about.faq.codes.answer': 'Codes verbergen meistens Funktionen für Tester oder kleine Geschenke für Unterstützung. Offiziell gibt es einen öffentlichen Code, der Czesters Gehirn herunterlädt, damit er analysieren kann, was im Chat passiert: 19BM 9ARV 9IN1 K4M4. Sagen wir, ich habe gute Laune, und schlechte Laune habe ich selten, also bekommt ihr etwas Nützliches für wachsende LIVE-Streams: 1THU 3GS6 TO7O L6S2. Wenn in Zukunft weitere Codes erscheinen, werden sie wahrscheinlich Belohnungen für aktive Mitglieder von Kamas Community sein. Es lohnt sich also, ihr zu folgen und sie zu unterstützen.',
    'about.faq.magic.question': 'Gibt es einen geheimen, magischen Code?',
    'about.faq.magic.answer': 'Es gibt keine magischen Codes. Es gibt nur einen Entwicklermodus, in dem ich neue Funktionen hinzufüge und manchmal hinter einem Code verstecke, damit Tester sie prüfen können, bevor alle sie erhalten.',
    'statsWidget.title': 'LIVE-Statistiken',
    'statsWidget.viewers': 'Personen im Chat',
    'statsWidget.messages': 'Gesendete Nachrichten',
    'statsWidget.activeHearts': 'Heart Me gesendet',
    'statsWidget.inactiveHearts': 'Heart Me nicht gesendet',
    'statsWidget.dock': 'LIVE-Werkzeuge',
    'statsWidget.expand': 'LIVE-Statistiken öffnen',
    'statsWidget.collapse': 'LIVE-Statistiken schließen',
    'topGifters.title': 'Top-Geschenkgeber',
    'topGifters.expand': 'Top-Geschenkgeber öffnen',
    'topGifters.collapse': 'Top-Geschenkgeber schließen',
    'topTappers.title': 'Top-Taps',
    'topTappers.empty': 'Keine LIVE-Likes seit dem Beitritt zum Stream.',
    'topTappers.expand': 'Top-Taps öffnen',
    'topTappers.collapse': 'Top-Taps schließen',
    'moderatorsWidget.title': 'Aktive Moderatoren',
    'moderatorsWidget.empty': 'Keine aktiven Moderatoren in den letzten 5 Minuten.',
    'moderatorsWidget.expand': 'Aktive Moderatoren öffnen',
    'moderatorsWidget.collapse': 'Aktive Moderatoren schließen',
    'battle.stage.battle': 'BATTLE LÄUFT',
    'battle.stage.multiplier': 'MULTIPLIKATOR X{multiplier}',
    'battle.stage.mission': 'BONUSMISSION {progress}/{target}',
    'battle.stage.missionSuccess': 'MISSION ERFÜLLT — MULTIPLIKATOR X{multiplier}',
    'battle.stage.booster': 'BOOSTER AKTIV',
    'battle.stage.finished': 'BATTLE BEENDET',
    'battle.stage.cancelled': 'BATTLE ABGEBROCHEN',
    'battle.stage.score': '{left} {leftScore} : {rightScore} {right}',
    'battle.stage.winner': 'Gewinner: {name}',
    'battle.stage.missionBy': 'Ziel: {names}',
    'battle.stage.rewards': 'Belohnungen: {rewards}',
    'status.connecting': 'Verbinde...',
    'status.online': 'Online',
    'status.offline': 'Offline',
    'status.reconnecting': 'Erneuter Versuch...',
    'status.rateLimited': 'Verbindungslimit',
    'status.error': 'Verbindungsfehler',
    'chat.empty': 'Nach der Anmeldung erscheint hier der verzögerte LIVE-Chat.',
    'archive.loading': 'Archiv wird geladen...',
    'archive.loadFailed': 'Archiv konnte nicht gelesen werden.',
    'archive.loadFailedWithError': 'Archiv konnte nicht gelesen werden: {error}',
    'archive.empty': 'Keine gespeicherten Archive.',
    'archive.defaultName': 'Archiv',
    'archive.refreshing': 'Archiv wird aktualisiert...',
    'archive.listFailed': 'Archivliste konnte nicht gelesen werden: {error}',
    'archive.noMatches': 'Keine Archive entsprechen der Suche.',
    'archive.filteredEmpty': 'Keine Ereignisse entsprechen den ausgewählten Filtern.',
    'archive.legacy': 'Altes TXT-Format',
    'archive.deleteConfirm': 'Archiv „{name}“ löschen? Dies kann nicht rückgängig gemacht werden.',
    'archive.deleteFailed': 'Archiv konnte nicht gelöscht werden.',
    'archive.activeDeleteFailed': 'Der aktuell gespeicherte Stream kann nicht gelöscht werden.',
    'archive.exported': 'Archiv wurde exportiert.',
    'archive.exportFailed': 'Archiv konnte nicht exportiert werden.',
    'archive.folderFailed': 'Archivordner konnte nicht geöffnet werden.',
    'topGifters.empty': 'Keine Gifts seit dem Beitritt zum Stream.',
    'event.member.join': 'ist dem LIVE beigetreten',
    'event.gift': 'hat ein Geschenk gesendet: {giftName}{countText}{costText}',
    'event.box': 'sendet {boxName}{costText}{audienceText}',
    'event.box.chest': 'eine Box',
    'event.box.portal': 'ein Portal',
    'event.audience': ' für (👥 {count})',
    'event.like': 'hat den LIVE geliked (insgesamt {total} Likes)',
    'event.repost': '🔁 hat den Live repostet',
    'event.share': '↩️ teilt den LIVE',
    'battle.multiplier': 'BATTLE: GLEICH MULTIPLIKATOR X{multiplier}',
    'battle.effectAlert': '{effect}: {name}',
    'battle.finished': 'Battle beendet',
    'battle.cancelled': 'Das Battle wurde abgebrochen',
    'czester.notice.multiplier': 'Achtung, gleich kommt im Battle Multiplikator x{multiplier}.',
    'czester.notice.creatorFreeze': 'Der Creator wurde eingefroren.',
    'czester.battle.start': 'Battle gestartet: {fighters}.',
    'czester.battle.score': 'Aktueller Battle-Stand: {score}.',
    'czester.battle.finished': 'Battle beendet: {score}.',
    'czester.battle.cancelled': 'Das Battle wurde abgebrochen.',
    'czester.battle.missionStart': 'Battle-Mission gestartet: {detail} Ziel: {target}. Belohnung: Multiplikator x{multiplier}.',
    'czester.battle.missionProgress': '{actor} hat die Mission vorangebracht: {progress}/{target}.',
    'czester.battle.missionSuccess': 'Battle-Mission abgeschlossen. Belohnung kommt: Multiplikator x{multiplier}.',
    'czester.battle.missionFailed': 'Die Battle-Mission wurde nicht abgeschlossen.',
    'czester.battle.missionReward': 'Die Missionsbelohnung wurde verrechnet.',
    'czester.battle.effect': 'Battle-Effekt: {effect}{actor}{targets}.',
    'czester.battle.booster': 'Battle-Booster erschienen: {effect}.',
    'battle.effect.freeze': 'Freeze',
    'battle.effect.glove': 'Handschuhe',
    'battle.effect.fog': 'Nebel',
    'battle.effect.hammer': 'Hammer',
    'battle.effect.shield': 'Schild',
    'battle.effect.critical': 'Kritischer Treffer',
    'battle.effect.top2': 'Top 2',
    'battle.effect.top3': 'Top 3',
    'battle.effect.boost': 'Boost',
    'battle.effect.effect': 'Effekt'
  }
};

// Hungarian uses the complete English dictionary as a safe fallback while
// the common application chrome and settings use native Hungarian labels.
I18N.hu = {
  ...I18N.en,
  'recentCreators.delete': 'Alkotó eltávolítása a listáról',
  'settings.title': 'Beállítások',
  'settings.subtitle': 'Az alkalmazás működésének és megjelenésének beállítása.',
  'settings.reset': 'Alapértelmezések visszaállítása',
  'app.tagline': '\u00c9l\u0151 chat k\u00f6vet\u00e9se \u00e9s kezel\u00e9se val\u00f3s id\u0151ben.',
  'app.tagline': 'Élő chat követése és kezelése valós időben.',
  'nav.chatbox': 'Chatbox',
  'nav.archive': 'Archívum',
  'nav.boxes': 'Ládák',
  'nav.about': 'A programról',
  'filters.chat': 'Csevegés',
  'filters.like': 'Kedvelések',
  'filters.gift': 'Ajándékok',
  'filters.box': 'Ládák',
  'filters.repost': 'Újraküldések',
  'filters.share': 'Megosztások',
  'filters.member': 'Csatlakozások',
  'nav.archive': 'Archívum',
  'nav.boxes': 'Ládák',
  'nav.about': 'A programról',
  'nav.settings': 'Beállítások',
  'settings.tabs.general': 'Chat és archívumok',
  'settings.tabs.appearance': 'Megjelenés',
  'settings.tabs.accessibility': 'Hang',
  'settings.tabs.system': 'Rendszer',
  'settings.tabs.redeem': 'Kódok',
  'settings.general.note': 'A chat, az archívumok és a Big Picture beállításai.',
  'settings.general.deleteOldArchives': '7 napnál régebbi archívumok törlése',
  'settings.general.bigPicture': 'Big Picture (teljes képernyő)',
  'settings.accessibility.readAloud': 'Chat felolvasása',
  'settings.accessibility.volume': 'Az üzenetek felolvasási hangereje',
  'settings.system.language': 'Program nyelve',
  'settings.system.language.hu': 'Magyar',
  'radio.title': 'Rádió',
  'radio.note': 'Hallgasd a kiválasztott állomást chatelés közben.',
  'notes.title': 'Jegyzetek',
  'coins.title': 'Érmék',
  'achievements.title': 'Eredmények',
  'czester.title': 'Czester asszisztens',
  'about.tabs.program': 'A programról',
  'about.tabs.news': 'Újdonságok',
  'about.tabs.faq': 'GYIK',
  'about.news.version': 'Programverzió',
  'about.news.changes.title': 'Változások:',
  'about.faq.title': 'GYIK',
  'settings.general.multiplierNotifications': 'Szorzó értesítések',
  'settings.general.statsToolbox': 'Statisztikai eszköztár',
  'settings.general.galleryAvatars': 'Avatargaléria',
  'settings.appearance.chatStyle': 'Csevegési stílus',
  'settings.appearance.theme': 'Téma',
  'settings.appearance.appAppearance': 'Alkalmazás megjelenése',
  'settings.chatStyle.compact.name': 'Kompakt',
  'settings.chatStyle.compact.description': 'Alapértelmezett TikTok-üzenetstílus.',
  'settings.chatStyle.spacious.name': 'Tágas',
  'settings.chatStyle.spacious.description': 'Átláthatóbb üzenet-elrendezés.',
  'settings.chatStyle.modern.name': 'Modern',
  'settings.chatStyle.modern.description': 'Modern, buborékos csevegési stílus.',
  'settings.theme.roseBlack.description': 'Az alkalmazás alapértelmezett színei.',
  'settings.theme.whiteTitanium.description': 'Világos megjelenés fehér titán árnyalatokkal.',
  'settings.theme.chillSerwis.description': 'Nyugodt, laza megjelenés.',
  'settings.theme.roseGlass.description': 'Lágyabb, finomabb téma.',
  'settings.theme.lazarskieRejony.description': 'Félig átlátszó, sötétszürke-kék stílus neon kiemelésekkel.',
  'settings.theme.miamiVice.description': 'Pasztell Miami-színek a GTA Vice City hangulatában.',
  'settings.appAppearance.default.description': 'A fejléc, az oldalsáv, az ablakok és a gombok jelenlegi elrendezése.',
  'settings.appAppearance.decorative.description': 'Elegáns, modern alkalmazáselrendezés.',
  'settings.appAppearance.retroKb2.description': 'Könnyű, régi blogos K2-elrendezés.',
  'settings.accessibility.tts': 'Üzenetek felolvasása',
  'settings.accessibility.skipVulgarNicknames': 'Trágár becenevek kihagyása',
  'settings.accessibility.skipVulgarMessages': 'Trágár üzenetek kihagyása',
  'settings.accessibility.skipSpamMessages': 'Spamüzenetek kihagyása',
  'settings.accessibility.rolesOnly': 'Csak moderátorok és szuperrajongók üzeneteinek felolvasása',
  'settings.accessibility.rolesOnlyDescription': 'A TTS csak a piros vagy arany nevű személyek üzeneteit olvassa fel.',
  'settings.accessibility.voice': 'Hang',
  'settings.accessibility.rate': 'Sebesség',
  'settings.accessibility.delay': 'Csevegés késleltetése',
  'settings.system.note': 'Rendszerinformációk és beállítások.',
  'settings.system.autoLaunch': 'A Czatbox TT automatikus megnyitása a számítógép indításakor',
  'settings.system.runInBackground': 'A program indítása a háttérben',
  'settings.system.minimizeToTray': 'A Czatbox TT minimalizálása a tálcára az X megnyomásakor',
  'settings.system.timeFormat': 'Időformátum',
  'settings.system.clearSessionDescription': 'TikTok-bejelentkezési vagy munkamenet-probléma',
  'settings.system.clearSession': 'TikTok-munkamenet törlése',
  'settings.system.language.pl': 'Lengyel',
  'settings.system.language.en': 'Angol',
  'settings.system.language.de': 'Német',
  'settings.system.timeFormat.auto': 'Automatikus (rendszeridő)',
  'settings.system.timeFormat.12': '12 órás',
  'settings.system.timeFormat.24': '24 órás',
  'settings.redeem.note': 'Adj meg egy kódot további funkciók feloldásához.',
  'settings.redeem.codeLabel': 'Aktiváló kód',
  'about.program.p1': 'A Czatbox TT egy TikTok LIVE-csevegés kezelésére szolgáló alkalmazás. A kiválasztott élő adás üzeneteit külön, jól olvasható ablakban jeleníti meg.',
  'about.program.p2': 'A TikTokba való bejelentkezés után a program betölti a kiválasztott LIVE-készítő csevegését, és rendezett formában jeleníti meg. Szűrheted az eseménytípusokat és testre szabhatod a megjelenést.',
  'about.program.how': 'Hogyan működik a program:',
  'about.program.how.p1': 'Indítás után a felhasználó bejelentkezik a TikTokba. A munkamenet felismerésekor az alkalmazás csatlakozik a kiválasztott élő adáshoz, és a csevegést eseménylistaként tölti be.',
  'about.program.how.p2': 'Az üzenetek beállított késleltetéssel jeleníthetők meg. Az ajándékok, csatlakozások és kedvelések valós időben érkezhetnek. A szűrő, a stílus, a téma és a késleltetés bármikor módosítható.',
  'about.program.how.p3': 'A program működése közben minden adásesemény archiválódik. Az adás lezárása vagy váltása után az Archívum lapon visszatérhetsz a korábbi beszélgetésekhez.',
  'about.news.024.layout': 'Az alkalmazás megjelenésének áttervezése',
  'about.news.024.launcher': 'Alsó indítópanel ablakokkal',
  'about.news.024.archives': 'A 7 napnál régebbi archívumok automatikus törlése.',
  'about.news.024.ttsVolume': 'A TTS-felolvasás hangerejének beállítása.',
  'about.news.024.icon': 'Új alkalmazásikon.',
  'about.news.024.bigPicture': 'Big Picture mód bevezetése.',
  'about.news.024.about': 'Az A programról lap frissítése.',
  'settings.title': 'Beállítások',
  'settings.subtitle': 'Az alkalmazás működésének és megjelenésének beállítása.',
  'settings.reset': 'Alapértelmezések visszaállítása',
  'nav.archive': 'Archívum',
  'nav.boxes': 'Ládák',
  'nav.about': 'A programról',
  'filters.chat': 'Csevegés',
  'filters.like': 'Kedvelések',
  'filters.gift': 'Ajándékok',
  'filters.box': 'Ládák',
  'filters.repost': 'Újraküldések',
  'filters.share': 'Megosztások',
  'filters.member': 'Csatlakozások',
  'about.title': 'A programról',
  'about.tabs.aria': 'A program lapjai'
};

// Keep the Big Picture quiet-mode label translated in every supported locale.
I18N.pl['settings.general.quietMode'] = 'Tryb cichy (wycisz powiadomienia Windows)';
I18N.en['settings.general.quietMode'] = 'Quiet mode (mute Windows notifications)';
I18N.de['settings.general.quietMode'] = 'Ruhemodus (Windows-Benachrichtigungen stummschalten)';
I18N.hu['settings.general.quietMode'] = 'Csendes mód (Windows-értesítések némítása)';
I18N.hu['creator.panelTitle'] = 'Alkotók';
I18N.hu['creator.panelNote'] = 'Válassz alkotót, vagy keress élő adást.';
I18N.hu['statsWidget.title'] = 'Élő statisztikák';
I18N.hu['statsWidget.viewers'] = 'Nézők a csevegésben';
I18N.hu['statsWidget.messages'] = 'Elküldött üzenetek';
I18N.hu['statsWidget.activeHearts'] = 'Elküldött szívek';
I18N.hu['statsWidget.inactiveHearts'] = 'El nem küldött szívek';
I18N.hu['statsWidget.dock'] = 'Élő eszközök';
I18N.hu['statsWidget.expand'] = 'Élő statisztikák megnyitása';
I18N.hu['statsWidget.collapse'] = 'Élő statisztikák bezárása';
I18N.hu['status.online'] = 'Online';
I18N.hu['status.offline'] = 'Offline';
I18N.hu['event.member.join'] = 'csatlakozott az élő adáshoz';
I18N.hu['event.gift'] = 'ajándékot küldött: {giftName}{countText}{costText}';
I18N.hu['event.like'] = 'kedvelte az élő adást (összesen {total} kedvelés)';
I18N.hu['event.share'] = '↩️ megosztotta az élő adást';
I18N.pl['settings.redeem.unlockedTalarki'] = 'Kod developerski przyjęty. Dodano 50000 Talarków.';
I18N.en['settings.redeem.unlockedTalarki'] = 'Developer code accepted. 50,000 Talarki added.';
I18N.de['settings.redeem.unlockedTalarki'] = 'Entwicklercode akzeptiert. 50.000 Talarki wurden hinzugefügt.';
I18N.hu['settings.redeem.unlockedTalarki'] = 'Fejlesztői kód elfogadva. 50 000 Talarki hozzáadva.';
I18N.pl['creator.panelTitle'] = 'Twórcy';
I18N.pl['creator.panelNote'] = 'Wybierz twórcę lub wyszukaj transmisję.';
I18N.en['creator.panelTitle'] = 'Creators';
I18N.en['creator.panelNote'] = 'Choose a creator or search for a live stream.';
I18N.de['creator.panelTitle'] = 'Creator';
I18N.de['creator.panelNote'] = 'Wähle einen Creator oder suche nach einem Live.';
I18N.pl['economy.talarki'] = 'Talarki'; I18N.pl['shop.title'] = 'Sklep'; I18N.pl['shop.note'] = 'Wymieniaj Talarki na dodatki do programu.'; I18N.pl['shop.themes'] = 'Motywy'; I18N.pl['shop.other'] = 'Inne';
I18N.en['economy.talarki'] = 'Talarki'; I18N.en['shop.title'] = 'Shop'; I18N.en['shop.note'] = 'Exchange Talarki for application extras.'; I18N.en['shop.themes'] = 'Themes'; I18N.en['shop.other'] = 'Other';
I18N.de['economy.talarki'] = 'Talarki'; I18N.de['shop.title'] = 'Shop'; I18N.de['shop.note'] = 'Tausche Talarki gegen Extras.'; I18N.de['shop.themes'] = 'Themes'; I18N.de['shop.other'] = 'Sonstiges';
I18N.hu['economy.talarki'] = 'Talarki'; I18N.hu['shop.title'] = 'Bolt'; I18N.hu['shop.note'] = 'Váltsd be a Talarkit alkalmazáskiegészítőkre.'; I18N.hu['shop.themes'] = 'Témák'; I18N.hu['shop.other'] = 'Egyéb';
I18N.pl['talarki.title'] = 'Talarki'; I18N.pl['talarki.description'] = 'Wewnętrzny system ekonomii, który wprowadza nagrody za używanie programu.'; I18N.pl['talarki.rewards'] = 'Za zdobywane osiągnięcia otrzymujemy Talarki, które możemy wykorzystać na motywy i inne dodatki w sklepie. Za każdą minutę z połączonym twórcą dostajemy jedną monetkę, a w trybie Big Picture — dwie.';
I18N.en['talarki.title'] = 'Talarki'; I18N.en['talarki.description'] = 'An internal economy system that rewards active use of the program.'; I18N.en['talarki.rewards'] = 'Achievements reward Talarki, which can be exchanged for themes and other extras in the shop. You earn one coin per minute connected to a creator, or two coins per minute in Big Picture mode.';
I18N.de['talarki.title'] = 'Talarki'; I18N.de['talarki.description'] = 'Ein internes Wirtschaftssystem, das die Nutzung des Programms belohnt.'; I18N.de['talarki.rewards'] = 'Für Erfolge erhalten wir Talarki, die wir im Shop gegen Themes und andere Extras eintauschen können. Pro Minute mit einem verbundenen Creator gibt es eine Münze, im Big-Picture-Modus zwei.';
I18N.hu['talarki.title'] = 'Talarki'; I18N.hu['talarki.description'] = 'Belső gazdasági rendszer, amely jutalmazza a program használatát.'; I18N.hu['talarki.rewards'] = 'A teljesítményekért Talarkit kapunk, amelyeket a boltban témákra és más extrákra válthatunk. A csatlakoztatott alkotóval töltött minden percért egy, Big Picture módban két érmét kapsz.';
I18N.pl['settings.theme.dzikaGalaktyka.name'] = 'Dzika galaktyka'; I18N.pl['settings.theme.dzikaGalaktyka.description'] = 'Galaktyczne odcienie, efekty mgławicy i estetyka Frutiger Aero.';
I18N.en['settings.theme.dzikaGalaktyka.name'] = 'Wild Galaxy'; I18N.en['settings.theme.dzikaGalaktyka.description'] = 'Galaxy tones, nebula effects and Frutiger Aero aesthetics.';
I18N.de['settings.theme.dzikaGalaktyka.name'] = 'Wilde Galaxie'; I18N.de['settings.theme.dzikaGalaktyka.description'] = 'Galaktische Farben, Nebeleffekte und Frutiger-Aero-Ästhetik.';
I18N.hu['settings.theme.dzikaGalaktyka.name'] = 'Vad galaxis'; I18N.hu['settings.theme.dzikaGalaktyka.description'] = 'Galaktikus árnyalatok, ködhatások és Frutiger Aero esztétika.';
I18N.pl['settings.theme.swiatBrikersa.name'] = 'Świat Brikersa'; I18N.pl['settings.theme.swiatBrikersa.description'] = 'Pikselowy, zielony motyw inspirowany światem gry Brikers.';
I18N.en['settings.theme.swiatBrikersa.name'] = "Brikers' World"; I18N.en['settings.theme.swiatBrikersa.description'] = 'A pixel-art green theme inspired by the Brikers game world.';
I18N.de['settings.theme.swiatBrikersa.name'] = 'Brikers Welt'; I18N.de['settings.theme.swiatBrikersa.description'] = 'Ein grünes Pixelmotiv, inspiriert von der Spielwelt von Brikers.';
I18N.hu['settings.theme.swiatBrikersa.name'] = 'Brikers világa'; I18N.hu['settings.theme.swiatBrikersa.description'] = 'A Brikers játék világából ihletett zöld pixelgrafikus téma.';
I18N.pl['achievements.trueFriend.title'] = 'Prawdziwy przyjaciel'; I18N.pl['achievements.trueFriend.description'] = 'Kup grę Tamagotchi z Brikersem.';
I18N.pl['achievements.telegraphist.title'] = 'Telegrafista'; I18N.pl['achievements.telegraphist.description'] = 'Włącz radio i słuchaj go przez 20 minut.';
I18N.en['achievements.trueFriend.title'] = 'True Friend'; I18N.en['achievements.trueFriend.description'] = 'Buy the Brikers Tamagotchi game.';
I18N.en['achievements.telegraphist.title'] = 'Telegraphist'; I18N.en['achievements.telegraphist.description'] = 'Turn on the radio and listen for 20 minutes.';
I18N.de['achievements.trueFriend.title'] = 'Wahrer Freund'; I18N.de['achievements.trueFriend.description'] = 'Kaufe das Tamagotchi-Spiel mit Brikers.';
I18N.de['achievements.telegraphist.title'] = 'Telegrafist'; I18N.de['achievements.telegraphist.description'] = 'Schalte das Radio ein und höre 20 Minuten lang zu.';
I18N.hu['achievements.trueFriend.title'] = 'Igazi barát'; I18N.hu['achievements.trueFriend.description'] = 'Vásárold meg a Brikers Tamagotchi játékot.';
I18N.hu['achievements.telegraphist.title'] = 'Távírász'; I18N.hu['achievements.telegraphist.description'] = 'Kapcsold be a rádiót, és hallgasd 20 percig.';
I18N.pl['about.news.025.creators'] = 'Od teraz zapamiętani twórcy i łączenie się są w dolnym pasku launchera.';
I18N.pl['about.news.025.bigPicture'] = 'Poprawiono Big Picture — krawędzie ramek nie wyglądają już jak poszarpane.';
I18N.pl['about.news.025.hungarian'] = 'Dodano język węgierski.';
I18N.pl['about.news.025.translations'] = 'Poprawiono tłumaczenia na inne języki.';
I18N.pl['about.news.025.widgets'] = 'Poprawiono błąd z przycinkami widgetów przy zmianie na tryb Big Picture.';
I18N.en['about.news.025.creators'] = 'Saved creators and connections are now available in the bottom launcher bar.';
I18N.en['about.news.025.bigPicture'] = 'Improved Big Picture: frame edges no longer look jagged.';
I18N.en['about.news.025.hungarian'] = 'Added Hungarian language support.';
I18N.en['about.news.025.translations'] = 'Improved translations for other languages.';
I18N.en['about.news.025.widgets'] = 'Fixed widget stutters when switching to Big Picture mode.';
I18N.de['about.news.025.creators'] = 'Gespeicherte Creator und Verbindungen sind jetzt in der unteren Launcherleiste verfügbar.';
I18N.de['about.news.025.bigPicture'] = 'Big Picture verbessert: Rahmenecken wirken nicht mehr ausgefranst.';
I18N.de['about.news.025.hungarian'] = 'Ungarische Sprache hinzugefügt.';
I18N.de['about.news.025.translations'] = 'Übersetzungen für weitere Sprachen verbessert.';
I18N.de['about.news.025.widgets'] = 'Widget-Ruckler beim Wechsel in den Big-Picture-Modus behoben.';
I18N.hu['about.news.025.creators'] = 'A mentett alkotók és a csatlakozások most az alsó launcherben érhetők el.';
I18N.hu['about.news.025.bigPicture'] = 'A Big Picture mód javítva: a keretek szélei már nem recések.';
I18N.hu['about.news.025.hungarian'] = 'Magyar nyelv hozzáadva.';
I18N.hu['about.news.025.translations'] = 'A többi nyelv fordításai javítva.';
I18N.hu['about.news.025.widgets'] = 'Javítva a widgetek akadozása Big Picture módra váltáskor.';

Object.assign(I18N.pl, {
  'about.news.next.title': 'Co dalej?',
  'about.news.026.intro': 'Tym razem aktualizacja jest naprawdę potężna, od systemu ekonomii i sklepu z motywami i grami, po poprawki tłumaczeń. Starałem się zawrzeć większość sugestii z ostatnich 2 tygodni. Mam nadzieję, że sprostałem - jeżeli tak poleć program dalej swoim znajomym - dziękuję!',
  'about.news.026.economy': 'System Talarków i nagrody za osiągnięcia oraz aktywność na LIVE.',
  'about.news.026.shop': 'Sklep z podglądem i kupowaniem motywów.',
  'about.news.026.themes': 'Motywy Miami Vice i Dzika galaktyka.',
  'about.news.026.brickers': 'Możliwość kupienia gry Brikers za 1500 Talarków.',
  'about.news.026.piper': 'Dwa wbudowane głosy Piper: Halina i Mr. Drwina.',
  'about.news.026.tts': 'Poprawione filtrowanie tekstu TTS.',
  'about.news.026.viewers': 'Panel aktywnych widzów LIVE.',
  'about.news.026.avatars': 'Pamięć awatarów oraz awatar Enigmy jako zapasowy.',
  'about.news.026.favorites': 'Mechanika ulubionych twórców.',
  'about.news.026.savedCreators': 'Rozszerzona lista zapamiętanych twórców.',
  'about.news.026.settingsDescriptions': 'Opisy funkcji w ustawieniach.',
  'about.news.026.launcher': 'Poprawki skalowania i wyglądu okien launchera.',
  'about.news.026.bigPicture': 'Poprawki Big Picture.',
  'about.news.026.updater': 'Poprawki powiadomień aktualizatora.',
  'about.news.026.stats': 'Poprawki liczenia TAPEK oraz udostępnień.',
  'about.news.026.roles': 'Oznaczenia moderatorów i superfanów przy nickach.',
  'about.news.026.polish': 'Liczne poprawki tłumaczeń, układu, ramek i responsywności.',
  'about.news.026.next': 'To tajemnicza tajemnica!'
});

Object.assign(I18N.en, {
  'about.news.next.title': 'What comes next?',
  'about.news.026.intro': 'This update is truly huge: from the economy system and a shop with themes and games to translation improvements. I tried to include most suggestions from the last two weeks. I hope I delivered — if so, please recommend the program to your friends. Thank you!',
  'about.news.026.economy': 'Talarki economy with rewards for achievements and LIVE activity.',
  'about.news.026.shop': 'A shop where themes can be previewed and purchased.',
  'about.news.026.themes': 'Miami Vice and Wild Galaxy themes.',
  'about.news.026.brickers': 'The Brikers game can be purchased for 1,500 Talarki.',
  'about.news.026.piper': 'Two built-in Piper voices: Halina and Mr. Drwina.',
  'about.news.026.tts': 'Improved TTS text filtering.',
  'about.news.026.viewers': 'Active LIVE viewers panel.',
  'about.news.026.avatars': 'Avatar memory with the Enigma avatar as a fallback.',
  'about.news.026.favorites': 'Favourite creators system.',
  'about.news.026.savedCreators': 'Expanded list of remembered creators.',
  'about.news.026.settingsDescriptions': 'Descriptions of functions in Settings.',
  'about.news.026.launcher': 'Launcher window scaling and appearance improvements.',
  'about.news.026.bigPicture': 'Big Picture improvements.',
  'about.news.026.updater': 'Updater notification improvements.',
  'about.news.026.stats': 'Corrections to TAPEK and share counting.',
  'about.news.026.roles': 'Moderator and Super Fan markers next to nicknames.',
  'about.news.026.polish': 'Numerous translation, layout, frame and responsiveness improvements.',
  'about.news.026.next': 'That is a mysterious mystery!'
});

Object.assign(I18N.de, {
  'about.news.next.title': 'Wie geht es weiter?',
  'about.news.026.intro': 'Dieses Update ist wirklich riesig: vom Wirtschaftssystem und einem Shop mit Themes und Spielen bis hin zu verbesserten Übersetzungen. Ich habe versucht, die meisten Vorschläge der letzten zwei Wochen umzusetzen. Ich hoffe, es ist mir gelungen — wenn ja, empfehlt das Programm bitte euren Freunden. Danke!',
  'about.news.026.economy': 'Talarki-Wirtschaftssystem mit Belohnungen für Erfolge und LIVE-Aktivität.',
  'about.news.026.shop': 'Shop zum Ansehen und Kaufen von Themes.',
  'about.news.026.themes': 'Die Themes Miami Vice und Wilde Galaxie.',
  'about.news.026.brickers': 'Das Spiel Brikers kann für 1.500 Talarki gekauft werden.',
  'about.news.026.piper': 'Zwei integrierte Piper-Stimmen: Halina und Mr. Drwina.',
  'about.news.026.tts': 'Verbesserte Filterung von TTS-Texten.',
  'about.news.026.viewers': 'Panel der aktiven LIVE-Zuschauer.',
  'about.news.026.avatars': 'Avatar-Speicher mit dem Enigma-Avatar als Ersatz.',
  'about.news.026.favorites': 'System für bevorzugte Creator.',
  'about.news.026.savedCreators': 'Erweiterte Liste gespeicherter Creator.',
  'about.news.026.settingsDescriptions': 'Beschreibungen der Funktionen in den Einstellungen.',
  'about.news.026.launcher': 'Verbesserungen an Skalierung und Aussehen der Launcher-Fenster.',
  'about.news.026.bigPicture': 'Verbesserungen an Big Picture.',
  'about.news.026.updater': 'Verbesserungen an den Benachrichtigungen des Updaters.',
  'about.news.026.stats': 'Korrekturen bei der Zählung von TAPEK und geteilten LIVE-Streams.',
  'about.news.026.roles': 'Kennzeichnungen für Moderatoren und Superfans neben den Namen.',
  'about.news.026.polish': 'Zahlreiche Verbesserungen an Übersetzungen, Layout, Rahmen und Responsivität.',
  'about.news.026.next': 'Das bleibt ein geheimnisvolles Geheimnis!'
});

Object.assign(I18N.hu, {
  'about.news.next.title': 'Mi következik?',
  'about.news.026.intro': 'Ez a frissítés valóban hatalmas: a gazdasági rendszertől és a témákat, valamint játékokat kínáló bolttól egészen a fordítások javításáig. Igyekeztem beépíteni az elmúlt két hét legtöbb javaslatát. Remélem, sikerült — ha igen, ajánld a programot az ismerőseidnek is. Köszönöm!',
  'about.news.026.economy': 'Talarki gazdasági rendszer jutalmakkal a teljesítményekért és az ÉLŐ aktivitásért.',
  'about.news.026.shop': 'Bolt a témák előnézetéhez és megvásárlásához.',
  'about.news.026.themes': 'Miami Vice és Vad galaxis témák.',
  'about.news.026.brickers': 'A Brikers játék 1500 Talarkiért vásárolható meg.',
  'about.news.026.piper': 'Két beépített Piper-hang: Halina és Mr. Drwina.',
  'about.news.026.tts': 'Javított TTS-szövegszűrés.',
  'about.news.026.viewers': 'Aktív ÉLŐ nézők panelje.',
  'about.news.026.avatars': 'Avatarok helyi megjegyzése, tartalékként az Enigma avatarral.',
  'about.news.026.favorites': 'Kedvenc alkotók rendszere.',
  'about.news.026.savedCreators': 'Kibővített lista a megjegyzett alkotókról.',
  'about.news.026.settingsDescriptions': 'A funkciók leírásai a Beállításokban.',
  'about.news.026.launcher': 'A launcher ablakainak méretezési és megjelenési javításai.',
  'about.news.026.bigPicture': 'Big Picture-javítások.',
  'about.news.026.updater': 'A frissítő értesítéseinek javításai.',
  'about.news.026.stats': 'A TAPEK és a megosztások számlálásának javításai.',
  'about.news.026.roles': 'Moderátori és szuperrajongói jelölések a nevek mellett.',
  'about.news.026.polish': 'Számos fordítási, elrendezési, keret- és reszponzivitási javítás.',
  'about.news.026.next': 'Ez egy titokzatos titok!'
});

Object.assign(I18N.pl, {
  'about.news.027.intro': 'Ta aktualizacja skupia się na usprawnieniu działania programu, rozbudowie Brikersa oraz poprawieniu wyglądu aplikacji. Dodaliśmy także nowy motyw, osiągnięcia i udoskonalenia TTS.',
  'about.news.027.theme': 'Dodano motyw „Świat Brikersa”.',
  'about.news.027.brickers': 'Rozbudowano grę Brikers i poprawiono działanie jego potrzeb.',
  'about.news.027.achievements': 'Dodano nowe osiągnięcia oraz nagrody w Talarkach.',
  'about.news.027.ttsSpeed': 'Przyspieszono działanie wbudowanych głosów TTS.',
  'about.news.027.ttsVolume': 'Zwiększono maksymalną głośność czytania wiadomości.',
  'about.news.027.chatDelay': 'Zmniejszono opóźnienie wyświetlania czatu.',
  'about.news.027.windows': 'Poprawiono wygląd Notatek, Archiwum i pozostałych okien.',
  'about.news.027.background': 'Poprawiono działanie programu po zminimalizowaniu.',
  'about.news.027.fixes': 'Wprowadzono liczne poprawki wizualne i techniczne.',
  'about.news.027.next': 'To tajemnicza tajemnica!'
});

Object.assign(I18N.en, {
  'about.news.027.intro': 'This update focuses on improving performance, expanding Brikers and polishing the application interface. It also adds a new theme, achievements and TTS improvements.',
  'about.news.027.theme': 'Added the Brikers World theme.',
  'about.news.027.brickers': 'Expanded the Brikers game and improved its needs system.',
  'about.news.027.achievements': 'Added new achievements and Talarki rewards.',
  'about.news.027.ttsSpeed': 'Improved the response time of the built-in TTS voices.',
  'about.news.027.ttsVolume': 'Increased the maximum message-reading volume.',
  'about.news.027.chatDelay': 'Reduced the chat display delay.',
  'about.news.027.windows': 'Improved the appearance of Notes, Archive and other windows.',
  'about.news.027.background': 'Improved application behavior when minimized.',
  'about.news.027.fixes': 'Added numerous visual and technical fixes.',
  'about.news.027.next': 'That is a mysterious mystery!'
});

Object.assign(I18N.de, {
  'about.news.027.intro': 'Dieses Update verbessert die Leistung, erweitert Brikers und verfeinert die Oberfläche. Außerdem kommen ein neues Theme, Erfolge und TTS-Verbesserungen hinzu.',
  'about.news.027.theme': 'Das Theme „Brikers Welt“ wurde hinzugefügt.',
  'about.news.027.brickers': 'Das Brikers-Spiel und sein Bedürfnissystem wurden erweitert.',
  'about.news.027.achievements': 'Neue Erfolge und Talarki-Belohnungen wurden hinzugefügt.',
  'about.news.027.ttsSpeed': 'Die Reaktionszeit der integrierten TTS-Stimmen wurde verbessert.',
  'about.news.027.ttsVolume': 'Die maximale Lautstärke beim Vorlesen wurde erhöht.',
  'about.news.027.chatDelay': 'Die Verzögerung der Chat-Anzeige wurde verringert.',
  'about.news.027.windows': 'Das Aussehen von Notizen, Archiv und weiteren Fenstern wurde verbessert.',
  'about.news.027.background': 'Das Verhalten der Anwendung im minimierten Zustand wurde verbessert.',
  'about.news.027.fixes': 'Zahlreiche visuelle und technische Korrekturen wurden vorgenommen.',
  'about.news.027.next': 'Das bleibt ein geheimnisvolles Geheimnis!'
});

Object.assign(I18N.hu, {
  'about.news.027.intro': 'Ez a frissítés a program működésének javítására, a Brikers bővítésére és a felület finomítására összpontosít. Új témát, teljesítményeket és TTS-fejlesztéseket is tartalmaz.',
  'about.news.027.theme': 'Megérkezett a Brikers világa téma.',
  'about.news.027.brickers': 'Bővült a Brikers játék, és javult a szükségletek működése.',
  'about.news.027.achievements': 'Új teljesítmények és Talarki-jutalmak kerültek a programba.',
  'about.news.027.ttsSpeed': 'Gyorsabban reagálnak a beépített TTS-hangok.',
  'about.news.027.ttsVolume': 'Nőtt az üzenetfelolvasás maximális hangereje.',
  'about.news.027.chatDelay': 'Csökkent a csevegés megjelenítési késleltetése.',
  'about.news.027.windows': 'Javult a Jegyzetek, az Archívum és a többi ablak megjelenése.',
  'about.news.027.background': 'Javult a program működése minimalizált állapotban.',
  'about.news.027.fixes': 'Számos vizuális és technikai javítás készült.',
  'about.news.027.next': 'Ez egy titokzatos titok!'
});

Object.assign(I18N.pl, {
  'about.news.029.intro': 'Ta aktualizacja rozwija ustawienia TTS, poprawia odczytywanie wiadomości i dodaje możliwość porządkowania listy zapamiętanych twórców.',
  'about.news.029.roles': 'Dodano opcję czytania przez TTS wyłącznie wiadomości moderatorów i superfanów.',
  'about.news.029.command': 'Dodano komendę „.69”, pozwalającą pozostałym widzom wysłać pojedynczą wiadomość do odczytania przez TTS.',
  'about.news.029.polish': 'Poprawiono obsługę polskich znaków w głosach Halina i Mr. Drwina.',
  'about.news.029.symbols': 'Poprawiono filtrowanie emoji, znaków towarowych i innych symboli błędnie odczytywanych przez TTS.',
  'about.news.029.delete': 'Dodano możliwość usuwania zapamiętanych twórców z panelu „Twórcy”.',
  'about.news.029.cleanup': 'Usuwanie twórcy czyści również jego zapisane dane, status ulubionego i ranking częstych połączeń.',
  'about.news.029.translations': 'Dodano tłumaczenia nowych funkcji na język angielski, niemiecki i węgierski.',
  'about.news.029.next': 'To tajemnicza tajemnica!'
});

Object.assign(I18N.en, {
  'about.news.029.intro': 'This update expands the TTS settings, improves message reading and adds tools for organizing remembered creators.',
  'about.news.029.roles': 'Added an option for TTS to read only messages from moderators and superfans.',
  'about.news.029.command': 'Added the “.69” command, allowing other viewers to submit a single message for TTS reading.',
  'about.news.029.polish': 'Improved Polish character handling in the Halina and Mr. Drwina voices.',
  'about.news.029.symbols': 'Improved filtering of emoji, trademark signs and other symbols incorrectly read by TTS.',
  'about.news.029.delete': 'Added the ability to remove remembered creators from the Creators panel.',
  'about.news.029.cleanup': 'Removing a creator also clears their saved data, favorite status and frequent-connection ranking.',
  'about.news.029.translations': 'Added English, German and Hungarian translations for the new features.',
  'about.news.029.next': 'That is a mysterious mystery!'
});

Object.assign(I18N.de, {
  'about.news.029.intro': 'Dieses Update erweitert die TTS-Einstellungen, verbessert das Vorlesen von Nachrichten und erleichtert das Verwalten gespeicherter Creator.',
  'about.news.029.roles': 'TTS kann nun wahlweise nur Nachrichten von Moderatoren und Superfans vorlesen.',
  'about.news.029.command': 'Der Befehl „.69“ erlaubt anderen Zuschauern, eine einzelne Nachricht von TTS vorlesen zu lassen.',
  'about.news.029.polish': 'Die Verarbeitung polnischer Zeichen durch Halina und Mr. Drwina wurde verbessert.',
  'about.news.029.symbols': 'Die Filterung von Emojis, Markenzeichen und anderen von TTS falsch vorgelesenen Symbolen wurde verbessert.',
  'about.news.029.delete': 'Gespeicherte Creator können nun im Creator-Fenster gelöscht werden.',
  'about.news.029.cleanup': 'Beim Löschen werden auch gespeicherte Daten, Favoritenstatus und die Rangliste häufiger Verbindungen bereinigt.',
  'about.news.029.translations': 'Für die neuen Funktionen wurden englische, deutsche und ungarische Übersetzungen ergänzt.',
  'about.news.029.next': 'Das bleibt ein geheimnisvolles Geheimnis!'
});

Object.assign(I18N.hu, {
  'about.news.029.intro': 'Ez a frissítés kibővíti a TTS beállításait, javítja az üzenetek felolvasását, és segít rendezni a megjegyzett alkotók listáját.',
  'about.news.029.roles': 'A TTS mostantól beállítható úgy, hogy csak a moderátorok és szuperrajongók üzeneteit olvassa fel.',
  'about.news.029.command': 'A „.69” paranccsal a többi néző is elküldhet egyetlen, TTS által felolvasandó üzenetet.',
  'about.news.029.polish': 'Javult a lengyel karakterek kezelése a Halina és Mr. Drwina hangoknál.',
  'about.news.029.symbols': 'Javult az emojik, védjegyjelek és a TTS által hibásan felolvasott egyéb szimbólumok szűrése.',
  'about.news.029.delete': 'A megjegyzett alkotók mostantól törölhetők az Alkotók panelen.',
  'about.news.029.cleanup': 'Az alkotó törlése eltávolítja a mentett adatokat, a kedvenc státuszt és a gyakori kapcsolódások rangsorát is.',
  'about.news.029.translations': 'Az új funkciók angol, német és magyar fordítást kaptak.',
  'about.news.029.next': 'Ez egy titokzatos titok!'
});

Object.assign(I18N.pl, {
  'about.news.030.intro': 'Aktualizacja naprawcza usuwająca problem zgłoszony przez testerów po wydaniu 0.2.9.',
  'about.news.030.languageFix': 'Naprawiono błąd wersji 0.2.9, który po aktualizacji mógł wyrzucać użytkowników z programu podczas wyboru języka.',
  'about.news.030.languageInit': 'Okno wyboru języka jest teraz uruchamiane tylko raz i dopiero po prawidłowym odczytaniu wersji aplikacji.',
  'about.news.030.languageSave': 'Zabezpieczono zapis języka przed wielokrotnym kliknięciem i równoczesnym przetwarzaniem kilku zmian.',
  'about.news.030.next': 'To tajemnicza tajemnica!'
});

Object.assign(I18N.en, {
  'about.news.030.intro': 'A corrective update addressing the issue reported by testers after version 0.2.9.',
  'about.news.030.languageFix': 'Fixed a version 0.2.9 issue that could close the application after an update while the user selected a language.',
  'about.news.030.languageInit': 'The language selection window is now initialized only once and only after the application version has been read correctly.',
  'about.news.030.languageSave': 'Language saving is now protected against repeated clicks and simultaneous processing of multiple changes.',
  'about.news.030.next': 'That is a mysterious mystery!'
});

Object.assign(I18N.de, {
  'about.news.030.intro': 'Ein Korrekturupdate für das von Testern nach Version 0.2.9 gemeldete Problem.',
  'about.news.030.languageFix': 'Ein Fehler aus Version 0.2.9 wurde behoben, durch den sich die Anwendung nach einem Update bei der Sprachauswahl schließen konnte.',
  'about.news.030.languageInit': 'Das Fenster zur Sprachauswahl wird jetzt nur einmal und erst nach dem korrekten Einlesen der Anwendungsversion initialisiert.',
  'about.news.030.languageSave': 'Das Speichern der Sprache ist jetzt gegen wiederholte Klicks und die gleichzeitige Verarbeitung mehrerer Änderungen geschützt.',
  'about.news.030.next': 'Das bleibt ein geheimnisvolles Geheimnis!'
});

Object.assign(I18N.hu, {
  'about.news.030.intro': 'Javítófrissítés a tesztelők által a 0.2.9-es verzió után jelzett problémára.',
  'about.news.030.languageFix': 'Javítva lett a 0.2.9-es verzió hibája, amely miatt frissítés után a nyelvválasztás közben bezáródhatott az alkalmazás.',
  'about.news.030.languageInit': 'A nyelvválasztó ablak mostantól csak egyszer, az alkalmazás verziójának helyes beolvasása után inicializálódik.',
  'about.news.030.languageSave': 'A nyelv mentése védett lett a többszöri kattintás és több módosítás egyidejű feldolgozása ellen.',
  'about.news.030.next': 'Ez egy titokzatos titok!'
});

const statusEl = document.getElementById('status');
const statusConnectionEl = document.getElementById('statusConnection');
const statusDelayEl = document.getElementById('statusDelay');
const statusQueueEl = document.getElementById('statusQueue');
const statusViewersEl = document.getElementById('statusViewers');
const topGiftersContent = document.getElementById('topGiftersContent');
const topTappersContent = document.getElementById('topTappersContent');
const statusMessagesEl = document.getElementById('statusMessages');
const statusMemberHeartsActiveEl = document.getElementById('statusMemberHeartsActive');
const statusMemberHeartsExpiredEl = document.getElementById('statusMemberHeartsExpired');
const statusStatsEl = document.getElementById('statusStats');
const rightWidgets = Array.from(document.querySelectorAll('[data-right-widget]'));
const rightWidgetsByName = new Map(rightWidgets.map((widget) => [widget.dataset.rightWidget, widget]));
const rightWidgetButtons = Array.from(document.querySelectorAll('[data-widget-target]'));
const creatorInput = document.getElementById('creatorInput');
const creatorRefreshButton = document.getElementById('creatorRefresh');
const creatorSuggestions = document.getElementById('creatorSuggestions');
const recentCreatorsStrip = document.getElementById('recentCreatorsStrip');
const favoriteCreatorsRow = document.getElementById('favoriteCreatorsRow');
const recentCreatorsCarousel = document.getElementById('recentCreatorsCarousel');
const recentCreatorsPrev = document.getElementById('recentCreatorsPrev');
const recentCreatorsNext = document.getElementById('recentCreatorsNext');
const messagesEl = document.getElementById('messages');
const emptyEl = document.getElementById('empty');
const chatViewEl = document.querySelector('.chat-view');
const battleBanner = document.getElementById('battleBanner');
const battleScorebarEl = document.getElementById('battleScorebar');
const battleScorebarTrackEl = document.getElementById('battleScorebarTrack');
const battleScoreTimeEl = document.getElementById('battleScoreTime');
const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
const sidebarButtons = Array.from(document.querySelectorAll('[data-section]'));
const viewPanels = Array.from(document.querySelectorAll('[data-view]'));
const settingsTabs = Array.from(document.querySelectorAll('[data-settings-tab]'));
const settingsPanels = Array.from(document.querySelectorAll('[data-settings-panel]'));
const appearanceSubtabs = Array.from(document.querySelectorAll('[data-appearance-subtab]'));
const appearanceSubpanels = Array.from(document.querySelectorAll('[data-appearance-subpanel]'));
const aboutTabs = Array.from(document.querySelectorAll('[data-about-tab]'));
const aboutPanels = Array.from(document.querySelectorAll('[data-about-panel]'));
const chatStyleInputs = Array.from(document.querySelectorAll('input[name="chatStyle"]'));
const themeInputs = Array.from(document.querySelectorAll('input[name="appTheme"]'));
const appAppearanceInputs = Array.from(document.querySelectorAll('input[name="appAppearance"]'));
const multiplierNotificationsEl = document.getElementById('multiplierNotifications');
const statsToolboxEl = document.getElementById('statsToolbox');
const galleryAvatarsEl = document.getElementById('galleryAvatars');
const deleteOldArchivesEl = document.getElementById('deleteOldArchives');
const bigPictureModeEl = document.getElementById('bigPictureMode');
const quietModeEl = document.getElementById('quietMode');
const resetSettingsButtonEl = document.getElementById('resetSettingsButton');
const refreshArchiveButton = document.getElementById('refreshArchive');
const openArchiveFolderButton = document.getElementById('openArchiveFolder');
const archiveListEl = document.getElementById('archiveList');
const archiveSearchEl = document.getElementById('archiveSearch');
const archiveDetailEmptyEl = document.getElementById('archiveDetailEmpty');
const archiveSessionEl = document.getElementById('archiveSession');
const archiveSessionNameEl = document.getElementById('archiveSessionName');
const archiveSessionMetaEl = document.getElementById('archiveSessionMeta');
const archiveMessagesEl = document.getElementById('archiveMessages');
const archiveFilterButtons = Array.from(document.querySelectorAll('[data-archive-filter]'));
const archiveSummaryMessagesEl = document.getElementById('archiveSummaryMessages');
const archiveSummaryChatEl = document.getElementById('archiveSummaryChat');
const archiveSummaryCoinsEl = document.getElementById('archiveSummaryCoins');
const archiveSummaryModeratorsEl = document.getElementById('archiveSummaryModerators');
const exportArchiveButton = document.getElementById('exportArchive');
const deleteArchiveButton = document.getElementById('deleteArchive');
const notesStatusEl = document.getElementById('notesStatus');
const notesLauncherEl = document.getElementById('notesLauncher');
const notesDialogBackdropEl = document.getElementById('notesDialogBackdrop');
const notesDialogCloseEl = document.getElementById('notesDialogClose');
const achievementsLauncherEl = document.getElementById('achievementsLauncher');
const achievementsDialogBackdropEl = document.getElementById('achievementsDialogBackdrop');
const achievementsDialogCloseEl = document.getElementById('achievementsDialogClose');
const settingsLauncherEl = document.getElementById('settingsLauncher');
const settingsDialogBackdropEl = document.getElementById('settingsDialogBackdrop');
const settingsDialogCloseEl = document.getElementById('settingsDialogClose');
const talarkiValueEl = document.getElementById('talarkiValue');
const shopLauncherEl = document.getElementById('shopLauncher');
const shopDialogBackdropEl = document.getElementById('shopDialogBackdrop');
const shopDialogCloseEl = document.getElementById('shopDialogClose');
const shopMiamiPurchaseEl = document.getElementById('shopMiamiPurchase');
const shopWildGalaxyPurchaseEl = document.getElementById('shopWildGalaxyPurchase');
const shopBrikersWorldPurchaseEl = document.getElementById('shopBrikersWorldPurchase');
const shopBrikersPurchaseEl = document.getElementById('shopBrikersPurchase');
let shopPreviewTheme = '';
const tamagotchiLauncherEl = document.getElementById('tamagotchiLauncher');
const tamagotchiDialogBackdropEl = document.getElementById('tamagotchiDialogBackdrop');
const tamagotchiDialogCloseEl = document.getElementById('tamagotchiClose');
const tamagotchiBodyEl = document.getElementById('tamagotchiBody');
let tamagotchiInstructionsOpen = false;
const TAMAGOTCHI_KEY = 'czatbox.tamagotchi.v1';
const TAMAGOTCHI_PLAY_COOLDOWN_MS = 20 * 60 * 1000;
let talarki = Math.max(0, Math.min(100000, Number(localStorage.getItem(TALARKI_KEY)) || 0));

const defaultTamagotchi = { hatched: false, hunger: 10, fun: 10, hygiene: 10, health: 10, energy: 10, poop: 0, sleeping: false, lastTick: Date.now(), lastConnection: 0, lastPlayAt: 0, spamDebt: 0 };
let tamagotchi = (() => { try { return { ...defaultTamagotchi, ...(JSON.parse(localStorage.getItem(TAMAGOTCHI_KEY) || '{}')) }; } catch { return { ...defaultTamagotchi }; } })();
// Czas poza uruchomioną aplikacją nie jest czasem aktywnej opieki.
tamagotchi.lastTick = Date.now();
if (tamagotchi.hatched && [tamagotchi.hunger, tamagotchi.fun, tamagotchi.hygiene, tamagotchi.health, tamagotchi.energy].every((value) => Number(value) === 0)) { tamagotchi.hunger = 10; tamagotchi.fun = 10; tamagotchi.hygiene = 10; tamagotchi.health = 10; tamagotchi.energy = 10; }
if (!localStorage.getItem(TAMAGOTCHI_KEY)) saveTamagotchi();
function saveTamagotchi() { localStorage.setItem(TAMAGOTCHI_KEY, JSON.stringify(tamagotchi)); }
function clampPet(value) { return Math.max(0, Math.min(10, Number(value) || 0)); }
function notifyPetNeed(text) { if (typeof notifyCzester === 'function') notifyCzester('tamagotchi', text, { animate: false }); }
function tickTamagotchi() {
  if (!isBrikersGameUnlocked()) return;
  const now = Date.now(); const cycles = Math.floor((now - Number(tamagotchi.lastTick || now)) / 1200000);
  if (!tamagotchi.hatched) return;
  if (cycles < 1) { if (tamagotchiDialogBackdropEl && !tamagotchiDialogBackdropEl.hidden) renderTamagotchi(); return; }
  const connected = isOnlineConnectionState(state);
  // Pełna regeneracja energii od 0 trwa teraz maksymalnie 100 minut,
  // zamiast wcześniejszych 200 minut.
  if (tamagotchi.sleeping) { tamagotchi.energy = clampPet(tamagotchi.energy + (cycles * 2)); tamagotchi.hunger = clampPet(tamagotchi.hunger - cycles); tamagotchi.fun = clampPet(tamagotchi.fun - cycles); }
  if (connected && !tamagotchi.sleeping) { tamagotchi.fun = clampPet(tamagotchi.fun + cycles); tamagotchi.hunger = clampPet(tamagotchi.hunger - cycles); tamagotchi.energy = clampPet(tamagotchi.energy - cycles); tamagotchi.hygiene = clampPet(tamagotchi.hygiene - cycles); }
  const zeroNeeds = [tamagotchi.hunger, tamagotchi.fun, tamagotchi.hygiene, tamagotchi.energy].filter((value) => value <= 0).length;
  if (!tamagotchi.sleeping && zeroNeeds >= 3) tamagotchi.health = clampPet(tamagotchi.health - (2 * cycles));
  if (!tamagotchi.sleeping && tamagotchi.poop > 0) { tamagotchi.hygiene = clampPet(tamagotchi.hygiene - cycles); tamagotchi.health = clampPet(tamagotchi.health - cycles); }
  tamagotchi.poop = Math.max(tamagotchi.poop, Math.floor((10 - tamagotchi.hunger) / 3));
  if (tamagotchi.hunger <= 2) notifyPetNeed('Brikers jest głodny. Możesz kupić mu jabłko albo babeczkę w jego oknie.');
  if (tamagotchi.hygiene <= 0 && tamagotchi.poop > 0) notifyPetNeed('Brikers potrzebuje sprzątania.');
  if (tamagotchi.energy <= 2) notifyPetNeed('Brikers jest zmęczony. Wyślij go spać.');
  if (tamagotchi.health <= 2) notifyPetNeed('Brikers ma słabe zdrowie. Potrzebuje zastrzyku.');
  tamagotchi.lastTick = now; saveTamagotchi(); renderTamagotchi();
}
setInterval(tickTamagotchi, 60000);
// Po przywróceniu okna natychmiast nadrób pełne 20-minutowe cykle.
// Jest to zabezpieczenie niezależne od wyłączenia backgroundThrottling w Electronie.
window.addEventListener('focus', tickTamagotchi);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) tickTamagotchi();
});
function spendPetCoins(amount) { if (talarki < amount) return false; talarki -= amount; localStorage.setItem(TALARKI_KEY, String(talarki)); updateTalarkiUi(); return true; }
function renderTamagotchiInstructions() {
  if (!tamagotchiBodyEl) return;
  tamagotchiBodyEl.innerHTML = `<section class="tamagotchi-instructions" aria-labelledby="tamagotchiInstructionsTitle">
    <div class="tamagotchi-instructions-header"><div><h2 id="tamagotchiInstructionsTitle">Jak opiekować się Brikersem?</h2><p>Dbaj o jego potrzeby, aby wszystkie wartości były jak najbliżej 10/10.</p></div><button class="tamagotchi-guide-back" type="button"><span data-ui-icon="dinosaur"></span><span>Wróć do gry</span></button></div>
    <div class="tamagotchi-guide-grid">
      <article><h3>Połącz się z transmisją</h3><p>Gdy Brikers nie śpi, połączenie z twórcą odnawia zabawę. Co 20 minut maleją wtedy głód, higiena i energia.</p></article>
      <article><h3>Nakarm Brikersa</h3><p>Jabłko odnawia 1 punkt głodu i kosztuje 3 Talarki. Babeczka odnawia 2 punkty i kosztuje 6 Talarków.</p></article>
      <article><h3>Sen i energia</h3><p>Użyj Łóżka, aby Brikers zasnął. Podczas snu energia rośnie o 2 punkty co 20 minut, a głód i zabawa maleją. Pozostałe przyciski są wtedy zablokowane, dopóki go nie obudzisz.</p></article>
      <article><h3>Higiena i kupki</h3><p>Prysznic kosztuje 50 Talarków i odnawia higienę do pełna. Kupkę sprzątasz, klikając ją bezpośrednio na planszy. Za każdą posprzątaną kupkę dostajesz 1 Talarek.</p></article>
      <article><h3>Zdrowie</h3><p>Brak opieki i spam wykryty na czacie mogą obniżać zdrowie. Strzykawka odnawia je do pełna i kosztuje 100 Talarków.</p></article>
      <article><h3>Zapisywanie gry</h3><p>Stan Brikersa zapisuje się automatycznie na komputerze. Potrzeby nie spadają, gdy program jest wyłączony.</p></article>
    </div>
  </section>`;
  hydrateUiIcons(tamagotchiBodyEl);
  tamagotchiBodyEl.querySelector('.tamagotchi-guide-back')?.addEventListener('click', () => { tamagotchiInstructionsOpen = false; renderTamagotchi(); });
}
function renderTamagotchi() {
  if (!tamagotchiBodyEl) return;
  if (tamagotchiInstructionsOpen) { renderTamagotchiInstructions(); return; }
  if (!tamagotchi.hatched) { tamagotchiBodyEl.innerHTML = '<button class="tamagotchi-egg" id="tamagotchiEgg" type="button" aria-label="Wykluj jajko"><span>🥚</span><strong>Naciśnij jajko, aby je wykluć</strong></button>'; document.getElementById('tamagotchiEgg')?.addEventListener('click', () => { tamagotchi.hatched = true; tamagotchi.lastTick = Date.now(); saveTamagotchi(); renderTamagotchi(); }); return; }
  const petSprite = tamagotchi.sleeping ? 'assets/brikers-sleeping.png?v=1' : 'assets/brikers-user.png?v=brikers-simple-v1';
  tamagotchiBodyEl.innerHTML = `<div class="tamagotchi-stage"><div class="tamagotchi-dino" aria-label="Brikers"><img class="pet-rat-image${tamagotchi.sleeping ? ' sleeping' : ''}" src="${petSprite}" alt="Brikers${tamagotchi.sleeping ? ' śpi' : ''}" /></div><div class="tamagotchi-status"><div>Głód <b>${tamagotchi.hunger}/10</b><button data-pet-action="apple">Jabłko · 3</button><button data-pet-action="cake">Babeczka · 6</button></div><div>Zabawa <b>${tamagotchi.fun}/10</b></div><div>Higiena <b>${tamagotchi.hygiene}/10</b></div><div>Zdrowie <b>${tamagotchi.health}/10</b><button data-pet-action="heal">Zastrzyk · 100</button></div><div>Energia <b>${tamagotchi.energy}/10</b><button data-pet-action="sleep">Sen</button></div></div></div>`;
  const meters = document.createElement('div'); meters.className = 'pet-meters-overlay';
  const meter = (type, value, side, name, extra = '') => { const box = document.createElement('div'); box.className = `pet-meter ${side} ${extra}`; box.title = `${name}: ${value}/10`; box.setAttribute('aria-label', `${name}: ${value}/10`); const icon = `assets/pet-need-${type}.png?v=3`; box.innerHTML = `<img class="pet-meter-icon" src="${icon}" alt="" draggable="false" /><span>${name}</span><div class="pet-meter-pips">${Array.from({ length: 10 }, (_, index) => `<i class="${index < value ? 'on' : ''}"></i>`).join('')}</div><b>${value}/10</b>`; return box; };
  const leftStack = document.createElement('div'); leftStack.className = 'meter-stack';
  const rightStack = document.createElement('div'); rightStack.className = 'meter-stack meter-stack-right';
  leftStack.append(meter('health', tamagotchi.health, 'left', 'Zdrowie', 'health-meter'), meter('hunger', tamagotchi.hunger, 'left', 'Głód'));
  rightStack.append(meter('hygiene', tamagotchi.hygiene, 'right', 'Higiena'), meter('energy', tamagotchi.energy, 'right', 'Energia'));
  leftStack.append(meter('fun', tamagotchi.fun, 'left', 'Zabawa'));
  meters.append(leftStack, rightStack);
  const stage = tamagotchiBodyEl.querySelector('.tamagotchi-stage');
  stage?.prepend(meters);
  if (stage && tamagotchi.poop > 0) { const poop = document.createElement('div'); poop.className = 'tamagotchi-poops'; poop.innerHTML = Array.from({ length: tamagotchi.poop }, () => '<button type="button" data-pet-action="clean" title="Sprzątnij kupkę i odbierz 1 Talarek"><img src="assets/pet-poop.png?v=1" alt="Kupka" /></button>').join(''); stage.append(poop); }
  const actionBar = document.createElement('div'); actionBar.className = 'tamagotchi-action-bar';
  actionBar.innerHTML = `<button data-pet-action="apple" title="Jabłko — 3 Talarki"><span data-ui-icon="apple"></span><span>Jabłko · 3</span><span data-ui-icon="coin"></span></button><button data-pet-action="cake" title="Babeczka — 6 Talarków"><span data-ui-icon="cake"></span><span>Babeczka · 6</span><span data-ui-icon="coin"></span></button><button data-pet-action="heal" title="Strzykawka — 100 Talarków"><span data-ui-icon="syringe"></span><span>Strzykawka · 100</span><span data-ui-icon="coin"></span></button><button data-pet-action="shower" title="Prysznic — 50 Talarków, odnawia higienę"><span data-ui-icon="shower"></span><span>Prysznic · 50</span><span data-ui-icon="coin"></span></button><button data-pet-action="sleep" title="${tamagotchi.sleeping ? 'Obudź Brikersa' : 'Energia rośnie o 2 punkty co 20 minut snu'}"><span data-ui-icon="bed"></span><span>${tamagotchi.sleeping ? 'Obudź' : 'Łóżko'}</span></button><button class="tamagotchi-instructions-button" data-pet-action="instructions" title="Otwórz instrukcję gry"><span data-ui-icon="questions"></span><span>Instrukcja</span></button>`;
  stage?.append(actionBar);
  hydrateUiIcons(actionBar);
  const playButton = actionBar.querySelector('[data-pet-action="play"]');
  const playCooldownLeft = Math.max(0, TAMAGOTCHI_PLAY_COOLDOWN_MS - (Date.now() - Number(tamagotchi.lastPlayAt || 0)));
  if (playButton) { playButton.disabled = tamagotchi.sleeping || tamagotchi.fun >= 10 || tamagotchi.energy <= 0 || playCooldownLeft > 0; playButton.title = tamagotchi.sleeping ? 'Brikers śpi' : tamagotchi.energy <= 0 ? 'Brikers nie ma energii — najpierw połóż go spać' : tamagotchi.fun >= 10 ? 'Zabawa jest już pełna' : playCooldownLeft > 0 ? `Następna zabawa za ${Math.ceil(playCooldownLeft / 60000)} min` : 'Dodaje 1 punkt zabawy i zmniejsza Głód, Higienę oraz Energię o 1'; }
  tamagotchiBodyEl.querySelectorAll('[data-pet-action]').forEach((button) => { if (tamagotchi.sleeping && !['sleep', 'instructions'].includes(button.dataset.petAction)) { button.disabled = true; button.title = 'Brikers śpi — najpierw go obudź'; } });
  const paidActions = {
    apple: { cost: 3, full: tamagotchi.hunger >= 10 },
    cake: { cost: 6, full: tamagotchi.hunger >= 10 },
    heal: { cost: 100, full: tamagotchi.health >= 10 },
    shower: { cost: 50, full: tamagotchi.hygiene >= 10 }
  };
  Object.entries(paidActions).forEach(([action, details]) => {
    const button = actionBar.querySelector(`[data-pet-action="${action}"]`);
    if (!button || tamagotchi.sleeping) return;
    button.disabled = details.full || talarki < details.cost;
    if (details.full) button.title = 'Ta potrzeba jest już pełna';
    else if (talarki < details.cost) button.title = `Potrzebujesz ${details.cost} Talarków`;
  });
  tamagotchiBodyEl.querySelectorAll('[data-pet-action]').forEach((button) => button.addEventListener('click', () => {
    const action = button.dataset.petAction;
    if (action === 'instructions') { tamagotchiInstructionsOpen = true; renderTamagotchi(); return; }
    if (tamagotchi.sleeping && action !== 'sleep') return;
    if (action === 'apple' && spendPetCoins(3)) tamagotchi.hunger = clampPet(tamagotchi.hunger + 1);
    if (action === 'cake' && spendPetCoins(6)) tamagotchi.hunger = clampPet(tamagotchi.hunger + 2);
    if (action === 'play' && !tamagotchi.sleeping && tamagotchi.fun < 10 && tamagotchi.energy > 0 && Date.now() - Number(tamagotchi.lastPlayAt || 0) >= TAMAGOTCHI_PLAY_COOLDOWN_MS) { tamagotchi.fun = clampPet(tamagotchi.fun + 1); tamagotchi.energy = clampPet(tamagotchi.energy - 1); tamagotchi.hunger = clampPet(tamagotchi.hunger - 1); tamagotchi.hygiene = clampPet(tamagotchi.hygiene - 1); tamagotchi.lastPlayAt = Date.now(); }
    if (action === 'clean' && tamagotchi.poop > 0) { tamagotchi.poop -= 1; tamagotchi.hygiene = clampPet(tamagotchi.hygiene + 1); talarki = Math.min(100000, talarki + 1); localStorage.setItem(TALARKI_KEY, String(talarki)); updateTalarkiUi(); }
    if (action === 'shower' && tamagotchi.hygiene < 10 && spendPetCoins(50)) tamagotchi.hygiene = 10;
    if (action === 'heal' && spendPetCoins(100)) tamagotchi.health = 10;
    if (action === 'sleep') { tamagotchi.sleeping = !tamagotchi.sleeping; tamagotchi.lastTick = Date.now(); }
    saveTamagotchi(); renderTamagotchi();
  }));
}
function setTamagotchiOpen(open) { if (open && !isBrikersGameUnlocked()) return; if (tamagotchiDialogBackdropEl) tamagotchiDialogBackdropEl.hidden = !open; if (!open) tamagotchiInstructionsOpen = false; if (open) { tickTamagotchi(); renderTamagotchi(); } }
tamagotchiLauncherEl?.addEventListener('click', () => setTamagotchiOpen(Boolean(tamagotchiDialogBackdropEl?.hidden)));
tamagotchiDialogCloseEl?.addEventListener('click', () => setTamagotchiOpen(false));
tamagotchiDialogBackdropEl?.addEventListener('click', (event) => { if (event.target === tamagotchiDialogBackdropEl) setTamagotchiOpen(false); });

function awardConnectionTalarki() {
  if (!isOnlineConnectionState(state)) {
    return;
  }
  const amount = document.documentElement.dataset.bigPicture === 'true' ? 2 : 1;
  const next = Math.min(100000, talarki + amount);
  if (next === talarki) return;
  talarki = next;
  localStorage.setItem(TALARKI_KEY, String(talarki));
  updateTalarkiUi();
}

setInterval(awardConnectionTalarki, 60000);

function updateTalarkiUi() {
  if (talarkiValueEl) talarkiValueEl.textContent = String(talarki);
  if (shopMiamiPurchaseEl) {
    const unlocked = isAppThemeUnlocked('miami-vice');
    shopMiamiPurchaseEl.disabled = unlocked || talarki < 1000;
    shopMiamiPurchaseEl.textContent = unlocked ? 'Odblokowano' : 'Kup za 1000 Talarków';
  }
  if (shopWildGalaxyPurchaseEl) {
    const unlocked = isAppThemeUnlocked('dzika-galaktyka');
    shopWildGalaxyPurchaseEl.disabled = unlocked || talarki < 1000;
    shopWildGalaxyPurchaseEl.textContent = unlocked ? 'Odblokowano' : 'Kup za 1000 Talarków';
  }
  if (shopBrikersWorldPurchaseEl) {
    const unlocked = isAppThemeUnlocked('swiat-brikersa');
    shopBrikersWorldPurchaseEl.disabled = unlocked || talarki < 1000;
    shopBrikersWorldPurchaseEl.textContent = unlocked ? 'Odblokowano' : 'Kup za 1000 Talarków';
  }
  if (shopBrikersPurchaseEl) {
    const unlocked = isBrikersGameUnlocked();
    shopBrikersPurchaseEl.disabled = unlocked || talarki < 1500;
    shopBrikersPurchaseEl.textContent = unlocked ? 'Odblokowano' : 'Kup za 1500 Talarków';
  }
  if (tamagotchiLauncherEl) tamagotchiLauncherEl.hidden = !isBrikersGameUnlocked();
}
function setShopOpen(open) {
  if (shopDialogBackdropEl) shopDialogBackdropEl.hidden = !open;
  shopLauncherEl?.setAttribute('aria-expanded', String(open));
  if (!open && shopPreviewTheme) { shopPreviewTheme = ''; applyAppearanceSettings(); document.querySelectorAll('[data-theme-preview]').forEach((button) => { button.textContent = 'Podgląd'; }); }
}
shopLauncherEl?.addEventListener('click', () => setShopOpen(Boolean(shopDialogBackdropEl?.hidden)));
shopDialogCloseEl?.addEventListener('click', () => setShopOpen(false));
shopDialogBackdropEl?.addEventListener('click', (event) => { if (event.target === shopDialogBackdropEl) setShopOpen(false); });
shopMiamiPurchaseEl?.addEventListener('click', () => {
  if (isAppThemeUnlocked('miami-vice') || talarki < 1000) return;
  talarki -= 1000;
  localStorage.setItem(TALARKI_KEY, String(talarki));
  redeemedFeatures.miamiViceTheme = true;
  saveRedeemedFeatures();
  syncLockedThemeChoice('themeMiamiVice', true);
  updateTalarkiUi();
});
shopWildGalaxyPurchaseEl?.addEventListener('click', () => {
  if (isAppThemeUnlocked('dzika-galaktyka') || talarki < 1000) return;
  talarki -= 1000;
  localStorage.setItem(TALARKI_KEY, String(talarki));
  redeemedFeatures.wildGalaxyTheme = true;
  saveRedeemedFeatures();
  syncLockedThemeChoice('themeDzikaGalaktyka', true);
  updateTalarkiUi();
});
shopBrikersWorldPurchaseEl?.addEventListener('click', () => {
  if (isAppThemeUnlocked('swiat-brikersa') || talarki < 1000) return;
  talarki -= 1000;
  localStorage.setItem(TALARKI_KEY, String(talarki));
  redeemedFeatures.brickersWorldTheme = true;
  saveRedeemedFeatures();
  syncLockedThemeChoice('themeSwiatBrikersa', true);
  updateTalarkiUi();
});
shopBrikersPurchaseEl?.addEventListener('click', () => {
  if (isBrikersGameUnlocked() || talarki < 1500) return;
  talarki -= 1500;
  localStorage.setItem(TALARKI_KEY, String(talarki));
  redeemedFeatures.brickersGame = true;
  saveRedeemedFeatures();
  unlockAchievement('true-friend');
  updateTalarkiUi();
});
document.querySelectorAll('[data-theme-preview]').forEach((button) => button.addEventListener('click', () => {
  const theme = button.dataset.themePreview;
  if (!APP_THEMES.includes(theme)) return;
  const stopping = shopPreviewTheme === theme;
  shopPreviewTheme = stopping ? '' : theme;
  if (stopping) applyAppearanceSettings(); else document.documentElement.dataset.theme = theme;
  document.querySelectorAll('[data-theme-preview]').forEach((item) => { item.textContent = item.dataset.themePreview === shopPreviewTheme ? 'Zakończ podgląd' : 'Podgląd'; });
}));
document.querySelectorAll('[data-shop-tab]').forEach((tab) => tab.addEventListener('click', () => {
  const target = tab.dataset.shopTab;
  document.querySelectorAll('[data-shop-tab]').forEach((item) => item.dataset.active = String(item === tab));
  document.querySelectorAll('[data-shop-panel]').forEach((panel) => { panel.hidden = panel.dataset.shopPanel !== target; });
}));
const creatorLauncherEl = document.getElementById('creatorLauncher');
const creatorLauncherPanelEl = document.getElementById('creatorLauncherPanel');
const creatorLauncherPanelContentEl = document.getElementById('creatorLauncherPanelContent');
const creatorLauncherPanelCloseEl = document.getElementById('creatorLauncherPanelClose');
const viewersLauncherEl = document.getElementById('viewersLauncher');
const viewersDialogBackdropEl = document.getElementById('viewersDialogBackdrop');
const viewersDialogCloseEl = document.getElementById('viewersDialogClose');
const viewersDialogContentEl = document.getElementById('viewersDialogContent');
const viewersRefreshButtonEl = document.getElementById('viewersRefreshButton');
const viewersCountLabelEl = document.getElementById('viewersCountLabel');
const viewersObservedLabelEl = document.getElementById('viewersObservedLabel');

async function openCurrentViewers() {
  if (!viewersDialogBackdropEl || !viewersDialogContentEl) return;
  const refreshToken = ++viewerRefreshToken;
  viewersDialogContentEl.classList.add('viewers-refreshing');
  viewersDialogContentEl.replaceChildren();
  const result = await window.tiktokLive?.getCurrentViewers?.();
  if (refreshToken !== viewerRefreshToken) return;
  const viewers = result?.viewers || [];
  if (viewersCountLabelEl) viewersCountLabelEl.textContent = String(result?.viewerCount ?? liveViewerCount ?? 0);
  if (viewersObservedLabelEl) viewersObservedLabelEl.textContent = String(result?.observedCount ?? viewers.length);
  mergeViewerAvatars(viewers);
  if (!viewers.length) {
    viewersDialogContentEl.textContent = 'Brak listy widzów w ostatniej aktualizacji.';
  } else {
    const list = document.createElement('div');
    list.className = 'viewers-grid';
    viewers.forEach((viewer) => {
      const item = document.createElement('div'); item.className = 'recent-creator-card viewer-card';
      const avatar = document.createElement('span'); avatar.className = 'recent-creator-avatar';
      if (viewer.avatar) { const image = document.createElement('img'); image.src = viewer.avatar; image.alt = ''; avatar.appendChild(image); }
      else avatar.textContent = (viewer.nickname || viewer.username || '?').trim().charAt(0).toUpperCase();
      const name = document.createElement('span'); name.className = 'recent-creator-name'; name.textContent = viewer.nickname || viewer.username;
      item.append(avatar, name);
      list.appendChild(item);
    });
    viewersDialogContentEl.appendChild(list);
  }
  viewersDialogContentEl.classList.remove('viewers-refreshing');
  viewersDialogBackdropEl.hidden = false;
}
viewersLauncherEl?.addEventListener('click', openCurrentViewers);
viewersRefreshButtonEl?.addEventListener('click', openCurrentViewers);
viewersDialogCloseEl?.addEventListener('click', () => { viewersDialogBackdropEl.hidden = true; });
viewersDialogBackdropEl?.addEventListener('click', (event) => { if (event.target === viewersDialogBackdropEl) viewersDialogBackdropEl.hidden = true; });
const creatorPickerEl = document.querySelector('.creator-picker');
const recentCreatorsColumnEl = document.querySelector('.recent-creators-column');

if (creatorLauncherPanelContentEl) {
  if (creatorPickerEl) creatorLauncherPanelContentEl.appendChild(creatorPickerEl);
  if (recentCreatorsColumnEl) creatorLauncherPanelContentEl.appendChild(recentCreatorsColumnEl);
}

function setCreatorLauncherOpen(open) {
  if (!creatorLauncherPanelEl) return;
  creatorLauncherPanelEl.hidden = !open;
  creatorLauncherEl?.setAttribute('aria-expanded', String(open));
  creatorLauncherEl?.setAttribute('data-open', String(open));
}

creatorLauncherEl?.addEventListener('click', () => {
  setCreatorLauncherOpen(Boolean(creatorLauncherPanelEl?.hidden));
});
creatorLauncherPanelCloseEl?.addEventListener('click', () => setCreatorLauncherOpen(false));
creatorLauncherPanelEl?.addEventListener('click', (event) => {
  if (event.target === creatorLauncherPanelEl) setCreatorLauncherOpen(false);
});

// Wszystkie okna launcherów muszą być dziećmi body. W przeciwnym razie
// transformacje i siatka głównej aplikacji ograniczają position: fixed.
[
  notesDialogBackdropEl,
  achievementsDialogBackdropEl,
  settingsDialogBackdropEl,
  viewersDialogBackdropEl
].filter(Boolean).forEach((backdrop) => document.body.appendChild(backdrop));
const newNoteButton = document.getElementById('newNoteButton');
const editNoteButton = document.getElementById('editNoteButton');
const saveNoteButton = document.getElementById('saveNoteButton');
const deleteNoteButton = document.getElementById('deleteNoteButton');
const notesSearchEl = document.getElementById('notesSearch');
let radioAudioElements = [];
const radioHlsInstances = new Map();
const radioStationsEl = document.getElementById('radioStations');
const radioFloatingPlayerEl = document.getElementById('radioFloatingPlayer');
const radioFloatingIconEl = document.getElementById('radioFloatingIcon');
const radioFloatingNameEl = document.getElementById('radioFloatingName');
const radioFloatingStatusEl = document.getElementById('radioFloatingStatus');
const radioFloatingToggleEl = document.getElementById('radioFloatingToggle');
const radioLauncherEl = document.getElementById('radioLauncher');
const radioLauncherIconEl = document.getElementById('radioLauncherIcon');
const radioDialogBackdropEl = document.getElementById('radioDialogBackdrop');
const radioDialogEl = document.getElementById('radioDialog');
const radioDialogCloseEl = document.getElementById('radioDialogClose');
const appUpdateActionEl = document.getElementById('appUpdateAction');
const appUpdateCopyEl = document.getElementById('appUpdateCopy');
const appUpdateButtonEl = document.getElementById('appUpdateButton');
const updateProgressBackdropEl = document.getElementById('updateProgressBackdrop');
const updateProgressTitleEl = document.getElementById('updateProgressTitle');
const updateProgressCopyEl = document.getElementById('updateProgressCopy');
const updateProgressBarEl = document.getElementById('updateProgressBar');
const updateProgressPercentEl = document.getElementById('updateProgressPercent');
let activeRadioAudio = null;
let radioFloatingOpen = false;
let radioListeningStartedAt = 0;

function flushRadioAchievementProgress(force = false) {
  if (!radioListeningStartedAt || !activeRadioAudio) return;
  const isPlaying = !activeRadioAudio.paused && !activeRadioAudio.ended;
  if (!force && !isPlaying) return;
  const now = Date.now();
  const elapsed = Math.max(0, now - radioListeningStartedAt);
  achievementsState.radioListeningMs = Math.min(
    RADIO_ACHIEVEMENT_TARGET_MS,
    Math.max(0, Number(achievementsState.radioListeningMs) || 0) + elapsed
  );
  radioListeningStartedAt = isPlaying ? now : 0;
  saveAchievementsState();
  if (achievementsState.radioListeningMs >= RADIO_ACHIEVEMENT_TARGET_MS) {
    unlockAchievement('telegraphist');
  }
}

setInterval(() => flushRadioAchievementProgress(false), 5000);
window.addEventListener('beforeunload', () => flushRadioAchievementProgress(true));

function getUpdateUiText(key, version = '') {
  const language = appLanguage || 'pl';
  const texts = {
    pl: {
      available: `Dostępna aktualizacja${version ? ` ${version}` : ''}`,
      downloading: 'Pobieranie aktualizacji...',
      downloaded: 'Aktualizacja gotowa',
      installing: 'Instalowanie aktualizacji...',
      download: 'Pobierz',
      install: 'Aktualizuj',
      error: 'Nie udało się sprawdzić aktualizacji'
    },
    en: {
      available: `Update available${version ? ` ${version}` : ''}`,
      downloading: 'Downloading update...',
      downloaded: 'Update ready',
      installing: 'Installing update...',
      download: 'Download',
      install: 'Update',
      error: 'Could not check for updates'
    },
    de: {
      available: `Update verfügbar${version ? ` ${version}` : ''}`,
      downloading: 'Update wird heruntergeladen...',
      downloaded: 'Update bereit',
      installing: 'Update wird installiert...',
      download: 'Herunterladen',
      install: 'Aktualisieren',
      error: 'Update konnte nicht geprüft werden'
    },
    hu: {
      available: `Frissítés érhető el${version ? ` ${version}` : ''}`,
      downloading: 'Frissítés letöltése...',
      downloaded: 'A frissítés készen áll',
      installing: 'Frissítés telepítése...',
      download: 'Letöltés',
      install: 'Frissítés',
      error: 'Nem sikerült ellenőrizni a frissítéseket'
    }
  };
  return texts[language] && texts[language][key] ? texts[language][key] : texts.pl[key];
}

function syncUpdateAction(update = null) {
  if (!appUpdateActionEl || !appUpdateButtonEl) {
    return;
  }
  const status = update && update.status ? update.status : 'idle';
  const version = update && update.version ? update.version : '';
  const progress = Math.max(0, Math.min(100, Number(update && update.progress) || 0));
  // Błędy automatycznego sprawdzania (brak internetu, chwilowy GitHub/Tik.Tools)
  // nie są akcją aktualizacji i nie mogą wyświetlać przycisku „Pobierz”.
  const visible = ['available', 'downloading', 'downloaded', 'installing'].includes(status);
  appUpdateActionEl.hidden = !visible;
  appUpdateActionEl.dataset.state = status;
  if (appUpdateCopyEl) {
    const copyKey = status === 'available' ? 'available'
      : status === 'downloading' ? 'downloading'
        : status === 'downloaded' ? 'downloaded'
          : status === 'installing' ? 'installing' : 'error';
    appUpdateCopyEl.textContent = getUpdateUiText(copyKey, version);
  }
  appUpdateButtonEl.disabled = status === 'downloading' || status === 'installing';
  appUpdateButtonEl.textContent = status === 'downloaded'
    ? getUpdateUiText('install')
    : getUpdateUiText('download');

  const modalVisible = status === 'downloading' || status === 'installing';
  if (updateProgressBackdropEl) {
    updateProgressBackdropEl.hidden = !modalVisible;
  }
  if (updateProgressTitleEl) {
    updateProgressTitleEl.textContent = status === 'installing'
      ? 'Instalowanie aktualizacji'
      : 'Pobieranie aktualizacji';
  }
  if (updateProgressCopyEl) {
    updateProgressCopyEl.textContent = status === 'installing'
      ? 'Po zakończeniu instalacji aplikacja uruchomi się ponownie.'
      : 'Po zakończeniu pobierania instalacja będzie gotowa do uruchomienia.';
  }
  if (updateProgressBarEl) {
    updateProgressBarEl.style.width = `${progress}%`;
  }
  if (updateProgressPercentEl) {
    updateProgressPercentEl.textContent = `${Math.round(progress)}%`;
  }
}

if (appUpdateButtonEl) {
  appUpdateButtonEl.addEventListener('click', async () => {
    appUpdateButtonEl.disabled = true;
    const updateState = appUpdateActionEl ? appUpdateActionEl.dataset.state : '';
    if (updateState === 'downloaded') {
      await window.tiktokLive.installUpdate().catch(() => {});
      return;
    }
    if (updateState === 'error') {
      await window.tiktokLive.checkForUpdates().catch(() => {});
      return;
    }
    await window.tiktokLive.downloadUpdate().catch(() => {});
  });
}

const RADIO_STATIONS_BY_LANGUAGE = {
  pl: [
    ['Radio ZET', 'Radio ZET online', './assets/radio-zet.jpg', 'https://n-6-4.dcs.redcdn.pl/sc/o2/Eurozet/live/audio.livx'],
    ['RMF FM', 'RMF FM online', './assets/rmf-fm.jpg', 'https://rs6-krk2.rmfstream.pl/RMFFM48'],
    ['Radio Eska', 'Radio Eska online', './assets/radio-eska.jpg', 'https://radio.stream.smcdn.pl/icradio-p/2380-1.aac/playlist.m3u8'],
    ['Eska Rock', 'Eska Rock online', './assets/eska-rock.jpg', 'https://radio.stream.smcdn.pl/icradio-p/5380-1.aac/playlist.m3u8'],
    ['ESKA2', 'ESKA2 online', './assets/eska2.jpg', 'https://radio.stream.smcdn.pl/icradio-p/1380-1.aac/playlist.m3u8']
  ],
  de: [
    ['1LIVE', '1LIVE online hören', './assets/radio-1live.jpg', 'https://wdr-1live-live.icecastssl.wdr.de/wdr/1live/live/mp3/128/stream.mp3'],
    ['WDR 2', 'WDR 2 online hören', './assets/radio-wdr2.jpg', 'https://wdr-wdr2-rheinland.icecastssl.wdr.de/wdr/wdr2/rheinland/mp3/128/stream.mp3'],
    ['WDR 4', 'WDR 4 online hören', './assets/radio-wdr4.jpg', 'https://wdr-wdr4-live.icecastssl.wdr.de/wdr/wdr4/live/mp3/128/stream.mp3'],
    ['Antenne Bayern', 'Antenne Bayern online hören', './assets/radio-antenne-bayern.jpg', 'https://mp3channels.webradio.de/antenne?&aw_0_1st.playerid=AntenneBayernWebPlayer']
  ],
  en: [
    ['BBC Radio 1', 'BBC Radio 1 live', './assets/radio-bbc1.jpg', 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_one'],
    ['BBC Radio 2', 'BBC Radio 2 live', './assets/radio-bbc2.jpg', 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_two'],
    ['Heart', 'Heart London live', './assets/radio-heart.jpg', 'https://media-ssl.musicradio.com/HeartLondon?isLoggedIn=false'],
    ['Capital FM', 'Capital FM live', './assets/radio-capital.jpg', 'https://media-ssl.musicradio.com/Capital']
  ]
};

function renderRadioStations() {
  if (!radioStationsEl) {
    return;
  }
  const stations = RADIO_STATIONS_BY_LANGUAGE[appLanguage] || RADIO_STATIONS_BY_LANGUAGE.pl;
  radioStationsEl.replaceChildren(...stations.map(([name, description, icon, source]) => {
    const card = document.createElement('article');
    card.className = 'radio-station-card';
    const image = document.createElement('img');
    image.src = icon;
    image.alt = name;
    image.loading = 'lazy';
    image.decoding = 'async';
    const copy = document.createElement('div');
    copy.className = 'radio-station-copy';
    const title = document.createElement('h2');
    title.textContent = name;
    const note = document.createElement('p');
    note.textContent = description;
    const audio = document.createElement('audio');
    audio.controls = true;
    audio.preload = 'none';
    audio.dataset.radioAudio = '';
    audio.dataset.radioName = name;
    audio.dataset.radioIcon = icon;
    audio.dataset.radioSrc = source;
    audio.setAttribute('aria-label', name);
    copy.append(title, note, audio);
    card.append(image, copy);
    return card;
  }));
  radioAudioElements = Array.from(radioStationsEl.querySelectorAll('[data-radio-audio]'));
}

function updateRadioFloatingVisibility() {
  if (!radioFloatingPlayerEl) {
    return;
  }
  const visible = Boolean(activeRadioAudio);
  radioFloatingPlayerEl.hidden = !visible || !radioFloatingOpen;
  if (radioLauncherEl) {
    radioLauncherEl.hidden = false;
  }
}

function setRadioDialogOpen(open) {
  if (!radioDialogBackdropEl) {
    return;
  }
  const shouldOpen = Boolean(open);
  if (shouldOpen) {
    if (radioStationsEl && !radioStationsEl.childElementCount) {
      renderRadioStations();
    }
    initRadioPlayers();
  }
  radioDialogBackdropEl.hidden = !shouldOpen;
  document.body.classList.toggle('radio-dialog-open', shouldOpen);
  radioLauncherEl?.setAttribute('aria-expanded', String(shouldOpen));
  if (shouldOpen) {
    radioDialogCloseEl?.focus();
  } else {
    radioLauncherEl?.focus();
  }
}

function initRadioPlayers() {
  radioAudioElements.forEach((audio) => {
    if (audio.dataset.radioInitialized === 'true') {
      return;
    }

    const source = audio.dataset.radioSrc || '';
    audio.dataset.radioInitialized = 'true';
    audio.dataset.radioSource = source;

    if (source.endsWith('.m3u8') && window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({ enableWorker: true, lowLatencyMode: false });
      hls.loadSource(source);
      hls.attachMedia(audio);
      radioHlsInstances.set(audio, hls);
    } else {
      audio.src = source;
    }

    if (audio.dataset.radioPlayBound !== 'true') {
      audio.dataset.radioPlayBound = 'true';
      audio.addEventListener('play', () => {
        flushRadioAchievementProgress(false);
        activeRadioAudio = audio;
        radioListeningStartedAt = Date.now();
        if (radioFloatingNameEl) {
          radioFloatingNameEl.textContent = audio.dataset.radioName || 'Radio';
        }
        if (radioFloatingStatusEl) {
          radioFloatingStatusEl.textContent = 'Odtwarzanie';
        }
        if (radioFloatingPlayerEl) {
          updateRadioFloatingVisibility();
        }
        if (radioFloatingToggleEl) {
          radioFloatingToggleEl.textContent = 'Ⅱ';
          radioFloatingToggleEl.setAttribute('aria-label', 'Pauza radia');
        }
        radioAudioElements.forEach((otherAudio) => {
          if (otherAudio !== audio) {
            otherAudio.pause();
          }
        });
      });
      audio.addEventListener('pause', () => {
        if (activeRadioAudio !== audio) {
          return;
        }
        flushRadioAchievementProgress(true);
        radioListeningStartedAt = 0;
        if (radioFloatingStatusEl) {
          radioFloatingStatusEl.textContent = 'Wstrzymano';
        }
        if (radioFloatingToggleEl) {
          radioFloatingToggleEl.textContent = '▶';
          radioFloatingToggleEl.setAttribute('aria-label', 'Wznów radio');
        }
      });
    }
  });
}

function stopRadioPlayers() {
  flushRadioAchievementProgress(true);
  radioAudioElements.forEach((audio) => {
    audio.pause();
    const hls = radioHlsInstances.get(audio);
    if (hls) {
      hls.destroy();
      radioHlsInstances.delete(audio);
    }
    audio.removeAttribute('src');
    audio.load();
    audio.dataset.radioInitialized = 'false';
  });
  activeRadioAudio = null;
  radioListeningStartedAt = 0;
  radioFloatingOpen = false;
  updateRadioFloatingVisibility();
}

function toggleRadioFloatingPlayer() {
  if (!radioFloatingPlayerEl || !activeRadioAudio) {
    return;
  }
  radioFloatingOpen = !radioFloatingOpen;
  updateRadioFloatingVisibility();
}

if (radioFloatingToggleEl) {
  radioFloatingToggleEl.addEventListener('click', () => {
    if (!activeRadioAudio) {
      return;
    }
    if (activeRadioAudio.paused) {
      activeRadioAudio.play().catch(() => {});
    } else {
      activeRadioAudio.pause();
    }
  });
}

if (radioLauncherEl) {
  radioLauncherEl.addEventListener('click', () => {
    setRadioDialogOpen(Boolean(radioDialogBackdropEl?.hidden));
  });
}
radioDialogCloseEl?.addEventListener('click', () => setRadioDialogOpen(false));
radioDialogBackdropEl?.addEventListener('click', (event) => {
  if (event.target === radioDialogBackdropEl) {
    setRadioDialogOpen(false);
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && radioDialogBackdropEl && !radioDialogBackdropEl.hidden) {
    setRadioDialogOpen(false);
  }
});
const notesListEl = document.getElementById('notesList');
const noteTitleInput = document.getElementById('noteTitleInput');
const noteContentInput = document.getElementById('noteContentInput');
const notePreviewEl = document.getElementById('notePreview');
const noteMetaEl = document.getElementById('noteMeta');
const noteFormatButtons = Array.from(document.querySelectorAll('[data-note-format]'));
const czesterPanelEl = document.getElementById('czesterPanel');
const czesterLauncherEl = document.getElementById('czesterLauncher');
const czesterCloseEl = document.getElementById('czesterClose');
const czesterTitleStatusEl = document.getElementById('czesterTitleStatus');
const czesterMessagesEl = document.getElementById('czesterMessages');
const czesterQuestionsButtonEl = document.getElementById('czesterQuestionsButton');
const czesterModeratorsButtonEl = document.getElementById('czesterModeratorsButton');
const czesterAiPanelEl = document.getElementById('czesterAiPanel');
const czesterAiStatusEl = document.getElementById('czesterAiStatus');
const czesterAiInstallEl = document.getElementById('czesterAiInstall');
const achievementsListEl = document.getElementById('achievementsList');
const boxesArchiveListEl = document.getElementById('boxesArchiveList');
const boxesArchiveSearchEl = document.getElementById('boxesArchiveSearch');
const boxesSessionEl = document.getElementById('boxesSession');
const boxesSessionTitleEl = document.getElementById('boxesSessionTitle');
const boxesSessionMetaEl = document.getElementById('boxesSessionMeta');
const refreshBoxesArchiveButton = document.getElementById('refreshBoxesArchive');
const boxesListEl = document.getElementById('boxesList');
const boxesEmptyEl = document.getElementById('boxesEmpty');
const boxesSummaryCountEl = document.getElementById('boxesSummaryCount');
const boxesSummaryCoinsEl = document.getElementById('boxesSummaryCoins');
const boxesSummaryPeopleEl = document.getElementById('boxesSummaryPeople');
const redeemCodeInput = document.getElementById('redeemCodeInput');
const redeemCodeButton = document.getElementById('redeemCodeButton');
const redeemCodeStatus = document.getElementById('redeemCodeStatus');
const appVersionEl = document.getElementById('appVersion');
const appTaskbarClockEl = document.getElementById('appTaskbarClock');
const appTaskbarTimeEl = document.getElementById('appTaskbarTime');
const appTaskbarDateEl = document.getElementById('appTaskbarDate');
const ttsEnabledEl = document.getElementById('ttsEnabled');
const ttsRolesOnlyEl = document.getElementById('ttsRolesOnly');
const ttsSkipVulgarNicknamesEl = document.getElementById('ttsSkipVulgarNicknames');
const ttsSkipVulgarMessagesEl = document.getElementById('ttsSkipVulgarMessages');
const ttsSkipSpamMessagesEl = document.getElementById('ttsSkipSpamMessages');
const ttsVoiceEl = document.getElementById('ttsVoice');
const ttsRateEl = document.getElementById('ttsRate');
const ttsRateValueEl = document.getElementById('ttsRateValue');
const ttsVolumeEl = document.getElementById('ttsVolume');
const ttsVolumeValueEl = document.getElementById('ttsVolumeValue');
const chatDelayEl = document.getElementById('chatDelay');
const chatDelayValueEl = document.getElementById('chatDelayValue');
const systemAutoLaunchEl = document.getElementById('systemAutoLaunch');
const systemRunInBackgroundEl = document.getElementById('systemRunInBackground');
const systemMinimizeToTrayEl = document.getElementById('systemMinimizeToTray');
const appLanguageEl = document.getElementById('appLanguage');
const timeFormatEl = document.getElementById('timeFormat');
const clearTikTokSessionButton = document.getElementById('clearTikTokSession');
const firstRunLanguageEl = document.getElementById('firstRunLanguage');
const firstRunLanguageButtons = Array.from(document.querySelectorAll('[data-first-language]'));

const queue = [];
const queuedMessageRevealAt = new WeakMap();
const visibleMessages = [];
const userAvatars = new Map();
const liveViewerAvatars = new Map();
let viewerRefreshToken = 0;
const VIEWER_AVATAR_CACHE_KEY = 'czatbox.viewer.avatars.v1';

function loadViewerAvatarCache() {
  try {
    const saved = JSON.parse(localStorage.getItem(VIEWER_AVATAR_CACHE_KEY) || '{}');
    Object.entries(saved).forEach(([key, value]) => { if (typeof value === 'string' && value) liveViewerAvatars.set(key, value); });
  } catch { /* corrupted cache is safely ignored */ }
}

function saveViewerAvatarCache() {
  try {
    localStorage.setItem(VIEWER_AVATAR_CACHE_KEY, JSON.stringify(Object.fromEntries(liveViewerAvatars)));
  } catch { /* storage limits must not interrupt chat */ }
}

function mergeViewerAvatars(viewers) {
  let changed = false;
  (viewers || []).forEach((viewer) => {
    if (!viewer?.avatar) return;
    [viewer.username, viewer.nickname, ...(viewer.aliases || [])].filter(Boolean).forEach((name) => {
      const key = String(name).trim().toLowerCase();
      if (liveViewerAvatars.get(key) !== viewer.avatar) { liveViewerAvatars.set(key, viewer.avatar); changed = true; }
    });
  });
  if (changed) saveViewerAvatarCache();
}

loadViewerAvatarCache();
const renderedMessageElements = new Map();
const queuedMessagesById = new Map();
const visibleMessagesById = new Map();
const giftTotalsByUser = new Map();
const tapTotalsByUser = new Map();
const liveBoxes = [];
const boxesArchiveContentCache = new Map();
let boxesArchiveEntries = [];
let selectedBoxesArchiveId = '';
let selectedBoxesArchive = null;
let boxesArchiveLoading = false;
let boxesArchiveRefreshTimer = null;
const activeChatUsers = new Map();
const activeModerators = new Map();
const speechQueue = [];
const activeFilters = new Set(loadEventFilters(CHAT_FILTER_SETTINGS_KEY));
const activeArchiveFilters = new Set(loadEventFilters(ARCHIVE_FILTER_SETTINGS_KEY));
let state = {};
let avatarImages = [];
let speechVoices = [];
let ttsSettings = loadTtsSettings();
let chatDelayMs = loadChatDelayMs();
let chatStyle = loadChatStyle();
// Zakupy muszą zostać odczytane przed motywem. Motywy sklepowe sprawdzają
// odblokowanie już podczas startu renderera.
let redeemedFeatures = loadRedeemedFeatures();
let appTheme = loadAppTheme();
let appAppearance = loadAppAppearance();
let generalSettings = loadGeneralSettings();
let systemSettings = loadSystemSettings();
let appLanguage = systemSettings.language;
let timeFormat = systemSettings.timeFormat;
let speechPlaying = false;
let currentPiperAudio = null;
let currentPiperAudioContext = null;
let revealFallbackTimer;
let syncedCreatorSuggestionsKey = '';
let battleBannerTimer;
let coinsPromoTimer = null;
let coinsPromoCreatorKey = '';
let firstRunLanguageChoiceInitialized = false;
let firstRunLanguageChoiceBusy = false;
let activeSection = 'chatbox';
let activeSettingsTab = 'general';
let activeAboutTab = 'program';
let selectedArchiveId = '';
let archiveEntries = [];
let selectedArchive = null;
let noteEntries = [];
let selectedNoteId = '';
let selectedNote = null;
let noteEditorMode = 'edit';
let archiveLastRefreshAt = 0;
let notesLastRefreshAt = 0;
let boxesArchiveLastRefreshAt = 0;
let czesterMessages = [];
let czesterTypingTimer = null;
let czesterUserAvatar = '';
let czesterAiBusy = false;
let czesterOllamaPromptShownThisSession = false;
let renderKeyCounter = 0;
let timeFormatterKey = '';
let timeFormatter = null;
let pendingScrollToEnd = false;
let liveViewerCount = 0;
let appearanceBroadcastChannel = null;
let chatMessageCount = 0;
let recentCreators = loadRecentCreators();
let favoriteCreators = loadFavoriteCreators();
let recentCreatorMeta = loadRecentCreatorMeta();
let czesterMemory = loadCzesterMemory();
let czesterSpamBuckets = new Map();
let czesterSpamAlerts = new Map();
let czesterBattleNoticeAlerts = new Map();
let czesterLiveAnalysisMessages = [];
let czesterLiveAnalysisTimer = null;
let czesterLastAnalysisAt = 0;
let czesterLastAnalysisMessageCount = 0;
let czesterLiveEndedSummarySent = false;
let czesterMemorySaveTimer = null;
let czesterCurrentLiveSessionKey = '';
let czesterArchiveIndexBusy = false;
let chatFreezeTimer = null;
let lastSubmittedCreator = '';
let creatorSuggestionItems = [];
let activeCreatorSuggestionIndex = -1;
let achievementsState = loadAchievementsState();
updateTalarkiUi();
let lastHondaOnlineAlertAt = 0;
let battleScorebarState = null;
let battleScorebarTimer = null;
let battleScorebarHideTimer = null;

function getTimeFormatter() {
  const key = `${appLanguage}:${timeFormat}`;
  if (timeFormatter && timeFormatterKey === key) {
    return timeFormatter;
  }

  const options = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };

  if (timeFormat === '12') {
    options.hour12 = true;
  } else if (timeFormat === '24') {
    options.hour12 = false;
  }

  timeFormatterKey = key;
  timeFormatter = new Intl.DateTimeFormat(
    timeFormat === 'auto' ? undefined : LANGUAGE_LOCALES[appLanguage],
    options
  );
  return timeFormatter;
}

function formatTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return getTimeFormatter().format(date);
}

function updateTaskbarClock() {
  if (!appTaskbarClockEl) {
    return;
  }
  const now = new Date();
  const date = new Intl.DateTimeFormat(
    timeFormat === 'auto' ? undefined : (LANGUAGE_LOCALES[appLanguage] || LANGUAGE_LOCALES.pl),
    { day: '2-digit', month: '2-digit', year: 'numeric' }
  ).format(now);
  appTaskbarClockEl.textContent = `${date} · ${formatTime(now)}`;
}

// Render the taskbar clock as two stacked, icon-labelled values.
function updateTaskbarClock() {
  if (!appTaskbarClockEl) return;
  const now = new Date();
  const date = new Intl.DateTimeFormat(
    timeFormat === 'auto' ? undefined : (LANGUAGE_LOCALES[appLanguage] || LANGUAGE_LOCALES.pl),
    { day: '2-digit', month: '2-digit', year: 'numeric' }
  ).format(now);
  if (appTaskbarTimeEl && appTaskbarDateEl) {
    appTaskbarTimeEl.textContent = formatTime(now);
    appTaskbarDateEl.textContent = date;
  }
}

function loadTtsSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(TTS_SETTINGS_KEY) || '{}');
    return {
      enabled: Boolean(saved.enabled),
      voiceURI: typeof saved.voiceURI === 'string' ? saved.voiceURI : '',
      rate: Number(saved.rate) || 1,
      volume: Number.isFinite(Number(saved.volume)) ? Number(saved.volume) : 1,
      rolesOnly: Boolean(saved.rolesOnly),
      skipVulgarNicknames: Boolean(saved.skipVulgarNicknames),
      skipVulgarMessages: Boolean(saved.skipVulgarMessages),
      skipSpamMessages: Boolean(saved.skipSpamMessages)
    };
  } catch {
    return {
      enabled: false,
      voiceURI: '',
      rate: 1,
      volume: 1,
      rolesOnly: false,
      skipVulgarNicknames: false,
      skipVulgarMessages: false,
      skipSpamMessages: false
    };
  }
}

function saveTtsSettings() {
  localStorage.setItem(TTS_SETTINGS_KEY, JSON.stringify(ttsSettings));
}

function normalizeGeneralSettings(value) {
  const next = { ...DEFAULT_GENERAL_SETTINGS, ...(value && typeof value === 'object' ? value : {}) };
  return {
    multiplierNotifications: true,
    statsToolbox: next.statsToolbox !== false,
    galleryAvatars: next.galleryAvatars !== false,
    deleteOldArchives: Boolean(next.deleteOldArchives),
    bigPictureMode: Boolean(next.bigPictureMode),
    quietMode: Boolean(next.quietMode)
  };
}

function loadGeneralSettings() {
  try {
    return normalizeGeneralSettings(JSON.parse(localStorage.getItem(GENERAL_SETTINGS_KEY) || '{}'));
  } catch {
    return { ...DEFAULT_GENERAL_SETTINGS };
  }
}

function saveGeneralSettings() {
  generalSettings.multiplierNotifications = true;
  localStorage.setItem(GENERAL_SETTINGS_KEY, JSON.stringify(generalSettings));
}

function getChatDelayIndex(delayMs) {
  const index = CHAT_DELAY_OPTIONS.indexOf(Number(delayMs));
  return index >= 0 ? index : CHAT_DELAY_OPTIONS.indexOf(DEFAULT_CHAT_DELAY_MS);
}

function loadChatDelayMs() {
  const rawSaved = localStorage.getItem(CHAT_DELAY_SETTINGS_KEY);
  const saved = Number(rawSaved);
  if (rawSaved === null) {
    return DEFAULT_CHAT_DELAY_MS;
  }
  if (saved === 1800 && localStorage.getItem(CHAT_DELAY_DEFAULT_MIGRATION_KEY) !== '1') {
    localStorage.setItem(CHAT_DELAY_SETTINGS_KEY, String(DEFAULT_CHAT_DELAY_MS));
    localStorage.setItem(CHAT_DELAY_DEFAULT_MIGRATION_KEY, '1');
    return DEFAULT_CHAT_DELAY_MS;
  }
  return CHAT_DELAY_OPTIONS[getChatDelayIndex(saved)];
}

function saveChatDelayMs() {
  localStorage.setItem(CHAT_DELAY_SETTINGS_KEY, String(chatDelayMs));
  localStorage.setItem(CHAT_DELAY_DEFAULT_MIGRATION_KEY, '1');
}

function loadChatStyle() {
  const saved = localStorage.getItem(CHAT_STYLE_SETTINGS_KEY);
  return CHAT_STYLES.includes(saved) ? saved : 'compact';
}

function saveChatStyle() {
  localStorage.setItem(CHAT_STYLE_SETTINGS_KEY, chatStyle);
}

function normalizeEventFilters(value, fallbackToDefault = false) {
  const source = Array.isArray(value) ? value : [];
  const filtered = source.filter((filter) => DEFAULT_EVENT_FILTERS.includes(filter));
  if (filtered.length || !fallbackToDefault) {
    return Array.from(new Set(filtered));
  }

  return [...DEFAULT_EVENT_FILTERS];
}

function loadEventFilters(key) {
  const saved = localStorage.getItem(key);
  if (saved === null) {
    return [...DEFAULT_EVENT_FILTERS];
  }

  try {
    return normalizeEventFilters(JSON.parse(saved));
  } catch {
    return [...DEFAULT_EVENT_FILTERS];
  }
}

function saveEventFilters(key, filters) {
  localStorage.setItem(key, JSON.stringify(normalizeEventFilters(Array.from(filters || []))));
}

function loadStoredRedeemCodes() {
  try {
    const saved = JSON.parse(localStorage.getItem(REDEEMED_FEATURES_KEY) || '{}');
    const codes = Array.isArray(saved.codes)
      ? Array.from(new Set(saved.codes.map(normalizeRedeemCode).filter(Boolean)))
      : [];
    if (saved.hondaAlerts && !codes.includes(HONDA_REDEEM_CODE)) {
      codes.push(HONDA_REDEEM_CODE);
    }
    if (saved.ollamaPrompt && !codes.includes(OLLAMA_REDEEM_CODE)) {
      codes.push(OLLAMA_REDEEM_CODE);
    }
    if (saved.boxesPanel && !codes.includes(BOXES_REDEEM_CODE)) {
      codes.push(BOXES_REDEEM_CODE);
    }
    if (saved.miamiViceTheme && !codes.includes(MIAMI_VICE_REDEEM_CODE)) {
      codes.push(MIAMI_VICE_REDEEM_CODE);
    }
    if (saved.wildGalaxyTheme && !codes.includes(WILD_GALAXY_STORE_CODE)) {
      codes.push(WILD_GALAXY_STORE_CODE);
    }
    return codes;
  } catch {
    return [];
  }
}

function isAppThemeUnlocked(theme) {
  if (theme === 'miami-vice') {
    return isMiamiViceThemeUnlocked();
  }
  if (theme === 'dzika-galaktyka') {
    return isWildGalaxyThemeUnlocked();
  }
  if (theme === 'swiat-brikersa') {
    return isBrikersWorldThemeUnlocked();
  }
  return true;
}

function loadAppTheme() {
  const saved = localStorage.getItem(APP_THEME_SETTINGS_KEY);
  return APP_THEMES.includes(saved) && isAppThemeUnlocked(saved) ? saved : 'rose-black';
}

function saveAppTheme() {
  localStorage.setItem(APP_THEME_SETTINGS_KEY, appTheme);
}

function loadAppAppearance() {
  const saved = localStorage.getItem(APP_APPEARANCE_SETTINGS_KEY);
  return APP_APPEARANCES.includes(saved) && saved !== 'retro-kb2' ? saved : 'standard';
}

function saveAppAppearance() {
  localStorage.setItem(APP_APPEARANCE_SETTINGS_KEY, appAppearance);
}

function createDefaultAchievementsState() {
  return {
    unlocked: {},
    talarkiRewards: [],
    creatorConnections: {},
    uniqueCreators: [],
    radioListeningMs: 0
  };
}

function normalizeAchievementsState(value) {
  const fallback = createDefaultAchievementsState();
  if (!value || typeof value !== 'object') {
    return fallback;
  }

  const unlocked = value.unlocked && typeof value.unlocked === 'object' ? value.unlocked : {};
  const creatorConnections = value.creatorConnections && typeof value.creatorConnections === 'object'
    ? value.creatorConnections
    : {};
  const uniqueCreators = Array.isArray(value.uniqueCreators) ? value.uniqueCreators : [];
  const talarkiRewards = Array.isArray(value.talarkiRewards) ? value.talarkiRewards : [];

  return {
    unlocked: Object.fromEntries(
      Object.entries(unlocked)
        .filter(([id, unlockedAt]) => ACHIEVEMENT_DEFINITIONS.some((achievement) => achievement.id === id) && typeof unlockedAt === 'string')
    ),
    talarkiRewards: Array.from(new Set(talarkiRewards.filter((id) => ACHIEVEMENT_DEFINITIONS.some((achievement) => achievement.id === id)))),
    creatorConnections: Object.fromEntries(
      Object.entries(creatorConnections)
        .map(([handle, count]) => [normalizeCreatorHandle(handle), Math.max(0, Number(count) || 0)])
        .filter(([handle]) => Boolean(handle))
    ),
    uniqueCreators: Array.from(new Set(uniqueCreators.map(normalizeCreatorHandle).filter(Boolean))),
    radioListeningMs: Math.max(0, Math.min(RADIO_ACHIEVEMENT_TARGET_MS, Number(value.radioListeningMs) || 0))
  };
}

function loadAchievementsState() {
  try {
    return normalizeAchievementsState(JSON.parse(localStorage.getItem(ACHIEVEMENTS_KEY) || '{}'));
  } catch {
    return createDefaultAchievementsState();
  }
}

function saveAchievementsState() {
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievementsState));
}

function loadRedeemedFeatures() {
  try {
    const saved = JSON.parse(localStorage.getItem(REDEEMED_FEATURES_KEY) || '{}');
    const codes = loadStoredRedeemCodes();
    return {
      hondaAlerts: Boolean(saved.hondaAlerts) || codes.includes(HONDA_REDEEM_CODE),
      ollamaPrompt: Boolean(saved.ollamaPrompt) || codes.includes(OLLAMA_REDEEM_CODE),
      boxesPanel: Boolean(saved.boxesPanel) || codes.includes(BOXES_REDEEM_CODE),
      miamiViceTheme: Boolean(saved.miamiViceTheme) || codes.includes(MIAMI_VICE_REDEEM_CODE),
      wildGalaxyTheme: Boolean(saved.wildGalaxyTheme) || codes.includes(WILD_GALAXY_STORE_CODE),
      brickersWorldTheme: Boolean(saved.brickersWorldTheme),
      brickersGame: Boolean(saved.brickersGame),
      codes
    };
  } catch {
    return {
      hondaAlerts: false,
      ollamaPrompt: false,
      boxesPanel: false,
      miamiViceTheme: false,
      wildGalaxyTheme: false,
      brickersWorldTheme: false,
      brickersGame: false,
      codes: []
    };
  }
}

function saveRedeemedFeatures() {
  localStorage.setItem(REDEEMED_FEATURES_KEY, JSON.stringify(redeemedFeatures));
}

function normalizeRedeemCode(value) {
  return String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function formatRedeemCode(value) {
  return normalizeRedeemCode(value).slice(0, 16).replace(/(.{4})(?=.)/g, '$1 ');
}

function isHondaAlertsUnlocked() {
  return Boolean(redeemedFeatures.hondaAlerts);
}

function isOllamaPromptUnlocked() {
  return Boolean(redeemedFeatures.ollamaPrompt);
}

function isBoxesPanelUnlocked() {
  return Boolean(redeemedFeatures.boxesPanel);
}

function isMiamiViceThemeUnlocked() {
  try {
    const saved = JSON.parse(localStorage.getItem(REDEEMED_FEATURES_KEY) || '{}');
    return Boolean(saved.miamiViceTheme) || loadStoredRedeemCodes().includes(MIAMI_VICE_REDEEM_CODE);
  } catch {
    return loadStoredRedeemCodes().includes(MIAMI_VICE_REDEEM_CODE);
  }
}

function isWildGalaxyThemeUnlocked() {
  try {
    const saved = JSON.parse(localStorage.getItem(REDEEMED_FEATURES_KEY) || '{}');
    return Boolean(saved.wildGalaxyTheme) || loadStoredRedeemCodes().includes(WILD_GALAXY_STORE_CODE);
  } catch {
    return loadStoredRedeemCodes().includes(WILD_GALAXY_STORE_CODE);
  }
}

function isBrikersGameUnlocked() {
  return Boolean(redeemedFeatures?.brickersGame);
}

function isBrikersWorldThemeUnlocked() {
  return Boolean(redeemedFeatures?.brickersWorldTheme);
}

function syncLockedThemeChoice(inputId, unlocked) {
  const input = document.getElementById(inputId);
  const choice = input ? input.closest('.setting-choice') : null;

  if (choice) {
    choice.hidden = false;
    choice.dataset.locked = String(!unlocked);
    choice.classList.toggle('theme-choice-locked', !unlocked);
    const lockBadge = choice.querySelector('.theme-lock-badge');
    if (lockBadge) {
      lockBadge.hidden = unlocked;
    }
  }
  if (input) {
    input.disabled = !unlocked;
  }
}

function syncRedeemedFeatureNavigation() {
  const boxesButton = sidebarButtons.find((button) => button.dataset.section === 'boxes');
  const boxesPanel = viewPanels.find((panel) => panel.dataset.view === 'boxes');
  const unlocked = isBoxesPanelUnlocked();
  const miamiUnlocked = isMiamiViceThemeUnlocked();
  const wildGalaxyUnlocked = isWildGalaxyThemeUnlocked();
  const brickersWorldUnlocked = isBrikersWorldThemeUnlocked();

  if (boxesButton) {
    boxesButton.hidden = !unlocked;
  }
  if (boxesPanel && !unlocked) {
    boxesPanel.hidden = true;
  }
  if (!unlocked && activeSection === 'boxes') {
    setActiveSection('chatbox');
  }


  syncLockedThemeChoice('themeMiamiVice', miamiUnlocked);
  syncLockedThemeChoice('themeDzikaGalaktyka', wildGalaxyUnlocked);
  syncLockedThemeChoice('themeSwiatBrikersa', brickersWorldUnlocked);
  if ((!miamiUnlocked && appTheme === 'miami-vice')
    || (!wildGalaxyUnlocked && appTheme === 'dzika-galaktyka')
    || (!brickersWorldUnlocked && appTheme === 'swiat-brikersa')) {
    appTheme = 'rose-black';
    saveAppTheme();
    if (typeof applyAppearanceSettings === 'function') {
      applyAppearanceSettings();
    }
    if (typeof broadcastAppearanceSettings === 'function') {
      broadcastAppearanceSettings();
    }
  }
}

function setRedeemCodeStatus(message, tone = 'idle') {
  if (!redeemCodeStatus) {
    return;
  }

  redeemCodeStatus.textContent = message;
  redeemCodeStatus.dataset.tone = tone;
}

function syncRedeemCodeUi() {
  if (redeemCodeInput) {
    redeemCodeInput.disabled = false;
  }
  if (redeemCodeButton) {
    redeemCodeButton.disabled = false;
  }
  setRedeemCodeStatus(t('settings.redeem.waiting'), 'idle');
}

function redeemEnteredCode() {
  if (!redeemCodeInput) {
    return;
  }

  const normalized = normalizeRedeemCode(redeemCodeInput.value);
  if ((redeemedFeatures.codes || []).includes(normalized)) {
    redeemCodeInput.value = '';
    setRedeemCodeStatus(t('settings.redeem.alreadyUsed'), 'success');
    syncRedeemedFeatureNavigation();
    if (normalized === OLLAMA_REDEEM_CODE) {
      maybeShowCzesterOllamaPrompt({ force: true });
    }
    return;
  }

  if (normalized !== HONDA_REDEEM_CODE
    && normalized !== OLLAMA_REDEEM_CODE
    && normalized !== BOXES_REDEEM_CODE
    && normalized !== MIAMI_VICE_REDEEM_CODE
    && normalized !== TALARKI_BONUS_CODE
    && normalized !== normalizeRedeemCode(DEV_TALARKI_CODE)) {
    setRedeemCodeStatus(t('settings.redeem.invalid'), 'error');
    return;
  }

  if (normalized === HONDA_REDEEM_CODE) {
    redeemedFeatures.hondaAlerts = true;
  }
  if (normalized === OLLAMA_REDEEM_CODE) {
    redeemedFeatures.ollamaPrompt = true;
  }
  if (normalized === BOXES_REDEEM_CODE) {
    redeemedFeatures.boxesPanel = true;
  }
  if (normalized === MIAMI_VICE_REDEEM_CODE) {
    redeemedFeatures.miamiViceTheme = true;
  }
  if (normalized === TALARKI_BONUS_CODE) {
    talarki = Math.min(100000, talarki + 1000);
    localStorage.setItem(TALARKI_KEY, String(talarki));
    updateTalarkiUi();
  }
  if (normalized === normalizeRedeemCode(DEV_TALARKI_CODE)) {
    talarki = Math.min(100000, talarki + 50000);
    localStorage.setItem(TALARKI_KEY, String(talarki));
    updateTalarkiUi();
  }
  redeemedFeatures.codes = Array.from(new Set([...(redeemedFeatures.codes || []), normalized]));
  saveRedeemedFeatures();
  redeemCodeInput.value = '';
  setRedeemCodeStatus(
    normalized === OLLAMA_REDEEM_CODE
      ? t('settings.redeem.unlockedOllama')
      : normalized === BOXES_REDEEM_CODE
        ? t('settings.redeem.unlockedBoxes')
        : normalized === MIAMI_VICE_REDEEM_CODE
          ? t('settings.redeem.unlockedMiamiVice')
        : normalized === TALARKI_BONUS_CODE
          ? 'Kod przyjęty. Dodano 1000 Talarków.'
          : normalized === normalizeRedeemCode(DEV_TALARKI_CODE)
            ? t('settings.redeem.unlockedTalarki')
          : t('settings.redeem.unlocked'),
    'success'
  );
  syncRedeemedFeatureNavigation();
  renderBoxesPanel();
  if (normalized === OLLAMA_REDEEM_CODE) {
    maybeShowCzesterOllamaPrompt({ force: true });
  }
}

function initRedeemCodeSettings() {
  syncRedeemCodeUi();

  if (redeemCodeInput) {
    redeemCodeInput.addEventListener('input', () => {
      const selectionAtEnd = redeemCodeInput.selectionStart === redeemCodeInput.value.length;
      redeemCodeInput.value = formatRedeemCode(redeemCodeInput.value);
      if (selectionAtEnd) {
        redeemCodeInput.setSelectionRange(redeemCodeInput.value.length, redeemCodeInput.value.length);
      }
      if (!redeemCodeInput.value) {
        syncRedeemCodeUi();
      }
    });
    redeemCodeInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        redeemEnteredCode();
      }
    });
  }

  if (redeemCodeButton) {
    redeemCodeButton.addEventListener('click', redeemEnteredCode);
  }
}

function unlockAchievement(id) {
  if (!ACHIEVEMENT_DEFINITIONS.some((achievement) => achievement.id === id) || achievementsState.unlocked[id]) {
    return false;
  }

  achievementsState.unlocked[id] = new Date().toISOString();
  const reward = ACHIEVEMENT_DEFINITIONS.find((achievement) => achievement.id === id)?.talarki || 0;
  if (reward && !achievementsState.talarkiRewards.includes(id)) {
    talarki = Math.min(100000, talarki + reward);
    localStorage.setItem(TALARKI_KEY, String(talarki));
    achievementsState.talarkiRewards.push(id);
    updateTalarkiUi();
  }
  saveAchievementsState();
  renderAchievements();
  return true;
}

function migrateTalarkiAchievementRewards() {
  let changed = false;
  ACHIEVEMENT_DEFINITIONS.forEach((achievement) => {
    if (!achievementsState.unlocked[achievement.id] || achievementsState.talarkiRewards.includes(achievement.id)) return;
    const reward = Number(achievement.talarki) || 0;
    if (reward > 0) {
      talarki = Math.min(100000, talarki + reward);
      achievementsState.talarkiRewards.push(achievement.id);
      changed = true;
    }
  });
  if (changed) {
    localStorage.setItem(TALARKI_KEY, String(talarki));
    saveAchievementsState();
    updateTalarkiUi();
  }
}

migrateTalarkiAchievementRewards();
if (isBrikersGameUnlocked()) unlockAchievement('true-friend');
if (achievementsState.radioListeningMs >= RADIO_ACHIEVEMENT_TARGET_MS) unlockAchievement('telegraphist');

function renderAchievements() {
  if (!achievementsListEl) {
    return;
  }

  achievementsListEl.replaceChildren();

  const fragment = document.createDocumentFragment();
  ACHIEVEMENT_DEFINITIONS.forEach((achievement) => {
    const unlocked = Boolean(achievementsState.unlocked[achievement.id]);
    const card = document.createElement('article');
    card.className = 'achievement-card';
    card.dataset.unlocked = String(unlocked);
    if (!unlocked) {
      card.setAttribute('aria-label', 'Zablokowane osiągnięcie');
    }

    const image = document.createElement('span');
    image.className = 'achievement-image';
    image.textContent = achievement.icon;
    image.setAttribute('aria-hidden', 'true');

    const copy = document.createElement('span');
    copy.className = 'achievement-copy';

    const title = document.createElement('strong');
    title.className = 'achievement-title';
    title.textContent = t(achievement.titleKey);

    const description = document.createElement('span');
    description.className = 'achievement-description';
    description.textContent = t(achievement.descriptionKey);

    const reward = document.createElement('span');
    reward.className = 'achievement-reward';
    reward.innerHTML = `<span data-ui-icon="coin" aria-hidden="true"></span><span>${achievement.talarki} Talarków</span>`;

    copy.append(title, description, reward);
    card.append(image, copy);
    fragment.appendChild(card);
  });

  achievementsListEl.appendChild(fragment);
  hydrateUiIcons(achievementsListEl);
}

function trackLoggedInAchievement(nextState) {
  if (nextState && nextState.loggedIn) {
    unlockAchievement('first-login');
  }
}

function trackCreatorConnectionAchievement(nextState, options = {}) {
  if (!nextState || !isOnlineConnectionState(nextState)) {
    return;
  }
  if (!options.countConnection) {
    return;
  }

  const handle = normalizeCreatorHandle(
    nextState.currentCreator && nextState.currentCreator.username
      ? nextState.currentCreator.username
      : getCreatorUsernameFromState()
  );
  if (!handle) {
    return;
  }

  achievementsState.creatorConnections[handle] = (Number(achievementsState.creatorConnections[handle]) || 0) + 1;
  if (!achievementsState.uniqueCreators.includes(handle)) {
    achievementsState.uniqueCreators.push(handle);
  }

  if (handle === KAMA_CREATOR_HANDLE && achievementsState.creatorConnections[handle] >= 10) {
    unlockAchievement('kama-10-connections');
  }
  if (achievementsState.uniqueCreators.length >= 10) {
    unlockAchievement('ten-creators');
  }

  saveAchievementsState();
  renderAchievements();
}

function syncAppearanceFromValues(nextValues = {}) {
  const nextChatStyle = CHAT_STYLES.includes(nextValues.chatStyle) ? nextValues.chatStyle : chatStyle;
  const nextTheme = APP_THEMES.includes(nextValues.appTheme) && isAppThemeUnlocked(nextValues.appTheme)
    ? nextValues.appTheme
    : appTheme;
  const nextAppearance = APP_APPEARANCES.includes(nextValues.appAppearance) && nextValues.appAppearance !== 'retro-kb2'
    ? nextValues.appAppearance
    : appAppearance;
  const chatStyleChanged = nextChatStyle !== chatStyle;
  const appearanceChanged = nextAppearance !== appAppearance;
  const changed = chatStyleChanged || nextTheme !== appTheme || nextAppearance !== appAppearance;

  if (!changed) {
    return;
  }

  chatStyle = nextChatStyle;
  appTheme = nextTheme;
  appAppearance = nextAppearance;
  applyAppearanceSettings();

  if (chatStyleChanged) {
    renderVisibleMessages();
  }

  if (appearanceChanged) {
    if (appAppearance === 'retro-kb2') {
      unlockAchievement('retro-kb2');
    }
    closeCreatorSuggestions();
  }
}

function syncAppearanceFromStorage() {
  syncAppearanceFromValues({
    chatStyle: loadChatStyle(),
    appTheme: loadAppTheme(),
    appAppearance: loadAppAppearance()
  });
}

function broadcastAppearanceSettings() {
  if (appearanceBroadcastChannel) {
    appearanceBroadcastChannel.postMessage({ chatStyle, appTheme, appAppearance });
  }
}

function getEffectiveChatStyle() {
  return appAppearance === 'retro-kb2' ? 'compact' : chatStyle;
}

function isRetroKb2Appearance() {
  return appAppearance === 'retro-kb2'
    || document.documentElement.dataset.appAppearance === 'retro-kb2';
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
    // Plain creator names are normalized below.
  }

  return raw
    .replace(/^@+/, '')
    .replace(/^https?:\/\/(?:www\.)?tiktok\.com\/@?/i, '')
    .replace(/\/live(?:[/?#].*)?$/i, '')
    .replace(/[?#].*$/, '')
    .replace(/[^\w.]+/g, '')
    .toLowerCase();
}

function normalizeCreatorComparableName(value) {
  return String(value || '')
    .trim()
    .replace(/^@+/, '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '');
}

function getCurrentCreatorComparableNames() {
  const handle = getCurrentCreatorHandle();
  const creator = (state && state.currentCreator) || {};
  const stored = handle && recentCreatorMeta ? recentCreatorMeta[handle] : null;
  const matched = handle ? findCreatorByHandle(handle) : null;
  return [...new Set([
    creator.id,
    creator.username,
    creator.label,
    creator.label && String(creator.label).replace(/\s*\(@[^)]*\)\s*$/, ''),
    getCreatorUsernameFromState(),
    handle,
    stored && stored.id,
    stored && stored.username,
    stored && stored.label,
    stored && stored.label && String(stored.label).replace(/\s*\(@[^)]*\)\s*$/, ''),
    matched && matched.id,
    matched && matched.username,
    matched && matched.label,
    matched && matched.label && String(matched.label).replace(/\s*\(@[^)]*\)\s*$/, '')
  ].map(normalizeCreatorComparableName).filter(Boolean))];
}

function isCurrentCreatorName(value) {
  const actual = normalizeCreatorComparableName(value);
  return Boolean(actual && getCurrentCreatorComparableNames().includes(actual));
}

function loadRecentCreators() {
  try {
    const saved = JSON.parse(localStorage.getItem(RECENT_CREATORS_KEY) || '[]');
    return Array.isArray(saved)
      ? saved.map(normalizeCreatorHandle).filter(Boolean).slice(0, MAX_RECENT_CREATORS)
      : [];
  } catch {
    return [];
  }
}

function saveRecentCreators() {
  localStorage.setItem(RECENT_CREATORS_KEY, JSON.stringify(recentCreators.slice(0, MAX_RECENT_CREATORS)));
}

function loadFavoriteCreators() {
  try {
    const saved = JSON.parse(localStorage.getItem(FAVORITE_CREATORS_KEY) || '[]');
    return Array.isArray(saved)
      ? Array.from(new Set(saved.map(normalizeCreatorHandle).filter(Boolean))).slice(0, MAX_FAVORITE_CREATORS)
      : [];
  } catch {
    return [];
  }
}

function saveFavoriteCreators() {
  localStorage.setItem(FAVORITE_CREATORS_KEY, JSON.stringify(favoriteCreators.slice(0, MAX_FAVORITE_CREATORS)));
}

function toggleFavoriteCreator(handle) {
  const normalized = normalizeCreatorHandle(handle);
  if (!normalized) return;
  if (favoriteCreators.includes(normalized)) {
    favoriteCreators = favoriteCreators.filter((item) => item !== normalized);
  } else if (favoriteCreators.length < MAX_FAVORITE_CREATORS) {
    favoriteCreators = [...favoriteCreators, normalized];
  }
  saveFavoriteCreators();
  renderRecentCreatorsCarousel();
}

function removeRememberedCreator(handle) {
  const normalized = normalizeCreatorHandle(handle);
  if (!normalized) return;

  recentCreators = recentCreators.filter((item) => item !== normalized);
  favoriteCreators = favoriteCreators.filter((item) => item !== normalized);
  delete recentCreatorMeta[normalized];
  if (czesterMemory && czesterMemory.creatorUsage) {
    delete czesterMemory.creatorUsage[normalized];
  }

  saveRecentCreators();
  saveFavoriteCreators();
  saveRecentCreatorMeta();
  saveCzesterMemory();
  renderRecentCreatorsCarousel();
  renderCreatorSuggestions();
  syncCreatorOptions(state.creators);
}

function createRemoveCreatorButton(handle) {
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'remove-creator-button';
  remove.appendChild(createUiIcon('trash'));
  remove.title = t('recentCreators.delete');
  remove.setAttribute('aria-label', `${t('recentCreators.delete')}: @${handle}`);
  remove.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    removeRememberedCreator(handle);
  });
  return remove;
}

function loadRecentCreatorMeta() {
  try {
    const saved = JSON.parse(localStorage.getItem(RECENT_CREATOR_META_KEY) || '{}');
    return saved && typeof saved === 'object' ? saved : {};
  } catch {
    return {};
  }
}

function saveRecentCreatorMeta() {
  const entries = Object.entries(recentCreatorMeta)
    .filter(([handle]) => recentCreators.includes(handle))
    .slice(0, MAX_RECENT_CREATORS);
  localStorage.setItem(RECENT_CREATOR_META_KEY, JSON.stringify(Object.fromEntries(entries)));
}

function normalizeCzesterMemory(value) {
  const creatorUsage = value && value.creatorUsage && typeof value.creatorUsage === 'object'
    ? value.creatorUsage
    : {};
  const viewerProfiles = value && value.viewerProfiles && typeof value.viewerProfiles === 'object'
    ? value.viewerProfiles
    : {};
  const notifications = Array.isArray(value && value.notifications) ? value.notifications : [];
  const indexedArchives = Array.isArray(value && value.indexedArchives) ? value.indexedArchives : [];

  return {
    creatorUsage: Object.fromEntries(
      Object.entries(creatorUsage)
        .map(([handle, entry]) => {
          const normalizedHandle = normalizeCreatorHandle(handle);
          if (!normalizedHandle) {
            return null;
          }
          const data = entry && typeof entry === 'object' ? entry : {};
          return [normalizedHandle, {
            count: Math.max(0, Number(data.count) || 0),
            lastConnectedAt: typeof data.lastConnectedAt === 'string' ? data.lastConnectedAt : '',
            successfulConnections: Math.max(0, Number(data.successfulConnections) || 0)
          }];
        })
        .filter(Boolean)
    ),
    viewerProfiles: Object.fromEntries(
      Object.entries(viewerProfiles)
        .map(([key, entry]) => {
          const normalizedKey = String(key || '').trim().toLowerCase();
          if (!normalizedKey) {
            return null;
          }
          const data = entry && typeof entry === 'object' ? entry : {};
          return [normalizedKey, {
            name: String(data.name || normalizedKey),
            uniqueId: String(data.uniqueId || ''),
            firstSeenAt: typeof data.firstSeenAt === 'string' ? data.firstSeenAt : '',
            lastSeenAt: typeof data.lastSeenAt === 'string' ? data.lastSeenAt : '',
            seenSessions: Math.max(0, Number(data.seenSessions) || 0),
            lastCreator: String(data.lastCreator || ''),
            lastSessionKey: String(data.lastSessionKey || ''),
            chatCount: Math.max(0, Number(data.chatCount) || 0),
            joinCount: Math.max(0, Number(data.joinCount) || 0),
            giftCoins: Math.max(0, Number(data.giftCoins) || 0),
            tapCount: Math.max(0, Number(data.tapCount) || 0),
            spamCount: Math.max(0, Number(data.spamCount) || 0),
            positiveCount: Math.max(0, Number(data.positiveCount) || 0),
            problematicCount: Math.max(0, Number(data.problematicCount) || 0),
            helperCount: Math.max(0, Number(data.helperCount) || 0)
          }];
        })
        .filter(Boolean)
        .slice(-CZESTER_VIEWER_PROFILE_LIMIT)
    ),
    notifications: notifications
      .filter((item) => item && typeof item === 'object')
      .slice(-50),
    indexedArchives: indexedArchives
      .map((item) => String(item || '').trim())
      .filter(Boolean)
      .slice(-1000)
  };
}

function loadCzesterMemory() {
  try {
    return normalizeCzesterMemory(JSON.parse(localStorage.getItem(CZESTER_MEMORY_KEY) || '{}'));
  } catch {
    return normalizeCzesterMemory({});
  }
}

function saveCzesterMemory() {
  localStorage.setItem(CZESTER_MEMORY_KEY, JSON.stringify(normalizeCzesterMemory(czesterMemory)));
}

function scheduleCzesterMemorySave() {
  if (czesterMemorySaveTimer) {
    return;
  }
  czesterMemorySaveTimer = setTimeout(() => {
    czesterMemorySaveTimer = null;
    saveCzesterMemory();
  }, 5000);
}

function getCreatorUsageScore(handle) {
  const normalized = normalizeCreatorHandle(handle);
  const entry = normalized ? czesterMemory.creatorUsage[normalized] : null;
  if (!entry) {
    return 0;
  }

  const countScore = Math.min(200, Math.max(0, Number(entry.count) || 0) * 20);
  const successfulScore = Math.min(100, Math.max(0, Number(entry.successfulConnections) || 0) * 10);
  const lastConnectedAt = Date.parse(entry.lastConnectedAt || '');
  const recencyScore = Number.isFinite(lastConnectedAt)
    ? Math.max(0, 100 - ((Date.now() - lastConnectedAt) / CZESTER_CREATOR_RECENCY_WINDOW_MS) * 100)
    : 0;
  return countScore + successfulScore + recencyScore;
}

function getOrderedRecentCreators() {
  return recentCreators
    .map(normalizeCreatorHandle)
    .filter(Boolean)
    .sort((left, right) => {
      const scoreDiff = getCreatorUsageScore(right) - getCreatorUsageScore(left);
      if (Math.abs(scoreDiff) > 0.001) {
        return scoreDiff;
      }
      return recentCreators.indexOf(left) - recentCreators.indexOf(right);
    })
    .slice(0, MAX_RECENT_CREATORS);
}

function recordCzesterCreatorConnection(handle, options = {}) {
  const normalized = normalizeCreatorHandle(handle);
  if (!normalized) {
    return;
  }

  const current = czesterMemory.creatorUsage[normalized] || {
    count: 0,
    lastConnectedAt: '',
    successfulConnections: 0
  };
  current.count = Math.max(0, Number(current.count) || 0) + 1;
  current.lastConnectedAt = new Date().toISOString();
  if (options.successful) {
    current.successfulConnections = Math.max(0, Number(current.successfulConnections) || 0) + 1;
  }
  czesterMemory.creatorUsage[normalized] = current;
  saveCzesterMemory();
}

function rememberCzesterNotice(type, payload = {}) {
  czesterMemory.notifications.push({
    type,
    payload,
    createdAt: new Date().toISOString()
  });
  czesterMemory.notifications = czesterMemory.notifications.slice(-50);
  saveCzesterMemory();
}

function wasCzesterNoticeRecentlyShown(type, key, cooldownMs) {
  const now = Date.now();
  return czesterMemory.notifications.some((item) => {
    if (!item || item.type !== type) {
      return false;
    }
    const createdAt = Date.parse(item.createdAt || '');
    if (!Number.isFinite(createdAt) || now - createdAt > cooldownMs) {
      return false;
    }
    const payload = item.payload && typeof item.payload === 'object' ? item.payload : {};
    return String(payload.key || payload.creator || '') === String(key || '');
  });
}

function notifyCzester(type, text, options = {}) {
  const value = String(text || '').trim();
  if (!value) {
    return Promise.resolve();
  }
  rememberCzesterNotice(type, options.payload || {});
  return appendCzesterMessage('bot', value, {
    animate: options.animate !== false,
    variant: options.variant || ''
  });
}

function getCzesterMessageAuthor(message) {
  return String(message && (message.authorName || message.uniqueId) || '').replace(/^@+/, '').trim();
}

function getCzesterViewerKey(message) {
  return getStatsUserKey(message) || normalizeCreatorHandle(getCzesterMessageAuthor(message));
}

function normalizeCzesterText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s?!.]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isCzesterQuestionText(text) {
  const normalized = normalizeCzesterText(text);
  return Boolean(
    normalized
    && (
      normalized.includes('?')
      || /^(czy|gdzie|kiedy|ile|jak|jaki|jaka|jakie|czemu|dlaczego|po co|za ile|skad|dokad|ktory|ktora|ktore)\b/u.test(normalized)
    )
  );
}

function getCzesterQuestionItems(windowMs = CZESTER_QUESTIONS_WINDOW_MS) {
  const since = Date.now() - windowMs;
  return czesterLiveAnalysisMessages
    .filter((entry) => entry.kind === 'chat' && entry.createdAt >= since && isCzesterQuestionText(entry.text))
    .slice(-20);
}

function getCzesterTopicHits(messages) {
  const topicDefs = [
    { key: 'cena', label: 'cena', patterns: [/\bcen\w*\b/u, /\bile\b/u, /\bkoszt\w*\b/u, /\bza ile\b/u] },
    { key: 'wysylka', label: 'wysyłka', patterns: [/\bwysyl\w*\b/u, /\bpacz\w*\b/u, /\bkurier\w*\b/u, /\bodbi[oó]r\b/u] },
    { key: 'live', label: 'kolejny live', patterns: [/\blive\b/u, /\bkiedy\b/u, /\bo kt[oó]rej\b/u] },
    { key: 'obs', label: 'obs za obs', patterns: [/\bobs\b/u, /\bobserw\w*\b/u, /\bfollow\b/u] },
    { key: 'prezenty', label: 'prezenty', patterns: [/\bgift\w*\b/u, /\bprezent\w*\b/u, /\bmonet\w*\b/u, /\bserc\w*\b/u] },
    { key: 'problem', label: 'problemy/pretensje', patterns: [/\bproblem\w*\b/u, /\bczemu\b/u, /\bdlaczego\b/u, /\bnie dziala\b/u, /\boszust\w*\b/u] }
  ];
  const scores = new Map();
  messages.forEach((entry) => {
    const text = normalizeCzesterText(entry.text);
    topicDefs.forEach((topic) => {
      if (topic.patterns.some((pattern) => pattern.test(text))) {
        scores.set(topic.key, {
          label: topic.label,
          count: (scores.get(topic.key) && scores.get(topic.key).count || 0) + 1
        });
      }
    });
  });
  return [...scores.values()]
    .sort((left, right) => right.count - left.count)
    .slice(0, 3);
}

function getCzesterMood(messages) {
  const chatMessages = messages.filter((entry) => entry.kind === 'chat');
  if (chatMessages.length < 3) {
    return 'martwy';
  }
  const joined = chatMessages.map((entry) => normalizeCzesterText(entry.text)).join(' ');
  const spamCount = chatMessages.filter((entry) => /(?:obs za obs|follow for follow|f4f|\bobs\b)/u.test(normalizeCzesterText(entry.text))).length;
  const laughCount = chatMessages.filter((entry) => /(?:haha|hehe|xd|🤣|😂|😅)/iu.test(entry.text)).length;
  const positiveCount = chatMessages.filter((entry) => /(?:super|dzieki|dzięki|kocham|git|fajnie|dobrze|sztos|❤️|💙|😍)/iu.test(entry.text)).length;
  const conflictCount = chatMessages.filter((entry) => /(?:kurw|chuj|jeb|oszust|klam|kłam|debil|idiot|zamknij|nienawidze|nienawidzę)/iu.test(entry.text)).length;
  const questionCount = chatMessages.filter((entry) => isCzesterQuestionText(entry.text)).length;

  if (spamCount >= 3 || spamCount >= Math.ceil(chatMessages.length * 0.3)) {
    return 'spamerski';
  }
  if (conflictCount >= 2 || joined.includes('drama')) {
    return 'konfliktowy';
  }
  if (questionCount >= Math.max(4, Math.ceil(chatMessages.length * 0.35))) {
    return 'chaotyczny';
  }
  if (laughCount >= 3) {
    return 'śmieszkowy';
  }
  if (positiveCount >= 3) {
    return 'pozytywny';
  }
  return 'neutralny';
}

function getCzesterMoodDescription(mood) {
  const labels = {
    pozytywny: 'aktywny i pozytywny',
    neutralny: 'raczej neutralny',
    nerwowy: 'nerwowy',
    spamerski: 'spamerski',
    konfliktowy: 'konfliktowy',
    śmieszkowy: 'śmieszkowy',
    martwy: 'martwy',
    chaotyczny: 'chaotyczny'
  };
  return labels[mood] || mood || 'neutralny';
}

function getRepeatedCzesterQuestions(questions) {
  const grouped = new Map();
  questions.forEach((entry) => {
    const key = normalizeCzesterText(entry.text).replace(/[?!.,]+$/g, '');
    if (!key) {
      return;
    }
    const current = grouped.get(key) || {
      text: entry.text,
      authors: new Set(),
      count: 0
    };
    current.count += 1;
    if (entry.author) {
      current.authors.add(entry.author);
    }
    grouped.set(key, current);
  });
  return [...grouped.values()]
    .sort((left, right) => right.count - left.count)
    .slice(0, 5)
    .map((entry) => ({
      text: entry.text,
      count: entry.count,
      authors: [...entry.authors].slice(0, 4)
    }));
}

function buildCzesterLiveSummary() {
  const since = Date.now() - CZESTER_LIVE_ANALYSIS_WINDOW_MS;
  const messages = czesterLiveAnalysisMessages.filter((entry) => entry.createdAt >= since);
  const chatMessages = messages.filter((entry) => entry.kind === 'chat');
  if (chatMessages.length < CZESTER_LIVE_ANALYSIS_MIN_MESSAGES) {
    return '';
  }
  const topics = getCzesterTopicHits(chatMessages);
  const questions = getRepeatedCzesterQuestions(getCzesterQuestionItems(CZESTER_LIVE_ANALYSIS_WINDOW_MS));
  const mood = getCzesterMood(messages);
  const parts = [];
  if (topics.length) {
    parts.push(`Czat pisze głównie o: ${topics.map((topic) => topic.label).join(', ')}.`);
  } else {
    parts.push('Czat jest aktywny, ale bez jednego wyraźnego tematu.');
  }
  if (questions.length) {
    parts.push(`Powtarzające się pytania: ${questions.slice(0, 3).map((item) => `„${item.text}”`).join('; ')}.`);
  }
  parts.push(`Nastrój: ${getCzesterMoodDescription(mood)}.`);
  return parts.join(' ');
}

function maybeRunCzesterLiveAnalysis(force = false) {
  const now = Date.now();
  if (!force && now - czesterLastAnalysisAt < CZESTER_LIVE_ANALYSIS_INTERVAL_MS) {
    return;
  }
  const newMessages = czesterLiveAnalysisMessages.length - czesterLastAnalysisMessageCount;
  if (!force && newMessages < CZESTER_LIVE_ANALYSIS_MIN_MESSAGES) {
    return;
  }
  const summary = buildCzesterLiveSummary();
  if (!summary) {
    return;
  }
  czesterLastAnalysisAt = now;
  czesterLastAnalysisMessageCount = czesterLiveAnalysisMessages.length;
  notifyCzester('live-summary', summary, {
    animate: false,
    variant: 'analysis',
    payload: { key: `summary:${Math.floor(now / CZESTER_LIVE_ANALYSIS_INTERVAL_MS)}` }
  });
}

function startCzesterLiveAnalysisTimer() {
  if (czesterLiveAnalysisTimer) {
    return;
  }
  czesterLiveAnalysisTimer = setInterval(() => maybeRunCzesterLiveAnalysis(false), 10 * 1000);
}

function resetCzesterLiveAnalysis() {
  czesterLiveAnalysisMessages = [];
  czesterLastAnalysisAt = 0;
  czesterLastAnalysisMessageCount = 0;
  czesterLiveEndedSummarySent = false;
}

function recordCzesterLiveAnalysisMessage(message) {
  if (!message || message.czesterOnly) {
    return;
  }
  const kind = message.kind || 'chat';
  const text = getMessagePlainText(message);
  if (!text && !message.textKey) {
    return;
  }
  const createdAt = Date.now();
  czesterLiveAnalysisMessages.push({
    createdAt,
    timestamp: message.timestamp || new Date(createdAt).toISOString(),
    kind,
    text,
    author: getCzesterMessageAuthor(message),
    uniqueId: message.uniqueId || '',
    giftCost: Math.max(0, Number(message.giftCost) || 0),
    likeCount: Math.max(0, Number(message.likeCount || message.total) || 0),
    isModerator: Boolean(message.isModerator),
    isSuperFan: Boolean(message.isSuperFan)
  });
  if (czesterLiveAnalysisMessages.length > CZESTER_LIVE_ANALYSIS_MAX_BUFFER) {
    czesterLiveAnalysisMessages = czesterLiveAnalysisMessages.slice(-CZESTER_LIVE_ANALYSIS_MAX_BUFFER);
  }
  startCzesterLiveAnalysisTimer();
}

function updateCzesterViewerProfile(message, options = {}) {
  const key = getCzesterViewerKey(message);
  if (!key) {
    return;
  }
  const nowIso = new Date().toISOString();
  const currentCreator = options.creator || getCurrentCreatorHandle();
  const profile = czesterMemory.viewerProfiles[key] || {
    name: getCzesterMessageAuthor(message) || key,
    uniqueId: message.uniqueId || '',
    firstSeenAt: nowIso,
    lastSeenAt: '',
    seenSessions: 0,
    lastCreator: '',
    lastSessionKey: '',
    chatCount: 0,
    joinCount: 0,
    giftCoins: 0,
    tapCount: 0,
    spamCount: 0,
    positiveCount: 0,
    problematicCount: 0,
    helperCount: 0
  };
  profile.name = getCzesterMessageAuthor(message) || profile.name || key;
  profile.uniqueId = message.uniqueId || profile.uniqueId || '';
  profile.lastSeenAt = nowIso;
  const sessionKey = options.sessionKey || czesterCurrentLiveSessionKey || (currentCreator ? `${currentCreator}:local` : '');
  if (sessionKey && profile.lastSessionKey !== sessionKey) {
    profile.seenSessions = Math.max(0, Number(profile.seenSessions) || 0) + 1;
    profile.lastSessionKey = sessionKey;
  }
  profile.lastCreator = currentCreator || profile.lastCreator || '';
  const kind = message.kind || 'chat';
  if (kind === 'chat') {
    profile.chatCount += 1;
    const text = normalizeCzesterText(getMessagePlainText(message));
    if (/(dzieki|dzięki|super|git|fajnie|sztos|kocham|❤️|💙)/iu.test(text)) {
      profile.positiveCount += 1;
    }
    if (/(kurw|chuj|jeb|debil|idiot|oszust|klam|kłam)/iu.test(text)) {
      profile.problematicCount += 1;
    }
    if (/(pomog|pomóg|odpowiad|spokojnie|nie spam|regulamin|moder)/iu.test(text)) {
      profile.helperCount += 1;
    }
  } else if (kind === 'member') {
    profile.joinCount += 1;
  } else if (kind === 'gift' || kind === 'box') {
    profile.giftCoins += Math.max(0, Number(message.giftCost) || 0);
  } else if (kind === 'like') {
    profile.tapCount += Math.max(1, Number(message.likeCount) || 1);
  }
  if (options.spam) {
    profile.spamCount += 1;
  }
  czesterMemory.viewerProfiles[key] = profile;
  const entries = Object.entries(czesterMemory.viewerProfiles);
  if (entries.length > CZESTER_VIEWER_PROFILE_LIMIT) {
    entries
      .sort((left, right) => Date.parse(left[1].lastSeenAt || '') - Date.parse(right[1].lastSeenAt || ''))
      .slice(0, entries.length - CZESTER_VIEWER_PROFILE_LIMIT)
      .forEach(([oldKey]) => delete czesterMemory.viewerProfiles[oldKey]);
  }
  if (options.save !== false) {
    scheduleCzesterMemorySave();
  }
}

async function indexCzesterArchiveProfiles(entries = []) {
  if (czesterArchiveIndexBusy || !window.tiktokLive || typeof window.tiktokLive.getArchiveContent !== 'function') {
    return;
  }
  const indexed = new Set(Array.isArray(czesterMemory.indexedArchives) ? czesterMemory.indexedArchives : []);
  const pending = entries
    .filter((entry) => entry && entry.id && !indexed.has(entry.id));
  if (!pending.length) {
    return;
  }

  const batch = pending.slice(0, CZESTER_ARCHIVE_INDEX_BATCH_LIMIT);
  czesterArchiveIndexBusy = true;
  try {
    for (const entry of batch) {
      try {
        const result = await window.tiktokLive.getArchiveContent(entry.id);
        if (!result || !result.ok || !Array.isArray(result.messages)) {
          continue;
        }
        const creator = normalizeCreatorHandle(entry.username || (result.entry && result.entry.username) || '');
        const sessionKey = `archive:${entry.id}`;
        result.messages.forEach((message) => {
          updateCzesterViewerProfile(message, {
            creator,
            sessionKey,
            save: false
          });
        });
        indexed.add(entry.id);
      } catch {
        // Pojedyncze uszkodzone archiwum nie może zatrzymać indeksowania reszty.
      }
    }
    czesterMemory.indexedArchives = [...indexed].slice(-1000);
    saveCzesterMemory();
  } finally {
    czesterArchiveIndexBusy = false;
    if (pending.length > batch.length) {
      window.setTimeout(() => indexCzesterArchiveProfiles(entries), 750);
    }
  }
}

function showCzesterQuestionsFromLastFiveMinutes() {
  const questions = getRepeatedCzesterQuestions(getCzesterQuestionItems(CZESTER_QUESTIONS_WINDOW_MS));
  if (!questions.length) {
    notifyCzester('live-questions', t('czester.questions.none'), { animate: false, variant: 'analysis' });
    return;
  }
  const lines = questions.map((item, index) => {
    const authors = item.authors.length ? ` — ${item.authors.join(', ')}` : '';
    return `${index + 1}. ${item.text}${authors}`;
  });
  notifyCzester('live-questions', `Pytania z ostatnich 5 minut:\n${lines.join('\n')}`, {
    animate: false,
    variant: 'analysis'
  });
}

function showCzesterActiveModerators() {
  const moderators = getActiveModerators();
  if (!moderators.length) {
    notifyCzester('active-moderators', t('czester.moderators.none'), {
      animate: false,
      variant: 'analysis'
    });
    return;
  }

  const lines = moderators.map((entry, index) => `${index + 1}. ${entry.name}`);
  notifyCzester('active-moderators', `${t('czester.moderators.title')}\n${lines.join('\n')}`, {
    animate: false,
    variant: 'analysis'
  });
}

function getCzesterTopViewerProfiles(limit = 3) {
  return Object.values(czesterMemory.viewerProfiles || {})
    .sort((left, right) => (
      (right.chatCount + right.giftCoins + right.tapCount / 20 + right.joinCount * 3)
      - (left.chatCount + left.giftCoins + left.tapCount / 20 + left.joinCount * 3)
    ))
    .slice(0, limit);
}

function getCzesterCurrentLiveViewerProfiles(limit = 3) {
  const profiles = new Map();

  czesterLiveAnalysisMessages.forEach((entry) => {
    const key = normalizeCreatorHandle(entry.uniqueId || entry.author || '');
    if (!key) {
      return;
    }

    const profile = profiles.get(key) || {
      name: entry.author || key,
      chatCount: 0,
      giftCoins: 0,
      tapCount: 0,
      joinCount: 0
    };
    profile.name = entry.author || profile.name;

    if (entry.kind === 'chat') {
      profile.chatCount += 1;
    } else if (entry.kind === 'gift' || entry.kind === 'box') {
      profile.giftCoins += Math.max(0, Number(entry.giftCost) || 0);
    } else if (entry.kind === 'like') {
      profile.tapCount += Math.max(1, Number(entry.likeCount) || 1);
    } else if (entry.kind === 'member') {
      profile.joinCount += 1;
    }

    profiles.set(key, profile);
  });

  return Array.from(profiles.values())
    .sort((left, right) => (
      (right.chatCount + right.giftCoins + right.tapCount / 20 + right.joinCount * 3)
      - (left.chatCount + left.giftCoins + left.tapCount / 20 + left.joinCount * 3)
      || left.name.localeCompare(right.name)
    ))
    .slice(0, limit);
}

function buildCzesterLiveEndSummary() {
  const topGifters = getTopGifters();
  const topTappers = getTopTappers();
  const moderators = getActiveModerators();
  const profiles = getCzesterCurrentLiveViewerProfiles(3);
  const mood = getCzesterMood(czesterLiveAnalysisMessages);
  const parts = [
    `Live zakończony.\nWiadomości: ${formatCounter(chatMessageCount)}.\nWidzowie teraz: ${formatCounter(liveViewerCount)}.`,
    `Nastrój czatu:\n${getCzesterMoodDescription(mood)}.`
  ];
  if (topGifters.length) {
    parts.push(`Top gifty:\n${topGifters.slice(0, 3).map((entry) => `${entry.name} (${formatCounter(entry.coins)})`).join('\n')}.`);
  }
  if (topTappers.length) {
    parts.push(`Top tapnięcia:\n${topTappers.slice(0, 3).map((entry) => `${entry.name} (${formatCounter(entry.taps)})`).join('\n')}.`);
  }
  if (moderators.length) {
    parts.push(`Aktywni moderatorzy:\n${moderators.slice(0, 3).map((entry) => entry.name).join('\n')}.`);
  }
  if (profiles.length) {
    parts.push(`Wyróżniający się widzowie:\n${profiles.map((entry) => `${entry.name} (${entry.chatCount} wiadomości)`).join('\n')}.`);
  }
  return parts.join('\n\n');
}

function maybeNotifyCzesterLiveEndedSummary() {
  if (czesterLiveEndedSummarySent || !visibleMessages.some((message) => message && !message.localOnly)) {
    return;
  }
  czesterLiveEndedSummarySent = true;
  notifyCzester('live-final-summary', buildCzesterLiveEndSummary(), {
    animate: false,
    variant: 'analysis'
  });
}

function shouldShowCzesterBattleNotice(key, cooldownMs = 30000) {
  const now = Date.now();
  for (const [entryKey, timestamp] of czesterBattleNoticeAlerts) {
    if (now - timestamp > 2 * 60 * 1000) {
      czesterBattleNoticeAlerts.delete(entryKey);
    }
  }
  const previous = czesterBattleNoticeAlerts.get(key);
  if (previous && now - previous < cooldownMs) {
    return false;
  }
  czesterBattleNoticeAlerts.set(key, now);
  return true;
}

function setChatFreezeEffect(active, expiresAt = '') {
  if (!chatViewEl) {
    return;
  }
  if (chatFreezeTimer) {
    clearTimeout(chatFreezeTimer);
    chatFreezeTimer = null;
  }
  if (!active) {
    delete chatViewEl.dataset.frozen;
    return;
  }
  chatViewEl.dataset.frozen = 'true';
  const endMs = new Date(expiresAt || '').getTime();
  const fallbackMs = 15000;
  const durationMs = Number.isFinite(endMs) && endMs > Date.now()
    ? Math.max(1000, endMs - Date.now())
    : fallbackMs;
  chatFreezeTimer = setTimeout(() => {
    chatFreezeTimer = null;
    setChatFreezeEffect(false);
  }, durationMs);
}

function getCzesterCreatorNoticeName(alert) {
  const targetNames = Array.isArray(alert && alert.targetNames) ? alert.targetNames : [];
  const directName = targetNames
    .map((name) => String(name || '').replace(/^@+/, '').trim())
    .find(Boolean);
  if (directName) {
    return directName;
  }
  const handle = getCurrentCreatorHandle();
  return String(handle || '').replace(/^@+/, '').trim() || 'twórca';
}

function formatBattleScoreForCzester(sides) {
  const entries = Array.isArray(sides) ? sides : [];
  return entries
    .slice(0, 4)
    .map((side) => {
      const name = String(side && (side.name || side.displayId || side.id) || '').replace(/^@+/, '').trim() || '?';
      const score = Math.max(0, Number(side && side.score) || 0);
      return `${name} (${score})`;
    })
    .filter(Boolean)
    .join(' : ');
}

function formatBattleFightersForCzester(sides) {
  const entries = Array.isArray(sides) ? sides : [];
  return entries
    .slice(0, 4)
    .map((side, index) => String(side && (side.name || side.displayId || side.id) || '').replace(/^@+/, '').trim() || `${index === 0 ? 'Twórca' : 'Przeciwnik'}`)
    .filter(Boolean)
    .join(' vs ');
}

function isGenericBattleCreatorName(name) {
  return /^(tw[oó]rca|tworca|creator)\s*\d+$/i.test(String(name || '').trim());
}

function normalizeBattleBarSide(side, fallbackName) {
  const rawName = String(side && (side.name || side.displayId || side.id) || '').replace(/^@+/, '').trim();
  const safeName = !rawName || isGenericBattleCreatorName(rawName) ? fallbackName : rawName;
  const currentByIdentity = [
    side && side.displayId,
    side && side.name,
    side && side.id,
    rawName,
    safeName
  ].some(isCurrentCreatorName);
  return {
    id: String(side && side.id || ''),
    name: safeName || fallbackName || '-',
    displayId: String(side && side.displayId || ''),
    score: Math.max(0, Number(side && side.score) || 0),
    isCurrentCreator: Boolean(side && side.isCurrentCreator) || currentByIdentity,
    isCurrentCreatorCertain: Boolean(side && side.isCurrentCreatorCertain) || currentByIdentity
  };
}

function isBattleBarCurrentCreatorSide(side, options = {}) {
  if (!side) {
    return false;
  }
  if (side.isCurrentCreator || side.isCurrentCreatorCertain) {
    return true;
  }
  if (options.certainOnly) {
    return false;
  }
  const current = getCurrentCreatorHandle();
  return [
    side.displayId,
    side.name,
    side.id
  ].some((value) => (
    (current && normalizeCreatorHandle(value) === current)
    || isCurrentCreatorName(value)
  ));
}

function getBattleBarSides(sides) {
  const entries = Array.isArray(sides) ? sides.filter(Boolean) : [];
  if (!entries.length) {
    return null;
  }
  const certainCurrentCreatorSide = entries.find((side) => isBattleBarCurrentCreatorSide(side, { certainOnly: true }));
  const guessedCurrentCreatorSide = entries.find(isBattleBarCurrentCreatorSide);
  const currentCreatorSide = certainCurrentCreatorSide || guessedCurrentCreatorSide;
  const previousLeftId = String(battleScorebarState && battleScorebarState.leftSideId || '');
  const previousRightId = String(battleScorebarState && battleScorebarState.rightSideId || '');
  const stickyLeft = !certainCurrentCreatorSide && !currentCreatorSide && previousLeftId
    ? entries.find((side) => String(side && side.id || '') === previousLeftId)
    : null;
  const baseLeft = currentCreatorSide || stickyLeft || entries[0];
  const left = normalizeBattleBarSide(baseLeft, 'Twórca');
  const opponents = entries
    .filter((side) => side !== baseLeft)
    .sort((a, b) => (Number(b && b.score) || 0) - (Number(a && a.score) || 0));
  const stickyRight = previousRightId
    ? opponents.find((side) => String(side && side.id || '') === previousRightId)
    : null;
  const right = normalizeBattleBarSide(stickyRight || opponents[0] || entries[1], 'Przeciwnik');
  return { left, right };
}

function getBattleBarShares(left, right) {
  const leftScore = Math.max(0, Number(left && left.score) || 0);
  const rightScore = Math.max(0, Number(right && right.score) || 0);
  const total = leftScore + rightScore;
  if (!total) {
    return { left: 50, right: 50, leading: 'draw' };
  }
  const rawLeft = (leftScore / total) * 100;
  const leftShare = Math.min(92, Math.max(8, rawLeft));
  return {
    left: leftShare,
    right: 100 - leftShare,
    leading: leftScore === rightScore ? 'draw' : leftScore > rightScore ? 'left' : 'right'
  };
}

function isBattleBarBioLikeName(value) {
  const text = String(value || '').trim();
  if (!text) {
    return false;
  }
  const normalized = text.toLowerCase();
  return text.length > 32
    || /\b(ig|instagram|live codziennie|top\s*\d|oddaje|obserwacje|wokalista|serwisant|budowa|praca)\b/i.test(text)
    || normalized.includes('\n');
}

function getBattleBarDedupKey(side) {
  if ([
    side && side.displayId,
    side && side.name,
    side && side.id
  ].some(isCurrentCreatorName)) {
    return 'current';
  }
  const handle = normalizeCreatorHandle(side && (side.displayId || side.name));
  if (handle && !isBattleBarBioLikeName(handle)) {
    return `handle:${handle}`;
  }
  const id = String(side && side.id || '').trim();
  return id ? `id:${id}` : '';
}

function dedupeBattleBarEntries(entries) {
  const merged = new Map();
  entries.forEach((side) => {
    if (!side) {
      return;
    }
    if (isBattleBarBioLikeName(side.name) && !side.displayId && !side.isCurrentCreator && !side.isCurrentCreatorCertain) {
      return;
    }
    const key = getBattleBarDedupKey(side);
    if (!key) {
      return;
    }
    const existing = merged.get(key);
    if (!existing) {
      merged.set(key, { ...side });
      return;
    }
    existing.score = Math.max(Number(existing.score) || 0, Number(side.score) || 0);
    existing.name = isBattleBarBioLikeName(existing.name) && !isBattleBarBioLikeName(side.name)
      ? side.name
      : existing.name || side.name;
    existing.displayId = existing.displayId || side.displayId;
    existing.isCurrentCreator = existing.isCurrentCreator || side.isCurrentCreator || isCurrentCreatorName(side.name) || isCurrentCreatorName(side.displayId);
    existing.isCurrentCreatorCertain = existing.isCurrentCreatorCertain || side.isCurrentCreatorCertain || isCurrentCreatorName(side.name) || isCurrentCreatorName(side.displayId);
  });
  return [...merged.values()];
}

function getBattleBarSegments(sides) {
  const entries = dedupeBattleBarEntries(Array.isArray(sides) ? sides.filter(Boolean) : []);
  if (!entries.length) {
    return [];
  }
  const currentHandle = getCurrentCreatorHandle();
  const identityCurrentCreatorSide = entries.find((side) => [
    side && side.displayId,
    side && side.name,
    side && side.id
  ].some((value) => (
    isCurrentCreatorName(value)
    || (currentHandle && normalizeCreatorHandle(value) === currentHandle)
  )));
  const flaggedCurrentCreatorSides = entries.filter((side) => side && (side.isCurrentCreator || side.isCurrentCreatorCertain));
  const currentCreatorSide = identityCurrentCreatorSide
    || (flaggedCurrentCreatorSides.length === 1 ? flaggedCurrentCreatorSides[0] : null);
  const previousSideIds = Array.isArray(battleScorebarState && battleScorebarState.sideIds)
    ? battleScorebarState.sideIds.map(String)
    : [
      battleScorebarState && battleScorebarState.leftSideId,
      battleScorebarState && battleScorebarState.rightSideId
    ].map(String).filter(Boolean);
  let ordered = [];
  if (currentCreatorSide) {
    ordered = [
      currentCreatorSide,
      ...entries.filter((side) => side !== currentCreatorSide)
    ];
  } else if (previousSideIds.length) {
    const previous = previousSideIds
      .map((id) => entries.find((side) => String(side && side.id || '') === id))
      .filter(Boolean);
    ordered = [
      ...previous,
      ...entries.filter((side) => !previous.includes(side))
    ];
  } else {
    ordered = entries;
  }
  ordered = ordered.map((side, index) => {
    if (index === 0 || !side) {
      return side;
    }
    const duplicatesCurrentCreator = [
      side.displayId,
      side.name,
      side.id
    ].some((value) => (
      isCurrentCreatorName(value)
      || (currentHandle && normalizeCreatorHandle(value) === currentHandle)
    ));
    if (!duplicatesCurrentCreator) {
      return side;
    }
    return {
      ...side,
      name: index === 1 ? 'Przeciwnik' : `Przeciwnik ${index}`,
      displayId: '',
      isCurrentCreator: false,
      isCurrentCreatorCertain: false
    };
  });
  return ordered
    .slice(0, 4)
    .map((side, index) => normalizeBattleBarSide(side, index === 0 ? 'Twórca' : `Przeciwnik ${index}`));
}

function getBattleBarSegmentShares(segments) {
  const values = (Array.isArray(segments) ? segments : [])
    .map((side) => Math.max(0, Number(side && side.score) || 0));
  const total = values.reduce((sum, score) => sum + score, 0);
  const count = Math.max(1, values.length);
  if (!total) {
    return {
      shares: values.map(() => 100 / count),
      leadingId: ''
    };
  }
  const minShare = values.length >= 4 ? 9 : values.length === 3 ? 12 : 8;
  let shares = values.map((score) => Math.max(minShare, (score / total) * 100));
  const shareTotal = shares.reduce((sum, share) => sum + share, 0);
  shares = shares.map((share) => (share / shareTotal) * 100);
  const maxScore = Math.max(...values);
  const leaderIndex = values.filter((score) => score === maxScore).length === 1
    ? values.findIndex((score) => score === maxScore)
    : -1;
  return {
    shares,
    leadingId: leaderIndex >= 0 ? String(segments[leaderIndex] && segments[leaderIndex].id || '') : ''
  };
}

function formatBattleBarTime(stateValue = {}) {
  const status = stateValue.status || 'active';
  if (status === 'finished') {
    return appLanguage === 'en' ? 'END' : appLanguage === 'de' ? 'ENDE' : 'KONIEC';
  }
  if (status === 'cancelled') {
    return appLanguage === 'en' ? 'STOP' : appLanguage === 'de' ? 'STOPP' : 'STOP';
  }
  const baseRemainingMs = Number(stateValue.remainingMs) || 0;
  const timingUpdatedAt = Number(stateValue.timingUpdatedAt) || 0;
  let remaining = 0;
  if (baseRemainingMs > 0 && timingUpdatedAt > 0) {
    remaining = Math.max(0, Math.ceil((baseRemainingMs - (Date.now() - timingUpdatedAt)) / 1000));
  } else {
    const endMs = new Date(stateValue.endsAt || '').getTime();
    if (!Number.isFinite(endMs) || endMs <= 0) {
      return '--:--';
    }
    remaining = Math.max(0, Math.ceil((endMs - Date.now()) / 1000));
  }
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function sanitizeBattleBarVisibleSegments(segments) {
  const list = Array.isArray(segments) ? segments.filter(Boolean) : [];
  if (list.length < 2) {
    return list;
  }
  const firstNameKey = normalizeCreatorComparableName(list[0] && list[0].name);
  return list.map((side, index) => {
    if (index === 0) {
      return {
        ...side,
        isCurrentCreator: true,
        isCurrentCreatorCertain: true
      };
    }
    const sameNameAsCreator = firstNameKey
      && normalizeCreatorComparableName(side && side.name) === firstNameKey;
    const sameIdentityAsCreator = [
      side && side.displayId,
      side && side.id
    ].some((value) => (
      isCurrentCreatorName(value)
      || (getCurrentCreatorHandle() && normalizeCreatorHandle(value) === getCurrentCreatorHandle())
    ));
    if (!sameNameAsCreator && !sameIdentityAsCreator) {
      return {
        ...side,
        isCurrentCreator: false,
        isCurrentCreatorCertain: false
      };
    }
    return {
      ...side,
      name: index === 1 ? 'Przeciwnik' : `Przeciwnik ${index}`,
      displayId: '',
      isCurrentCreator: false,
      isCurrentCreatorCertain: false
    };
  });
}

function renderBattleScorebar() {
  if (!battleScorebarEl || !battleScorebarState) {
    return;
  }
  let sides = getBattleBarSegments(battleScorebarState.sides);
  if (sides.length < 2) {
    battleScorebarEl.hidden = true;
    return;
  }
  sides = sanitizeBattleBarVisibleSegments(sides);
  const shares = getBattleBarSegmentShares(sides);
  if (battleScorebarTrackEl) {
    battleScorebarTrackEl.style.gridTemplateColumns = sides
      .map((side, index) => `minmax(82px, ${shares.shares[index] || (100 / sides.length)}fr)`)
      .join(' ');
    battleScorebarTrackEl.replaceChildren(...sides.map((side, index) => {
      const segment = document.createElement('div');
      segment.className = `battle-scorebar-side battle-scorebar-side-${index + 1}`;
      segment.dataset.currentCreator = side.isCurrentCreator || side.isCurrentCreatorCertain ? 'true' : 'false';
      segment.dataset.leading = shares.leadingId && String(side.id || '') === shares.leadingId ? 'true' : 'false';
      const score = document.createElement('strong');
      score.className = 'battle-scorebar-score';
      score.textContent = String(side.score);
      const name = document.createElement('span');
      name.className = 'battle-scorebar-name';
      name.textContent = side.name;
      segment.append(score, name);
      return segment;
    }));
  }
  if (battleScoreTimeEl) {
    battleScoreTimeEl.textContent = formatBattleBarTime(battleScorebarState);
  }
  battleScorebarEl.dataset.sides = String(sides.length);
  battleScorebarState.sideIds = sides.map((side) => String(side.id || '')).filter(Boolean);
  battleScorebarState.leftSideId = battleScorebarState.sideIds[0] || battleScorebarState.leftSideId || '';
  battleScorebarState.rightSideId = battleScorebarState.sideIds[1] || battleScorebarState.rightSideId || '';
  battleScorebarEl.hidden = false;
}

function hideBattleScorebar() {
  battleScorebarState = null;
  if (battleScorebarTimer) {
    clearInterval(battleScorebarTimer);
    battleScorebarTimer = null;
  }
  if (battleScorebarHideTimer) {
    clearTimeout(battleScorebarHideTimer);
    battleScorebarHideTimer = null;
  }
  if (battleScorebarEl) {
    battleScorebarEl.hidden = true;
    delete battleScorebarEl.dataset.leading;
  }
}

function scheduleBattleScorebarHide(delayMs) {
  if (battleScorebarHideTimer) {
    clearTimeout(battleScorebarHideTimer);
  }
  battleScorebarHideTimer = setTimeout(() => {
    battleScorebarHideTimer = null;
    hideBattleScorebar();
  }, delayMs);
}

function updateBattleScorebarFromAlert(alert) {
  if (!battleScorebarEl || !alert || typeof alert !== 'object') {
    return;
  }
  const eventType = String(alert.eventType || '').trim();
  const hasSides = Array.isArray(alert.sides) && alert.sides.length > 0;
  if (eventType === 'reset') {
    hideBattleScorebar();
    setChatFreezeEffect(false);
    return;
  }
  const previousLeftId = battleScorebarState && battleScorebarState.leftSideId || '';
  const previousRightId = battleScorebarState && battleScorebarState.rightSideId || '';
  const previousSideIds = Array.isArray(battleScorebarState && battleScorebarState.sideIds)
    ? battleScorebarState.sideIds
    : [previousLeftId, previousRightId].filter(Boolean);
  if (eventType === 'cancelled') {
    setChatFreezeEffect(false);
    battleScorebarState = {
      sides: battleScorebarState && battleScorebarState.sides || alert.sides || [],
      leftSideId: previousLeftId,
      rightSideId: previousRightId,
      sideIds: previousSideIds,
      endsAt: '',
      remainingMs: 0,
      timingUpdatedAt: 0,
      status: 'cancelled'
    };
    renderBattleScorebar();
    scheduleBattleScorebarHide(5000);
    return;
  }
  if (eventType === 'finished') {
    setChatFreezeEffect(false);
    battleScorebarState = {
      sides: hasSides ? alert.sides : battleScorebarState && battleScorebarState.sides || [],
      leftSideId: previousLeftId,
      rightSideId: previousRightId,
      sideIds: previousSideIds,
      endsAt: '',
      remainingMs: 0,
      timingUpdatedAt: 0,
      status: 'finished'
    };
    renderBattleScorebar();
    scheduleBattleScorebarHide(12000);
    return;
  }
  if (!hasSides || !['start', 'score'].includes(eventType)) {
    return;
  }
  if (battleScorebarHideTimer) {
    clearTimeout(battleScorebarHideTimer);
    battleScorebarHideTimer = null;
  }
  const canCarryPreviousTiming = eventType === 'score';
  battleScorebarState = {
    sides: alert.sides,
    leftSideId: previousLeftId,
    rightSideId: previousRightId,
    sideIds: previousSideIds,
    endsAt: alert.endsAt || (canCarryPreviousTiming && battleScorebarState && battleScorebarState.endsAt || ''),
    remainingMs: Math.max(0, Number(alert.remainingMs) || (canCarryPreviousTiming && battleScorebarState && battleScorebarState.remainingMs || 0)),
    timingUpdatedAt: Number(alert.timingUpdatedAt) || (canCarryPreviousTiming && battleScorebarState && battleScorebarState.timingUpdatedAt || Date.now()),
    status: 'active'
  };
  renderBattleScorebar();
  if (!battleScorebarTimer) {
    battleScorebarTimer = setInterval(renderBattleScorebar, 1000);
  }
}

function getBattleEffectLabel(effectType) {
  const type = String(effectType || 'effect').trim().toLowerCase() || 'effect';
  return t(`battle.effect.${type}`);
}

function getBattleTargetsText(alert) {
  const targetNames = Array.isArray(alert && alert.targetNames) ? alert.targetNames : [];
  const names = targetNames
    .map((name) => String(name || '').replace(/^@+/, '').trim())
    .filter(Boolean)
    .slice(0, 4);
  if (!names.length) {
    return '';
  }
  if (appLanguage === 'en') {
    return ` on: ${names.join(', ')}`;
  }
  if (appLanguage === 'de') {
    return ` auf: ${names.join(', ')}`;
  }
  return ` na: ${names.join(', ')}`;
}

function getBattleActorText(alert) {
  const actor = String(alert && alert.actorName || '').replace(/^@+/, '').trim();
  if (!actor) {
    return '';
  }
  if (appLanguage === 'en') {
    return ` from ${actor}`;
  }
  if (appLanguage === 'de') {
    return ` von ${actor}`;
  }
  return ` od ${actor}`;
}

function buildCzesterBattleEventText(alert) {
  const eventType = String(alert && alert.eventType || '').trim();
  const score = formatBattleScoreForCzester(alert && alert.sides);
  const fighters = formatBattleFightersForCzester(alert && alert.sides);
  const multiplier = Math.max(0, Number(alert && (alert.rewardMultiple || alert.multiplier)) || 0);
  const target = Math.max(0, Number(alert && alert.target) || 0);
  const progress = Math.max(0, Number(alert && alert.progress) || 0);
  const detail = String(alert && alert.detail || '').trim() || '-';
  const actorName = String(alert && alert.actorName || '').replace(/^@+/, '').trim() || 'Ktoś';

  if (eventType === 'start') {
    return t('czester.battle.start', { fighters: fighters || 'Twórca vs Przeciwnik' });
  }
  if (eventType === 'score') {
    return '';
  }
  if (eventType === 'finished') {
    return score ? t('czester.battle.finished', { score }) : '';
  }
  if (eventType === 'cancelled') {
    return t('czester.battle.cancelled');
  }
  if (eventType === 'mission-start') {
    return t('czester.battle.missionStart', { detail, target: target || '-', multiplier: multiplier || '-' });
  }
  if (eventType === 'mission-progress') {
    return t('czester.battle.missionProgress', { actor: actorName, progress: progress || 0, target: target || '-' });
  }
  if (eventType === 'mission-success') {
    return t('czester.battle.missionSuccess', { multiplier: multiplier || '-' });
  }
  if (eventType === 'mission-failed') {
    return t('czester.battle.missionFailed');
  }
  if (eventType === 'mission-reward') {
    return t('czester.battle.missionReward');
  }
  if (eventType === 'booster-card') {
    return t('czester.battle.booster', { effect: getBattleEffectLabel(alert && alert.effectType) });
  }
  return '';
}

function handleCzesterBattleAlert(alert) {
  if (!alert || typeof alert !== 'object') {
    return;
  }

  const multiplier = Number(alert.multiplier);
  const isMultiplierAlert = (
    (alert.textKey === 'battle.multiplier' || alert.tone === 'battle')
    && (multiplier === 2 || multiplier === 3)
  );
  if (isMultiplierAlert && generalSettings.multiplierNotifications && shouldShowCzesterBattleNotice(`multiplier:${multiplier}`, 30000)) {
    notifyCzester('battle-multiplier', t('czester.notice.multiplier', { multiplier }), {
      animate: false,
      variant: 'multiplier',
      payload: { multiplier, key: `multiplier:${multiplier}` }
    });
  }

  const isCreatorFreeze = alert.effectType === 'freeze' && alert.targetIsCurrentCreator === true;

  if (!isCreatorFreeze) {
    return;
  }
  setChatFreezeEffect(true, alert.expiresAt || '');
  if (shouldShowCzesterBattleNotice('creator-freeze', 8000)) {
    notifyCzester('creator-freeze', t('czester.notice.creatorFreeze'), {
      animate: false,
      variant: 'freeze',
      payload: {
        key: 'creator-freeze',
        expiresAt: alert.expiresAt || ''
      }
    });
  }
}

function maybeNotifyCzesterCreatorSuggestion(handle, previousScore) {
  const usage = czesterMemory.creatorUsage[handle];
  if (usage && usage.count === 1) {
    notifyCzester('creator-connection', t('czester.notice.connection'), { animate: false });
  } else if (
    usage
    && usage.count >= 3
    && previousScore < getCreatorUsageScore(handle)
    && !wasCzesterNoticeRecentlyShown('creator-favorite', handle, 6 * 60 * 60 * 1000)
  ) {
    notifyCzester('creator-favorite', t('czester.notice.creatorFavorite', { creator: handle }), { animate: false, payload: { creator: handle, key: handle } });
  }
}

function rememberCreator(value) {
  if (value && typeof value === 'object') {
    cacheRecentCreatorMeta(value);
    saveRecentCreatorMeta();
  }
  const handle = normalizeCreatorHandle(value && typeof value === 'object' ? (value.username || value.id) : value);
  if (!handle) {
    return;
  }

  const previousScore = getCreatorUsageScore(handle);
  recordCzesterCreatorConnection(handle, { successful: state.connectionStatus === 'online' });

  const nextRecentCreators = [
    handle,
    ...recentCreators.filter((item) => item !== handle)
  ].slice(0, MAX_RECENT_CREATORS);
  if (nextRecentCreators.join('|') === recentCreators.join('|')) {
    renderRecentCreatorsCarousel();
    renderCreatorSuggestions();
    maybeNotifyCzesterCreatorSuggestion(handle, previousScore);
    return;
  }

  recentCreators = nextRecentCreators;
  saveRecentCreators();
  saveRecentCreatorMeta();
  renderRecentCreatorsCarousel();
  syncCreatorOptions(state.creators);
  maybeNotifyCzesterCreatorSuggestion(handle, previousScore);
}

function normalizeSystemSettings(value) {
  const next = { ...DEFAULT_SYSTEM_SETTINGS, ...(value && typeof value === 'object' ? value : {}) };
  return {
    autoLaunch: Boolean(next.autoLaunch),
    runInBackground: Boolean(next.runInBackground),
    minimizeToTrayOnClose: Boolean(next.minimizeToTrayOnClose),
    language: APP_LANGUAGES.includes(next.language) ? next.language : DEFAULT_SYSTEM_SETTINGS.language,
    timeFormat: TIME_FORMATS.includes(next.timeFormat) ? next.timeFormat : DEFAULT_SYSTEM_SETTINGS.timeFormat
  };
}

function loadSystemSettings() {
  return normalizeSystemSettings({
    language: localStorage.getItem(APP_LANGUAGE_SETTINGS_KEY),
    timeFormat: localStorage.getItem(TIME_FORMAT_SETTINGS_KEY)
  });
}

function saveLocalSystemSettings() {
  localStorage.setItem(APP_LANGUAGE_SETTINGS_KEY, systemSettings.language);
  localStorage.setItem(TIME_FORMAT_SETTINGS_KEY, systemSettings.timeFormat);
}

function t(key, params = {}) {
  const dictionary = I18N[appLanguage] || I18N.pl;
  const fallback = I18N.pl[key] || key;
  return String(dictionary[key] || fallback).replace(/\{(\w+)\}/g, (_match, name) => (
    Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : ''
  ));
}

function setText(selector, key) {
  const element = document.querySelector(selector);
  if (element) {
    element.textContent = t(key);
  }
}

function applyI18n() {
  document.documentElement.lang = appLanguage;
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll('.appearance-settings-tabs [data-appearance-subtab]').forEach((element) => {
    element.textContent = element.textContent.replace(/:\s*$/, '');
  });
  document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
    element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    element.setAttribute('placeholder', t(element.dataset.i18nPlaceholder));
  });
  document.querySelectorAll('[data-i18n-title]').forEach((element) => {
    element.setAttribute('title', t(element.dataset.i18nTitle));
  });

  [
    ['.tagline', 'app.tagline'],
    ['.creator-picker > label', 'creator.label'],
    ['.sidebar-button[data-section="chatbox"]', 'nav.chatbox'],
    ['.sidebar-button[data-section="archive"]', 'nav.archive'],
    ['.sidebar-button[data-section="notes"]', 'nav.notes'],
    ['.sidebar-button[data-section="achievements"]', 'nav.achievements'],
    ['.sidebar-button[data-section="coins"]', 'nav.coins'],
    ['.sidebar-button[data-section="radio"]', 'nav.radio'],
    ['.sidebar-button[data-section="settings"]', 'nav.settings'],
    ['.sidebar-button[data-section="about"]', 'nav.about'],
    ['.filter-button[data-filter="chat"]', 'filters.chat'],
    ['.filter-button[data-filter="like"]', 'filters.like'],
    ['.filter-button[data-filter="gift"]', 'filters.gift'],
    ['.filter-button[data-filter="box"]', 'filters.box'],
    ['.filter-button[data-filter="repost"]', 'filters.repost'],
    ['.filter-button[data-filter="share"]', 'filters.share'],
    ['.filter-button[data-filter="member"]', 'filters.member'],
    ['.filter-button[data-archive-filter="chat"]', 'filters.chat'],
    ['.filter-button[data-archive-filter="like"]', 'filters.like'],
    ['.filter-button[data-archive-filter="gift"]', 'filters.gift'],
    ['.filter-button[data-archive-filter="box"]', 'filters.box'],
    ['.filter-button[data-archive-filter="repost"]', 'filters.repost'],
    ['.filter-button[data-archive-filter="share"]', 'filters.share'],
    ['.filter-button[data-archive-filter="member"]', 'filters.member'],
    ['.archive-title', 'archive.title'],
    ['.archive-status', 'archive.status'],
    ['.czester-floating-panel [data-i18n="czester.title"]', 'czester.title'],
    ['.view-panel[data-view="boxes"] .page-header h1', 'boxes.title'],
    ['.view-panel[data-view="boxes"] .page-note', 'boxes.note'],
    ['#refreshBoxesArchive span:last-child', 'boxes.refresh'],
    ['#boxesSessionTitle', 'boxes.liveTitle'],
    ['#boxesSessionMeta', 'boxes.liveDescription'],
    ['#boxesEmpty strong', 'boxes.emptyTitle'],
    ['#boxesEmpty p', 'boxes.emptyDescription'],
    ['.view-panel[data-view="achievements"] .page-header h1', 'achievements.title'],
    ['.view-panel[data-view="achievements"] .page-note', 'achievements.note'],
    ['.achievements-empty strong', 'achievements.emptyTitle'],
    ['.achievements-empty span:not(.achievements-empty-icon)', 'achievements.emptyDescription'],
    ['.view-panel[data-view="settings"] .page-header h1', 'settings.title'],
    ['.settings-tab[data-settings-tab="general"]', 'settings.tabs.general'],
    ['.settings-tab[data-settings-tab="appearance"]', 'settings.tabs.appearance'],
    ['.settings-tab[data-settings-tab="accessibility"]', 'settings.tabs.accessibility'],
    ['.settings-tab[data-settings-tab="system"]', 'settings.tabs.system'],
    ['.settings-tab[data-settings-tab="redeem"]', 'settings.tabs.redeem'],
    ['.settings-panel[data-settings-panel="general"] .page-note', 'settings.general.note'],
    ['label[for="multiplierNotifications"] > span', 'settings.general.multiplierNotifications'],
    ['label[for="statsToolbox"] > span > strong', 'settings.general.statsToolbox'],
    ['label[for="galleryAvatars"] > span > strong', 'settings.general.galleryAvatars'],
    ['label[for="deleteOldArchives"] > span > strong', 'settings.general.deleteOldArchives'],
    ['label[for="bigPictureMode"] > span > strong', 'settings.general.bigPicture'],
    ['.appearance-chat-style-section .settings-heading', 'settings.appearance.chatStyle'],
    ['.appearance-theme-section .settings-heading', 'settings.appearance.theme'],
    ['.appearance-app-section .settings-heading', 'settings.appearance.appAppearance'],
    ['#chatStyleCompact + span strong', 'settings.chatStyle.compact.name'],
    ['#chatStyleCompact + span small', 'settings.chatStyle.compact.description'],
    ['#chatStyleSpacious + span strong', 'settings.chatStyle.spacious.name'],
    ['#chatStyleSpacious + span small', 'settings.chatStyle.spacious.description'],
    ['#chatStyleTestowy + span strong', 'settings.chatStyle.modern.name'],
    ['#chatStyleTestowy + span small', 'settings.chatStyle.modern.description'],
    ['#themeRoseBlack + span strong', 'settings.theme.roseBlack.name'],
    ['#themeRoseBlack + span small', 'settings.theme.roseBlack.description'],
    ['#themeWhiteTitanium + span small', 'settings.theme.whiteTitanium.description'],
    ['#themeChillSerwis + span small', 'settings.theme.chillSerwis.description'],
    ['#themeRoseGoldGlass + span small', 'settings.theme.roseGlass.description'],
    ['#themeLazarskieRejony + span strong', 'settings.theme.lazarskieRejony.name'],
    ['#themeLazarskieRejony + span small', 'settings.theme.lazarskieRejony.description'],
    ['#themeMiamiVice + span strong', 'settings.theme.miamiVice.name'],
    ['#themeMiamiVice + span small', 'settings.theme.miamiVice.description'],
    ['#themeMiamiVice + span .theme-lock-badge span:last-child', 'settings.theme.locked'],
    ['#themeDzikaGalaktyka + span strong', 'settings.theme.dzikaGalaktyka.name'],
    ['#themeDzikaGalaktyka + span small', 'settings.theme.dzikaGalaktyka.description'],
    ['#themeDzikaGalaktyka + span .theme-lock-badge span:last-child', 'settings.theme.locked'],
    ['#themeSwiatBrikersa + span strong', 'settings.theme.swiatBrikersa.name'],
    ['#themeSwiatBrikersa + span small', 'settings.theme.swiatBrikersa.description'],
    ['#themeSwiatBrikersa + span .theme-lock-badge span:last-child', 'settings.theme.locked'],
    ['#appAppearanceStandard + span strong', 'settings.appAppearance.default.name'],
    ['#appAppearanceStandard + span small', 'settings.appAppearance.default.description'],
    ['#appAppearanceDecorative + span strong', 'settings.appAppearance.decorative.name'],
    ['#appAppearanceDecorative + span small', 'settings.appAppearance.decorative.description'],
    ['#appAppearanceRetroKb2 + span strong', 'settings.appAppearance.retroKb2.name'],
    ['#appAppearanceRetroKb2 + span small', 'settings.appAppearance.retroKb2.description'],
    ['.settings-panel[data-settings-panel="accessibility"] > .settings-heading', 'settings.accessibility.tts'],
    ['label[for="ttsEnabled"] > span > strong', 'settings.accessibility.readAloud'],
    ['label[for="ttsRolesOnly"] > span > strong', 'settings.accessibility.rolesOnly'],
    ['label[for="ttsRolesOnly"] > span > small', 'settings.accessibility.rolesOnlyDescription'],
    ['label[for="ttsSkipVulgarNicknames"] > span > strong', 'settings.accessibility.skipVulgarNicknames'],
    ['label[for="ttsSkipVulgarMessages"] > span > strong', 'settings.accessibility.skipVulgarMessages'],
    ['label[for="ttsSkipSpamMessages"] > span > strong', 'settings.accessibility.skipSpamMessages'],
    ['label[for="ttsVoice"] > span > strong', 'settings.accessibility.voice'],
    ['label[for="ttsRate"] > span > strong', 'settings.accessibility.rate'],
    ['label[for="ttsVolume"] > span > strong', 'settings.accessibility.volume'],
    ['.chat-delay-section .settings-heading', 'settings.accessibility.delay'],
    ['.settings-panel[data-settings-panel="redeem"] .page-note', 'settings.redeem.note'],
    ['label[for="redeemCodeInput"] > span:first-child', 'settings.redeem.codeLabel'],
    ['.view-panel[data-view="about"] .page-header h1', 'about.title'],
    ['.settings-tab[data-about-tab="program"]', 'about.tabs.program'],
    ['.settings-tab[data-about-tab="news"]', 'about.tabs.news'],
    ['.settings-tab[data-about-tab="faq"]', 'about.tabs.faq'],
    ['#aboutProgramPanel > p:nth-of-type(1)', 'about.program.p1'],
    ['#aboutProgramPanel > p:nth-of-type(2)', 'about.program.p2'],
    ['#aboutProgramPanel .about-section h2', 'about.program.how'],
    ['#aboutProgramPanel .about-section p:nth-of-type(1)', 'about.program.how.p1'],
    ['#aboutProgramPanel .about-section p:nth-of-type(2)', 'about.program.how.p2'],
    ['#aboutProgramPanel .about-section p:nth-of-type(3)', 'about.program.how.p3']
  ].forEach(([selector, key]) => setText(selector, key));

  syncTtsVoices();
  syncSystemControls();
  syncRedeemCodeUi();
  syncRedeemedFeatureNavigation();
  renderRecentCreatorsCarousel();
  renderAchievements();
  renderBoxesPanel();
  renderCzester();
  syncRightWidgetDock();
  renderBattleBannerFromState();
  updateStatus();
  if (!visibleMessages.length && emptyEl) {
    emptyEl.textContent = t('chat.empty');
  }
  if (archiveEntries.length) {
    renderArchiveList();
  }
  if (selectedArchive) {
    renderArchiveSession();
  }
}

function applyAppearanceSettings() {
  const effectiveChatStyle = getEffectiveChatStyle();
  document.documentElement.dataset.chatStyle = effectiveChatStyle;
  document.documentElement.dataset.theme = appAppearance === 'retro-kb2' ? 'retro-kb2' : appTheme;
  document.documentElement.dataset.appAppearance = appAppearance;

  chatStyleInputs.forEach((input) => {
    input.checked = input.value === effectiveChatStyle;
  });

  themeInputs.forEach((input) => {
    input.checked = input.value === appTheme;
  });

  appAppearanceInputs.forEach((input) => {
    input.checked = input.value === appAppearance;
    if (input.value === 'retro-kb2') {
      input.disabled = true;
      input.checked = false;
    }
  });
}

function initAppearanceSettings() {
  applyAppearanceSettings();

  window.addEventListener('storage', (event) => {
    if ([CHAT_STYLE_SETTINGS_KEY, APP_THEME_SETTINGS_KEY, APP_APPEARANCE_SETTINGS_KEY].includes(event.key)) {
      syncAppearanceFromStorage();
    }
  });

  if (typeof BroadcastChannel === 'function') {
    appearanceBroadcastChannel = new BroadcastChannel('czatbox.appearance');
    appearanceBroadcastChannel.addEventListener('message', (event) => {
      syncAppearanceFromValues(event.data || {});
    });
  }

  chatStyleInputs.forEach((input) => {
    input.addEventListener('change', () => {
      if (!input.checked) {
        return;
      }

      chatStyle = CHAT_STYLES.includes(input.value) ? input.value : 'compact';
      saveChatStyle();
      applyAppearanceSettings();
      broadcastAppearanceSettings();
      renderVisibleMessages();
    });
  });

  themeInputs.forEach((input) => {
    input.addEventListener('change', () => {
      if (!input.checked) {
        return;
      }

      if (!APP_THEMES.includes(input.value) || !isAppThemeUnlocked(input.value)) {
        appTheme = loadAppTheme();
        applyAppearanceSettings();
        return;
      }

      appTheme = input.value;
      saveAppTheme();
      applyAppearanceSettings();
      broadcastAppearanceSettings();
    });
  });

  appAppearanceInputs.forEach((input) => {
    input.addEventListener('change', () => {
      if (!input.checked) {
        return;
      }

      if (input.value === 'retro-kb2' || !APP_APPEARANCES.includes(input.value)) {
        applyAppearanceSettings();
        return;
      }
      appAppearance = input.value;
      saveAppAppearance();
      applyAppearanceSettings();
      broadcastAppearanceSettings();
    });
  });
}

function applyGeneralSettings() {
  if (multiplierNotificationsEl) {
    multiplierNotificationsEl.checked = true;
  }

  if (statsToolboxEl) {
    statsToolboxEl.checked = generalSettings.statsToolbox;
  }
  if (galleryAvatarsEl) {
    galleryAvatarsEl.checked = generalSettings.galleryAvatars;
  }
  if (deleteOldArchivesEl) {
    deleteOldArchivesEl.checked = generalSettings.deleteOldArchives;
  }
  if (bigPictureModeEl) {
    bigPictureModeEl.checked = generalSettings.bigPictureMode;
  }
  if (quietModeEl) {
    quietModeEl.checked = generalSettings.bigPictureMode && generalSettings.quietMode;
    quietModeEl.disabled = !generalSettings.bigPictureMode;
  }

  if (statusStatsEl) {
    statusStatsEl.hidden = !generalSettings.statsToolbox;
  }

  if (!generalSettings.statsToolbox) {
    setOpenRightWidget('');
  }

  if (!generalSettings.multiplierNotifications) {
    clearTimeout(battleBannerTimer);
    if (battleBanner) {
      battleBanner.hidden = true;
      battleBanner.textContent = '';
      delete battleBanner.dataset.tone;
    }
  }
}

async function cleanupArchivesOlderThanSevenDays() {
  if (!generalSettings.deleteOldArchives || !window.tiktokLive) {
    return;
  }
  const cutoff = Date.now() - (7 * 24 * 60 * 60 * 1000);
  try {
    const result = await window.tiktokLive.listArchives();
    const oldArchives = result && result.ok && Array.isArray(result.archives)
      ? result.archives.filter((entry) => Number(entry.modifiedAt) > 0 && Number(entry.modifiedAt) < cutoff)
      : [];
    await Promise.all(oldArchives.map((entry) => window.tiktokLive.deleteArchive(entry.id).catch(() => null)));
  } catch {
    // Czyszczenie archiwów nie może blokować uruchomienia aplikacji.
  }
}

function initGeneralSettings() {
  applyGeneralSettings();
  cleanupArchivesOlderThanSevenDays();
  document.documentElement.dataset.bigPicture = generalSettings.bigPictureMode ? 'true' : 'false';
  if (generalSettings.bigPictureMode) {
    window.tiktokLive?.setBigPicture?.(true)
      .then(() => window.tiktokLive?.setQuietMode?.(generalSettings.quietMode))
      .catch(() => {});
  } else {
    generalSettings.quietMode = false;
    window.tiktokLive?.setQuietMode?.(false).catch(() => {});
  }

  if (multiplierNotificationsEl) {
    multiplierNotificationsEl.addEventListener('change', () => {
      generalSettings.multiplierNotifications = true;
      multiplierNotificationsEl.checked = true;
      saveGeneralSettings();
      applyGeneralSettings();
    });
  }

  if (statsToolboxEl) {
    statsToolboxEl.addEventListener('change', () => {
      generalSettings.statsToolbox = statsToolboxEl.checked;
      saveGeneralSettings();
      applyGeneralSettings();
    });
  }
  if (galleryAvatarsEl) {
    galleryAvatarsEl.addEventListener('change', () => {
      generalSettings.galleryAvatars = galleryAvatarsEl.checked;
      saveGeneralSettings();
      applyGeneralSettings();
      userAvatars.clear();
      renderVisibleMessages();
    });
  }
  if (deleteOldArchivesEl) {
    deleteOldArchivesEl.addEventListener('change', () => {
      generalSettings.deleteOldArchives = deleteOldArchivesEl.checked;
      saveGeneralSettings();
      if (generalSettings.deleteOldArchives) {
        cleanupArchivesOlderThanSevenDays();
      }
    });
  }
  if (bigPictureModeEl) {
    bigPictureModeEl.addEventListener('change', async () => {
      const requested = bigPictureModeEl.checked;
      try {
        const result = await window.tiktokLive.setBigPicture(requested);
        generalSettings.bigPictureMode = Boolean(result && result.ok && result.enabled);
      } catch {
        generalSettings.bigPictureMode = false;
      }
      bigPictureModeEl.checked = generalSettings.bigPictureMode;
      document.documentElement.dataset.bigPicture = generalSettings.bigPictureMode ? 'true' : 'false';
      if (!generalSettings.bigPictureMode) {
        generalSettings.quietMode = false;
        if (quietModeEl) {
          quietModeEl.checked = false;
          quietModeEl.disabled = true;
        }
      } else if (quietModeEl) {
        quietModeEl.disabled = false;
      }
      saveGeneralSettings();
    });
  }
  if (quietModeEl) {
    quietModeEl.addEventListener('change', async () => {
      if (!generalSettings.bigPictureMode) {
        quietModeEl.checked = false;
        return;
      }
      const result = await window.tiktokLive?.setQuietMode?.(quietModeEl.checked).catch(() => null);
      generalSettings.quietMode = Boolean(result && result.ok && result.enabled);
      quietModeEl.checked = generalSettings.quietMode;
      saveGeneralSettings();
    });
  }

  rightWidgetButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.widgetTarget || '';
      const widget = rightWidgets.find((item) => item.dataset.rightWidget === target);
      const shouldOpen = Boolean(widget && widget.dataset.expanded !== 'true');
      if (target === 'top' && shouldOpen) {
        renderTopGiftersPanel();
      } else if (target === 'taps' && shouldOpen) {
        renderTopTappersPanel();
      }
      setOpenRightWidget(shouldOpen ? target : '');
    });
  });
}

function resetApplicationSettings() {
  if (!window.confirm('Przywrócić domyślne ustawienia aplikacji?')) {
    return;
  }
  [
    TTS_SETTINGS_KEY,
    CHAT_DELAY_SETTINGS_KEY,
    CHAT_STYLE_SETTINGS_KEY,
    CHAT_FILTER_SETTINGS_KEY,
    ARCHIVE_FILTER_SETTINGS_KEY,
    APP_THEME_SETTINGS_KEY,
    APP_APPEARANCE_SETTINGS_KEY,
    APP_LANGUAGE_SETTINGS_KEY,
    TIME_FORMAT_SETTINGS_KEY,
    GENERAL_SETTINGS_KEY
  ].forEach((key) => localStorage.removeItem(key));
  window.location.reload();
}

resetSettingsButtonEl?.addEventListener('click', resetApplicationSettings);

function setOpenRightWidget(target) {
  rightWidgets.forEach((widget) => {
    widget.dataset.expanded = String(Boolean(target) && widget.dataset.rightWidget === target);
  });
  syncRightWidgetDock();
}

function syncRightWidgetDock() {
  rightWidgetButtons.forEach((button) => {
    const target = button.dataset.widgetTarget || '';
    const widget = rightWidgets.find((item) => item.dataset.rightWidget === target);
    const expanded = Boolean(widget && widget.dataset.expanded === 'true');
    const keyPrefix = target === 'top'
      ? 'topGifters'
      : target === 'taps'
        ? 'topTappers'
        : target === 'moderators'
          ? 'moderatorsWidget'
          : 'statsWidget';
    button.setAttribute('aria-expanded', String(expanded));
    button.setAttribute('aria-label', t(`${keyPrefix}.${expanded ? 'collapse' : 'expand'}`));
    button.title = t(`${keyPrefix}.${expanded ? 'collapse' : 'expand'}`);
  });
}

function syncSystemControls() {
  if (systemAutoLaunchEl) {
    systemAutoLaunchEl.checked = systemSettings.autoLaunch;
  }
  if (systemRunInBackgroundEl) {
    systemRunInBackgroundEl.checked = systemSettings.runInBackground;
  }
  if (systemMinimizeToTrayEl) {
    systemMinimizeToTrayEl.checked = systemSettings.minimizeToTrayOnClose;
  }
  if (appLanguageEl) {
    appLanguageEl.value = systemSettings.language;
  }
  if (timeFormatEl) {
    timeFormatEl.value = systemSettings.timeFormat;
  }
}

function systemSettingsEqual(left, right) {
  return left.autoLaunch === right.autoLaunch
    && left.runInBackground === right.runInBackground
    && left.minimizeToTrayOnClose === right.minimizeToTrayOnClose
    && left.language === right.language
    && left.timeFormat === right.timeFormat;
}

function applyIncomingSystemSettings(nextSettings, options = {}) {
  const normalized = normalizeSystemSettings({ ...systemSettings, ...(nextSettings || {}) });
  const previousLanguage = appLanguage;
  const previousTimeFormat = timeFormat;

  if (!options.force && systemSettingsEqual(systemSettings, normalized)) {
    return false;
  }

  systemSettings = normalized;
  appLanguage = systemSettings.language;
  timeFormat = systemSettings.timeFormat;
  saveLocalSystemSettings();
  syncSystemControls();

  const languageChanged = previousLanguage !== appLanguage;
  const timeFormatChanged = previousTimeFormat !== timeFormat;

  if (languageChanged) {
    ttsSettings.voiceURI = '';
    saveTtsSettings();
    stopSpeech();
    stopRadioPlayers();
    renderRadioStations();
    applyI18n();
  } else {
    updateStatus();
  }

  if (languageChanged || timeFormatChanged) {
    renderVisibleMessages();
  }

  return true;
}

async function updateSystemSettings(patch) {
  applyIncomingSystemSettings(patch, { force: true });

  if (window.tiktokLive && typeof window.tiktokLive.setSystemSettings === 'function') {
    try {
      const result = await window.tiktokLive.setSystemSettings(systemSettings);
      if (result && result.ok && result.settings) {
        applyIncomingSystemSettings(result.settings);
      }
    } catch {
      // Keep local settings responsive even when the shell setting write fails.
    }
  }
}

async function loadSystemSettingsFromShell() {
  if (!window.tiktokLive || typeof window.tiktokLive.getSystemSettings !== 'function') {
    return;
  }

  try {
    const result = await window.tiktokLive.getSystemSettings();
    if (result && result.ok && result.settings) {
      applyIncomingSystemSettings(result.settings);
    }
  } catch {
    syncSystemControls();
  }
}

function initSystemSettings() {
  syncSystemControls();

  if (systemAutoLaunchEl) {
    systemAutoLaunchEl.addEventListener('change', () => {
      updateSystemSettings({ autoLaunch: systemAutoLaunchEl.checked });
    });
  }

  if (systemRunInBackgroundEl) {
    systemRunInBackgroundEl.addEventListener('change', () => {
      updateSystemSettings({ runInBackground: systemRunInBackgroundEl.checked });
    });
  }

  if (systemMinimizeToTrayEl) {
    systemMinimizeToTrayEl.addEventListener('change', () => {
      updateSystemSettings({ minimizeToTrayOnClose: systemMinimizeToTrayEl.checked });
    });
  }

  if (appLanguageEl) {
    appLanguageEl.addEventListener('change', () => {
      updateSystemSettings({ language: appLanguageEl.value });
    });
  }

  if (timeFormatEl) {
    timeFormatEl.addEventListener('change', () => {
      updateSystemSettings({ timeFormat: timeFormatEl.value });
    });
  }

  if (clearTikTokSessionButton) {
    clearTikTokSessionButton.addEventListener('click', async () => {
      if (!window.confirm(t('settings.system.clearSessionConfirm'))) {
        return;
      }

      clearTikTokSessionButton.disabled = true;
      try {
        if (window.tiktokLive && typeof window.tiktokLive.clearSession === 'function') {
          await window.tiktokLive.clearSession();
        }
      } finally {
        clearTikTokSessionButton.disabled = false;
      }
    });
  }

  loadSystemSettingsFromShell();
}

function initFirstRunLanguageChoice() {
  if (!firstRunLanguageEl || !state.appVersion) {
    return;
  }

  const currentVersion = state.appVersion;
  const languageChosen = localStorage.getItem(APP_LANGUAGE_SETTINGS_KEY);
  const versionChosen = localStorage.getItem(APP_LANGUAGE_VERSION_KEY);
  if (languageChosen && versionChosen === currentVersion) {
    firstRunLanguageEl.hidden = true;
    return;
  }

  firstRunLanguageEl.hidden = false;
  if (firstRunLanguageChoiceInitialized) {
    return;
  }
  firstRunLanguageChoiceInitialized = true;

  firstRunLanguageButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      if (firstRunLanguageChoiceBusy || !state.appVersion) {
        return;
      }

      const language = APP_LANGUAGES.includes(button.dataset.firstLanguage)
        ? button.dataset.firstLanguage
        : DEFAULT_SYSTEM_SETTINGS.language;
      const selectedVersion = state.appVersion;
      firstRunLanguageChoiceBusy = true;
      firstRunLanguageButtons.forEach((item) => {
        item.disabled = true;
      });

      try {
        await updateSystemSettings({ language });
        localStorage.setItem(APP_LANGUAGE_VERSION_KEY, selectedVersion);
        firstRunLanguageEl.hidden = true;
      } finally {
        firstRunLanguageChoiceBusy = false;
        firstRunLanguageButtons.forEach((item) => {
          item.disabled = false;
        });
      }
    });
  });
}

function checkLanguageChoiceForVersion() {
  if (!firstRunLanguageEl) {
    return;
  }
  const currentVersion = state.appVersion;
  if (!currentVersion) {
    return;
  }
  if (localStorage.getItem(APP_LANGUAGE_SETTINGS_KEY)
    && localStorage.getItem(APP_LANGUAGE_VERSION_KEY) === currentVersion) {
    return;
  }
  initFirstRunLanguageChoice();
}

function formatDelaySeconds(delayMs) {
  return `${(delayMs / 1000).toFixed(1)}s`;
}

function canUseSpeech() {
  return 'speechSynthesis' in window && typeof SpeechSynthesisUtterance === 'function';
}

function clampSpeechRate(value) {
  const rate = Number(value) || 1;
  return Math.min(1.3, Math.max(0.7, rate));
}

function clampSpeechVolume(value) {
  const volume = Number(value);
  return Number.isFinite(volume) ? Math.min(2, Math.max(0, volume)) : 1;
}

function stopSpeech() {
  speechQueue.length = 0;
  speechPlaying = false;
  if (currentPiperAudio) {
    currentPiperAudio.pause();
    currentPiperAudio.src = '';
    currentPiperAudio = null;
  }
  if (currentPiperAudioContext) {
    currentPiperAudioContext.close().catch(() => {});
    currentPiperAudioContext = null;
  }
  if (canUseSpeech()) {
    window.speechSynthesis.cancel();
  }
}

function getSelectedPiperVoice() {
  return ['pl_PL-justyna_wg_glos-medium', 'pl_PL-jarvis_wg_glos-medium'].includes(ttsSettings.voiceURI)
    ? ttsSettings.voiceURI
    : 'pl_PL-justyna_wg_glos-medium';
}

function warmSelectedPiperVoice() {
  if (appLanguage === 'pl' && window.tiktokLive?.warmPiper) {
    window.tiktokLive.warmPiper(getSelectedPiperVoice()).catch(() => {});
  }
}

function playPiperAudio(base64, onFinished) {
  const audio = new Audio(`data:audio/wav;base64,${base64}`);
  const volume = clampSpeechVolume(ttsSettings.volume);
  let finished = false;
  currentPiperAudio = audio;

  const cleanup = () => {
    if (currentPiperAudio === audio) currentPiperAudio = null;
    const context = currentPiperAudioContext;
    currentPiperAudioContext = null;
    if (context) context.close().catch(() => {});
  };
  const finish = () => {
    if (finished) return;
    finished = true;
    cleanup();
    onFinished();
  };

  audio.onended = finish;
  audio.onerror = finish;

  if (volume <= 1) {
    audio.volume = volume;
  } else {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      const context = new AudioContextClass();
      const source = context.createMediaElementSource(audio);
      const gain = context.createGain();
      const compressor = context.createDynamicsCompressor();
      gain.gain.value = volume;
      compressor.threshold.value = -10;
      compressor.knee.value = 8;
      compressor.ratio.value = 5;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.2;
      source.connect(gain).connect(compressor).connect(context.destination);
      currentPiperAudioContext = context;
      context.resume().catch(() => {});
    } else {
      audio.volume = 1;
    }
  }

  audio.play().catch(finish);
}

function getSelectedVoice() {
  const preferredLanguage = TTS_LANGUAGE_PREFIXES[appLanguage] || TTS_LANGUAGE_PREFIXES.pl;
  return speechVoices.find((voice) => voice.voiceURI === ttsSettings.voiceURI)
    || speechVoices.find((voice) => preferredLanguage.test(voice.lang))
    || null;
}

function playNextSpeech() {
  if (!canUseSpeech() || speechPlaying || !ttsSettings.enabled || !speechQueue.length) {
    return;
  }

  // Use the bundled Piper voice for Polish when available; browser speech remains
  // the fallback for other languages or older installations.
  if (appLanguage === 'pl' && window.tiktokLive?.synthesizePiper) {
    const text = speechQueue.shift();
    speechPlaying = true;
    const voice = getSelectedPiperVoice();
    window.tiktokLive.synthesizePiper(text, voice, 1.1).then((result) => {
      if (!result?.ok) throw new Error(result?.error || 'piper');
      playPiperAudio(result.audio, () => { speechPlaying = false; playNextSpeech(); });
    }).catch(() => {
      speechPlaying = false;
      // Never silently switch a Polish Piper selection to a Windows voice.
      // Drop only the failed item and continue with the next queued message.
      playNextSpeech();
    });
    return;
  }
  playNextSpeechWithBrowser();
}

function playNextSpeechWithBrowser() {
  if (!canUseSpeech() || speechPlaying || !ttsSettings.enabled || !speechQueue.length) return;

  const utterance = new SpeechSynthesisUtterance(speechQueue.shift());
  const voice = getSelectedVoice();
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = LANGUAGE_LOCALES[appLanguage] || LANGUAGE_LOCALES.pl;
  }

  utterance.rate = clampSpeechRate(ttsSettings.rate);
  // Web Speech only accepts 0..1. Values above 100% are available for Piper,
  // where Web Audio applies an actual gain stage.
  utterance.volume = Math.min(1, clampSpeechVolume(ttsSettings.volume));
  utterance.onend = () => {
    speechPlaying = false;
    playNextSpeech();
  };
  utterance.onerror = () => {
    speechPlaying = false;
    playNextSpeech();
  };

  speechPlaying = true;
  window.speechSynthesis.speak(utterance);
}

function sanitizeSpeechText(value) {
  if (typeof value !== 'string') {
    return '';
  }

  // Strip symbols before compatibility normalization. NFKC can expand a
  // symbol into ordinary letters that a later symbol filter cannot detect.
  return value
    .replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}\p{S}]/gu, ' ')
    .normalize('NFKC')
    .replace(/\[[\p{L}\p{N}_ -]{1,40}\]/gu, ' ')
    .replace(/:[a-z0-9_+-]+:/gi, ' ')
    .replace(/(^|\s)(?:<3|x+d+|[:;=8][-']?[\])([{}dDpPoO/\\|])(?=$|[\s.!?,])/gi, ' ')
    .replace(/[\u200d\ufe0e\ufe0f]/gi, '')
    .replace(/[\u{1f1e6}-\u{1f1ff}\u{1f3fb}-\u{1f3ff}]/gu, ' ')
    .replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}\p{S}]/gu, ' ')
    .replace(/[@#_*~`^|<>{}[\]\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.!?])/g, '$1')
    .trim();
}

function normalizeSpeechFilterText(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[@$]/g, 'a')
    .replace(/[0ø]/g, 'o')
    .replace(/[1!|]/g, 'i')
    .replace(/[3]/g, 'e')
    .replace(/[5]/g, 's')
    .replace(/[7]/g, 't')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchesAnyPattern(text, patterns) {
  return patterns.some((pattern) => pattern.test(text));
}

function containsVulgarSpeech(value) {
  const normalized = normalizeSpeechFilterText(value);
  return normalized ? matchesAnyPattern(normalized, VULGAR_SPEECH_PATTERNS) : false;
}

function containsSpamSpeech(value) {
  const normalized = normalizeSpeechFilterText(value);
  return normalized ? matchesAnyPattern(normalized, SPAM_SPEECH_PATTERNS) : false;
}

function hasSpeechOverrideCommand(value) {
  return typeof value === 'string' && /^\s*\.69(?:\s+|$)/u.test(value);
}

function stripSpeechOverrideCommand(value) {
  return typeof value === 'string'
    ? value.replace(/^\s*\.69(?:\s+|$)/u, '').trimStart()
    : '';
}

function shouldSkipSpeechMessage(message) {
  if (!message) {
    return true;
  }

  if (
    ttsSettings.rolesOnly
    && !message.isModerator
    && !message.isSuperFan
    && !hasSpeechOverrideCommand(message.text)
  ) {
    return true;
  }

  if (ttsSettings.skipVulgarNicknames && containsVulgarSpeech(message.authorName)) {
    return true;
  }

  if (ttsSettings.skipVulgarMessages && containsVulgarSpeech(message.text)) {
    return true;
  }

  if (ttsSettings.skipSpamMessages && containsSpamSpeech(message.text)) {
    return true;
  }

  return false;
}

function getSpeechText(message) {
  const text = sanitizeSpeechText(stripSpeechOverrideCommand(message.text));
  if (!text || !/[\p{L}\p{N}]/u.test(text)) {
    return '';
  }

  const author = sanitizeSpeechText(message.authorName);
  return author ? `${author} pisze ${text}` : text;
}

function shouldReadMessage(message) {
  return ttsSettings.enabled
    && activeSection === 'chatbox'
    && activeFilters.has('chat')
    && (message.kind || 'chat') === 'chat'
    && !shouldSkipSpeechMessage(message);
}

function readMessageAloud(message) {
  if (!canUseSpeech() || !shouldReadMessage(message)) {
    return;
  }

  const text = getSpeechText(message);
  if (!text) {
    return;
  }

  while (speechQueue.length >= MAX_SPEECH_QUEUE) {
    speechQueue.shift();
  }

  speechQueue.push(text);
  playNextSpeech();
}

function syncTtsVoices() {
  if (!canUseSpeech() || !ttsVoiceEl) {
    return;
  }

  const preferredLanguage = TTS_LANGUAGE_PREFIXES[appLanguage] || TTS_LANGUAGE_PREFIXES.pl;
  speechVoices = window.speechSynthesis.getVoices()
    .slice()
    .sort((a, b) => {
      const aPreferred = preferredLanguage.test(a.lang) ? 0 : 1;
      const bPreferred = preferredLanguage.test(b.lang) ? 0 : 1;
      return aPreferred - bPreferred || a.name.localeCompare(b.name);
    });

  const selected = ttsSettings.voiceURI;
  const piperOptions = [
      ['pl_PL-justyna_wg_glos-medium', 'Halina'],
      ['pl_PL-jarvis_wg_glos-medium', 'Mr. Drwina']
    ].map(([value, label]) => new Option(label, value));
  const piperValues = ['pl_PL-justyna_wg_glos-medium', 'pl_PL-jarvis_wg_glos-medium'];
  const options = [...piperOptions];
  ttsVoiceEl.replaceChildren(...options);
  ttsVoiceEl.value = piperValues.includes(selected) ? selected : piperValues[0];
}

function syncTtsControls() {
  const supported = canUseSpeech();
  if (ttsEnabledEl) {
    ttsEnabledEl.checked = supported && ttsSettings.enabled;
    ttsEnabledEl.disabled = !supported;
  }
  [
    [ttsRolesOnlyEl, 'rolesOnly'],
    [ttsSkipVulgarNicknamesEl, 'skipVulgarNicknames'],
    [ttsSkipVulgarMessagesEl, 'skipVulgarMessages'],
    [ttsSkipSpamMessagesEl, 'skipSpamMessages']
  ].forEach(([input, key]) => {
    if (input) {
      input.checked = Boolean(ttsSettings[key]);
      input.disabled = !supported;
    }
  });
  if (ttsVoiceEl) {
    ttsVoiceEl.disabled = !supported;
  }
  if (ttsRateEl) {
    ttsRateEl.value = String(clampSpeechRate(ttsSettings.rate));
    ttsRateEl.disabled = !supported;
  }
  if (ttsRateValueEl) {
    ttsRateValueEl.value = `${clampSpeechRate(ttsSettings.rate).toFixed(1)}x`;
  }
  if (ttsVolumeEl) {
    ttsVolumeEl.value = String(clampSpeechVolume(ttsSettings.volume));
    ttsVolumeEl.disabled = !supported;
  }
  if (ttsVolumeValueEl) {
    ttsVolumeValueEl.value = `${Math.round(clampSpeechVolume(ttsSettings.volume) * 100)}%`;
  }
}

function syncChatDelayControls() {
  if (chatDelayEl) {
    chatDelayEl.value = String(getChatDelayIndex(chatDelayMs));
  }
  if (chatDelayValueEl) {
    chatDelayValueEl.value = formatDelaySeconds(chatDelayMs);
  }
  updateStatus();
}

function initTextToSpeech() {
  syncTtsControls();
  syncTtsVoices();
  warmSelectedPiperVoice();

  if (canUseSpeech()) {
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      syncTtsVoices();
      syncTtsControls();
    });
  }

  if (ttsEnabledEl) {
    ttsEnabledEl.addEventListener('change', () => {
      ttsSettings.enabled = ttsEnabledEl.checked;
      saveTtsSettings();
      if (!ttsSettings.enabled) {
        stopSpeech();
      }
      syncTtsControls();
    });
  }

  [
    [ttsRolesOnlyEl, 'rolesOnly'],
    [ttsSkipVulgarNicknamesEl, 'skipVulgarNicknames'],
    [ttsSkipVulgarMessagesEl, 'skipVulgarMessages'],
    [ttsSkipSpamMessagesEl, 'skipSpamMessages']
  ].forEach(([input, key]) => {
    if (!input) {
      return;
    }

    input.addEventListener('change', () => {
      ttsSettings[key] = input.checked;
      saveTtsSettings();
      stopSpeech();
      syncTtsControls();
    });
  });

  if (ttsVoiceEl) {
    ttsVoiceEl.addEventListener('change', () => {
      ttsSettings.voiceURI = ttsVoiceEl.value;
      saveTtsSettings();
      warmSelectedPiperVoice();
    });
  }

  if (ttsRateEl) {
    ttsRateEl.addEventListener('input', () => {
      ttsSettings.rate = clampSpeechRate(ttsRateEl.value);
      saveTtsSettings();
      syncTtsControls();
    });
  }

  if (ttsVolumeEl) {
    ttsVolumeEl.addEventListener('input', () => {
      ttsSettings.volume = clampSpeechVolume(ttsVolumeEl.value);
      saveTtsSettings();
      syncTtsControls();
    });
  }

  if (chatDelayEl) {
    chatDelayEl.addEventListener('input', () => {
      const index = Math.min(CHAT_DELAY_OPTIONS.length - 1, Math.max(0, Number(chatDelayEl.value) || 0));
      chatDelayMs = CHAT_DELAY_OPTIONS[index];
      saveChatDelayMs();
      syncChatDelayControls();
      startRevealTimer();
    });
  }

  syncChatDelayControls();
}

function getConnectionStatusText() {
  if (state.connectionStatus === 'online') {
    return t('status.online');
  }

  if (state.connectionStatus === 'offline') {
    return t('status.offline');
  }

  if (state.connectionStatus === 'rate-limited') {
    return t('status.rateLimited');
  }

  if (state.connectionStatus === 'error') {
    return t('status.error');
  }

  if (state.connectionStatus === 'reconnecting') {
    return t('status.reconnecting');
  }

  if (state.connectionStatus === 'connecting') {
    return t('status.connecting');
  }

  if (isOfflineConnectionState(state)) {
    return t('status.offline');
  }

  if (isOnlineConnectionState(state)) {
    return t('status.online');
  }

  return t('status.connecting');
}

function isOfflineConnectionState(value) {
  const lastMessage = typeof value.lastMessage === 'string' ? value.lastMessage : '';
  const source = typeof value.source === 'string' ? value.source : '';
  const combined = `${lastMessage} ${source}`.toLowerCase();

  return value.mode === 'chat'
    && (
      combined.includes('offline')
      || combined.includes('zakonczony')
    );
}

function isOnlineConnectionState(value) {
  const lastMessage = typeof value.lastMessage === 'string' ? value.lastMessage : '';
  const source = typeof value.source === 'string' ? value.source : '';
  const combined = `${lastMessage} ${source}`.toLowerCase();

  return value.mode === 'chat'
    && (combined.includes('polaczono') || source.startsWith('polaczono: room'));
}

function formatCounter(value) {
  const number = Math.max(0, Math.floor(Number(value) || 0));
  return new Intl.NumberFormat(LANGUAGE_LOCALES[appLanguage] || undefined).format(number);
}

function createUiIcon(name, className = '') {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('ui-icon');
  if (className) {
    svg.classList.add(...className.split(/\s+/).filter(Boolean));
  }
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.8');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = UI_ICONS[name] || UI_ICONS.message;
  return svg;
}

function createMessageRoleBadge(role, iconName, label) {
  const badge = document.createElement('span');
  badge.className = 'message-role-badge';
  badge.dataset.role = role;
  badge.title = label;
  badge.setAttribute('aria-label', label);
  badge.appendChild(createUiIcon(iconName));
  return badge;
}

function createMessageRoleBadges(message) {
  const badges = document.createElement('span');
  badges.className = 'message-role-badges';

  if (message.isModerator) {
    badges.appendChild(createMessageRoleBadge('moderator', 'hammer', 'Moderator'));
  }

  if (message.isSuperFan) {
    badges.appendChild(createMessageRoleBadge('superfan', 'crown', 'Superfan'));
  }

  return badges.childElementCount ? badges : null;
}

function hydrateUiIcons(root = document) {
  root.querySelectorAll('[data-ui-icon]').forEach((slot) => {
    const iconName = slot.dataset.uiIcon;
    if (!iconName || slot.querySelector('.ui-icon')) {
      return;
    }
    slot.replaceChildren(createUiIcon(iconName));
  });
}

function getConnectionStatusTone() {
  const status = state.connectionStatus;
  if (status === 'online') {
    return 'online';
  }
  if (status === 'offline') {
    return 'offline';
  }
  if (status === 'error' || status === 'rate-limited') {
    return 'warning';
  }
  return 'connecting';
}

function setStatusSegment(element, text, options = {}) {
  if (!element) {
    return;
  }

  if (options.tone) {
    element.dataset.tone = options.tone;
    let dot = element.querySelector('.status-dot');
    let label = element.querySelector('.status-text');
    if (!dot) {
      dot = document.createElement('span');
      dot.className = 'status-dot';
      dot.setAttribute('aria-hidden', 'true');
    }
    if (!label) {
      label = document.createElement('span');
      label.className = 'status-text';
    }
    label.textContent = text;
    element.replaceChildren(dot, label);
    return;
  }

  if (options.icon) {
    const label = document.createElement('span');
    label.className = 'status-text';
    label.textContent = text;
    element.replaceChildren(createUiIcon(options.icon), label);
    return;
  }

  element.textContent = text;
}

function getTopGifters() {
  return Array.from(giftTotalsByUser.values())
    .filter((entry) => entry.coins > 0)
    .sort((left, right) => right.coins - left.coins || left.name.localeCompare(right.name))
    .slice(0, TOP_GIFTERS_LIMIT);
}

function getTopTappers() {
  return Array.from(tapTotalsByUser.values())
    .filter((entry) => entry.taps > 0)
    .sort((left, right) => right.taps - left.taps || left.name.localeCompare(right.name))
    .slice(0, TOP_TAPPERS_LIMIT);
}

function getHeartMeGiftStats() {
  let active = 0;
  let inactive = 0;

  activeChatUsers.forEach((entry) => {
    if (entry.hasSentHeartMeGift) {
      active += 1;
      return;
    }

    inactive += 1;
  });

  return { active, inactive };
}

function renderTopGiftersPanel() {
  if (!topGiftersContent) {
    return;
  }

  const topGifters = getTopGifters();
  if (!topGifters.length) {
    const empty = document.createElement('div');
    empty.className = 'top-gifters-empty';
    empty.textContent = t('topGifters.empty');
    topGiftersContent.replaceChildren(empty);
    return;
  }

  const list = document.createElement('ol');
  list.className = 'top-gifters-list';
  topGifters.forEach((entry, index) => {
    const item = document.createElement('li');
    item.className = 'stats-widget-row top-gifter-row';

    const rank = document.createElement('span');
    rank.className = 'stats-widget-icon top-gifter-rank';
    rank.textContent = String(index + 1);

    const name = document.createElement('span');
    name.className = 'stats-widget-label top-gifter-name';
    name.textContent = entry.name;

    const coins = document.createElement('strong');
    coins.className = 'top-gifter-coins';
    coins.append(createUiIcon('coin'), document.createTextNode(formatCounter(entry.coins)));

    item.append(rank, name, coins);
    list.appendChild(item);
  });

  topGiftersContent.replaceChildren(list);
}

function renderTopTappersPanel() {
  if (!topTappersContent) {
    return;
  }

  backfillTapStatsFromVisibleMessages();

  const topTappers = getTopTappers();
  if (!topTappers.length) {
    const empty = document.createElement('div');
    empty.className = 'top-gifters-empty top-tappers-empty';
    empty.textContent = t('topTappers.empty');
    topTappersContent.replaceChildren(empty);
    return;
  }

  const list = document.createElement('ol');
  list.className = 'top-gifters-list top-tappers-list';
  topTappers.forEach((entry, index) => {
    const item = document.createElement('li');
    item.className = 'stats-widget-row top-tapper-row';

    const rank = document.createElement('span');
    rank.className = 'stats-widget-icon top-gifter-rank top-tapper-rank';
    rank.textContent = String(index + 1);

    const name = document.createElement('span');
    name.className = 'stats-widget-label top-gifter-name top-tapper-name';
    name.textContent = entry.name;

    const taps = document.createElement('strong');
    taps.className = 'top-gifter-coins top-tapper-count';
    taps.append(createUiIcon('heart'), document.createTextNode(formatCounter(entry.taps)));

    item.append(rank, name, taps);
    list.appendChild(item);
  });

  topTappersContent.replaceChildren(list);
}

function backfillTapStatsFromVisibleMessages() {
  visibleMessages.forEach((message) => {
    const kind = message && (message.kind || 'chat');
    const total = Number(message && message.total);
    if (kind === 'like' && Number.isFinite(total) && total > 0) {
      trackTapStats(message);
    }
  });
}

function getActiveModerators() {
  const threshold = Date.now() - MODERATOR_ACTIVE_WINDOW_MS;
  const moderators = [];

  activeModerators.forEach((entry, key) => {
    if (entry.lastSeen < threshold) {
      activeModerators.delete(key);
      return;
    }

    moderators.push(entry);
  });

  return moderators
    .sort((left, right) => right.lastSeen - left.lastSeen || left.name.localeCompare(right.name))
    .slice(0, ACTIVE_MODERATORS_LIMIT);
}

function renderBattleBannerFromState() {
  // Multiplier alerts are handled by onBattleAlert.
}

function updateStatus() {
  updateTaskbarClock();
  const statusText = getConnectionStatusText();
  const delayText = formatDelaySeconds(chatDelayMs);
  const queueText = formatCounter(queue.length);
  const heartMeGiftStats = getHeartMeGiftStats();

  if (statusConnectionEl) {
    setStatusSegment(statusConnectionEl, statusText, { tone: getConnectionStatusTone() });
    statusConnectionEl.title = typeof state.lastMessage === 'string' ? state.lastMessage : '';
    setStatusSegment(statusDelayEl, delayText, { icon: 'clock' });
    setStatusSegment(statusQueueEl, queueText, { icon: 'inbox' });
    setStatusSegment(statusViewersEl, formatCounter(liveViewerCount));
    setStatusSegment(statusMessagesEl, formatCounter(chatMessageCount));
    setStatusSegment(statusMemberHeartsActiveEl, formatCounter(heartMeGiftStats.active));
    setStatusSegment(statusMemberHeartsExpiredEl, formatCounter(heartMeGiftStats.inactive));
    const topWidget = rightWidgetsByName.get('top');
    if (topWidget && topWidget.dataset.expanded === 'true') {
      renderTopGiftersPanel();
    }
    const tapsWidget = rightWidgetsByName.get('taps');
    if (tapsWidget && tapsWidget.dataset.expanded === 'true') {
      renderTopTappersPanel();
    }
  } else {
    statusEl.textContent = `${statusText} | ${delayText} | ${queueText}`;
  }
  emptyEl.hidden = renderedMessageElements.size > 0;
}

function syncAppVersion() {
  if (!appVersionEl) {
    return;
  }

  appVersionEl.textContent = typeof state.appVersion === 'string' && state.appVersion
    ? state.appVersion
    : '0.1.0';
}

function getCreatorUsernameFromState() {
  if (state.currentCreator && state.currentCreator.username) {
    return state.currentCreator.username;
  }

  const creators = Array.isArray(state.creators) ? state.creators : [];
  const current = creators.find((creator) => creator.id === state.creatorId);
  return current && current.username ? current.username : '';
}

function syncCreatorInputValue(force = false) {
  if (!creatorInput) {
    return;
  }

  const username = getCreatorUsernameFromState();
  if (!username) {
    return;
  }

  if (!force && document.activeElement === creatorInput && creatorInput.dataset.dirty === 'true') {
    return;
  }

  creatorInput.value = `@${username}`;
  creatorInput.dataset.dirty = 'false';
}

function getCreatorDisplayName(creator) {
  const fallback = `@${creator.username || creator.id}`;
  if (typeof creator.label !== 'string') {
    return fallback;
  }

  return creator.label.replace(/\s*\(@[^)]*\)\s*$/, '').trim() || fallback;
}

function findCreatorByHandle(handle) {
  const normalized = normalizeCreatorHandle(handle);
  if (!normalized) {
    return null;
  }
  const creators = Array.isArray(state.creators) ? state.creators : [];
  return creators.find((creator) => normalizeCreatorHandle(creator.username || creator.id) === normalized)
    || recentCreatorMeta[normalized]
    || null;
}

function getCurrentCreatorHandle() {
  return normalizeCreatorHandle(getCreatorUsernameFromState());
}

function getRecentCreatorStatus(handle) {
  const normalized = normalizeCreatorHandle(handle);
  const current = getCurrentCreatorHandle();
  return normalized && current === normalized ? 'online' : 'offline';
}

function getRecentCreatorMeta(creator) {
  const handle = normalizeCreatorHandle(creator && (creator.username || creator.id));
  if (!handle) {
    return null;
  }

  return {
    id: creator.id || handle,
    username: creator.username || handle,
    label: creator.label || `@${handle}`,
    avatar: creator.avatar || ''
  };
}

function cacheRecentCreatorMeta(creator) {
  const meta = getRecentCreatorMeta(creator);
  if (!meta) {
    return;
  }

  const handle = normalizeCreatorHandle(meta.username || meta.id);
  if (!handle) {
    return;
  }

  recentCreatorMeta[handle] = meta;
}

function getCreatorInitial(handle, creator) {
  const source = creator ? getCreatorDisplayName(creator) : handle;
  const clean = String(source || '').replace(/^@/, '').trim();
  return (clean[0] || '?').toUpperCase();
}

async function selectRecentCreator(handle) {
  const normalized = normalizeCreatorHandle(handle);
  if (!normalized || !creatorInput) {
    return;
  }

  creatorInput.value = `@${normalized}`;
  creatorInput.dataset.dirty = 'true';
  await submitCreatorInput();
}

function updateRecentCreatorsNav() {
  if (!recentCreatorsCarousel || !recentCreatorsPrev || !recentCreatorsNext) {
    return;
  }

  const overflow = recentCreatorsCarousel.scrollHeight > recentCreatorsCarousel.clientHeight + 4;
  recentCreatorsPrev.hidden = !overflow;
  recentCreatorsNext.hidden = !overflow;
  if (!overflow) {
    return;
  }

  recentCreatorsPrev.disabled = recentCreatorsCarousel.scrollTop <= 2;
  recentCreatorsNext.disabled = recentCreatorsCarousel.scrollTop + recentCreatorsCarousel.clientHeight >= recentCreatorsCarousel.scrollHeight - 2;
}

function scrollRecentCreators(direction) {
  if (!recentCreatorsCarousel) {
    return;
  }

  const amount = Math.max(120, Math.floor(recentCreatorsCarousel.clientHeight * 0.75));
  recentCreatorsCarousel.scrollBy({
    top: amount * direction,
    behavior: 'smooth'
  });
  window.setTimeout(updateRecentCreatorsNav, 180);
}

function renderRecentCreatorsCarousel() {
  if (!recentCreatorsStrip || !recentCreatorsCarousel || !favoriteCreatorsRow) {
    return;
  }

  const creators = getOrderedRecentCreators();
  const favorites = favoriteCreators.filter((handle) => creators.includes(handle) || recentCreators.includes(handle));

  document.documentElement.dataset.recentCreators = creators.length || favorites.length ? 'true' : 'false';
  recentCreatorsStrip.hidden = creators.length === 0 && favorites.length === 0;
  favoriteCreatorsRow.hidden = favorites.length === 0;
  favoriteCreatorsRow.replaceChildren();
  favorites.forEach((handle) => {
    const creator = findCreatorByHandle(handle);
    const button = document.createElement('button');
    button.className = 'recent-creator-card favorite-creator-card';
    button.type = 'button';
    button.dataset.active = String(getCurrentCreatorHandle() === handle);
    button.title = `@${handle}`;
    button.addEventListener('click', () => selectRecentCreator(handle));
    const star = document.createElement('button');
    star.type = 'button';
    star.className = 'favorite-creator-star';
    star.dataset.active = 'true';
    star.appendChild(createUiIcon('star'));
    star.title = 'Usuń z ulubionych';
    star.addEventListener('click', (event) => { event.preventDefault(); event.stopImmediatePropagation(); toggleFavoriteCreator(handle); });
    const avatar = document.createElement('span');
    avatar.className = 'recent-creator-avatar';
    if (creator && creator.avatar) {
      const image = document.createElement('img'); image.src = creator.avatar; image.alt = ''; image.loading = 'lazy'; avatar.appendChild(image);
    } else avatar.textContent = getCreatorInitial(handle, creator);
    const name = document.createElement('span'); name.className = 'recent-creator-name'; name.textContent = (creator ? getCreatorDisplayName(creator) : handle).replace(/^@/, '');
    button.append(star, createRemoveCreatorButton(handle), avatar, name);
    favoriteCreatorsRow.appendChild(button);
  });
  if (!creators.length) {
    recentCreatorsCarousel.replaceChildren();
    updateRecentCreatorsNav();
    return;
  }

  const fragment = document.createDocumentFragment();
  creators.forEach((handle) => {
    const creator = findCreatorByHandle(handle);
    const status = getRecentCreatorStatus(handle);
    const label = creator ? getCreatorDisplayName(creator) : handle;
    const button = document.createElement('button');
    button.className = 'recent-creator-card';
    button.type = 'button';
    button.dataset.status = status;
    button.dataset.active = String(getCurrentCreatorHandle() === handle);
    button.title = `@${handle} • ${t(`recentCreators.${status}`)}`;
    button.setAttribute('aria-label', button.title);
    button.addEventListener('click', () => selectRecentCreator(handle));

    const avatar = document.createElement('span');
    avatar.className = 'recent-creator-avatar';
    if (creator && creator.avatar) {
      const image = document.createElement('img');
      image.src = creator.avatar;
      image.alt = '';
      image.decoding = 'async';
      image.loading = 'lazy';
      image.addEventListener('error', () => {
        image.remove();
        avatar.textContent = getCreatorInitial(handle, creator);
      }, { once: true });
      avatar.appendChild(image);
    } else {
      avatar.textContent = getCreatorInitial(handle, creator);
    }

    const name = document.createElement('span');
    name.className = 'recent-creator-name';
    name.textContent = label.replace(/^@/, '');

    const star = document.createElement('button');
    star.type = 'button';
    star.className = 'favorite-creator-star';
    star.dataset.active = String(favoriteCreators.includes(handle));
    star.appendChild(createUiIcon('star'));
    star.title = favoriteCreators.includes(handle) ? 'Usuń z ulubionych' : 'Dodaj do ulubionych';
    star.addEventListener('click', (event) => { event.preventDefault(); event.stopImmediatePropagation(); toggleFavoriteCreator(handle); });
    button.append(star, createRemoveCreatorButton(handle), avatar, name);
    fragment.appendChild(button);
  });

  recentCreatorsCarousel.replaceChildren(fragment);
  window.requestAnimationFrame(updateRecentCreatorsNav);
}

function setCreatorSuggestionsExpanded(isExpanded) {
  if (!creatorInput || !creatorSuggestions) {
    return;
  }

  creatorSuggestions.hidden = !isExpanded;
  creatorInput.setAttribute('aria-expanded', String(isExpanded));
  if (!isExpanded) {
    activeCreatorSuggestionIndex = -1;
    creatorInput.removeAttribute('aria-activedescendant');
  }
}

function getCreatorSuggestionQuery() {
  if (!creatorInput) {
    return '';
  }

  if (creatorInput.dataset.dirty !== 'true') {
    return '';
  }

  const normalized = normalizeCreatorHandle(creatorInput.value);
  return normalized || creatorInput.value.trim().replace(/^@+/, '').toLowerCase();
}

function orderCreatorSuggestionItems(items) {
  return [...items].sort((left, right) => {
    const scoreDiff = getCreatorUsageScore(right.handle) - getCreatorUsageScore(left.handle);
    if (Math.abs(scoreDiff) > 0.001) {
      return scoreDiff;
    }
    return 0;
  });
}

function getFilteredCreatorSuggestions() {
  const query = getCreatorSuggestionQuery();
  const sourceItems = orderCreatorSuggestionItems(isRetroKb2Appearance()
    ? getRetroCreatorSuggestionItemsSafe()
    : creatorSuggestionItems);
  if (!query) {
    return sourceItems;
  }

  return sourceItems.filter((item) => (
    item.handle.includes(query)
    || item.label.toLowerCase().includes(query)
    || item.detail.toLowerCase().includes(query)
  ));
}

function getRetroCreatorSuggestionItems() {
  const items = [];
  const seenHandles = new Set();

  getOrderedRecentCreators().forEach((recentHandle) => {
    const handle = normalizeCreatorHandle(recentHandle);
    if (!handle || seenHandles.has(handle)) {
      return;
    }

    const creator = findCreatorByHandle(handle);
    seenHandles.add(handle);
    items.push({
      handle,
      label: creator ? getCreatorDisplayName(creator) : `@${handle}`,
      detail: `Ostatnio użyty • @${handle}`
    });
  });

  creatorSuggestionItems.forEach((item) => {
    const handle = normalizeCreatorHandle(item.handle);
    if (!handle || seenHandles.has(handle)) {
      return;
    }

    seenHandles.add(handle);
    items.push(item);
  });

  return items.slice(0, MAX_RECENT_CREATORS);
}

function getRetroCreatorSuggestionItemsSafe() {
  const items = [];
  const seenHandles = new Set();

  const pushItem = (handle, label, detail) => {
    const normalized = normalizeCreatorHandle(handle);
    if (!normalized || seenHandles.has(normalized)) {
      return;
    }

    seenHandles.add(normalized);
    items.push({
      handle: normalized,
      label: label || `@${normalized}`,
      detail: detail || `@${normalized}`
    });
  };

  const currentHandle = normalizeCreatorHandle(getCurrentCreatorHandle());
  if (currentHandle) {
    const creator = findCreatorByHandle(currentHandle);
    pushItem(
      currentHandle,
      creator ? getCreatorDisplayName(creator) : `@${currentHandle}`,
      `Aktualny - @${currentHandle}`
    );
  }

  getOrderedRecentCreators().forEach((recentHandle) => {
    const handle = normalizeCreatorHandle(recentHandle);
    const creator = findCreatorByHandle(handle);
    pushItem(
      handle,
      creator ? getCreatorDisplayName(creator) : `@${handle}`,
      `Ostatnio użyty - @${handle}`
    );
  });

  creatorSuggestionItems.forEach((item) => {
    pushItem(item.handle, item.label, item.detail);
  });

  return items.slice(0, MAX_RECENT_CREATORS);
}

function setActiveCreatorSuggestion(index) {
  if (!creatorInput || !creatorSuggestions || creatorSuggestions.hidden) {
    return;
  }

  const buttons = Array.from(creatorSuggestions.querySelectorAll('.creator-suggestion'));
  if (!buttons.length) {
    activeCreatorSuggestionIndex = -1;
    creatorInput.removeAttribute('aria-activedescendant');
    return;
  }

  activeCreatorSuggestionIndex = Math.max(0, Math.min(index, buttons.length - 1));
  buttons.forEach((button, buttonIndex) => {
    const isActive = buttonIndex === activeCreatorSuggestionIndex;
    button.dataset.active = String(isActive);
    button.setAttribute('aria-selected', String(isActive));
    if (isActive) {
      creatorInput.setAttribute('aria-activedescendant', button.id);
      button.scrollIntoView({ block: 'nearest' });
    }
  });
}

function renderCreatorSuggestions() {
  if (!creatorSuggestions) {
    return;
  }

  const suggestions = getFilteredCreatorSuggestions();
  const fragment = document.createDocumentFragment();
  if (!suggestions.length) {
    const empty = document.createElement('span');
    empty.className = 'creator-suggestion-empty';
    empty.textContent = t('creator.noMatches');
    fragment.appendChild(empty);
    activeCreatorSuggestionIndex = -1;
  } else {
    suggestions.forEach((item, index) => {
      const button = document.createElement('button');
      button.className = 'creator-suggestion';
      button.type = 'button';
      button.id = `creatorSuggestion-${index}`;
      button.dataset.creator = item.handle;
      button.dataset.active = String(index === activeCreatorSuggestionIndex);
      button.setAttribute('role', 'option');
      button.setAttribute('aria-selected', String(index === activeCreatorSuggestionIndex));

      const main = document.createElement('span');
      main.className = 'creator-suggestion-main';
      main.textContent = item.label;

      const detail = document.createElement('span');
      detail.className = 'creator-suggestion-detail';
      detail.textContent = item.detail;

      button.append(main, detail);
      button.addEventListener('pointerdown', (event) => {
        event.preventDefault();
      });
      button.addEventListener('click', () => {
        chooseCreatorSuggestion(item.handle);
      });
      fragment.appendChild(button);
    });

    if (activeCreatorSuggestionIndex >= suggestions.length) {
      activeCreatorSuggestionIndex = suggestions.length - 1;
    }
  }

  creatorSuggestions.replaceChildren(fragment);
  if (!creatorSuggestions.hidden && activeCreatorSuggestionIndex >= 0) {
    setActiveCreatorSuggestion(activeCreatorSuggestionIndex);
  }
}

function openCreatorSuggestions() {
  if (!creatorSuggestions) {
    return;
  }

  renderCreatorSuggestions();
  setCreatorSuggestionsExpanded(true);
}

function closeCreatorSuggestions() {
  setCreatorSuggestionsExpanded(false);
}

function chooseCreatorSuggestion(handle) {
  if (!creatorInput || !handle) {
    return;
  }

  creatorInput.value = `@${handle}`;
  creatorInput.dataset.dirty = 'false';
  closeCreatorSuggestions();
  submitCreatorInput();
}

function syncCreatorOptions(creators) {
  if (!creatorSuggestions) {
    renderRecentCreatorsCarousel();
    return;
  }

  const list = Array.isArray(creators) ? creators : [];
  const nextKey = [
    ...list.map((creator) => `${creator.id}:${creator.username || ''}:${creator.label || ''}:${creator.avatar || ''}`)
  ].join('|');
  if (nextKey === syncedCreatorSuggestionsKey) {
    renderRecentCreatorsCarousel();
    return;
  }

  syncedCreatorSuggestionsKey = nextKey;
  const items = [];

  list.forEach((creator) => {
    const handle = normalizeCreatorHandle(creator.username || creator.id);
    if (!handle) {
      return;
    }

    cacheRecentCreatorMeta(creator);
  });
  saveRecentCreatorMeta();

  const seenHandles = new Set();
  list.forEach((creator) => {
    const handle = normalizeCreatorHandle(creator.username || creator.id);
    if (!handle || seenHandles.has(handle)) {
      return;
    }

    seenHandles.add(handle);
    items.push({
      handle,
      label: getCreatorDisplayName(creator),
      detail: `@${handle}`
    });
  });

  creatorSuggestionItems = items;
  renderCreatorSuggestions();
  renderRecentCreatorsCarousel();
}

function getStoredCzesterUserAvatar() {
  const saved = localStorage.getItem(CZESTER_USER_AVATAR_KEY) || '';
  if (saved && (!avatarImages.length || avatarImages.includes(saved))) {
    return saved;
  }
  const nextAvatar = avatarImages.length ? avatarImages[Math.floor(Math.random() * avatarImages.length)] : './assets/czatbox-icon.png';
  localStorage.setItem(CZESTER_USER_AVATAR_KEY, nextAvatar);
  return nextAvatar;
}

function getCzesterAvatar(role) {
  if (role === 'bot') {
    return CZESTER_AVATAR_SRC;
  }
  if (!czesterUserAvatar) {
    czesterUserAvatar = getStoredCzesterUserAvatar();
  }
  return czesterUserAvatar;
}

function stopCzesterTyping() {
  if (czesterTypingTimer) {
    clearInterval(czesterTypingTimer);
    czesterTypingTimer = null;
  }
}

function shouldRenderCzesterNow() {
  return !czesterPanelEl || !czesterPanelEl.hidden;
}

function renderCzesterIfVisible() {
  if (shouldRenderCzesterNow()) {
    renderCzester();
  }
}

function typeCzesterMessage(messageId, fullText) {
  stopCzesterTyping();
  const target = czesterMessages.find((message) => message.id === messageId);
  if (!target) {
    return Promise.resolve();
  }

  target.text = '';
  target.typing = true;
  let index = 0;
  const text = String(fullText || '');
  return new Promise((resolve) => {
    czesterTypingTimer = setInterval(() => {
      const current = czesterMessages.find((message) => message.id === messageId);
      if (!current) {
        stopCzesterTyping();
        resolve();
        return;
      }

      index = Math.min(text.length, index + 5);
      current.text = text.slice(0, index);
      current.typing = index < text.length;
      renderCzesterIfVisible();

      if (index >= text.length) {
        stopCzesterTyping();
        resolve();
      }
    }, 24);
  });
}

function appendCzesterMessage(role, text, options = {}) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  czesterMessages.push({
    id,
    role,
    text: options.animate ? '' : String(text || ''),
    fullText: String(text || ''),
    typing: Boolean(options.animate),
    variant: String(options.variant || ''),
    actions: Array.isArray(options.actions) ? options.actions.filter(Boolean) : [],
    createdAt: new Date().toISOString()
  });
  while (czesterMessages.length > CZESTER_MAX_MESSAGES) {
    czesterMessages.shift();
  }
  renderCzesterIfVisible();
  if (options.animate) {
    return typeCzesterMessage(id, text);
  }
  return Promise.resolve();
}

function createCzesterBubble(message) {
  const article = document.createElement('article');
  article.className = 'czester-message';
  article.dataset.messageId = message.id || '';
  article.dataset.role = message.role;
  if (message.variant) {
    article.dataset.variant = message.variant;
  }

  const avatar = document.createElement('img');
  avatar.className = 'czester-avatar';
  avatar.alt = '';
  avatar.decoding = 'async';
  avatar.loading = 'lazy';
  avatar.src = getCzesterAvatar(message.role);

  const compactTime = document.createElement('time');
  compactTime.className = 'czester-message-compact-time';
  compactTime.dateTime = message.createdAt || '';
  compactTime.textContent = message.createdAt ? formatTime(message.createdAt) : '';

  const content = document.createElement('div');
  content.className = 'czester-message-content';

  const header = document.createElement('div');
  header.className = 'czester-message-header';

  const author = document.createElement('strong');
  author.textContent = message.role === 'user' ? t('czester.userLabel') : t('czester.botLabel');

  const time = document.createElement('time');
  time.dateTime = message.createdAt || '';
  time.textContent = message.createdAt ? formatTime(message.createdAt) : '';

  const body = document.createElement('p');
  body.className = 'czester-message-body';
  body.textContent = message.text || (message.typing ? '...' : '');
  if (message.typing) {
    body.dataset.typing = 'true';
  }

  header.append(author, time);
  content.append(header, body);
  if (Array.isArray(message.actions) && message.actions.length) {
    const actions = document.createElement('div');
    actions.className = 'czester-message-actions';
    message.actions.forEach((action) => {
      const button = document.createElement('button');
      button.className = 'czester-message-action';
      button.type = 'button';
      button.dataset.czesterAction = String(action.id || '');
      button.textContent = String(action.label || '');
      actions.appendChild(button);
    });
    content.appendChild(actions);
  }
  article.append(compactTime, avatar, content);
  return article;
}

function renderCzester() {
  if (!czesterMessagesEl) {
    return;
  }

  const fragment = document.createDocumentFragment();
  const messages = czesterMessages.length
    ? czesterMessages
    : [{
        id: 'welcome',
        role: 'bot',
        text: t('czester.welcome'),
        createdAt: new Date().toISOString()
      }];

  messages.forEach((message) => {
    fragment.appendChild(createCzesterBubble(message));
  });

  czesterMessagesEl.replaceChildren(fragment);
  czesterMessagesEl.scrollTop = czesterMessagesEl.scrollHeight;
}

function setCzesterPanelOpen(open) {
  if (!czesterPanelEl || !czesterLauncherEl) {
    return;
  }
  const nextOpen = Boolean(open);
  czesterPanelEl.hidden = !nextOpen;
  czesterPanelEl.dataset.open = String(nextOpen);
  czesterLauncherEl.dataset.open = String(nextOpen);
  czesterLauncherEl.setAttribute('aria-expanded', String(nextOpen));
  document.documentElement.dataset.czesterOpen = String(nextOpen);
  if (nextOpen) {
    positionCzesterPanel();
    renderCzester();
    refreshCzesterAiStatus();
  }
}

function positionCzesterPanel() {
  if (!czesterPanelEl || !czesterLauncherEl) {
    return;
  }
  const launcherRect = czesterLauncherEl.getBoundingClientRect();
  czesterPanelEl.style.setProperty('--czester-anchor-x', `${launcherRect.left + launcherRect.width / 2}px`);
  czesterPanelEl.style.setProperty('--czester-anchor-bottom', `${Math.max(8, window.innerHeight - launcherRect.top + 10)}px`);
}

function toggleCzesterPanel() {
  setCzesterPanelOpen(!(czesterPanelEl && !czesterPanelEl.hidden));
}

function setCzesterAiStatusText(text, state = 'idle') {
  if (czesterAiStatusEl) {
    czesterAiStatusEl.textContent = text;
  }
  if (czesterAiPanelEl) {
    czesterAiPanelEl.dataset.state = state;
    czesterAiPanelEl.hidden = true;
  }
  if (czesterTitleStatusEl) {
    czesterTitleStatusEl.dataset.state = state;
    czesterTitleStatusEl.title = text || '';
  }
}

async function refreshCzesterAiStatus() {
  if (!czesterAiPanelEl || !window.tiktokLive || typeof window.tiktokLive.getCzesterAiStatus !== 'function') {
    return;
  }
  if (czesterAiBusy) {
    return;
  }
  setCzesterAiStatusText(t('czester.ai.checking'), 'checking');
  try {
    const result = await window.tiktokLive.getCzesterAiStatus();
    if (result && result.ready) {
      setCzesterAiStatusText(t('czester.ai.ready', { model: result.model || result.recommendedModel || '' }), 'ready');
      if (czesterAiInstallEl) {
        czesterAiInstallEl.hidden = true;
      }
      return;
    }
    if (result && result.ollamaRunning && !result.modelInstalled) {
      setCzesterAiStatusText(t('czester.ai.noModel'), 'warning');
    } else {
      setCzesterAiStatusText(t('czester.ai.noOllama'), 'warning');
    }
    if (czesterAiInstallEl) {
      czesterAiInstallEl.hidden = false;
      czesterAiInstallEl.disabled = false;
      czesterAiInstallEl.textContent = t('czester.ai.install');
    }
  } catch {
    setCzesterAiStatusText(t('czester.ai.error'), 'error');
  }
}

async function installCzesterAiPack() {
  if (!window.tiktokLive || typeof window.tiktokLive.installCzesterAiPack !== 'function' || czesterAiBusy) {
    return null;
  }
  czesterAiBusy = true;
  let installResult = null;
  if (czesterAiInstallEl) {
    czesterAiInstallEl.disabled = true;
    czesterAiInstallEl.textContent = t('czester.ai.installing');
  }
  setCzesterAiStatusText(t('czester.ai.installing'), 'checking');
  try {
    const result = await window.tiktokLive.installCzesterAiPack();
    installResult = result || null;
    if (result && result.manual) {
      setCzesterAiStatusText(t('czester.ai.installerStarted'), 'warning');
    } else if (result && result.status && result.status.ready) {
      setCzesterAiStatusText(t('czester.ai.ready', { model: result.status.model || result.status.recommendedModel || '' }), 'ready');
      if (czesterAiInstallEl) {
        czesterAiInstallEl.hidden = true;
      }
    } else if (result && result.ok) {
      await refreshCzesterAiStatus();
    } else {
      setCzesterAiStatusText(t('czester.ai.error'), 'error');
    }
  } catch {
    setCzesterAiStatusText(t('czester.ai.error'), 'error');
  } finally {
    czesterAiBusy = false;
    if (czesterAiInstallEl && !czesterAiInstallEl.hidden) {
      czesterAiInstallEl.disabled = false;
      czesterAiInstallEl.textContent = t('czester.ai.install');
    }
  }
  return installResult;
}

async function getCzesterAiStatusSafe() {
  if (!window.tiktokLive || typeof window.tiktokLive.getCzesterAiStatus !== 'function') {
    return null;
  }
  try {
    return await window.tiktokLive.getCzesterAiStatus();
  } catch {
    return null;
  }
}

function isCzesterAiReady(status) {
  return Boolean(status && status.ready && status.ollamaRunning);
}

async function maybeShowCzesterOllamaPrompt(options = {}) {
  if (!isOllamaPromptUnlocked()) {
    return;
  }
  if (czesterOllamaPromptShownThisSession && !options.force) {
    return;
  }

  const status = await getCzesterAiStatusSafe();
  if (isCzesterAiReady(status)) {
    return;
  }

  czesterOllamaPromptShownThisSession = true;
  setCzesterPanelOpen(true);
  appendCzesterMessage('bot', t('czester.ollama.prompt'), {
    animate: false,
    variant: 'analysis',
    actions: [
      { id: 'install-ollama', label: t('czester.ollama.accept') },
      { id: 'decline-ollama', label: t('czester.ollama.decline') }
    ]
  });
}

async function acceptCzesterOllamaPrompt() {
  localStorage.removeItem(OLLAMA_PROMPT_DECLINED_KEY);
  appendCzesterMessage('bot', t('czester.ollama.installing'), { animate: false, variant: 'analysis' });
  const result = await installCzesterAiPack();
  const status = result && result.status ? result.status : await getCzesterAiStatusSafe();
  if (isCzesterAiReady(status)) {
    appendCzesterMessage('bot', t('czester.ollama.ready'), { animate: false, variant: 'analysis' });
  } else if (!result || (!result.manual && !result.ok)) {
    appendCzesterMessage('bot', t('czester.ollama.error'), { animate: false, variant: 'analysis' });
  }
}

function declineCzesterOllamaPrompt() {
  localStorage.setItem(OLLAMA_PROMPT_DECLINED_KEY, new Date().toISOString());
  appendCzesterMessage('bot', t('czester.ollama.declined'), { animate: false, variant: 'analysis' });
}

function syncAvatarImages(images) {
  const nextImages = Array.isArray(images) ? images.filter((image) => typeof image === 'string' && image) : [];
  if (nextImages.join('|') === avatarImages.join('|')) {
    return;
  }

  avatarImages = nextImages;
  userAvatars.clear();
  czesterUserAvatar = '';
  renderCzester();
}

function getAvatarKey(message) {
  const key = message && (message.uniqueId || message.authorName);
  return typeof key === 'string' ? key.trim().toLowerCase() : '';
}

function pickRandomAvatar() {
  if (!avatarImages.length) {
    return '';
  }

  const index = Math.floor(Math.random() * avatarImages.length);
  return avatarImages[index];
}

function assignAvatarForJoin(message) {
  const key = getAvatarKey(message);
  const avatar = pickRandomAvatar();
  if (key && avatar) {
    userAvatars.set(key, avatar);
  }
}

function getAvatarForMessage(message) {
  const key = getAvatarKey(message);
  if (!generalSettings.galleryAvatars && !key) {
    return './assets/enigma-avatar.png';
  }
  if (!key) {
    return '';
  }

  if (!generalSettings.galleryAvatars) {
    return message.avatar || liveViewerAvatars.get(key) || './assets/enigma-avatar.png';
  }

  if (!avatarImages.length) {
    return '';
  }

  if (!userAvatars.has(key)) {
    userAvatars.set(key, pickRandomAvatar());
  }

  return userAvatars.get(key);
}

function resetStreamStats() {
  giftTotalsByUser.clear();
  tapTotalsByUser.clear();
  liveBoxes.length = 0;
  activeChatUsers.clear();
  activeModerators.clear();
  czesterSpamBuckets.clear();
  czesterSpamAlerts.clear();
  lastHondaOnlineAlertAt = 0;
  liveViewerCount = 0;
  chatMessageCount = 0;
  resetCzesterLiveAnalysis();
  renderBoxesPanel();
  setOpenRightWidget('');
}

function resetMessages() {
  clearTimeout(revealFallbackTimer);
  revealFallbackTimer = null;
  clearTimeout(boxesArchiveRefreshTimer);
  boxesArchiveRefreshTimer = null;
  queue.length = 0;
  visibleMessages.length = 0;
  userAvatars.clear();
  queuedMessagesById.clear();
  visibleMessagesById.clear();
  boxesArchiveContentCache.clear();
  boxesArchiveEntries = [];
  selectedBoxesArchiveId = '';
  selectedBoxesArchive = null;
  resetStreamStats();
  messagesEl.replaceChildren();
  renderedMessageElements.clear();
  updateStatus();
}

function isUnknownUserValue(value) {
  const normalized = String(value || '').trim().toLowerCase();
  return !normalized || ['unknown', 'unknow', 'undefined', 'null'].includes(normalized);
}

function isAnonymousBoxMessage(message) {
  return Boolean(
    message
    && (message.kind || 'chat') === 'box'
    && isUnknownUserValue(message.authorName)
    && isUnknownUserValue(message.uniqueId)
  );
}

function getStatsUserKey(message) {
  const uniqueId = typeof message.uniqueId === 'string' ? message.uniqueId.trim() : '';
  const authorName = typeof message.authorName === 'string' ? message.authorName.trim() : '';
  const key = (uniqueId || authorName).toLowerCase();
  return isUnknownUserValue(key) ? '' : key;
}

function normalizeChatUserId(value) {
  return String(value || '').trim().replace(/^@/, '').toLowerCase();
}

function getGiftStatsKey(message) {
  return getStatsUserKey(message);
}

function normalizeGiftNameForStats(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isHeartMeGift(message) {
  const kind = message && (message.kind || 'chat');
  return kind === 'gift' && normalizeGiftNameForStats(message.giftName) === HEART_ME_GIFT_NAME;
}

function trackGiftStats(message) {
  const coins = Math.max(0, Number(message.giftCost) || 0);
  const key = getGiftStatsKey(message);
  if (!key || coins <= 0) {
    return;
  }

  const current = giftTotalsByUser.get(key) || {
    name: message.authorName || message.uniqueId || key,
    coins: 0
  };
  current.name = message.authorName || current.name;
  current.coins += coins;
  giftTotalsByUser.set(key, current);
}

function trackTapStats(message) {
  const kind = message && (message.kind || 'chat');
  if (kind !== 'like') {
    return;
  }

  const key = getStatsUserKey(message);
  if (!key) {
    return;
  }

  const incomingTotal = Number(message.total);
  const incomingCount = Number(message.likeCount);
  const current = tapTotalsByUser.get(key) || {
    name: message.authorName || message.uniqueId || key,
    taps: 0
  };
  current.name = message.authorName || current.name;

  if (Number.isFinite(incomingTotal) && incomingTotal > 0) {
    current.taps = Math.max(current.taps, Math.floor(incomingTotal));
  } else {
    current.taps += Math.max(1, Math.floor(Number.isFinite(incomingCount) ? incomingCount : 1));
  }

  tapTotalsByUser.set(key, current);
}

function trackActiveUserStats(message) {
  const key = getStatsUserKey(message);
  if (!key) {
    return;
  }

  const current = activeChatUsers.get(key) || {
    name: message.authorName || message.uniqueId || key,
    uniqueId: message.uniqueId || '',
    hasSentHeartMeGift: false
  };
  current.name = message.authorName || current.name;
  current.uniqueId = message.uniqueId || current.uniqueId;
  current.hasSentHeartMeGift = current.hasSentHeartMeGift || isHeartMeGift(message);
  activeChatUsers.set(key, current);
}

function trackModeratorStats(message) {
  if (!message.isModerator) {
    return;
  }

  const key = getStatsUserKey(message);
  if (!key) {
    return;
  }

  const current = activeModerators.get(key) || {
    name: message.authorName || message.uniqueId || key,
    uniqueId: message.uniqueId || '',
    lastSeen: 0
  };
  current.name = message.authorName || current.name;
  current.uniqueId = message.uniqueId || current.uniqueId;
  current.lastSeen = Date.now();
  activeModerators.set(key, current);
}

function trackIncomingMessageStats(message) {
  if (!message) {
    return;
  }

  trackActiveUserStats(message);
  trackModeratorStats(message);
  trackTapStats(message);

  if (message.upsert) {
    return;
  }

  const kind = message.kind || 'chat';
  if (kind === 'chat') {
    chatMessageCount += 1;
  }

  if (kind === 'gift' || kind === 'box') {
    trackGiftStats(message);
  }

  updateCzesterViewerProfile(message);
}

function normalizeSpamText(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function getSpamAuthorKey(message) {
  return normalizeCreatorHandle(message && (message.uniqueId || message.authorName))
    || String(message && (message.uniqueId || message.authorName) || '').trim().toLowerCase();
}

function pruneCzesterSpamBuckets(now = Date.now()) {
  for (const [key, timestamps] of czesterSpamBuckets) {
    const fresh = timestamps.filter((timestamp) => now - timestamp <= CZESTER_SPAM_WINDOW_MS);
    if (fresh.length) {
      czesterSpamBuckets.set(key, fresh);
    } else {
      czesterSpamBuckets.delete(key);
    }
  }

  for (const [key, timestamp] of czesterSpamAlerts) {
    if (now - timestamp > CZESTER_SPAM_ALERT_COOLDOWN_MS) {
      czesterSpamAlerts.delete(key);
    }
  }
}

function inspectCzesterSpam(message) {
  if (!message || (message.kind || 'chat') !== 'chat') {
    return;
  }

  const authorKey = getSpamAuthorKey(message);
  const text = normalizeSpamText(getMessagePlainText(message));
  if (!authorKey || !text) {
    return;
  }

  const now = Date.now();
  pruneCzesterSpamBuckets(now);
  const bucketKey = `${authorKey}:${text}`;
  const timestamps = (czesterSpamBuckets.get(bucketKey) || [])
    .filter((timestamp) => now - timestamp <= CZESTER_SPAM_WINDOW_MS);
  timestamps.push(now);
  czesterSpamBuckets.set(bucketKey, timestamps);

  if (timestamps.length < CZESTER_SPAM_MIN_REPEAT || czesterSpamAlerts.has(bucketKey)) {
    return;
  }

  czesterSpamAlerts.set(bucketKey, now);
  if (tamagotchi?.hatched && now - Number(tamagotchi.spamDebt || 0) >= 1200000) { tamagotchi.health = clampPet(tamagotchi.health - 1); tamagotchi.spamDebt = now; saveTamagotchi(); renderTamagotchi(); }
  updateCzesterViewerProfile(message, { spam: true });
  const author = String(message.authorName || message.uniqueId || authorKey).trim();
  notifyCzester('spam-alert', t('czester.notice.spam', {
    author,
    count: timestamps.length
  }), {
    animate: false,
    payload: {
      key: bucketKey,
      author,
      text,
      count: timestamps.length
    }
  });
}

function notifyCzesterSuperFanJoin(message) {
  if (!message || (message.kind || '') !== 'member' || !message.isSuperFan) {
    return;
  }
  const name = String(message.authorName || message.uniqueId || '').replace(/^@+/, '').trim();
  if (!name) {
    return;
  }
  const key = normalizeCreatorHandle(message.uniqueId || name) || name.toLowerCase();
  if (wasCzesterNoticeRecentlyShown('superfan-join', key, 5 * 60 * 1000)) {
    return;
  }
  notifyCzester('superfan-join', t('czester.notice.superfanJoin', { name }), {
    animate: false,
    variant: 'superfan',
    payload: { key, name }
  });
}

function hasHondaOnCurrentChat() {
  const targetId = normalizeChatUserId(HONDA_CHAT_UNIQUE_ID);
  if (!targetId) {
    return false;
  }

  if (activeChatUsers.has(targetId)) {
    return true;
  }

  for (const entry of activeChatUsers.values()) {
    if (
      normalizeChatUserId(entry && entry.uniqueId) === targetId
      || normalizeChatUserId(entry && entry.name) === targetId
    ) {
      return true;
    }
  }

  return false;
}

function showHondaOnlineNotice() {
  if (!battleBanner) {
    return;
  }

  clearTimeout(battleBannerTimer);
  battleBanner.dataset.tone = 'honda';
  battleBanner.textContent = HONDA_ON_CHAT_TEXT;
  battleBanner.hidden = false;
  battleBannerTimer = setTimeout(() => {
    battleBanner.hidden = true;
    battleBanner.textContent = '';
    delete battleBanner.dataset.tone;
  }, 12000);
}

function checkHondaOnlinePresence() {
  if (!isHondaAlertsUnlocked() || !isOnlineConnectionState(state) || !hasHondaOnCurrentChat()) {
    return;
  }

  const now = Date.now();
  if (now - lastHondaOnlineAlertAt < HONDA_ONLINE_ALERT_COOLDOWN_MS) {
    return;
  }

  lastHondaOnlineAlertAt = now;
  showHondaOnlineNotice();
}

function clearCoinsPromoTimer() {
  clearTimeout(coinsPromoTimer);
  coinsPromoTimer = null;
  coinsPromoCreatorKey = '';
}

function getCoinsPromoCreatorKey() {
  if (!isOnlineConnectionState(state)) {
    return '';
  }

  return normalizeCreatorHandle(getCreatorUsernameFromState())
    || String(state.creatorId || '').trim()
    || 'creator';
}

function createCoinsPromoMessage() {
  return {
    id: `coin-promo-${Date.now()}`,
    kind: 'coin-promo',
    timestamp: Date.now(),
    text: t('coins.chatPromo', {
      code: COINS_REFERRAL_CODE,
      url: COINS_REFERRAL_URL
    }),
    localOnly: true
  };
}

function showCoinsPromoMessage() {
  if (!isOnlineConnectionState(state)) {
    clearCoinsPromoTimer();
    return;
  }

  showMessageNow(createCoinsPromoMessage(), true);
}

function scheduleCoinsPromoForCurrentCreator() {
  const creatorKey = getCoinsPromoCreatorKey();
  if (!creatorKey) {
    clearCoinsPromoTimer();
    return;
  }

  if (coinsPromoTimer && coinsPromoCreatorKey === creatorKey) {
    return;
  }

  clearTimeout(coinsPromoTimer);
  coinsPromoCreatorKey = creatorKey;
  coinsPromoTimer = setTimeout(() => {
    coinsPromoTimer = null;
    const currentKey = getCoinsPromoCreatorKey();
    if (!currentKey || currentKey !== coinsPromoCreatorKey) {
      clearCoinsPromoTimer();
      return;
    }
    showCoinsPromoMessage();
    scheduleCoinsPromoForCurrentCreator();
  }, COINS_PROMO_INTERVAL_MS);
}

function getBoxDisplayName(message) {
  const key = message && message.boxKey === 'portal' ? 'portal' : 'chest';
  return t(key === 'portal' ? 'boxes.type.portal' : 'boxes.type.chest');
}

function getBoxSenderName(message) {
  return String(
    (message && message.authorName)
    || (message && message.uniqueId)
    || ''
  ).trim();
}

function getBoxCoinCount(message) {
  return Math.max(
    0,
    Number(message && (
      message.boxCoinCount
      || message.giftCost
      || message.diamondCount
    )) || 0
  );
}

function getBoxPeopleCount(message) {
  return Math.max(
    0,
    Number(message && (
      message.boxPeopleCount
      || message.audienceCount
      || message.peopleCount
    )) || 0
  );
}

function getBoxEntryId(message) {
  return String(
    (message && message.boxEnvelopeId)
    || (message && message.envelopeId)
    || (message && message.id)
    || `${message && message.timestamp || Date.now()}:${getBoxSenderName(message)}:${getBoxCoinCount(message)}`
  );
}

function createBoxEntryFromMessage(message, fallbackIndex = 0) {
  const sender = getBoxSenderName(message);
  if (!message || !sender || isUnknownUserValue(sender)) {
    return null;
  }

  return {
    id: getBoxEntryId(message) || `box-${fallbackIndex}`,
    timestamp: message.timestamp || message.time || new Date().toISOString(),
    sender,
    uniqueId: message.uniqueId || '',
    type: message.boxKey === 'portal' ? 'portal' : 'chest',
    coins: getBoxCoinCount(message),
    people: getBoxPeopleCount(message)
  };
}

function trackLiveBox(message) {
  if (!message || (message.kind || 'chat') !== 'box') {
    return;
  }

  const entry = createBoxEntryFromMessage(message);
  if (!entry) {
    return;
  }

  const existingIndex = liveBoxes.findIndex((item) => item.id === entry.id);

  if (existingIndex >= 0) {
    liveBoxes[existingIndex] = entry;
  } else {
    liveBoxes.unshift(entry);
  }

  renderBoxesPanel();
  if (activeSection === 'boxes') {
    scheduleBoxesArchiveRefresh();
  }
}

function getBoxesSummary(entries) {
  const boxes = Array.isArray(entries) ? entries : [];
  return {
    count: boxes.length,
    coins: boxes.reduce((sum, entry) => sum + Math.max(0, Number(entry.coins) || 0), 0),
    people: boxes.reduce((sum, entry) => sum + Math.max(0, Number(entry.people) || 0), 0)
  };
}

function getArchiveEntryBoxCount(entry) {
  if (!entry) {
    return 0;
  }

  if (Array.isArray(entry.boxes)) {
    return entry.boxes.length;
  }

  const summaryBoxCount = entry.summary && entry.summary.kinds
    ? Number(entry.summary.kinds.box) || 0
    : 0;

  return Math.max(0, summaryBoxCount);
}

function archiveEntryHasBoxes(entry) {
  return getArchiveEntryBoxCount(entry) > 0;
}

function updateBoxesSummary(entries) {
  const summary = getBoxesSummary(entries);
  if (boxesSummaryCountEl) {
    boxesSummaryCountEl.textContent = formatCounter(summary.count);
  }
  if (boxesSummaryCoinsEl) {
    boxesSummaryCoinsEl.textContent = formatCounter(summary.coins);
  }
  if (boxesSummaryPeopleEl) {
    boxesSummaryPeopleEl.textContent = formatCounter(summary.people);
  }
}

function renderBoxEntries(entries) {
  if (!boxesListEl) {
    return;
  }

  boxesListEl.replaceChildren();
  const boxes = Array.isArray(entries) ? entries : [];
  if (!boxes.length) {
    return;
  }

  const fragment = document.createDocumentFragment();
  boxes.forEach((entry) => {
    const item = document.createElement('article');
    item.className = 'box-entry';

    const icon = document.createElement('span');
    icon.className = 'box-entry-icon';
    icon.appendChild(createUiIcon('chest'));

    const content = document.createElement('div');
    content.className = 'box-entry-content';

    const header = document.createElement('div');
    header.className = 'box-entry-header';

    const title = document.createElement('strong');
    title.textContent = entry.type === 'portal' ? t('boxes.type.portal') : t('boxes.type.chest');

    const time = document.createElement('time');
    time.textContent = formatTime(entry.timestamp);

    header.append(title, time);

    const meta = document.createElement('div');
    meta.className = 'box-entry-meta';

    const sender = document.createElement('span');
    sender.append(document.createTextNode(`${t('boxes.sender')} `), document.createElement('strong'));
    sender.querySelector('strong').textContent = entry.sender;

    const coins = document.createElement('span');
    coins.append(document.createTextNode(`${t('boxes.coins')} `), document.createElement('strong'));
    coins.querySelector('strong').textContent = formatCounter(entry.coins);

    meta.append(sender, coins);

    if (entry.people > 0) {
      const people = document.createElement('span');
      people.append(document.createTextNode(`${t('boxes.people')} `), document.createElement('strong'));
      people.querySelector('strong').textContent = formatCounter(entry.people);
      meta.appendChild(people);
    }

    content.append(header, meta);
    item.append(icon, content);
    fragment.appendChild(item);
  });

  boxesListEl.appendChild(fragment);
}

function closeBoxesArchive() {
  selectedBoxesArchiveId = '';
  selectedBoxesArchive = null;
  updateBoxesArchiveSelection();
  updateBoxesSummary([]);
  if (boxesSessionEl) {
    boxesSessionEl.hidden = true;
  }
  if (boxesEmptyEl) {
    boxesEmptyEl.hidden = false;
  }
  if (boxesListEl) {
    boxesListEl.replaceChildren();
  }
}

function updateBoxesArchiveSelection() {
  if (!boxesArchiveListEl) {
    return;
  }

  boxesArchiveListEl.querySelectorAll('[data-boxes-archive-id]').forEach((button) => {
    button.dataset.active = String(button.dataset.boxesArchiveId === selectedBoxesArchiveId);
  });
}

function getFilteredBoxesArchiveEntries() {
  const query = boxesArchiveSearchEl ? boxesArchiveSearchEl.value.trim().toLowerCase() : '';
  if (!query) {
    return boxesArchiveEntries;
  }

  return boxesArchiveEntries.filter((entry) => (
    [entry.name, entry.username, entry.date, entry.time]
      .some((value) => String(value || '').toLowerCase().includes(query))
  ));
}

function renderBoxesArchiveList() {
  if (!boxesArchiveListEl) {
    return;
  }

  const entries = getFilteredBoxesArchiveEntries();
  boxesArchiveListEl.replaceChildren();
  if (!entries.length) {
    const empty = document.createElement('div');
    empty.className = 'archive-empty';
    empty.textContent = boxesArchiveEntries.length ? t('boxes.noMatches') : t('boxes.noSessions');
    boxesArchiveListEl.appendChild(empty);
    return;
  }

  entries.forEach((entry) => {
    const row = document.createElement('article');
    row.className = 'archive-entry boxes-session-entry';

    const button = document.createElement('button');
    button.className = 'archive-row boxes-session-row';
    button.type = 'button';
    button.dataset.boxesArchiveId = entry.id;

    const icon = document.createElement('span');
    icon.className = 'archive-row-icon';
    icon.appendChild(createUiIcon('chest'));

    const content = document.createElement('span');
    content.className = 'archive-row-content';

    const name = document.createElement('strong');
    name.className = 'archive-name';
    name.textContent = entry.name || t('archive.defaultName');

    const date = document.createElement('span');
    date.className = 'archive-meta';
    date.textContent = entry.date || '';

    const time = document.createElement('time');
    time.textContent = entry.time || '';

    const count = document.createElement('span');
    count.className = 'archive-count';
    count.append(createUiIcon('chest'), document.createTextNode(t('boxes.sessionCount', {
      count: formatCounter(getArchiveEntryBoxCount(entry))
    })));

    content.append(name, date, time);
    button.append(icon, content, count);
    button.addEventListener('click', () => openBoxesArchive(entry.id));

    row.appendChild(button);
    boxesArchiveListEl.appendChild(row);
  });
  updateBoxesArchiveSelection();
}

function renderBoxesPanel() {
  if (!boxesListEl) {
    return;
  }

  const boxes = selectedBoxesArchive && Array.isArray(selectedBoxesArchive.boxes)
    ? selectedBoxesArchive.boxes
    : [];
  updateBoxesSummary(boxes);
  if (boxesSessionEl) {
    boxesSessionEl.hidden = !selectedBoxesArchive;
  }
  if (boxesEmptyEl) {
    boxesEmptyEl.hidden = Boolean(selectedBoxesArchive);
  }
  if (boxesSessionTitleEl && selectedBoxesArchive) {
    boxesSessionTitleEl.textContent = selectedBoxesArchive.entry.name || t('archive.defaultName');
  }
  if (boxesSessionMetaEl && selectedBoxesArchive) {
    const entry = selectedBoxesArchive.entry || {};
    boxesSessionMetaEl.textContent = [entry.date, entry.time, t('boxes.sessionCount', {
      count: formatCounter(boxes.length)
    })].filter(Boolean).join(' · ');
  }
  renderBoxEntries(boxes);
}

async function openBoxesArchive(archiveId, options = {}) {
  const selected = boxesArchiveEntries.find((entry) => entry.id === archiveId);
  if (!selected) {
    closeBoxesArchive();
    return;
  }

  selectedBoxesArchiveId = archiveId;
  selectedBoxesArchive = {
    ...selected,
    entry: selected,
    boxes: Array.isArray(selected.boxes) ? selected.boxes : []
  };
  updateBoxesArchiveSelection();
  renderBoxesPanel();

  const payload = await getBoxesArchiveContent(selected, Boolean(options.force));
  if (!payload || selectedBoxesArchiveId !== archiveId) {
    return;
  }

  selectedBoxesArchive = payload;
  renderBoxesPanel();
}

function scheduleBoxesArchiveRefresh() {
  if (boxesArchiveRefreshTimer || activeSection !== 'boxes') {
    return;
  }
  boxesArchiveRefreshTimer = setTimeout(() => {
    boxesArchiveRefreshTimer = null;
    loadBoxesArchiveSessions({ preserveSelection: true, silent: true, force: true });
  }, BOXES_ARCHIVE_REFRESH_DEBOUNCE_MS);
}

async function getBoxesArchiveContent(entry, force = false) {
  if (!entry || !entry.id) {
    return null;
  }

  if (!force && boxesArchiveContentCache.has(entry.id)) {
    return boxesArchiveContentCache.get(entry.id);
  }

  const result = await window.tiktokLive.getArchiveContent(entry.id);
  if (!result || !result.ok) {
    return null;
  }

  const messages = Array.isArray(result.messages) ? result.messages : [];
  const boxes = messages
    .filter((message) => (message.kind || 'chat') === 'box')
    .map((message, index) => createBoxEntryFromMessage(message, index))
    .filter(Boolean);
  const payload = {
    ...entry,
    entry: result.entry || entry,
    messages,
    boxes
  };
  boxesArchiveContentCache.set(entry.id, payload);
  return payload;
}

async function loadBoxesArchiveSessions(options = {}) {
  if (!boxesArchiveListEl || boxesArchiveLoading) {
    return;
  }

  boxesArchiveLastRefreshAt = Date.now();
  const preserveSelection = Boolean(options.preserveSelection);
  boxesArchiveLoading = true;
  if (!options.silent) {
    boxesArchiveListEl.textContent = t('boxes.loading');
  }

  try {
    const listResult = await window.tiktokLive.listArchives();
    const entries = listResult && listResult.ok && Array.isArray(listResult.archives)
      ? listResult.archives
      : [];

    {
      const sessions = entries.filter(archiveEntryHasBoxes);
      boxesArchiveEntries = sessions;
      renderBoxesArchiveList();

      if (preserveSelection && selectedBoxesArchiveId && boxesArchiveEntries.some((entry) => entry.id === selectedBoxesArchiveId)) {
        openBoxesArchive(selectedBoxesArchiveId, { force: Boolean(options.force) });
      } else if (!preserveSelection) {
        closeBoxesArchive();
      } else if (selectedBoxesArchiveId) {
        closeBoxesArchive();
      }
      return;
    }

    const sessions = [];

    for (const entry of entries) {
      try {
        const payload = await getBoxesArchiveContent(entry, Boolean(options.force));
        if (!payload || !payload.boxes.length) {
          continue;
        }
        sessions.push(payload);
      } catch {
        // Jedno uszkodzone archiwum nie może blokować całej listy skrzyneczek.
      }
    }

    boxesArchiveEntries = sessions;
    renderBoxesArchiveList();

    if (preserveSelection && selectedBoxesArchiveId && boxesArchiveEntries.some((entry) => entry.id === selectedBoxesArchiveId)) {
      openBoxesArchive(selectedBoxesArchiveId);
    } else if (!preserveSelection) {
      closeBoxesArchive();
    } else if (selectedBoxesArchiveId) {
      closeBoxesArchive();
    }
  } catch (error) {
    boxesArchiveListEl.textContent = t('boxes.loadFailed');
  } finally {
    boxesArchiveLoading = false;
  }
}

function isMessageVisible(message) {
  if (message && message.kind === 'coin-promo') {
    return true;
  }
  return activeFilters.has(message.kind || 'chat');
}

function syncChatFilterButtons() {
  filterButtons.forEach((button) => {
    const filter = button.dataset.filter;
    if (filter) {
      button.dataset.active = String(activeFilters.has(filter));
    }
  });
}

function syncArchiveFilterButtons() {
  archiveFilterButtons.forEach((button) => {
    const filter = button.dataset.archiveFilter;
    if (filter) {
      button.dataset.active = String(activeArchiveFilters.has(filter));
    }
  });
}

function getMessageIdKey(message) {
  if (!message || message.id === undefined || message.id === null || message.id === '') {
    return '';
  }

  return String(message.id);
}

function getMessageRenderKey(message) {
  if (!message || typeof message !== 'object') {
    return '';
  }

  if (message.id) {
    return String(message.id);
  }

  if (!message.__renderKey) {
    Object.defineProperty(message, '__renderKey', {
      value: `local:${++renderKeyCounter}`,
      enumerable: false
    });
  }

  return message.__renderKey;
}

function scrollMessagesToEnd() {
  if (pendingScrollToEnd) {
    return;
  }

  pendingScrollToEnd = true;
  window.requestAnimationFrame(() => {
    pendingScrollToEnd = false;
    messagesEl.scrollTop = messagesEl.scrollHeight;
  });
}

function getMessageDisplayText(message) {
  if (!message || !message.textKey) {
    return getMessagePlainText(message);
  }

  if (message.textKey === 'event.gift') {
    const repeatCount = Math.max(1, Number(message.repeatCount) || 1);
    const giftCost = Number(message.giftCost) || 0;
    return t('event.gift', {
      giftName: message.giftName || '',
      countText: repeatCount > 1 ? ` x${repeatCount}` : '',
      costText: giftCost > 0 ? ` (🪙 ${giftCost})` : ''
    });
  }

  if (message.textKey === 'event.box') {
    const giftCost = Number(message.giftCost) || 0;
    const audienceCount = Number(message.audienceCount) || 0;
    return t('event.box', {
      boxName: t(message.boxKey === 'portal' ? 'event.box.portal' : 'event.box.chest'),
      costText: giftCost > 0 ? ` (🪙 ${giftCost})` : '',
      audienceText: audienceCount > 0 ? t('event.audience', { count: audienceCount }) : ''
    });
  }

  if (message.textKey === 'event.like') {
    return t('event.like', { total: Number(message.total) || 0 });
  }

  if (message.textKey === 'event.share') {
    return t('event.share');
  }

  return t(message.textKey);
}

function getMessagePlainText(message) {
  if (!message || typeof message !== 'object') {
    return '';
  }

  const directText = typeof message.text === 'string' ? message.text.trim() : '';
  if (directText) {
    return directText;
  }

  const archiveText = typeof message.archiveText === 'string' ? message.archiveText.trim() : '';
  if (!archiveText) {
    return '';
  }

  if ((message.kind || 'chat') !== 'chat') {
    return archiveText;
  }

  const authorName = typeof message.authorName === 'string' ? message.authorName.trim() : '';
  const uniqueId = typeof message.uniqueId === 'string' ? message.uniqueId.trim() : '';
  const escapedAuthor = authorName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escapedUniqueId = uniqueId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = [
    authorName && uniqueId ? new RegExp(`^${escapedAuthor}\\s*\\(@${escapedUniqueId}\\)\\s*:\\s*`) : null,
    authorName ? new RegExp(`^${escapedAuthor}\\s*:\\s*`) : null
  ].filter(Boolean);

  for (const pattern of patterns) {
    const stripped = archiveText.replace(pattern, '').trim();
    if (stripped && stripped !== archiveText) {
      return stripped;
    }
  }

  return archiveText;
}

function hasDisplayableMessageText(message) {
  if (!message || typeof message !== 'object') {
    return false;
  }

  return Boolean(
    getMessagePlainText(message)
    || message.textKey
    || message.archiveText
  );
}

function renderMessageElement(message) {
  const item = document.createElement('article');
  item.className = `message message-${message.kind || 'chat'}`;
  item.dataset.renderKey = getMessageRenderKey(message);
  if (message.isModerator) {
    item.classList.add('message-moderator');
  }
  if (message.isSuperFan) {
    item.classList.add('message-super-fan');
  }

  const time = document.createElement('time');
  time.className = 'message-time';
  time.textContent = formatTime(message.timestamp);

  const content = document.createElement('div');
  content.className = 'message-content';

  const authorName = typeof message.authorName === 'string' ? message.authorName.trim() : '';
  if (authorName) {
    const avatarSrc = getAvatarForMessage(message) || './assets/enigma-avatar.png';
    const author = document.createElement('span');
    author.className = 'message-author';
    author.textContent = authorName;

    const inlineTime = document.createElement('time');
    inlineTime.className = 'message-inline-time';
    inlineTime.textContent = formatTime(message.timestamp);

    const meta = document.createElement('div');
    meta.className = 'message-meta';
    const roleBadges = createMessageRoleBadges(message);
    if (roleBadges) {
      meta.append(author, roleBadges, inlineTime);
    } else {
      meta.append(author, inlineTime);
    }

    const body = document.createElement('span');
    body.className = 'message-body';
    body.textContent = getMessageDisplayText(message);

    const line = document.createElement('span');
    line.className = 'message-line';
    line.appendChild(body);

    const text = document.createElement('div');
    text.className = 'message-text';
    text.append(meta, line);

    if (avatarSrc) {
      const avatar = document.createElement('img');
      avatar.className = 'message-avatar';
      avatar.src = avatarSrc;
      avatar.alt = '';
      avatar.decoding = 'async';
      avatar.loading = 'lazy';
      avatar.addEventListener('error', () => {
        avatar.remove();
      }, { once: true });
      content.append(avatar, text);
    } else {
      content.appendChild(text);
    }
  } else if (message.kind === 'coin-promo') {
    const body = document.createElement('span');
    body.className = 'message-body coin-promo-body';

    const icon = document.createElement('span');
    icon.className = 'coin-promo-inline-icon';
    icon.appendChild(createUiIcon('coin'));

    const text = document.createElement('span');
    text.textContent = t('coins.chatPromo', {
      code: COINS_REFERRAL_CODE,
      url: COINS_REFERRAL_URL
    });

    const link = document.createElement('a');
    link.href = COINS_REFERRAL_URL;
    link.rel = 'noreferrer';
    link.dataset.externalUrl = COINS_REFERRAL_URL;
    link.textContent = COINS_REFERRAL_URL;

    body.append(icon, text, document.createTextNode(' '), link);

    if (document.documentElement.dataset.chatStyle === 'testowy') {
      const avatar = document.createElement('img');
      avatar.className = 'message-avatar coin-promo-avatar';
      avatar.src = CZESTER_AVATAR_SRC;
      avatar.alt = '';
      avatar.decoding = 'async';
      avatar.loading = 'lazy';

      const author = document.createElement('span');
      author.className = 'message-author';
      author.textContent = t('czester.title');

      const inlineTime = document.createElement('time');
      inlineTime.className = 'message-inline-time';
      inlineTime.textContent = formatTime(message.timestamp);

      const meta = document.createElement('div');
      meta.className = 'message-meta';
      meta.append(author, inlineTime);

      const textBox = document.createElement('div');
      textBox.className = 'message-text coin-promo-text';
      textBox.append(meta, body);

      content.append(avatar, textBox);
    } else {
      content.appendChild(body);
    }
  } else {
    const body = document.createElement('span');
    body.className = 'message-body';
    body.textContent = getMessageDisplayText(message);
    content.appendChild(body);
  }

  item.append(time, content);
  return item;
}

function renderVisibleMessages(scrollToEnd = false) {
  renderedMessageElements.clear();

  const fragment = document.createDocumentFragment();
  visibleMessages
    .filter(isMessageVisible)
    .forEach((message) => {
      const item = renderMessageElement(message);
      renderedMessageElements.set(getMessageRenderKey(message), item);
      fragment.appendChild(item);
    });

  messagesEl.replaceChildren(fragment);

  if (scrollToEnd) {
    scrollMessagesToEnd();
  }

  updateStatus();
}

function trimVisibleMessagesIfNeeded() {
  const overflow = visibleMessages.length - MAX_VISIBLE_MESSAGES;
  if (overflow <= 0) {
    return;
  }

  const removed = visibleMessages.splice(0, overflow);
  removed.forEach((message) => {
    const idKey = getMessageIdKey(message);
    if (idKey) {
      visibleMessagesById.delete(idKey);
    }
    const renderKey = getMessageRenderKey(message);
    const element = renderedMessageElements.get(renderKey);
    if (element) {
      element.remove();
    }
    renderedMessageElements.delete(renderKey);
  });
}

function upsertRenderedMessage(message, scrollToEnd = false) {
  const key = getMessageRenderKey(message);
  if (!key) {
    updateStatus();
    return;
  }

  const existing = renderedMessageElements.get(key);
  if (!isMessageVisible(message)) {
    if (existing) {
      existing.remove();
      renderedMessageElements.delete(key);
    }
    updateStatus();
    return;
  }

  const item = renderMessageElement(message);
  if (existing) {
    existing.replaceWith(item);
  } else {
    messagesEl.appendChild(item);
  }
  renderedMessageElements.set(key, item);

  if (scrollToEnd) {
    scrollMessagesToEnd();
  }

  updateStatus();
}

function showMessageNow(message, scrollToEnd = true) {
  visibleMessages.push(message);
  const idKey = getMessageIdKey(message);
  if (idKey) {
    queuedMessagesById.delete(idKey);
    visibleMessagesById.set(idKey, message);
  }
  trimVisibleMessagesIfNeeded();
  upsertRenderedMessage(message, scrollToEnd);
  if (isMessageVisible(message)) {
    readMessageAloud(message);
  }
}

function revealNextMessage() {
  clearTimeout(revealFallbackTimer);
  revealFallbackTimer = null;

  const now = Date.now();
  while (queue.length) {
    const message = queue[0];
    const revealAt = queuedMessageRevealAt.get(message) || now;
    if (revealAt > now) {
      break;
    }
    queue.shift();
    queuedMessageRevealAt.delete(message);
    const idKey = getMessageIdKey(message);
    if (idKey) {
      queuedMessagesById.delete(idKey);
    }
    showMessageNow(message, true);
  }
  updateStatus();
  scheduleRevealFallback();
}

function startRevealTimer() {
  clearTimeout(revealFallbackTimer);
  revealFallbackTimer = null;
  const safeDelay = CHAT_DELAY_OPTIONS.includes(Number(chatDelayMs)) ? Number(chatDelayMs) : DEFAULT_CHAT_DELAY_MS;
  chatDelayMs = safeDelay;
  const revealAt = Date.now() + safeDelay;
  queue.forEach((message) => queuedMessageRevealAt.set(message, revealAt));
  scheduleRevealFallback();
}

function scheduleRevealFallback() {
  if (revealFallbackTimer || !queue.length) {
    return;
  }

  const nextMessage = queue[0];
  const revealAt = queuedMessageRevealAt.get(nextMessage) || Date.now();
  revealFallbackTimer = setTimeout(revealNextMessage, Math.max(0, revealAt - Date.now()));
}

async function submitCreatorInput() {
  if (!creatorInput) {
    return;
  }

  const handle = normalizeCreatorHandle(creatorInput.value);
  if (!handle) {
    syncCreatorInputValue(true);
    return;
  }

  const currentHandle = normalizeCreatorHandle(getCreatorUsernameFromState());
  const connectionIsActiveOrPending = ['online', 'connecting', 'reconnecting'].includes(state.connectionStatus);
  if (handle === lastSubmittedCreator && handle === currentHandle && connectionIsActiveOrPending) {
    creatorInput.value = `@${handle}`;
    creatorInput.dataset.dirty = 'false';
    return;
  }

  lastSubmittedCreator = handle;
  creatorInput.value = `@${handle}`;
  creatorInput.dataset.dirty = 'false';
  resetMessages();

  try {
    const result = await window.tiktokLive.setCreator(handle);
    if (result && result.ok) {
      rememberCreator(result.creator || handle);
      if (result.creator && result.creator.username) {
        creatorInput.value = `@${result.creator.username}`;
      }
      return;
    }
  } catch {
    // Keep the typed value visible; status will continue showing connection state.
  }
}

window.tiktokLive.onState((nextState) => {
  const previousCreatorId = state.creatorId;
  const wasOffline = isOfflineConnectionState(state);
  const wasOnline = isOnlineConnectionState(state);
  state = nextState;
  checkLanguageChoiceForVersion();
  const isNowOffline = isOfflineConnectionState(state);
  if (isOnlineConnectionState(state) && (!wasOnline || state.creatorId !== previousCreatorId || !czesterCurrentLiveSessionKey)) {
    const sessionCreator = normalizeCreatorHandle(getCreatorUsernameFromState()) || String(state.creatorId || 'creator');
    czesterCurrentLiveSessionKey = `${sessionCreator}:${Date.now()}`;
  }
  trackLoggedInAchievement(state);
  trackCreatorConnectionAchievement(state, {
    countConnection: !wasOnline || state.creatorId !== previousCreatorId
  });
  if (state.systemSettings) {
    applyIncomingSystemSettings(state.systemSettings);
  }
  if (state.creatorId && state.creatorId !== previousCreatorId) {
    rememberCreator(state.currentCreator || getCreatorUsernameFromState());
  }
  if (state.currentCreator && state.currentCreator.username) {
    cacheRecentCreatorMeta(state.currentCreator);
    saveRecentCreatorMeta();
    renderRecentCreatorsCarousel();
  }
  syncCreatorOptions(state.creators);
  syncAvatarImages(state.avatarImages);
  syncAppVersion();
  syncUpdateAction(state.update);
  syncCreatorInputValue();
  if (previousCreatorId && state.creatorId !== previousCreatorId) {
    if (wasOnline && visibleMessages.length) {
      maybeNotifyCzesterLiveEndedSummary();
    }
    resetMessages();
  } else if (isNowOffline && (!wasOffline || queue.length || visibleMessages.length || renderedMessageElements.size)) {
    if (wasOnline) {
      maybeNotifyCzesterLiveEndedSummary();
    }
    resetMessages();
  }
  if (isOnlineConnectionState(state)) {
    scheduleCoinsPromoForCurrentCreator();
  } else {
    clearCoinsPromoTimer();
  }
  updateStatus();
});

if (creatorInput) {
  creatorInput.dataset.dirty = 'false';

  creatorInput.addEventListener('focus', () => {
    if (isRetroKb2Appearance()) {
      openCreatorSuggestions();
      return;
    }

    closeCreatorSuggestions();
  });

  creatorInput.addEventListener('click', () => {
    if (isRetroKb2Appearance()) {
      openCreatorSuggestions();
    }
  });

  creatorInput.addEventListener('pointerdown', () => {
    if (isRetroKb2Appearance()) {
      window.setTimeout(openCreatorSuggestions, 0);
    }
  });

  creatorInput.addEventListener('input', () => {
    creatorInput.dataset.dirty = 'true';
    activeCreatorSuggestionIndex = -1;
    if (isRetroKb2Appearance()) {
      openCreatorSuggestions();
      return;
    }

    closeCreatorSuggestions();
  });

  creatorInput.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      if (isRetroKb2Appearance()) {
        event.preventDefault();
        if (!creatorSuggestions || creatorSuggestions.hidden) {
          openCreatorSuggestions();
        }
        setActiveCreatorSuggestion(activeCreatorSuggestionIndex + 1);
      }
      return;
    }

    if (event.key === 'ArrowUp') {
      if (isRetroKb2Appearance()) {
        event.preventDefault();
        if (!creatorSuggestions || creatorSuggestions.hidden) {
          openCreatorSuggestions();
        }
        setActiveCreatorSuggestion(activeCreatorSuggestionIndex - 1);
      }
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      closeCreatorSuggestions();
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      closeCreatorSuggestions();
      submitCreatorInput();
    }
  });

  creatorInput.addEventListener('change', () => {
    if (creatorInput.dataset.dirty === 'true') {
      submitCreatorInput();
    }
  });

  creatorInput.addEventListener('blur', () => {
    window.setTimeout(() => {
      const activeElement = document.activeElement;
      if (creatorSuggestions && creatorSuggestions.contains(activeElement)) {
        return;
      }

      if (creatorInput.dataset.dirty === 'true') {
        submitCreatorInput();
      }
      closeCreatorSuggestions();
    }, 120);
  });
}

if (recentCreatorsCarousel) {
  recentCreatorsCarousel.addEventListener('scroll', updateRecentCreatorsNav, { passive: true });
}

[recentCreatorsPrev, recentCreatorsNext].forEach((button) => {
  if (!button) {
    return;
  }
  button.addEventListener('click', () => {
    scrollRecentCreators(Number(button.dataset.direction) || 1);
  });
});

window.addEventListener('resize', updateRecentCreatorsNav);

document.addEventListener('pointerdown', (event) => {
  const target = event.target;
  if (!(target instanceof Element) || target.closest('.creator-picker')) {
    return;
  }

  closeCreatorSuggestions();
});

syncChatFilterButtons();
syncArchiveFilterButtons();

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    if (!filter) {
      return;
    }

    if (activeFilters.has(filter)) {
      activeFilters.delete(filter);
    } else {
      activeFilters.add(filter);
    }

    button.dataset.active = String(activeFilters.has(filter));
    saveEventFilters(CHAT_FILTER_SETTINGS_KEY, activeFilters);
    renderVisibleMessages();
    if (filter === 'chat' && !activeFilters.has('chat')) {
      stopSpeech();
    }
  });
});

function setActiveSettingsTab(tab) {
  const nextTab = settingsPanels.some((panel) => panel.dataset.settingsPanel === tab) ? tab : 'general';
  activeSettingsTab = nextTab;

  settingsTabs.forEach((button) => {
    const isActive = button.dataset.settingsTab === activeSettingsTab;
    button.dataset.active = String(isActive);
    button.setAttribute('aria-selected', String(isActive));
  });

  settingsPanels.forEach((panel) => {
    panel.hidden = panel.dataset.settingsPanel !== activeSettingsTab;
  });
}

settingsTabs.forEach((button) => {
  button.addEventListener('click', () => {
    setActiveSettingsTab(button.dataset.settingsTab);
  });
});

function setActiveAppearanceSubtab(tab) {
  const nextTab = appearanceSubpanels.some((panel) => panel.dataset.appearanceSubpanel === tab)
    ? tab
    : 'chat-style';

  appearanceSubtabs.forEach((button) => {
    const isActive = button.dataset.appearanceSubtab === nextTab;
    button.dataset.active = String(isActive);
    button.setAttribute('aria-selected', String(isActive));
  });

  appearanceSubpanels.forEach((panel) => {
    panel.hidden = panel.dataset.appearanceSubpanel !== nextTab;
  });
}

appearanceSubtabs.forEach((button) => {
  button.addEventListener('click', () => {
    setActiveAppearanceSubtab(button.dataset.appearanceSubtab);
  });
});

setActiveAppearanceSubtab('chat-style');

function setActiveAboutTab(tab) {
  const requestedPanel = aboutPanels.find((panel) => panel.dataset.aboutPanel === tab);
  const nextTab = requestedPanel ? tab : 'program';
  activeAboutTab = nextTab;

  aboutTabs.forEach((button) => {
    const isActive = button.dataset.aboutTab === activeAboutTab;
    button.dataset.active = String(isActive);
    button.setAttribute('aria-selected', String(isActive));
  });

  aboutPanels.forEach((panel) => {
    panel.hidden = panel.dataset.aboutPanel !== activeAboutTab;
  });
}

aboutTabs.forEach((button) => {
  button.addEventListener('click', () => {
    setActiveAboutTab(button.dataset.aboutTab);
  });
});

function updateArchiveSelection() {
  if (!archiveListEl) {
    return;
  }

  archiveListEl.querySelectorAll('[data-archive-id]').forEach((button) => {
    button.dataset.active = String(button.dataset.archiveId === selectedArchiveId);
  });
}

function closeArchive() {
  selectedArchiveId = '';
  selectedArchive = null;
  updateArchiveSelection();
  if (archiveSessionEl) {
    archiveSessionEl.hidden = true;
  }
  if (archiveDetailEmptyEl) {
    archiveDetailEmptyEl.hidden = false;
  }
  if (archiveMessagesEl) {
    archiveMessagesEl.replaceChildren();
  }
}

function getArchiveSummary(messages) {
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
    if (kind === 'gift' || kind === 'box') {
      giftCoins += Math.max(0, Number(message.giftCost) || 0);
    }
    if (message.isModerator) {
      moderators.add(String(message.uniqueId || message.authorName || '').toLowerCase());
    }
  });

  return {
    total: messages.length,
    chat: kinds.chat,
    giftCoins,
    moderators: Array.from(moderators).filter(Boolean).length
  };
}

function renderArchiveSummary(messages) {
  const summary = getArchiveSummary(messages);
  if (archiveSummaryMessagesEl) {
    archiveSummaryMessagesEl.textContent = formatCounter(summary.total);
  }
  if (archiveSummaryChatEl) {
    archiveSummaryChatEl.textContent = formatCounter(summary.chat);
  }
  if (archiveSummaryCoinsEl) {
    archiveSummaryCoinsEl.textContent = formatCounter(summary.giftCoins);
  }
  if (archiveSummaryModeratorsEl) {
    archiveSummaryModeratorsEl.textContent = formatCounter(summary.moderators);
  }
}

function renderArchiveMessages() {
  if (!archiveMessagesEl || !selectedArchive) {
    return;
  }

  const messages = Array.isArray(selectedArchive.messages) ? selectedArchive.messages : [];
  const filtered = messages.filter((message) => activeArchiveFilters.has(message.kind || 'chat'));
  archiveMessagesEl.replaceChildren();

  if (!filtered.length) {
    const empty = document.createElement('div');
    empty.className = 'archive-filter-empty';
    empty.textContent = t('archive.filteredEmpty');
    archiveMessagesEl.appendChild(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  filtered.forEach((message) => {
    const item = renderMessageElement(message);
    item.classList.add('archive-message');
    fragment.appendChild(item);
  });
  archiveMessagesEl.appendChild(fragment);
}

function renderArchiveSession() {
  if (!selectedArchive || !archiveSessionEl) {
    closeArchive();
    return;
  }

  const entry = selectedArchive.entry || {};
  archiveSessionEl.hidden = false;
  if (archiveDetailEmptyEl) {
    archiveDetailEmptyEl.hidden = true;
  }
  if (archiveSessionNameEl) {
    archiveSessionNameEl.textContent = entry.name || t('archive.defaultName');
  }
  if (archiveSessionMetaEl) {
    const parts = [entry.date, entry.time];
    if (selectedArchive.legacy) {
      parts.push(t('archive.legacy'));
    }
    archiveSessionMetaEl.textContent = parts.filter(Boolean).join(' · ');
  }
  renderArchiveSummary(selectedArchive.messages || []);
  renderArchiveMessages();
}

async function openArchive(archiveId) {
  if (!archiveSessionEl || !archiveId) {
    return;
  }

  selectedArchiveId = archiveId;
  updateArchiveSelection();
  if (archiveSessionNameEl) {
    archiveSessionNameEl.textContent = t('archive.loading');
  }
  archiveSessionEl.hidden = false;
  if (archiveDetailEmptyEl) {
    archiveDetailEmptyEl.hidden = true;
  }

  try {
    const result = await window.tiktokLive.getArchiveContent(archiveId);
    if (!result || !result.ok) {
      throw new Error(result && result.error ? result.error : t('archive.loadFailed'));
    }
    selectedArchive = {
      entry: result.entry,
      messages: Array.isArray(result.messages) ? result.messages : [],
      legacy: Boolean(result.legacy)
    };
    renderArchiveSession();
  } catch (error) {
    closeArchive();
    if (archiveDetailEmptyEl) {
      archiveDetailEmptyEl.hidden = false;
      const description = archiveDetailEmptyEl.querySelector('span:last-child');
      if (description) {
        description.textContent = t('archive.loadFailedWithError', {
          error: error && error.message ? error.message : error
        });
      }
    }
  }
}

function getFilteredArchiveEntries() {
  const query = archiveSearchEl ? archiveSearchEl.value.trim().toLowerCase() : '';
  if (!query) {
    return archiveEntries;
  }

  return archiveEntries.filter((entry) => (
    [entry.name, entry.username, entry.date, entry.time]
      .some((value) => String(value || '').toLowerCase().includes(query))
  ));
}

function renderArchiveList() {
  if (!archiveListEl) {
    return;
  }

  const entries = getFilteredArchiveEntries();
  archiveListEl.replaceChildren();
  if (!entries.length) {
    const empty = document.createElement('div');
    empty.className = 'archive-empty';
    empty.textContent = archiveEntries.length ? t('archive.noMatches') : t('archive.empty');
    archiveListEl.appendChild(empty);
    return;
  }

  entries.forEach((entry) => {
    const row = document.createElement('article');
    row.className = 'archive-entry';

    const button = document.createElement('button');
    button.className = 'archive-row';
    button.type = 'button';
    button.dataset.archiveId = entry.id;

    const icon = document.createElement('span');
    icon.className = 'archive-row-icon';
    icon.appendChild(createUiIcon('broadcast'));

    const content = document.createElement('span');
    content.className = 'archive-row-content';

    const name = document.createElement('strong');
    name.className = 'archive-name';
    name.textContent = entry.name || t('archive.defaultName');

    const date = document.createElement('span');
    date.className = 'archive-meta';
    date.textContent = entry.date || '';

    const time = document.createElement('time');
    time.textContent = entry.time || '';

    const count = document.createElement('span');
    count.className = 'archive-count';
    count.append(createUiIcon('message'), document.createTextNode(formatCounter(entry.summary && entry.summary.total)));

    content.append(name, date, time);
    button.append(icon, content, count);
    button.addEventListener('click', () => openArchive(entry.id));

    row.appendChild(button);
    archiveListEl.appendChild(row);
  });
  updateArchiveSelection();
}

function setArchiveStatus(message, restore = true) {
  const status = document.querySelector('.archive-status');
  if (!status) {
    return;
  }

  status.textContent = message;
  if (restore) {
    window.setTimeout(() => {
      status.textContent = t('archive.status');
    }, 2400);
  }
}

async function exportSelectedArchive() {
  if (!selectedArchiveId) {
    return;
  }
  try {
    const result = await window.tiktokLive.exportArchive(selectedArchiveId);
    if (result && result.ok) {
      setArchiveStatus(t('archive.exported'));
    } else if (!result || !result.canceled) {
      setArchiveStatus(t('archive.exportFailed'));
    }
  } catch {
    setArchiveStatus(t('archive.exportFailed'));
  }
}

async function deleteSelectedArchive() {
  if (!selectedArchiveId || !selectedArchive) {
    return;
  }
  const name = selectedArchive.entry && selectedArchive.entry.name
    ? selectedArchive.entry.name
    : t('archive.defaultName');
  if (!window.confirm(t('archive.deleteConfirm', { name }))) {
    return;
  }

  try {
    const result = await window.tiktokLive.deleteArchive(selectedArchiveId);
    if (!result || !result.ok) {
      setArchiveStatus(result && result.error === 'archive-active'
        ? t('archive.activeDeleteFailed')
        : t('archive.deleteFailed'));
      return;
    }
    closeArchive();
    await refreshArchive();
  } catch {
    setArchiveStatus(t('archive.deleteFailed'));
  }
}

async function openArchiveFolder() {
  try {
    const result = await window.tiktokLive.openArchiveFolder();
    if (!result || !result.ok) {
      setArchiveStatus(t('archive.folderFailed'));
    }
  } catch {
    setArchiveStatus(t('archive.folderFailed'));
  }
}

async function refreshArchive() {
  if (!archiveListEl) {
    return;
  }

  archiveLastRefreshAt = Date.now();
  archiveListEl.textContent = t('archive.refreshing');
  try {
    const result = await window.tiktokLive.listArchives();
    archiveEntries = result && result.ok && Array.isArray(result.archives) ? result.archives : [];
    renderArchiveList();
    indexCzesterArchiveProfiles(archiveEntries);
    const hasSelectedArchive = selectedArchiveId && archiveEntries.some((entry) => entry.id === selectedArchiveId);
    if (hasSelectedArchive) {
      await openArchive(selectedArchiveId);
    } else if (selectedArchiveId) {
      closeArchive();
    }
  } catch (error) {
    archiveListEl.textContent = t('archive.listFailed', {
      error: error && error.message ? error.message : error
    });
  }
}

function setNotesStatus(message, restore = true) {
  if (!notesStatusEl) {
    return;
  }

  notesStatusEl.textContent = message;
  if (restore) {
    window.setTimeout(() => {
      notesStatusEl.textContent = t('notes.status');
    }, 2400);
  }
}

function getFilteredNoteEntries() {
  const query = notesSearchEl ? notesSearchEl.value.trim().toLowerCase() : '';
  if (!query) {
    return noteEntries;
  }

  return noteEntries.filter((note) => (
    [note.title, note.updatedAt, note.createdAt]
      .some((value) => String(value || '').toLowerCase().includes(query))
  ));
}

function updateNoteEditorMeta() {
  if (!noteMetaEl) {
    return;
  }

  if (selectedNote && selectedNote.updatedAt) {
    noteMetaEl.textContent = t('notes.updatedAt', { time: formatTime(selectedNote.updatedAt) });
  } else {
    noteMetaEl.textContent = t('notes.unsaved');
  }
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderNoteInlineMarkdown(value) {
  const codeParts = [];
  let html = escapeHtml(value).replace(/`([^`\n]+)`/g, (_match, code) => {
    const key = `\u0000CODE${codeParts.length}\u0000`;
    codeParts.push(`<code>${code}</code>`);
    return key;
  });

  html = html
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_\n]+)__/g, '<u>$1</u>')
    .replace(/~~([^~\n]+)~~/g, '<s>$1</s>')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');

  codeParts.forEach((part, index) => {
    html = html.replace(`\u0000CODE${index}\u0000`, part);
  });

  return html;
}

function renderNoteMarkdown(content) {
  const lines = String(content || '').replace(/\r\n/g, '\n').split('\n');
  const html = [];
  let listItems = [];
  let codeLines = [];
  let inCodeBlock = false;

  const flushList = () => {
    if (!listItems.length) {
      return;
    }
    html.push(`<ul>${listItems.map((item) => `<li>${renderNoteInlineMarkdown(item)}</li>`).join('')}</ul>`);
    listItems = [];
  };

  const flushCode = () => {
    html.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
    codeLines = [];
  };

  lines.forEach((line) => {
    if (/^\s*```\s*$/.test(line)) {
      if (inCodeBlock) {
        flushCode();
        inCodeBlock = false;
      } else {
        flushList();
        inCodeBlock = true;
        codeLines = [];
      }
      return;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      return;
    }

    const listMatch = line.match(/^\s*[-*]\s+(.+)$/);
    if (listMatch) {
      listItems.push(listMatch[1]);
      return;
    }

    flushList();

    const quoteMatch = line.match(/^\s*>\s?(.*)$/);
    if (quoteMatch) {
      html.push(`<blockquote>${renderNoteInlineMarkdown(quoteMatch[1]) || '&nbsp;'}</blockquote>`);
      return;
    }

    if (!line.trim()) {
      html.push('<p class="note-preview-empty">&nbsp;</p>');
      return;
    }

    html.push(`<p>${renderNoteInlineMarkdown(line)}</p>`);
  });

  if (inCodeBlock) {
    flushCode();
  }
  flushList();

  return html.join('');
}

function updateNotePreview() {
  if (!notePreviewEl || !noteContentInput) {
    return;
  }
  const content = noteContentInput.value;
  notePreviewEl.innerHTML = content.trim()
    ? renderNoteMarkdown(content)
    : `<p class="note-preview-empty">${escapeHtml(t('notes.previewEmpty'))}</p>`;
}

function setNoteEditorMode(mode) {
  noteEditorMode = mode === 'read' ? 'read' : 'edit';
  const readMode = noteEditorMode === 'read';
  const notesDetail = noteContentInput ? noteContentInput.closest('.notes-detail') : null;

  if (notesDetail) {
    notesDetail.dataset.noteMode = noteEditorMode;
  }
  if (noteTitleInput) {
    noteTitleInput.readOnly = readMode;
  }
  if (noteContentInput) {
    noteContentInput.readOnly = readMode;
    noteContentInput.hidden = readMode;
  }
  if (notePreviewEl) {
    notePreviewEl.hidden = !readMode;
  }
  noteFormatButtons.forEach((button) => {
    button.hidden = readMode;
  });
  const toolbar = noteFormatButtons[0] ? noteFormatButtons[0].closest('.note-format-toolbar') : null;
  if (toolbar) {
    toolbar.hidden = readMode;
  }
  if (editNoteButton) {
    editNoteButton.hidden = !readMode || !selectedNoteId;
  }
  if (saveNoteButton) {
    saveNoteButton.hidden = readMode;
  }

  updateNotePreview();
}

function resetNoteEditor() {
  selectedNoteId = '';
  selectedNote = null;
  if (noteTitleInput) {
    noteTitleInput.value = '';
  }
  if (noteContentInput) {
    noteContentInput.value = '';
  }
  updateNoteEditorMeta();
  setNoteEditorMode('edit');
  renderNotesList();
}

function getNoteFormatSample(format) {
  if (appLanguage === 'en') {
    return format === 'codeblock' ? 'code block' : 'text';
  }
  if (appLanguage === 'de') {
    return format === 'codeblock' ? 'Codeblock' : 'Text';
  }
  return format === 'codeblock' ? 'blok kodu' : 'tekst';
}

function applyNoteMarkdownFormat(format) {
  if (!noteContentInput) {
    return;
  }

  const textarea = noteContentInput;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.slice(start, end);
  const sample = getNoteFormatSample(format);
  let replacement = '';
  let innerStart = 0;
  let innerEnd = 0;

  if (format === 'quote' || format === 'list') {
    const marker = format === 'quote' ? '> ' : '- ';
    const text = selectedText || sample;
    replacement = text
      .split(/\r?\n/)
      .map((line) => `${marker}${line}`)
      .join('\n');
    innerStart = replacement.length;
    innerEnd = replacement.length;
  } else if (format === 'codeblock') {
    const text = selectedText || sample;
    replacement = `\`\`\`\n${text}\n\`\`\``;
    innerStart = 4;
    innerEnd = innerStart + text.length;
  } else {
    const wrappers = {
      bold: ['**', '**'],
      italic: ['*', '*'],
      underline: ['__', '__'],
      strike: ['~~', '~~'],
      code: ['`', '`']
    };
    const [prefix, suffix] = wrappers[format] || wrappers.bold;
    const text = selectedText || sample;
    replacement = `${prefix}${text}${suffix}`;
    innerStart = prefix.length;
    innerEnd = prefix.length + text.length;
  }

  textarea.setRangeText(replacement, start, end, 'select');
  if (selectedText) {
    textarea.setSelectionRange(start + replacement.length, start + replacement.length);
  } else {
    textarea.setSelectionRange(start + innerStart, start + innerEnd);
  }
  textarea.focus();
}

function renderNotesList() {
  if (!notesListEl) {
    return;
  }

  const entries = getFilteredNoteEntries();
  notesListEl.replaceChildren();
  if (!entries.length) {
    const empty = document.createElement('div');
    empty.className = 'archive-empty';
    empty.textContent = noteEntries.length ? t('notes.noMatches') : t('notes.empty');
    notesListEl.appendChild(empty);
    return;
  }

  entries.forEach((note) => {
    const row = document.createElement('article');
    row.className = 'archive-entry';

    const button = document.createElement('button');
    button.className = 'archive-row';
    button.type = 'button';
    button.dataset.noteId = note.id;
    button.dataset.active = String(note.id === selectedNoteId);

    const icon = document.createElement('span');
    icon.className = 'archive-row-icon';
    icon.appendChild(createUiIcon('message'));

    const content = document.createElement('span');
    content.className = 'archive-row-content';
    const title = document.createElement('strong');
    title.className = 'archive-name';
    title.textContent = note.title || t('notes.title');
    const updated = document.createElement('time');
    updated.className = 'archive-meta';
    updated.textContent = note.updatedAt ? formatTime(note.updatedAt) : '';
    content.append(title, updated);

    button.append(icon, content);
    button.addEventListener('click', () => openNote(note.id));
    row.appendChild(button);
    notesListEl.appendChild(row);
  });
}

async function refreshNotes() {
  if (!notesListEl || !window.tiktokLive || typeof window.tiktokLive.listNotes !== 'function') {
    return;
  }

  notesLastRefreshAt = Date.now();
  try {
    const result = await window.tiktokLive.listNotes();
    noteEntries = result && result.ok && Array.isArray(result.notes) ? result.notes : [];
    renderNotesList();
  } catch {
    notesListEl.textContent = t('notes.loadFailed');
  }
}

async function openNote(noteId) {
  if (!noteId || !window.tiktokLive || typeof window.tiktokLive.getNote !== 'function') {
    return;
  }

  try {
    const result = await window.tiktokLive.getNote(noteId);
    if (!result || !result.ok || !result.note) {
      setNotesStatus(t('notes.loadFailed'));
      return;
    }
    selectedNote = result.note;
    selectedNoteId = selectedNote.id;
    if (noteTitleInput) {
      noteTitleInput.value = selectedNote.title || '';
    }
    if (noteContentInput) {
      noteContentInput.value = selectedNote.content || '';
    }
    updateNoteEditorMeta();
    setNoteEditorMode('read');
    renderNotesList();
  } catch {
    setNotesStatus(t('notes.loadFailed'));
  }
}

async function saveCurrentNote() {
  if (!window.tiktokLive || typeof window.tiktokLive.saveNote !== 'function') {
    return;
  }

  const title = noteTitleInput ? noteTitleInput.value.trim() : '';
  const content = noteContentInput ? noteContentInput.value : '';
  if (!title && !content.trim()) {
    return;
  }

  try {
    const result = await window.tiktokLive.saveNote({
      id: selectedNoteId,
      title,
      content
    });
    if (!result || !result.ok) {
      setNotesStatus(t('notes.saveFailed'));
      return;
    }
    selectedNote = result.note;
    selectedNoteId = selectedNote.id;
    noteEntries = Array.isArray(result.notes) ? result.notes : noteEntries;
    if (noteTitleInput) {
      noteTitleInput.value = selectedNote.title || title;
    }
    if (noteContentInput) {
      noteContentInput.value = selectedNote.content || content;
    }
    renderNotesList();
    updateNoteEditorMeta();
    setNoteEditorMode('read');
    setNotesStatus(t('notes.saved'));
    unlockAchievement('first-note');
  } catch {
    setNotesStatus(t('notes.saveFailed'));
  }
}

async function deleteCurrentNote() {
  if (!selectedNoteId || !selectedNote || !window.tiktokLive || typeof window.tiktokLive.deleteNote !== 'function') {
    return;
  }

  const title = selectedNote.title || t('notes.title');
  if (!window.confirm(t('notes.deleteConfirm', { title }))) {
    return;
  }

  try {
    const result = await window.tiktokLive.deleteNote(selectedNoteId);
    if (!result || !result.ok) {
      setNotesStatus(t('notes.deleteFailed'));
      return;
    }
    noteEntries = Array.isArray(result.notes) ? result.notes : [];
    resetNoteEditor();
    setNotesStatus(t('notes.deleted'));
  } catch {
    setNotesStatus(t('notes.deleteFailed'));
  }
}

function setActiveSection(section) {
  const requestedButton = sidebarButtons.find((button) => button.dataset.section === section);
  const requestedPanel = viewPanels.find((panel) => panel.dataset.view === section);
  const nextSection = requestedPanel && !(requestedButton && requestedButton.hidden) ? section : 'chatbox';
  const previousSection = activeSection;
  const sectionChanged = previousSection !== nextSection;
  const now = Date.now();
  activeSection = nextSection;
  updateRadioFloatingVisibility();

  sidebarButtons.forEach((button) => {
    button.dataset.active = String(button.dataset.section === activeSection);
  });

  viewPanels.forEach((panel) => {
    panel.hidden = panel.dataset.view !== activeSection;
  });

  if (activeSection === 'archive' && (sectionChanged || !archiveEntries.length) && now - archiveLastRefreshAt > SECTION_AUTO_REFRESH_COOLDOWN_MS) {
    refreshArchive();
  }
  if (activeSection === 'notes' && (sectionChanged || !noteEntries.length) && now - notesLastRefreshAt > SECTION_AUTO_REFRESH_COOLDOWN_MS) {
    refreshNotes();
  }
  if (activeSection === 'boxes' && (sectionChanged || !boxesArchiveEntries.length) && now - boxesArchiveLastRefreshAt > SECTION_AUTO_REFRESH_COOLDOWN_MS) {
    loadBoxesArchiveSessions();
  }
  if (activeSection !== 'chatbox' && sectionChanged) {
    stopSpeech();
  }
}

sidebarButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setActiveSection(button.dataset.section);
  });
});

window.addEventListener('beforeunload', stopRadioPlayers);

if (boxesArchiveSearchEl) {
  boxesArchiveSearchEl.addEventListener('input', renderBoxesArchiveList);
}

if (refreshBoxesArchiveButton) {
  refreshBoxesArchiveButton.addEventListener('click', () => {
    loadBoxesArchiveSessions({ preserveSelection: true, force: true });
  });
}

if (czesterQuestionsButtonEl) {
  czesterQuestionsButtonEl.addEventListener('click', showCzesterQuestionsFromLastFiveMinutes);
}

if (czesterModeratorsButtonEl) {
  czesterModeratorsButtonEl.addEventListener('click', showCzesterActiveModerators);
}

if (czesterMessagesEl) {
  czesterMessagesEl.addEventListener('click', (event) => {
    const actionButton = event.target && typeof event.target.closest === 'function'
      ? event.target.closest('[data-czester-action]')
      : null;
    if (!actionButton) {
      return;
    }
    const action = actionButton.dataset.czesterAction;
    const actionMessage = actionButton.closest('.czester-message');
    const actionMessageId = actionMessage ? actionMessage.dataset.messageId : '';
    const storedMessage = czesterMessages.find((message) => message.id === actionMessageId);
    if (storedMessage) {
      storedMessage.actions = [];
      renderCzester();
    } else {
      actionButton.disabled = true;
    }
    if (action === 'install-ollama') {
      acceptCzesterOllamaPrompt();
      return;
    }
    if (action === 'decline-ollama') {
      declineCzesterOllamaPrompt();
    }
  });
}

if (czesterLauncherEl) {
  czesterLauncherEl.addEventListener('click', toggleCzesterPanel);
}

function setNotesDialogOpen(open) {
  if (!notesDialogBackdropEl) {
    return;
  }
  const nextOpen = Boolean(open);
  notesDialogBackdropEl.hidden = !nextOpen;
  notesLauncherEl?.setAttribute('aria-expanded', String(nextOpen));
  if (nextOpen) {
    refreshNotes();
    notesDialogCloseEl?.focus();
  } else {
    notesLauncherEl?.focus();
  }
}

notesLauncherEl?.addEventListener('click', () => {
  setNotesDialogOpen(Boolean(notesDialogBackdropEl?.hidden));
});
notesDialogCloseEl?.addEventListener('click', () => setNotesDialogOpen(false));
notesDialogBackdropEl?.addEventListener('click', (event) => {
  if (event.target === notesDialogBackdropEl) {
    setNotesDialogOpen(false);
  }
});

function setWidgetDialogOpen(backdrop, launcher, closeButton, open, onOpen) {
  if (!backdrop) {
    return;
  }
  const nextOpen = Boolean(open);
  backdrop.hidden = !nextOpen;
  launcher?.setAttribute('aria-expanded', String(nextOpen));
  if (nextOpen) {
    onOpen?.();
    closeButton?.focus();
  } else {
    launcher?.focus();
  }
}

achievementsLauncherEl?.addEventListener('click', () => {
  setWidgetDialogOpen(achievementsDialogBackdropEl, achievementsLauncherEl, achievementsDialogCloseEl, Boolean(achievementsDialogBackdropEl?.hidden), renderAchievements);
});
achievementsDialogCloseEl?.addEventListener('click', () => {
  setWidgetDialogOpen(achievementsDialogBackdropEl, achievementsLauncherEl, achievementsDialogCloseEl, false);
});
achievementsDialogBackdropEl?.addEventListener('click', (event) => {
  if (event.target === achievementsDialogBackdropEl) {
    setWidgetDialogOpen(achievementsDialogBackdropEl, achievementsLauncherEl, achievementsDialogCloseEl, false);
  }
});

settingsLauncherEl?.addEventListener('click', () => {
  setWidgetDialogOpen(settingsDialogBackdropEl, settingsLauncherEl, settingsDialogCloseEl, Boolean(settingsDialogBackdropEl?.hidden));
});
settingsDialogCloseEl?.addEventListener('click', () => {
  setWidgetDialogOpen(settingsDialogBackdropEl, settingsLauncherEl, settingsDialogCloseEl, false);
});
settingsDialogBackdropEl?.addEventListener('click', (event) => {
  if (event.target === settingsDialogBackdropEl) {
    setWidgetDialogOpen(settingsDialogBackdropEl, settingsLauncherEl, settingsDialogCloseEl, false);
  }
});

window.addEventListener('resize', () => {
  if (czesterPanelEl && !czesterPanelEl.hidden) {
    positionCzesterPanel();
  }
});

if (czesterCloseEl) {
  czesterCloseEl.addEventListener('click', () => setCzesterPanelOpen(false));
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && czesterPanelEl && !czesterPanelEl.hidden) {
    setCzesterPanelOpen(false);
  }
  if (event.key === 'Escape' && notesDialogBackdropEl && !notesDialogBackdropEl.hidden) {
    setNotesDialogOpen(false);
  }
  if (event.key === 'Escape' && achievementsDialogBackdropEl && !achievementsDialogBackdropEl.hidden) {
    setWidgetDialogOpen(achievementsDialogBackdropEl, achievementsLauncherEl, achievementsDialogCloseEl, false);
  }
  if (event.key === 'Escape' && settingsDialogBackdropEl && !settingsDialogBackdropEl.hidden) {
    setWidgetDialogOpen(settingsDialogBackdropEl, settingsLauncherEl, settingsDialogCloseEl, false);
  }
});

if (czesterAiInstallEl) {
  czesterAiInstallEl.addEventListener('click', installCzesterAiPack);
}

if (refreshArchiveButton) {
  refreshArchiveButton.addEventListener('click', refreshArchive);
}

if (creatorRefreshButton) {
  creatorRefreshButton.addEventListener('click', async () => {
    creatorRefreshButton.disabled = true;
    try {
      if (window.tiktokLive && typeof window.tiktokLive.refreshChat === 'function') {
        await window.tiktokLive.refreshChat();
      } else if (window.tiktokLive && typeof window.tiktokLive.reload === 'function') {
        await window.tiktokLive.reload();
      }
    } finally {
      creatorRefreshButton.disabled = false;
    }
  });
}

if (openArchiveFolderButton) {
  openArchiveFolderButton.addEventListener('click', openArchiveFolder);
}

if (archiveSearchEl) {
  archiveSearchEl.addEventListener('input', renderArchiveList);
}

if (notesSearchEl) {
  notesSearchEl.addEventListener('input', renderNotesList);
}

if (newNoteButton) {
  newNoteButton.addEventListener('click', () => {
    resetNoteEditor();
    if (noteTitleInput) {
      noteTitleInput.focus();
    }
  });
}

if (editNoteButton) {
  editNoteButton.addEventListener('click', () => {
    setNoteEditorMode('edit');
    if (noteContentInput) {
      noteContentInput.focus();
    }
  });
}

if (saveNoteButton) {
  saveNoteButton.addEventListener('click', saveCurrentNote);
}

if (deleteNoteButton) {
  deleteNoteButton.addEventListener('click', deleteCurrentNote);
}

noteFormatButtons.forEach((button) => {
  button.addEventListener('click', () => applyNoteMarkdownFormat(button.dataset.noteFormat || 'bold'));
});

if (noteContentInput) {
  noteContentInput.addEventListener('input', updateNotePreview);
}

archiveFilterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.archiveFilter;
    if (!filter) {
      return;
    }
    if (activeArchiveFilters.has(filter)) {
      activeArchiveFilters.delete(filter);
    } else {
      activeArchiveFilters.add(filter);
    }
    button.dataset.active = String(activeArchiveFilters.has(filter));
    saveEventFilters(ARCHIVE_FILTER_SETTINGS_KEY, activeArchiveFilters);
    renderArchiveMessages();
  });
});

if (exportArchiveButton) {
  exportArchiveButton.addEventListener('click', exportSelectedArchive);
}

if (deleteArchiveButton) {
  deleteArchiveButton.addEventListener('click', deleteSelectedArchive);
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setOpenRightWidget('');
  }
});

document.addEventListener('click', (event) => {
  const link = event.target.closest('[data-external-url]');
  if (!link) {
    return;
  }

  event.preventDefault();
  const url = link.dataset.externalUrl || link.getAttribute('href') || '';
  if (window.tiktokLive && typeof window.tiktokLive.openExternalUrl === 'function') {
    window.tiktokLive.openExternalUrl(url).catch(() => {});
  }
});

window.tiktokLive.onChatReset(() => {
  resetMessages();
  setChatFreezeEffect(false);
});

if (typeof window.tiktokLive.onRoomStats === 'function') {
  window.tiktokLive.onRoomStats((stats) => {
    const nextViewerCount = Math.max(0, Number(stats && stats.viewerCount) || 0);
    liveViewerCount = nextViewerCount;
    updateStatus();
    if (viewersCountLabelEl) viewersCountLabelEl.textContent = String(nextViewerCount);
    window.tiktokLive.getCurrentViewers?.().then((result) => {
      mergeViewerAvatars(result?.viewers || []);
    }).catch(() => {});
    if (viewersDialogBackdropEl && !viewersDialogBackdropEl.hidden) openCurrentViewers();
  });
}

window.tiktokLive.onBattleAlert((alert) => {
  handleCzesterBattleAlert(alert);
  const isMultiplierAlert = alert && (
    alert.textKey === 'battle.multiplier'
    || alert.tone === 'battle'
  );
  const isSpecialJoinAlert = alert && alert.tone === 'honda';
  if (alert && alert.tone === 'honda' && !isHondaAlertsUnlocked()) {
    return;
  }
  if ((isMultiplierAlert || !isSpecialJoinAlert) || !battleBanner) {
    return;
  }
  const text = alert && alert.textKey
    ? t(alert.textKey, {
      multiplier: alert.multiplier || ''
    })
    : (alert && alert.text ? alert.text : '');
  if (!text) {
    return;
  }

  clearTimeout(battleBannerTimer);
  battleBanner.dataset.tone = alert.tone || 'battle';
  battleBanner.textContent = alert.uppercase === false ? text : text.toUpperCase();
  battleBanner.hidden = false;
  battleBannerTimer = setTimeout(() => {
    battleBanner.hidden = true;
    battleBanner.textContent = '';
    delete battleBanner.dataset.tone;
  }, 12000);
});

window.tiktokLive.onChatMessage((message) => {
  if (!hasDisplayableMessageText(message)) {
    return;
  }

  if (isAnonymousBoxMessage(message)) {
    return;
  }

  if ((message.kind || 'chat') === 'box') {
    trackLiveBox(message);
  }

  if (message.czesterOnly) {
    notifyCzesterSuperFanJoin(message);
    return;
  }

  if (message.kind === 'member') {
    assignAvatarForJoin(message);
    notifyCzesterSuperFanJoin(message);
  }

  recordCzesterLiveAnalysisMessage(message);
  trackIncomingMessageStats(message);
  inspectCzesterSpam(message);
  const messageIdKey = getMessageIdKey(message);

  if (message.upsert && messageIdKey) {
    const existingVisible = visibleMessagesById.get(messageIdKey);
    if (existingVisible) {
      Object.assign(existingVisible, message);
      upsertRenderedMessage(existingVisible);
      return;
    }

    const existingQueued = queuedMessagesById.get(messageIdKey);
    if (existingQueued) {
      Object.assign(existingQueued, message);
      updateStatus();
      return;
    }
  }

  if ((message.kind || 'chat') === 'chat') {
    const safeDelay = CHAT_DELAY_OPTIONS.includes(Number(chatDelayMs)) ? Number(chatDelayMs) : DEFAULT_CHAT_DELAY_MS;
    queuedMessageRevealAt.set(message, Date.now() + safeDelay);
    queue.push(message);
    if (messageIdKey) {
      queuedMessagesById.set(messageIdKey, message);
    }
    scheduleRevealFallback();
    updateStatus();
    return;
  }

  showMessageNow(message, true);
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'F5' || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'r')) {
    event.preventDefault();
    window.tiktokLive.reload();
  }

  if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'l') {
    event.preventDefault();
    window.tiktokLive.showLogin();
  }

  if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'i') {
    event.preventDefault();
    window.tiktokLive.openDevTools('shell');
  }
});

hydrateUiIcons();
initAppearanceSettings();
if (appAppearance === 'retro-kb2') {
  unlockAchievement('retro-kb2');
}
initGeneralSettings();
initRedeemCodeSettings();
initSystemSettings();
applyI18n();
initFirstRunLanguageChoice();
initTextToSpeech();
startRevealTimer();
setInterval(updateStatus, 5000);
setInterval(updateTaskbarClock, 1000);
setInterval(checkHondaOnlinePresence, HONDA_ONLINE_CHECK_INTERVAL_MS);
setActiveSettingsTab(activeSettingsTab);
setActiveAboutTab(activeAboutTab);
setActiveSection(activeSection);
syncAppVersion();
updateStatus();
maybeShowCzesterOllamaPrompt();
