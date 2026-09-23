const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

const publicDir = path.join(__dirname, '..', 'web-client', 'public');

function loadCatalog() {
  const source = fs.readFileSync(path.join(publicDir, 'gift-catalog.js'), 'utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(source, sandbox, { filename: 'gift-catalog.js' });
  return sandbox.window.CZATBOX_GIFT_CATALOG;
}

test('lokalny katalog prezentow jest kompletny i spojny', () => {
  const catalog = loadCatalog();
  const entries = Object.entries(catalog);
  assert.equal(entries.length, 758);
  assert.deepEqual(
    JSON.parse(JSON.stringify(catalog['5655'])),
    { coins: 1, image: '/gifts/5655.webp', name: 'Róża' }
  );

  for (const [id, gift] of entries) {
    assert.match(id, /^\d+$/);
    assert.ok(Number.isInteger(gift.coins) && gift.coins > 0, `nieprawidlowa cena: ${id}`);
    assert.ok(gift.name, `brak nazwy: ${id}`);
    assert.equal(gift.image, `/gifts/${id}.webp`);
    const image = fs.readFileSync(path.join(publicDir, gift.image));
    assert.ok(image.length > 100, `pusty obraz: ${id}`);
    assert.equal(image.subarray(0, 4).toString('ascii'), 'RIFF', `nieprawidlowy WebP: ${id}`);
    assert.equal(image.subarray(8, 12).toString('ascii'), 'WEBP', `nieprawidlowy WebP: ${id}`);
  }
});

test('interfejs laduje katalog przed kodem obslugi LIVE', () => {
  const html = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');
  const runtimeScript = html.match(/<script src="\/(app(?:-hotfix-v\d+)?\.js)[^"]*"/)?.[1];
  assert.ok(runtimeScript, 'brak glownego skryptu aplikacji');
  assert.ok(html.indexOf('/gift-catalog.js') < html.indexOf(`/${runtimeScript}`));

  const app = fs.readFileSync(path.join(publicDir, 'app.js'), 'utf8');
  assert.match(app, /window\.CZATBOX_GIFT_CATALOG/);
  assert.match(app, /giftImage:item\.giftImage/);
  assert.match(app, /image\.src=alert\.giftImage\|\|'\/gift-alert\.png'/);
});
