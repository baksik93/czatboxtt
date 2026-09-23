const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const app = fs.readFileSync(path.resolve(__dirname, '../web-client/public/app.js'), 'utf8');
const css = fs.readFileSync(path.resolve(__dirname, '../web-client/public/app.css'), 'utf8');

test('every chat filter button owns a click handler and persists changes', () => {
  assert.match(app, /\$\$\('\.filters \[data-filter\]'\)\.forEach\(button=>button\.addEventListener\('click'/);
  assert.match(app, /event\.stopPropagation\(\)/);
  assert.match(app, /applyChatFilters\(\);save\(\)/);
  assert.doesNotMatch(app, /\.filters button'\)\.forEach\([^\n]*\.onclick/);
});

test('existing and newly appended chat rows receive a forced hidden state', () => {
  assert.match(app, /function setChatRowFilterState\(row\)/);
  assert.match(app, /row\.classList\.toggle\('chat-filter-hidden',hidden\)/);
  assert.match(app, /MutationObserver\([\s\S]*setChatRowFilterState\(node\)/);
  assert.match(css, /\.chat-filter-hidden\{display:none!important\}/);
});

test('cloud synchronization reapplies filters to rendered messages', () => {
  assert.match(app, /const applySyncedBase=applySynced;[\s\S]*applyChatFilters\(\);return value/);
  assert.match(app, /localFilterMeta>=remoteFilterMeta/);
  assert.match(app, /filters:\[\.\.\.state\.filters\]/);
});

test('a local filter change always gets a version newer than cloud state', () => {
  assert.match(app, /nextSyncVersion=section=>Math\.max\(Date\.now\(\),Number\(syncMeta\[section\]\|\|0\)\+1\)/);
  assert.match(app, /syncMeta\[section\]=nextSyncVersion\(section\)/);
  const futureCloudVersion = Date.now() + 60_000;
  const localVersion = Math.max(Date.now(), futureCloudVersion + 1);
  assert.ok(localVersion > futureCloudVersion);
});

test('published assets force a fresh filter script and service worker cache', () => {
  const html = fs.readFileSync(path.resolve(__dirname, '../web-client/public/index.html'), 'utf8');
  const worker = fs.readFileSync(path.resolve(__dirname, '../web-client/public/sw.js'), 'utf8');
  const hotfix = fs.readFileSync(path.resolve(__dirname, '../web-client/public/app-hotfix-v131.js'), 'utf8');
  assert.match(html, /app-hotfix-v131\.js\?v=131/);
  assert.doesNotMatch(html, /src="\/app\.js/);
  assert.equal(hotfix, app);
  assert.match(app, /serviceWorker\.register\('\/sw\.js\?v=131'\)/);
  assert.match(worker, /czatbox-ttm-v133/);
  assert.match(worker, /app-hotfix-v131\.js\?v=131/);
});

test('installed desktop cannot replace the uniquely named remote hotfix with its bundled app.js', () => {
  const main = fs.readFileSync(path.resolve(__dirname, '../src/main.js'), 'utf8');
  assert.match(main, /fs\.existsSync\(filePath\)/);
  assert.doesNotMatch(main, /app-hotfix-v131/);
});
