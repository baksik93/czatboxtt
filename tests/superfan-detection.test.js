const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const appSource = fs.readFileSync(
  path.join(__dirname, '..', 'web-client', 'public', 'app.js'),
  'utf8'
);

test('ordinary fan-club badge is not treated as a superfan badge', () => {
  const detector = appSource.match(/function hasSuperFanBadge\(user\)\{.*?\n/);
  assert.ok(detector, 'missing hasSuperFanBadge detector');
  assert.match(detector[0], /super_fans_badge_icon/);
  assert.doesNotMatch(detector[0], /\|fans_badge_icon/);
});
