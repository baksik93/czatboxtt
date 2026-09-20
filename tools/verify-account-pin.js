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
    socket.addEventListener('open', resolve, {once: true});
    socket.addEventListener('error', reject, {once: true});
  });
  const result = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Przekroczono czas testu.')), 12000);
    socket.addEventListener('message', event => {
      const payload = JSON.parse(event.data);
      if (payload.id !== 1) return;
      clearTimeout(timer);
      resolve(payload);
    });
    socket.send(JSON.stringify({id: 1, method: 'Runtime.evaluate', params: {awaitPromise: true, returnByValue: true, expression: `(async()=>{const wait=()=>new Promise(resolve=>setTimeout(resolve,100)),read=()=>{const side=document.querySelector('.topbar').getBoundingClientRect(),account=document.querySelector('.account-dock'),box=account.getBoundingClientRect();return{accountVisible:!account.hidden,marginTop:getComputedStyle(account).marginTop,bottomGap:Math.round(side.bottom-box.bottom),qrHidden:document.querySelector('.support-qr-card').hidden}};document.querySelector('[data-help-panel="program"]').click();await wait();const program=read();document.querySelector('[data-about-panel="mobile"]').click();await wait();const mobile=read();return JSON.stringify({program,mobile})})()`}}));
  });
  socket.close();
  if (result.error || result.result?.exceptionDetails) throw new Error(JSON.stringify(result));
  process.stdout.write(result.result.result.value);
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
