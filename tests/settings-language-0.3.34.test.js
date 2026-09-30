const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'web-client/public/index.html'), 'utf8');
const app = fs.readFileSync(path.join(root, 'web-client/public/app-hotfix-v177.js'), 'utf8');
const shell = fs.readFileSync(path.join(root, 'web-client/public/workspace-shell-v150.js'), 'utf8');
const workspaceCss = fs.readFileSync(path.join(root, 'web-client/public/workspace-codex-v179.css'), 'utf8');
const localization = fs.readFileSync(path.join(root, 'web-client/public/localization-v1.js'), 'utf8');
const fixes = fs.readFileSync(path.join(root, 'web-client/public/fixes.js'), 'utf8');
const main = fs.readFileSync(path.join(root, 'src/main.js'), 'utf8');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

test('chat settings expose four persisted interface languages', () => {
  assert.match(html, /id="language"/);
  for (const [value, label] of [['pl', 'Polski'], ['en', 'Angielski'], ['de', 'Niemiecki'], ['hu', 'Węgierski']]) {
    assert.match(html, new RegExp(`<option value="${value}">${label}<\\/option>`));
  }
  assert.match(app, /language:\s*"pl"/);
  assert.match(app, /\['pl','en','de','hu'\]\.includes\(state\.settings\.language\)/);
  assert.match(html, /localization-v1\.js\?v=10/);
  assert.match(localization, /const locales=\{pl:'pl-PL',en:'en-GB',de:'de-DE',hu:'hu-HU'\}/);
  assert.match(localization, /MutationObserver/);
  assert.match(localization, /cttm-language-change/);
  const chatSection = html.match(/<section id="settings-chat"[\s\S]*?<\/section>/)?.[0] || '';
  assert.ok(chatSection.indexOf('id="language"') > chatSection.indexOf('id="delay"'), 'language must be the final chat setting');
});

test('service notices are translated instead of falling back to Polish', () => {
  for (const message of [
    'Dane zostały zsynchronizowane.',
    'Nieprawidłowy kod aktywacyjny.',
    'Notatka została zapisana.',
    'Nie udało się pobrać playlisty.',
    'Wprowadź czas większy od zera.',
    'Dzienny limit 800 odsłuchanych wiadomości TTS został wykorzystany.'
  ]) assert.match(localization, new RegExp(message.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(localization, /Kod przyjęty\\\. Dodano żeton resetu limitów TTS/);
  assert.match(localization, /Synchronizacja nie powiodła się:/);
  assert.match(localization, /Nawiązuję połączenie z @/);
});

test('automatic LIVE chat events follow the selected language without translating viewer messages', () => {
  for (const translation of [
    'joins the stream', 'liked the LIVE', 'sends a gift', 'sends a treasure box',
    'tritt dem LIVE bei', 'sendet ein Geschenk', 'sendet eine Schatztruhe',
    'csatlakozik a LIVE-hoz', 'ajándékot küld', 'kincsesládát küld'
  ]) assert.match(app, new RegExp(translation));
  assert.match(app, /if\(!item\|\|item\.kind==='chat'\)return null/);
  assert.match(app, /liveTextKey,liveTextArgs/);
  assert.match(app, /descriptor\?formatLiveEventText\(descriptor\.key,descriptor\.args\):item\.text/);
  assert.match(app, /body\.textContent=localizedLiveEventText\(item\)/);
  assert.match(app, /window\.addEventListener\('cttm-language-applied'/);
  assert.match(app, /KRITA_COPY=Object\.freeze/);
  assert.match(app, /localizedKritaText\(kritaKind\)/);
  assert.match(app, /BATTLE: X\{multiplier\} MULTIPLIER STARTING SOON/);
  assert.match(app, /CREATOR FREEZE/);
  assert.match(fixes, /if\(row\.querySelector\('\.live-event-text'\)\)return/);
  assert.match(html, /fixes\.js\?v=101/);
});

test('TTS roles are independent and explicit users can be allowed or blocked', () => {
  assert.match(html, /id="ttsModerators"/);
  assert.match(html, /id="ttsSuperfans"/);
  assert.match(html, /id="ttsTopThree"/);
  assert.doesNotMatch(html, /id="privileged"/);
  assert.match(app, /allowedTtsUsers:\[\]/);
  assert.match(app, /ignoredTtsUsers:\[\]/);
  assert.match(app, /Czytaj wiadomości od użytkowników/);
  assert.match(app, /Nie czytaj wiadomości użytkowników/);
  assert.match(app, /if\(roleFilters&&!\(\(state\.settings\.ttsModerators/);
  assert.doesNotMatch(app, /if\(\(roleFilters\|\|allowedUsers\.length\)/);
  assert.match(app, /isIgnoredTtsUser\(item\).*isSpam\(item\?\.text\)/);
  assert.match(app, /savedSettings\.privileged===true/);
  assert.match(app, /delete state\.settings\.privileged/);
});

test('synced language is validated before it reaches the interface', () => {
  assert.match(app, /result\.data\.settings\.language=\['pl','en','de','hu'\]\.includes\(result\.data\.settings\.language\)\?result\.data\.settings\.language:'pl'/);
});

test('archive retention is controlled only by the seven-day option', () => {
  assert.match(html, /id="autoClear" class="switch" type="checkbox">/);
  assert.match(app, /if\(state\.settings\.autoClear\)\{const cutoff=Date\.now\(\)-7\*86400000/);
  assert.doesNotMatch(app, /slice\(-5000\)/);
  assert.doesNotMatch(app, /archive\.length\s*>\s*5000/);
});

test('application data moved into Account and update history replaced its old category', () => {
  assert.match(html, /data-settings-target="settings-account">Konto/);
  assert.match(html, /data-settings-target="settings-data">Historia aktualizacji/);
  assert.match(app, /\$\('\.account-profile-card'\)\?\.append\(resetGroup\)/);
  assert.doesNotMatch(app, /\$\('#settings-account'\)\?\.append\(resetGroup\)/);
  assert.match(app, /\$\('#deleteAccount'\)\?\.closest\('\.setting-row'\)\?\.remove\(\)/);
  assert.match(shell, /class="update-history-browser"/);
  assert.match(shell, /class="update-history-sidebar"/);
  assert.match(shell, /class="update-history-versions" role="tablist"/);
  assert.match(shell, /class="update-history-detail" role="tabpanel"/);
  assert.match(shell, /class="whats-new-header update-history-release-header"/);
  assert.match(shell, /class="update-history-release-content"/);
  assert.match(shell, /id="updateHistoryDate"/);
  assert.match(shell, /version:'0\.3\.34'/);
  assert.match(shell, /version:'0\.3\.33'/);
  assert.match(shell, /detail\.replaceChildren\(release\.article\.cloneNode\(true\)\)/);
  assert.match(workspaceCss, /\.update-history-browser\{width:100%;height:100%;min-height:0;display:grid;grid-template-columns:220px minmax\(0,1fr\);overflow:hidden/);
  assert.match(workspaceCss, /\.update-history-sidebar\{[\s\S]*?border-right:1px solid var\(--line\)/);
  assert.match(workspaceCss, /\.update-history-release-content \.whats-new-article\{width:min\(900px,calc\(100% - 48px\)\);max-width:900px/);
  assert.doesNotMatch(shell, /<div class="update-history-browser"><header class="group-head">/);
  assert.match(shell, /Większe limity wiadomości TTS/);
  assert.match(shell, /Pewniejsze sterowanie dźwiękiem/);
});

test('desktop voice labels changed without changing compatible voice ids', () => {
  assert.match(main, /label: 'Natan PL \(desktop\)'/);
  assert.match(main, /label: 'Jowita PL \(desktop\)'/);
  assert.match(main, /'piper-mr-drwina': \{ label: 'Natan PL \(desktop\)'/);
  assert.match(main, /'piper-halinka': \{ label: 'Jowita PL \(desktop\)'/);
  assert.doesNotMatch(main, /label: 'Mr\. Drwina - Piper \(desktop\)'/);
  assert.doesNotMatch(main, /label: 'Halinka - Piper \(desktop\)'/);
});

test('desktop Piper options are restored when a fresh page replaces the voice selector', () => {
  assert.match(main, /const ensurePiperOptions = \(\) => \{\s*const voiceSelect = document\.querySelector\('#voice'\)/);
  assert.match(main, /if \(observedVoiceSelect === voiceSelect\) return/);
  assert.match(main, /voiceOptionObserver = new MutationObserver\(ensurePiperOptions\)/);
  assert.match(main, /new MutationObserver\(ensurePiperOptions\)\.observe\(voiceHost, \{ childList: true, subtree: true \}\)/);
  for (const resource of [
    'piper-tts.exe',
    'pl_PL-jarvis_wg_glos-medium.onnx',
    'pl_PL-jarvis_wg_glos-medium.onnx.json',
    'pl_PL-justyna_wg_glos-medium.onnx',
    'pl_PL-justyna_wg_glos-medium.onnx.json'
  ]) {
    assert.ok(fs.existsSync(path.join(root, 'resources/piper', resource)), `missing bundled Piper resource: ${resource}`);
    assert.ok(pkg.build.extraResources.some(item => item.from === `resources/piper/${resource}`), `Piper resource is not packaged: ${resource}`);
  }
});

test('0.3.35 is the application version and release-only caveats are absent', () => {
  assert.equal(pkg.version, '0.3.35');
  assert.match(shell, /AKTUALIZACJA 0\.3\.35/);
  assert.doesNotMatch(shell, /opcja usuwania konta zniknęła z interfejsu/);
  assert.doesNotMatch(shell, /numer programu nie został jeszcze podniesiony/);
});
