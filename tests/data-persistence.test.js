const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const appSource = fs.readFileSync(path.join(__dirname, '..', 'web-client', 'public', 'app.js'), 'utf8');
const mainSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'main.js'), 'utf8');

test('empty cloud collections cannot erase non-empty local data', () => {
  assert.match(appSource, /if\(local\.length&&!incoming\.length\)\{protectedSections\.add\(section\);return local\}/);
  assert.match(appSource, /mergeBy\(state\.creators,remote\.creators/);
  assert.match(appSource, /mergeBy\(state\.archive,remote\.archive/);
  assert.match(appSource, /\['notebook','giftSounds','calendarCategories','calendarEvents','ignoredTtsUsers','userSpamPhrases'\]/);
  assert.match(appSource, /protectedSections\.has\(section\)\?protectedAt/);
});

test('newer local settings win over an older cloud response', () => {
  assert.match(appSource, /localSettingsAreNewer=Number\(requestMeta\.settings\|\|0\)>=Number\(remoteMeta\.settings\|\|0\)/);
  assert.match(appSource, /localSettingsAreNewer\?\{\.\.\.defaults,\.\.\.incomingSettings,\.\.\.state\.settings,eulerKey:localKey\}/);
  assert.match(appSource, /if\(localSettingsAreNewer&&section==='settings'\)return local/);
});

test('desktop data is stored in one canonical user-data file', () => {
  assert.match(mainSource, /CANONICAL_USER_DATA_PATH = path\.join\(app\.getPath\('userData'\), 'canonical-user-data\.json'\)/);
  assert.match(mainSource, /fs\.renameSync\(temporaryPath, CANONICAL_USER_DATA_PATH\)/);
  assert.match(appSource, /loadUserData/);
  assert.match(appSource, /persistCanonicalUserData/);
});

test('empty canonical values cannot erase populated browser storage', () => {
  assert.match(appSource, /protectedArrayKeys=new Set\(\['cttm-creators','cttm-archive','cttm-filters','cttm-custom-gift-sounds','cttm-calendar-categories','cttm-calendar-events'\]\)/);
  assert.match(appSource, /localValue\.length&&Array\.isArray\(incomingValue\)&&!incomingValue\.length\)return current/);
  assert.match(appSource, /\['notebook','giftSounds','calendarCategories','calendarEvents','ignoredTtsUsers','userSpamPhrases'\]/);
});

test('canonical writes keep rotating recovery copies', () => {
  assert.match(mainSource, /CANONICAL_USER_DATA_BACKUP_DIR/);
  assert.match(mainSource, /backupCanonicalUserData\(\)/);
  assert.match(mainSource, /backups\.slice\(10\)/);
});
