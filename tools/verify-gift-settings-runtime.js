const http = require('node:http');

function getJson(url) {
  return new Promise((resolve, reject) => http.get(url, response => {
    let body = '';
    response.setEncoding('utf8');
    response.on('data', chunk => { body += chunk; });
    response.on('end', () => { try { resolve(JSON.parse(body)); } catch (error) { reject(error); } });
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
  const verifyPersistence = process.argv.includes('--theme-persistence');
  const verifyPicker = process.argv.includes('--sound-picker');
  const expression = verifyPersistence ? `(async()=>{
    const button=document.querySelector('[data-choice="theme"] [data-value="drwinka"]');
    if(!button)throw new Error('Brak przycisku motywu Drwinka');
    button.click();
    await new Promise(resolve=>setTimeout(resolve,4500));
    const settings=JSON.parse(localStorage.getItem('cttm-settings')||'{}');
    return JSON.stringify({storedTheme:settings.theme,domTheme:document.documentElement.dataset.theme,buttonActive:button.classList.contains('active')});
  })()` : verifyPicker ? `(async()=>{
    document.querySelector('[data-settings-target="settings-thresholds"]')?.click();
    const host=document.querySelector('#settingsContent');host.scrollTop=host.scrollHeight;
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    const toggles=[...document.querySelectorAll('.sound-picker-toggle')],toggle=toggles.at(-1);
    toggle.click();
    await new Promise(resolve=>setTimeout(resolve,100));
    const immediate=document.querySelector('.gift-sound-popover'),immediateRect=immediate?.getBoundingClientRect(),immediateState={open:Boolean(immediate&&!immediate.hidden),top:immediateRect?.top,bottom:immediateRect?.bottom};
    await new Promise(resolve=>setTimeout(resolve,2200));
    const menu=document.querySelector('.gift-sound-popover'),rect=menu?.getBoundingClientRect();
    const verification={immediateState,open:Boolean(menu&&!menu.hidden),position:menu?getComputedStyle(menu).position:'missing',top:rect?.top,bottom:rect?.bottom,viewport:innerHeight,insideViewport:Boolean(rect&&rect.top>=0&&rect.bottom<=innerHeight),scrollTop:host.scrollTop,toggles:toggles.length};document.body.click();return JSON.stringify(verification);
  })()` : `JSON.stringify((()=>{
    const creators=JSON.parse(localStorage.getItem('cttm-creators')||'[]');
    const archive=JSON.parse(localStorage.getItem('cttm-archive')||'[]');
    const events=JSON.parse(localStorage.getItem('cttm-calendar-events')||'[]');
    const settings=JSON.parse(localStorage.getItem('cttm-settings')||'{}');
    const settingsButton=document.querySelector('[data-settings-target="settings-thresholds"]');
    document.querySelector('#settings')?.classList.add('active');
    settingsButton?.click();
    document.documentElement.dataset.theme='drwinka';
    const activeStyle=getComputedStyle(document.querySelector('.settings-index button.active'));
    const themeStyle=getComputedStyle(document.documentElement);
    return {
      creators:creators.length,archive:archive.length,events:events.length,
      settingsLabel:settingsButton?.textContent.trim(),
      search:Boolean(document.querySelector('#giftSoundSearch')),
      minCoins:Boolean(document.querySelector('#giftSoundMinCoins')),
      visibility:Boolean(document.querySelector('#giftSoundVisibility')),
      bulkNone:Boolean(document.querySelector('#giftSoundApplyNone')),
      bulkBlysk:Boolean(document.querySelector('#giftSoundApplyBlysk')),
      giftTiles:document.querySelectorAll('.gift-sound-row').length,
      openPopover:Boolean(document.querySelector('.gift-sound-popover:not([hidden])')),
      pagination:(()=>{const element=document.querySelector('#giftSoundPagination'),style=element?getComputedStyle(element):null,rect=element?.getBoundingClientRect();return{present:Boolean(element),label:element?.querySelector('span')?.innerText,position:style?.position,bottom:rect?Math.round(innerHeight-rect.bottom):null,left:rect?Math.round(rect.left):null,right:rect?Math.round(innerWidth-rect.right):null}})(),
      explicitBlysk:(settings.giftSounds||[]).filter(item=>item.sound==='blysk').length,
      visibilityIcon:{present:Boolean(document.querySelector('.gift-visibility-toggle svg path')),width:getComputedStyle(document.querySelector('.gift-visibility-toggle svg')).width},
      settingsIndexOverflow:getComputedStyle(document.querySelector('.settings-index')).overflow,
      drwinka:{theme:document.documentElement.dataset.theme,bg:themeStyle.getPropertyValue('--bg').trim(),accent:themeStyle.getPropertyValue('--accent').trim(),activeColor:activeStyle.color,topbar:getComputedStyle(document.querySelector('.desktop-menu-bar')).backgroundColor,index:getComputedStyle(document.querySelector('.settings-index')).backgroundColor,content:getComputedStyle(document.querySelector('.settings-content')).backgroundColor}
    };
  })())`;
  const result = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Przekroczono czas odczytu.')), 10000);
    socket.addEventListener('message', event => {
      const message = JSON.parse(event.data);
      if (message.id !== 1) return;
      clearTimeout(timeout);
      resolve(message);
    });
    socket.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression, returnByValue: true, awaitPromise: true } }));
  });
  socket.close();
  if (result.result?.exceptionDetails) throw new Error(JSON.stringify(result.result.exceptionDetails));
  process.stdout.write(result.result.result.value);
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
