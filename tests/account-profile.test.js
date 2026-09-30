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

test('account avatar stays in local storage and is removed from profile requests', () => {
  assert.match(appSource, /cttm-account-avatar:/);
  assert.match(appSource, /localStorage\.setItem\(key,avatar\)/);
  assert.match(appSource, /delete profile\.avatar/);
});

test('local preview proxies account API instead of bypassing authentication', () => {
  assert.match(mainSource, /pathname\.startsWith\('\/api\/'\)/);
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

test('account settings stay in regular settings navigation', () => {
  assert.doesNotMatch(workspaceSource, /\[data-settings-target="settings-account"\].*\.remove\(\)/);
  assert.match(workspaceSource, /cttm-open-account-settings/);
  assert.match(indexSource, /data-settings-target="settings-account"/);
});

test('opening account settings always rebuilds the account panel', () => {
  assert.match(shellSource, /target==='settings-account'[^\n]+cttm-render-account-settings/);
  assert.match(appSource, /function ensureAccountPanel\(\)/);
  assert.match(appSource, /cttm-render-account-settings',ensureAccountPanel/);
});

test('account email is rendered as a read-only field and password section has a divider', () => {
  assert.match(appSource, /account-email-field/);
  assert.match(appSource, /input\.readOnly=true/);
  assert.match(workspaceCss, /\.account-password-form\+\.setting-row\{border-top:1px solid var\(--line\)!important\}/);
});
