const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'web-client/public/app-hotfix-v176.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'web-client/public/index.html'), 'utf8');
const serviceWorker = fs.readFileSync(path.join(root, 'web-client/public/sw.js'), 'utf8');

test('canonical desktop persistence skips unchanged snapshots and serializes keys deterministically', () => {
  assert.match(app, /canonicalPersistSnapshot/);
  assert.match(app, /filter\(key=>key\.startsWith\('cttm-'\)\)\.sort\(\)/);
  assert.match(app, /if\(snapshot===canonicalPersistSnapshot\)return true/);
});

test('canonical desktop persistence never overlaps writes and rechecks changes queued during a write', () => {
  assert.match(app, /canonicalPersistInFlight/);
  assert.match(app, /canonicalPersistPending=true/);
  assert.match(app, /queueMicrotask\(\(\)=>void persistCanonicalUserData\(\)\)/);
});

test('fallback persistence check is infrequent and published cache generation is coherent', () => {
  assert.doesNotMatch(app, /persistCanonicalUserData\(\),2000/);
  assert.match(app, /persistCanonicalUserData\(\),30000/);
  assert.match(app, /register\('\/sw\.js\?v=204'\)/);
  assert.match(serviceWorker, /czatbox-ttm-v204/);
  assert.match(html, /app-hotfix-v176\.js/);
});
