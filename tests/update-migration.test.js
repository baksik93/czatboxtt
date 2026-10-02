const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const main = fs.readFileSync(path.join(root, 'src/main.js'), 'utf8');
const caddy = fs.readFileSync(path.join(root, 'infrastructure/netcup/Caddyfile'), 'utf8');

test('the 0.3.36 bridge checks the Netcup generic update feed', () => {
  assert.match(main, /const UPDATE_FEED_URL = 'https:\/\/updates\.czatboxtt\.com\/windows'/);
  assert.match(main, /autoUpdater\.setFeedURL\(\{ provider: 'generic', url: UPDATE_FEED_URL \}\)/);
  assert.match(caddy, /updates\.czatboxtt\.com \{[\s\S]*root \* \/srv\/updates[\s\S]*file_server/);
});
