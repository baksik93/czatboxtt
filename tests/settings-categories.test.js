const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const workspace = fs.readFileSync(path.join(root, 'web-client/public/workspace.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'web-client/public/workspace-v80.css'), 'utf8');

test('desktop settings show only the selected category', () => {
  assert.match(workspace, /function showSettingsCategory\(target/);
  assert.match(workspace, /settings-category-hidden/);
  assert.match(workspace, /button\.onclick=\(\)=>showSettingsCategory\(button\.dataset\.settingsTarget\)/);
  assert.match(css, /\.settings-section\.settings-category-hidden\{display:none!important\}/);
});

test('account pencil opens the isolated account category', () => {
  assert.match(workspace, /showSettingsCategory\('settings-account',\{focus:true\}\)/);
});
