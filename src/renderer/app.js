const TTS_SETTINGS_KEY = 'czatbox.tts.settings';
const CHAT_DELAY_SETTINGS_KEY = 'czatbox.chat.delay';
const CHAT_STYLE_SETTINGS_KEY = 'czatbox.chat.style';
const APP_THEME_SETTINGS_KEY = 'czatbox.app.theme';
const APP_APPEARANCE_SETTINGS_KEY = 'czatbox.app.appearance';
const APP_LANGUAGE_SETTINGS_KEY = 'czatbox.app.language';
const TIME_FORMAT_SETTINGS_KEY = 'czatbox.time.format';
const GENERAL_SETTINGS_KEY = 'czatbox.general.settings';
const RECENT_CREATORS_KEY = 'czatbox.recent.creators';
const DEFAULT_CHAT_DELAY_MS = 1800;
const CHAT_DELAY_OPTIONS = [500, 800, 1000, 1500, 1800, 2200, 2800];
const CHAT_STYLES = ['compact', 'spacious', 'testowy'];
const APP_THEMES = ['rose-black', 'white-titanium', 'chill-serwis', 'rose-gold-glass', 'lazarskie-rejony'];
const APP_APPEARANCES = ['standard', 'ozdobny'];
const APP_LANGUAGES = ['pl', 'en', 'de'];
const TIME_FORMATS = ['auto', '12', '24'];
const TOP_GIFTERS_LIMIT = 5;
const MODERATOR_ACTIVE_WINDOW_MS = 5 * 60 * 1000;
const ACTIVE_MODERATORS_LIMIT = 20;
const MAX_RECENT_CREATORS = 10;
const HEART_ME_GIFT_NAME = 'heart me';
const RECOMMENDED_EXCLUDED_CREATOR_IDS = new Set(['milusia313', 'szwagierkaqueen', 'krzysztofzdziars9']);
const UI_ICONS = {
  'chevron-down': '<path d="m7 10 5 5 5-5"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  inbox: '<path d="M5 6.5h14a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 19 18.5H5A1.5 1.5 0 0 1 3.5 17V8A1.5 1.5 0 0 1 5 6.5Z"/><path d="M3.5 14h4l1.5 2h6l1.5-2h4"/>',
  users: '<circle cx="9" cy="9" r="3"/><path d="M3.75 19c.55-3.15 2.3-5 5.25-5s4.7 1.85 5.25 5"/><path d="M15.5 6.75a3 3 0 0 1 0 5.5M15.75 14.25c2.45.3 3.9 1.9 4.4 4.75"/>',
  message: '<path d="M5.5 5.5h13A1.5 1.5 0 0 1 20 7v8a1.5 1.5 0 0 1-1.5 1.5H10L6 19v-2.5h-.5A1.5 1.5 0 0 1 4 15V7a1.5 1.5 0 0 1 1.5-1.5Z"/><path d="M8 9.5h8M8 12.5h5"/>',
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
  snowflake: '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"/><path d="m9.5 5.5 2.5 2 2.5-2M9.5 18.5l2.5-2 2.5 2M5 10.5l3-.5.5-3M19 13.5l-3 .5-.5 3M5 13.5l3 .5.5 3M19 10.5l-3-.5-.5-3"/>',
  zap: '<path d="M13 2.75 5.5 13h6L11 21.25 18.5 11h-6L13 2.75Z"/>',
  sparkle: '<path d="M12 3.5c.6 3.1 2.4 4.9 5.5 5.5-3.1.6-4.9 2.4-5.5 5.5-.6-3.1-2.4-4.9-5.5-5.5 3.1-.6 4.9-2.4 5.5-5.5Z"/><path d="M18.5 14.5c.3 1.6 1.2 2.5 2.8 2.8-1.6.3-2.5 1.2-2.8 2.8-.3-1.6-1.2-2.5-2.8-2.8 1.6-.3 2.5-1.2 2.8-2.8Z"/>',
  coin: '<circle cx="12" cy="12" r="8.25"/><circle cx="12" cy="12" r="4.25"/><path d="M12 9.5v5M10.75 10.25h1.9a1.1 1.1 0 0 1 0 2.2h-1.3a1.1 1.1 0 0 0 0 2.2h1.9"/>',
  folder: '<path d="M3.5 7.5h6l1.7 2H20a1.5 1.5 0 0 1 1.5 1.5v6.5A1.5 1.5 0 0 1 20 19H4a1.5 1.5 0 0 1-1.5-1.5V6A1.5 1.5 0 0 1 4 4.5h5l1.5 2H20"/>',
  refresh: '<path d="M19 8a7.5 7.5 0 1 0 .35 7"/><path d="M19 4.5V8h-3.5"/>',
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
  pinWidgetsToRight: true,
  desktopWidgetsAlwaysOnTop: true
};
const DESKTOP_WIDGET_MODE = new URLSearchParams(window.location.search).get('desktopWidgets') === '1';
const LANGUAGE_LOCALES = {
  pl: 'pl-PL',
  en: 'en-US',
  de: 'de-DE'
};
const MAX_SPEECH_QUEUE = 8;
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
    'nav.recommended': 'Polecani',
    'nav.about': 'O programie',
    'creator.label': 'Twórca',
    'creator.recent': 'Ostatnio wpisany',
    'creator.noMatches': 'Brak pasujących twórców',
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
    'settings.tabs.general': 'Ogólne',
    'settings.tabs.appearance': 'Wygląd',
    'settings.tabs.accessibility': 'Dostępność',
    'settings.tabs.system': 'System',
    'settings.general.note': 'Ogólne ustawienia aplikacji.',
    'settings.general.multiplierNotifications': 'Powiadomienia o mnożnikach',
    'settings.general.statsToolbox': 'Przybornik statystyk',
    'settings.general.pinWidgetsToRight': 'Pokazuj widgety przy prawej krawędzi pulpitu po zminimalizowaniu aplikacji',
    'settings.general.desktopWidgetsAlwaysOnTop': 'Widgety pulpitu zawsze na wierzchu',
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
    'settings.appAppearance.default.name': 'Domyślny',
    'settings.appAppearance.default.description': 'Obecny układ headera, lewego sidebara, okien i buttonów.',
    'settings.appAppearance.decorative.name': 'Ozdobny',
    'settings.appAppearance.decorative.description': 'Elegancki, nowoczesny układ aplikacji.',
    'settings.accessibility.tts': 'Wiadomości TTS:',
    'settings.accessibility.readAloud': 'Czytaj czat na głos',
    'settings.accessibility.skipVulgarNicknames': 'Pomijaj wulgarne nicki',
    'settings.accessibility.skipVulgarMessages': 'Pomijaj wulgarne wiadomości',
    'settings.accessibility.skipSpamMessages': 'Pomijaj spamowe wiadomości (obs za obs, ob, oddam obs itd.)',
    'settings.accessibility.voice': 'Głos',
    'settings.accessibility.systemVoice': 'Systemowy',
    'settings.accessibility.rate': 'Tempo',
    'settings.accessibility.delay': 'Opóźnienie czatu:',
    'settings.system.note': 'Informacje i ustawienia systemowe.',
    'settings.system.autoLaunch': 'Automatycznie otwieraj Czatbox TT po uruchomieniu komputera',
    'settings.system.runInBackground': 'Uruchom program w tle by nie przeszkadzał',
    'settings.system.minimizeToTray': 'Minimalizuj Czatbox TT do zasobnika systemowego po kliknięciu X',
    'settings.system.language': 'Wybierz język aplikacji',
    'settings.system.language.pl': 'Polski',
    'settings.system.language.en': 'Angielski',
    'settings.system.language.de': 'Niemiecki',
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
    'about.tabs.aria': 'Zakładki o programie',
    'about.program.p1': 'Czatbox TT to aplikacja do obsługi czatu z transmisji TikTok LIVE. Program pozwala śledzić wiadomości z wybranego live’a w osobnym, czytelnym oknie. Aplikacja została stworzona z myślą o wygodnym podglądzie czatu, archiwizacji rozmów oraz dodatkowych zdarzeń z live’a.',
    'about.program.p2': 'Program po zalogowaniu do TikToka pobiera czat z wybranego twórcy LIVE i wyświetla go w uporządkowanej formie. Użytkownik może przełączać się między obsługiwanymi twórcami, filtrować typy zdarzeń oraz dostosować wygląd aplikacji do własnych preferencji.',
    'about.program.how': 'Jak działa program:',
    'about.program.how.p1': 'Po uruchomieniu aplikacji użytkownik loguje się do TikToka. Gdy sesja zostanie wykryta, aplikacja przełącza się do widoku czatu i łączy się z wybranym live’em. Czat jest pobierany w tle i wyświetlany w aplikacji jako osobna lista zdarzeń.',
    'about.program.how.p2': 'Wiadomości czatu mogą być pokazywane z ustawionym opóźnieniem, aby łatwiej było je śledzić przy aktywnych transmisjach. Pozostałe zdarzenia, takie jak prezenty, dołączenia czy polubienia, mogą pojawiać się na bieżąco. Użytkownik może w każdej chwili zmienić filtr, styl czatu, motyw lub opóźnienie.',
    'about.program.how.p3': 'Podczas działania programu wszystkie zdarzenia z transmisji są zapisywane do archiwum. Po zakończeniu lub zmianie transmisji archiwum można otworzyć w zakładce Archiwum i wrócić do wcześniejszych rozmów.',
    'about.news.version': 'Wersja programu',
    'about.news.intro': 'Czatbox TT to aplikacja do obsługi czatu z transmisji TikTok LIVE. Program pozwala śledzić wiadomości z wybranego live\'a w osobnym, czytelnym oknie. Aplikacja została stworzona z myślą o wygodnym podglądzie czatu, archiwizacji rozmów oraz dodatkowych zdarzeń z live\'a.',
    'about.news.features.title': 'Główne funkcje:',
    'about.news.features.notes': 'dodany został notatnik do zapisywania bieżących spraw',
    'about.news.features.updates': 'program weryfikuje czy istnieje jego nowsza wersja, następnie pobiera ją i informuje o aktualizacji i restarcie.',
    'about.news.features.enigmaTheme': 'dodany został nowy motyw i jego wariacje w różnych ustawieniach - Enigma-Z',
    'about.news.features.superFans': 'wyróżnienie super fanów na czacie',
    'about.news.features.events': 'wyświetlanie wiadomości z czatu TikTok LIVE, z obsługą filtrów wiadomości, polubień, prezentów, dołączeń, repostów, udostępnień, skrzyneczek i portali',
    'about.news.features.moderators': 'wyróżnianie moderatorów czerwonym nickiem',
    'about.news.features.avatars': 'losowe avatary użytkowników z lokalnej puli grafik programu, by pobierać jak najmniej pakietów i nie spowalniać internetu podczas transmisji',
    'about.news.features.multiplier': 'pasek informacji o mnożniku podczas bitwy',
    'about.news.features.tts': 'czytanie wiadomości na głos przez TTS',
    'about.news.features.archive': 'archiwizowanie czatu całej transmisji do pliku',
    'about.news.features.styles': 'różne style czatu: Kompaktowy, Przestrzenny, Nowoczesny',
    'about.news.features.themes': 'różne motywy kolorystyczne aplikacji',
    'about.news.features.appearances': 'różne wyglądy aplikacji: Domyślny i Ozdobny',
    'about.news.features.delay': 'regulowane opóźnienie wyświetlania wiadomości czatu',
    'about.news.features.stats': 'przybornik statystyk live',
    'about.news.features.widgets': 'przybornik live został zastąpiony widgetami. Od teraz możesz sprawdzić moderację online na czacie, statystyki i top 5 giftujących osób',
    'about.news.features.flexibleWidgets': 'wszystkie widgety są elastyczne tj. możesz je ukryć, pokazać, przypiąć do pulpitu gdy aplikacja jest pomniejszona',
    'about.news.features.archiveCenter': 'poprawione i rozbudowane centrum archiwizacji czatu live, z podziałem na filtry, podsumowaniami ilości zdarzeń, wiadomości na czacie, monetami, moderatorami online podczas sesji',
    'about.news.features.archiveActions': 'archiwum można eksportować do pliku *.txt, kasować, odświeżać.',
    'about.news.features.languages': 'język polski, angielski i niemiecki aplikacji',
    'about.news.fixes.title': 'Poprawki:',
    'about.news.fixes.notes': 'poprawione funkcje notatnika',
    'about.news.fixes.desktopWidgets': 'poprawione działanie widgetów na pulpicie',
    'about.news.fixes.box': 'poprawiony został komunikat o wysłanej skrzyneczce gdy pękała na czacie "unknow wysyła skrzyneczkę"',
    'about.news.fixes.optimization': 'optymalizacja działania programu',
    'about.news.known.title': 'Znane błędy:',
    'about.news.known.box': 'czasem po wysłaniu skrzyneczki gdy pęka pojawia się wiadomość na czacie "unknow wysyła skrzyneczkę"',
    'about.news.known.multiplier': 'mnożnik bitewek to funkcja testowa, i działa na tak zwaną trytytkę, dlatego czasem w ostatniej minucie się buguje i pojawia mimo jego braku',
    'about.news.next.title': 'Co dalej:',
    'about.news.next.archive': 'Poprawki nad odczytem archiwizowanych czatów. Będąc szczerym jestem niezadowolony z obecnej wersji i potrzebuje ona przebudowy.',
    'about.news.next.fixes': 'Poprawki pomniejszych błędów',
    'about.news.next.widgets': 'rozbudowa systemu widgetów',
    'about.news.next.ttsLanguages': 'dodatkowe języki odczytu czatu TTS',
    'about.news.next.superFans': 'wyróżnienie super fanów na czacie',
    'about.news.next.connection': 'optymalizacja połączenia z danym twórcą',
    'about.news.next.giftSounds': 'powiadomienia dźwiękowe dla większych prezentów',
    'about.faq.title': 'FAQ',
    'about.faq.idea.question': 'Skąd pomysł na aplikację?',
    'about.faq.idea.answer': 'Właściwie program powstał po to by nadążyć za czatem gdy szybko leci i wiadomości przeskakują lub się nie pojawiają u jednej osoby, a u drugiej już tak. Dodatkowo chciałem stworzyć narzędzie do tiktok, które nieco ułatwi prowadzenie live. Dla osób streamujących na innych platformach jest dużo wtyczek do programów typu OBS, natomiast tik tok jest dość ubogi. Jest co prawda jedna aplikacja, która czyta wiadomości ale trzeba za nią zapłacić, a ja chciałem dać równą możliwość dla każdego.',
    'about.faq.systems.question': 'Czy powstanie wersja na inne systemy niż Windows?',
    'about.faq.systems.answer': 'Obecnie planuję rozwijać tylko tą wersję. Program powstał pod windowsa, ponieważ używam tego systemu.',
    'about.faq.mobile.question': 'Co z iOS, android itd.?',
    'about.faq.mobile.answer': 'Szczerze? Nie wiem... to bardzo odległy temat, nie posiadam iMac, więc ciężko byłoby mi zbudować coś pod coś, z czym nie mam doczynienia.',
    'about.faq.appearance.question': 'Wygląd programu, czy będą aktualizacje?',
    'about.faq.appearance.answer': 'Myślę, że coś z czasem się pojawi, obecnie mamy trzy opcje modyfikowania wyglądu, z podziałem na kilka sekwencji. Jest to dość sporo i każdy znajdzie coś dla siebie. Pobawcie się i potestujcie, wybierzcie to co wam odpowiada najlepiej.',
    'about.faq.support.question': 'Czy mogę ciebie jakoś wesprzeć finansowo w rozwoju projektu?',
    'about.faq.support.answer': 'Jak mam być szczery kilka osób już proponowało ale... Na chwilę obecną grzebie sobie w tym for fun, wolną chwilą na czilku, jeżeli w grę weszły by pieniążki, czułbym presję robienia wszystkiego na już. Być może pojawi się w przyszłości opcja dobrowolnej dotacji ale... Pożyjemy, zobaczymy.',
    'about.faq.features.question': 'Mam pomysł na nowe funkcje!',
    'about.faq.features.answer': 'I cieszy mnie to niezmiernie! Serdecznie zapraszam do kontaktu na tiktok pw (Baksik.03) lub na discord pw (inavoxy).',
    'about.faq.future.question': 'Czy planuję rozwijać projekt dalej?',
    'about.faq.future.answer': 'Oczywiście, że tak. Wszelkie pomysły będę zapisywać w drugiej zakładce, podobnie jak opisy aktualizacji. Nie mniej jednak chciałem podziękować dla Kamy, bez której nie siadłbym do tego projektu. To jej paplanie do czatu i jego aktywność zmobilizowały mnie do działania. Dziękuję również każdemu za obecne pomysły, zainteresowanie i słowa wsparcia.',
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
    'recommended.title': 'Polecani',
    'recommended.note': 'Twórcy dodani do programu, których możesz szybko wybrać.',
    'recommended.open': 'Wybierz',
    'recommended.empty': 'Brak polecanych twórców do wyświetlenia.',
    'recommended.emptyBio': 'Brak opisu profilu.',
    'topGifters.empty': 'Brak giftów od dołączenia do transmisji.',
    'event.member.join': 'dołączył(a) do LIVE',
    'event.gift': 'wysłał(a) prezent: {giftName}{countText}{costText}',
    'event.box': 'wysyła {boxName}{costText}{audienceText}',
    'event.box.chest': 'skrzynię',
    'event.box.portal': 'portal',
    'event.audience': ' dla (👥 {count})',
    'event.like': 'polubił(a) LIVE (łącznie {total} polubień)',
    'event.repost': '🔁 repostował live',
    'event.share': '↩️ udostępnia live{countText}',
    'battle.multiplier': 'BITWA: ZA CHWILĘ MNOŻNIK X{multiplier}',
    'battle.effectAlert': '{effect}: {name}',
    'battle.finished': 'Bitwa zakończona',
    'battle.cancelled': 'Bitwa została przerwana',
    'battle.authorJoin': 'Budzimy śpiocha, Baksik dołączył do LIVE!'
  },
  en: {
    'app.tagline': 'Track and manage live chat in real time.',
    'nav.chatbox': 'Chatbox',
    'nav.archive': 'Archive',
    'nav.settings': 'Settings',
    'nav.notes': 'Notes',
    'nav.recommended': 'Recommended',
    'nav.about': 'About',
    'creator.label': 'Creator',
    'creator.recent': 'Recently typed',
    'creator.noMatches': 'No matching creators',
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
    'settings.tabs.general': 'General',
    'settings.tabs.appearance': 'Appearance',
    'settings.tabs.accessibility': 'Accessibility',
    'settings.tabs.system': 'System',
    'settings.general.note': 'General application settings.',
    'settings.general.multiplierNotifications': 'Multiplier notifications',
    'settings.general.statsToolbox': 'Statistics toolbox',
    'settings.general.pinWidgetsToRight': 'Show widgets at the right edge of the desktop when the app is minimized',
    'settings.general.desktopWidgetsAlwaysOnTop': 'Keep desktop widgets always on top',
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
    'settings.appAppearance.default.name': 'Default',
    'settings.appAppearance.default.description': 'Current header, sidebar, panel and button layout.',
    'settings.appAppearance.decorative.name': 'Decorative',
    'settings.appAppearance.decorative.description': 'Elegant, modern application layout.',
    'settings.accessibility.tts': 'Message TTS:',
    'settings.accessibility.readAloud': 'Read chat aloud',
    'settings.accessibility.skipVulgarNicknames': 'Skip vulgar nicknames',
    'settings.accessibility.skipVulgarMessages': 'Skip vulgar messages',
    'settings.accessibility.skipSpamMessages': 'Skip spam messages (follow for follow, obs, etc.)',
    'settings.accessibility.voice': 'Voice',
    'settings.accessibility.systemVoice': 'System',
    'settings.accessibility.rate': 'Rate',
    'settings.accessibility.delay': 'Chat delay:',
    'settings.system.note': 'System information and settings.',
    'settings.system.autoLaunch': 'Automatically open Czatbox TT when the computer starts',
    'settings.system.runInBackground': 'Start the program in the background so it does not get in the way',
    'settings.system.minimizeToTray': 'Minimize Czatbox TT to the system tray after clicking X',
    'settings.system.language': 'Choose application language',
    'settings.system.language.pl': 'Polish',
    'settings.system.language.en': 'English',
    'settings.system.language.de': 'German',
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
    'about.tabs.aria': 'About application tabs',
    'about.program.p1': 'Czatbox TT is an application for handling TikTok LIVE chat. It lets you follow messages from a selected live stream in a separate, readable window. The app was created for comfortable chat preview, conversation archiving and extra live events.',
    'about.program.p2': 'After logging in to TikTok, the program reads chat from the selected LIVE creator and displays it in an organized form. You can switch between supported creators, filter event types and adjust the application look to your preferences.',
    'about.program.how': 'How the program works:',
    'about.program.how.p1': 'After launching the application, the user logs in to TikTok. When the session is detected, the app switches to chat view and connects to the selected live stream. Chat is fetched in the background and displayed as a separate event list.',
    'about.program.how.p2': 'Chat messages can be shown with a configured delay, making them easier to follow during active streams. Other events, such as gifts, joins and likes, can appear live. You can change the filter, chat style, theme or delay at any time.',
    'about.program.how.p3': 'While the program is running, all stream events are saved to the archive. After ending or changing a stream, you can open the archive tab and return to earlier conversations.',
    'about.news.version': 'Program version',
    'about.news.intro': 'Czatbox TT is an application for handling TikTok LIVE chat. It lets you follow messages from a selected live stream in a separate, readable window. The app was created for comfortable chat preview, conversation archiving and extra live events.',
    'about.news.features.title': 'Main features:',
    'about.news.features.notes': 'a notes module was added for saving current live matters',
    'about.news.features.updates': 'the program checks whether a newer version exists, then downloads it and informs about the update and restart.',
    'about.news.features.enigmaTheme': 'a new theme and its variants were added in different settings - Enigma-Z',
    'about.news.features.superFans': 'super fans are highlighted in chat',
    'about.news.features.events': 'displaying TikTok LIVE chat messages with filters for messages, likes, gifts, joins, reposts, shares, boxes and portals',
    'about.news.features.moderators': 'highlighting moderators with a red nickname',
    'about.news.features.avatars': 'random user avatars from the local application image pool to reduce network usage during streams',
    'about.news.features.multiplier': 'multiplier information banner during battles',
    'about.news.features.tts': 'reading chat messages aloud using TTS',
    'about.news.features.archive': 'archiving the entire stream chat to a file',
    'about.news.features.styles': 'multiple chat styles: Compact, Spacious and Modern',
    'about.news.features.themes': 'multiple application color themes',
    'about.news.features.appearances': 'multiple application layouts: Default and Decorative',
    'about.news.features.delay': 'adjustable chat message display delay',
    'about.news.features.stats': 'live statistics toolbox',
    'about.news.features.widgets': 'the live toolbox has been replaced with widgets. You can now check online moderation, statistics and the top 5 gifters',
    'about.news.features.flexibleWidgets': 'all widgets are flexible: you can hide them, show them and pin them to the desktop when the app is minimized',
    'about.news.features.archiveCenter': 'improved and expanded live chat archive center with filters and summaries for events, chat messages, coins and moderators online during the session',
    'about.news.features.archiveActions': 'archives can be exported to *.txt, deleted and refreshed.',
    'about.news.features.languages': 'Polish, English and German application languages',
    'about.news.fixes.title': 'Fixes:',
    'about.news.fixes.notes': 'notes module functions were improved',
    'about.news.fixes.desktopWidgets': 'desktop widget behavior was improved',
    'about.news.fixes.box': 'fixed the coin box message that could show "unknow sends a box" when a box opened in chat',
    'about.news.fixes.optimization': 'program performance optimization',
    'about.news.known.title': 'Known issues:',
    'about.news.known.box': 'after a coin box opens, the chat may sometimes show the message "unknow sends a box"',
    'about.news.known.multiplier': 'battle multipliers are an experimental feature and may occasionally appear incorrectly during the final minute',
    'about.news.next.title': 'What comes next:',
    'about.news.next.archive': 'Improvements to archived chat reading. To be honest, I am not satisfied with the current version and it needs to be rebuilt.',
    'about.news.next.fixes': 'Fixes for minor issues',
    'about.news.next.widgets': 'expanding the widget system',
    'about.news.next.ttsLanguages': 'additional TTS chat reading languages',
    'about.news.next.superFans': 'highlighting super fans in chat',
    'about.news.next.connection': 'optimizing the connection to a selected creator',
    'about.news.next.giftSounds': 'sound notifications for larger gifts',
    'about.faq.title': 'FAQ',
    'about.faq.idea.question': 'Where did the idea for the application come from?',
    'about.faq.idea.answer': 'The program was mainly created to keep up with fast chat when messages jump around or appear for one person but not another. I also wanted to make a TikTok tool that makes hosting live streams a little easier. Streamers on other platforms have many plugins for programs such as OBS, while TikTok is fairly limited. There is an application that reads messages aloud, but it is paid, and I wanted everyone to have the same opportunity.',
    'about.faq.systems.question': 'Will there be a version for systems other than Windows?',
    'about.faq.systems.answer': 'For now, I only plan to develop this version. The program was made for Windows because that is the system I use.',
    'about.faq.mobile.question': 'What about iOS, Android and other platforms?',
    'about.faq.mobile.answer': 'Honestly? I do not know. It is a very distant topic. I do not own an iMac, so it would be difficult to build something for a platform I do not work with.',
    'about.faq.appearance.question': 'Will the appearance of the program receive updates?',
    'about.faq.appearance.answer': 'I think more options will appear over time. There are currently three ways to customize the appearance, divided into several choices. That already offers plenty of combinations, so experiment and choose what suits you best.',
    'about.faq.support.question': 'Can I financially support the development of the project?',
    'about.faq.support.answer': 'To be honest, several people have already suggested it, but for now I work on the project for fun in my free time. If money were involved, I would feel pressure to do everything immediately. A voluntary donation option may appear in the future, but time will tell.',
    'about.faq.features.question': 'I have an idea for a new feature!',
    'about.faq.features.answer': 'That makes me very happy! Feel free to contact me through TikTok private messages (Baksik.03) or Discord private messages (inavoxy).',
    'about.faq.future.question': 'Do I plan to continue developing the project?',
    'about.faq.future.answer': 'Of course. I will record ideas in the second tab, together with update descriptions. I would also like to thank Kama, without whom I would not have started this project. Her chatting and the activity of her viewers motivated me to act. Thank you as well to everyone for the ideas, interest and words of support.',
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
    'recommended.title': 'Recommended',
    'recommended.note': 'Creators added to the program that you can quickly choose.',
    'recommended.open': 'Choose',
    'recommended.empty': 'No recommended creators to display.',
    'recommended.emptyBio': 'No profile description.',
    'topGifters.empty': 'No gifts since joining this stream.',
    'event.member.join': 'joined the LIVE',
    'event.gift': 'sent a gift: {giftName}{countText}{costText}',
    'event.box': 'sends {boxName}{costText}{audienceText}',
    'event.box.chest': 'a box',
    'event.box.portal': 'a portal',
    'event.audience': ' for (👥 {count})',
    'event.like': 'liked the LIVE ({total} likes total)',
    'event.repost': '🔁 reposted the live',
    'event.share': '↩️ shares the live{countText}',
    'battle.multiplier': 'BATTLE: MULTIPLIER X{multiplier} SOON',
    'battle.effectAlert': '{effect}: {name}',
    'battle.finished': 'Battle finished',
    'battle.cancelled': 'The battle was cancelled',
    'battle.authorJoin': 'Wake up, sleepyhead, Baksik joined the LIVE!'
  },
  de: {
    'app.tagline': 'Live-Chat in Echtzeit verfolgen und verwalten.',
    'nav.chatbox': 'Chatbox',
    'nav.archive': 'Archiv',
    'nav.settings': 'Einstellungen',
    'nav.notes': 'Notizen',
    'nav.recommended': 'Empfohlen',
    'nav.about': 'Über das Programm',
    'creator.label': 'Creator',
    'creator.recent': 'Zuletzt eingegeben',
    'creator.noMatches': 'Keine passenden Creator',
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
    'settings.tabs.general': 'Allgemein',
    'settings.tabs.appearance': 'Aussehen',
    'settings.tabs.accessibility': 'Barrierefreiheit',
    'settings.tabs.system': 'System',
    'settings.general.note': 'Allgemeine Anwendungseinstellungen.',
    'settings.general.multiplierNotifications': 'Multiplikator-Benachrichtigungen',
    'settings.general.statsToolbox': 'Statistik-Werkzeugleiste',
    'settings.general.pinWidgetsToRight': 'Widgets am rechten Desktoprand anzeigen, wenn die App minimiert ist',
    'settings.general.desktopWidgetsAlwaysOnTop': 'Desktop-Widgets immer im Vordergrund halten',
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
    'settings.appAppearance.default.name': 'Standard',
    'settings.appAppearance.default.description': 'Aktuelles Layout von Header, Sidebar, Fenstern und Buttons.',
    'settings.appAppearance.decorative.name': 'Dekorativ',
    'settings.appAppearance.decorative.description': 'Elegantes, modernes App-Layout.',
    'settings.accessibility.tts': 'Nachrichten-TTS:',
    'settings.accessibility.readAloud': 'Chat laut vorlesen',
    'settings.accessibility.skipVulgarNicknames': 'Vulgäre Nicknames überspringen',
    'settings.accessibility.skipVulgarMessages': 'Vulgäre Nachrichten überspringen',
    'settings.accessibility.skipSpamMessages': 'Spam-Nachrichten überspringen (Follow for Follow usw.)',
    'settings.accessibility.voice': 'Stimme',
    'settings.accessibility.systemVoice': 'System',
    'settings.accessibility.rate': 'Tempo',
    'settings.accessibility.delay': 'Chat-Verzögerung:',
    'settings.system.note': 'Systeminformationen und Einstellungen.',
    'settings.system.autoLaunch': 'Czatbox TT automatisch beim Computerstart öffnen',
    'settings.system.runInBackground': 'Programm im Hintergrund starten, damit es nicht stört',
    'settings.system.minimizeToTray': 'Czatbox TT beim Klick auf X in den Infobereich minimieren',
    'settings.system.language': 'Sprache der Anwendung wählen',
    'settings.system.language.pl': 'Polnisch',
    'settings.system.language.en': 'Englisch',
    'settings.system.language.de': 'Deutsch',
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
    'about.tabs.aria': 'Registerkarten über das Programm',
    'about.program.p1': 'Czatbox TT ist eine Anwendung zur Bedienung des TikTok-LIVE-Chats. Sie zeigt Nachrichten aus einem ausgewählten Live in einem separaten, gut lesbaren Fenster. Die App wurde für eine bequeme Chat-Ansicht, Archivierung und zusätzliche Live-Ereignisse erstellt.',
    'about.program.p2': 'Nach der Anmeldung bei TikTok lädt das Programm den Chat des ausgewählten LIVE-Creators und zeigt ihn geordnet an. Du kannst zwischen unterstützten Creators wechseln, Ereignistypen filtern und das Aussehen anpassen.',
    'about.program.how': 'So funktioniert das Programm:',
    'about.program.how.p1': 'Nach dem Start der Anwendung meldet sich der Benutzer bei TikTok an. Sobald die Sitzung erkannt wird, wechselt die App zur Chatansicht und verbindet sich mit dem ausgewählten Live. Der Chat wird im Hintergrund geladen und als separate Ereignisliste angezeigt.',
    'about.program.how.p2': 'Chatnachrichten können mit einer festgelegten Verzögerung angezeigt werden, damit sie bei aktiven Streams leichter zu verfolgen sind. Andere Ereignisse wie Geschenke, Beitritte oder Likes können live erscheinen. Filter, Chat-Stil, Theme und Verzögerung können jederzeit geändert werden.',
    'about.program.how.p3': 'Während das Programm läuft, werden alle Stream-Ereignisse im Archiv gespeichert. Nach dem Ende oder Wechsel eines Streams kannst du das Archiv öffnen und zu früheren Gesprächen zurückkehren.',
    'about.news.version': 'Programmversion',
    'about.news.intro': 'Czatbox TT ist eine Anwendung zur Bedienung des TikTok-LIVE-Chats. Sie zeigt Nachrichten aus einem ausgewählten Live in einem separaten, gut lesbaren Fenster. Die App wurde für eine bequeme Chat-Ansicht, Archivierung und zusätzliche Live-Ereignisse erstellt.',
    'about.news.features.title': 'Hauptfunktionen:',
    'about.news.features.notes': 'ein Notizmodul zum Speichern laufender Live-Themen wurde hinzugefügt',
    'about.news.features.updates': 'das Programm prüft, ob eine neuere Version verfügbar ist, lädt sie herunter und informiert über Update und Neustart.',
    'about.news.features.enigmaTheme': 'ein neues Theme und seine Varianten wurden in verschiedenen Einstellungen hinzugefügt - Enigma-Z',
    'about.news.features.superFans': 'Superfans werden im Chat hervorgehoben',
    'about.news.features.events': 'Anzeige von TikTok-LIVE-Chatnachrichten mit Filtern für Nachrichten, Likes, Geschenke, Beitritte, Reposts, Teilen, Boxen und Portale',
    'about.news.features.moderators': 'Moderatoren werden mit einem roten Nickname hervorgehoben',
    'about.news.features.avatars': 'zufällige Benutzeravatare aus dem lokalen Bilderpool der App, um während des Streams möglichst wenig Daten zu laden',
    'about.news.features.multiplier': 'Informationsleiste für Multiplikatoren während eines Battles',
    'about.news.features.tts': 'Vorlesen von Chatnachrichten per TTS',
    'about.news.features.archive': 'Archivierung des gesamten Stream-Chats in einer Datei',
    'about.news.features.styles': 'verschiedene Chat-Stile: Kompakt, Geräumig und Modern',
    'about.news.features.themes': 'verschiedene Farbthemen der Anwendung',
    'about.news.features.appearances': 'verschiedene App-Layouts: Standard und Dekorativ',
    'about.news.features.delay': 'einstellbare Verzögerung für Chatnachrichten',
    'about.news.features.stats': 'LIVE-Statistik-Werkzeugleiste',
    'about.news.features.widgets': 'die Live-Werkzeugleiste wurde durch Widgets ersetzt. Ab jetzt kannst du Online-Moderation, Statistiken und die Top 5 Geschenkgeber sehen',
    'about.news.features.flexibleWidgets': 'alle Widgets sind flexibel: du kannst sie ausblenden, anzeigen und bei minimierter App am Desktop anheften',
    'about.news.features.archiveCenter': 'verbessertes und erweitertes Archivzentrum für Live-Chats mit Filtern und Zusammenfassungen zu Ereignissen, Chatnachrichten, Münzen und während der Sitzung aktiven Moderatoren',
    'about.news.features.archiveActions': 'Archive können als *.txt exportiert, gelöscht und aktualisiert werden.',
    'about.news.features.languages': 'Polnisch, Englisch und Deutsch als App-Sprachen',
    'about.news.fixes.title': 'Korrekturen:',
    'about.news.fixes.notes': 'Funktionen des Notizmoduls wurden verbessert',
    'about.news.fixes.desktopWidgets': 'das Verhalten der Desktop-Widgets wurde verbessert',
    'about.news.fixes.box': 'die Nachricht zur Münzbox wurde korrigiert, wenn beim Öffnen im Chat „unknow sendet eine Box“ erscheinen konnte',
    'about.news.fixes.optimization': 'Optimierung der Programmleistung',
    'about.news.known.title': 'Bekannte Fehler:',
    'about.news.known.box': 'nach dem Öffnen einer Münzbox kann gelegentlich die Nachricht „unknow sendet eine Box“ im Chat erscheinen',
    'about.news.known.multiplier': 'Battle-Multiplikatoren sind eine Testfunktion und können in der letzten Minute gelegentlich fälschlich erscheinen',
    'about.news.next.title': 'Wie geht es weiter:',
    'about.news.next.archive': 'Verbesserungen beim Lesen archivierter Chats. Ehrlich gesagt bin ich mit der aktuellen Version nicht zufrieden und sie muss überarbeitet werden.',
    'about.news.next.fixes': 'Behebung kleinerer Fehler',
    'about.news.next.widgets': 'Ausbau des Widget-Systems',
    'about.news.next.ttsLanguages': 'zusätzliche Sprachen für das Vorlesen des Chats per TTS',
    'about.news.next.superFans': 'Hervorhebung von Superfans im Chat',
    'about.news.next.connection': 'Optimierung der Verbindung zu einem ausgewählten Creator',
    'about.news.next.giftSounds': 'Tonbenachrichtigungen für größere Geschenke',
    'about.faq.title': 'FAQ',
    'about.faq.idea.question': 'Wie entstand die Idee für die Anwendung?',
    'about.faq.idea.answer': 'Das Programm entstand hauptsächlich, um bei einem schnellen Chat mithalten zu können, wenn Nachrichten springen oder bei einer Person erscheinen und bei einer anderen nicht. Außerdem wollte ich ein TikTok-Werkzeug entwickeln, das das Durchführen von Live-Streams etwas erleichtert. Für Streamer auf anderen Plattformen gibt es viele Plugins für Programme wie OBS, während TikTok recht eingeschränkt ist. Es gibt zwar eine Anwendung, die Nachrichten vorliest, sie ist jedoch kostenpflichtig. Ich wollte allen die gleichen Möglichkeiten geben.',
    'about.faq.systems.question': 'Wird es eine Version für andere Systeme als Windows geben?',
    'about.faq.systems.answer': 'Derzeit plane ich nur diese Version weiterzuentwickeln. Das Programm wurde für Windows erstellt, weil ich dieses System selbst benutze.',
    'about.faq.mobile.question': 'Was ist mit iOS, Android und anderen Plattformen?',
    'about.faq.mobile.answer': 'Ehrlich gesagt weiß ich es nicht. Das ist ein sehr weit entferntes Thema. Ich besitze keinen iMac, daher wäre es schwierig, etwas für eine Plattform zu entwickeln, mit der ich nicht arbeite.',
    'about.faq.appearance.question': 'Wird das Aussehen des Programms aktualisiert?',
    'about.faq.appearance.answer': 'Mit der Zeit werden wahrscheinlich weitere Optionen erscheinen. Derzeit gibt es drei Möglichkeiten, das Aussehen mit mehreren Auswahlvarianten anzupassen. Das bietet bereits viele Kombinationen. Probiert sie aus und wählt, was euch am besten gefällt.',
    'about.faq.support.question': 'Kann ich die Entwicklung des Projekts finanziell unterstützen?',
    'about.faq.support.answer': 'Ehrlich gesagt haben das bereits mehrere Personen vorgeschlagen. Momentan arbeite ich jedoch in meiner Freizeit und aus Spaß an dem Projekt. Sobald Geld im Spiel wäre, würde ich den Druck spüren, alles sofort erledigen zu müssen. Vielleicht wird es in Zukunft eine freiwillige Spendenmöglichkeit geben, aber das wird sich zeigen.',
    'about.faq.features.question': 'Ich habe eine Idee für eine neue Funktion!',
    'about.faq.features.answer': 'Das freut mich sehr! Kontaktiert mich gerne per TikTok-Privatnachricht (Baksik.03) oder Discord-Privatnachricht (inavoxy).',
    'about.faq.future.question': 'Plane ich, das Projekt weiterzuentwickeln?',
    'about.faq.future.answer': 'Natürlich. Alle Ideen werde ich im zweiten Tab zusammen mit den Beschreibungen der Updates festhalten. Außerdem möchte ich Kama danken, ohne die ich dieses Projekt nicht begonnen hätte. Ihr Reden mit dem Chat und dessen Aktivität haben mich zum Handeln motiviert. Vielen Dank auch an alle für die bisherigen Ideen, das Interesse und die unterstützenden Worte.',
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
    'recommended.title': 'Empfohlen',
    'recommended.note': 'Im Programm hinzugefügte Creator, die du schnell auswählen kannst.',
    'recommended.open': 'Auswählen',
    'recommended.empty': 'Keine empfohlenen Creator zum Anzeigen.',
    'recommended.emptyBio': 'Keine Profilbeschreibung.',
    'topGifters.empty': 'Keine Gifts seit dem Beitritt zum Stream.',
    'event.member.join': 'ist dem LIVE beigetreten',
    'event.gift': 'hat ein Geschenk gesendet: {giftName}{countText}{costText}',
    'event.box': 'sendet {boxName}{costText}{audienceText}',
    'event.box.chest': 'eine Box',
    'event.box.portal': 'ein Portal',
    'event.audience': ' für (👥 {count})',
    'event.like': 'hat den LIVE geliked (insgesamt {total} Likes)',
    'event.repost': '🔁 hat den Live repostet',
    'event.share': '↩️ teilt den Live{countText}',
    'battle.multiplier': 'BATTLE: GLEICH MULTIPLIKATOR X{multiplier}',
    'battle.effectAlert': '{effect}: {name}',
    'battle.finished': 'Battle beendet',
    'battle.cancelled': 'Das Battle wurde abgebrochen',
    'battle.authorJoin': 'Aufwachen, Schlafmütze, Baksik ist dem LIVE beigetreten!'
  }
};

const statusEl = document.getElementById('status');
const statusConnectionEl = document.getElementById('statusConnection');
const statusDelayEl = document.getElementById('statusDelay');
const statusQueueEl = document.getElementById('statusQueue');
const statusViewersEl = document.getElementById('statusViewers');
const topGiftersContent = document.getElementById('topGiftersContent');
const moderatorsWidgetContent = document.getElementById('moderatorsWidgetContent');
const statusMessagesEl = document.getElementById('statusMessages');
const statusMemberHeartsActiveEl = document.getElementById('statusMemberHeartsActive');
const statusMemberHeartsExpiredEl = document.getElementById('statusMemberHeartsExpired');
const statusStatsEl = document.getElementById('statusStats');
const rightWidgets = Array.from(document.querySelectorAll('[data-right-widget]'));
const rightWidgetButtons = Array.from(document.querySelectorAll('[data-widget-target]'));
const creatorInput = document.getElementById('creatorInput');
const creatorToggle = document.getElementById('creatorToggle');
const creatorSuggestions = document.getElementById('creatorSuggestions');
const messagesEl = document.getElementById('messages');
const emptyEl = document.getElementById('empty');
const battleBanner = document.getElementById('battleBanner');
const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
const sidebarButtons = Array.from(document.querySelectorAll('[data-section]'));
const viewPanels = Array.from(document.querySelectorAll('[data-view]'));
const settingsTabs = Array.from(document.querySelectorAll('[data-settings-tab]'));
const settingsPanels = Array.from(document.querySelectorAll('[data-settings-panel]'));
const aboutTabs = Array.from(document.querySelectorAll('[data-about-tab]'));
const aboutPanels = Array.from(document.querySelectorAll('[data-about-panel]'));
const chatStyleInputs = Array.from(document.querySelectorAll('input[name="chatStyle"]'));
const themeInputs = Array.from(document.querySelectorAll('input[name="appTheme"]'));
const appAppearanceInputs = Array.from(document.querySelectorAll('input[name="appAppearance"]'));
const multiplierNotificationsEl = document.getElementById('multiplierNotifications');
const statsToolboxEl = document.getElementById('statsToolbox');
const pinWidgetsToRightEl = document.getElementById('pinWidgetsToRight');
const desktopWidgetsAlwaysOnTopEl = document.getElementById('desktopWidgetsAlwaysOnTop');
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
const newNoteButton = document.getElementById('newNoteButton');
const editNoteButton = document.getElementById('editNoteButton');
const saveNoteButton = document.getElementById('saveNoteButton');
const deleteNoteButton = document.getElementById('deleteNoteButton');
const notesSearchEl = document.getElementById('notesSearch');
const notesListEl = document.getElementById('notesList');
const noteTitleInput = document.getElementById('noteTitleInput');
const noteContentInput = document.getElementById('noteContentInput');
const notePreviewEl = document.getElementById('notePreview');
const noteMetaEl = document.getElementById('noteMeta');
const noteFormatButtons = Array.from(document.querySelectorAll('[data-note-format]'));
const recommendedListEl = document.getElementById('recommendedList');
const appVersionEl = document.getElementById('appVersion');
const ttsEnabledEl = document.getElementById('ttsEnabled');
const ttsSkipVulgarNicknamesEl = document.getElementById('ttsSkipVulgarNicknames');
const ttsSkipVulgarMessagesEl = document.getElementById('ttsSkipVulgarMessages');
const ttsSkipSpamMessagesEl = document.getElementById('ttsSkipSpamMessages');
const ttsVoiceEl = document.getElementById('ttsVoice');
const ttsRateEl = document.getElementById('ttsRate');
const ttsRateValueEl = document.getElementById('ttsRateValue');
const chatDelayEl = document.getElementById('chatDelay');
const chatDelayValueEl = document.getElementById('chatDelayValue');
const systemAutoLaunchEl = document.getElementById('systemAutoLaunch');
const systemRunInBackgroundEl = document.getElementById('systemRunInBackground');
const systemMinimizeToTrayEl = document.getElementById('systemMinimizeToTray');
const appLanguageEl = document.getElementById('appLanguage');
const timeFormatEl = document.getElementById('timeFormat');
const clearTikTokSessionButton = document.getElementById('clearTikTokSession');

const queue = [];
const visibleMessages = [];
const userAvatars = new Map();
const renderedMessageElements = new Map();
const queuedMessagesById = new Map();
const visibleMessagesById = new Map();
const giftTotalsByUser = new Map();
const activeChatUsers = new Map();
const activeModerators = new Map();
const speechQueue = [];
const activeFilters = new Set(['chat', 'like', 'gift', 'box', 'repost', 'share', 'member']);
const activeArchiveFilters = new Set(['chat', 'like', 'gift', 'box', 'repost', 'share', 'member']);
let state = {};
let avatarImages = [];
let speechVoices = [];
let ttsSettings = loadTtsSettings();
let chatDelayMs = loadChatDelayMs();
let chatStyle = loadChatStyle();
let appTheme = loadAppTheme();
let appAppearance = loadAppAppearance();
let generalSettings = loadGeneralSettings();
let systemSettings = loadSystemSettings();
let appLanguage = systemSettings.language;
let timeFormat = systemSettings.timeFormat;
let speechPlaying = false;
let revealTimer;
let revealFallbackTimer;
let syncedCreatorSuggestionsKey = '';
let battleBannerTimer;
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
let renderKeyCounter = 0;
let timeFormatterKey = '';
let timeFormatter = null;
let pendingScrollToEnd = false;
let liveViewerCount = 0;
let desktopWidgetRegionsFrame = 0;
let chatMessageCount = 0;
let recentCreators = loadRecentCreators();
let lastSubmittedCreator = '';
let creatorSuggestionItems = [];
let activeCreatorSuggestionIndex = -1;

if (DESKTOP_WIDGET_MODE) {
  document.documentElement.dataset.desktopWidgets = 'true';
}

function updateDesktopWidgetInteractiveRegions() {
  if (
    !DESKTOP_WIDGET_MODE
    || !window.tiktokLive
    || typeof window.tiktokLive.setDesktopWidgetsInteractiveRegions !== 'function'
  ) {
    return;
  }

  const regions = Array.from(document.querySelectorAll('.right-widget'))
    .filter((widget) => {
      const style = window.getComputedStyle(widget);
      return style.display !== 'none' && style.visibility !== 'hidden';
    })
    .map((widget) => {
      const rect = widget.getBoundingClientRect();
      return {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height
      };
    })
    .filter((region) => region.width > 0 && region.height > 0);

  window.tiktokLive.setDesktopWidgetsInteractiveRegions(regions).catch(() => {});
}

function scheduleDesktopWidgetInteractiveRegions() {
  if (!DESKTOP_WIDGET_MODE) {
    return;
  }

  window.cancelAnimationFrame(desktopWidgetRegionsFrame);
  desktopWidgetRegionsFrame = window.requestAnimationFrame(updateDesktopWidgetInteractiveRegions);
}

function initDesktopWidgetInteractiveRegions() {
  if (!DESKTOP_WIDGET_MODE) {
    return;
  }

  scheduleDesktopWidgetInteractiveRegions();
  window.addEventListener('resize', scheduleDesktopWidgetInteractiveRegions);
}

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

function loadTtsSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(TTS_SETTINGS_KEY) || '{}');
    return {
      enabled: Boolean(saved.enabled),
      voiceURI: typeof saved.voiceURI === 'string' ? saved.voiceURI : '',
      rate: Number(saved.rate) || 1,
      skipVulgarNicknames: Boolean(saved.skipVulgarNicknames),
      skipVulgarMessages: Boolean(saved.skipVulgarMessages),
      skipSpamMessages: Boolean(saved.skipSpamMessages)
    };
  } catch {
    return {
      enabled: false,
      voiceURI: '',
      rate: 1,
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
    multiplierNotifications: next.multiplierNotifications !== false,
    statsToolbox: next.statsToolbox !== false,
    pinWidgetsToRight: next.pinWidgetsToRight !== false,
    desktopWidgetsAlwaysOnTop: next.desktopWidgetsAlwaysOnTop !== false
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
  localStorage.setItem(GENERAL_SETTINGS_KEY, JSON.stringify(generalSettings));
}

function getChatDelayIndex(delayMs) {
  const index = CHAT_DELAY_OPTIONS.indexOf(Number(delayMs));
  return index >= 0 ? index : CHAT_DELAY_OPTIONS.indexOf(DEFAULT_CHAT_DELAY_MS);
}

function loadChatDelayMs() {
  const saved = Number(localStorage.getItem(CHAT_DELAY_SETTINGS_KEY));
  return CHAT_DELAY_OPTIONS[getChatDelayIndex(saved)];
}

function saveChatDelayMs() {
  localStorage.setItem(CHAT_DELAY_SETTINGS_KEY, String(chatDelayMs));
}

function loadChatStyle() {
  const saved = localStorage.getItem(CHAT_STYLE_SETTINGS_KEY);
  return CHAT_STYLES.includes(saved) ? saved : 'compact';
}

function saveChatStyle() {
  localStorage.setItem(CHAT_STYLE_SETTINGS_KEY, chatStyle);
}

function loadAppTheme() {
  const saved = localStorage.getItem(APP_THEME_SETTINGS_KEY);
  return APP_THEMES.includes(saved) ? saved : 'rose-black';
}

function saveAppTheme() {
  localStorage.setItem(APP_THEME_SETTINGS_KEY, appTheme);
}

function loadAppAppearance() {
  const saved = localStorage.getItem(APP_APPEARANCE_SETTINGS_KEY);
  return APP_APPEARANCES.includes(saved) ? saved : 'standard';
}

function saveAppAppearance() {
  localStorage.setItem(APP_APPEARANCE_SETTINGS_KEY, appAppearance);
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

function rememberCreator(value) {
  const handle = normalizeCreatorHandle(value);
  if (!handle) {
    return;
  }

  recentCreators = [
    handle,
    ...recentCreators.filter((item) => item !== handle)
  ].slice(0, MAX_RECENT_CREATORS);
  saveRecentCreators();
  syncCreatorOptions(state.creators);
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
    ['.sidebar-button[data-section="settings"]', 'nav.settings'],
    ['.sidebar-button[data-section="notes"]', 'nav.notes'],
    ['.sidebar-button[data-section="recommended"]', 'nav.recommended'],
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
    ['.view-panel[data-view="recommended"] .page-header h1', 'recommended.title'],
    ['.view-panel[data-view="recommended"] .page-note', 'recommended.note'],
    ['.view-panel[data-view="settings"] .page-header h1', 'settings.title'],
    ['.settings-tab[data-settings-tab="general"]', 'settings.tabs.general'],
    ['.settings-tab[data-settings-tab="appearance"]', 'settings.tabs.appearance'],
    ['.settings-tab[data-settings-tab="accessibility"]', 'settings.tabs.accessibility'],
    ['.settings-tab[data-settings-tab="system"]', 'settings.tabs.system'],
    ['.settings-panel[data-settings-panel="general"] .page-note', 'settings.general.note'],
    ['label[for="multiplierNotifications"] > span', 'settings.general.multiplierNotifications'],
    ['label[for="statsToolbox"] > span', 'settings.general.statsToolbox'],
    ['label[for="pinWidgetsToRight"] > span', 'settings.general.pinWidgetsToRight'],
    ['label[for="desktopWidgetsAlwaysOnTop"] > span', 'settings.general.desktopWidgetsAlwaysOnTop'],
    ['.settings-panel[data-settings-panel="appearance"] > .settings-heading', 'settings.appearance.chatStyle'],
    ['.settings-panel[data-settings-panel="appearance"] .setting-section:nth-of-type(1) .settings-heading', 'settings.appearance.theme'],
    ['.settings-panel[data-settings-panel="appearance"] .setting-section:nth-of-type(2) .settings-heading', 'settings.appearance.appAppearance'],
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
    ['#appAppearanceStandard + span strong', 'settings.appAppearance.default.name'],
    ['#appAppearanceStandard + span small', 'settings.appAppearance.default.description'],
    ['#appAppearanceDecorative + span strong', 'settings.appAppearance.decorative.name'],
    ['#appAppearanceDecorative + span small', 'settings.appAppearance.decorative.description'],
    ['.settings-panel[data-settings-panel="accessibility"] > .settings-heading', 'settings.accessibility.tts'],
    ['label[for="ttsEnabled"] > span', 'settings.accessibility.readAloud'],
    ['label[for="ttsSkipVulgarNicknames"] > span', 'settings.accessibility.skipVulgarNicknames'],
    ['label[for="ttsSkipVulgarMessages"] > span', 'settings.accessibility.skipVulgarMessages'],
    ['label[for="ttsSkipSpamMessages"] > span', 'settings.accessibility.skipSpamMessages'],
    ['label[for="ttsVoice"] > span', 'settings.accessibility.voice'],
    ['label[for="ttsRate"] > span', 'settings.accessibility.rate'],
    ['.chat-delay-section .settings-heading', 'settings.accessibility.delay'],
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
  renderRecommendedCreators();
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
  document.documentElement.dataset.chatStyle = chatStyle;
  document.documentElement.dataset.theme = appTheme;
  document.documentElement.dataset.appAppearance = appAppearance;

  chatStyleInputs.forEach((input) => {
    input.checked = input.value === chatStyle;
  });

  themeInputs.forEach((input) => {
    input.checked = input.value === appTheme;
  });

  appAppearanceInputs.forEach((input) => {
    input.checked = input.value === appAppearance;
  });
}

function initAppearanceSettings() {
  applyAppearanceSettings();

  chatStyleInputs.forEach((input) => {
    input.addEventListener('change', () => {
      if (!input.checked) {
        return;
      }

      chatStyle = CHAT_STYLES.includes(input.value) ? input.value : 'compact';
      saveChatStyle();
      applyAppearanceSettings();
      renderVisibleMessages();
    });
  });

  themeInputs.forEach((input) => {
    input.addEventListener('change', () => {
      if (!input.checked) {
        return;
      }

      appTheme = APP_THEMES.includes(input.value) ? input.value : 'rose-black';
      saveAppTheme();
      applyAppearanceSettings();
    });
  });

  appAppearanceInputs.forEach((input) => {
    input.addEventListener('change', () => {
      if (!input.checked) {
        return;
      }

      appAppearance = APP_APPEARANCES.includes(input.value) ? input.value : 'standard';
      saveAppAppearance();
      applyAppearanceSettings();
    });
  });
}

function applyGeneralSettings() {
  if (multiplierNotificationsEl) {
    multiplierNotificationsEl.checked = generalSettings.multiplierNotifications;
  }

  if (statsToolboxEl) {
    statsToolboxEl.checked = generalSettings.statsToolbox;
  }
  if (pinWidgetsToRightEl) {
    pinWidgetsToRightEl.checked = generalSettings.pinWidgetsToRight;
  }
  if (desktopWidgetsAlwaysOnTopEl) {
    desktopWidgetsAlwaysOnTopEl.checked = generalSettings.desktopWidgetsAlwaysOnTop;
  }
  if (
    !DESKTOP_WIDGET_MODE
    && window.tiktokLive
    && typeof window.tiktokLive.setDesktopWidgetsEnabled === 'function'
  ) {
    window.tiktokLive.setDesktopWidgetsEnabled(generalSettings.pinWidgetsToRight);
  }
  if (
    !DESKTOP_WIDGET_MODE
    && window.tiktokLive
    && typeof window.tiktokLive.setDesktopWidgetsAlwaysOnTop === 'function'
  ) {
    window.tiktokLive.setDesktopWidgetsAlwaysOnTop(generalSettings.desktopWidgetsAlwaysOnTop);
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

  scheduleDesktopWidgetInteractiveRegions();
}

function initGeneralSettings() {
  applyGeneralSettings();

  if (multiplierNotificationsEl) {
    multiplierNotificationsEl.addEventListener('change', () => {
      generalSettings.multiplierNotifications = multiplierNotificationsEl.checked;
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
  if (pinWidgetsToRightEl) {
    pinWidgetsToRightEl.addEventListener('change', () => {
      generalSettings.pinWidgetsToRight = pinWidgetsToRightEl.checked;
      saveGeneralSettings();
      applyGeneralSettings();
    });
  }
  if (desktopWidgetsAlwaysOnTopEl) {
    desktopWidgetsAlwaysOnTopEl.addEventListener('change', () => {
      generalSettings.desktopWidgetsAlwaysOnTop = desktopWidgetsAlwaysOnTopEl.checked;
      saveGeneralSettings();
      applyGeneralSettings();
    });
  }

  rightWidgetButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.widgetTarget || '';
      const widget = rightWidgets.find((item) => item.dataset.rightWidget === target);
      const shouldOpen = Boolean(widget && widget.dataset.expanded !== 'true');
      if (target === 'top' && shouldOpen) {
        renderTopGiftersPanel();
      } else if (target === 'moderators' && shouldOpen) {
        renderModeratorsWidget();
      }
      setOpenRightWidget(shouldOpen ? target : '');
    });
  });
}

function setOpenRightWidget(target) {
  rightWidgets.forEach((widget) => {
    widget.dataset.expanded = String(Boolean(target) && widget.dataset.rightWidget === target);
  });
  if (
    DESKTOP_WIDGET_MODE
    && window.tiktokLive
    && typeof window.tiktokLive.setDesktopWidgetsExpanded === 'function'
  ) {
    window.tiktokLive.setDesktopWidgetsExpanded(Boolean(target));
  }
  syncRightWidgetDock();
  scheduleDesktopWidgetInteractiveRegions();
}

function syncRightWidgetDock() {
  rightWidgetButtons.forEach((button) => {
    const target = button.dataset.widgetTarget || '';
    const widget = rightWidgets.find((item) => item.dataset.rightWidget === target);
    const expanded = Boolean(widget && widget.dataset.expanded === 'true');
    const keyPrefix = target === 'top'
      ? 'topGifters'
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

function stopSpeech() {
  speechQueue.length = 0;
  speechPlaying = false;
  if (canUseSpeech()) {
    window.speechSynthesis.cancel();
  }
}

function getSelectedVoice() {
  return speechVoices.find((voice) => voice.voiceURI === ttsSettings.voiceURI)
    || speechVoices.find((voice) => /^pl\b/i.test(voice.lang))
    || null;
}

function playNextSpeech() {
  if (!canUseSpeech() || speechPlaying || !ttsSettings.enabled || !speechQueue.length) {
    return;
  }

  const utterance = new SpeechSynthesisUtterance(speechQueue.shift());
  const voice = getSelectedVoice();
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = 'pl-PL';
  }

  utterance.rate = clampSpeechRate(ttsSettings.rate);
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

  return value
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

function shouldSkipSpeechMessage(message) {
  if (!message) {
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
  const text = sanitizeSpeechText(message.text);
  if (!text || !/[\p{L}\p{N}]/u.test(text)) {
    return '';
  }

  const author = sanitizeSpeechText(message.authorName);
  return author ? `${author} ${text}` : text;
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

  speechVoices = window.speechSynthesis.getVoices()
    .slice()
    .sort((a, b) => {
      const aPolish = /^pl\b/i.test(a.lang) ? 0 : 1;
      const bPolish = /^pl\b/i.test(b.lang) ? 0 : 1;
      return aPolish - bPolish || a.name.localeCompare(b.name);
    });

  const selected = ttsSettings.voiceURI;
  const options = [
    new Option(t('settings.accessibility.systemVoice'), ''),
    ...speechVoices.map((voice) => new Option(`${voice.name} (${voice.lang})`, voice.voiceURI))
  ];
  ttsVoiceEl.replaceChildren(...options);
  ttsVoiceEl.value = speechVoices.some((voice) => voice.voiceURI === selected) ? selected : '';
}

function syncTtsControls() {
  const supported = canUseSpeech();
  if (ttsEnabledEl) {
    ttsEnabledEl.checked = supported && ttsSettings.enabled;
    ttsEnabledEl.disabled = !supported;
  }
  [
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
    });
  }

  if (ttsRateEl) {
    ttsRateEl.addEventListener('input', () => {
      ttsSettings.rate = clampSpeechRate(ttsRateEl.value);
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

function renderModeratorsWidget() {
  if (!moderatorsWidgetContent) {
    return;
  }

  const moderators = getActiveModerators();
  if (!moderators.length) {
    const empty = document.createElement('div');
    empty.className = 'top-gifters-empty moderators-widget-empty';
    empty.textContent = t('moderatorsWidget.empty');
    moderatorsWidgetContent.replaceChildren(empty);
    return;
  }

  const list = document.createElement('ul');
  list.className = 'top-gifters-list moderators-widget-list';

  moderators.forEach((entry) => {
    const item = document.createElement('li');
    item.className = 'stats-widget-row moderator-widget-row';

    const icon = document.createElement('span');
    icon.className = 'stats-widget-icon moderator-widget-icon';
    icon.appendChild(createUiIcon('shield'));

    const name = document.createElement('span');
    name.className = 'stats-widget-label moderator-widget-name';
    name.textContent = entry.name;

    item.append(icon, name);
    list.appendChild(item);
  });

  moderatorsWidgetContent.replaceChildren(list);
}

function renderBattleBannerFromState() {
  // Multiplier alerts are handled by onBattleAlert.
}

function updateStatus() {
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
    const topWidget = rightWidgets.find((widget) => widget.dataset.rightWidget === 'top');
    if (topWidget && topWidget.dataset.expanded === 'true') {
      renderTopGiftersPanel();
    }
    const moderatorsWidget = rightWidgets.find((widget) => widget.dataset.rightWidget === 'moderators');
    if (moderatorsWidget && moderatorsWidget.dataset.expanded === 'true') {
      renderModeratorsWidget();
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

function getRecommendedCreators() {
  const creators = Array.isArray(state.creators) ? state.creators : [];
  return creators.filter((creator) => (
    creator
    && creator.id
    && !RECOMMENDED_EXCLUDED_CREATOR_IDS.has(String(creator.id))
  ));
}

function getCreatorDisplayName(creator) {
  const fallback = `@${creator.username || creator.id}`;
  if (typeof creator.label !== 'string') {
    return fallback;
  }

  return creator.label.replace(/\s*\(@[^)]*\)\s*$/, '').trim() || fallback;
}

function setCreatorSuggestionsExpanded(isExpanded) {
  if (!creatorInput || !creatorSuggestions) {
    return;
  }

  creatorSuggestions.hidden = !isExpanded;
  creatorInput.setAttribute('aria-expanded', String(isExpanded));
  if (creatorToggle) {
    creatorToggle.setAttribute('aria-expanded', String(isExpanded));
  }
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

function getFilteredCreatorSuggestions() {
  const query = getCreatorSuggestionQuery();
  if (!query) {
    return creatorSuggestionItems;
  }

  return creatorSuggestionItems.filter((item) => (
    item.handle.includes(query)
    || item.label.toLowerCase().includes(query)
    || item.detail.toLowerCase().includes(query)
  ));
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
    return;
  }

  const list = Array.isArray(creators) ? creators : [];
  const nextKey = [
    ...list.map((creator) => `${creator.id}:${creator.username || ''}:${creator.label || ''}`),
    ...recentCreators.map((creator) => `recent:${creator}`)
  ].join('|');
  if (nextKey === syncedCreatorSuggestionsKey) {
    return;
  }

  syncedCreatorSuggestionsKey = nextKey;
  const knownByHandle = new Map();
  const items = [];

  list.forEach((creator) => {
    const handle = normalizeCreatorHandle(creator.username || creator.id);
    if (!handle || knownByHandle.has(handle)) {
      return;
    }

    knownByHandle.set(handle, creator);
  });

  const seenHandles = new Set();
  recentCreators.forEach((creator) => {
    const handle = normalizeCreatorHandle(creator);
    if (!handle || seenHandles.has(handle)) {
      return;
    }

    const knownCreator = knownByHandle.get(handle);
    seenHandles.add(handle);
    items.push({
      handle,
      label: knownCreator ? getCreatorDisplayName(knownCreator) : `@${handle}`,
      detail: `${t('creator.recent')} · @${handle}`
    });
  });

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
}

function renderRecommendedCreators() {
  if (!recommendedListEl) {
    return;
  }

  const creators = getRecommendedCreators();
  if (!creators.length) {
    const empty = document.createElement('div');
    empty.className = 'recommended-empty';
    empty.textContent = t('recommended.empty');
    recommendedListEl.replaceChildren(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  creators.forEach((creator) => {
    const button = document.createElement('button');
    button.className = 'recommended-card';
    button.type = 'button';
    button.dataset.creatorId = creator.id;
    button.dataset.active = String(creator.id === state.creatorId);

    if (creator.avatar) {
      const avatar = document.createElement('img');
      avatar.className = 'recommended-avatar';
      avatar.src = creator.avatar;
      avatar.alt = '';
      avatar.decoding = 'async';
      avatar.loading = 'lazy';
      button.appendChild(avatar);
    }

    const content = document.createElement('span');
    content.className = 'recommended-card-content';

    const name = document.createElement('strong');
    name.textContent = getCreatorDisplayName(creator);

    const username = document.createElement('small');
    username.textContent = `@${creator.username || creator.id}`;

    const bio = document.createElement('span');
    bio.className = 'recommended-bio';
    bio.textContent = typeof creator.bio === 'string' && creator.bio.trim()
      ? creator.bio.trim()
      : t('recommended.emptyBio');

    const action = document.createElement('span');
    action.className = 'recommended-action';
    action.textContent = t('recommended.open');

    content.append(name, username, bio);
    button.append(content, action);
    button.addEventListener('click', () => {
      if (state.creatorId !== creator.id) {
        resetMessages();
        if (creatorInput) {
          creatorInput.value = `@${creator.username || creator.id}`;
          creatorInput.dataset.dirty = 'false';
        }
        rememberCreator(creator.username || creator.id);
        window.tiktokLive.setCreator(creator.username || creator.id);
      }
      setActiveSection('chatbox');
    });

    fragment.appendChild(button);
  });

  recommendedListEl.replaceChildren(fragment);
}

function syncAvatarImages(images) {
  const nextImages = Array.isArray(images) ? images.filter((image) => typeof image === 'string' && image) : [];
  if (nextImages.join('|') === avatarImages.join('|')) {
    return;
  }

  avatarImages = nextImages;
  userAvatars.clear();
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
  if (!key || !avatarImages.length) {
    return '';
  }

  if (!userAvatars.has(key)) {
    userAvatars.set(key, pickRandomAvatar());
  }

  return userAvatars.get(key);
}

function resetStreamStats() {
  giftTotalsByUser.clear();
  activeChatUsers.clear();
  activeModerators.clear();
  liveViewerCount = 0;
  chatMessageCount = 0;
  setOpenRightWidget('');
}

function resetMessages() {
  clearTimeout(revealFallbackTimer);
  revealFallbackTimer = null;
  queue.length = 0;
  visibleMessages.length = 0;
  userAvatars.clear();
  queuedMessagesById.clear();
  visibleMessagesById.clear();
  resetStreamStats();
  messagesEl.querySelectorAll('.message').forEach((item) => item.remove());
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

function trackActiveUserStats(message) {
  const key = getStatsUserKey(message);
  if (!key) {
    return;
  }

  const current = activeChatUsers.get(key) || {
    name: message.authorName || message.uniqueId || key,
    hasSentHeartMeGift: false
  };
  current.name = message.authorName || current.name;
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
}

function isMessageVisible(message) {
  return activeFilters.has(message.kind || 'chat');
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
    const shareCount = Number(message.shareCount) || 0;
    return t('event.share', {
      countText: shareCount > 0 ? ` (👥 ${shareCount})` : ''
    });
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
    const avatarSrc = getAvatarForMessage(message);
    const author = document.createElement('span');
    author.className = 'message-author';
    author.textContent = authorName;

    const inlineTime = document.createElement('time');
    inlineTime.className = 'message-inline-time';
    inlineTime.textContent = formatTime(message.timestamp);

    const meta = document.createElement('div');
    meta.className = 'message-meta';
    meta.append(author, inlineTime);

    const body = document.createElement('span');
    body.className = 'message-body';
    body.textContent = getMessageDisplayText(message);

    const text = document.createElement('div');
    text.className = 'message-text';
    text.append(meta, body);

    if (avatarSrc) {
      const avatar = document.createElement('img');
      avatar.className = 'message-avatar';
      avatar.src = avatarSrc;
      avatar.alt = '';
      avatar.decoding = 'async';
      avatar.loading = 'lazy';
      content.append(avatar, text);
    } else {
      content.appendChild(text);
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
  messagesEl.querySelectorAll('.message').forEach((item) => item.remove());
  renderedMessageElements.clear();

  const fragment = document.createDocumentFragment();
  visibleMessages
    .filter(isMessageVisible)
    .forEach((message) => {
      const item = renderMessageElement(message);
      renderedMessageElements.set(getMessageRenderKey(message), item);
      fragment.appendChild(item);
    });

  messagesEl.appendChild(fragment);

  if (scrollToEnd) {
    scrollMessagesToEnd();
  }

  updateStatus();
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
  upsertRenderedMessage(message, scrollToEnd);
  if (isMessageVisible(message)) {
    readMessageAloud(message);
  }
}

function revealNextMessage() {
  clearTimeout(revealFallbackTimer);
  revealFallbackTimer = null;

  if (!queue.length) {
    updateStatus();
    return;
  }

  const message = queue.shift();
  const idKey = getMessageIdKey(message);
  if (idKey) {
    queuedMessagesById.delete(idKey);
  }
  showMessageNow(message, true);
  scheduleRevealFallback();
}

function startRevealTimer() {
  clearInterval(revealTimer);
  const safeDelay = CHAT_DELAY_OPTIONS.includes(Number(chatDelayMs)) ? Number(chatDelayMs) : DEFAULT_CHAT_DELAY_MS;
  chatDelayMs = safeDelay;
  revealTimer = setInterval(revealNextMessage, safeDelay);
}

function scheduleRevealFallback() {
  if (revealFallbackTimer || !queue.length) {
    return;
  }

  const safeDelay = CHAT_DELAY_OPTIONS.includes(Number(chatDelayMs)) ? Number(chatDelayMs) : DEFAULT_CHAT_DELAY_MS;
  revealFallbackTimer = setTimeout(revealNextMessage, safeDelay);
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

  if (handle === lastSubmittedCreator && handle === normalizeCreatorHandle(getCreatorUsernameFromState())) {
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
      rememberCreator(result.creator && result.creator.username ? result.creator.username : handle);
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
  state = nextState;
  if (state.systemSettings) {
    applyIncomingSystemSettings(state.systemSettings);
  }
  syncCreatorOptions(state.creators);
  syncAvatarImages(state.avatarImages);
  syncAppVersion();
  syncCreatorInputValue();
  renderRecommendedCreators();
  if (previousCreatorId && state.creatorId !== previousCreatorId) {
    resetMessages();
  } else if (isOfflineConnectionState(state) && (!wasOffline || queue.length || visibleMessages.length || renderedMessageElements.size)) {
    resetMessages();
  }
  updateStatus();
});

if (creatorInput) {
  creatorInput.dataset.dirty = 'false';

  creatorInput.addEventListener('focus', () => {
    openCreatorSuggestions();
  });

  creatorInput.addEventListener('input', () => {
    creatorInput.dataset.dirty = 'true';
    activeCreatorSuggestionIndex = -1;
    openCreatorSuggestions();
  });

  creatorInput.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (creatorSuggestions && creatorSuggestions.hidden) {
        openCreatorSuggestions();
      }
      setActiveCreatorSuggestion(activeCreatorSuggestionIndex + 1);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (creatorSuggestions && creatorSuggestions.hidden) {
        openCreatorSuggestions();
      }
      const buttons = creatorSuggestions
        ? Array.from(creatorSuggestions.querySelectorAll('.creator-suggestion'))
        : [];
      setActiveCreatorSuggestion(activeCreatorSuggestionIndex < 0 ? buttons.length - 1 : activeCreatorSuggestionIndex - 1);
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      closeCreatorSuggestions();
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const suggestions = getFilteredCreatorSuggestions();
      if (creatorSuggestions && !creatorSuggestions.hidden && activeCreatorSuggestionIndex >= 0 && suggestions[activeCreatorSuggestionIndex]) {
        chooseCreatorSuggestion(suggestions[activeCreatorSuggestionIndex].handle);
        return;
      }

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

      if (creatorToggle && activeElement === creatorToggle) {
        return;
      }

      if (creatorInput.dataset.dirty === 'true') {
        submitCreatorInput();
      }
      closeCreatorSuggestions();
    }, 120);
  });
}

if (creatorToggle) {
  creatorToggle.addEventListener('pointerdown', (event) => {
    event.preventDefault();
  });

  creatorToggle.addEventListener('click', () => {
    if (!creatorSuggestions) {
      return;
    }

    if (creatorSuggestions.hidden) {
      openCreatorSuggestions();
      if (creatorInput) {
        creatorInput.focus();
      }
      return;
    }

    closeCreatorSuggestions();
  });
}

document.addEventListener('pointerdown', (event) => {
  const target = event.target;
  if (!(target instanceof Element) || target.closest('.creator-picker')) {
    return;
  }

  closeCreatorSuggestions();
});

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

function setActiveAboutTab(tab) {
  const nextTab = aboutPanels.some((panel) => panel.dataset.aboutPanel === tab) ? tab : 'program';
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

  archiveListEl.textContent = t('archive.refreshing');
  try {
    const result = await window.tiktokLive.listArchives();
    archiveEntries = result && result.ok && Array.isArray(result.archives) ? result.archives : [];
    renderArchiveList();
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
  const nextSection = viewPanels.some((panel) => panel.dataset.view === section) ? section : 'chatbox';
  activeSection = nextSection;

  sidebarButtons.forEach((button) => {
    button.dataset.active = String(button.dataset.section === activeSection);
  });

  viewPanels.forEach((panel) => {
    panel.hidden = panel.dataset.view !== activeSection;
  });

  if (activeSection === 'archive') {
    refreshArchive();
  }
  if (activeSection === 'notes') {
    refreshNotes();
  }

  if (activeSection !== 'chatbox') {
    stopSpeech();
  }
}

sidebarButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setActiveSection(button.dataset.section);
  });
});

if (refreshArchiveButton) {
  refreshArchiveButton.addEventListener('click', refreshArchive);
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

window.tiktokLive.onChatReset(() => {
  resetMessages();
});

if (typeof window.tiktokLive.onRoomStats === 'function') {
  window.tiktokLive.onRoomStats((stats) => {
    const nextViewerCount = Math.max(0, Number(stats && stats.viewerCount) || 0);
    liveViewerCount = nextViewerCount;
    updateStatus();
  });
}

window.tiktokLive.onBattleAlert((alert) => {
  const isMultiplierAlert = alert && (
    alert.textKey === 'battle.multiplier'
    || alert.tone === 'battle'
  );
  if (!isMultiplierAlert || !generalSettings.multiplierNotifications || !battleBanner) {
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

  if (message.kind === 'member') {
    assignAvatarForJoin(message);
  }

  trackIncomingMessageStats(message);
  if (DESKTOP_WIDGET_MODE) {
    updateStatus();
    return;
  }

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
initDesktopWidgetInteractiveRegions();
initAppearanceSettings();
initGeneralSettings();
initSystemSettings();
applyI18n();
initTextToSpeech();
startRevealTimer();
setInterval(updateStatus, 5000);
setActiveSettingsTab(activeSettingsTab);
setActiveAboutTab(activeAboutTab);
setActiveSection(activeSection);
syncAppVersion();
updateStatus();
