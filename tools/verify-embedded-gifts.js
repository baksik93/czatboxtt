const http = require('node:http');

function getJson(url) {
  return new Promise((resolve, reject) => http.get(url, response => {
    let body = '';
    response.setEncoding('utf8');
    response.on('data', chunk => { body += chunk; });
    response.on('end', () => {
      try { resolve(JSON.parse(body)); } catch (error) { reject(error); }
    });
  }).on('error', reject));
}

(async () => {
  const port = process.argv[2] || '9333';
  const pages = await getJson(`http://127.0.0.1:${port}/json`);
  const page = pages.find(item => item.type === 'page' && /platform=desktop/.test(item.url));
  if (!page) throw new Error('Nie znaleziono okna aplikacji.');

  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });

  const expression = `(async () => {
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    for (let i = 0; i < 100 && !window.CZATBOX_GIFT_CATALOG; i += 1) await sleep(100);
    const gifts = Object.values(window.CZATBOX_GIFT_CATALOG || {});
    const failures = [];
    for (const gift of gifts) {
      try {
        const response = await fetch(gift.image, { cache: 'no-store' });
        const bytes = await response.arrayBuffer();
        if (!response.ok || bytes.byteLength <= 100) failures.push({ image: gift.image, status: response.status, bytes: bytes.byteLength });
      } catch (error) {
        failures.push({ image: gift.image, error: String(error) });
      }
    }
    return { catalogCount: gifts.length, loadedCount: gifts.length - failures.length, failures };
  })()`;

  const result = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Przekroczono czas testu.')), 120000);
    socket.addEventListener('message', event => {
      const payload = JSON.parse(event.data);
      if (payload.id !== 1) return;
      clearTimeout(timer);
      resolve(payload);
    });
    socket.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { awaitPromise: true, returnByValue: true, expression } }));
  });
  socket.close();
  if (result.error || result.result?.exceptionDetails) throw new Error(JSON.stringify(result));
  process.stdout.write(JSON.stringify(result.result.result.value, null, 2));
})().catch(error => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
