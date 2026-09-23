const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const appSource = fs.readFileSync(path.join(root, 'web-client', 'public', 'app.js'), 'utf8');
const mainSource = fs.readFileSync(path.join(root, 'src', 'main.js'), 'utf8');
const workspaceSource = fs.readFileSync(path.join(root, 'web-client', 'public', 'workspace.js'), 'utf8');
const workspaceCss = fs.readFileSync(path.join(root, 'web-client', 'public', 'workspace-v80.css'), 'utf8');
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

test('clicking the account dock opens the quick account menu', () => {
  assert.match(appSource, /function installAccountQuickMenu\(\)/);
  assert.match(appSource, /Standardowe/);
  assert.match(appSource, /Pozostały limit/);
  assert.match(appSource, /Codzienny/);
  assert.match(appSource, /id="accountDailyLimit">100%/);
  assert.match(appSource, /Tygodniowy/);
  assert.match(appSource, /Żeton resetu/);
  assert.match(appSource, /id="accountMenuSettings"/);
  assert.match(appSource, /id="accountMenuLogout"/);
  assert.match(workspaceCss, /\.account-quick-menu/);
});

test('account settings stay in regular settings navigation', () => {
  assert.doesNotMatch(workspaceSource, /\[data-settings-target="settings-account"\].*\.remove\(\)/);
  assert.match(workspaceSource, /cttm-open-account-settings/);
  assert.match(indexSource, /data-settings-target="settings-account"/);
});

test('account email is rendered as a read-only field and password section has a divider', () => {
  assert.match(appSource, /account-email-field/);
  assert.match(appSource, /input\.readOnly=true/);
  assert.match(workspaceCss, /\.account-password-form\+\.setting-row\{border-top:1px solid var\(--line\)!important\}/);
});
