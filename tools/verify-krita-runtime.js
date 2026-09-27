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
  const port = process.argv.find(value => /^--port=\d+$/.test(value))?.split('=')[1] || '9341';
  const pages = await getJson(`http://127.0.0.1:${port}/json`);
  const page = pages.find(item => item.type === 'page' && item.url.startsWith('https://czatbox-tt-mobile.'));
  if (!page) throw new Error('Nie znaleziono głównego okna aplikacji.');

  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  let id = 0;
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    const requestId = ++id;
    const timer = setTimeout(() => reject(new Error(`Przekroczono czas ${method}.`)), 15000);
    const listener = event => {
      const payload = JSON.parse(event.data);
      if (payload.id !== requestId) return;
      clearTimeout(timer);
      socket.removeEventListener('message', listener);
      if (payload.error) reject(new Error(JSON.stringify(payload.error)));
      else resolve(payload.result);
    };
    socket.addEventListener('message', listener);
    socket.send(JSON.stringify({ id: requestId, method, params }));
  });

  const baseUrl = 'https://czatbox-tt-mobile.p548bzdpmd.workers.dev/';
  await call('Page.navigate', { url: `${baseUrl}?platform=desktop&appVersion=0.3.31&demo=1&kritaVerify=${Date.now()}` });
  await new Promise(resolve => setTimeout(resolve, 5000));
  const evaluated = await call('Runtime.evaluate', {
    awaitPromise: true,
    returnByValue: true,
    expression: `JSON.stringify((()=>{
      const row=document.querySelector('.chat-message.krita-bot');
      const author=row?.querySelector('.message-author');
      const badge=row?.querySelector('.role.bot');
      const avatar=row?.querySelector('.krita-avatar-image');
      const avatarFrame=row?.querySelector('.krita-avatar-frame');
      const links=[...row?.querySelectorAll('.krita-support-link')||[]].map(link=>({text:link.textContent,href:link.href,target:link.target,rel:link.rel}));
      const rect=row?.getBoundingClientRect();
      return {
        authGateHidden:document.body.classList.contains('beta-locked')===false,
        scripts:[...document.scripts].map(script=>script.src).filter(Boolean),
        styles:[...document.styleSheets].map(sheet=>sheet.href).filter(Boolean),
        rowCount:document.querySelectorAll('.chat-message.krita-bot').length,
        name:author?.textContent,
        message:row?.querySelector('p')?.innerText,
        badgeTitle:badge?.title,
        badgeIcon:badge?.querySelector('use')?.getAttribute('href'),
        avatar:{src:avatar?.src,complete:avatar?.complete,naturalWidth:avatar?.naturalWidth,naturalHeight:avatar?.naturalHeight,renderedWidth:avatar?.getBoundingClientRect().width,frameWidth:avatarFrame?.getBoundingClientRect().width,frameOverflow:avatarFrame?getComputedStyle(avatarFrame).overflow:null},
        checkboxPresent:Boolean(row?.querySelector('.spam-message-check')),
        links,
        animation:author?getComputedStyle(author).animationName:null,
        rect:rect?{x:rect.x,y:rect.y,width:rect.width,height:rect.height}:null
      };
    })())`
  });
  const verification = JSON.parse(evaluated.result.value);
  if (!verification.rect) throw new Error(`Brak wiersza Krity: ${JSON.stringify(verification)}`);
  const clip = {
    x: Math.max(0, verification.rect.x - 10),
    y: Math.max(0, verification.rect.y - 10),
    width: Math.min(verification.rect.width + 20, 1900),
    height: Math.min(verification.rect.height + 20, 400),
    scale: 1
  };
  const screenshot = await call('Page.captureScreenshot', { format: 'png', fromSurface: true, clip });
  fs.mkdirSync('artifacts', { recursive: true });
  fs.writeFileSync('artifacts/krita-bot-chat-preview.png', Buffer.from(screenshot.data, 'base64'));
  await call('Page.navigate', { url: `${baseUrl}?platform=desktop&appVersion=0.3.31&kritaVerifyDone=${Date.now()}` });
  socket.close();
  process.stdout.write(JSON.stringify(verification, null, 2));
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
