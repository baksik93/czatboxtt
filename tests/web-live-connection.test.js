const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const app = fs.readFileSync(path.join(__dirname, '..', 'web-client', 'public', 'app.js'), 'utf8');

test('browser LIVE uses the documented Euler Stream WebSocket schema', () => {
  assert.match(app, /schemaVersion:'v1'/);
  assert.doesNotMatch(app, /features\.schemaVersion/);
  assert.doesNotMatch(app, /features\.includeRawBytes/);
  assert.doesNotMatch(app, /features\.webcastPlatform/);
});

test('mobile LIVE reconnects after returning from the background', () => {
  assert.match(app, /visibilityState!==['"]visible['"]/);
  assert.match(app, /state\.reconnectAttempt=0;connectLive\(\)/);
});
