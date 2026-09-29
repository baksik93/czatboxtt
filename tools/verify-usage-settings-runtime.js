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
  await call('Page.navigate', { url: `${baseUrl}?platform=desktop&appVersion=0.3.34&usageVerify=${Date.now()}` });
  await wait(5500);
  const result = JSON.parse(await evaluate(`new Promise(resolve=>{
    const closeWhats=()=>{const backdrop=document.querySelector('.whats-new-backdrop');if(backdrop&&!backdrop.hidden)document.querySelector('#whatsNewClose')?.click()};
    closeWhats();setTimeout(()=>{document.querySelector('[data-menu-settings]')?.click();setTimeout(()=>{document.querySelector('[data-settings-target="settings-usage"]')?.click();setTimeout(()=>{
      const section=document.querySelector('#settings-usage'),daily=document.querySelector('#usageDailyBar'),weekly=document.querySelector('#usageWeeklyBar'),historyTab=document.querySelector('#usageHistoryTab'),availableTab=document.querySelector('#usageAvailableTab');
      historyTab.click();const historyVisible=!document.querySelector('#usageHistoryPanel').hidden;availableTab.click();
      document.fonts.load('16px "Czatbox Inter"').then(()=>resolve(JSON.stringify({script:[...document.scripts].some(script=>script.src.includes('app-hotfix-v176.js?v=176')),style:[...document.styleSheets].some(sheet=>sheet.href?.includes('workspace-codex-v178.css?v=178')),shell:[...document.scripts].some(script=>script.src.includes('workspace-shell-v150.js?v=152')),sectionVisible:section&&!section.classList.contains('settings-category-hidden'),navActive:document.querySelector('[data-settings-target="settings-usage"]')?.classList.contains('active'),dailyWidth:daily?.style.width,weeklyWidth:weekly?.style.width,dailyReset:document.querySelector('#usageDailyReset')?.textContent,weeklyReset:document.querySelector('#usageWeeklyReset')?.textContent,availableCount:document.querySelector('#usageResetAvailableCount')?.textContent,historyVisible,fontLoaded:document.fonts.check('16px "Czatbox Inter"'),fontFamily:getComputedStyle(section).fontFamily})));
    },250)},100)},100)})`));
  const screenshot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  const output = path.resolve(__dirname, 'usage-settings-runtime.png');
  fs.writeFileSync(output, Buffer.from(screenshot.data, 'base64'));
  socket.close();
  if (!result.script || !result.style || !result.shell || !result.sectionVisible || !result.navActive || !result.dailyWidth || !result.weeklyWidth || !result.dailyReset.startsWith('Reset nastąpi za ') || !result.weeklyReset.startsWith('Reset nastąpi za ') || !result.historyVisible || !result.fontLoaded || !result.fontFamily.includes('Czatbox Inter')) throw new Error(`Nieprawidłowy widok użycia: ${JSON.stringify(result)}`);
  process.stdout.write(JSON.stringify({ ...result, screenshot: output }, null, 2));
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
