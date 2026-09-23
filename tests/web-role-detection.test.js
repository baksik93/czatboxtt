'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const source = fs.readFileSync(path.join(__dirname, '..', 'web-client', 'public', 'app.js'), 'utf8');

test('browser role normalization reads moderator flags only from the event author', () => {
  assert.match(source, /function hasModeratorSignal\(message\)/);
  assert.match(source, /fields\.some\(key=>truthy\(user\?\.\[key\]\)\|\|truthy\(data\?\.\[key\]\)\)\|\|hasModeratorBadge\(user\)/);
  assert.doesNotMatch(source, /hasModeratorBadge\(data\)/);
  assert.match(source, /const moderator=hasModeratorSignal\(message\)/);
});

test('browser remembers moderator identity and renders its badge', () => {
  assert.match(source, /moderator:!!event\.moderator\|\|!!previous\.moderator/);
  assert.match(source, /event\.moderator=!!event\.moderator\|\|!!profile\.moderator/);
  assert.match(source, /data-role="moderator" title="Moderator"/);
});

test('all roles use one persistent identity registry across incomplete packets', () => {
  assert.match(source, /state\.roleKeys=\{moderator:new Set\(\),superfan:state\.superFanKeys,guardian:new Set\(\)\}/);
  assert.match(source, /for\(const role of \['moderator','superfan','guardian'\]\)/);
  assert.match(source, /keys\.some\(key=>registry\.has\(key\)\)/);
  assert.match(source, /rememberEventRoles\(event\)/);
});

test('role registry uses stable prefixed ids and is cleared between live sessions', () => {
  assert.match(source, /function roleIdentityKeyList\(input\)/);
  assert.match(source, /keys\.add\(`\$\{prefix\}:\$\{value\}`\)/);
  assert.match(source, /identityKeys:roleIdentityKeyList\(user\)/);
  assert.match(source, /for\(const registry of Object\.values\(state\.roleKeys\)\)registry\.clear\(\)/);
});

test('guardian and superfan detection cannot inspect unrelated users in the packet', () => {
  assert.match(source, /const guardian=hasGuardianBadge\(user\)/);
  assert.doesNotMatch(source, /const guardian=hasGuardianBadge\(message\)/);
  const detector = source.match(/function hasSuperFanSignal\(input\)\{.*?\n/);
  assert.ok(detector);
  assert.doesNotMatch(detector[0], /hasSuperFanSignalValue\(data/);
});
