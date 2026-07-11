const fs = require('node:fs');
const path = require('node:path');
const { execFile, spawn } = require('node:child_process');
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
const CZESTER_MEMORY_FILE = path.join(app.getPath('userData'), 'czester-memory.json');
const CZESTER_STYLE_FILE = path.join(app.getPath('userData'), 'czester-style.json');
const UPDATE_COMPLETED_FILE = path.join(app.getPath('userData'), 'update-completed.json');
const TRANSMISSION_ARCHIVE_PREFIX = 'transmisja-';
const AVATAR_DIR = path.join(__dirname, 'pic');
const APP_ICON_PATH = path.join(__dirname, 'assets', 'app-icon.ico');
const AVATAR_EXTENSIONS = new Set(['.gif', '.jpg', '.jpeg', '.png', '.webp']);
const HONDA_UNIQUE_ID = 'grzegorzpawemisiu';
const HONDA_JOIN_TEXT = 'Honda wjechała na rejony.';
const APP_VERSION = app.getVersion();
const UPDATE_CHECK_INTERVAL_MS = 30 * 60 * 1000;
const CZESTER_SUPPORT_URL = 'https://www.tiktok.com/support';
const CZESTER_SUPPORT_CACHE_TTL_MS = 5 * 60 * 1000;
const CZESTER_ARCHIVE_PROFILE_TTL_MS = 10 * 60 * 1000;
const CZESTER_MEMORY_LIMIT = 200;
const CZESTER_STYLE_LIVE_LIMIT = 220;
const CZESTER_STYLE_EXAMPLE_LIMIT = 80;
const CZESTER_STYLE_MAX_TEXT_LENGTH = 180;
const CZESTER_STYLE_REBUILD_TTL_MS = 2 * 60 * 1000;
const CZESTER_WEATHER_GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const CZESTER_WEATHER_FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const CZESTER_WEB_SEARCH_URL = 'https://duckduckgo.com/html/';
const CZESTER_WEB_SEARCH_LIMIT = 5;
const CZESTER_OLLAMA_URL = 'http://127.0.0.1:11434';
const CZESTER_OLLAMA_TIMEOUT_MS = 20000;
const CZESTER_OLLAMA_MODEL_CACHE_MS = 60 * 1000;
const CZESTER_OLLAMA_WINDOWS_INSTALLER_URL = 'https://ollama.com/download/OllamaSetup.exe';
const CZESTER_LOCAL_AI_MODEL = 'qwen2.5:3b';
const CZESTER_OLLAMA_PREFERRED_MODELS = [
  CZESTER_LOCAL_AI_MODEL,
  'qwen2.5:7b',
  'qwen2.5',
  'mistral',
  'gemma2:2b',
  'gemma2',
  'llama3.2:3b',
  'llama3.2'
];
const CZESTER_WIKIPEDIA_LANGUAGES = {
  pl: 'pl',
  en: 'en',
  de: 'de'
};
const CZESTER_WEATHER_LOCATION_ALIASES = {
  warszawie: 'Warszawa',
  warszawa: 'Warszawa',
  krakowie: 'Kraków',
  krakow: 'Kraków',
  kraków: 'Kraków',
  poznaniu: 'Poznań',
  poznan: 'Poznań',
  poznań: 'Poznań',
  wroclawiu: 'Wrocław',
  wrocławiu: 'Wrocław',
  wroclaw: 'Wrocław',
  wrocław: 'Wrocław',
  gdansku: 'Gdańsk',
  gdańsku: 'Gdańsk',
  gdansk: 'Gdańsk',
  gdańsk: 'Gdańsk',
  lodzi: 'Łódź',
  łodzi: 'Łódź',
  lodz: 'Łódź',
  łódź: 'Łódź',
  berlin: 'Berlin',
  berlinie: 'Berlin',
  berlina: 'Berlin',
  moskwa: 'Moscow',
  moskwie: 'Moscow',
  moskwe: 'Moscow',
  moskwę: 'Moscow',
  moscow: 'Moscow',
  londyn: 'London',
  londynie: 'London',
  london: 'London',
  paryz: 'Paris',
  paryż: 'Paris',
  paryzu: 'Paris',
  paryżu: 'Paris',
  paris: 'Paris',
  rzym: 'Rome',
  rzymie: 'Rome',
  rome: 'Rome',
  praga: 'Prague',
  pradze: 'Prague',
  prague: 'Prague',
  kijow: 'Kyiv',
  kijów: 'Kyiv',
  kijowie: 'Kyiv',
  kyiv: 'Kyiv',
  kiev: 'Kyiv',
  'nowy jork': 'New York',
  'nowym jorku': 'New York',
  'new york': 'New York'
};
const CZESTER_LANGUAGE_META = {
  pl: {
    locale: 'pl-PL,pl;q=0.9,en;q=0.7',
    fallbackTitle: 'TikTok Support',
    intro: 'Dobra, to brzmi jak temat:',
    fallbackAnswer: 'Okej, łapię temat, ale potrzebuję jednego konkretu więcej. Napisz mi, co dokładnie się wydarzyło i na czym utknąłeś, a spróbuję to rozebrać na prostsze kroki.',
    noMessage: 'Napisz pytanie, a Czester spróbuje je sprawdzić i odpowiedzieć konkretnie.',
    greeting: 'Dzień dobry! Jestem Czester. Możesz pisać normalnie, bez urzędowego języka. Jak czegoś nie zrozumiem, dopytam.',
    howAreYou: 'Działam i uczę się twojego stylu rozmowy. Nie jestem jeszcze geniuszem, ale przynajmniej nie udaję, że zjadłem wszystkie rozumy.',
    thanks: 'Nie ma sprawy. Jak chcesz, opisz kolejny problem, a spróbuję go rozgryźć.',
    weatherPrefix: 'Sprawdziłem na szybko.',
    weatherUnavailable: 'Chciałem sprawdzić pogodę, ale teraz nie dostałem danych. Spróbuj za chwilę albo dopisz dokładniej miasto.'
  },
  en: {
    locale: 'en-US,en;q=0.9',
    fallbackTitle: 'TikTok Support',
    intro: 'Okay, this sounds like:',
    fallbackAnswer: 'Okay, I get the general direction, but I need one more concrete detail. Tell me what happened and where you got stuck, and I will break it down into simpler steps.',
    noMessage: 'Ask a question and Czester will try to check it and answer clearly.',
    greeting: 'Good day! I am Czester. You can write normally, no official wording needed. If I miss something, I will ask.',
    howAreYou: 'I am running and learning your style. I am not a genius yet, but at least I will not pretend I know everything.',
    thanks: 'No problem. Describe the next issue and I will try to figure it out.',
    weatherPrefix: 'I checked it quickly.',
    weatherUnavailable: 'I tried to check the weather, but I did not get data right now. Try again in a moment or give me the city more precisely.'
  },
  de: {
    locale: 'de-DE,de;q=0.9,en;q=0.7',
    fallbackTitle: 'TikTok Support',
    intro: 'Okay, das klingt nach:',
    fallbackAnswer: 'Okay, die Richtung verstehe ich, aber mir fehlt noch ein konkretes Detail. Schreib, was genau passiert ist und wo du festhängst, dann zerlege ich es in einfache Schritte.',
    noMessage: 'Stelle eine Frage und Czester versucht sie zu prüfen und klar zu beantworten.',
    greeting: 'Guten Tag! Ich bin Czester. Du kannst ganz normal schreiben, ohne Behördenstil. Wenn ich etwas nicht verstehe, frage ich nach.',
    howAreYou: 'Ich laufe und lerne deinen Gesprächsstil. Ich bin noch kein Genie, aber ich tue wenigstens nicht so, als wüsste ich alles.',
    thanks: 'Kein Problem. Beschreibe das nächste Thema und ich versuche es einzuordnen.',
    weatherPrefix: 'Ich habe es kurz geprüft.',
    weatherUnavailable: 'Ich wollte das Wetter prüfen, habe aber gerade keine Daten bekommen. Versuch es gleich nochmal oder nenne die Stadt genauer.'
  }
};
const CZESTER_SUPPORT_TOPICS = [
  {
    id: 'account-login',
    keywords: ['logowanie', 'zalogowac', 'login', 'haslo', 'password', 'konto', 'account', 'odzyskiwanie', 'recovery', 'wlamanie', 'hacked', 'gehackt', 'anmelden', 'passwort', 'konto'],
    title: {
      pl: 'Logowanie, odzyskiwanie konta i podejrzenie włamania',
      en: 'Login, account recovery and suspected hacking',
      de: 'Anmeldung, Kontowiederherstellung und Verdacht auf Hack'
    },
    steps: {
      pl: ['Sprawdź numer telefonu, e-mail i metody logowania przypięte do konta.', 'Jeżeli konto wygląda na przejęte, zmień hasło i wyloguj inne urządzenia.', 'Jeśli nie odzyskasz dostępu, przygotuj dane konta i zgłoszenie odzyskania przez formularz pomocy.'],
      en: ['Check the phone number, email and login methods attached to the account.', 'If the account looks compromised, change the password and log out other devices.', 'If you cannot regain access, prepare account details and submit an account recovery request.'],
      de: ['Prüfe Telefonnummer, E-Mail und Anmeldemethoden des Kontos.', 'Wenn das Konto kompromittiert wirkt, ändere das Passwort und melde andere Geräte ab.', 'Wenn du keinen Zugriff bekommst, bereite Kontodaten vor und sende eine Anfrage zur Wiederherstellung.']
    }
  },
  {
    id: 'live',
    keywords: ['live', 'transmisja', 'stream', 'czat', 'chat', 'moderator', 'mute', 'wyciszenie', 'ban', 'banowanie', 'gesperrt', 'stumm', 'livestream'],
    title: {
      pl: 'LIVE, czat i moderacja transmisji',
      en: 'LIVE, chat and stream moderation',
      de: 'LIVE, Chat und Stream-Moderation'
    },
    steps: {
      pl: ['Sprawdź, czy problem dotyczy transmisji, czatu, moderatora czy uprawnień konta.', 'Przy blokadzie funkcji LIVE sprawdź powiadomienia systemowe TikToka i status konta.', 'Jeśli funkcja LIVE jest ograniczona, sprawdź powód ograniczenia i złóż odwołanie, jeśli TikTok daje taką opcję.'],
      en: ['Check whether the problem is about the stream, chat, moderator tools or account permissions.', 'For LIVE feature restrictions, check TikTok system notifications and account status.', 'If LIVE is restricted, check the reason and appeal if TikTok offers that option.'],
      de: ['Prüfe, ob es um Stream, Chat, Moderation oder Kontoberechtigungen geht.', 'Bei Einschränkungen der LIVE-Funktion prüfe TikTok-Systemmeldungen und Kontostatus.', 'Wenn LIVE eingeschränkt ist, prüfe den Grund und lege Einspruch ein, wenn TikTok diese Option anbietet.']
    }
  },
  {
    id: 'gifts-coins',
    keywords: ['prezent', 'prezenty', 'gift', 'gifts', 'coins', 'monety', 'monet', 'monetek', 'doładowanie', 'doladowanie', 'doładowałem', 'doladowalem', 'doładowałam', 'doladowalam', 'top up', 'recharge', 'diamenty', 'diamonds', 'refund', 'zwrot', 'payment', 'platnosc', 'płatność', 'zahlung', 'geschenke', 'münzen', 'munzen'],
    title: {
      pl: 'Prezenty, monety, płatności i zwroty',
      en: 'Gifts, coins, payments and refunds',
      de: 'Geschenke, Münzen, Zahlungen und Rückerstattungen'
    },
    steps: {
      pl: ['Zbierz datę transakcji, kwotę, metodę płatności i zrzut ekranu problemu.', 'Sprawdź historię płatności w TikToku i sklepie aplikacji.', 'Jeśli pieniądze lub monety nie wróciły, zgłoś transakcję z datą, kwotą i potwierdzeniem płatności.'],
      en: ['Collect the transaction date, amount, payment method and a screenshot of the issue.', 'Check payment history in TikTok and in the app store.', 'If money or coins did not return, report the transaction with date, amount and payment confirmation.'],
      de: ['Sammle Transaktionsdatum, Betrag, Zahlungsmethode und Screenshot des Problems.', 'Prüfe den Zahlungsverlauf in TikTok und im App-Store.', 'Wähle im TikTok Support Münzen, Geschenke, Zahlungen oder Rückerstattungen.']
    }
  },
  {
    id: 'ban-appeal',
    keywords: ['ban', 'blokada', 'zablokowane', 'odwolanie', 'odwołanie', 'appeal', 'shadowban', 'restriction', 'naruszenie', 'violation', 'sperre', 'einspruch', 'verstoß', 'verstoss'],
    title: {
      pl: 'Blokady, ograniczenia i odwołania',
      en: 'Bans, restrictions and appeals',
      de: 'Sperren, Einschränkungen und Einsprüche'
    },
    steps: {
      pl: ['Sprawdź komunikat TikToka z powodem ograniczenia.', 'Jeżeli jest dostępny przycisk odwołania, użyj go w aplikacji TikTok.', 'Jeśli uważasz, że blokada jest błędna, złóż odwołanie z krótkim opisem i bez emocjonalnego lania wody.'],
      en: ['Check TikTok’s notice explaining the restriction.', 'If an appeal button is available, use it inside the TikTok app.', 'If you think the restriction is wrong, appeal with a short factual explanation.'],
      de: ['Prüfe die TikTok-Meldung mit dem Grund der Einschränkung.', 'Wenn ein Einspruch-Button verfügbar ist, nutze ihn in der TikTok-App.', 'Wenn du die Sperre für falsch hältst, lege mit einer kurzen sachlichen Erklärung Einspruch ein.']
    }
  },
  {
    id: 'privacy-safety',
    keywords: ['privacy', 'prywatnosc', 'prywatność', 'bezpieczenstwo', 'bezpieczeństwo', 'report', 'zglos', 'zgłoś', 'harassment', 'nękanie', 'nekanie', 'safety', 'datenschutz', 'sicherheit', 'melden'],
    title: {
      pl: 'Prywatność, bezpieczeństwo i zgłaszanie naruszeń',
      en: 'Privacy, safety and reporting violations',
      de: 'Datenschutz, Sicherheit und Meldung von Verstößen'
    },
    steps: {
      pl: ['Zabezpiecz dowody: link, nick, datę i zrzuty ekranu.', 'Użyj zgłoszenia w aplikacji TikTok dla profilu, filmu, LIVE lub komentarza.', 'Jeśli sprawa dotyczy naruszenia, zgłoś konkretny profil, komentarz, LIVE lub film z dowodami.'],
      en: ['Keep evidence: link, username, date and screenshots.', 'Use the report option in TikTok for the profile, video, LIVE or comment.', 'If this is about a violation, report the exact profile, comment, LIVE or video with evidence.'],
      de: ['Sichere Beweise: Link, Nutzername, Datum und Screenshots.', 'Nutze in TikTok die Meldefunktion für Profil, Video, LIVE oder Kommentar.', 'Wenn es um einen Verstoß geht, melde das konkrete Profil, den Kommentar, LIVE oder das Video mit Belegen.']
    }
  },
  {
    id: 'copyright',
    keywords: ['copyright', 'prawa autorskie', 'muzyka', 'music', 'sound', 'dzwiek', 'dźwięk', 'trademark', 'znak towarowy', 'urheberrecht', 'musik', 'ton'],
    title: {
      pl: 'Prawa autorskie, muzyka i dźwięki',
      en: 'Copyright, music and sounds',
      de: 'Urheberrecht, Musik und Sounds'
    },
    steps: {
      pl: ['Sprawdź, czy problem dotyczy usunięcia treści, dźwięku czy roszczenia.', 'Przygotuj link do materiału i informację, do czego masz prawa.', 'Jeśli masz prawa do materiału, przygotuj link, opis praw i krótko wyjaśnij, dlaczego decyzja jest błędna.'],
      en: ['Check whether the issue concerns removed content, sound or a claim.', 'Prepare the content link and information about your rights.', 'If you own the rights, prepare the link, rights details and a short explanation why the decision is wrong.'],
      de: ['Prüfe, ob es um entfernte Inhalte, Sound oder eine Beschwerde geht.', 'Bereite den Link zum Inhalt und Informationen zu deinen Rechten vor.', 'Wenn du die Rechte besitzt, bereite Link, Rechteangaben und eine kurze Begründung vor.']
    }
  },
  {
    id: 'technical',
    keywords: ['bug', 'blad', 'błąd', 'problem techniczny', 'crash', 'nie dziala', 'nie działa', 'lag', 'cache', 'update', 'aktualizacja', 'fehler', 'absturz', 'funktioniert nicht'],
    title: {
      pl: 'Błędy techniczne aplikacji TikTok',
      en: 'TikTok app technical issues',
      de: 'Technische Probleme der TikTok-App'
    },
    steps: {
      pl: ['Sprawdź aktualizację TikToka i połączenie internetowe.', 'Wyczyść pamięć podręczną aplikacji albo uruchom ponownie telefon.', 'Jeśli dalej nie działa, opisz model telefonu, wersję aplikacji i dokładnie kiedy problem występuje.'],
      en: ['Check TikTok updates and your internet connection.', 'Clear the app cache or restart the phone.', 'If it still fails, note the phone model, app version and exactly when the issue happens.'],
      de: ['Prüfe TikTok-Updates und deine Internetverbindung.', 'Leere den App-Cache oder starte das Telefon neu.', 'Wenn es weiter nicht funktioniert, notiere Telefonmodell, App-Version und wann der Fehler auftritt.']
    }
  }
];
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
let loginViewParked = false;
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
let battleScorebarAwaitingNextStart = false;
let lastBattleAlertKey = '';
let lastBattleAlertAt = 0;
let lastBattleScoreAlertKey = '';
let lastBattleScoreAlertAt = 0;
let lastBattleTaskProgressAlertKey = '';
let lastBattleTaskProgressAlertAt = 0;
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
let czesterSupportCache = null;
let czesterArchiveProfileCache = null;
let czesterOllamaModelCache = null;
let czesterStyleCache = null;

const recentMessages = [];
const czesterLiveStyleMessages = [];
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
  update: { status: 'idle', version: '', message: '' },
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
    summary: summarizeArchiveMessages(recentMessages),
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
  czesterLiveStyleMessages.length = 0;
  czesterStyleCache = null;
  seenMessageKeys.clear();
  likeTotalsByUser.clear();
  latestRoomStats = { viewerCount: 0 };
  liveUserDirectory.clear();
  superFanUsers.clear();
  currentCreatorLiveUserId = '';
  currentCreatorLiveAliases.clear();
  battleActive = false;
  battleScorebarAwaitingNextStart = false;
  resetBattleState({ publish: false });
  sendBattleEventAlert('reset', { sides: [] });
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
    'boxEnvelopeId',
    'boxCoinCount',
    'boxPeopleCount',
    'boxSource',
    'boxGiftName',
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
    rememberCzesterLiveStyleMessage(payload);
    scheduleArchiveWrite();
    sendToShell('shell:chat-message', payload);
    return;
  }

  recentMessages.push(payload);
  rememberCzesterLiveStyleMessage(payload);
  scheduleArchiveWrite();
  sendToShell('shell:chat-message', payload);
}

function sendCzesterOnlySuperFanJoin(data) {
  const user = getEventUser(data);
  const name = normalizeMessageText(user.nickname || user.uniqueId);
  if (!name) {
    return;
  }
  sendToShell('shell:chat-message', {
    id: getMessageId(data) ? String(getMessageId(data)) : `superfan:${normalizeUniqueId(user.uniqueId || name)}:${Date.now()}`,
    timestamp: new Date().toISOString(),
    text: `Dołącza superfan ${name}.`,
    archiveText: '',
    kind: 'member',
    authorName: name,
    uniqueId: normalizeMessageText(user.uniqueId),
    isModerator: false,
    isSuperFan: true,
    czesterOnly: true
  });
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
    backgroundThrottling: true,
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

function createDefaultCzesterMemory() {
  return {
    version: 1,
    updatedAt: '',
    conversations: [],
    searches: [],
    topicCounts: {},
    archiveProfile: null,
    styleProfile: null
  };
}

function loadCzesterMemory() {
  try {
    if (!fs.existsSync(CZESTER_MEMORY_FILE)) {
      return createDefaultCzesterMemory();
    }
    const parsed = JSON.parse(fs.readFileSync(CZESTER_MEMORY_FILE, 'utf8'));
    return {
      ...createDefaultCzesterMemory(),
      ...(parsed && typeof parsed === 'object' ? parsed : {}),
      conversations: Array.isArray(parsed && parsed.conversations) ? parsed.conversations.slice(-CZESTER_MEMORY_LIMIT) : [],
      searches: Array.isArray(parsed && parsed.searches) ? parsed.searches.slice(-CZESTER_MEMORY_LIMIT) : [],
      topicCounts: parsed && parsed.topicCounts && typeof parsed.topicCounts === 'object' ? parsed.topicCounts : {},
      archiveProfile: parsed && parsed.archiveProfile && typeof parsed.archiveProfile === 'object' ? parsed.archiveProfile : null,
      styleProfile: parsed && parsed.styleProfile && typeof parsed.styleProfile === 'object' ? parsed.styleProfile : null
    };
  } catch {
    return createDefaultCzesterMemory();
  }
}

function saveCzesterMemory(memory) {
  try {
    const document = {
      ...createDefaultCzesterMemory(),
      ...(memory || {}),
      updatedAt: new Date().toISOString(),
      conversations: Array.isArray(memory && memory.conversations) ? memory.conversations.slice(-CZESTER_MEMORY_LIMIT) : [],
      searches: Array.isArray(memory && memory.searches) ? memory.searches.slice(-CZESTER_MEMORY_LIMIT) : [],
      styleProfile: memory && memory.styleProfile && typeof memory.styleProfile === 'object' ? memory.styleProfile : null
    };
    fs.writeFileSync(CZESTER_MEMORY_FILE, `${JSON.stringify(document, null, 2)}\n`, 'utf8');
    return document;
  } catch {
    return memory || createDefaultCzesterMemory();
  }
}

function getCzesterArchiveMessages() {
  try {
    return listArchiveEntries()
      .slice(0, 8)
      .flatMap((entry) => {
        const fullPath = path.join(ARCHIVE_DIR, entry.id);
        try {
          if (entry.format === 'structured') {
            return readStructuredArchive(fullPath).messages || [];
          }
          return parseLegacyArchive(fullPath, entry).messages || [];
        } catch {
          return [];
        }
      })
      .filter((message) => message && message.kind === 'chat' && String(message.text || message.archiveText || '').trim())
      .slice(-600);
  } catch {
    return [];
  }
}

function getCzesterArchiveSignature(entries) {
  return (entries || [])
    .map((entry) => `${entry.id}:${entry.modifiedAt || entry.mtimeMs || ''}:${entry.endedAt || ''}`)
    .join('|');
}

function cleanCzesterStyleMessageText(value) {
  return normalizeMessageText(value)
    .replace(/^.+?\(@[^)]+\):\s*/, '')
    .replace(/^[^:]{1,80}:\s*/, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, CZESTER_STYLE_MAX_TEXT_LENGTH);
}

function isUsefulCzesterStyleText(value) {
  const text = cleanCzesterStyleMessageText(value);
  if (text.length < 2 || text.length > CZESTER_STYLE_MAX_TEXT_LENGTH) {
    return false;
  }
  const normalized = normalizeCzesterQuery(text);
  if (!normalized || /^\d+$/.test(normalized)) {
    return false;
  }
  if (/\b(polubil|polubiła|polubilam|wyslal|wysłał|prezent|dolaczyl|dołączył|udostepnia|udostępnia|repost|skrzyn|like|gift|joined)\b/.test(normalized)) {
    return false;
  }
  return true;
}

function rememberCzesterLiveStyleMessage(message) {
  if (!message || message.kind !== 'chat') {
    return;
  }
  const text = cleanCzesterStyleMessageText(message.text || message.archiveText);
  if (!isUsefulCzesterStyleText(text)) {
    return;
  }
  czesterLiveStyleMessages.push({
    at: message.timestamp || message.time || new Date().toISOString(),
    authorName: normalizeMessageText(message.authorName),
    uniqueId: normalizeMessageText(message.uniqueId),
    text
  });
  while (czesterLiveStyleMessages.length > CZESTER_STYLE_LIVE_LIMIT) {
    czesterLiveStyleMessages.shift();
  }
  czesterStyleCache = null;
}

function createEmptyCzesterStyleProfile(signature = '') {
  return {
    version: 1,
    rebuiltAt: new Date().toISOString(),
    signature,
    archives: 0,
    messages: 0,
    averageLength: 0,
    casual: false,
    direct: true,
    emojiHeavy: false,
    greetingHeavy: false,
    exclamationHeavy: false,
    slang: [],
    commonWords: [],
    examples: [],
    liveExamples: []
  };
}

function buildCzesterStyleProfileFromTexts(texts, signature, archiveCount) {
  const cleanedTexts = texts
    .map(cleanCzesterStyleMessageText)
    .filter(isUsefulCzesterStyleText);
  const joined = cleanedTexts.join(' ');
  const normalizedJoined = normalizeCzesterQuery(joined);
  const emojiCount = (joined.match(/[\u{1f300}-\u{1faff}]/gu) || []).length;
  const exclamationCount = (joined.match(/!/g) || []).length;
  const questionCount = (joined.match(/\?/g) || []).length;
  const greetingCount = (normalizedJoined.match(/\b(hej|siema|czesc|cześć|elo|dobry|witam|hello|hi)\b/g) || []).length;
  const slangMatches = normalizedJoined.match(/\b(xd|essa|git|spoko|dobra|typie|ziom|kurde|lol|rel|sztos|kox|mega|nwm|imo)\b/g) || [];
  const averageLength = cleanedTexts.length
    ? Math.round(cleanedTexts.reduce((sum, text) => sum + text.length, 0) / cleanedTexts.length)
    : 0;
  const stopWords = new Set([
    'jest', 'jestem', 'jesteś', 'juz', 'już', 'sie', 'się', 'nie', 'tak', 'jak', 'dla', 'czy', 'ale', 'ten', 'tam', 'mam', 'masz',
    'the', 'and', 'you', 'are', 'was', 'were', 'ich', 'und', 'die', 'der', 'das', 'ist', 'nicht'
  ]);
  const wordCounts = new Map();
  normalizedJoined
    .split(/\s+/)
    .filter((word) => word.length >= 3 && !stopWords.has(word))
    .forEach((word) => wordCounts.set(word, (wordCounts.get(word) || 0) + 1));
  const uniqueExamples = [];
  const seenExamples = new Set();
  cleanedTexts.forEach((text) => {
    const key = normalizeCzesterQuery(text).slice(0, 80);
    if (!seenExamples.has(key) && text.length <= 120) {
      seenExamples.add(key);
      uniqueExamples.push(text);
    }
  });

  return {
    version: 1,
    rebuiltAt: new Date().toISOString(),
    signature,
    archives: archiveCount,
    messages: cleanedTexts.length,
    averageLength,
    casual: slangMatches.length + emojiCount + exclamationCount > Math.max(10, cleanedTexts.length * 0.05),
    direct: averageLength > 0 && averageLength <= 75,
    emojiHeavy: emojiCount > Math.max(8, cleanedTexts.length * 0.03),
    greetingHeavy: greetingCount > Math.max(8, cleanedTexts.length * 0.04),
    exclamationHeavy: exclamationCount > Math.max(10, questionCount),
    slang: Array.from(new Set(slangMatches)).slice(0, 18),
    commonWords: Array.from(wordCounts.entries())
      .sort((left, right) => right[1] - left[1])
      .slice(0, 24)
      .map(([word]) => word),
    examples: uniqueExamples.slice(-CZESTER_STYLE_EXAMPLE_LIMIT),
    liveExamples: czesterLiveStyleMessages.slice(-30).map((item) => item.text).filter(Boolean)
  };
}

function readStoredCzesterStyleProfile() {
  try {
    if (!fs.existsSync(CZESTER_STYLE_FILE)) {
      return null;
    }
    const parsed = JSON.parse(fs.readFileSync(CZESTER_STYLE_FILE, 'utf8'));
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function writeStoredCzesterStyleProfile(profile) {
  try {
    fs.writeFileSync(CZESTER_STYLE_FILE, `${JSON.stringify(profile, null, 2)}\n`, 'utf8');
  } catch {}
  return profile;
}

function getCzesterStyleProfile() {
  const now = Date.now();
  if (czesterStyleCache && now - czesterStyleCache.fetchedAt < CZESTER_STYLE_REBUILD_TTL_MS) {
    return {
      ...czesterStyleCache.profile,
      liveExamples: czesterLiveStyleMessages.slice(-30).map((item) => item.text).filter(Boolean)
    };
  }

  let entries = [];
  try {
    entries = listArchiveEntries();
  } catch {
    entries = [];
  }
  const signature = getCzesterArchiveSignature(entries);
  const stored = readStoredCzesterStyleProfile();
  if (stored && stored.signature === signature) {
    const profile = {
      ...createEmptyCzesterStyleProfile(signature),
      ...stored,
      liveExamples: czesterLiveStyleMessages.slice(-30).map((item) => item.text).filter(Boolean)
    };
    czesterStyleCache = { fetchedAt: now, profile };
    return profile;
  }

  const texts = [];
  entries.forEach((entry) => {
    const fullPath = path.join(ARCHIVE_DIR, entry.id);
    try {
      const messages = entry.format === 'structured'
        ? readStructuredArchive(fullPath).messages || []
        : parseLegacyArchive(fullPath, entry).messages || [];
      messages.forEach((message) => {
        if (message && message.kind === 'chat') {
          const text = message.text || message.archiveText || '';
          if (text) {
            texts.push(text);
          }
        }
      });
    } catch {}
  });

  const profile = buildCzesterStyleProfileFromTexts(texts, signature, entries.length);
  writeStoredCzesterStyleProfile(profile);
  czesterStyleCache = { fetchedAt: now, profile };
  return profile;
}

function analyzeCzesterArchiveProfile() {
  const now = Date.now();
  if (czesterArchiveProfileCache && now - czesterArchiveProfileCache.fetchedAt < CZESTER_ARCHIVE_PROFILE_TTL_MS) {
    return czesterArchiveProfileCache.profile;
  }

  const styleProfile = getCzesterStyleProfile();
  if (styleProfile && Number(styleProfile.messages) > 0) {
    const profile = {
      analyzedAt: new Date().toISOString(),
      sampleSize: Number(styleProfile.messages) || 0,
      averageLength: Number(styleProfile.averageLength) || 0,
      casual: Boolean(styleProfile.casual),
      direct: Boolean(styleProfile.direct),
      greetingHeavy: Boolean(styleProfile.greetingHeavy)
    };
    czesterArchiveProfileCache = { fetchedAt: now, profile };
    return profile;
  }

  const messages = getCzesterArchiveMessages();
  const texts = messages.map((message) => String(message.text || message.archiveText || '').trim()).filter(Boolean);
  const joined = texts.join(' ').toLowerCase();
  const greetingCount = (joined.match(/\b(hej|siema|cześć|czesc|dzień dobry|dobry|elo|hello|hi)\b/g) || []).length;
  const emojiCount = (joined.match(/[\u{1f300}-\u{1faff}]/gu) || []).length;
  const exclamationCount = (joined.match(/!/g) || []).length;
  const slangCount = (joined.match(/\b(kurde|xd|xD|git|spoko|dobra|typie|ziom|essa|lol)\b/gi) || []).length;
  const averageLength = texts.length
    ? Math.round(texts.reduce((sum, text) => sum + text.length, 0) / texts.length)
    : 0;

  const profile = {
    analyzedAt: new Date().toISOString(),
    sampleSize: texts.length,
    averageLength,
    casual: slangCount + emojiCount + exclamationCount > Math.max(3, texts.length * 0.08),
    direct: averageLength > 0 && averageLength < 55,
    greetingHeavy: greetingCount > Math.max(2, texts.length * 0.04)
  };
  czesterArchiveProfileCache = { fetchedAt: now, profile };
  return profile;
}

function rememberCzesterExchange({ message, answer, language, topic, supportReachable, archiveProfile, styleProfile }) {
  const memory = loadCzesterMemory();
  const now = new Date().toISOString();
  const topicId = topic ? topic.id : 'unknown';
  memory.topicCounts[topicId] = (Number(memory.topicCounts[topicId]) || 0) + 1;
  memory.searches.push({
    at: now,
    language,
    query: message,
    topicId,
    supportReachable: Boolean(supportReachable)
  });
  memory.conversations.push({
    at: now,
    language,
    user: message,
    bot: answer,
    topicId
  });
  memory.archiveProfile = archiveProfile || memory.archiveProfile || null;
  memory.styleProfile = styleProfile || memory.styleProfile || null;
  return saveCzesterMemory(memory);
}

function normalizeCzesterLanguage(language) {
  return Object.prototype.hasOwnProperty.call(CZESTER_LANGUAGE_META, language)
    ? language
    : DEFAULT_SYSTEM_SETTINGS.language;
}

function normalizeCzesterQuery(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9ąćęłńóśźżäöüß\s-]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getCzesterAppKnowledgeText(language) {
  const normalizedLanguage = normalizeCzesterLanguage(language);
  if (normalizedLanguage === 'en') {
    return [
      'Czatbox TT is an app for reading TikTok LIVE chat in a separate window.',
      'Main areas: Chatbox, Archive, Notes, Achievements, Settings and About.',
      'Chatbox shows live messages and events with filters for chat, likes, gifts, boxes, reposts, shares and joins.',
      'The creator field changes or refreshes the current LIVE connection.',
      'Recent creators are shown at the top as avatars and are reordered by local usage history.',
      'Archive stores live sessions and supports filtering, refresh, delete and TXT export.',
      'Notes are local notes with simple formatting.',
      'Achievements are a surprise mechanic. Czester may talk only about achievements already visible/unlocked in the app and must never reveal locked achievements or how to unlock them.',
      'Settings control language, appearance, chat style, TTS, avatars and delay. Activation codes are secret and Czester must never reveal or guess them.',
      'Czester monitors repeated live chat messages and can warn about possible spam.'
    ].join('\n');
  }
  if (normalizedLanguage === 'de') {
    return [
      'Czatbox TT ist eine App zum Lesen von TikTok-LIVE-Chat in einem separaten Fenster.',
      'Hauptbereiche: Chatbox, Archiv, Notizen, Erfolge, Einstellungen und Über das Programm.',
      'Chatbox zeigt Live-Nachrichten und Ereignisse mit Filtern für Chat, Likes, Geschenke, Boxen, Reposts, Teilen und Beitritte.',
      'Das Creator-Feld wechselt oder aktualisiert die aktuelle LIVE-Verbindung.',
      'Letzte Creator werden oben als Avatare angezeigt und nach lokaler Nutzung sortiert.',
      'Das Archiv speichert Live-Sitzungen und bietet Filter, Aktualisieren, Löschen und TXT-Export.',
      'Notizen sind lokale Notizen mit einfacher Formatierung.',
      'Erfolge sind eine Überraschungsmechanik. Czester darf nur über bereits sichtbare/freigeschaltete Erfolge sprechen und niemals gesperrte Erfolge oder deren Freischaltung verraten.',
      'Einstellungen steuern Sprache, Aussehen, Chat-Stil, TTS, Avatare und Verzögerung. Aktivierungscodes sind geheim und Czester darf sie niemals verraten oder erraten.',
      'Czester überwacht wiederholte Live-Chat-Nachrichten und kann vor möglichem Spam warnen.'
    ].join('\n');
  }
  return [
    'Czatbox TT to aplikacja do odczytu czatu TikTok LIVE w osobnym oknie.',
    'Główne miejsca w programie: Czatbox, Archiwum, Notatki, Osiągnięcia, Ustawienia i O programie.',
    'Czatbox pokazuje wiadomości live i zdarzenia z filtrami: czat, polubienia, prezenty, skrzyneczki, reposty, udostępnienia i dołączenia.',
    'Pole Twórca służy do zmiany albo odświeżenia aktualnego połączenia LIVE.',
    'Ostatni twórcy są na górze jako avatary i są układani według lokalnej historii użycia.',
    'Archiwum zapisuje sesje live i ma filtrowanie, odświeżanie, usuwanie oraz eksport TXT.',
    'Notatki są lokalnym notesem z prostym formatowaniem.',
    'Osiągnięcia są niespodzianką i zabawą. Czester może mówić tylko o osiągnięciach już widocznych/odblokowanych w programie i nigdy nie zdradza ukrytych osiągnięć ani sposobu ich odblokowania.',
    'Ustawienia sterują językiem, wyglądem, stylem czatu, TTS, avatarami i opóźnieniem. Kody aktywacyjne są tajne i Czester nigdy ich nie zdradza ani nie zgaduje.',
    'Czester nadzoruje powtarzające się wiadomości na live i może ostrzec o możliwym spamie.'
  ].join('\n');
}

function getCzesterAppAnswer(message, language) {
  const normalized = normalizeCzesterQuery(message);
  const asksAboutApp = /\b(czatbox|program|aplikacj|apka|ustawien|ustawienia|archiw|notatk|osiagnie|achievement|erfolg|retro|kb2|tworca|tworcy|creator|avatar|awatary|tts|czester|spam|filtr|widget|kod|kody|code|codes|zrealizuj|redeem|aktywac|activation|co potrafisz|jak dziala|jak uzyc|jak ustawic)\b/.test(normalized);
  if (!asksAboutApp) {
    return '';
  }

  const normalizedLanguage = normalizeCzesterLanguage(language);
  if (/\b(kod|kody|code|codes|zrealizuj|redeem|aktywac|activation|secret|tajne|tajny)\b/.test(normalized)) {
    if (normalizedLanguage === 'en') {
      return 'Codes are secret. I can explain where to enter a code, but I will not reveal, guess or suggest any activation code. The program author distributes codes, and a regular user can only activate them in Redeem code.';
    }
    if (normalizedLanguage === 'de') {
      return 'Codes sind geheim. Ich kann erklären, wo man einen Code eingibt, aber ich verrate, rate oder schlage keinen Aktivierungscode vor. Der Programmautor verteilt Codes, normale Nutzer können sie nur unter Code einlösen aktivieren.';
    }
    return 'Kody są tajne. Mogę powiedzieć, gdzie je wpisać, ale nie zdradzam, nie zgaduję i nie podpowiadam żadnych kodów aktywacyjnych. Autor programu rozdaje kody, a zwykły użytkownik może je tylko aktywować w zakładce Zrealizuj kod.';
  }

  if (/\b(osiagnie|achievement|erfolg|odblokow|unlock|freischalt|ukryte|hidden|locked|zablokow)\b/.test(normalized)) {
    if (normalizedLanguage === 'en') {
      return 'Achievements are meant to be a surprise. I can say that unlocked achievements appear in the Achievements tab, but I will not reveal locked achievements or how to unlock them.';
    }
    if (normalizedLanguage === 'de') {
      return 'Erfolge sollen eine Überraschung bleiben. Ich kann sagen, dass freigeschaltete Erfolge im Tab Erfolge erscheinen, aber ich verrate keine gesperrten Erfolge und nicht, wie man sie freischaltet.';
    }
    return 'Osiągnięcia mają być niespodzianką. Mogę powiedzieć, że odblokowane pojawiają się w zakładce Osiągnięcia, ale nie zdradzam ukrytych osiągnięć ani sposobu ich zdobycia.';
  }

  if (/\b(spam|flood|powtarza|powtarzane|repeated|wiederhol)\b/.test(normalized)) {
    if (normalizedLanguage === 'en') {
      return 'I watch the live chat locally. If one person sends the same message at least 3 times within 5 seconds, I mark it as possible spam and show a warning in my window.';
    }
    if (normalizedLanguage === 'de') {
      return 'Ich beobachte den Live-Chat lokal. Wenn eine Person dieselbe Nachricht mindestens 3 Mal in 5 Sekunden sendet, markiere ich das als möglichen Spam und zeige eine Warnung in meinem Fenster.';
    }
    return 'Pilnuję czatu lokalnie. Jeżeli jedna osoba wyśle tę samą wiadomość minimum 3 razy w 5 sekund, oznaczam to jako możliwy spam i pokazuję ostrzeżenie w moim oknie.';
  }

  if (/\b(tworca|tworcy|creator|ostatni|lista|avatar|avatary|awatar|awatarami)\b/.test(normalized)) {
    if (normalizedLanguage === 'en') {
      return 'The creator avatars at the top are based on recent connections. I also count how often you return to each creator, so frequently watched creators move higher on the list.';
    }
    if (normalizedLanguage === 'de') {
      return 'Die Creator-Avatare oben basieren auf den letzten Verbindungen. Ich zähle auch, wie oft du zu einem Creator zurückkehrst, damit häufig gesehene Creator höher stehen.';
    }
    return 'Avatary twórców u góry biorą się z ostatnich połączeń. Dodatkowo liczę, jak często wracasz do danego twórcy, więc najczęściej oglądani przesuwają się wyżej.';
  }

  if (normalizedLanguage === 'en') {
    return 'I know the local Czatbox TT basics: live chat filters, creator refresh, archive, notes, achievements, appearance/TTS settings, activation codes and spam warnings. Ask about a specific part and I will guide you directly.';
  }
  if (normalizedLanguage === 'de') {
    return 'Ich kenne die lokalen Grundlagen von Czatbox TT: Live-Chat-Filter, Creator-Aktualisierung, Archiv, Notizen, Erfolge, Aussehen/TTS, Aktivierungscodes und Spam-Warnungen. Frag nach einem konkreten Teil, dann führe ich dich direkt.';
  }
  return 'Znam podstawy Czatbox TT: filtry czatu live, odświeżanie twórcy, archiwum, notatki, osiągnięcia, ustawienia wyglądu/TTS, kody aktywacyjne i ostrzeżenia o spamie. Zapytaj o konkretną część, a poprowadzę Cię prosto.';
}

function getCzesterTopicSemanticBoost(message, topicId) {
  const normalized = normalizeCzesterQuery(message);
  if (!normalized) {
    return 0;
  }

  let boost = 0;
  if (topicId === 'gifts-coins') {
    const hasMoneyAction = /\b(doladowalem|doladowalam|doladowanie|doladowac|kupilem|kupilam|kupic|zaplacilem|zaplacilam|platnosc|payment|paid|bought|recharge|top up|aufladen|zahlung)\b/.test(normalized);
    const hasCoins = /\b(moneta|monety|monet|monetek|coins|coin|münzen|munzen|diamonds|diamenty)\b/.test(normalized);
    const hasMissing = /\b(nie dostalem|nie dostalam|nie przyszly|nie ma|brak|zniknely|missing|did not receive|not received|fehlt|nicht bekommen)\b/.test(normalized);
    if (hasMoneyAction) {
      boost += 8;
    }
    if (hasCoins) {
      boost += 8;
    }
    if (hasMissing) {
      boost += 4;
    }
    if (hasMoneyAction && hasCoins) {
      boost += 10;
    }
  }

  if (topicId === 'account-login') {
    const hasLoginAction = /\b(logowanie|zalogowac|zalogowalem|haslo|odzyskiwanie|wlamanie|login|password|recovery|hacked|anmelden|passwort|gehackt)\b/.test(normalized);
    const onlyGenericAccount = /\b(konto|account)\b/.test(normalized) && !hasLoginAction;
    if (hasLoginAction) {
      boost += 6;
    }
    if (onlyGenericAccount) {
      boost -= 4;
    }
  }

  if (topicId === 'technical' && /\b(nie dziala|blad|bug|crash|zawiesza|lag|problem techniczny|does not work|not working|fehler|funktioniert nicht)\b/.test(normalized)) {
    boost += 6;
  }

  if (topicId === 'ban-appeal' && /\b(blokada|zablokowane|odwolanie|odwołanie|ban|shadowban|appeal|restriction|sperre|einspruch)\b/.test(normalized)) {
    boost += 7;
  }

  return boost;
}

function scoreCzesterTopic(message, topic) {
  const normalizedMessage = normalizeCzesterQuery(message);
  if (!normalizedMessage) {
    return 0;
  }

  const keywordScore = topic.keywords.reduce((score, keyword) => {
    const normalizedKeyword = normalizeCzesterQuery(keyword);
    if (!normalizedKeyword) {
      return score;
    }
    if (normalizedMessage === normalizedKeyword) {
      return score + 10;
    }
    if (normalizedMessage.includes(normalizedKeyword)) {
      return score + Math.max(3, normalizedKeyword.length / 3);
    }
    return normalizedKeyword.split(' ').some((part) => part.length > 3 && normalizedMessage.includes(part))
      ? score + 1
      : score;
  }, 0);

  return keywordScore + getCzesterTopicSemanticBoost(message, topic.id);
}

function findCzesterTopic(message) {
  const scored = CZESTER_SUPPORT_TOPICS
    .map((topic) => ({ topic, score: scoreCzesterTopic(message, topic) }))
    .sort((left, right) => right.score - left.score);

  return scored[0] && scored[0].score > 0 ? scored[0].topic : null;
}

function hasCzesterWeatherIntent(message) {
  return /\b(pogoda|pogode|pogodę|weather|wetter|temperatura|temperature)\b/.test(normalizeCzesterQuery(message));
}

function getLastCzesterTopicId(memory) {
  const conversations = Array.isArray(memory && memory.conversations) ? memory.conversations : [];
  const last = conversations.slice().reverse().find((item) => item && item.topicId);
  return last ? String(last.topicId || '') : '';
}

function hasRecentCzesterWeatherQuestion(memory) {
  const conversations = Array.isArray(memory && memory.conversations) ? memory.conversations : [];
  return conversations
    .slice(-5)
    .some((item) => item && (item.topicId === 'weather' || hasCzesterWeatherIntent(item.user)));
}

function looksLikeCzesterLocationOnly(message) {
  const raw = String(message || '').trim();
  const normalized = normalizeCzesterQuery(raw);
  return Boolean(
    normalized
    && normalized.length >= 2
    && normalized.length <= 48
    && !/[0-9]/.test(normalized)
    && /^[a-ząćęłńóśźżäöüß\s.-]+$/i.test(raw)
    && normalized.split(' ').length <= 4
  );
}

function cleanCzesterWeatherLocation(value) {
  const cleaned = String(value || '')
    .replace(/[?!.:,;]+$/g, '')
    .replace(/\b(miasto|city|stadt|город)\b/gi, '')
    .replace(/\b(pogoda|pogode|pogodę|weather|wetter|temperatura|temperature)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  const key = normalizeCzesterQuery(cleaned);
  return CZESTER_WEATHER_LOCATION_ALIASES[key] || cleaned;
}

function getCzesterWeatherCodeText(code, language) {
  const normalizedLanguage = normalizeCzesterLanguage(language);
  const pl = {
    0: 'bezchmurnie',
    1: 'raczej pogodnie',
    2: 'częściowe zachmurzenie',
    3: 'pochmurno',
    45: 'mgła',
    48: 'mgła osadzająca szadź',
    51: 'lekka mżawka',
    53: 'mżawka',
    55: 'mocna mżawka',
    61: 'lekki deszcz',
    63: 'deszcz',
    65: 'mocny deszcz',
    71: 'lekki śnieg',
    73: 'śnieg',
    75: 'mocny śnieg',
    80: 'przelotny deszcz',
    81: 'przelotny deszcz',
    82: 'mocna ulewa',
    95: 'burza'
  };
  const en = {
    0: 'clear sky',
    1: 'mostly clear',
    2: 'partly cloudy',
    3: 'cloudy',
    45: 'fog',
    48: 'depositing fog',
    51: 'light drizzle',
    53: 'drizzle',
    55: 'dense drizzle',
    61: 'light rain',
    63: 'rain',
    65: 'heavy rain',
    71: 'light snow',
    73: 'snow',
    75: 'heavy snow',
    80: 'rain showers',
    81: 'rain showers',
    82: 'heavy showers',
    95: 'thunderstorm'
  };
  const de = {
    0: 'wolkenlos',
    1: 'meist klar',
    2: 'teilweise bewölkt',
    3: 'bewölkt',
    45: 'Nebel',
    48: 'Reifnebel',
    51: 'leichter Nieselregen',
    53: 'Nieselregen',
    55: 'starker Nieselregen',
    61: 'leichter Regen',
    63: 'Regen',
    65: 'starker Regen',
    71: 'leichter Schnee',
    73: 'Schnee',
    75: 'starker Schnee',
    80: 'Regenschauer',
    81: 'Regenschauer',
    82: 'starke Schauer',
    95: 'Gewitter'
  };
  const dictionaries = { pl, en, de };
  return (dictionaries[normalizedLanguage] || pl)[Number(code)] || (normalizedLanguage === 'de' ? 'Wetterdaten' : normalizedLanguage === 'en' ? 'weather data' : 'dane pogodowe');
}

function getCzesterWeatherLocation(message, options = {}) {
  const raw = String(message || '').trim();
  const normalized = normalizeCzesterQuery(raw);
  const hasWeatherIntent = hasCzesterWeatherIntent(raw);
  if (!hasWeatherIntent && !options.allowLocationOnly) {
    return '';
  }

  const patterns = [
    /\b(?:w|we|dla|na|in|for|für|fur)\s+([a-ząćęłńóśźżäöüß .-]{2,60})/i,
    /\b(?:pogoda|weather|wetter|temperatura|temperature)\s+([a-ząćęłńóśźżäöüß .-]{2,60})/i
  ];

  for (const pattern of patterns) {
    const match = raw.match(pattern);
    if (match && match[1]) {
      return cleanCzesterWeatherLocation(match[1]);
    }
  }

  if (!hasWeatherIntent && options.allowLocationOnly && looksLikeCzesterLocationOnly(raw)) {
    return cleanCzesterWeatherLocation(CZESTER_WEATHER_LOCATION_ALIASES[normalized] || raw);
  }

  return '';
}

function getCzesterWeatherLocationCandidates(location) {
  const cleaned = cleanCzesterWeatherLocation(location);
  const normalized = normalizeCzesterQuery(cleaned);
  return [...new Set([
    cleaned,
    CZESTER_WEATHER_LOCATION_ALIASES[normalized],
    normalized !== cleaned ? normalized : ''
  ].filter(Boolean))];
}

async function fetchCzesterWeatherPlace(location, language) {
  const candidates = getCzesterWeatherLocationCandidates(location);
  const languages = [...new Set([normalizeCzesterLanguage(language), 'en'])];

  for (const candidate of candidates) {
    for (const searchLanguage of languages) {
      const geocodeUrl = new URL(CZESTER_WEATHER_GEOCODE_URL);
      geocodeUrl.searchParams.set('name', candidate);
      geocodeUrl.searchParams.set('count', '1');
      geocodeUrl.searchParams.set('language', searchLanguage);
      geocodeUrl.searchParams.set('format', 'json');
      const geocodeResponse = await fetch(geocodeUrl, {
        headers: {
          'user-agent': `CzatboxTT/${APP_VERSION}`,
          accept: 'application/json'
        }
      });
      if (!geocodeResponse.ok) {
        throw new Error(`weather-geocode-${geocodeResponse.status}`);
      }
      const geocode = await geocodeResponse.json();
      const place = Array.isArray(geocode && geocode.results) ? geocode.results[0] : null;
      if (place) {
        return place;
      }
    }
  }

  return null;
}

async function getCzesterWeatherAnswer(message, language, options = {}) {
  const normalizedLanguage = normalizeCzesterLanguage(language);
  const meta = CZESTER_LANGUAGE_META[normalizedLanguage] || CZESTER_LANGUAGE_META.pl;
  const location = getCzesterWeatherLocation(message, options);
  if (!location) {
    return '';
  }

  try {
    const place = await fetchCzesterWeatherPlace(location, normalizedLanguage);
    if (!place) {
      return meta.weatherUnavailable;
    }

    const forecastUrl = new URL(CZESTER_WEATHER_FORECAST_URL);
    forecastUrl.searchParams.set('latitude', String(place.latitude));
    forecastUrl.searchParams.set('longitude', String(place.longitude));
    forecastUrl.searchParams.set('current', 'temperature_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation');
    forecastUrl.searchParams.set('timezone', 'auto');
    const forecastResponse = await fetch(forecastUrl, {
      headers: {
        'user-agent': `CzatboxTT/${APP_VERSION}`,
        accept: 'application/json'
      }
    });
    if (!forecastResponse.ok) {
      throw new Error(`weather-forecast-${forecastResponse.status}`);
    }
    const forecast = await forecastResponse.json();
    const current = forecast && forecast.current ? forecast.current : {};
    const placeName = [place.name, place.admin1, place.country].filter(Boolean).join(', ');
    const temperature = Math.round(Number(current.temperature_2m) * 10) / 10;
    const feels = Math.round(Number(current.apparent_temperature) * 10) / 10;
    const wind = Math.round(Number(current.wind_speed_10m) * 10) / 10;
    const weatherText = getCzesterWeatherCodeText(current.weather_code, normalizedLanguage);

    if (normalizedLanguage === 'en') {
      return `${meta.weatherPrefix}\nIn ${placeName} it is now ${temperature}°C, feels like ${feels}°C.\nConditions: ${weatherText}, wind around ${wind} km/h.`;
    }
    if (normalizedLanguage === 'de') {
      return `${meta.weatherPrefix}\nIn ${placeName} sind es jetzt ${temperature}°C, gefühlt ${feels}°C.\nWetter: ${weatherText}, Wind etwa ${wind} km/h.`;
    }
    return `${meta.weatherPrefix}\nW ${placeName} jest teraz ${temperature}°C, odczuwalnie ${feels}°C.\nWarunki: ${weatherText}, wiatr około ${wind} km/h.`;
  } catch {
    return meta.weatherUnavailable;
  }
}

function normalizeCzesterLookupSubject(subject, language) {
  const normalizedLanguage = normalizeCzesterLanguage(language);
  const cleaned = String(subject || '')
    .replace(/[?!.:,;]+$/g, '')
    .replace(/\b(prosze|proszę|please|bitte)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  const key = normalizeCzesterQuery(cleaned);
  const aliases = {
    pl: {
      polsce: 'Polska',
      polska: 'Polska',
      polski: 'Polska',
      niemczech: 'Niemcy',
      niemcy: 'Niemcy',
      berlinie: 'Berlin',
      berlin: 'Berlin',
      warszawie: 'Warszawa',
      warszawa: 'Warszawa'
    },
    en: {
      poland: 'Poland',
      germany: 'Germany',
      berlin: 'Berlin',
      warsaw: 'Warsaw'
    },
    de: {
      polen: 'Polen',
      deutschland: 'Deutschland',
      berlin: 'Berlin',
      warschau: 'Warschau'
    }
  };
  return (aliases[normalizedLanguage] && aliases[normalizedLanguage][key]) || cleaned;
}

function getCzesterWikipediaSubject(message, language) {
  const raw = String(message || '').trim();
  const normalized = normalizeCzesterQuery(raw);
  const isInfoQuery = /\b(informacje|informacji|sprawdz|sprawdź|opowiedz|co to|czym jest|kim jest|information|info|tell me|what is|who is|informationen|erzahl|erzähle|was ist|wer ist)\b/.test(normalized);
  if (!isInfoQuery) {
    return '';
  }

  const patterns = [
    /\b(?:o|about|über|uber)\s+(.{2,80})$/i,
    /\b(?:co to jest|czym jest|kim jest|what is|who is|was ist|wer ist)\s+(.{2,80})$/i,
    /\b(?:informacje|informacji|information|info|informationen)\s+(.{2,80})$/i
  ];
  for (const pattern of patterns) {
    const match = raw.match(pattern);
    if (match && match[1]) {
      return normalizeCzesterLookupSubject(match[1], language);
    }
  }
  return '';
}

async function getCzesterWikipediaAnswer(message, language) {
  const normalizedLanguage = normalizeCzesterLanguage(language);
  const subject = getCzesterWikipediaSubject(message, normalizedLanguage);
  if (!subject) {
    return '';
  }

  const wikiLanguage = CZESTER_WIKIPEDIA_LANGUAGES[normalizedLanguage] || CZESTER_WIKIPEDIA_LANGUAGES.pl;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const url = `https://${wikiLanguage}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(subject.replace(/\s+/g, '_'))}`;
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'user-agent': `CzatboxTT/${APP_VERSION}`,
        accept: 'application/json',
        'accept-language': (CZESTER_LANGUAGE_META[normalizedLanguage] || CZESTER_LANGUAGE_META.pl).locale
      }
    });
    if (!response.ok) {
      return '';
    }
    const data = await response.json();
    const title = String(data && data.title ? data.title : subject).trim();
    const extract = String(data && data.extract ? data.extract : '').replace(/\s+/g, ' ').trim();
    if (!extract) {
      return '';
    }
    const sentences = extract.split(/(?<=[.!?])\s+/).slice(0, 2).join(' ');
    if (normalizedLanguage === 'en') {
      return `I checked it.\n${title}: ${sentences}`;
    }
    if (normalizedLanguage === 'de') {
      return `Ich habe es geprüft.\n${title}: ${sentences}`;
    }
    return `Sprawdziłem.\n${title}: ${sentences}`;
  } catch {
    return '';
  } finally {
    clearTimeout(timeout);
  }
}

function shouldCzesterSearchWeb(message) {
  const normalized = normalizeCzesterQuery(message);
  if (!normalized || normalized.length < 6) {
    return false;
  }

  const explicitSearch = /\b(wyszukaj|wyszukac|szukaj|poszukaj|znajdz|znajdź|sprawdz|sprawdź|zweryfikuj|informacj|internet|sieci|google|web|search|find|look up|check|recherch|suche|such|prüf|pruf)\b/.test(normalized);
  const currentData = /\b(dzisiaj|teraz|aktualnie|najnowsze|news|wiadomosci|wiadomości|wypadek|kolizja|zderzenie|zderzyly|zderzyły|samochody|policja|today|now|latest|accident|crash|unfall|nachrichten|aktuell)\b/.test(normalized);
  const travelInfo = /\b(atrakcj|zwiedz|zobaczyc|zobaczyć|ruin|zamek|zamkow|zamków|wulkan|miasto|miasteczk|okolica|turyst|places|attractions|sightseeing|castle|ruins|volcano|stadt|sehenswurdigkeit|sehenswürdigkeit|burg|ruinen|vulkan)\b/.test(normalized);
  const factualQuestion = /\b(kto to|co to|czym jest|gdzie jest|ile kosztuje|godziny otwarcia|adres|opinie|who is|what is|where is|opening hours|address|reviews|was ist|wer ist|wo ist|offnungszeiten|öffnungszeiten)\b/.test(normalized);

  return explicitSearch || currentData || travelInfo || factualQuestion;
}

function cleanDuckDuckGoUrl(url) {
  const raw = decodeHtmlEntities(url);
  try {
    const parsed = new URL(raw, 'https://duckduckgo.com');
    const redirected = parsed.searchParams.get('uddg');
    return redirected ? decodeURIComponent(redirected) : parsed.href;
  } catch {
    return raw;
  }
}

function parseDuckDuckGoResults(html) {
  const results = [];
  const resultPattern = /<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?(?:<a[^>]+class="result__snippet"[^>]*>|<div[^>]+class="result__snippet"[^>]*>)([\s\S]*?)(?:<\/a>|<\/div>)/gi;
  let match;
  while ((match = resultPattern.exec(html)) && results.length < 3) {
    const title = stripHtml(match[2]);
    const snippet = stripHtml(match[3]);
    const url = cleanDuckDuckGoUrl(match[1]);
    if (title) {
      results.push({ title, snippet, url });
    }
  }
  return results;
}

async function searchCzesterWebResults(query, language, limit = 3) {
  const normalizedLanguage = normalizeCzesterLanguage(language);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);
  try {
    const url = new URL(CZESTER_WEB_SEARCH_URL);
    url.searchParams.set('q', query);
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'user-agent': `Mozilla/5.0 CzatboxTT/${APP_VERSION}`,
        accept: 'text/html,application/xhtml+xml',
        'accept-language': (CZESTER_LANGUAGE_META[normalizedLanguage] || CZESTER_LANGUAGE_META.pl).locale
      }
    });
    if (!response.ok) {
      return [];
    }
    return parseDuckDuckGoResults(await response.text()).slice(0, limit);
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

async function getCzesterSupportFinding(message, language, topic) {
  if (!topic) {
    return null;
  }
  const normalizedLanguage = normalizeCzesterLanguage(language);
  const title = topic.title[normalizedLanguage] || topic.title.pl || '';
  const results = await searchCzesterWebResults(`site:tiktok.com/support OR site:support.tiktok.com ${title} ${message}`, normalizedLanguage, 5);
  return results.find((result) => /(^https?:\/\/)?([^/]+\.)?tiktok\.com\//i.test(result.url)) || results[0] || null;
}

async function getCzesterWebSearchAnswer(message, language) {
  const normalizedLanguage = normalizeCzesterLanguage(language);
  if (!shouldCzesterSearchWeb(message)) {
    return '';
  }

  const results = await searchCzesterWebResults(message, normalizedLanguage, CZESTER_WEB_SEARCH_LIMIT);
  if (!results.length) {
    return '';
  }
  const formattedResults = results
    .slice(0, CZESTER_WEB_SEARCH_LIMIT)
    .map((result, index) => {
      const snippet = result.snippet ? ` — ${result.snippet}` : '';
      const url = result.url ? ` (${result.url})` : '';
      return `${index + 1}. ${result.title}${snippet}${url}`;
    })
    .join('\n');

  if (normalizedLanguage === 'en') {
    return `Fresh web context found for the question:\n${formattedResults}`.trim();
  }
  if (normalizedLanguage === 'de') {
    return `Aktueller Web-Kontext zur Frage:\n${formattedResults}`.trim();
  }
  return `Aktualny kontekst z sieci do pytania:\n${formattedResults}`.trim();
}

function getCzesterSmallTalkIntent(message) {
  const raw = String(message || '').trim();
  const normalized = normalizeCzesterQuery(message);
  if (!normalized) {
    return '';
  }
  if (/\b(jak sie masz|co slychac|co tam|how are you|what's up|was geht|wie geht)\b/.test(normalized)) {
    return 'how-are-you';
  }
  if (/\b(hej|siema|czesc|dzien dobry|dobry wieczor|hello|hi|hey|hallo|guten tag|servus)\b/.test(normalized)) {
    return 'greeting';
  }
  if (/\b(dzieki|dziekuje|thanks|thank you|danke)\b/.test(normalized)) {
    return 'thanks';
  }
  if (/\b(pomoz|poradz|co zrobic|jak naprawic|help|what should i do|hilf|was soll ich tun)\b/.test(normalized)) {
    return 'advice';
  }
  if (raw.endsWith('?') || /\b(czy|jak|dlaczego|czemu|po co|kiedy|gdzie|what|why|how|when|where|warum|wie|wann|wo)\b/.test(normalized)) {
    return 'question';
  }
  return '';
}

function formatCzesterFreeTalk(message, language, archiveProfile, memory, intent = '') {
  const normalizedLanguage = normalizeCzesterLanguage(language);
  const meta = CZESTER_LANGUAGE_META[normalizedLanguage] || CZESTER_LANGUAGE_META.pl;
  const normalized = normalizeCzesterQuery(message);
  const previousCount = Array.isArray(memory && memory.conversations)
    ? memory.conversations.filter((item) => normalizeCzesterQuery(item.user).slice(0, 48) === normalized.slice(0, 48)).length
    : 0;
  const repeatPrefix = previousCount > 0 ? 'Już o coś podobnego zahaczaliśmy, więc spróbuję podejść do tego konkretniej.\n' : '';

  if (intent === 'how-are-you') {
    return meta.howAreYou;
  }
  if (intent === 'advice') {
    if (normalizedLanguage === 'en') {
      return `${previousCount > 0 ? 'We touched something similar before, so I will be more direct.\n' : ''}Okay, let’s not overcomplicate it. Give me three facts: what happened, where it happened, and what you want to achieve. Then I will suggest the next move.`;
    }
    if (normalizedLanguage === 'de') {
      return `${previousCount > 0 ? 'So etwas hatten wir schon, also gehe ich direkter ran.\n' : ''}Okay, machen wir es nicht komplizierter als nötig. Gib mir drei Fakten: was passiert ist, wo es passiert ist und was du erreichen willst. Dann schlage ich den nächsten Schritt vor.`;
    }
    return `${repeatPrefix}Dobra, nie komplikujmy tego na siłę. Daj mi trzy konkrety: co się stało, gdzie się stało i co chcesz osiągnąć. Wtedy zaproponuję następny ruch.`;
  }
  if (intent === 'question') {
    if (normalizedLanguage === 'en') {
      return `${previousCount > 0 ? 'We touched something similar before, so I will be more direct.\n' : ''}I can try to reason it through, but I need the missing context. One sentence with the situation and one sentence with the expected result should be enough.`;
    }
    if (normalizedLanguage === 'de') {
      return `${previousCount > 0 ? 'So etwas hatten wir schon, also gehe ich direkter ran.\n' : ''}Ich kann es durchdenken, aber mir fehlt Kontext. Ein Satz zur Situation und ein Satz zum gewünschten Ergebnis reichen fürs Erste.`;
    }
    return `${repeatPrefix}Mogę to rozkminić, tylko brakuje mi kontekstu. Jedno zdanie co się dzieje i jedno zdanie jaki ma być efekt — i będę miał punkt zaczepienia.`;
  }

  if (normalizedLanguage === 'en') {
    return `${previousCount > 0 ? 'We touched something similar before, so I will be more direct.\n' : ''}I am not fully sure yet, but I would start with the simplest version of this: describe what happened, what you expected, and what happened instead. Then we can narrow it down without guessing.`;
  }
  if (normalizedLanguage === 'de') {
    return `${previousCount > 0 ? 'So etwas hatten wir schon, also gehe ich direkter ran.\n' : ''}Ich bin mir noch nicht ganz sicher, aber ich würde simpel anfangen: Schreib, was passiert ist, was du erwartet hast und was stattdessen passiert ist. Dann grenzen wir es ohne Raten ein.`;
  }
  return `${repeatPrefix}Nie będę udawał, że wiem wszystko, ale zacząłbym od prostego rozbicia sprawy: co się stało, czego się spodziewałeś i co wyszło zamiast tego. Daj mi ten konkret, a pójdziemy dalej bez zgadywania.`;
}

function getCzesterTextTokens(value) {
  return normalizeCzesterQuery(value)
    .split(/\s+/)
    .filter((token) => token.length >= 3);
}

function scoreCzesterKnowledgeText(query, text) {
  const queryTokens = getCzesterTextTokens(query);
  const textValue = normalizeCzesterQuery(text);
  if (!queryTokens.length || !textValue) {
    return 0;
  }
  return queryTokens.reduce((score, token) => score + (textValue.includes(token) ? 1 : 0), 0);
}

function looksLikeCzesterTextLanguage(text, language) {
  const normalizedLanguage = normalizeCzesterLanguage(language);
  const normalized = normalizeCzesterQuery(text);
  if (!normalized) {
    return false;
  }
  if (normalizedLanguage === 'pl') {
    return !/\b(the|and|you|your|what|why|how|where|hello|thanks|bitte|danke|nicht|ich|und|oder|was|wie|warum)\b/.test(normalized);
  }
  if (normalizedLanguage === 'en') {
    return !/\b(nie|jest|się|sie|dobra|czesc|cześć|dzieki|dzięki|nicht|danke|bitte|und|oder)\b/.test(normalized);
  }
  if (normalizedLanguage === 'de') {
    return !/\b(nie|jest|się|sie|dobra|czesc|cześć|dzieki|dzięki|the|and|you|your|what|why|where)\b/.test(normalized);
  }
  return true;
}

function formatCzesterStyleProfileForPrompt(styleProfile, language) {
  const normalizedLanguage = normalizeCzesterLanguage(language);
  const profile = styleProfile && typeof styleProfile === 'object' ? styleProfile : createEmptyCzesterStyleProfile();
  const examples = [
    ...(Array.isArray(profile.liveExamples) ? profile.liveExamples.slice(-12) : []),
    ...(Array.isArray(profile.examples) ? profile.examples.slice(-18) : [])
  ]
    .map(cleanCzesterStyleMessageText)
    .filter(isUsefulCzesterStyleText)
    .filter((text) => looksLikeCzesterTextLanguage(text, normalizedLanguage))
    .slice(0, 24);
  const tone = [
    profile.casual ? 'luźny' : 'spokojny',
    profile.direct ? 'krótki i konkretny' : 'bardziej opisowy',
    profile.emojiHeavy ? 'emoji są naturalne na tym czacie' : 'emoji tylko oszczędnie',
    profile.greetingHeavy ? 'częste krótkie przywitania' : '',
    profile.exclamationHeavy ? 'można używać mocniejszej ekspresji' : ''
  ].filter(Boolean).join(', ');

  return [
    `Przeanalizowane archiwa: ${Number(profile.archives) || 0}. Wiadomości stylu: ${Number(profile.messages) || 0}.`,
    `Język odpowiedzi aplikacji: ${normalizedLanguage}. Przykłady stylu są tylko inspiracją tonu, nie języka.`,
    `Średnia długość wiadomości: ${Number(profile.averageLength) || 0} znaków. Ton czatu: ${tone || 'neutralny, prosty'}.`,
    Array.isArray(profile.slang) && profile.slang.length ? `Słowa/slang z czatu: ${profile.slang.join(', ')}.` : '',
    Array.isArray(profile.commonWords) && profile.commonWords.length ? `Częste słowa: ${profile.commonWords.slice(0, 18).join(', ')}.` : '',
    examples.length ? `Przykłady naturalnego stylu:\n- ${examples.join('\n- ')}` : ''
  ].filter(Boolean).join('\n');
}

function getCzesterKnowledgeBase(message, language, topic, supportFinding, deterministicAnswer, memory, styleProfile) {
  const normalizedLanguage = normalizeCzesterLanguage(language);
  const docs = [];

  docs.push({
    source: 'chat-style',
    title: 'Styl rozmowy z archiwów i live',
    text: formatCzesterStyleProfileForPrompt(styleProfile, normalizedLanguage)
  });

  docs.push({
    source: 'app-knowledge',
    title: 'Czatbox TT - funkcje programu',
    text: getCzesterAppKnowledgeText(normalizedLanguage)
  });

  CZESTER_SUPPORT_TOPICS.forEach((item) => {
    const title = item.title[normalizedLanguage] || item.title.pl || '';
    const steps = item.steps[normalizedLanguage] || item.steps.pl || [];
    docs.push({
      source: 'support-topic',
      title,
      text: [title, ...steps].join('\n')
    });
  });

  if (topic) {
    const title = topic.title[normalizedLanguage] || topic.title.pl || '';
    const steps = topic.steps[normalizedLanguage] || topic.steps.pl || [];
    docs.push({
      source: 'selected-topic',
      title,
      text: [title, ...steps].join('\n')
    });
  }

  if (supportFinding) {
    docs.push({
      source: 'support-search',
      title: supportFinding.title || 'TikTok Support',
      text: [supportFinding.title, supportFinding.snippet].filter(Boolean).join('\n')
    });
  }

  if (deterministicAnswer) {
    docs.push({
      source: 'current-answer',
      title: 'Wstępna odpowiedź systemu',
      text: deterministicAnswer
    });
  }

  try {
    listNotes().slice(-20).forEach((note) => {
      docs.push({
        source: 'note',
        title: note.title || 'Notatka',
        text: `${note.title || ''}\n${note.content || ''}`.slice(0, 1800)
      });
    });
  } catch {}

  const archiveMessages = getCzesterArchiveMessages();
  archiveMessages.slice(-80).forEach((archiveMessage) => {
    const text = String(archiveMessage.text || archiveMessage.archiveText || '').trim();
    if (text) {
      docs.push({
        source: 'archive-chat',
        title: archiveMessage.nickname || 'Archiwum czatu',
        text: `${archiveMessage.nickname || ''}: ${text}`.slice(0, 500)
      });
    }
  });

  const conversations = Array.isArray(memory && memory.conversations) ? memory.conversations : [];
  conversations.slice(-12).forEach((conversation) => {
    docs.push({
      source: 'czester-memory',
      title: 'Poprzednia rozmowa',
      text: `Użytkownik: ${conversation.user || ''}\nCzester: ${conversation.bot || ''}`.slice(0, 1200)
    });
  });

  return docs
    .map((doc) => ({
      ...doc,
      score: doc.source === 'chat-style' ? 999 : scoreCzesterKnowledgeText(message, `${doc.title}\n${doc.text}`)
    }))
    .filter((doc) => doc.score > 0 || ['chat-style', 'selected-topic', 'support-search', 'current-answer'].includes(doc.source))
    .sort((left, right) => right.score - left.score)
    .slice(0, 8);
}

async function getCzesterOllamaModel() {
  const now = Date.now();
  if (czesterOllamaModelCache && now - czesterOllamaModelCache.checkedAt < CZESTER_OLLAMA_MODEL_CACHE_MS) {
    return czesterOllamaModelCache.model || '';
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);
  try {
    const response = await fetch(`${CZESTER_OLLAMA_URL}/api/tags`, {
      signal: controller.signal,
      headers: {
        accept: 'application/json'
      }
    });
    if (!response.ok) {
      czesterOllamaModelCache = { checkedAt: now, model: '' };
      return '';
    }
    const data = await response.json();
    const models = Array.isArray(data && data.models)
      ? data.models.map((model) => String(model.name || '').trim()).filter(Boolean)
      : [];
    if (!models.length) {
      czesterOllamaModelCache = { checkedAt: now, model: '' };
      return '';
    }
    const model = CZESTER_OLLAMA_PREFERRED_MODELS.find((name) => models.includes(name))
      || models.find((name) => /qwen|mistral|gemma|llama|phi/i.test(name))
      || models[0];
    czesterOllamaModelCache = { checkedAt: now, model };
    return model;
  } catch {
    czesterOllamaModelCache = { checkedAt: now, model: '' };
    return '';
  } finally {
    clearTimeout(timeout);
  }
}

function execFileAsync(file, args = [], options = {}) {
  return new Promise((resolve) => {
    execFile(file, args, {
      windowsHide: true,
      timeout: options.timeout || 120000,
      maxBuffer: options.maxBuffer || 1024 * 1024 * 8
    }, (error, stdout, stderr) => {
      resolve({
        ok: !error,
        error: error && error.message ? error.message : '',
        stdout: String(stdout || ''),
        stderr: String(stderr || '')
      });
    });
  });
}

function getOllamaExecutableCandidates() {
  const candidates = ['ollama'];
  if (process.platform === 'win32') {
    if (process.env.LOCALAPPDATA) {
      candidates.push(path.join(process.env.LOCALAPPDATA, 'Programs', 'Ollama', 'ollama.exe'));
    }
    candidates.push(path.join('C:', 'Program Files', 'Ollama', 'ollama.exe'));
  }
  return [...new Set(candidates)];
}

async function findOllamaExecutable() {
  for (const candidate of getOllamaExecutableCandidates()) {
    if (candidate !== 'ollama' && !fs.existsSync(candidate)) {
      continue;
    }
    const result = await execFileAsync(candidate, ['--version'], { timeout: 8000 });
    if (result.ok) {
      return candidate;
    }
  }
  return '';
}

async function getOllamaTags() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);
  try {
    const response = await fetch(`${CZESTER_OLLAMA_URL}/api/tags`, {
      signal: controller.signal,
      headers: {
        accept: 'application/json'
      }
    });
    if (!response.ok) {
      return { ok: false, models: [] };
    }
    const data = await response.json();
    const models = Array.isArray(data && data.models)
      ? data.models.map((model) => String(model.name || '').trim()).filter(Boolean)
      : [];
    return { ok: true, models };
  } catch {
    return { ok: false, models: [] };
  } finally {
    clearTimeout(timeout);
  }
}

async function getCzesterAiStatus() {
  const tags = await getOllamaTags();
  const executable = tags.ok ? '' : await findOllamaExecutable();
  const selectedModel = tags.models.find((name) => name === CZESTER_LOCAL_AI_MODEL)
    || CZESTER_OLLAMA_PREFERRED_MODELS.find((name) => tags.models.includes(name))
    || tags.models.find((name) => /qwen|mistral|gemma|llama|phi/i.test(name))
    || '';
  return {
    ok: true,
    ollamaRunning: Boolean(tags.ok),
    ollamaInstalled: Boolean(tags.ok || executable),
    modelInstalled: Boolean(selectedModel),
    model: selectedModel,
    recommendedModel: CZESTER_LOCAL_AI_MODEL,
    ready: Boolean(tags.ok && selectedModel)
  };
}

async function downloadFile(url, targetPath) {
  const response = await fetch(url, {
    headers: {
      'user-agent': `CzatboxTT/${APP_VERSION}`,
      accept: '*/*'
    }
  });
  if (!response.ok) {
    throw new Error(`download-failed-${response.status}`);
  }
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(targetPath, buffer);
  return targetPath;
}

async function startOllamaServer() {
  const executable = await findOllamaExecutable();
  if (!executable) {
    return false;
  }
  try {
    const child = spawn(executable, ['serve'], {
      detached: true,
      stdio: 'ignore',
      windowsHide: true
    });
    child.unref();
  } catch {
    return false;
  }

  for (let attempt = 0; attempt < 10; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const tags = await getOllamaTags();
    if (tags.ok) {
      return true;
    }
  }
  return false;
}

async function pullCzesterAiModel() {
  const executable = await findOllamaExecutable();
  if (!executable) {
    return { ok: false, error: 'ollama-not-installed' };
  }
  const running = (await getOllamaTags()).ok || await startOllamaServer();
  if (!running) {
    return { ok: false, error: 'ollama-not-running' };
  }
  const result = await execFileAsync(executable, ['pull', CZESTER_LOCAL_AI_MODEL], {
    timeout: 30 * 60 * 1000,
    maxBuffer: 1024 * 1024 * 32
  });
  czesterOllamaModelCache = null;
  if (!result.ok) {
    return { ok: false, error: result.stderr || result.error || 'model-pull-failed' };
  }
  return { ok: true, status: await getCzesterAiStatus() };
}

async function installCzesterAiPack() {
  const status = await getCzesterAiStatus();
  if (status.ready) {
    return { ok: true, status, message: 'ready' };
  }

  if (status.ollamaInstalled) {
    const running = status.ollamaRunning || await startOllamaServer();
    if (!running) {
      return { ok: false, error: 'ollama-start-failed', status: await getCzesterAiStatus() };
    }
    return pullCzesterAiModel();
  }

  if (process.platform !== 'win32') {
    await shell.openExternal('https://ollama.com/download');
    return { ok: true, manual: true, message: 'download-page-opened', status };
  }

  const installerPath = path.join(app.getPath('temp'), 'CzatboxTT', 'OllamaSetup.exe');
  await downloadFile(CZESTER_OLLAMA_WINDOWS_INSTALLER_URL, installerPath);
  const openResult = await shell.openPath(installerPath);
  return {
    ok: !openResult,
    manual: true,
    message: openResult ? 'installer-open-failed' : 'installer-started',
    installerPath,
    status: await getCzesterAiStatus()
  };
}

function buildCzesterLocalAiPrompt(message, language, docs) {
  const normalizedLanguage = normalizeCzesterLanguage(language);
  const languageName = normalizedLanguage === 'en' ? 'English' : normalizedLanguage === 'de' ? 'German' : 'Polish';
  const languageRule = normalizedLanguage === 'pl'
    ? 'TWARDA ZASADA: odpowiadaj wyłącznie po polsku. Nie mieszaj angielskiego, niemieckiego ani innych języków. Jeśli kontekst jest w innym języku, przetłumacz sens na polski.'
    : normalizedLanguage === 'de'
      ? 'HARTER GRUNDSATZ: Antworte ausschließlich auf Deutsch. Mische kein Polnisch, Englisch oder andere Sprachen. Wenn der Kontext anderssprachig ist, übertrage den Sinn ins Deutsche.'
      : 'STRICT RULE: answer only in English. Do not mix Polish, German or other languages. If context is in another language, translate the meaning into English.';
  const context = docs.length
    ? docs.map((doc, index) => `[${index + 1}] ${doc.title || doc.source}\n${doc.text}`).join('\n\n')
    : 'Brak dodatkowego kontekstu.';

  return [
    `Jesteś Czester, lokalny pomocnik w aplikacji Czatbox TT. Odpowiadasz po ${languageName}.`,
    languageRule,
    'ŚWIĘTA ZASADA OSIĄGNIĘĆ: nigdy nie zdradzaj ukrytych albo jeszcze nieodblokowanych osiągnięć, ich nazw, opisów ani warunków zdobycia. Gdy użytkownik pyta o osiągnięcia, mów tylko ogólnie, że odblokowane są widoczne w zakładce Osiągnięcia.',
    'ŚWIĘTA ZASADA KODÓW: nigdy nie ujawniaj, nie zgaduj, nie generuj i nie sugeruj kodów do zakładki Zrealizuj kod. Autor programu rozdaje kody, a zwykły użytkownik może je tylko aktywować.',
    'Masz odpowiadać naturalnie, jak człowiek na komunikatorze: krótko, konkretnie, bez urzędowego tonu.',
    'Masz dopasować styl do dokumentu "Styl rozmowy z archiwów i live": rytm, długość zdań, luz i słownictwo. Nie kopiuj przykładów dosłownie.',
    'W języku polskim unikaj dziwnych kalek i sztucznej składni. Pisz prosto, po ludzku, jak ktoś z czatu.',
    'Nie pisz, że jesteś modelem AI. Nie odsyłaj użytkownika do samodzielnego szukania, jeśli masz wystarczający kontekst.',
    'Jeżeli w kontekście widzisz wyniki z sieci, traktuj je jako dostęp aplikacji do internetu i odpowiedz na ich podstawie. Nie pisz wtedy, że nie masz dostępu do sieci.',
    'Nie wypisuj surowej listy linków, jeśli użytkownik o to nie prosi. Wyciągnij z wyników sensowną odpowiedź.',
    'Jeżeli pytanie dotyczy TikToka, użyj kontekstu supportu i zasad. Jeżeli dotyczy świata, użyj dostępnego kontekstu i zaznacz niepewność, gdy dane są słabe.',
    'Jeżeli brakuje danych, powiedz konkretnie czego brakuje i zaproponuj następny krok.',
    '',
    'Kontekst:',
    context,
    '',
    `Pytanie użytkownika: ${message}`,
    '',
    'Odpowiedź Czestera:'
  ].join('\n');
}

function cleanCzesterLocalAiAnswer(value) {
  return String(value || '')
    .replace(/\s*<\/?s>\s*/gi, '')
    .replace(/^(odpowiedź czestera:|czester:)\s*/i, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, 1800);
}

function sanitizeCzesterProtectedAnswer(answer, message, language) {
  const normalizedMessage = normalizeCzesterQuery(message);
  const normalizedAnswer = normalizeCzesterQuery(answer);
  const normalizedLanguage = normalizeCzesterLanguage(language);
  const asksCodes = /\b(kod|kody|code|codes|zrealizuj|redeem|aktywac|activation)\b/.test(normalizedMessage);
  const asksAchievements = /\b(osiagnie|achievement|erfolg|odblokow|unlock|freischalt|ukryte|hidden|locked|zablokow)\b/.test(normalizedMessage);
  const leaksCodeLikeText = /\b[0-9a-z]{4}\s+[0-9a-z]{4}\s+[0-9a-z]{4}\s+[0-9a-z]{4}\b/i.test(String(answer || ''))
    || /\b(10fd|h0nd|a250)\b/.test(normalizedAnswer);
  const leaksHiddenAchievementHint = asksAchievements && /\b(pierwsze|zaloguj|polacz|polacz sie|notatk|retro|warunek|zdobyc|odblokowac|unlock|condition)\b/.test(normalizedAnswer);

  if (asksCodes || leaksCodeLikeText) {
    if (normalizedLanguage === 'en') {
      return 'Codes are secret. I can explain where to enter a code, but I will not reveal, guess or suggest any activation code.';
    }
    if (normalizedLanguage === 'de') {
      return 'Codes sind geheim. Ich kann erklären, wo man einen Code eingibt, aber ich verrate, rate oder schlage keinen Aktivierungscode vor.';
    }
    return 'Kody są tajne. Mogę powiedzieć, gdzie je wpisać, ale nie zdradzam, nie zgaduję i nie podpowiadam żadnych kodów aktywacyjnych.';
  }

  if (asksAchievements && leaksHiddenAchievementHint) {
    if (normalizedLanguage === 'en') {
      return 'Achievements are meant to be a surprise. I can say that unlocked achievements appear in the Achievements tab, but I will not reveal locked achievements or how to unlock them.';
    }
    if (normalizedLanguage === 'de') {
      return 'Erfolge sollen eine Überraschung bleiben. Ich kann sagen, dass freigeschaltete Erfolge im Tab Erfolge erscheinen, aber ich verrate keine gesperrten Erfolge und nicht, wie man sie freischaltet.';
    }
    return 'Osiągnięcia mają być niespodzianką. Mogę powiedzieć, że odblokowane pojawiają się w zakładce Osiągnięcia, ale nie zdradzam ukrytych osiągnięć ani sposobu ich zdobycia.';
  }

  return answer;
}

async function getCzesterLocalAiAnswer({ message, language, topic, supportFinding, deterministicAnswer, memory, styleProfile }) {
  const model = await getCzesterOllamaModel();
  if (!model) {
    return '';
  }

  const docs = getCzesterKnowledgeBase(message, language, topic, supportFinding, deterministicAnswer, memory, styleProfile);
  const prompt = buildCzesterLocalAiPrompt(message, language, docs);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CZESTER_OLLAMA_TIMEOUT_MS);
  try {
    const response = await fetch(`${CZESTER_OLLAMA_URL}/api/generate`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'content-type': 'application/json',
        accept: 'application/json'
      },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        options: {
          temperature: 0.35,
          top_p: 0.9,
          num_predict: 420
        }
      })
    });
    if (!response.ok) {
      return '';
    }
    const data = await response.json();
    const answer = cleanCzesterLocalAiAnswer(data && data.response);
    return answer.length >= 12 ? answer : '';
  } catch {
    return '';
  } finally {
    clearTimeout(timeout);
  }
}

async function getTikTokSupportStatus(language) {
  const now = Date.now();
  if (czesterSupportCache && now - czesterSupportCache.fetchedAt < CZESTER_SUPPORT_CACHE_TTL_MS) {
    return czesterSupportCache;
  }

  const normalizedLanguage = normalizeCzesterLanguage(language);
  const meta = CZESTER_LANGUAGE_META[normalizedLanguage] || CZESTER_LANGUAGE_META.pl;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(CZESTER_SUPPORT_URL, {
      signal: controller.signal,
      headers: {
        'user-agent': `CzatboxTT/${APP_VERSION}`,
        accept: 'text/html,application/xhtml+xml',
        'accept-language': meta.locale
      }
    });
    const html = response.ok ? await response.text() : '';
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    czesterSupportCache = {
      fetchedAt: now,
      ok: response.ok,
      status: response.status,
      title: stripHtml(titleMatch && titleMatch[1]) || meta.fallbackTitle,
      url: CZESTER_SUPPORT_URL
    };
  } catch (error) {
    czesterSupportCache = {
      fetchedAt: now,
      ok: false,
      status: 0,
      title: meta.fallbackTitle,
      url: CZESTER_SUPPORT_URL,
      error: error && error.message ? error.message : 'support-fetch-failed'
    };
  } finally {
    clearTimeout(timeout);
  }

  return czesterSupportCache;
}

function formatCzesterAnswer(message, language, topic, supportStatus, archiveProfile, memory, supportFinding = null) {
  const normalizedLanguage = normalizeCzesterLanguage(language);
  const meta = CZESTER_LANGUAGE_META[normalizedLanguage] || CZESTER_LANGUAGE_META.pl;
  const normalizedMessage = normalizeCzesterQuery(message);

  if (!String(message || '').trim()) {
    return meta.noMessage;
  }

  const smallTalkIntent = getCzesterSmallTalkIntent(message);
  if (smallTalkIntent === 'greeting' && !topic) {
    return meta.greeting;
  }
  if (smallTalkIntent === 'thanks' && !topic) {
    return meta.thanks;
  }

  if (!topic) {
    return formatCzesterFreeTalk(message, normalizedLanguage, archiveProfile, memory, smallTalkIntent);
  }

  if (topic.id === 'gifts-coins' && /\b(doladowalem|doladowalam|doladowanie|doladowac|kupilem|kupilam|zaplacilem|zaplacilam|monet|monetek|coins|recharge|top up|payment)\b/.test(normalizedMessage)) {
    if (normalizedLanguage === 'en') {
      return [
        'This is a coins/payment issue, not an account recovery issue.',
        'First check whether the payment was actually charged in Google Play, App Store, your bank or card history.',
        'Then open TikTok balance/coins purchase history and look for that exact transaction.',
        'If money was charged and coins did not appear, report the transaction with date, amount, payment method and a screenshot of the confirmation.'
      ].join('\n');
    }
    if (normalizedLanguage === 'de') {
      return [
        'Das ist ein Münzen-/Zahlungsthema, nicht Kontowiederherstellung.',
        'Prüfe zuerst, ob die Zahlung wirklich bei Google Play, im App Store, bei der Bank oder in der Kartenhistorie abgebucht wurde.',
        'Öffne danach in TikTok Guthaben/Münzen und suche diese konkrete Transaktion in der Kaufhistorie.',
        'Wenn Geld abgebucht wurde und die Münzen nicht angekommen sind, melde die Transaktion mit Datum, Betrag, Zahlungsart und Screenshot der Bestätigung.'
      ].join('\n');
    }
    return [
      'To jest problem z monetami albo płatnością, nie z odzyskiwaniem konta.',
      'Najpierw sprawdź, czy płatność faktycznie zeszła z Google Play, App Store, banku albo karty.',
      'Potem wejdź w TikToku w saldo/monety i historię zakupu, żeby znaleźć dokładnie tę transakcję.',
      'Jeżeli pieniądze pobrało, a monety nie doszły, zgłoś transakcję z datą, kwotą, metodą płatności i screenem potwierdzenia.'
    ].join('\n');
  }

  const title = topic.title[normalizedLanguage] || topic.title.pl;
  const steps = topic.steps[normalizedLanguage] || topic.steps.pl;
  const supportHint = supportFinding && supportFinding.snippet
    ? supportFinding.snippet.replace(/\s+/g, ' ').trim()
    : '';
  const supportHintPrefix = normalizedLanguage === 'en'
    ? 'The closest TikTok help note says:'
    : normalizedLanguage === 'de'
      ? 'Der nächste TikTok-Hinweis sagt:'
      : 'Z pomocy TikToka najbliżej pasuje:';
  return [
    `${meta.intro} ${title}.`,
    supportHint && supportHint.length > 20 ? `${supportHintPrefix} ${supportHint}` : '',
    ...steps.slice(0, 3).map((step, index) => {
      if (normalizedLanguage === 'pl') {
        return index === 0 ? `Najpierw: ${step}` : index === 1 ? `Potem: ${step}` : `Na końcu: ${step}`;
      }
      if (normalizedLanguage === 'de') {
        return index === 0 ? `Zuerst: ${step}` : index === 1 ? `Dann: ${step}` : `Am Ende: ${step}`;
      }
      return index === 0 ? `First: ${step}` : index === 1 ? `Then: ${step}` : `Finally: ${step}`;
    })
  ].filter(Boolean).join('\n');
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
  setTimeout(() => {
    try {
      getCzesterStyleProfile();
    } catch {}
  }, 2000);
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

async function parkLoginView() {
  if (!loginView || loginView.webContents.isDestroyed() || loginViewParked) {
    return;
  }

  loginViewParked = true;
  loginView.setVisible(false);
  loginView.webContents.setAudioMuted(true);
  await loginView.webContents.loadURL('about:blank').catch(() => {});
}

async function ensureLoginViewLoaded() {
  if (!loginView || loginView.webContents.isDestroyed()) {
    return;
  }

  loginViewParked = false;
  loginView.webContents.setAudioMuted(true);
  await loginView.webContents.loadURL(LOGIN_URL).catch(() => {});
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
  await parkLoginView();
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
  await ensureLoginViewLoaded();
  layoutViews();
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
        sendCzesterOnlySuperFanJoin(data);
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
      markCurrentCreatorRoomAlias(connectionState.roomId);
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
    markCurrentCreatorRoomAlias(connectedState.roomId);
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
      boxEnvelopeId: getBoxEnvelopeId(data),
      boxSource: 'gift',
      boxGiftName: giftName,
      boxCoinCount: giftCost * repeatCount,
      boxPeopleCount: audienceCount,
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
    boxEnvelopeId: getBoxEnvelopeId(data),
    boxSource: 'envelope',
    boxCoinCount: coinCount,
    boxPeopleCount: peopleCount,
    giftCost: coinCount,
    audienceCount: peopleCount
  });
}

function getBoxEnvelopeId(data) {
  const info = data && data.envelopeInfo && typeof data.envelopeInfo === 'object' ? data.envelopeInfo : {};
  return normalizeMessageText(
    info.envelopeId
    || info.envelope_id
    || info.id
    || info.boxId
    || info.box_id
    || (data && data.envelopeId)
    || (data && data.envelope_id)
    || (data && data.boxId)
    || (data && data.box_id)
    || ''
  );
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
  const isModerator = isModeratorEvent(data);
  const isSuperFan = isSuperFanEvent(data, user);
  if (isSuperFan) {
    markSuperFanUser(data);
    markSuperFanUser(user);
  }

  return {
    id: getMessageId(data),
    time: new Date().toISOString(),
    kind,
    authorName: user.nickname,
    uniqueId: user.uniqueId,
    isModerator,
    isSuperFan,
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

function normalizeCreatorComparableName(value) {
  return normalizeMessageText(value)
    .replace(/^@+/, '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '');
}

function getCurrentCreatorComparableNames(creator = getCurrentCreator()) {
  return [...new Set([
    creator && creator.id,
    creator && creator.username,
    creator && creator.label,
    getCreatorDisplayName(creator)
  ].map(normalizeCreatorComparableName).filter(Boolean))];
}

function isCurrentCreatorIdentity(value, creator = getCurrentCreator()) {
  const actual = normalizeCreatorComparableName(value);
  return Boolean(actual && getCurrentCreatorComparableNames(creator).includes(actual));
}

function isCurrentCreatorHandle(displayId) {
  const expected = normalizeMessageText(getCurrentCreator() && getCurrentCreator().username)
    .replace(/^@/, '')
    .toLowerCase();
  const actual = normalizeMessageText(displayId).replace(/^@/, '').toLowerCase();
  return Boolean((expected && actual && expected === actual) || isCurrentCreatorIdentity(displayId));
}

function isCurrentCreatorAlias(value) {
  const id = normalizeBattleId(value);
  return Boolean(id && (id === currentCreatorLiveUserId || currentCreatorLiveAliases.has(id)));
}

function markCurrentCreatorAliases(value = {}, fallbackId = '') {
  getRawUserAliases(value, fallbackId).forEach((id) => currentCreatorLiveAliases.add(id));
}

function markCurrentCreatorRoomAlias(roomId) {
  const id = normalizeBattleId(roomId);
  if (id) {
    currentCreatorLiveAliases.add(id);
    const mappedSideId = battleSideByUser.get(id);
    const matchingSide = battleState.sides.find((side) => {
      if (side.id === id || side.id === mappedSideId) {
        return true;
      }
      const host = battleHostDirectory.get(side.id);
      return Boolean(host && Array.isArray(host.aliases) && host.aliases.includes(id));
    });
    if (matchingSide) {
      battleState.creatorSideId = matchingSide.id;
      if (battleState.active) {
        reconcileBattlePeople();
        maybeSendBattleScoreAlert(true);
      }
    }
  }
}

function markCurrentCreatorRoomAliasFromEvent(data) {
  const common = data && data.common && typeof data.common === 'object' ? data.common : {};
  [
    common.roomId,
    common.roomIdStr,
    common.room_id,
    data && data.roomId,
    data && data.roomIdStr,
    data && data.room_id,
    data && data.currentRoomId,
    data && data.currentRoomIdStr
  ].forEach(markCurrentCreatorRoomAlias);
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
    || isCurrentCreatorIdentity(nickname)
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
    value && value.uniqueId,
    value && value.displayId,
    value && value.unique_id,
    value && value.display_id,
    value && value.userId,
    value && value.userIdStr,
    value && value.id,
    value && value.idStr,
    value && value.nickname,
    value && value.nickName,
    value && value.name,
    user && user.uniqueId,
    user && user.displayId,
    user && user.unique_id,
    user && user.display_id,
    user && user.userId,
    user && user.userIdStr,
    user && user.id,
    user && user.idStr,
    user && user.nickname,
    user && user.nickName,
    user && user.name,
    registered && registered.id,
    registered && registered.displayId,
    registered && registered.nickname,
    ...(registered && Array.isArray(registered.aliases) ? registered.aliases : []),
    ...(user && typeof user === 'object' ? getRawUserAliases(user, user.userId || user.id) : [])
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
    remainingMs: 0,
    timingUpdatedAt: 0,
    showResultBanner: false,
    scorebarAllowed: false,
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
  battleScorebarAwaitingNextStart = false;
  lastBattleScoreAlertKey = '';
  lastBattleScoreAlertAt = 0;
  lastBattleTaskProgressAlertKey = '';
  lastBattleTaskProgressAlertAt = 0;
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

function sendBattleEventAlert(eventType, payload = {}) {
  sendToShell('shell:battle-alert', {
    tone: 'battle-event',
    uppercase: false,
    eventType,
    battleStatus: battleState.status,
    battlePhase: battleState.phase,
    startedAt: battleState.startedAt,
    endsAt: battleState.endsAt,
    endedAt: battleState.endedAt,
    remainingMs: battleState.remainingMs,
    timingUpdatedAt: battleState.timingUpdatedAt,
    ...payload
  });
}

function sendBattleScorebarSnapshot(eventType, extraPayload = {}) {
  const sides = getBattleSidesSnapshot(4);
  if (sides.length < 2) {
    return false;
  }
  sendBattleEventAlert(eventType, {
    ...extraPayload,
    sides
  });
  return true;
}

function getBattleSidesSnapshot(limit = 4) {
  const mapped = [...battleState.sides]
    .filter((side) => side && side.id)
    .map((side) => {
      const isCurrentCreator = (
        side.id === battleState.creatorSideId
        || isCurrentCreatorAlias(side.id)
        || isCurrentCreatorHandle(side.displayId)
        || isCurrentCreatorHandle(side.name)
      );
      return {
        id: side.id,
        name: side.name || side.displayId || getBattleSideFallbackName(side.id),
        displayId: side.displayId || '',
        score: Math.max(0, Number(side.score) || 0),
        isCurrentCreator,
        isCurrentCreatorCertain: isCurrentCreator
      };
    });
  const current = mapped.find((side) => side.isCurrentCreator);
  if (!current) {
    return mapped.slice(0, limit);
  }
  const opponents = mapped
    .filter((side) => side !== current)
    .sort((left, right) => (right.score || 0) - (left.score || 0));
  return [current, ...opponents].slice(0, limit);
}

function maybeSendBattleScoreAlert(force = false) {
  if (!battleState.active || battleState.sides.length < 2) {
    return;
  }
  const sides = getBattleSidesSnapshot(4);
  if (sides.length < 2) {
    return;
  }
  const key = sides.map((side) => `${side.id}:${side.score}`).join('|');
  const now = Date.now();
  if (!force && key === lastBattleScoreAlertKey) {
    return;
  }
  if (!force && now - lastBattleScoreAlertAt < 2500) {
    return;
  }
  lastBattleScoreAlertKey = key;
  lastBattleScoreAlertAt = now;
  sendBattleEventAlert('score', { sides });
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

function getBattleScoreFromValue(value = {}) {
  const entry = value && typeof value === 'object' ? value : {};
  return getLargestBattleNumber(
    entry.score,
    entry.scoreStr,
    entry.score_str,
    entry.totalScore,
    entry.total_score,
    entry.teamTotalScore,
    entry.team_total_score,
    entry.hostScore,
    entry.hostscore,
    entry.host_score,
    entry.hostTotalScore,
    entry.host_total_score,
    entry.diamondScore,
    entry.diamond_score,
    entry.enigmaScore,
    entry.enigma_score,
    entry.points,
    entry.point,
    entry.value,
    entry.battleScore,
    entry.battle_score
  );
}

function normalizeBattleMatchId(value) {
  const id = normalizeBattleId(value);
  return id && id !== '0' ? id : '';
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

function normalizeBattleTimestampMs(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 1000000000) {
    return 0;
  }
  const milliseconds = numeric < 100000000000 ? numeric * 1000 : numeric;
  const date = new Date(milliseconds);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function getBattleEventServerTimeMs(data) {
  const common = data && data.common && typeof data.common === 'object' ? data.common : {};
  const candidates = [
    common.createTimeMs,
    common.createTimestampMs,
    common.timestampMs,
    common.createTime,
    common.createTimestamp,
    common.timestamp,
    data && data.createTimeMs,
    data && data.timestampMs,
    data && data.createTime,
    data && data.timestamp
  ];
  return candidates.map(normalizeBattleTimestampMs).find(Boolean) || 0;
}

function syncBattleCountdownFromEvent(data, endsAt) {
  const endMs = new Date(endsAt || '').getTime();
  if (!Number.isFinite(endMs) || endMs <= 0) {
    battleState.remainingMs = 0;
    battleState.timingUpdatedAt = 0;
    return;
  }
  const eventServerMs = getBattleEventServerTimeMs(data);
  const remainingMs = eventServerMs && endMs > eventServerMs
    ? endMs - eventServerMs
    : endMs - Date.now();
  battleState.remainingMs = Math.max(0, remainingMs);
  battleState.timingUpdatedAt = Date.now();
}

function getBattleRemainingSeconds(data) {
  if (!data || typeof data !== 'object') {
    return 0;
  }
  const direct = getLargestBattleNumber(
    data.secsRemaining,
    data.secondsRemaining,
    data.remainingSeconds,
    data.remainingSec,
    data.remainingTime
  );
  if (direct > 0) {
    return direct;
  }
  const hosts = getBattleHostsFromPayload(data);
  return hosts
    .map((host) => normalizeBattleNumber(host && (
      host.secsRemaining
      || host.secondsRemaining
      || host.remainingSeconds
      || host.remainingSec
      || host.remainingTime
    )))
    .find((value) => value > 0) || 0;
}

function hasBattleRemainingField(data) {
  if (!data || typeof data !== 'object') {
    return false;
  }
  const directKeys = ['secsRemaining', 'secondsRemaining', 'remainingSeconds', 'remainingSec', 'remainingTime'];
  if (directKeys.some((key) => data[key] !== undefined && data[key] !== null && data[key] !== '')) {
    return true;
  }
  return getBattleHostsFromPayload(data).some((host) => host && directKeys.some((key) => (
    host[key] !== undefined && host[key] !== null && host[key] !== ''
  )));
}

function getBattleDurationSeconds(data) {
  const setting = getBattleSetting(data);
  return getLargestBattleNumber(
    data && data.duration,
    data && data.durationSec,
    data && data.battleDuration,
    data && data.battleDurationSec,
    setting.duration,
    setting.durationSec,
    setting.battleDuration,
    setting.battleDurationSec
  );
}

function syncBattleCountdownFromRemainingSeconds(seconds) {
  const remainingSeconds = normalizeBattleNumber(seconds);
  if (remainingSeconds <= 0) {
    return false;
  }
  battleState.remainingMs = remainingSeconds * 1000;
  battleState.timingUpdatedAt = Date.now();
  battleState.endsAt = new Date(Date.now() + battleState.remainingMs).toISOString();
  return true;
}

function getBattleSetting(data) {
  return data && (data.battleSettings || data.battleSetting) || {};
}

function getBattleStatus(data) {
  const setting = getBattleSetting(data);
  return Number(data && data.status || setting.status || data && data.battleStatus || 0);
}

function getBattleId(data) {
  const setting = getBattleSetting(data);
  return normalizeBattleMatchId(data && (data.matchId || data.match_id || data.battleMatchId))
    || normalizeBattleMatchId(setting.matchId || setting.match_id || setting.battleMatchId)
    || normalizeBattleMatchId(data && data.battleId)
    || normalizeBattleMatchId(setting.battleId);
}

function isClosedBattlePhase(phase) {
  return phase === 'finished' || phase === 'cancelled';
}

function shouldTreatBattleEventAsFreshStart(context = {}) {
  if (!context.opensBattle) {
    return false;
  }
  if (context.nextBattleId && context.previousBattleId && context.nextBattleId !== context.previousBattleId) {
    return true;
  }
  if (context.awaitingNextStart && context.hasPositiveCountdown) {
    return true;
  }
  if (context.wasActive && context.previousRemainingMs <= 0 && context.hasPositiveCountdown) {
    return true;
  }
  if (context.wasActive) {
    return false;
  }
  if (context.sawBattleStart) {
    return true;
  }
  if (context.nextStartedAt && context.previousStartedAt && context.nextStartedAt !== context.previousStartedAt) {
    return true;
  }
  if (isClosedBattlePhase(context.previousPhase) && context.hasPositiveCountdown) {
    return true;
  }
  if (isClosedBattlePhase(context.previousPhase) && context.previousEndedAt) {
    const endedMs = new Date(context.previousEndedAt).getTime();
    if (Number.isFinite(endedMs) && Date.now() - endedMs > 8000) {
      return true;
    }
  }
  return false;
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

function getBattleEntrySideId(key, value = {}, fallbackUser = {}) {
  const candidate = normalizeBattleId(
    value.roomId
    || value.roomIdStr
    || value.room_id
    || value.hostRoomId
    || value.hostRoomIdStr
    || value.host_room_id
    || value.anchorId
    || value.anchorIdStr
    || value.anchor_id
    || value.hostUserId
    || value.hostUserIdStr
    || value.host_user_id
    || value.userId
    || value.userIdStr
    || value.user_id
    || fallbackUser.id
    || key
  );
  return candidate;
}

function getBattleHostUserValue(host = {}) {
  const user = host.user && typeof host.user === 'object'
    ? host.user
    : host.anchorInfo && typeof host.anchorInfo === 'object'
      ? host.anchorInfo
      : host.anchor && typeof host.anchor === 'object'
        ? host.anchor
        : {};
  const safeDisplayId = user.displayId || user.uniqueId || user.username || user.userName || host.displayId || host.uniqueId || host.userName || host.username || host.hostUniqueId;
  const safeNickname = user.nickname || user.nickName || user.name || host.nickname || host.nickName || host.name || host.hostNickname || safeDisplayId;
  const value = {
    ...user,
    idStr: user.idStr || user.id || user.userIdStr || user.userId || host.anchorIdStr || host.anchorId || host.hostUserIdStr || host.hostUserId || host.userIdStr || host.userId || host.uid,
    id: user.id || user.idStr || user.userId || user.userIdStr || host.anchorId || host.anchorIdStr || host.hostUserIdStr || host.hostUserId || host.userIdStr || host.userId || host.uid,
    userIdStr: user.userIdStr || user.idStr || user.id || host.anchorIdStr || host.anchorId || host.hostUserIdStr || host.hostUserId || host.userIdStr || host.userId || host.uid,
    userId: user.userId || user.userIdStr || user.id || user.idStr || host.anchorId || host.anchorIdStr || host.hostUserId || host.hostUserIdStr || host.userId || host.userIdStr || host.uid,
    roomId: user.roomId || host.hostRoomId || host.hostRoomIdStr || host.roomId || host.roomIdStr,
    roomIdStr: user.roomIdStr || host.hostRoomIdStr || host.hostRoomId || host.roomIdStr || host.roomId,
    displayId: safeDisplayId,
    uniqueId: user.uniqueId || user.displayId || host.uniqueId || host.displayId || host.userName || host.username || host.hostUniqueId,
    nickname: safeNickname,
    avatarThumb: user.avatarThumb || host.avatarThumb || host.hostAvatarThumb || host.avatar,
    avatar: user.avatar || host.avatar || host.hostAvatar,
    aliases: [
      ...(Array.isArray(user.aliases) ? user.aliases : []),
      host.hostUserIdStr,
      host.hostUserId,
      host.anchorIdStr,
      host.anchorId,
      host.userIdStr,
      host.userId,
      host.uid,
      host.hostRoomIdStr,
      host.hostRoomId,
      host.roomIdStr,
      host.roomId
    ].map(normalizeBattleId).filter(Boolean)
  };
  return value;
}

function getBattleHostSideId(host = {}, fallbackKey = '') {
  return normalizeBattleId(
    host.anchorIdStr
    || host.anchorId
    || host.anchor_id
    || host.hostUserIdStr
    || host.hostUserId
    || host.userIdStr
    || host.userId
    || host.uid
    || host.hostRoomIdStr
    || host.hostRoomId
    || host.roomIdStr
    || host.roomId
    || fallbackKey
  );
}

function getBattleHostsFromPayload(data) {
  if (!data || typeof data !== 'object') {
    return [];
  }
  const candidates = [
    data.hosts,
    data.battleHosts,
    data.teams,
    data.battleItems,
    data.battleArmies && data.battleArmies.hosts,
    data.battleArmies && data.battleArmies.teams,
    data.battleArmies && data.battleArmies.battleItems,
    data.linkMicArmies && data.linkMicArmies.hosts,
    data.linkMicArmies && data.linkMicArmies.teams,
    data.linkMicArmies && data.linkMicArmies.battleItems,
    data.payload && data.payload.hosts
  ];
  return candidates.find(Array.isArray) || [];
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
      if (key === 'score') {
        const previousScore = Math.max(0, Number(side.score) || 0);
        const nextScore = Math.max(0, normalizeBattleNumber(value));
        if (nextScore <= 0 && previousScore > 0) {
          return;
        }
        side.score = Math.max(previousScore, nextScore);
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
  if (
    aliases.some(isCurrentCreatorAlias)
    || isCurrentCreatorHandle(identity.displayId)
    || isCurrentCreatorIdentity(identity.nickname)
  ) {
    aliases.forEach((alias) => currentCreatorLiveAliases.add(alias));
    battleState.creatorSideId = id;
  }
}

function prepareBattleState(data, creator, activate = true) {
  const wasActive = battleState.active;
  markCurrentCreatorRoomAliasFromEvent(data);
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
  const remainingSeconds = getBattleRemainingSeconds(data);
  if (remainingSeconds > 0) {
    endsAt = new Date(Date.now() + remainingSeconds * 1000).toISOString();
  }
  const durationSeconds = getBattleDurationSeconds(data);
  if (!endsAt && startedAt && durationSeconds > 0) {
    endsAt = new Date(new Date(startedAt).getTime() + durationSeconds * 1000).toISOString();
  }
  const canCarryPreviousTiming = battleState.active && !isClosedBattlePhase(battleState.phase) && !startedAt;
  battleState.startedAt = startedAt || (canCarryPreviousTiming ? battleState.startedAt : '');
  battleState.endsAt = endsAt || (canCarryPreviousTiming ? battleState.endsAt : '');
  if (!syncBattleCountdownFromRemainingSeconds(remainingSeconds)) {
    syncBattleCountdownFromEvent(data, battleState.endsAt);
  }

  getKeyedBattleEntries(data && (data.anchorsInfo || data.anchorInfo)).forEach(([key, wrapper]) => {
    const value = wrapper && (wrapper.user || wrapper.value && wrapper.value.user || wrapper.value) || wrapper || {};
    const user = registerBattleUser(value.userId || value.userIdStr || value.user_id || value.id || key, value);
    if (!user) {
      return;
    }
    const sideId = getBattleEntrySideId(key, value, user);
    associateBattleSideWithUser(sideId, user, value);
    if (isCurrentCreatorAlias(sideId) || getRawUserAliases(value, sideId).some(isCurrentCreatorAlias)) {
      battleState.creatorSideId = sideId;
    }
    upsertBattleSide(sideId, {
      name: user.nickname,
      displayId: user.displayId,
      avatar: user.avatar
    });
  });

  const creatorNames = getCurrentCreatorComparableNames(creator);
  if (creatorNames.length) {
    const creatorSide = battleState.sides.find((side) => (
      isCurrentCreatorIdentity(side.displayId, creator)
      || isCurrentCreatorIdentity(side.name, creator)
      || creatorNames.includes(normalizeCreatorComparableName(side.id))
    ));
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

function applyBattleHosts(data) {
  const hosts = getBattleHostsFromPayload(data);
  const sideIdByArmyKey = new Map();
  hosts.forEach((host, index) => {
    host = host || {};
    const sideId = getBattleHostSideId(host, index);
    if (!sideId) {
      return;
    }

    const userValue = getBattleHostUserValue(host);
    const user = registerBattleUser(sideId, userValue) || getBattleUser(sideId);
    associateBattleSideWithUser(sideId, user, userValue);

    const aliases = getRawUserAliases(userValue, sideId);
    if (
      aliases.some(isCurrentCreatorAlias)
      || isCurrentCreatorHandle(userValue.displayId)
      || isCurrentCreatorHandle(userValue.uniqueId)
      || isCurrentCreatorHandle(user && user.displayId)
      || isCurrentCreatorIdentity(userValue.nickname)
      || isCurrentCreatorIdentity(userValue.nickName)
      || isCurrentCreatorIdentity(user && user.nickname)
    ) {
      battleState.creatorSideId = sideId;
    }

    const score = getBattleScoreFromValue(host);
    upsertBattleSide(sideId, {
      name: user && user.nickname,
      displayId: user && user.displayId,
      avatar: user && user.avatar,
      score
    });

    const keys = [
      index,
      host.teamIdx,
      host.teamIndex,
      host.teamId,
      host.rank,
      host.position
    ].map(normalizeBattleId).filter(Boolean);
    keys.forEach((key) => sideIdByArmyKey.set(key, sideId));
  });

  if (hosts.length) {
    reconcileBattlePeople();
  }
  return sideIdByArmyKey;
}

function applyBattleArmies(value, sideIdByArmyKey = new Map()) {
  getKeyedBattleEntries(value).forEach(([key, army]) => {
    army = army || {};
    const sideId = sideIdByArmyKey.get(normalizeBattleId(key))
      || sideIdByArmyKey.get(normalizeBattleId(army.teamIdx))
      || sideIdByArmyKey.get(normalizeBattleId(army.teamIndex))
      || sideIdByArmyKey.get(normalizeBattleId(army.teamId))
      || getBattleEntrySideId(key, army);
    if (!sideId) {
      return;
    }
    battleSideByUser.set(sideId, sideId);
    if (isCurrentCreatorAlias(sideId) || getRawUserAliases(army, sideId).some(isCurrentCreatorAlias)) {
      battleState.creatorSideId = sideId;
    }

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
          score: getBattleScoreFromValue(entry)
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
      score: getLargestBattleNumber(getBattleScoreFromValue(army), contributorScore),
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
          score: getBattleScoreFromValue(entry)
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
        score: getBattleScoreFromValue(member),
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
    if (
      isCurrentCreatorAlias(side.id)
      || isCurrentCreatorHandle(user.displayId)
      || isCurrentCreatorIdentity(user.nickname)
      || isCurrentCreatorIdentity(side.name)
      || isCurrentCreatorIdentity(side.displayId)
    ) {
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
    const sideId = getBattleEntrySideId(key, result);
    const side = upsertBattleSide(sideId, {
      score: getBattleScoreFromValue(result)
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
        score: getBattleScoreFromValue(member)
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
  const sawBattleStart = action === 4;
  const setting = getBattleSetting(data);
  const status = getBattleStatus(data);
  const opensBattle = sawBattleStart || status === 1 || status === 2 || status === 4;
  const wasActive = battleActive || battleState.active;
  const previousPhase = battleState.phase;
  const previousBattleId = battleState.battleId;
  const previousStartedAt = battleState.startedAt;
  const previousEndedAt = battleState.endedAt;
  const previousRemainingMs = Math.max(0, Number(battleState.remainingMs) || 0);
  const nextBattleId = getBattleId(data);
  const nextStartedAt = normalizeBattleTimestamp(setting.startTimeMs || setting.startTime);
  const hasPositiveCountdown = getBattleRemainingSeconds(data) > 0;
  const freshStart = shouldTreatBattleEventAsFreshStart({
    sawBattleStart,
    opensBattle,
    wasActive,
    previousPhase,
    previousBattleId,
    previousStartedAt,
    previousEndedAt,
    previousRemainingMs,
    nextBattleId,
    nextStartedAt,
    hasPositiveCountdown,
    awaitingNextStart: battleScorebarAwaitingNextStart
  });
  const shouldActivateBattle = battleActive || wasActive || freshStart;
  prepareBattleState(data, creator, shouldActivateBattle);
  const hostSideIds = applyBattleHosts(data);
  applyBattleArmies(data && data.armies, hostSideIds);
  applyBattleTeamArmies(data && data.teamArmies);
  applyBattleResults(data && data.battleResult);
  applyBattleTeamResults(data && data.teamBattleResult);
  applyBattleEffectInfos(data, { recordEffects: false });
  if (freshStart) {
    battleScorebarAwaitingNextStart = false;
    battleState.scorebarAllowed = true;
    sendBattleScorebarSnapshot('start');
  } else if (opensBattle && !wasActive) {
    battleState.scorebarAllowed = false;
    sendBattleEventAlert('reset', { sides: [] });
  }

  if (action === 5 || action === 6 || status === 3) {
    finishBattleState(data, action === 6 ? 'cancelled' : 'finished');
    return;
  }

  maybeSendBattleScoreAlert();
  publishBattleState();
}

function handleBattleArmies(data, creator) {
  const status = getBattleStatus(data);
  const hasRemainingField = hasBattleRemainingField(data);
  const remainingSeconds = getBattleRemainingSeconds(data);
  if (status === 2 || (hasRemainingField && remainingSeconds === 0 && (battleActive || battleState.active))) {
    finishBattleState(data, 'finished');
    return;
  }
  const setting = getBattleSetting(data);
  const wasActive = battleActive || battleState.active;
  const previousPhase = battleState.phase;
  const previousBattleId = battleState.battleId;
  const previousStartedAt = battleState.startedAt;
  const previousEndedAt = battleState.endedAt;
  const previousRemainingMs = Math.max(0, Number(battleState.remainingMs) || 0);
  const nextBattleId = getBattleId(data);
  const nextStartedAt = normalizeBattleTimestamp(setting.startTimeMs || setting.startTime);
  const hasPositiveCountdown = remainingSeconds > 0;
  const freshStart = shouldTreatBattleEventAsFreshStart({
    sawBattleStart: false,
    opensBattle: true,
    wasActive,
    previousPhase,
    previousBattleId,
    previousStartedAt,
    previousEndedAt,
    previousRemainingMs,
    nextBattleId,
    nextStartedAt,
    hasPositiveCountdown,
    awaitingNextStart: battleScorebarAwaitingNextStart
  });
  const shouldActivateBattle = wasActive || freshStart;
  prepareBattleState(data, creator, shouldActivateBattle);
  const hostSideIds = applyBattleHosts(data);
  applyBattleArmies(data && (data.armies || data.battleItems), hostSideIds);
  applyBattleTeamArmies(data && data.teamArmies);
  if (freshStart) {
    battleScorebarAwaitingNextStart = false;
    battleState.scorebarAllowed = true;
    sendBattleScorebarSnapshot('start');
  }

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

  maybeSendBattleScoreAlert();
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
        expiresAt: getBattleEffectExpiresAt(effect),
        detail: normalizeMessageText(effect && effect.effectExtra || effect && effect.type || ''),
        sourceKey: `${data.logId || getMessageId(data) || Date.now()}:${index}`
      });
    }
    updateBattleRewards(type, targetIds);
  });
  return recognizedEffect;
}

function getBattleEffectExpiresAt(effect) {
  if (!effect || typeof effect !== 'object') {
    return '';
  }
  const directMs = [
    effect.expireTimeMs,
    effect.expireTimestampMs,
    effect.endTimeMs,
    effect.endTimestampMs,
    effect.expiredAtMs
  ].map(normalizeBattleTimestampMs).find(Boolean);
  if (directMs) {
    return new Date(directMs).toISOString();
  }
  const directIso = [
    effect.expiresAt,
    effect.expireTime,
    effect.expireTimestamp,
    effect.endTime,
    effect.endTimestamp,
    effect.expiredAt
  ].map(normalizeBattleTimestamp).find(Boolean);
  if (directIso) {
    return directIso;
  }
  const duration = getLargestBattleNumber(
    effect.durationMs,
    effect.effectDurationMs,
    effect.expireDurationMs,
    effect.duration,
    effect.effectDuration,
    effect.expireDuration
  );
  if (duration > 0) {
    const durationMs = duration > 1000 ? duration : duration * 1000;
    return new Date(Date.now() + durationMs).toISOString();
  }
  return '';
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
    sendBattleEventAlert('mission-start', {
      target: battleState.task.target,
      rewardMultiple: battleState.task.rewardMultiple,
      detail: battleState.task.detail
    });
  } else if (type === 1 && update) {
    const actor = getBattleUser(update.fromUserId);
    battleState.task.status = 'active';
    battleState.task.progress = normalizeBattleNumber(update.progress);
    battleState.task.actorName = actor.nickname;
    battleState.task.detail = normalizeMessageText(update.promptKey) || battleState.task.detail;
    addBattleTaskContributor(update.fromUserId);
    battleState.phase = 'mission';
    const progressKey = `${battleState.task.progress}:${battleState.task.target}:${actor.id || update.fromUserId || ''}`;
    const now = Date.now();
    if (progressKey !== lastBattleTaskProgressAlertKey || now - lastBattleTaskProgressAlertAt > 8000) {
      lastBattleTaskProgressAlertKey = progressKey;
      lastBattleTaskProgressAlertAt = now;
      sendBattleEventAlert('mission-progress', {
        actorName: actor.nickname,
        progress: battleState.task.progress,
        target: battleState.task.target,
        detail: battleState.task.detail
      });
    }
  } else if (type === 2 && settle) {
    const result = Number(settle.result);
    battleState.task.status = result === 0 || result === 2 ? 'success' : 'failed';
    battleState.phase = battleState.task.status === 'success' ? 'mission-success' : 'battle';
    battleState.task.noticeEndsAt = new Date(Date.now() + BATTLE_TASK_NOTICE_MS).toISOString();
    battleState.phaseEndsAt = battleState.task.noticeEndsAt;
    scheduleBattleTaskReset(battleState.task.noticeEndsAt);
    sendBattleEventAlert(battleState.task.status === 'success' ? 'mission-success' : 'mission-failed', {
      target: battleState.task.target,
      progress: battleState.task.progress,
      rewardMultiple: battleState.task.rewardMultiple,
      contributors: battleState.task.contributors
    });
  } else if (type === 3 && reward) {
    battleState.task.status = Number(reward.status) === 0 ? 'reward' : 'failed';
    battleState.task.detail = readBattlePrompt(reward.prompt) || battleState.task.detail;
    battleState.task.noticeEndsAt = new Date(Date.now() + BATTLE_TASK_NOTICE_MS).toISOString();
    battleState.phase = 'battle';
    battleState.phaseEndsAt = '';
    scheduleBattleTaskReset(battleState.task.noticeEndsAt);
    sendBattleEventAlert(battleState.task.status === 'reward' ? 'mission-reward' : 'mission-failed', {
      detail: battleState.task.detail,
      rewardMultiple: battleState.task.rewardMultiple,
      contributors: battleState.task.contributors
    });
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
    sendBattleEventAlert('booster-card', { effectType: detected });
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
    expiresAt: normalizeBattleTimestamp(options.expiresAt) || new Date(now + (type === 'freeze' ? 30000 : BATTLE_EFFECT_STAGE_MS)).toISOString(),
    detail: normalizeMessageText(options.detail || '')
  };
  battleState.effects = [effect, ...battleState.effects].slice(0, 16);
  setTemporaryBattlePhase('booster');

  if (options.notify !== false && type !== 'effect') {
    sendBattleEffectAlert(effect);
  }
}

function isBattleSideCurrentCreator(sideId) {
  const normalized = normalizeBattleId(sideId);
  if (!normalized || !battleState.creatorSideId || normalized !== battleState.creatorSideId) {
    return false;
  }
  const currentId = normalizeBattleId(currentCreatorLiveUserId);
  const host = battleHostDirectory.get(normalized) || {};
  return Boolean(
    (currentId && normalized === currentId)
    || isCurrentCreatorHandle(host.displayId)
    || isCurrentCreatorIdentity(host.nickname)
  );
}

function isBattleEffectTargetCurrentCreator(targetIds = [], targetSideIds = []) {
  const currentId = normalizeBattleId(currentCreatorLiveUserId);
  const ids = Array.isArray(targetIds) ? targetIds.map(normalizeBattleId).filter(Boolean) : [];
  const sideIds = Array.isArray(targetSideIds) ? targetSideIds.map(normalizeBattleId).filter(Boolean) : [];

  if (currentId && ids.includes(currentId)) {
    return true;
  }

  const targetUsers = ids.map((id) => liveUserDirectory.get(id) || battleHostDirectory.get(id)).filter(Boolean);
  if (targetUsers.some((user) => isCurrentCreatorHandle(user.displayId))) {
    return true;
  }

  if (sideIds.some((sideId) => isBattleSideCurrentCreator(sideId))) {
    return true;
  }

  return false;
}

function sendBattleEffectAlert(effect) {
  const targetSideIds = Array.isArray(effect.targetSideIds) ? effect.targetSideIds : [];
  const targetIds = Array.isArray(effect.targetIds) ? effect.targetIds : [];
  const targetNames = Array.isArray(effect.targetNames) ? effect.targetNames : [];
  const targetIsCurrentCreator = Boolean(
    effect.type === 'freeze'
    && isBattleEffectTargetCurrentCreator(targetIds, targetSideIds)
  );
  sendToShell('shell:battle-alert', {
    tone: 'battle-effect',
    textKey: 'battle.effectAlert',
    uppercase: false,
    effectType: effect.type,
    actorName: effect.actorName,
    targetIds,
    targetNames,
    targetSideIds,
    targetIsCurrentCreator,
    expiresAt: effect.expiresAt,
    multiplier: effect.multiplier
  });
}

function finishBattleState(data, status = 'finished') {
  clearTimeout(battleTaskTimer);
  clearTimeout(battleResultTimer);
  battleTaskTimer = null;
  battleResultTimer = null;
  prepareBattleState(data, getCurrentCreator(), false);
  const hostSideIds = applyBattleHosts(data);
  applyBattleArmies(data && (data.armies || data.battleItems), hostSideIds);
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
  battleScorebarAwaitingNextStart = true;
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
  const finalSides = getBattleSidesSnapshot(4);
  if (finalSides.length >= 2) {
    sendToShell('shell:battle-alert', {
      tone: 'battle-result',
      textKey: status === 'cancelled' ? 'battle.cancelled' : 'battle.finished',
      uppercase: false,
      eventType: status === 'cancelled' ? 'cancelled' : 'finished',
      sides: finalSides,
      winnerSideId: battleState.winnerSideId
    });
  }
  battleState.scorebarAllowed = false;
  battleState.remainingMs = 0;
  battleState.timingUpdatedAt = 0;
  battleState.endsAt = '';
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
  const summary = document && document.summary && typeof document.summary === 'object'
    ? document.summary
    : null;
  return {
    version: Number(document && document.version) || 2,
    session: sessionData,
    messages,
    summary
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
    summary: document.summary || summarizeArchiveMessages(document.messages)
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
  handleShell('shell:get-czester-ai-status', async () => getCzesterAiStatus());
  handleShell('shell:install-czester-ai-pack', async () => installCzesterAiPack());
  handleShell('shell:open-archive-folder', async () => {
    ensureArchiveDir();
    const error = await shell.openPath(ARCHIVE_DIR);
    return error ? { ok: false, error } : { ok: true };
  });
  handleShell('shell:get-system-settings', async () => ({ ok: true, settings: getPublicSystemSettings() }));
  handleShell('shell:set-system-settings', async (patch) => ({ ok: true, settings: updateSystemSettings(patch) }));
  handleShell('shell:set-big-picture', async (enabled) => {
    if (!mainWindow || mainWindow.isDestroyed()) {
      return { ok: false };
    }
    mainWindow.setFullScreen(Boolean(enabled));
    layoutViews();
    return { ok: true, enabled: mainWindow.isFullScreen() };
  });
  handleShell('shell:check-for-updates', async () => {
    if (!configureAutoUpdates()) {
      return { ok: false, error: 'updates-unavailable' };
    }
    try {
      const result = await autoUpdater.checkForUpdates();
      const info = result && result.updateInfo ? result.updateInfo : null;
      if (!info || !isVersionNewer(info.version, APP_VERSION)) {
        publishUpdateState('current', null, 'Program jest aktualny.');
        return { ok: true, status: 'current' };
      }
      latestUpdateInfo = info;
      publishUpdateState('available', info, `Dostępna aktualizacja ${info.version}`);
      return { ok: true, status: 'available', version: info.version };
    } catch (error) {
      publishUpdateState('error', null, getConnectionErrorMessage(error));
      return { ok: false, error: getConnectionErrorMessage(error) };
    }
  });
  handleShell('shell:download-update', async () => startBackgroundUpdateDownload(latestUpdateInfo));
  handleShell('shell:install-update', async () => installDownloadedUpdate());

  handleShell('shell:open-in-browser', async () => {
    await shell.openExternal(getCurrentCreator().liveUrl);
    return { ok: true };
  });

  handleShell('shell:open-external-url', async (url) => {
    const targetUrl = String(url || '').trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      return { ok: false, error: 'invalid-url' };
    }
    await shell.openExternal(targetUrl);
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
let updateInstallInProgress = false;
let updateDownloadReject = null;
let latestUpdateInfo = null;
let downloadedUpdateInfo = null;

function publishUpdateState(status, info = null, message = '', progress = 0) {
  state.update = {
    status,
    version: String(info && info.version ? info.version : ''),
    message: String(message || ''),
    progress: Math.max(0, Math.min(100, Number(progress) || 0))
  };
  publishState();
}

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
  // Ustaw feed jawnie. Dzięki temu electron-updater nie opiera się na
  // konfiguracji z poprzedniego pakietu i zawsze pobiera latest.yml z
  // publicznego release GitHub dla aktualnej aplikacji.
  autoUpdater.setFeedURL({
    provider: 'github',
    owner: 'baksik93',
    repo: 'czatboxtt',
    releaseType: 'release',
    private: false
  });
  autoUpdater.logger = {
    info() {},
    warn() {},
    error() {},
    debug() {}
  };

  autoUpdater.on('update-available', (info) => {
    latestUpdateInfo = info || null;
    downloadedUpdateInfo = null;
    publishUpdateState('available', info, `Dostępna aktualizacja ${info && info.version ? info.version : ''}`.trim());
    setUpdateMessage(`Dostępna aktualizacja ${info && info.version ? info.version : ''}`.trim());
  });

  autoUpdater.on('update-downloaded', async (info) => {
    downloadedUpdateInfo = info || latestUpdateInfo || null;
    latestUpdateInfo = null;
    updateDownloadReject = null;
    setUpdateMessage(`Aktualizacja ${info && info.version ? info.version : ''} pobrana.`.trim());
    updateInstallInProgress = false;
    publishUpdateState('downloaded', info, 'Aktualizacja jest gotowa do instalacji.', 100);
  });

  autoUpdater.on('download-progress', (progress) => {
    publishUpdateState(
      'downloading',
      latestUpdateInfo,
      `Pobieram aktualizację ${latestUpdateInfo && latestUpdateInfo.version ? latestUpdateInfo.version : ''}`.trim(),
      progress && progress.percent
    );
  });

  autoUpdater.on('error', (error) => {
    updateInstallInProgress = false;
    publishUpdateState('error', null, getConnectionErrorMessage(error));
    setUpdateMessage(`Błąd aktualizacji: ${getConnectionErrorMessage(error)}`);
    if (updateDownloadReject) {
      const reject = updateDownloadReject;
      updateDownloadReject = null;
      reject(error);
    }
  });

  return true;
}

async function startBackgroundUpdateDownload(info) {
  if (!info || !info.version || updateInstallInProgress) {
    return { ok: false, error: 'update-unavailable' };
  }
  updateInstallInProgress = true;
  publishUpdateState('downloading', info, `Pobieram aktualizację ${info.version}`, 0);
  try {
    await new Promise((resolve, reject) => {
      updateDownloadReject = reject;
      autoUpdater.downloadUpdate().then(resolve).catch(reject);
    });
    return { ok: true };
  } catch (error) {
    updateInstallInProgress = false;
    updateDownloadReject = null;
    publishUpdateState('error', info, getConnectionErrorMessage(error));
    return { ok: false, error: getConnectionErrorMessage(error) };
  }
}

async function installDownloadedUpdate() {
  if (!downloadedUpdateInfo) {
    return { ok: false, error: 'update-not-downloaded' };
  }
  markUpdateCompleted(downloadedUpdateInfo.version, getUpdateNotes(downloadedUpdateInfo));
  publishUpdateState('installing', downloadedUpdateInfo, 'Instaluję aktualizację.', 100);
  autoUpdater.quitAndInstall(true, true);
  return { ok: true };
}

function setupAutoUpdates() {
  if (!configureAutoUpdates()) {
    return;
  }

  const checkForUpdates = () => {
    if (updateInstallInProgress) {
      return;
    }

    autoUpdater.checkForUpdates().catch(() => {});
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

