const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const app = fs.readFileSync(path.join(__dirname, '../web-client/public/app-hotfix-v177.js'), 'utf8');
const start = app.lastIndexOf('function normalizedGifterValue');
const end = app.indexOf('function scheduleEvent', start);
assert.ok(start >= 0 && end > start, 'missing ranking helpers');
const helpers = app.slice(start, end);

function fixture() {
  const state = { giftTotals: new Map(), tiktokGiftRanking: new Map(), tiktokGiftRankingAt: 0 };
  const value = (object, ...keys) => keys.map(key => object?.[key]).find(item => item !== undefined && item !== null && item !== '');
  const imageUrl = input => typeof input === 'string' ? input : '';
  let persisted = 0;
  const events = [];
  const window = { dispatchEvent: event => events.push(event) };
  class CustomEvent { constructor(type, init) { this.type = type; this.detail = init?.detail; } }
  const api = new Function('state', 'value', 'imageUrl', 'persistLiveSession', 'window', 'CustomEvent', 'queueMicrotask', `${helpers};return {normalizedGifterValue,sameGifterIdentity,currentGiftRankingValues,topThreeMembershipChanges,syncTikTokGiftRanking,addLocalGiftTotal}`)(state, value, imageUrl, () => persisted++, window, CustomEvent, callback => callback());
  return { state, api, events, persisted: () => persisted };
}

test('TikTok ranks becomes the authoritative TOP 3 in its supplied rank order', () => {
  const { state, api, persisted } = fixture();
  api.addLocalGiftTotal({ uniqueId: 'local', name: 'Lokalny' }, 9999);
  const accepted = api.syncTikTokGiftRanking({ ranks: [
    { rank: '1', score: '300', user: { displayId: 'one', nickname: 'Jeden' } },
    { rank: '2', score: '200', user: { displayId: 'two', nickname: 'Dwa' } },
    { rank: '3', score: '100', user: { displayId: 'three', nickname: 'Trzy' } }
  ] });
  assert.equal(accepted, true);
  assert.equal(state.tiktokGiftRanking.size, 3);
  assert.deepEqual(api.currentGiftRankingValues().map(item => item.uniqueId), ['one', 'two', 'three']);
  assert.equal(persisted(), 1);
});

test('local gifts remain a fallback until TikTok sends a ranking snapshot', () => {
  const { api } = fixture();
  api.addLocalGiftTotal({ uniqueId: 'one', name: 'Jeden' }, 10);
  api.addLocalGiftTotal({ uniqueId: 'two', name: 'Dwa' }, 20);
  assert.deepEqual(api.currentGiftRankingValues().map(item => item.uniqueId), ['two', 'one']);
});

test('incomplete gift identity is merged instead of occupying two TOP slots', () => {
  const { state, api } = fixture();
  api.addLocalGiftTotal({ name: 'Ta sama osoba' }, 50);
  api.addLocalGiftTotal({ uniqueId: 'stable-id', name: 'Ta sama osoba' }, 60);
  assert.equal(state.giftTotals.size, 1);
  assert.equal(api.currentGiftRankingValues()[0].coins, 110);
  assert.equal(api.currentGiftRankingValues()[0].uniqueId, 'stable-id');
});

test('stable ids prevent users with the same display name from matching each other', () => {
  const { api } = fixture();
  assert.equal(api.sameGifterIdentity(
    { uniqueId: 'actual-top', name: 'Ten sam nick' },
    { uniqueId: 'other-user', name: 'Ten sam nick' }
  ), false);
  assert.equal(api.sameGifterIdentity(
    { uniqueId: 'ACTUAL-TOP', name: 'Nowy nick' },
    { uniqueId: 'actual-top', name: 'Stary nick' }
  ), true);
});

test('the first or temporarily incomplete ranking snapshot does not create false TOP 3 alerts', () => {
  const { api } = fixture();
  const complete = [
    { uniqueId: 'one', name: 'Jeden' },
    { uniqueId: 'two', name: 'Dwa' },
    { uniqueId: 'three', name: 'Trzy' }
  ];
  assert.deepEqual(api.topThreeMembershipChanges([], complete), { entered: [], dropped: [] });
  assert.deepEqual(api.topThreeMembershipChanges(complete, complete.slice(0, 2)), { entered: [], dropped: [] });
});

test('TOP 3 alerts report membership changes but ignore position-only reordering', () => {
  const { api } = fixture();
  const previous = [
    { uniqueId: 'one', name: 'Jeden' },
    { uniqueId: 'two', name: 'Dwa' },
    { uniqueId: 'three', name: 'Trzy' },
    { uniqueId: 'four', name: 'Cztery' }
  ];
  const reordered = [previous[1], previous[0], previous[2], previous[3]];
  assert.deepEqual(api.topThreeMembershipChanges(previous, reordered), { entered: [], dropped: [] });
  const changed = api.topThreeMembershipChanges(previous, [previous[0], previous[1], previous[3], previous[2]]);
  assert.deepEqual(changed.entered.map(item => item.uniqueId), ['four']);
  assert.deepEqual(changed.dropped.map(item => item.uniqueId), ['three']);
});

test('a real TikTok ranking update emits exactly one structured TOP 3 change event', () => {
  const { api, events } = fixture();
  const snapshot = users => ({ ranks: users.map((uniqueId, index) => ({
    rank: index + 1,
    score: 300 - index * 50,
    user: { displayId: uniqueId, nickname: uniqueId.toUpperCase() }
  })) });
  api.syncTikTokGiftRanking(snapshot(['one', 'two', 'three', 'four']));
  assert.equal(events.length, 0, 'initial snapshot must only establish the baseline');
  api.syncTikTokGiftRanking(snapshot(['one', 'two', 'four', 'three']));
  assert.equal(events.length, 1);
  assert.equal(events[0].type, 'cttm-top-three-changed');
  assert.deepEqual(events[0].detail.entered.map(item => item.uniqueId), ['four']);
  assert.deepEqual(events[0].detail.dropped.map(item => item.uniqueId), ['three']);
  api.syncTikTokGiftRanking(snapshot(['two', 'one', 'four', 'three']));
  assert.equal(events.length, 1, 'position-only changes must not emit another event');
});

test('Krita publishes localized entered and dropped TOP 3 messages without notification spam', () => {
  assert.match(app, /rankingEntered:'\{name\} wchodzi do TOP 3 giftujących!'/);
  assert.match(app, /rankingDropped:'\{name\} spada z TOP 3 giftujących\.'/);
  assert.match(app, /window\.addEventListener\('cttm-top-three-changed'/);
  assert.match(app, /appendKritaMessage\(Date\.now\(\),'','ranking-dropped'/);
  assert.match(app, /appendKritaMessage\(Date\.now\(\),'','ranking-entered'/);
  assert.doesNotMatch(app, /function appendKritaMessage\([^\n]+playCzatboxNotificationSound/);
});

test('an open TOP gifter dialog is refreshed after every TikTok ranking update', () => {
  assert.match(app, /rankingUpdated&&!\$\('#statDialogBackdrop'\)\.hidden&&\$\('#statDialogBackdrop'\)\.dataset\.statDetail==='topGifters'/);
  assert.match(app, /queueMicrotask\(\(\)=>openStatDetail\('topGifters'\)\)/);
  assert.match(app, /backdrop\.dataset\.statDetail=kind/);
  assert.match(app, /ranking=currentGiftRankingValues\(\)\.slice\(0,3\)/);
  assert.doesNotMatch(app, /ranking=currentGiftRankingValues\(\)\.slice\(0,5\)/);
  assert.match(app, /textContent=`\$\{official\?copy\.official:copy\.local\} · \$\{copy\.gifters\}`/);
  assert.doesNotMatch(app, /copy\.gifters\}: \$\{currentGiftRankingValues\(\)\.length\}/);
});
