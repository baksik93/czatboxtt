const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'web-client/public/app.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'web-client/public/index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'web-client/public/corrections.css'), 'utf8');

test('gift sound settings use the embedded gift catalog instead of coin thresholds', () => {
  assert.match(html, />Ustawienia prezentów<\/button>/);
  assert.match(app, /Object\.entries\(window\.CZATBOX_GIFT_CATALOG\|\|\{\}\)/);
  assert.match(app, /giftId:\s*String\(entry\.giftId\)/);
  assert.match(app, /giftSoundEntry\(item\.giftId\)/);
  assert.doesNotMatch(app, /item\.coins>=Number\(setting\.threshold\)/);
  assert.doesNotMatch(app, /Nowy próg monet|Dodaj próg|Progi prezentów/);
});

test('every gift row exposes image, ID, sound library and local file import', () => {
  assert.match(app, /<img src="\$\{gift\.image\}"/);
  assert.match(app, /ID: \$\{gift\.giftId\}/);
  assert.match(app, /soundPickerMarkup\(entry\)/);
  assert.match(app, /class="sound-file-input" type="file" accept="audio\/\*"/);
  assert.match(app, /saveCustomSound\(entry,fileInput\.files\?\.\[0\]\)/);
});

test('legacy thresholds are backed up before migration', () => {
  assert.match(app, /cttm-gift-threshold-backup-v1/);
});

test('all gifts default to Blysk without moving configured gifts to the top', () => {
  assert.match(app, /DEFAULT_GIFT_SOUND='blysk'/);
  assert.match(app, /selected=giftSoundEntry\(item\.giftId\)\?\.sound\|\|DEFAULT_GIFT_SOUND/);
  assert.match(app, /sort\(\(a,b\)=>Number\(a\.coins\)-Number\(b\.coins\)\|\|a\.catalogIndex-b\.catalogIndex\)/);
  assert.doesNotMatch(app, /configured\.has\(b\.giftId\)/);
  assert.match(app, /NO_GIFT_SOUND='none'/);
});

test('gift settings use a full-width responsive tile grid', () => {
  assert.match(css, /#settings #settings-thresholds\.settings-section\{width:100%;max-width:none/);
  assert.match(css, /gift-sound-list\{grid-template-columns:repeat\(auto-fill,minmax\(220px,1fr\)\)/);
  assert.match(css, /grid-template-areas:"gift gift" "picker actions"/);
  assert.doesNotMatch(app, /giftSoundPage|GIFT_SOUND_PAGE_SIZE|giftSoundPrev|giftSoundNext/);
  assert.doesNotMatch(app, /settings-card gift-sounds-card/);
  assert.match(app, /all\.forEach\(gift=>/);
  assert.match(app, /loading="lazy"/);
  assert.match(app, /if\(opening\)pickerMenu\.innerHTML=soundPickerOptionsMarkup\(entry\)/);
  assert.match(app, /id="giftSoundMinCoins"/);
  assert.match(app, /Number\(gift\.coins\)>=giftSoundMinCoins/);
  assert.doesNotMatch(app, /giftSoundResults/);
  assert.match(app, /savedScrollTop=scrollHost\?\.scrollTop\|\|0/);
  assert.match(app, /requestAnimationFrame\(\(\)=>\{restore\(\);requestAnimationFrame\(restore\)\}\)/);
  assert.match(app, /renderGiftSoundRows\(\{preserveScroll:false\}\)/);
});

test('desktop sound pack is embedded and exposed in the built-in pool', () => {
  const expected = ['bambus.mp3', 'chamber-ult.mp3', 'chiki-briki.mp3', 'chill-plakal.mp3',
    'czlowieku.mp3', 'dzieki-chlopcze.mp3', 'dzingiel.mp3', 'hakuna-matataaa.mp3',
    'hee-hee.mp3', 'hungaaa.mp3', 'im-sorry.mp3', 'kurde-halo.mp3', 'light-theme.mp3',
    'meow.mp3', 'message.mp3', 'naruto-bruh.mp3', 'nie-mozna.mp3', 'nyaaa.mp3',
    'old-leon.mp3', 'ostatnia-pipa.mp3', 'parapooo.mp3', 'scierwojad.mp3',
    'tik-tok-dzingiel.mp3', 'tik-tok-gift.mp3', 'tik-tok-grow.mp3', 'tik-tok-slay.mp3',
    'tuturu.mp3', 'univers.mp3', 'valorantc-ham24.mp3', 'wielkie-dzieki.mp3', 'windows-xp.mp3'];
  for (const file of expected) {
    assert.ok(fs.existsSync(path.join(root, 'web-client/public/sounds', file)), `missing ${file}`);
    assert.match(app, new RegExp(`/sounds/${file.replace('.', '\\.')}`));
  }
});
