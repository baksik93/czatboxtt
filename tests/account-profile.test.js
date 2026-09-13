const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const appSource = fs.readFileSync(path.join(root, 'web-client', 'public', 'app.js'), 'utf8');
const mainSource = fs.readFileSync(path.join(root, 'src', 'main.js'), 'utf8');

test('account avatar stays in local storage and is removed from profile requests', () => {
  assert.match(appSource, /cttm-account-avatar:/);
  assert.match(appSource, /localStorage\.setItem\(key,avatar\)/);
  assert.match(appSource, /delete profile\.avatar/);
});

test('local preview proxies account API instead of bypassing authentication', () => {
  assert.match(mainSource, /pathname\.startsWith\('\/api\/'\)/);
  assert.doesNotMatch(mainSource, /#betaGate\{display:none!important\}/);
});
