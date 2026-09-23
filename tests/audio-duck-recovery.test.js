const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const renderer = fs.readFileSync(path.resolve(__dirname, '../web-client/public/app.js'), 'utf8');
const main = fs.readFileSync(path.resolve(__dirname, '../src/main.js'), 'utf8');

test('TTS audio duck lease is idempotent and always has a timeout', () => {
  assert.match(renderer, /async function acquireAudioDuck\(maxDuration=60000\)/);
  assert.match(renderer, /if\(released\)return;released=true/);
  assert.match(renderer, /timer=setTimeout\(release/);
  assert.match(renderer, /const releaseDuck=await acquireAudioDuck\(50000\)/);
  assert.match(renderer, /clearTimeout\(state\.speechWatchdog\);releaseDuck\(\)/);
});

test('test and unlock utterances release ducking even when speech events are lost', () => {
  assert.match(renderer, /acquireAudioDuck\(20000\)/);
  assert.match(renderer, /watchdog=setTimeout\(\(\)=>\{speechSynthesis\.cancel\(\);done\(\)\},15000\)/);
});

test('desktop process restores audio after an orphaned duck request', () => {
  assert.match(main, /audioDuckSafetyTimer = setTimeout\(\(\) => void forceRestoreAudio\(\), 90000\)/);
  assert.match(main, /function forceRestoreAudio\(\) \{[\s\S]*clearTimeout\(audioDuckSafetyTimer\)/);
  assert.match(main, /app\.whenReady\(\)\.then\(async \(\) => \{\s*await forceRestoreAudio\(\)/);
});
