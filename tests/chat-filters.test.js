const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const app = fs.readFileSync(path.resolve(__dirname, '../web-client/public/app.js'), 'utf8');
const css = fs.readFileSync(path.resolve(__dirname, '../web-client/public/app.css'), 'utf8');

test('chat filters use one delegated handler and persist changes', () => {
  assert.match(app, /closest\('\.filters \[data-filter\]'\)/);
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
});
