const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'web-client', 'public', 'app-hotfix-v177.js'), 'utf8');
const worker = fs.readFileSync(path.join(root, 'web-client', 'backend', 'worker.js'), 'utf8');
const netcupWorker = fs.readFileSync(path.join(root, 'infrastructure', 'netcup', 'api', 'worker.mjs'), 'utf8');
const main = fs.readFileSync(path.join(root, 'src', 'main.js'), 'utf8');

test('a fresh browser origin does not mark empty default sections as newer', () => {
  assert.match(app, /settings:Object\.keys\(savedSettings\)\.length\?Date\.now\(\):0/);
  assert.match(app, /creators:state\.creators\.length\?Date\.now\(\):0/);
  assert.match(app, /archive:state\.archive\.length\?Date\.now\(\):0/);
});

test('login hydrates and merges server data before the first PUT', () => {
  assert.match(app, /updateAccountSurfaces\(\);if\(!offline\)void syncInitial\(\)/);
  assert.doesNotMatch(app, /renderAccountPanel\(/);
  assert.match(app, /async function syncInitial\(\).*method:'GET'/);
  assert.match(app, /if\(hydrated&&authUser\)void syncNow\(\)/);
});

test('both sync backends retain the full UI limit of 100 creators', () => {
  assert.match(worker, /creators:[^\n]*slice\(0, 100\)/);
  assert.match(netcupWorker, /creators:[^\n]*slice\(0, 100\)/);
  assert.doesNotMatch(worker, /creators:[^\n]*slice\(0, 50\)/);
  assert.doesNotMatch(netcupWorker, /creators:[^\n]*slice\(0, 50\)/);
});

test('cloud sync sends only the supported recent archive window', () => {
  assert.match(app, /archive:state\.archive\.slice\(-1000\)/);
});

test('sync retries only when outbound data changed during the request', () => {
  assert.match(app, /JSON\.stringify\(current\.data\[section\]\)!==JSON\.stringify\(payload\.data\[section\]\)/);
});

test('canonical desktop recovery file can hold the current archive', () => {
  assert.match(main, /MAX_CANONICAL_USER_DATA_BYTES = 64 \* 1024 \* 1024/);
  assert.match(main, /Buffer\.byteLength\(payload\) > MAX_CANONICAL_USER_DATA_BYTES/);
});
