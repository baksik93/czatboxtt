const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const main = fs.readFileSync(path.join(root, 'src/main.js'), 'utf8');
const workspace = fs.readFileSync(path.join(root, 'web-client/public/workspace.js'), 'utf8');

test('Piper keeps a separate warm server for every desktop voice', () => {
  assert.match(main, /const piperServers = new Map\(\)/);
  assert.match(main, /piperServers\.get\(voice\.slug\)/);
  assert.match(main, /piperServers\.set\(voice\.slug, server\)/);
  assert.match(main, /piperWarmedVoices\.has\(voice\.slug\)/);
  assert.doesNotMatch(main, /if \(piperServer\) stopPiperServer\(\)/);
});

test('all desktop Piper voices are warmed in the background', () => {
  assert.match(main, /for \(const value of orderedVoices\) await window\.czatboxDesktop\.warmPiper\(value\)/);
});

test('mobile instruction is hidden from the desktop help menu', () => {
  assert.doesNotMatch(workspace, /data-help-panel="mobile"/);
  assert.doesNotMatch(workspace, />Instrukcja mobilna<\/button>/);
});
