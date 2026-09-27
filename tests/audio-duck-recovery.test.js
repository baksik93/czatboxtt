const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const renderer = fs.readFileSync(path.resolve(__dirname, '../web-client/public/app-hotfix-v150.js'), 'utf8');
const workspace = fs.readFileSync(path.resolve(__dirname, '../web-client/public/workspace-shell-v138.js'), 'utf8');
const main = fs.readFileSync(path.resolve(__dirname, '../src/main.js'), 'utf8');

test('TTS and gift duck leases are idempotent and always have a timeout', () => {
  assert.match(renderer, /async function acquireAudioDuck\(maxDuration=60000\)/);
  assert.match(renderer, /if\(released\)return;released=true/);
  assert.match(renderer, /timer=setTimeout\(release/);
  assert.match(renderer, /releaseDuck=await acquireAudioDuck\(Math\.max\(5000,buffer\.duration\*1000\+3000\)\)/);
  assert.match(renderer, /finally\{releaseDuck\(\)\}/);
  assert.match(renderer, /const releaseDuck=await acquireAudioDuck\(50000\)/);
  assert.match(renderer, /clearTimeout\(state\.speechWatchdog\);releaseDuck\(\)/);
});

test('gift and TTS duck both desktop audio and in-app radio with independent leases', () => {
  assert.match(renderer, /source=`app-audio-\$\{\+\+localDuckSequence\}`/);
  assert.match(renderer, /detail:\{active:true,source\}/);
  assert.match(renderer, /detail:\{active:false,source\}/);
  assert.match(renderer, /startDesktopDuck=window\.czatboxDesktop\?\.startAudioDucking/);
  assert.match(renderer, /stopDesktopDuck=window\.czatboxDesktop\?\.stopAudioDucking/);
  assert.match(renderer, /const desktopLease=startDesktopDuck\?Promise\.resolve\(\)\.then\(\(\)=>startDesktopDuck\(\)\)/);
  assert.match(renderer, /desktopLease\.then\(result=>result\?\.ok\?stopDesktopDuck\?\.\(\):null\)/);
  assert.match(renderer, /Promise\.race\(\[desktopLease,new Promise\(resolve=>setTimeout\(resolve,2500\)\)\]\)/);
  assert.match(workspace, /const radioDuckSources=new Set\(\)/);
  assert.match(workspace, /radioDuckSources\.add\(source\)/);
  assert.match(workspace, /radioDuckSources\.delete\(source\)/);
  assert.match(workspace, /moderatorCommandDucking=radioDuckSources\.size>0/);
  assert.match(workspace, /radioVolume\(\)\*\(moderatorCommandDucking\?\.18:1\)/);
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
