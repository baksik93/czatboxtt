const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const app = fs.readFileSync(path.join(__dirname, '..', 'web-client', 'public', 'app-hotfix-v177.js'), 'utf8');
const relay = fs.readFileSync(path.join(__dirname, '..', 'infrastructure', 'netcup', 'api', 'live-relay.mjs'), 'utf8');
const html = fs.readFileSync(path.join(__dirname, '..', 'web-client', 'public', 'index.html'), 'utf8');
const mobileCss = fs.readFileSync(path.join(__dirname, '..', 'web-client', 'public', 'mobile-adaptive.css'), 'utf8');
const serviceWorker = fs.readFileSync(path.join(__dirname, '..', 'web-client', 'public', 'sw.js'), 'utf8');

test('browser LIVE uses the authenticated Netcup relay without an Euler key', () => {
  assert.match(app, /new URL\('\/api\/live',location\.href\)/);
  assert.doesNotMatch(app, /ws\.eulerstream\.com/);
  assert.doesNotMatch(app, /if\(!nativeLive&&!key\)/);
  assert.match(relay, /TikTokLiveConnection/);
  assert.match(relay, /SELECT u\.id FROM sessions/);
  assert.match(relay, /digest\("base64"\)/);
  assert.match(relay, /UserOfflineError\|is/);
  assert.match(relay, /url\.pathname !== "\/api\/live"/);
  assert.match(html, /euler-setting-row" hidden/);
  assert.match(html, /https:\/\/app\.czatboxtt\.com\//);
  assert.doesNotMatch(html, /czatbox-tt-mobile\.p548bzdpmd\.workers\.dev/);
});

test('mobile LIVE reconnects after returning from the background', () => {
  assert.match(app, /visibilityState!==['"]visible['"]/);
  assert.match(app, /state\.reconnectAttempt=0;connectLive\(\)/);
});

test('mobile chat keeps messages inside a viewport-bounded scroll frame', () => {
  assert.match(html, /mobile-adaptive\.css\?v=128/);
  assert.match(serviceWorker, /czatbox-ttm-v221/);
  assert.match(serviceWorker, /mobile-adaptive\.css\?v=128/);
  assert.match(mobileCss, /\.chat-card\{[^}]*height:max\(360px,calc\(100dvh - 330px\)\)/);
  assert.match(mobileCss, /\.chat-card \.chat-feed\{overflow-y:auto!important;overscroll-behavior:contain/);
});
