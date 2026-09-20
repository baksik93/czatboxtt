const fs = require('node:fs');
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
  const pages = await getJson('http://127.0.0.1:9333/json');
  const page = pages.find(item => item.type === 'page' && item.url.startsWith('https://czatbox-tt-mobile.'));
  if (!page) throw new Error('Nie znaleziono okna aplikacji.');
  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  let id = 0;
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    const requestId = ++id;
    const timer = setTimeout(() => reject(new Error(`Przekroczono czas ${method}.`)), 12000);
    const listener = event => {
      const payload = JSON.parse(event.data);
      if (payload.id !== requestId) return;
      clearTimeout(timer);
      socket.removeEventListener('message', listener);
      if (payload.error) reject(new Error(JSON.stringify(payload.error))); else resolve(payload.result);
    };
    socket.addEventListener('message', listener);
    socket.send(JSON.stringify({id: requestId, method, params}));
  });
  const evaluated = await call('Runtime.evaluate', {awaitPromise: true, returnByValue: true, expression: `(async()=>{document.querySelector('.round-nav [data-workspace="chat"]').click();await new Promise(resolve=>setTimeout(resolve,150));const card=document.querySelector('.support-qr-card'),img=card.querySelector('img'),account=document.querySelector('.account-dock'),themes=['dark-titanium','white-titanium','chill-serwis','rose-gold-glass','lazarskie-rejony','miami-vice'],original=document.documentElement.dataset.theme,palettes={};for(const theme of themes){document.documentElement.dataset.theme=theme;palettes[theme]={background:getComputedStyle(card).backgroundImage,border:getComputedStyle(card).borderColor}}document.documentElement.dataset.theme=original;const box=card.getBoundingClientRect(),accountBox=account.getBoundingClientRect();return JSON.stringify({visible:!card.hidden,width:box.width,height:box.height,left:box.left,aboveAccount:box.bottom<=accountBox.top+1,image:{loaded:img.complete,naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight,width:img.getBoundingClientRect().width,height:img.getBoundingClientRect().height},palettes})})()`});
  const screenshot = await call('Page.captureScreenshot', {format: 'png', fromSurface: true});
  fs.writeFileSync('tools/support-qr-runtime.png', Buffer.from(screenshot.data, 'base64'));
  socket.close();
  process.stdout.write(evaluated.result.value);
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
