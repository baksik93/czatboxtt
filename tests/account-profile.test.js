const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const appSource = fs.readFileSync(path.join(root, 'web-client', 'public', 'app-hotfix-v177.js'), 'utf8');
const mainSource = fs.readFileSync(path.join(root, 'src', 'main.js'), 'utf8');
const workspaceSource = fs.readFileSync(path.join(root, 'web-client', 'public', 'workspace.js'), 'utf8');
const shellSource = fs.readFileSync(path.join(root, 'web-client', 'public', 'workspace-shell-v150.js'), 'utf8');
const workspaceCss = fs.readFileSync(path.join(root, 'web-client', 'public', 'workspace-codex-v179.css'), 'utf8');
const indexSource = fs.readFileSync(path.join(root, 'web-client', 'public', 'index.html'), 'utf8');
const backendSource = fs.readFileSync(path.join(root, 'infrastructure', 'netcup', 'api', 'worker.mjs'), 'utf8');
const cutoverSource = fs.readFileSync(path.join(root, 'infrastructure', 'netcup', 'cutover', 'worker.mjs'), 'utf8');
const landingSource = fs.readFileSync(path.join(root, 'infrastructure', 'netcup', 'landing', 'index.html'), 'utf8');
const landingAppSource = fs.readFileSync(path.join(root, 'infrastructure', 'netcup', 'landing', 'app.js'), 'utf8');
const landingV2Css = fs.readFileSync(path.join(root, 'infrastructure', 'netcup', 'landing', 'landing-v2.css'), 'utf8');

test('account avatar is edited on the website and excluded from the desktop offline cache', () => {
  assert.doesNotMatch(appSource, /cttm-account-avatar:/);
  assert.match(appSource, /const \{avatar:_avatar,\.\.\.offlineUser\}=user\|\|\{\}/);
  assert.match(landingAppSource, /JSON\.stringify\(\{ name: document\.querySelector\('#accountProfileName'\)\.value, avatar: pendingAvatar \}\)/);
  assert.match(landingAppSource, /file\.size > 3 \* 1024 \* 1024/);
  assert.match(landingSource, /JPG, PNG lub WebP, maksymalnie 3 MB/);
});

test('server validates and persists the account avatar with a 3 MB limit', () => {
  assert.match(backendSource, /function validAvatarData\(value\)/);
  assert.match(backendSource, /bytes\.byteLength > 3 \* 1024 \* 1024/);
  assert.match(backendSource, /UPDATE users SET name=\?,avatar_data=\?,updated_at=\?/);
  assert.match(backendSource, /avatar: String\(row\.avatar_data \|\| ""\)/);
});

test('website session is shared across domains without breaking the released desktop bridge', () => {
  assert.match(backendSource, /Domain=czatboxtt\.com/);
  assert.match(backendSource, /x-czatbox-client/);
  assert.match(cutoverSource, /headers\.set\("x-czatbox-client", "desktop"\)/);
  assert.match(backendSource, /function cookieTokens\(request\)/);
});

test('landing page exposes login and registration against the shared account API', () => {
  assert.match(landingSource, /id="loginForm"/);
  assert.match(landingSource, /id="registerForm"/);
  assert.match(landingSource, /Jedno konto\. Ten sam Czatbox wszędzie\./);
});

test('landing page supports program languages and defaults every other region to English', () => {
  assert.match(landingSource, /id="languageSelect"/);
  for (const language of ['pl', 'en', 'de', 'hu']) {
    assert.match(landingSource, new RegExp(`<option value="${language}">`));
    assert.match(landingAppSource, new RegExp(`\\b${language}: \\{`));
  }
  assert.match(landingAppSource, /timeZone === 'Europe\/Warsaw'\) return 'pl'/);
  assert.match(landingAppSource, /timeZone === 'Europe\/Berlin'.+return 'de'/);
  assert.match(landingAppSource, /timeZone === 'Europe\/Budapest'\) return 'hu'/);
  assert.match(landingAppSource, /return 'en';/);
});

test('landing hero displays product origin and equal-start messages', () => {
  assert.match(landingSource, /class="kicker">[\s\S]*data-i18n="hero\.eyebrow"/);
  assert.match(landingSource, /data-i18n="hero\.polishProduct">Polski produkt/);
  assert.match(landingSource, /data-i18n="hero\.equalStart">Równy start dla każdego/);
});

test('landing presents the product with dedicated professional feature artwork', () => {
  assert.match(landingSource, /landing-v3\.css\?v=6/);
  assert.match(landingSource, /class="hero shell"[\s\S]*hero-command-center-v1\.png/);
  assert.match(landingSource, /id="czat"[\s\S]*feature-chat-v1\.png/);
  assert.match(landingSource, /id="alerty"[\s\S]*feature-alerts-v1\.png/);
  assert.match(landingSource, /id="narzedzia"[\s\S]*feature-tools-v1\.png/);
  assert.match(landingSource, /id="konto"[\s\S]*id="loginForm"[\s\S]*id="registerForm"/);
  for (const asset of ['hero-command-center-v1.png', 'feature-chat-v1.png', 'feature-alerts-v1.png', 'feature-tools-v1.png']) {
    assert.ok(fs.statSync(path.join(root, 'infrastructure', 'netcup', 'landing', 'assets', asset)).size > 1_000_000);
  }
  assert.match(landingAppSource, /noInstall: 'Lokalnie na PC lub bez instalacji'/);
});

test('login throttling uses five attempts in a fifteen-minute rolling window', () => {
  assert.match(backendSource, /LOGIN_ATTEMPT_WINDOW = 15 \* MINUTE/);
  assert.match(backendSource, /LOGIN_ATTEMPT_LIMIT = 5/);
  assert.doesNotMatch(backendSource, /Logowanie zablokowane na 24 godziny/);
});

test('landing collects credentials before disabling form controls', () => {
  const loginHandler = landingAppSource.slice(landingAppSource.indexOf("elements.login.addEventListener"), landingAppSource.indexOf("elements.register.addEventListener"));
  const registerHandler = landingAppSource.slice(landingAppSource.indexOf("elements.register.addEventListener"), landingAppSource.indexOf("document.querySelector('#forgotPassword')"));
  assert.ok(loginHandler.indexOf('new FormData(elements.login)') < loginHandler.indexOf('setBusy(elements.login, true)'));
  assert.ok(registerHandler.indexOf('new FormData(elements.register)') < registerHandler.indexOf('setBusy(elements.register, true)'));
  assert.match(backendSource, /if \(!validEmail\(email\) \|\| !validPassword\(password\)\) return json/);
});

test('local preview proxies account API instead of bypassing authentication', () => {
  assert.match(mainSource, /pathname\.startsWith\('\/api\/'\)/);
  assert.match(mainSource, /'x-czatbox-client': 'desktop'/);
  assert.doesNotMatch(mainSource, /#betaGate\{display:none!important\}/);
});

test('local preview never writes a second response after a client disconnect', () => {
  assert.match(mainSource, /if \(response\.destroyed \|\| response\.writableEnded\) return/);
  assert.match(mainSource, /if \(response\.headersSent \|\| response\.destroyed \|\| response\.writableEnded\)/);
});

test('clicking the account dock opens the quick account menu', () => {
  assert.match(appSource, /function installAccountQuickMenu\(\)/);
  assert.match(appSource, /Standardowe/);
  assert.match(appSource, /Pozostały limit/);
  assert.match(appSource, /Codzienny/);
  assert.match(appSource, /id="accountDailyLimit">100%/);
  assert.match(appSource, /Tygodniowy/);
  assert.match(appSource, /Żeton resetu/);
  assert.match(appSource, /id="accountUseResetToken"/);
  assert.match(appSource, /id="accountMenuSettings"/);
  assert.match(appSource, /id="accountMenuLogout"/);
  assert.match(workspaceCss, /\.account-quick-menu/);
});

test('quick-menu reset action opens usage settings instead of spending a token', () => {
  assert.match(appSource, /accountUseResetToken[^\n]+cttm-open-usage-settings/);
  assert.doesNotMatch(appSource, /accountUseResetToken[^\n]+useTtsResetToken\(\)/);
  assert.match(shellSource, /cttm-open-usage-settings[^\n]+showSettingsCategory\('settings-usage',\{focus:true\}\)/);
});

test('Co nowego launcher uses the single circle drawn by its question-mark icon', () => {
  assert.match(shellSource, /whatsNewLauncher\.innerHTML='<svg[^']+<circle cx="12" cy="12" r="9"\/>/);
  assert.match(workspaceCss, /#whatsNewLauncher\{[^}]*border:0;[^}]*background:transparent;[^}]*box-shadow:none/);
});

test('account remains in settings navigation but opens the website editor', () => {
  assert.match(indexSource, /data-settings-target="settings-account"/);
  assert.doesNotMatch(indexSource, /id="settings-account"/);
  assert.match(shellSource, /target==='settings-account'\)\{window\.dispatchEvent\(new CustomEvent\('cttm-open-account-settings'\)\);return\}/);
  assert.match(appSource, /function openAccountSettings\(\)\{window\.open\('https:\/\/czatboxtt\.com\/\?account=1','_blank','noopener,noreferrer'\)\}/);
  assert.doesNotMatch(appSource, /function renderAccountPanel\(/);
});

test('logged-in website header exposes avatar and nickname and opens account editor', () => {
  assert.match(landingSource, /id="navAccountButton"/);
  assert.match(landingSource, /id="navAccountAvatar"/);
  assert.match(landingSource, /id="navAccountName"/);
  assert.match(landingSource, /id="accountDialog"/);
  assert.match(landingAppSource, /elements\.navAccount\.addEventListener\('click', openAccountEditor\)/);
  assert.match(landingAppSource, /wantsAccountEditor/);
});

test('website account editor uses a read-only email and supports profile and password updates', () => {
  assert.match(landingSource, /id="accountProfileEmail" type="email" readonly/);
  assert.match(landingSource, /id="accountProfileForm"/);
  assert.match(landingSource, /id="accountPasswordForm"/);
  assert.match(landingAppSource, /api\('\/api\/account\/profile', \{ method: 'PATCH'/);
  assert.match(landingAppSource, /api\('\/api\/account\/password', \{ method: 'POST'/);
});
