const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'web-client', 'public');
const workspace = fs.readFileSync(path.join(publicDir, 'workspace-shell-v150.js'), 'utf8');
const css = fs.readFileSync(path.join(publicDir, 'workspace-codex-v179.css'), 'utf8');
const html = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');
const worker = fs.readFileSync(path.join(publicDir, 'sw.js'), 'utf8');

test('Co nowego is removed from Pomoc and launched by the round account-dock question button', () => {
  assert.match(workspace, /data-menu="help"/);
  assert.match(workspace, /data-help-panel="program">O programie/);
  assert.doesNotMatch(workspace, /data-help-panel="whats-new"/);
  assert.match(workspace, /whatsNewLauncher\.id='whatsNewLauncher'/);
  assert.match(workspace, /aria-label','Co nowego'/);
  assert.match(workspace, /\$\('#accountDock'\)\?\.append\(whatsNewLauncher\)/);
  assert.match(workspace, /whatsNewLauncher\.onclick=openWhatsNew/);
  assert.match(workspace, /whatsNewBackdrop\.append\(whatsNewPanel\);document\.body\.append\(whatsNewBackdrop\)/);
});

test('Co nowego follows the supplied editorial changelog structure with Czatbox content', () => {
  assert.match(workspace, /id='aboutWhatsNew'/);
  assert.match(workspace, /<h2 id="whatsNewTitle">Co nowego<\/h2>/);
  assert.match(workspace, /<time datetime="2026-09-30">30 września 2026<\/time>/);
  assert.match(workspace, /class="whats-new-hero"/);
  assert.match(workspace, /Co nowego/);
  assert.match(workspace, /Co ulepszyliśmy/);
  assert.match(workspace, /Co pod maską/);
  assert.match(workspace, /TOP 3 prosto z TikToka/);
  assert.match(workspace, /Krita śledzi zmiany rankingu/);
  assert.match(workspace, /Pewniejsze rozpoznawanie ról/);
  assert.match(workspace, /Historia aktualizacji/);
  assert.match(workspace, /whatsNewSupport\.className='whats-new-section is-support'/);
  assert.match(workspace, /<h3><span>Wsparcie<\/span><\/h3>/);
  assert.match(workspace, /Pomóż rozwinąć Czatbox TT na urządzenia Apple/);
  assert.match(workspace, /https:\/\/www\.patreon\.com\/15802701\/join/);
  assert.match(workspace, /https:\/\/www\.paypal\.com\/pool\/9sNTKAuayB\?sr=wccr/);
  assert.match(workspace, /\$\('\.whats-new-article',whatsNewPanel\)\.append\(whatsNewSupport\)/);
  assert.doesNotMatch(workspace, /Discorda|React Native|Popularne gry/);
});

test('the changelog has a right-side close control, no footer and an independently scrolling article', () => {
  assert.match(workspace, /id="whatsNewClose"/);
  assert.doesNotMatch(workspace, /id="whatsNewFooterClose"/);
  assert.doesNotMatch(workspace, /class="whats-new-footer"/);
  assert.match(workspace, /<i aria-hidden="true"><\/i><span><h2 id="whatsNewTitle"[^`]+id="whatsNewClose"/);
  assert.match(workspace, /closeWhatsNew=\(\)=>\{whatsNewBackdrop\.hidden=true/);
  assert.match(workspace, /if\(event\.target===whatsNewBackdrop\)closeWhatsNew\(\)/);
  assert.match(workspace, /event\.key==='Escape'/);
  assert.match(css, /\.whats-new-frame\{grid-template-rows:auto minmax\(0,1fr\)\}/);
  assert.match(css, /\.whats-new-scroll\{min-height:0;overflow:auto/);
  assert.match(css, /\.whats-new-scroll\{[^}]*scrollbar-width:none;[^}]*-ms-overflow-style:none/);
  assert.match(css, /\.whats-new-scroll::-webkit-scrollbar\{display:none;width:0;height:0\}/);
  assert.match(css, /\.whats-new-article\{[^}]*text-align:left/);
  assert.match(css, /\.whats-new-header\{/);
  assert.match(css, /\.whats-new-backdrop\{[^}]*position:fixed;[^}]*display:grid;place-items:center/);
  assert.match(css, /\.whats-new-backdrop #aboutWhatsNew\.whats-new-panel\{[^}]*width:min\(720px/);
  assert.match(css, /@media\(max-width:760px\)/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
});

test('the release hero uses a clean transparent icon without an added navy outline', () => {
  assert.match(workspace, /<img src="\/whats-new-app-icon-v1\.png" alt="Czatbox TT">/);
  assert.doesNotMatch(workspace, /<img src="\/app-icon-512\.png" alt="Czatbox TT">/);
  assert.match(css, /\.whats-new-hero img\{[^}]*filter:none/);
  assert.match(worker, /\/whats-new-app-icon-v1\.png/);
});

test('the hero is edge-to-edge, section labels have symmetric lines and technical points reuse the gold markers', () => {
  assert.match(css, /\.whats-new-backdrop \.whats-new-article\{width:100%;padding:0/);
  assert.match(css, /\.whats-new-backdrop \.whats-new-hero\{[^}]*width:100%;[^}]*margin:0;[^}]*border-width:0 0 1px;[^}]*border-radius:0/);
  assert.match(css, /\.whats-new-section>h3::before,\.whats-new-section>h3::after/);
  assert.match(css, /\.whats-new-section>h3::before\{background:linear-gradient\(90deg,transparent,var\(--release-accent\)\)\}/);
  assert.match(css, /\.whats-new-section>h3::after\{background:linear-gradient\(90deg,var\(--release-accent\),transparent\)\}/);
  assert.match(css, /\.whats-new-tech\{display:block;[^}]*list-style:none/);
  assert.match(css, /\.whats-new-tech li\{[^}]*border:0;[^}]*background:transparent/);
  assert.match(css, /\.whats-new-tech li::before\{[^}]*content:"✦";[^}]*width:auto;height:auto;[^}]*background:none;box-shadow:none;[^}]*color:#f1cf50/);
  assert.match(css, /@font-face\{font-family:"Czatbox Inter";src:url\("\/fonts\/InterVariable\.woff2"\)/);
  assert.match(css, /@font-face\{font-family:"Czatbox Inter Display";src:url\("\/fonts\/InterDisplay-ExtraBold\.woff2"\)/);
  assert.match(css, /\.whats-new-backdrop #aboutWhatsNew\.whats-new-panel,#settings-usage\{font-family:"Czatbox Inter"/);
  assert.match(css, /\.whats-new-section\.is-support\{--release-accent:#f1cf50\}/);
  assert.match(css, /\.whats-new-support\{margin-top:4px\}/);
  assert.doesNotMatch(css, /\.whats-new-support\{[^}]+(?:border|background|box-shadow|padding)/);
  assert.match(css, /\.whats-new-support-actions\{display:grid;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.doesNotMatch(workspace, /aria-label="Najważniejsze obszary aktualizacji"/);
  assert.doesNotMatch(workspace, /<li>TTS<\/li><li>Krita<\/li><li>Motywy<\/li>/);
});

test('after an update the changelog opens once and there is no separate support popup', () => {
  assert.match(workspace, /whatsNewSeenKey='cttm-whats-new-seen-0\.3\.35'/);
  assert.match(workspace, /localStorage\.getItem\(whatsNewSeenKey\)==='true'/);
  assert.match(workspace, /localStorage\.setItem\(whatsNewSeenKey,'true'\);openWhatsNew\(\);window\.playCzatboxNotificationSound\?\.\(\);return true/);
  assert.match(workspace, /whatsNewLauncher\.onclick=openWhatsNew/);
  assert.doesNotMatch(workspace, /whatsNewLauncher\.onclick=\(\)=>\{[^}]*playCzatboxNotificationSound/);
  assert.doesNotMatch(workspace, /supportIntro|showSupportIntro|openSupportAfterWhatsNew|cttm-support-intro-shown/);
  assert.doesNotMatch(css, /support-intro-backdrop|support-intro-card|support-intro-actions/);
});

test('published assets use the new changelog shell and cache generation', () => {
  assert.match(html, /workspace-codex-v179\.css\?v=182/);
  assert.match(html, /app-hotfix-v177\.js\?v=179/);
  assert.match(html, /workspace-shell-v150\.js\?v=157/);
  assert.match(worker, /czatbox-ttm-v213/);
  assert.match(worker, /workspace-codex-v179\.css\?v=182/);
  assert.match(worker, /app-hotfix-v177\.js\?v=179/);
  assert.match(worker, /workspace-shell-v150\.js\?v=157/);
  assert.match(worker, /fonts\/InterDisplay-ExtraBold\.woff2/);
});
