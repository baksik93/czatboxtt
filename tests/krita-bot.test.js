const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const publicDir = path.resolve(__dirname, '../web-client/public');
const app = fs.readFileSync(path.join(publicDir, 'app-hotfix-v177.js'), 'utf8');
const css = fs.readFileSync(path.join(publicDir, 'workspace-codex-v179.css'), 'utf8');
const html = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');
const worker = fs.readFileSync(path.join(publicDir, 'sw.js'), 'utf8');
const notificationSound = fs.readFileSync(path.join(publicDir, 'notification-sound-v3.js'), 'utf8');
const icons = fs.readFileSync(path.join(publicDir, 'icons.svg'), 'utf8');

test('Krita appears after every 50 non-empty chat messages while connected', () => {
  assert.match(app, /KRITA_TEXT_MESSAGE_INTERVAL=50/);
  assert.match(app, /state\.kritaConnectionOnline&&event\.kind==='chat'&&Boolean\(String\(event\.text\|\|''\)\.trim\(\)\)/);
  assert.match(app, /state\.kritaTextMessageCount\+\+;if\(state\.kritaTextMessageCount>=KRITA_TEXT_MESSAGE_INTERVAL\)\{state\.kritaTextMessageCount=0;appendKritaMessage\(\)\}/);
  assert.match(app, /const newlyOnline=mode==='online'&&!state\.kritaConnectionOnline/);
  assert.match(app, /if\(newlyOnline\)\{state\.kritaTextMessageCount=0;window\.playCzatboxNotificationSound\?\.\(\)\}/);
});

test('Krita row uses the supplied avatar, bot role and exact support links', () => {
  assert.match(app, /name:'Krita'/);
  assert.match(app, /avatar:'\/avatars\/krita\.jpeg'/);
  assert.match(app, /frame\.className='message-avatar krita-avatar-frame'/);
  assert.match(app, /avatar\.className='krita-avatar-image'/);
  assert.match(app, /data-role="bot" title="Bot Czatbox TT"/);
  assert.match(app, /https:\/\/www\.paypal\.com\/pool\/9sNTKAuayB\?sr=wccr/);
  assert.match(app, /https:\/\/www\.patreon\.com\/15802701\/join/);
  assert.match(app, /link\.target='_blank';link\.rel='noopener noreferrer'/);
  assert.ok(fs.statSync(path.join(publicDir, 'avatars/krita.jpeg')).size > 0);
  assert.match(icons, /<symbol id="bot"/);
});

test('Krita has an animated blue nickname and an accessible reduced-motion fallback', () => {
  assert.match(css, /\.chat-message\.krita-bot \.message-author/);
  assert.match(css, /\.chat-message\.krita-bot \.krita-avatar-frame/);
  assert.match(css, /\.chat-message\.krita-bot \.krita-avatar-image/);
  assert.match(css, /width:132%;height:132%/);
  assert.match(css, /animation:krita-name-glow/);
  assert.match(css, /@keyframes krita-name-glow/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
  assert.match(app, /body\.classList\.add\('krita-message-text'\)/);
  assert.match(css, /\.chat-message\.krita-bot \.krita-message-text,/);
  assert.match(css, /\.krita-message-text :is\(strong,a\)\{[^}]*color:transparent!important;[^}]*background:linear-gradient\(90deg,#44c8ff/s);
  assert.doesNotMatch(css, /\.chat-message\.krita-bot\{[^}]*background:/);
});

test('Krita messages stay silent and the bundled sound confirms a successful connection', () => {
  assert.match(app, /function appendKritaMessage\([^\n]+appendEvent\([^\n]+\)\}/);
  assert.doesNotMatch(app, /function appendKritaMessage\([^\n]+playCzatboxNotificationSound/);
  assert.match(app, /if\(newlyOnline\)\{state\.kritaTextMessageCount=0;window\.playCzatboxNotificationSound\?\.\(\)\}/);
  assert.ok(fs.statSync(path.join(publicDir, 'sounds/codex-notification.wav')).size > 0);
  assert.match(notificationSound, /const source='\/sounds\/codex-notification\.wav'/);
  assert.match(notificationSound, /window\.playCzatboxNotificationSound=/);
  assert.match(notificationSound, /new AudioContextClass\(\)/);
  assert.match(notificationSound, /activeContext\.createBufferSource\(\)/);
  assert.match(notificationSound, /return await playFallback\(\)/);
  assert.match(notificationSound, /document\.documentElement\.dataset\.notificationSound='ready'/);
  assert.match(html, /notification-sound-v3\.js\?v=3[^]*app-hotfix-v177\.js\?v=184/);
});

test('published entrypoint and offline cache reference all Krita assets', () => {
  assert.match(html, /workspace-codex-v179\.css\?v=182/);
  assert.match(html, /app-hotfix-v177\.js\?v=184/);
  assert.match(worker, /czatbox-ttm-v221/);
  assert.match(worker, /workspace-codex-v179\.css\?v=182/);
  assert.match(worker, /app-hotfix-v177\.js\?v=184/);
  assert.match(worker, /\/avatars\/krita\.jpeg/);
  assert.match(worker, /\/sounds\/codex-notification\.wav/);
  assert.match(worker, /\/notification-sound-v3\.js\?v=3/);
});
