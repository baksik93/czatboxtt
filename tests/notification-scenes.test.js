const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'web-client/public/app-hotfix-v177.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'web-client/public/workspace-codex-v179.css'), 'utf8');
const mobileCss = fs.readFileSync(path.join(root, 'web-client/public/mobile-adaptive.css'), 'utf8');

test('freeze battle event is queued only as a right-side alert', () => {
  assert.match(app, /function notifyBattleFreeze\(/);
  assert.match(app, /else notifyBattleFreeze\(event\.special\);return/);
  assert.doesNotMatch(app, /notifyBattleFreeze\(event\.special\);appendEvent\(/);
});

test('all special notifications share one fixed card size', () => {
  assert.match(css, /\.gift-alert-card\{[\s\S]*?width:360px!important[\s\S]*?height:112px!important/);
});

test('each requested notification scene has its own palette and animation', () => {
  for (const type of ['moderator', 'superfan', 'guardian', 'multiplier', 'freeze']) {
    assert.match(css, new RegExp(`data-alert-type="${type}"`));
  }
  for (const animation of ['hammer-lights', 'feather-fall', 'rain-fall', 'number-fall', 'snow-fall']) {
    assert.match(css, new RegExp(`@keyframes ${animation}`));
  }
  assert.match(css, /data-alert-type="multiplier"[^}]*#5c1508[^}]*#ff7c27/);
  assert.match(css, /data-alert-type="freeze"[^}]*#092957[^}]*#d9f5ff/);
});

test('static notification backgrounds are exact 360 by 112 assets', () => {
  for (const type of ['moderator', 'superfan', 'guardian', 'multiplier', 'freeze']) {
    const image = fs.readFileSync(path.join(root, `web-client/public/alerts/${type}.png`));
    assert.equal(image.readUInt32BE(16), 360, `${type} width`);
    assert.equal(image.readUInt32BE(20), 112, `${type} height`);
    assert.match(css, new RegExp(`url\\('/alerts/${type}\\.png'\\)`));
  }
  assert.match(css, /gift-alert-card:not\(\[data-alert-type="gift"\]\) \.gift-alert-visual\{visibility:hidden\}/);
});

test('mobile notifications are rendered over the chat frame with matching role scenes', () => {
  assert.match(app, /function giftAlertHost\(\)\{return document\.documentElement\.dataset\.platform==='mobile'\?\$\('\.chat-card'\)\|\|document\.body:document\.body\}/);
  assert.match(app, /if\(overlay\.parentElement!==host\)host\.append\(overlay\)/);
  assert.match(mobileCss, /\.chat-card>\.gift-alert-overlay\{position:absolute!important;inset:0!important;z-index:30!important/);
  for (const type of ['moderator', 'superfan', 'guardian']) {
    assert.match(mobileCss, new RegExp(`data-alert-type="${type}"[^}]*url\\('/alerts/${type}\\.png'\\)`));
  }
});

test('gift events resolve their image from the shared local catalog before mobile rendering', () => {
  assert.match(app, /catalogGift=\(window\.CZATBOX_GIFT_CATALOG\|\|\{\}\)\[giftId\]/);
  assert.match(app, /event\.giftImage=String\(catalogGift\.image\|\|remoteImage\|\|''\)/);
  assert.match(app, /giftImage:item\.giftImage\|\|'\/gift-alert\.png'/);
});

test('delayed role alerts require a recent neutral join and include moderators', () => {
  assert.match(app, /function notifyDelayedRoleJoin\(event,role\)/);
  assert.match(app, /pendingKey=keys\.find\(key=>state\.pendingMemberJoins\.has\(key\)\)/);
  assert.match(app, /if\(!pendingKey\)return false/);
  assert.match(app, /function notifyDelayedModeratorJoin\(event\)\{return notifyDelayedRoleJoin\(event,'moderator'\)\}/);
  assert.match(app, /notifyDelayedGuardianJoin\(event\);\s*notifyDelayedModeratorJoin\(event\);\s*notifyDelayedSuperFanJoin\(event\)/);
  assert.match(app, /state\.moderatorNoticeSeen=new Map\(\)/);
});

test('all eight selectable theme families define full opaque palettes', () => {
  for (const theme of ['dark-titanium', 'white-titanium', 'chill-serwis', 'rose-gold-glass', 'lazarskie-rejony', 'miami-vice', 'drwinka', 'sloneczna-polana']) {
    const match = new RegExp(`:root\\[data-theme="${theme}"\\](?:,:root\\[data-theme="[^"]+"\\])?\\{`).exec(css);
    const start = match?.index ?? -1;
    assert.notEqual(start, -1, `missing ${theme}`);
    const block = css.slice(start, css.indexOf('}', start));
    for (const token of ['--bg:', '--panel:', '--panel2:', '--line:', '--text:', '--muted:', '--cyan:', '--pink:', '--accent:', '--shadow:', '--theme-canvas:', '--theme-chrome:', '--theme-panel:', '--theme-row:', '--theme-control:', '--workspace-shell-border:', '--workspace-shell-shadow:', '--codex-chrome:', '--codex-sidebar:', '--codex-workspace:', '--codex-divider:', '--codex-hover:', '--codex-active:']) {
      assert.ok(block.includes(token), `${theme} missing ${token}`);
    }
  }
});

test('desktop workspaces use one rounded Codex-style shell without square module overrides', () => {
  assert.match(css, /--workspace-shell-radius:17px/);
  assert.match(css, /\.tab\.active\{[\s\S]*?margin:0!important;[\s\S]*?border-radius:var\(--workspace-shell-radius\) var\(--workspace-shell-radius\) 0 0!important/);
  assert.match(css, /#chat \.desktop-chat-content\{[\s\S]*?border:0;[\s\S]*?border-radius:var\(--workspace-shell-radius\) var\(--workspace-shell-radius\) 0 0;[\s\S]*?overflow:hidden/);
  assert.match(css, /\.notes-dialog,[\s\S]*?\.calendar-panel,[\s\S]*?\.radio-panel\{[\s\S]*?border-radius:var\(--workspace-shell-radius\) var\(--workspace-shell-radius\) 0 0!important/);
  assert.match(css, /\.timer-dialog\{[\s\S]*?border-radius:var\(--workspace-shell-radius\) var\(--workspace-shell-radius\) 0 0!important/);
  assert.doesNotMatch(css, /--workspace-shell-gap:/);
});

test('Electron merges the application menu with one theme-aware Windows title bar', () => {
  const main = fs.readFileSync(path.join(root, 'src/main.js'), 'utf8');
  const preload = fs.readFileSync(path.join(root, 'src/desktop-preload.js'), 'utf8');
  const workspace = fs.readFileSync(path.join(root, 'web-client/public/workspace-shell-v150.js'), 'utf8');
  assert.match(main, /titleBarStyle: 'hidden'/);
  assert.match(main, /titleBarOverlay: \{ color: '#0c1119', symbolColor: '#f5f7fb', height: 35 \}/);
  assert.match(main, /desktop:titlebar-theme/);
  assert.match(preload, /setTitleBarTheme:/);
  assert.match(workspace, /classList\.add\('electron-shell'\)/);
  assert.match(css, /electron-shell \.desktop-menu-bar\{padding-right:146px\}/);
  assert.match(css, /-webkit-app-region:drag/);
  assert.match(workspace, /setTitleBarTheme/);
  assert.match(fs.readFileSync(path.join(root, 'web-client/public/index.html'), 'utf8'), /workspace-shell-v150\.js\?v=158/);
});

test('Słoneczna polana uses dark teal, gold, yellow and white throughout the interface', () => {
  const html = fs.readFileSync(path.join(root, 'web-client/public/index.html'), 'utf8');
  const deployedCss = fs.readFileSync(path.join(root, 'web-client/public/workspace-codex-v179.css'), 'utf8');
  const start = css.indexOf(':root[data-theme="sloneczna-polana"]{');
  const block = css.slice(start, css.indexOf('}', start));
  assert.match(html, /data-value="sloneczna-polana">Słoneczna polana</);
  assert.match(block, /#052d36/i);
  assert.match(block, /#ffd23f/i);
  assert.match(block, /#eeb718/i);
  assert.match(block, /#ffffff/i);
  assert.match(css, /data-theme="sloneczna-polana"[^}]*\.desktop-sidebar/);
  assert.equal(deployedCss, css);
  assert.match(html, /workspace-codex-v179\.css\?v=182/);
});

test('Drwinka uses a black yellow white palette and animated menu accents', () => {
  const start = css.indexOf(':root[data-theme="drwinka"]{');
  const block = css.slice(start, css.indexOf('}', start));
  assert.match(block, /#050505/i);
  assert.match(block, /#ffd900/i);
  assert.match(block, /#fffef4/i);
  assert.match(css, /data-theme="drwinka"[^}]*\.desktop-sidebar button::before/);
  assert.match(css, /translateX\(-145%\) skewX\(-18deg\)/);
  assert.match(css, /data-theme="drwinka"[^}]*\.settings-index button:hover/);
  assert.match(css, /data-theme="drwinka"[^}]*\.desktop-menu-bar/);
  assert.match(css, /background:#ffd900!important/);
  assert.match(css, /data-theme="drwinka"[^}]*\.settings-content/);
});

test('Miami Vice restores distinct pink, violet and cyan surfaces', () => {
  const start = css.indexOf(':root[data-theme="miami-vice"]{');
  const block = css.slice(start, css.indexOf('}', start));
  assert.match(block, /#ff68c6/i);
  assert.match(block, /#7b246c/i);
  assert.match(block, /#075f79/i);
  assert.match(block, /--theme-(canvas|chrome|panel|row|control):/);
  assert.match(css, /data-theme="miami-vice"[^\n]+\.chat-main-column \.chat-card\{[^}]*radial-gradient\(circle at 10% 8%,#ff58c75c[^}]*radial-gradient\(circle at 92% 14%,#32dff05c[^}]*linear-gradient\(132deg,#180c38 0%,#4b1b67 48%,#0a5270 100%\)/s);
  assert.match(css, /data-theme="miami-vice"[^\n]+\.chat-main-column \.chat-feed,[^}]+background:transparent!important/);
});

test('Dark Titanium uses one coherent graphite and cold-metal palette', () => {
  const refresh = css.indexOf(':root[data-theme="dark-titanium"]{', css.indexOf('/* Titanium and Enigma refresh'));
  const block = css.slice(refresh, css.indexOf('}', refresh));
  assert.match(block, /#070a0f/i);
  assert.match(block, /#53d7f4/i);
  assert.match(block, /#df6d9e/i);
  assert.match(css, /data-theme="dark-titanium"[^\n]+\.chat-message\{background:transparent!important/);
  assert.match(css, /data-theme="dark-titanium"[^\n]+:is\(\.brand-mark,\.empty-orbit\)/);
});

test('White Titanium has a readable animated pearlescent underlay', () => {
  assert.match(css, /data-theme="white-titanium"[^\n]+#chat \.desktop-chat-content,[\s\S]*?animation:white-titanium-flow 18s ease-in-out infinite alternate/);
  assert.match(css, /@keyframes white-titanium-flow/);
  assert.match(css, /data-theme="white-titanium"[^\n]+\.chat-message\{background:#ffffff24!important/);
  assert.match(css, /prefers-reduced-motion:reduce[^}]*white-titanium/s);
});

test('Enigma-Z keeps a near-black canvas and restores cyan violet pink neon accents', () => {
  const refresh = css.indexOf(':root[data-theme="lazarskie-rejony"],:root[data-theme="enigma-z"]{', css.indexOf('/* Titanium and Enigma refresh'));
  const block = css.slice(refresh, css.indexOf('}', refresh));
  assert.match(block, /#050712/i);
  assert.match(block, /#39e7ff/i);
  assert.match(block, /#ff4fb8/i);
  assert.match(block, /#8b62ff/i);
  assert.match(css, /data-theme="enigma-z"[^\n]+\.chat-message:hover[^}]*box-shadow:inset 3px 0 0 #ff4fb8[^}]*#39e7ff20/);
});

test('refreshed themes share the complete Codex surface architecture', () => {
  const family = /:is\(\[data-theme="dark-titanium"\],\[data-theme="white-titanium"\],\[data-theme="lazarskie-rejony"\],\[data-theme="enigma-z"\]\)/;
  assert.match(css, new RegExp(`${family.source} :is\\(\\.desktop-menu-bar,\\.topbar\\)`));
  assert.match(css, new RegExp(`${family.source} :is\\(\\.desktop-sidebar,\\.settings-index\\)`));
  assert.match(css, new RegExp(`${family.source} #chat \\.desktop-chat-content`));
  assert.match(css, new RegExp(`${family.source} :is\\(\\.settings-card,\\.account-profile-card,\\.gift-sound-row,\\.surface,\\.live-tool-card,\\.support-qr-card\\)`));
  assert.match(css, new RegExp(`${family.source} :is\\(\\.desktop-menu-dropdown,\\.desktop-submenu,\\.creator-panel,\\.account-quick-menu\\)`));
});

test('refreshed themes use one solid shell and only the workspace top-left corner is rounded', () => {
  for (const [theme, shell] of [['dark-titanium', '#0a0e14'], ['white-titanium', '#dce3e9'], ['enigma-z', '#080a13']]) {
    const pattern = theme === 'enigma-z'
      ? /:root\[data-theme="lazarskie-rejony"\],:root\[data-theme="enigma-z"\]\{--theme-shell:#080a13\}/
      : new RegExp(`:root\\[data-theme="${theme}"\\]\\{--theme-shell:${shell}\\}`);
    assert.match(css, pattern);
  }
  assert.match(css, /:is\(\.desktop-menu-bar,\.topbar,\.desktop-sidebar,\.settings-index\),[\s\S]*?#chat \.desktop-chat-layout\{\s*background:var\(--theme-shell\)!important/);
  assert.match(css, /:is\(\.desktop-sidebar,\.desktop-settings-sidebar,\.settings-index,\.desktop-module-sidebar\),[\s\S]*?background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important/);
  assert.match(css, /#chat\.tab\.active,[\s\S]*?#chat \.desktop-chat-layout\{\s*border-radius:0!important/);
  assert.match(css, /#chat \.desktop-chat-content,[\s\S]*?\.workspace-panel\[data-workspace-panel="chat"\]:not\(\[hidden\]\) \.chat-head\{\s*border-radius:16px 0 0 0!important/);
  const fixStart = css.indexOf('/* The real left navigation surface is .topbar.');
  const fix = css.slice(fixStart);
  assert.doesNotMatch(fix, /border-radius:16px 16px/);
  assert.doesNotMatch(fix, /desktop-sidebar[^}]*background:var\(--theme-shell\)/);
  const finalContract = css.slice(css.indexOf('/* Refreshed themes follow the same final shell contract'));
  assert.match(finalContract, /:is\(\.desktop-menu-bar,\.topbar\)\{[\s\S]*?border:0!important;[\s\S]*?box-shadow:none!important/);
  assert.match(finalContract, /#chat\.tab\.active,[\s\S]*?#chat \.desktop-chat-layout\{[\s\S]*?border-radius:0!important/);
  assert.doesNotMatch(finalContract, /border-radius:16px 16px/);
});
