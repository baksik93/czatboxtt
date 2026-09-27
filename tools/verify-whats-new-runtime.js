const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

function getJson(url) {
  return new Promise((resolve, reject) => http.get(url, response => {
    let body = '';
    response.setEncoding('utf8');
    response.on('data', chunk => { body += chunk; });
    response.on('end', () => { try { resolve(JSON.parse(body)); } catch (error) { reject(error); } });
  }).on('error', reject));
}

const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

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
  const evaluate = async expression => {
    const response = await call('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (response.exceptionDetails) throw new Error(JSON.stringify(response.exceptionDetails));
    return response.result.value;
  };

  const baseUrl = 'https://czatbox-tt-mobile.p548bzdpmd.workers.dev/';
  await call('Page.navigate', { url: `${baseUrl}?platform=desktop&appVersion=0.3.33&whatsNewVerify=${Date.now()}` });
  await wait(5500);
  await evaluate(`(async()=>{localStorage.removeItem('cttm-whats-new-seen-0.3.33');await window.czatboxDesktop?.saveUserData?.(Object.fromEntries(Object.keys(localStorage).filter(key=>key.startsWith('cttm-')).map(key=>[key,localStorage.getItem(key)])));return true})()`);
  await call('Page.navigate', { url: `${baseUrl}?platform=desktop&appVersion=0.3.33&whatsNewFreshLaunch=${Date.now()}` });
  await wait(5500);
  const result = JSON.parse(await evaluate(`JSON.stringify((()=>{
    const activeBefore=document.querySelector('.tab.active')?.id||'';
    const launcher=document.querySelector('#whatsNewLauncher');launcher.click();
    const backdrop=document.querySelector('.whats-new-backdrop'),panel=document.querySelector('#aboutWhatsNew'),frame=panel.querySelector('.whats-new-frame'),scroll=panel.querySelector('.whats-new-scroll'),header=panel.querySelector('.whats-new-header'),hero=panel.querySelector('.whats-new-hero'),close=panel.querySelector('#whatsNewClose'),rect=panel.getBoundingClientRect(),heroRect=hero.getBoundingClientRect(),scrollRect=scroll.getBoundingClientRect(),closeRect=close.getBoundingClientRect();
    const before={headerTop:header.getBoundingClientRect().top};
    scroll.scrollTop=Math.min(500,scroll.scrollHeight-scroll.clientHeight);
    const after={headerTop:header.getBoundingClientRect().top};
    const scrollContentRight=scrollRect.left+scroll.clientWidth;
    const techItem=panel.querySelector('.whats-new-tech li'),techMarker=getComputedStyle(techItem,'::before');
    const support=panel.querySelector('.whats-new-section.is-support'),sections=[...panel.querySelectorAll('.whats-new-section')];
    const result={script:[...document.scripts].some(script=>script.src.includes('workspace-shell-v145.js?v=145')),style:[...document.styleSheets].some(sheet=>sheet.href?.includes('workspace-codex-v170.css?v=170')),launcherInDock:launcher.parentElement?.id==='accountDock',removedFromHelp:!document.querySelector('[data-help-panel="whats-new"]'),activeBefore,activeDuring:document.querySelector('.tab.active')?.id||'',modalOpen:!backdrop.hidden,panelVisible:getComputedStyle(panel).display!=='none',centred:Math.abs((rect.left+rect.right)/2-innerWidth/2)<2,framed:rect.width>=680&&rect.width<=722&&rect.height<innerHeight*.95,heroEdgeToEdge:Math.abs(heroRect.left-scrollRect.left)<2&&Math.abs(heroRect.right-scrollContentRight)<2&&Math.abs(heroRect.top-scrollRect.top)<2,closeOnRight:closeRect.left>(rect.left+rect.right)/2,noFooter:!panel.querySelector('.whats-new-footer'),noHeroCapsules:!panel.querySelector('.whats-new-hero ul'),embeddedFont:getComputedStyle(panel).fontFamily.includes('Czatbox Inter'),matchingTechMarkers:techMarker.content.includes('✦')&&techMarker.color===getComputedStyle(panel.querySelector('.whats-new-entry h4 span')).color&&techMarker.backgroundColor==='rgba(0, 0, 0, 0)'&&techMarker.backgroundImage==='none'&&techMarker.borderRadius==='0px'&&techMarker.boxShadow==='none'&&getComputedStyle(techItem).backgroundColor==='rgba(0, 0, 0, 0)'&&getComputedStyle(techItem).borderTopWidth==='0px',supportSectionLast:sections.at(-1)===support,supportLinks:Boolean(support?.querySelector('a[href="https://www.patreon.com/15802701/join"]')&&support?.querySelector('a[href="https://www.paypal.com/pool/9sNTKAuayB?sr=wccr"]')),noSeparateSupportPopup:!document.querySelector('.support-intro-backdrop'),title:panel.querySelector('#whatsNewTitle').textContent,date:panel.querySelector('time').textContent,sections:sections.length,entries:panel.querySelectorAll('.whats-new-entry').length,frameHeight:Math.round(frame.getBoundingClientRect().height),scrollable:scroll.scrollHeight>scroll.clientHeight,chromeFixed:Math.abs(before.headerTop-after.headerTop)<1,viewport:{width:innerWidth,height:innerHeight}};scroll.scrollTop=scroll.scrollHeight;return result;
  })())`));
  await wait(300);
  const screenshot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  const output = path.resolve(__dirname, 'whats-new-runtime.png');
  fs.writeFileSync(output, Buffer.from(screenshot.data, 'base64'));
  const closeResult = JSON.parse(await evaluate(`new Promise(resolve=>{const before=document.querySelector('.tab.active')?.id||'';document.querySelector('#whatsNewClose').click();setTimeout(()=>resolve(JSON.stringify({closesToPreviousView:document.querySelector('.whats-new-backdrop').hidden&&(document.querySelector('.tab.active')?.id||'')===before,noSupportPopup:!document.querySelector('.support-intro-backdrop')})),50)})`));
  await evaluate(`(async()=>{await window.czatboxDesktop?.saveUserData?.(Object.fromEntries(Object.keys(localStorage).filter(key=>key.startsWith('cttm-')).map(key=>[key,localStorage.getItem(key)])));return true})()`);
  await call('Page.navigate', { url: `${baseUrl}?platform=desktop&appVersion=0.3.33&nextLaunch=${Date.now()}` });
  await wait(5500);
  const nextLaunch = JSON.parse(await evaluate(`JSON.stringify({seen:localStorage.getItem('cttm-whats-new-seen-0.3.33'),whatsHidden:document.querySelector('.whats-new-backdrop').hidden,noSupportPopup:!document.querySelector('.support-intro-backdrop')})`));
  nextLaunch.valid=nextLaunch.seen==='true'&&nextLaunch.whatsHidden&&nextLaunch.noSupportPopup;
  socket.close();
  if (!result.script || !result.style || !result.launcherInDock || !result.removedFromHelp || !result.modalOpen || !result.panelVisible || !result.centred || !result.framed || !result.heroEdgeToEdge || !result.closeOnRight || !result.noFooter || !result.noHeroCapsules || !result.embeddedFont || !result.matchingTechMarkers || !result.supportSectionLast || !result.supportLinks || !result.noSeparateSupportPopup || result.activeBefore!==result.activeDuring || result.title !== 'Co nowego' || result.sections !== 4 || result.entries < 7 || !result.scrollable || !result.chromeFixed || !closeResult.closesToPreviousView || !closeResult.noSupportPopup || !nextLaunch.valid) throw new Error(`Nieprawidłowy widok runtime: ${JSON.stringify({ ...result, ...closeResult, nextLaunch })}`);
  process.stdout.write(JSON.stringify({ ...result, ...closeResult, nextLaunch, screenshot: output }, null, 2));
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
