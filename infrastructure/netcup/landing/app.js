const APP_URL = 'https://app.czatboxtt.com/';
const LANGUAGE_STORAGE_KEY = 'ctt-landing-language';
const SUPPORTED_LANGUAGES = new Set(['pl', 'en', 'de', 'hu']);

const translations = {
  pl: {
    meta: { title: 'Czatbox TT — Twój czat LIVE', description: 'Czatbox TT — czat TikTok LIVE, archiwum, filtry i synchronizacja na wszystkich urządzeniach.' },
    nav: { label: 'Główna nawigacja', chat: 'Czat', alerts: 'Alerty', tools: 'Narzędzia', account: 'Konto', download: 'Pobierz', open: 'Otwórz aplikację' }, language: { label: 'Język strony' },
    hero: { eyebrow: 'Czat TikTok LIVE po Twojemu', polishProduct: 'Polski produkt', equalStart: 'Równy start dla każdego', title1: 'Twój LIVE.', title2: 'Pełna kontrola.', lead: 'Czat, role, prezenty i narzędzia twórcy w jednym profesjonalnym centrum dowodzenia — lokalnie na PC lub bez instalacji.', browser: 'Uruchom w przeglądarce', windows: 'Pobierz na Windows', noInstall: 'Lokalnie na PC lub bez instalacji', sync: 'Jedno zsynchronizowane konto', interface: 'Interfejs w Twoim języku' },
    signals: { chat: 'Czat bez opóźnień', roles: 'Czytelne role widzów', account: 'Konto na każdym urządzeniu', tools: 'Narzędzia zawsze pod ręką' },
    chat: { title: 'Rozmowa pozostaje czytelna, nawet gdy LIVE przyspiesza.', lead: 'Najważniejsze wiadomości, role i reakcje od razu wyróżniają się w strumieniu. Mniej szukania, więcej kontaktu z widzami.', item1: 'Filtry wiadomości, subskrybentów i prezentów', item2: 'Osobne wyróżnienia moderatora, superfana i strażnika', item3: 'Przypinanie, moderacja i szybkie akcje bez opuszczania czatu' },
    alerts: { title: 'Ważne zdarzenia pojawiają się dokładnie tam, gdzie patrzysz.', lead: 'Prezenty i wejścia kluczowych osób są pokazywane nad czatem — z własną grafiką, kolorem i priorytetem.', item1: 'Grafiki prezentów i czytelne mnożniki', item2: 'Alerty wejścia moderatora, superfana i strażnika', item3: 'Spójne doświadczenie na desktopie, w przeglądarce i na mobile' },
    tools: { title: 'Wszystko, czego potrzebujesz podczas transmisji.', lead: 'Czatbox TT porządkuje narzędzia twórcy w jednym miejscu, dzięki czemu nie przełączasz się między kolejnymi aplikacjami.', archive: 'Archiwum', notes: 'Notatki', calendar: 'Kalendarz', radio: 'Radio', timer: 'Minutnik', giveaway: 'Giveaway' },
    accountSection: { title: 'Jedno konto. Ten sam Czatbox wszędzie.', lead: 'Twórcy, ustawienia, archiwum i profil podążają za Tobą między programem Windows a wersją przeglądarkową.' },
    auth: { title: 'Witaj w Czatbox TT', subtitle: 'Zaloguj się albo utwórz konto.', loginTab: 'Logowanie', registerTab: 'Rejestracja', email: 'E-mail', password: 'Hasło', name: 'Nazwa konta', login: 'Zaloguj się', register: 'Utwórz konto', forgot: 'Nie pamiętam hasła', passwordHelp: 'Minimum 10 znaków. Potwierdzenie wyślemy e-mailem.', loggingIn: 'Logowanie…', creating: 'Tworzenie konta…', emailRequired: 'Najpierw wpisz adres e-mail.', invalidResponse: 'Serwer zwrócił nieprawidłową odpowiedź.', failed: 'Operacja nie powiodła się.' },
    account: { loggedAs: 'Zalogowano jako', open: 'Przejdź do aplikacji', user: 'Użytkownik' },
    editor: { title: 'Ustawienia konta', subtitle: 'Edytuj profil zapisany na wspólnym koncie.', avatar: 'Awatar konta', avatarHelp: 'JPG, PNG lub WebP, maksymalnie 3 MB.', chooseAvatar: 'Wybierz zdjęcie', removeAvatar: 'Usuń awatar', name: 'Nazwa konta', email: 'E-mail', saveProfile: 'Zapisz profil', passwordTitle: 'Zmiana hasła', currentPassword: 'Obecne hasło', newPassword: 'Nowe hasło', savePassword: 'Zmień hasło', saved: 'Profil został zapisany.', passwordSaved: 'Hasło zostało zmienione.' },
    product: { eyebrow: 'Jedno centrum dowodzenia', title1: 'Widzisz to, co ważne.', title2: 'Bez chaosu.', lead: 'Duży, czytelny panel działa na komputerze, tablecie i telefonie. Ustawienia oraz dane podążają za Twoim kontem.' },
    features: { eyebrow: 'Wszystko razem', title: 'Stworzone dla twórców LIVE', chatTitle: 'Czat bez szumu', chatText: 'Filtry, wyróżnienia ról i czytelne zdarzenia pomagają nadążyć za rozmową.', dataTitle: 'Twoje dane wszędzie', dataText: 'Twórcy, ustawienia, archiwum i profil są przypisane do jednego konta.', choiceTitle: 'Program lub przeglądarka', choiceText: 'Pracuj tak, jak chcesz — na Windows albo bez instalowania.', toolsTitle: 'Narzędzia podczas LIVE', toolsText: 'Notatki, radio, minutnik, Patreon i giveaway są zawsze pod ręką.' },
    cta: { eyebrow: 'GOTOWY NA KOLEJNY LIVE?', title: 'Mniej chaosu. Więcej rozmowy.' }, footer: { text: 'Niezależne narzędzie dla twórców TikTok LIVE.' }
  },
  en: {
    meta: { title: 'Czatbox TT — Your LIVE chat', description: 'Czatbox TT — TikTok LIVE chat, archive, filters and sync across all your devices.' },
    nav: { label: 'Main navigation', chat: 'Chat', alerts: 'Alerts', tools: 'Tools', account: 'Account', download: 'Download', open: 'Open app' }, language: { label: 'Website language' },
    hero: { eyebrow: 'TikTok LIVE chat your way', polishProduct: 'Made in Poland', equalStart: 'A fair start for everyone', title1: 'Your LIVE.', title2: 'Full control.', lead: 'Chat, roles, gifts and creator tools in one professional command centre — on your PC or without installation.', browser: 'Open in browser', windows: 'Download for Windows', noInstall: 'On your PC or without installation', sync: 'One synced account', interface: 'Interface in your language' },
    signals: { chat: 'Low-latency chat', roles: 'Clear viewer roles', account: 'One account on every device', tools: 'Tools always within reach' },
    chat: { title: 'The conversation stays readable, even when LIVE speeds up.', lead: 'Important messages, roles and reactions stand out instantly. Less searching, more connection with your viewers.', item1: 'Message, subscriber and gift filters', item2: 'Distinct moderator, superfan and guardian highlights', item3: 'Pinning, moderation and quick actions without leaving chat' },
    alerts: { title: 'Important events appear exactly where you are looking.', lead: 'Gifts and key-role entrances appear above the chat with their own visual, colour and priority.', item1: 'Gift artwork and clear multipliers', item2: 'Moderator, superfan and guardian entrance alerts', item3: 'A consistent desktop, browser and mobile experience' },
    tools: { title: 'Everything you need during a broadcast.', lead: 'Czatbox TT keeps creator tools in one workspace, so you no longer jump between separate apps.', archive: 'Archive', notes: 'Notes', calendar: 'Calendar', radio: 'Radio', timer: 'Timer', giveaway: 'Giveaway' },
    accountSection: { title: 'One account. The same Czatbox everywhere.', lead: 'Creators, settings, archive and profile follow you between the Windows app and browser version.' },
    auth: { title: 'Welcome to Czatbox TT', subtitle: 'Sign in or create an account.', loginTab: 'Sign in', registerTab: 'Register', email: 'Email', password: 'Password', name: 'Account name', login: 'Sign in', register: 'Create account', forgot: 'Forgot password', passwordHelp: 'At least 10 characters. We will email you a confirmation.', loggingIn: 'Signing in…', creating: 'Creating account…', emailRequired: 'Enter your email address first.', invalidResponse: 'The server returned an invalid response.', failed: 'The operation failed.' },
    account: { loggedAs: 'Signed in as', open: 'Open app', user: 'User' },
    editor: { title: 'Account settings', subtitle: 'Edit the profile stored in your shared account.', avatar: 'Account avatar', avatarHelp: 'JPG, PNG or WebP, up to 3 MB.', chooseAvatar: 'Choose image', removeAvatar: 'Remove avatar', name: 'Account name', email: 'Email', saveProfile: 'Save profile', passwordTitle: 'Change password', currentPassword: 'Current password', newPassword: 'New password', savePassword: 'Change password', saved: 'Profile saved.', passwordSaved: 'Password changed.' },
    product: { eyebrow: 'One command centre', title1: 'See what matters.', title2: 'Without the clutter.', lead: 'The clear, spacious workspace works on desktop, tablet and phone. Your settings and data follow your account.' },
    features: { eyebrow: 'Everything together', title: 'Built for LIVE creators', chatTitle: 'Chat without noise', chatText: 'Filters, role highlights and clear events help you keep up with the conversation.', dataTitle: 'Your data everywhere', dataText: 'Creators, settings, archive and profile belong to one account.', choiceTitle: 'Desktop or browser', choiceText: 'Work your way — on Windows or without installing anything.', toolsTitle: 'Tools during LIVE', toolsText: 'Notes, radio, timer, Patreon and giveaways are always within reach.' },
    cta: { eyebrow: 'READY FOR YOUR NEXT LIVE?', title: 'Less clutter. More conversation.' }, footer: { text: 'An independent tool for TikTok LIVE creators.' }
  },
  de: {
    meta: { title: 'Czatbox TT — Dein LIVE-Chat', description: 'Czatbox TT — TikTok-LIVE-Chat, Archiv, Filter und Synchronisierung auf allen Geräten.' },
    nav: { label: 'Hauptnavigation', chat: 'Chat', alerts: 'Hinweise', tools: 'Werkzeuge', account: 'Konto', download: 'Download', open: 'App öffnen' }, language: { label: 'Seitensprache' },
    hero: { eyebrow: 'TikTok-LIVE-Chat nach deinen Regeln', polishProduct: 'Produkt aus Polen', equalStart: 'Faire Chancen für alle', title1: 'Dein LIVE.', title2: 'Volle Kontrolle.', lead: 'Chat, Rollen, Geschenke und Creator-Werkzeuge in einer professionellen Kommandozentrale — lokal am PC oder ohne Installation.', browser: 'Im Browser starten', windows: 'Für Windows herunterladen', noInstall: 'Lokal am PC oder ohne Installation', sync: 'Ein synchronisiertes Konto', interface: 'Oberfläche in deiner Sprache' },
    signals: { chat: 'Chat ohne Verzögerung', roles: 'Klare Zuschauerrollen', account: 'Ein Konto auf jedem Gerät', tools: 'Werkzeuge immer griffbereit' },
    chat: { title: 'Das Gespräch bleibt lesbar, auch wenn der LIVE-Chat schneller wird.', lead: 'Wichtige Nachrichten, Rollen und Reaktionen fallen sofort auf. Weniger suchen, mehr Kontakt mit deinen Zuschauern.', item1: 'Filter für Nachrichten, Abonnenten und Geschenke', item2: 'Eigene Markierungen für Moderator, Superfan und Wächter', item3: 'Anheften, Moderation und Schnellaktionen direkt im Chat' },
    alerts: { title: 'Wichtige Ereignisse erscheinen genau dort, wo du hinschaust.', lead: 'Geschenke und wichtige Rollen erscheinen über dem Chat — mit eigener Grafik, Farbe und Priorität.', item1: 'Geschenkgrafiken und klare Multiplikatoren', item2: 'Eintrittshinweise für Moderator, Superfan und Wächter', item3: 'Einheitlich auf Desktop, im Browser und auf Mobile' },
    tools: { title: 'Alles, was du während einer Übertragung brauchst.', lead: 'Czatbox TT bündelt Creator-Werkzeuge in einem Arbeitsbereich, damit du nicht ständig zwischen Apps wechselst.', archive: 'Archiv', notes: 'Notizen', calendar: 'Kalender', radio: 'Radio', timer: 'Timer', giveaway: 'Giveaway' },
    accountSection: { title: 'Ein Konto. Derselbe Czatbox überall.', lead: 'Creator, Einstellungen, Archiv und Profil folgen dir zwischen Windows-App und Browserversion.' },
    auth: { title: 'Willkommen bei Czatbox TT', subtitle: 'Melde dich an oder erstelle ein Konto.', loginTab: 'Anmelden', registerTab: 'Registrieren', email: 'E-Mail', password: 'Passwort', name: 'Kontoname', login: 'Anmelden', register: 'Konto erstellen', forgot: 'Passwort vergessen', passwordHelp: 'Mindestens 10 Zeichen. Die Bestätigung senden wir per E-Mail.', loggingIn: 'Anmeldung…', creating: 'Konto wird erstellt…', emailRequired: 'Gib zuerst deine E-Mail-Adresse ein.', invalidResponse: 'Der Server hat eine ungültige Antwort gesendet.', failed: 'Der Vorgang ist fehlgeschlagen.' },
    account: { loggedAs: 'Angemeldet als', open: 'App öffnen', user: 'Benutzer' },
    editor: { title: 'Kontoeinstellungen', subtitle: 'Bearbeite das Profil deines gemeinsamen Kontos.', avatar: 'Kontoavatar', avatarHelp: 'JPG, PNG oder WebP, maximal 3 MB.', chooseAvatar: 'Bild auswählen', removeAvatar: 'Avatar entfernen', name: 'Kontoname', email: 'E-Mail', saveProfile: 'Profil speichern', passwordTitle: 'Passwort ändern', currentPassword: 'Aktuelles Passwort', newPassword: 'Neues Passwort', savePassword: 'Passwort ändern', saved: 'Profil gespeichert.', passwordSaved: 'Passwort geändert.' },
    product: { eyebrow: 'Eine Kommandozentrale', title1: 'Du siehst, was zählt.', title2: 'Ohne Chaos.', lead: 'Die übersichtliche Oberfläche funktioniert auf Computer, Tablet und Smartphone. Einstellungen und Daten folgen deinem Konto.' },
    features: { eyebrow: 'Alles an einem Ort', title: 'Für LIVE-Creator entwickelt', chatTitle: 'Chat ohne Störgeräusche', chatText: 'Filter, Rollenmarkierungen und klare Ereignisse helfen dir, dem Gespräch zu folgen.', dataTitle: 'Deine Daten überall', dataText: 'Creator, Einstellungen, Archiv und Profil gehören zu einem Konto.', choiceTitle: 'Programm oder Browser', choiceText: 'Arbeite, wie du willst — unter Windows oder ohne Installation.', toolsTitle: 'Werkzeuge während des LIVE', toolsText: 'Notizen, Radio, Timer, Patreon und Giveaways sind immer griffbereit.' },
    cta: { eyebrow: 'BEREIT FÜR DEIN NÄCHSTES LIVE?', title: 'Weniger Chaos. Mehr Gespräch.' }, footer: { text: 'Ein unabhängiges Werkzeug für TikTok-LIVE-Creator.' }
  },
  hu: {
    meta: { title: 'Czatbox TT — A te LIVE csevegésed', description: 'Czatbox TT — TikTok LIVE csevegés, archívum, szűrők és szinkronizálás minden eszközön.' },
    nav: { label: 'Fő navigáció', chat: 'Csevegés', alerts: 'Értesítések', tools: 'Eszközök', account: 'Fiók', download: 'Letöltés', open: 'Alkalmazás megnyitása' }, language: { label: 'Webhely nyelve' },
    hero: { eyebrow: 'TikTok LIVE csevegés a te módodon', polishProduct: 'Lengyel termék', equalStart: 'Egyenlő esély mindenkinek', title1: 'A te LIVE-od.', title2: 'Teljes irányítás.', lead: 'Csevegés, szerepek, ajándékok és alkotói eszközök egy professzionális vezérlőközpontban — PC-n vagy telepítés nélkül.', browser: 'Indítás böngészőben', windows: 'Letöltés Windowsra', noInstall: 'Helyben PC-n vagy telepítés nélkül', sync: 'Egy szinkronizált fiók', interface: 'Felület a te nyelveden' },
    signals: { chat: 'Késés nélküli csevegés', roles: 'Jól látható nézői szerepek', account: 'Egy fiók minden eszközön', tools: 'Eszközök mindig kéznél' },
    chat: { title: 'A beszélgetés akkor is átlátható marad, amikor felgyorsul a LIVE.', lead: 'A fontos üzenetek, szerepek és reakciók azonnal kitűnnek. Kevesebb keresés, több kapcsolat a nézőkkel.', item1: 'Üzenet-, feliratkozó- és ajándékszűrők', item2: 'Külön moderátor-, szuperrajongó- és őrzőkiemelés', item3: 'Rögzítés, moderálás és gyors műveletek a csevegésből' },
    alerts: { title: 'A fontos események pontosan ott jelennek meg, ahová nézel.', lead: 'Az ajándékok és fontos szereplők belépése saját grafikával, színnel és prioritással jelenik meg a csevegés felett.', item1: 'Ajándékgrafikák és jól látható szorzók', item2: 'Moderátor-, szuperrajongó- és őrzőbelépési értesítések', item3: 'Egységes élmény asztali gépen, böngészőben és mobilon' },
    tools: { title: 'Minden, amire adás közben szükséged van.', lead: 'A Czatbox TT egy helyen rendezi az alkotói eszközöket, így nem kell alkalmazások között váltanod.', archive: 'Archívum', notes: 'Jegyzetek', calendar: 'Naptár', radio: 'Rádió', timer: 'Időzítő', giveaway: 'Nyereményjáték' },
    accountSection: { title: 'Egy fiók. Ugyanaz a Czatbox mindenhol.', lead: 'Az alkotók, beállítások, archívum és profil követ a Windows alkalmazás és a böngészős verzió között.' },
    auth: { title: 'Üdv a Czatbox TT-ben', subtitle: 'Jelentkezz be vagy hozz létre fiókot.', loginTab: 'Bejelentkezés', registerTab: 'Regisztráció', email: 'E-mail', password: 'Jelszó', name: 'Fióknév', login: 'Bejelentkezés', register: 'Fiók létrehozása', forgot: 'Elfelejtett jelszó', passwordHelp: 'Legalább 10 karakter. A megerősítést e-mailben küldjük.', loggingIn: 'Bejelentkezés…', creating: 'Fiók létrehozása…', emailRequired: 'Először add meg az e-mail-címedet.', invalidResponse: 'A szerver érvénytelen választ adott.', failed: 'A művelet sikertelen.' },
    account: { loggedAs: 'Bejelentkezve mint', open: 'Alkalmazás megnyitása', user: 'Felhasználó' },
    editor: { title: 'Fiókbeállítások', subtitle: 'A közös fiókban tárolt profil szerkesztése.', avatar: 'Fiókavatar', avatarHelp: 'JPG, PNG vagy WebP, legfeljebb 3 MB.', chooseAvatar: 'Kép kiválasztása', removeAvatar: 'Avatar eltávolítása', name: 'Fióknév', email: 'E-mail', saveProfile: 'Profil mentése', passwordTitle: 'Jelszó módosítása', currentPassword: 'Jelenlegi jelszó', newPassword: 'Új jelszó', savePassword: 'Jelszó módosítása', saved: 'Profil mentve.', passwordSaved: 'Jelszó módosítva.' },
    product: { eyebrow: 'Egyetlen vezérlőközpont', title1: 'Azt látod, ami fontos.', title2: 'Káosz nélkül.', lead: 'A tágas, áttekinthető felület számítógépen, táblagépen és telefonon is működik. Beállításaid és adataid a fiókodat követik.' },
    features: { eyebrow: 'Minden együtt', title: 'LIVE alkotóknak készült', chatTitle: 'Zajmentes csevegés', chatText: 'A szűrők, szerepkiemelések és egyértelmű események segítenek követni a beszélgetést.', dataTitle: 'Adataid mindenhol', dataText: 'Az alkotók, beállítások, archívum és profil egyetlen fiókhoz tartoznak.', choiceTitle: 'Program vagy böngésző', choiceText: 'Dolgozz úgy, ahogy szeretnél — Windowson vagy telepítés nélkül.', toolsTitle: 'Eszközök LIVE közben', toolsText: 'Jegyzetek, rádió, időzítő, Patreon és nyereményjáték mindig kéznél van.' },
    cta: { eyebrow: 'KÉSZEN ÁLLSZ A KÖVETKEZŐ LIVE-RA?', title: 'Kevesebb káosz. Több beszélgetés.' }, footer: { text: 'Független eszköz TikTok LIVE alkotóknak.' }
  }
};

const serverMessageTranslations = {
  'Nieprawidłowy e-mail lub hasło.': { en: 'Invalid email or password.', de: 'Ungültige E-Mail-Adresse oder ungültiges Passwort.', hu: 'Hibás e-mail-cím vagy jelszó.' },
  'Zbyt wiele nieudanych prób logowania. Spróbuj ponownie za 15 minut.': { en: 'Too many failed sign-in attempts. Try again in 15 minutes.', de: 'Zu viele fehlgeschlagene Anmeldeversuche. Versuche es in 15 Minuten erneut.', hu: 'Túl sok sikertelen bejelentkezési kísérlet. Próbáld újra 15 perc múlva.' },
  'Najpierw potwierdź adres e-mail.': { en: 'Confirm your email address first.', de: 'Bestätige zuerst deine E-Mail-Adresse.', hu: 'Először erősítsd meg az e-mail-címedet.' },
  'Konto o tym adresie e-mail już istnieje.': { en: 'An account with this email already exists.', de: 'Für diese E-Mail-Adresse existiert bereits ein Konto.', hu: 'Ezzel az e-mail-címmel már létezik fiók.' }
};

const elements = {
  tabs: [...document.querySelectorAll('[data-auth-tab]')], panels: [...document.querySelectorAll('[data-auth-panel]')],
  login: document.querySelector('#loginForm'), register: document.querySelector('#registerForm'), message: document.querySelector('#authMessage'),
  forms: document.querySelector('#authForms'), account: document.querySelector('#accountState'), language: document.querySelector('#languageSelect'),
  navAccount: document.querySelector('#navAccountButton'), dialog: document.querySelector('#accountDialog'),
  profileForm: document.querySelector('#accountProfileForm'), passwordForm: document.querySelector('#accountPasswordForm')
};

const wantsAccountEditor = new URLSearchParams(window.location.search).get('account') === '1';
let currentUser = null;
let pendingAvatar = '';

function getTranslation(language, path) {
  return path.split('.').reduce((value, key) => value?.[key], translations[language]) ?? path;
}

function detectRegionalLanguage() {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (timeZone === 'Europe/Warsaw') return 'pl';
  if (timeZone === 'Europe/Berlin' || timeZone === 'Europe/Busingen') return 'de';
  if (timeZone === 'Europe/Budapest') return 'hu';
  return 'en';
}

let currentLanguage = SUPPORTED_LANGUAGES.has(localStorage.getItem(LANGUAGE_STORAGE_KEY))
  ? localStorage.getItem(LANGUAGE_STORAGE_KEY)
  : detectRegionalLanguage();

function applyLanguage(language, persist = false) {
  currentLanguage = SUPPORTED_LANGUAGES.has(language) ? language : 'en';
  document.documentElement.lang = currentLanguage;
  elements.language.value = currentLanguage;
  for (const node of document.querySelectorAll('[data-i18n]')) node.textContent = getTranslation(currentLanguage, node.dataset.i18n);
  for (const node of document.querySelectorAll('[data-i18n-aria-label]')) node.setAttribute('aria-label', getTranslation(currentLanguage, node.dataset.i18nAriaLabel));
  document.title = getTranslation(currentLanguage, 'meta.title');
  document.querySelector('meta[name="description"]').content = getTranslation(currentLanguage, 'meta.description');
  if (persist) localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
}

function translateServerMessage(message) {
  if (currentLanguage === 'pl') return message;
  return serverMessageTranslations[message]?.[currentLanguage] ?? message;
}

function showMessage(message = '', error = false) {
  elements.message.textContent = message;
  elements.message.classList.toggle('error', error);
}

function selectTab(name) {
  for (const tab of elements.tabs) {
    const selected = tab.dataset.authTab === name;
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', String(selected));
  }
  for (const panel of elements.panels) panel.hidden = panel.dataset.authPanel !== name;
  showMessage();
}

async function api(path, options = {}) {
  const response = await fetch(path, { credentials: 'include', headers: { 'content-type': 'application/json', ...(options.headers || {}) }, ...options });
  const result = await response.json().catch(() => ({ error: getTranslation(currentLanguage, 'auth.invalidResponse') }));
  if (!response.ok) throw new Error(translateServerMessage(result.error || getTranslation(currentLanguage, 'auth.failed')));
  return result;
}

function setBusy(form, busy) {
  for (const control of form.elements) control.disabled = busy;
  form.setAttribute('aria-busy', String(busy));
}

function setAvatar(image, fallback, user) {
  const avatar = String(user?.avatar || '');
  fallback.textContent = (user?.name?.trim()?.[0] || 'U').toUpperCase();
  if (/^data:image\/(?:png|jpeg|webp);base64,/i.test(avatar)) {
    image.src = avatar;
    image.hidden = false;
    fallback.hidden = true;
    return;
  }
  image.removeAttribute('src');
  image.hidden = true;
  fallback.hidden = false;
}

function fillAccountEditor(user) {
  pendingAvatar = String(user?.avatar || '');
  document.querySelector('#accountProfileName').value = user?.name || '';
  document.querySelector('#accountProfileEmail').value = user?.email || '';
  setAvatar(document.querySelector('#accountAvatarPreview'), document.querySelector('#accountAvatarPreviewFallback'), user);
  document.querySelector('#accountProfileMessage').textContent = '';
  document.querySelector('#accountPasswordMessage').textContent = '';
}

function openAccountEditor() {
  if (!currentUser) {
    document.querySelector('#konto')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.querySelector('#loginEmail')?.focus({ preventScroll: true });
    return;
  }
  fillAccountEditor(currentUser);
  if (!elements.dialog.open) elements.dialog.showModal();
}

function showAccount(user) {
  currentUser = user;
  elements.forms.hidden = true;
  elements.account.hidden = false;
  document.querySelector('#accountName').textContent = user.name || getTranslation(currentLanguage, 'account.user');
  document.querySelector('#accountEmail').textContent = user.email || '';
  setAvatar(document.querySelector('#accountAvatar'), document.querySelector('#accountFallback'), user);
  document.querySelector('#navAccountName').textContent = user.name || getTranslation(currentLanguage, 'account.user');
  setAvatar(document.querySelector('#navAccountAvatar'), document.querySelector('#navAccountFallback'), user);
  elements.navAccount.hidden = false;
  if (wantsAccountEditor) queueMicrotask(openAccountEditor);
}

async function prepareAccountAvatar(file) {
  if (!file || !['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) throw new Error('Wybierz obraz JPG, PNG lub WebP.');
  if (file.size > 3 * 1024 * 1024) throw new Error(getTranslation(currentLanguage, 'editor.avatarHelp'));
  const bitmap = await createImageBitmap(file);
  const size = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  canvas.getContext('2d').drawImage(bitmap, (bitmap.width - size) / 2, (bitmap.height - size) / 2, size, size, 0, 0, 512, 512);
  bitmap.close?.();
  return canvas.toDataURL('image/webp', 0.84);
}

elements.language.addEventListener('change', event => applyLanguage(event.target.value, true));
elements.navAccount.addEventListener('click', openAccountEditor);
elements.dialog.addEventListener('click', event => { if (event.target === elements.dialog) elements.dialog.close(); });
document.querySelector('#accountAvatarInput').addEventListener('change', async event => {
  try {
    pendingAvatar = await prepareAccountAvatar(event.target.files?.[0]);
    setAvatar(document.querySelector('#accountAvatarPreview'), document.querySelector('#accountAvatarPreviewFallback'), { ...currentUser, avatar: pendingAvatar });
  } catch (error) {
    document.querySelector('#accountProfileMessage').textContent = error.message;
    document.querySelector('#accountProfileMessage').classList.add('error');
    event.target.value = '';
  }
});
document.querySelector('#removeAccountAvatar').addEventListener('click', () => {
  pendingAvatar = '';
  document.querySelector('#accountAvatarInput').value = '';
  setAvatar(document.querySelector('#accountAvatarPreview'), document.querySelector('#accountAvatarPreviewFallback'), { ...currentUser, avatar: '' });
});
elements.profileForm.addEventListener('submit', async event => {
  event.preventDefault();
  const message = document.querySelector('#accountProfileMessage');
  setBusy(elements.profileForm, true);
  try {
    const result = await api('/api/account/profile', { method: 'PATCH', body: JSON.stringify({ name: document.querySelector('#accountProfileName').value, avatar: pendingAvatar }) });
    showAccount(result.user);
    fillAccountEditor(result.user);
    message.textContent = getTranslation(currentLanguage, 'editor.saved');
    message.classList.remove('error');
  } catch (error) {
    message.textContent = error.message;
    message.classList.add('error');
  } finally { setBusy(elements.profileForm, false); }
});
elements.passwordForm.addEventListener('submit', async event => {
  event.preventDefault();
  const message = document.querySelector('#accountPasswordMessage');
  const form = new FormData(elements.passwordForm);
  setBusy(elements.passwordForm, true);
  try {
    await api('/api/account/password', { method: 'POST', body: JSON.stringify({ currentPassword: form.get('currentPassword'), newPassword: form.get('newPassword') }) });
    elements.passwordForm.reset();
    message.textContent = getTranslation(currentLanguage, 'editor.passwordSaved');
    message.classList.remove('error');
  } catch (error) {
    message.textContent = error.message;
    message.classList.add('error');
  } finally { setBusy(elements.passwordForm, false); }
});
for (const tab of elements.tabs) tab.addEventListener('click', () => selectTab(tab.dataset.authTab));
elements.login.addEventListener('submit', async event => {
  event.preventDefault();
  const form = new FormData(elements.login);
  setBusy(elements.login, true); showMessage(getTranslation(currentLanguage, 'auth.loggingIn'));
  try {
    const result = await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: form.get('email'), password: form.get('password') }) });
    if (wantsAccountEditor) { setBusy(elements.login, false); showAccount(result.user); openAccountEditor(); }
    else window.location.assign(APP_URL);
  } catch (error) { showMessage(error.message, true); setBusy(elements.login, false); }
});
elements.register.addEventListener('submit', async event => {
  event.preventDefault();
  const form = new FormData(elements.register);
  setBusy(elements.register, true); showMessage(getTranslation(currentLanguage, 'auth.creating'));
  try {
    const result = await api('/api/auth/register', { method: 'POST', body: JSON.stringify({ name: form.get('name'), email: form.get('email'), password: form.get('password') }) });
    elements.register.reset(); selectTab('login'); showMessage(translateServerMessage(result.message));
  } catch (error) { showMessage(error.message, true); } finally { setBusy(elements.register, false); }
});
document.querySelector('#forgotPassword').addEventListener('click', async () => {
  const email = document.querySelector('#loginEmail').value.trim();
  if (!email) { showMessage(getTranslation(currentLanguage, 'auth.emailRequired'), true); document.querySelector('#loginEmail').focus(); return; }
  try {
    const result = await api('/api/auth/password/request', { method: 'POST', body: JSON.stringify({ email }) });
    showMessage(translateServerMessage(result.message));
  } catch (error) { showMessage(error.message, true); }
});

applyLanguage(currentLanguage);
api('/api/auth/session', { method: 'GET', headers: {} }).then(result => showAccount(result.user)).catch(() => {
  if (wantsAccountEditor) openAccountEditor();
});
