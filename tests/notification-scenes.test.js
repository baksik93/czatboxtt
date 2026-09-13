const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'web-client/public/app.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'web-client/public/workspace-v80.css'), 'utf8');

test('freeze battle event is queued as a right-side alert and retained in chat', () => {
  assert.match(app, /function notifyBattleFreeze\(/);
  assert.match(app, /notifyBattleFreeze\(event\.special\);appendEvent\(/);
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

test('all six selectable theme families define full opaque palettes', () => {
  for (const theme of ['dark-titanium', 'white-titanium', 'chill-serwis', 'rose-gold-glass', 'lazarskie-rejony', 'miami-vice']) {
    const start = css.indexOf(`data-theme="${theme}"`);
    assert.notEqual(start, -1, `missing ${theme}`);
    const block = css.slice(start, css.indexOf('}', start));
    for (const token of ['--bg:', '--panel:', '--panel2:', '--line:', '--text:', '--muted:', '--cyan:', '--pink:', '--accent:', '--shadow:', '--theme-canvas:', '--theme-chrome:', '--theme-panel:', '--theme-row:', '--theme-control:']) {
      assert.ok(block.includes(token), `${theme} missing ${token}`);
    }
  }
});

test('Miami Vice restores distinct pink, violet and cyan surfaces', () => {
  const start = css.indexOf('data-theme="miami-vice"');
  const block = css.slice(start, css.indexOf('}', start));
  assert.match(block, /#ff68c6/i);
  assert.match(block, /#7b246c/i);
  assert.match(block, /#075f79/i);
  assert.match(block, /--theme-(canvas|chrome|panel|row|control):/);
});
