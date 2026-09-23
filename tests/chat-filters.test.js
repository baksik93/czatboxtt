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

test('published assets force a fresh filter script and service worker cache', () => {
  const html = fs.readFileSync(path.resolve(__dirname, '../web-client/public/index.html'), 'utf8');
  const worker = fs.readFileSync(path.resolve(__dirname, '../web-client/public/sw.js'), 'utf8');
  assert.match(html, /app\.js\?v=129/);
  assert.match(app, /serviceWorker\.register\('\/sw\.js\?v=129'\)/);
  assert.match(worker, /czatbox-ttm-v129/);
  assert.match(worker, /app\.js\?v=129/);
});
