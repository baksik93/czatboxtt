const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'web-client/public/app.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'web-client/public/workspace-v80.css'), 'utf8');

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

test('all eight selectable theme families define full opaque palettes', () => {
  for (const theme of ['dark-titanium', 'white-titanium', 'chill-serwis', 'rose-gold-glass', 'lazarskie-rejony', 'miami-vice', 'drwinka', 'sloneczna-polana']) {
    const match = new RegExp(`:root\\[data-theme="${theme}"\\](?:,:root\\[data-theme="[^"]+"\\])?\\{`).exec(css);
    const start = match?.index ?? -1;
    assert.notEqual(start, -1, `missing ${theme}`);
    const block = css.slice(start, css.indexOf('}', start));
    for (const token of ['--bg:', '--panel:', '--panel2:', '--line:', '--text:', '--muted:', '--cyan:', '--pink:', '--accent:', '--shadow:', '--theme-canvas:', '--theme-chrome:', '--theme-panel:', '--theme-row:', '--theme-control:', '--workspace-shell-border:', '--workspace-shell-shadow:']) {
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
  const workspace = fs.readFileSync(path.join(root, 'web-client/public/workspace.js'), 'utf8');
  const deployedWorkspace = fs.readFileSync(path.join(root, 'web-client/public/workspace-shell-v134.js'), 'utf8');
  assert.match(main, /titleBarStyle: 'hidden'/);
  assert.match(main, /titleBarOverlay: \{ color: '#0c1119', symbolColor: '#f5f7fb', height: 35 \}/);
  assert.match(main, /desktop:titlebar-theme/);
  assert.match(preload, /setTitleBarTheme:/);
  assert.match(workspace, /classList\.add\('electron-shell'\)/);
  assert.match(css, /electron-shell \.desktop-menu-bar\{padding-right:146px\}/);
  assert.match(css, /-webkit-app-region:drag/);
  assert.equal(deployedWorkspace, workspace);
});

test('Słoneczna polana uses dark teal, gold, yellow and white throughout the interface', () => {
  const html = fs.readFileSync(path.join(root, 'web-client/public/index.html'), 'utf8');
  const deployedCss = fs.readFileSync(path.join(root, 'web-client/public/workspace-shell-v134.css'), 'utf8');
  const start = css.indexOf(':root[data-theme="sloneczna-polana"]{');
  const block = css.slice(start, css.indexOf('}', start));
  assert.match(html, /data-value="sloneczna-polana">Słoneczna polana</);
  assert.match(block, /#052d36/i);
  assert.match(block, /#ffd23f/i);
  assert.match(block, /#eeb718/i);
  assert.match(block, /#ffffff/i);
  assert.match(css, /data-theme="sloneczna-polana"[^}]*\.desktop-sidebar/);
  assert.equal(deployedCss, css);
  assert.match(html, /workspace-shell-v134\.css\?v=134/);
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
});
