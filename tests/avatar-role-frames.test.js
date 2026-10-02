const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const publicDir = path.join(__dirname, '..', 'web-client', 'public');
const app = fs.readFileSync(path.join(publicDir, 'app-hotfix-v177.js'), 'utf8');
const css = fs.readFileSync(path.join(publicDir, 'workspace-codex-v179.css'), 'utf8');
const mobileCss = fs.readFileSync(path.join(publicDir, 'mobile-adaptive.css'), 'utf8');
const index = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');
const serviceWorker = fs.readFileSync(path.join(publicDir, 'sw.js'), 'utf8');

test('guardian and Enigma roles survive identity enrichment and reach rendered messages', () => {
  assert.match(app, /const guardian=hasGuardianBadge\(user\)\|\|hasGuardianBadge\(/);
  assert.match(app, /const scene=Number\(value\.badgeScene\?\?value\.badgeSceneType\?\?value\.sceneType\?\?value\.scene_type\);if\(scene===11\)return true/);
  assert.match(app, /live\[-_ \]\?pro/);
  assert.match(app, /const enigma=hasEnigmaBadge\(user\);/);
  assert.match(app, /state\.roleKeys=\{moderator:new Set\(\),superfan:state\.superFanKeys,guardian:new Set\(\),enigma:new Set\(\)\}/);
  assert.match(app, /for\(const role of \['moderator','superfan','guardian','enigma'\]\)/);
  assert.match(app, /guardian:event\.guardian,enigma:event\.enigma/);
  assert.match(app, /\$\{item\.guardian\?' guardian':''\}\$\{item\.enigma\?' enigma':''\}/);
});

test('guardian detection accepts TikTok LIVE_PRO scene 11 without confusing other badges', () => {
  const start = app.indexOf('const guardianBadgeAsset=');
  const end = app.indexOf('  const enigmaBadgeMarker=', start);
  assert.ok(start >= 0 && end > start);
  const detector = vm.runInNewContext(`${app.slice(start, end)};({hasGuardianBadge})`).hasGuardianBadge;
  assert.equal(detector({ badges: [{ badgeScene: 11 }] }), true);
  assert.equal(detector({ newUserBadges: [{ badgeSceneType: 11 }] }), true);
  assert.equal(detector({ avatarBorder: { urlList: ['https://p16.tiktokcdn.com/live_pro_badge.webp'] } }), true);
  assert.equal(detector({ badges: [{ badgeScene: 10, str: { str: 'SUPER_FAN' } }] }), false);
});

test('role frames wrap avatars and use the dedicated transparent assets', () => {
  assert.match(app, /function wrapAvatarWithRoleFrame\(avatar,item\)/);
  assert.match(app, /guardian-frame-hd\.png/);
  assert.match(app, /enigma-frame-hd\.png/);
  assert.match(app, /const avatarNode=battle\?avatar:wrapAvatarWithRoleFrame\(avatar,item\)/);
  assert.ok(fs.existsSync(path.join(publicDir, 'avatar-frames', 'guardian-frame-hd.png')));
  assert.ok(fs.existsSync(path.join(publicDir, 'avatar-frames', 'enigma-frame-hd.png')));
});

test('frames are enabled only for spacious and modern chat layouts', () => {
  assert.match(css, /\.message-avatar-frame-shell\{display:contents\}/);
  assert.match(css, /\.message-avatar-frame\{display:none\}/);
  assert.match(css, /:root\[data-chat-style="modern"\] \.message-avatar-frame-shell,/);
  assert.match(css, /:root\[data-chat-style="spacious"\] \.message-avatar-frame-shell\{/);
  assert.doesNotMatch(css, /:root\[data-chat-style="compact"\][^{]*message-avatar-frame/);
});

test('guardian avatar fills the complete transparent opening of the asymmetric gold frame', () => {
  assert.match(css, /message-avatar-frame-shell\.guardian-frame \.message-avatar\{\s*width:60px!important;\s*height:60px!important;\s*flex-basis:60px!important/);
  assert.match(mobileCss, /message-avatar-frame-shell\.guardian-frame\{position:relative!important;display:grid!important/);
  assert.match(mobileCss, /message-avatar-frame-shell\.guardian-frame \.message-avatar-frame\{[^}]*display:block!important/);
});

test('versioned app, stylesheet and frame assets are wired into the shell cache', () => {
  assert.match(index, /workspace-codex-v179\.css\?v=182/);
  assert.match(index, /app-hotfix-v177\.js\?v=184/);
  assert.match(index, /mobile-adaptive\.css\?v=128/);
  assert.match(serviceWorker, /czatbox-ttm-v221/);
  for (const asset of ['guardian-frame-hd.png', 'enigma-frame-hd.png']) {
    assert.match(serviceWorker, new RegExp(`/avatar-frames/${asset.replace('.', '\\.')}`));
  }
});
