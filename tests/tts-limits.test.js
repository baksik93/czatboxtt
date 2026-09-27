const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'web-client/public/app-hotfix-v163.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'web-client/public/index.html'), 'utf8');
const worker = fs.readFileSync(path.join(root, 'web-client/public/sw.js'), 'utf8');

test('TTS quotas use 800 daily and 5600 weekly listened messages', () => {
  assert.match(app, /TTS_DAILY_LIMIT=800,TTS_WEEKLY_LIMIT=5600,TTS_RESET_HOUR=4/);
  assert.match(app, /function localWeekKey\(/);
  assert.match(app, /quota\.dayKey!==dayKey[\s\S]*quota\.dailyUsed=0/);
  assert.match(app, /quota\.weekKey!==weekKey[\s\S]*quota\.weeklyUsed=0/);
  assert.match(app, /speechSynthesis\.speak\(utterance\);recordTtsQuotaUsage\(\)/);
});

test('daily and weekly periods renew exactly at local 04:00', () => {
  const helpers = app.match(/const TTS_DAILY_LIMIT=800[\s\S]*?function localWeekKey\(date=new Date\(\)\)\{[^\n]+\}/)?.[0];
  assert.ok(helpers, 'missing quota period helpers');
  const { ttsDayKey, localWeekKey } = new Function(`${helpers};return {ttsDayKey,localWeekKey}`)();
  const mondayBefore = new Date(2026, 8, 28, 3, 59, 59);
  const mondayAt = new Date(2026, 8, 28, 4, 0, 0);
  const tuesdayBefore = new Date(2026, 8, 29, 3, 59, 59);
  const tuesdayAt = new Date(2026, 8, 29, 4, 0, 0);
  assert.equal(ttsDayKey(mondayBefore), '2026-09-27');
  assert.equal(ttsDayKey(mondayAt), '2026-09-28');
  assert.equal(ttsDayKey(tuesdayBefore), '2026-09-28');
  assert.equal(ttsDayKey(tuesdayAt), '2026-09-29');
  assert.equal(localWeekKey(mondayBefore), '2026-09-21');
  assert.equal(localWeekKey(mondayAt), '2026-09-28');
});

test('only messages accepted by the active TTS role and content filters reach the quota', () => {
  const finalSpeak = app.lastIndexOf('function speak(item)');
  const quotaRecord = app.indexOf('recordTtsQuotaUsage()');
  assert.ok(finalSpeak > quotaRecord);
  const source = app.slice(finalSpeak, app.indexOf('\n', finalSpeak));
  assert.match(source, /state\.settings\.privileged&&!item\.moderator&&!item\.superfan&&!isTopThreeGifter\(item\)/);
  assert.match(source, /shouldSkipTts\(item\)/);
  assert.match(source, /state\.speechQueue\.push/);
});

test('the reusable test code grants reset tokens and a token resets both quotas', () => {
  assert.match(app, /TTS_RESET_TEST_CODE='RESET-TTS-TEST'/);
  assert.match(app, /quota\.resetTokens=Math\.min\(999,quota\.resetTokens\+1\)/);
  assert.match(app, /quota\.resetTokens--;quota\.dailyUsed=0;quota\.weeklyUsed=0/);
  assert.match(app, /code!==TTS_RESET_TEST_CODE/);
  assert.match(app, /id="accountUseResetToken"/);
  assert.match(app, /addTtsResetHistory\(quota,'received'\)/);
  assert.match(app, /addTtsResetHistory\(quota,'used'\)/);
});

test('usage settings expose quota bars, exact reset timing, available tokens and 30-day history', () => {
  assert.match(html, /data-settings-target="settings-usage">Użycie i resety/);
  assert.match(html, /id="settings-usage"/);
  assert.match(html, /id="usageDailyBar"/);
  assert.match(html, /id="usageWeeklyBar"/);
  assert.match(html, /id="usageAvailableTab"/);
  assert.match(html, /id="usageHistoryTab"/);
  assert.match(app, /TTS_RESET_HISTORY_WINDOW=30\*24\*60\*60\*1000/);
  assert.match(app, /function nextTtsDailyReset/);
  assert.match(app, /function nextTtsWeeklyReset/);
  assert.match(app, /function renderUsageSettings/);
  assert.match(app, /Brak historii resetów z ostatnich 30 dni/);
});

test('Krita warns exactly once when 10 percent of a daily or weekly quota remains', () => {
  assert.match(app, /KRITA_DAILY_LIMIT_TEXT='Pozostało ci 10% dziennego limitu wiadomości TTS\. Limit zostanie zresetowany o 04:00\. Zawsze możesz  przyspieszyć ten proces, używając żetonu resetu\.'/);
  assert.match(app, /KRITA_WEEKLY_LIMIT_TEXT='Pozostało ci 10% tygodniowego limitu wiadomości TTS\. Limit zostanie zresetowany o 04:00 w poniedziałek\. Zawsze możesz  przyspieszyć ten proces, używając żetonu resetu\.'/);
  const helper = app.match(/function markTtsTenPercentWarnings\(quota\)\{[^\n]+\}/)?.[0];
  assert.ok(helper, 'missing the 10 percent warning helper');
  const mark = new Function('TTS_DAILY_LIMIT', 'TTS_WEEKLY_LIMIT', `${helper};return markTtsTenPercentWarnings`)(800, 5600);
  const quota = { dailyUsed: 719, weeklyUsed: 5039, dailyTenPercentNotified: false, weeklyTenPercentNotified: false };
  assert.deepEqual(mark(quota), { warnDaily: false, warnWeekly: false });
  quota.dailyUsed = 720;
  quota.weeklyUsed = 5040;
  assert.deepEqual(mark(quota), { warnDaily: true, warnWeekly: true });
  assert.deepEqual(mark(quota), { warnDaily: false, warnWeekly: false });
});

test('Krita quota warnings render bold percentage, do not count as TTS and rearm after either reset', () => {
  assert.match(app, /strong\.textContent='10%'/);
  assert.match(app, /kritaKind==='daily-limit'/);
  assert.match(app, /kritaKind==='weekly-limit'/);
  assert.match(app, /if\(warnDaily\)appendKritaMessage\(Date\.now\(\),KRITA_DAILY_LIMIT_TEXT,'daily-limit'\)/);
  assert.match(app, /if\(warnWeekly\)appendKritaMessage\(Date\.now\(\),KRITA_WEEKLY_LIMIT_TEXT,'weekly-limit'\)/);
  assert.doesNotMatch(app, /appendKritaMessage[^\n]+recordTtsQuotaUsage/);
  assert.match(app, /quota\.dayKey!==dayKey\)[^\n]+quota\.dailyTenPercentNotified=false/);
  assert.match(app, /quota\.weekKey!==weekKey\)[^\n]+quota\.weeklyTenPercentNotified=false/);
  assert.match(app, /quota\.resetTokens--;quota\.dailyUsed=0;quota\.weeklyUsed=0;quota\.dailyTenPercentNotified=false;quota\.weeklyTenPercentNotified=false/);
});

test('published entrypoint and offline cache use the quota-enabled assets', () => {
  assert.match(html, /app-hotfix-v163\.js\?v=163/);
  assert.match(html, /workspace-codex-v170\.css\?v=170/);
  assert.match(worker, /czatbox-ttm-v175/);
  assert.match(worker, /app-hotfix-v163\.js\?v=163/);
  assert.match(worker, /fonts\/InterVariable\.woff2/);
});
