const test = require('node:test');
const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const { LocalLive } = require('../src/local-live');

function fixture() {
  const connections = [];
  class Connection extends EventEmitter {
    constructor(username, options) { super(); this.username = username; this.options = options; connections.push(this); }
    connect() { return new Promise((resolve, reject) => { this.resolve = resolve; this.reject = reject; }); }
    disconnect() { this.closed = true; this.emit('disconnected'); }
  }
  class UserOfflineError extends Error {}
  const sdk = { TikTokLiveConnection: Connection, UserOfflineError,
    ControlEvent: { ERROR: 'error', DISCONNECTED: 'disconnected' },
    WebcastEvent: { CHAT: 'chat', MEMBER: 'member', GIFT: 'gift', ROOM_USER: 'roomUser', LIKE: 'like',
      FOLLOW: 'follow', SHARE: 'share', SOCIAL: 'social', ENVELOPE: 'envelope', STREAM_END: 'streamEnd' } };
  return { connections, sdk, live: new LocalLive(async () => sdk) };
}
const tick = () => new Promise(resolve => setImmediate(resolve));

test('connects without key, forwards events and does not request backlog', async () => {
  const { live, connections } = fixture(); const packets = [];
  const starting = live.start('one', 'creator', packet => packets.push(packet));
  await tick(); const c = connections[0];
  assert.equal(c.options.processInitialData, false);
  assert.equal(c.options.enableExtendedGiftInfo, true);
  assert.equal(c.options.signApiKey, undefined);
  c.resolve(); await starting;
  c.emit('chat', { comment: 'hello', msgId: 123n, nickname: 'N', uniqueId: 'u' });
  assert.equal(packets[0].kind, 'open');
  const message = JSON.parse(packets[1].data);
  assert.equal(message.data.msgId, '123');
  assert.equal(message.data.user.uniqueId, 'u');
  c.emit('social', {}); assert.equal(packets.length, 2);
  live.stop('one'); c.emit('chat', {}); c.emit('error', new Error('late'));
  assert.equal(packets.length, 2); assert.equal(c.closed, true);
});

test('a streak gift is finalized after TikTok omits its final frame', async () => {
  const { live, connections } = fixture(); const packets = [];
  const start = live.start('one', 'creator', p => packets.push(p)); await tick();
  connections[0].resolve(); await start;
  connections[0].emit('gift', { common:{msgId:'m'}, groupId:'g', giftId:'5655', repeatCount:1,
    repeatEnd:0, gift:{id:'5655',name:'Rose',type:1,diamondCount:1}, user:{displayId:'baksik.93',nickname:'Baksik'} });
  assert.equal(packets.filter(p=>p.kind==='message').length,0);
  await new Promise(resolve=>setTimeout(resolve,1600));
  const gift=JSON.parse(packets.find(p=>p.kind==='message').data);
  assert.equal(gift.data.repeatEnd,1);assert.equal(gift.data.gift.name,'Rose');assert.equal(gift.data.user.displayId,'baksik.93');
  live.stop();
});

test('an explicit streak final uses the newest count and is emitted once', async () => {
  const { live, connections } = fixture(); const packets = [];
  const start = live.start('one', 'creator', p => packets.push(p)); await tick();
  connections[0].resolve(); await start;
  const base = { common:{msgId:'m2'}, groupId:'g2', giftId:'5655',
    gift:{id:'5655',name:'Rose',type:1,diamondCount:1}, user:{displayId:'baksik.93',nickname:'Baksik'} };
  connections[0].emit('gift', { ...base, repeatCount:1, repeatEnd:0 });
  connections[0].emit('gift', { ...base, repeatCount:3, repeatEnd:1 });
  connections[0].emit('gift', { ...base, repeatCount:3, repeatEnd:1 });
  const gifts = packets.filter(p => p.kind === 'message').map(p => JSON.parse(p.data));
  assert.equal(gifts.length, 1);
  assert.equal(gifts[0].data.repeatCount, 3);
  live.stop();
});

test('a stale connect cannot close or feed the new creator', async () => {
  const { live, connections } = fixture(); const packets = [];
  const first = live.start('one', 'first', p => packets.push(p)); await tick();
  const second = live.start('two', 'second', p => packets.push(p)); await tick();
  connections[0].resolve(); await first;
  live.stop('one'); assert.equal(live.current.id, 'two');
  connections[0].emit('chat', { comment: 'stale' });
  connections[1].resolve(); await second;
  assert.deepEqual(packets.map(p => p.id), ['two']);
  live.stop();
});

test('stream end is terminal and emitted once', async () => {
  const { live, connections } = fixture(); const packets = [];
  const start = live.start('one', 'creator', p => packets.push(p)); await tick();
  connections[0].resolve(); await start;
  connections[0].emit('streamEnd'); connections[0].emit('disconnected');
  assert.deepEqual(packets.filter(p => p.kind === 'close').map(p => p.code), [4005]);
  assert.equal(live.current, null);
});

test('offline and import failures are handled without unhandled rejections', async () => {
  const { live, connections, sdk } = fixture(); const packets = [];
  const start = live.start('one', 'creator', p => packets.push(p)); await tick();
  connections[0].reject(new sdk.UserOfflineError()); await start;
  assert.equal(packets[0].code, 4404);
  const broken = new LocalLive(async () => { throw new Error('missing dependency'); });
  await broken.start('two', 'creator', p => packets.push(p));
  assert.equal(packets[1].code, 1011);
});
