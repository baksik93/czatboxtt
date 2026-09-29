const http = require('node:http');

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
  await call('Page.navigate', { url: `${baseUrl}?platform=desktop&appVersion=0.3.34&quotaVerify=${Date.now()}` });
  await wait(5000);
  const result = JSON.parse(await evaluate(`JSON.stringify((()=>{
    const quotaKeys=()=>Object.keys(localStorage).filter(key=>key.startsWith('cttm-tts-quota:'));
    const backup=Object.fromEntries(quotaKeys().map(key=>[key,localStorage.getItem(key)]));
    const redeem=()=>{const input=document.querySelector('#code');input.value='RESET-TTS-TEST';document.querySelector('#codeForm').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))};
    redeem();
    const key=quotaKeys().find(candidate=>JSON.parse(localStorage.getItem(candidate)||'{}').resetTokens>0);
    if(!key)throw new Error('Kod nie utworzył żetonu.');
    const now=new Date(),period=new Date(now);period.setHours(period.getHours()-4);const monday=new Date(period.getFullYear(),period.getMonth(),period.getDate());monday.setDate(monday.getDate()-((monday.getDay()+6)%7));
    const dateKey=date=>date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0')+'-'+String(date.getDate()).padStart(2,'0');
    localStorage.setItem(key,JSON.stringify({dayKey:dateKey(period),weekKey:dateKey(monday),dailyUsed:123,weeklyUsed:456,resetTokens:1,dailyTenPercentNotified:true,weeklyTenPercentNotified:true}));
    const toggle=document.querySelector('#accountLimitsToggle');if(toggle.getAttribute('aria-expanded')!=='true')toggle.click();else toggle.click(),toggle.click();
    const before={daily:document.querySelector('#accountDailyLimit').textContent,weekly:document.querySelector('#accountWeeklyLimit').textContent,tokens:document.querySelector('#accountResetTokens').textContent,resetDisabled:document.querySelector('#accountUseResetToken').disabled};
    document.querySelector('#accountUseResetToken').click();
    const resetState=JSON.parse(localStorage.getItem(key));
    redeem();redeem();
    const repeatedState=JSON.parse(localStorage.getItem(key));
    for(const candidate of quotaKeys())localStorage.removeItem(candidate);
    for(const[candidate,value]of Object.entries(backup))localStorage.setItem(candidate,value);
    return{unlocked:!document.body.classList.contains('beta-locked'),script:[...document.scripts].some(script=>script.src.includes('app-hotfix-v176.js?v=175')),style:[...document.styleSheets].some(sheet=>sheet.href?.includes('workspace-codex-v178.css?v=177')),before,resetState,repeatedTokens:repeatedState.resetTokens,restored:Object.keys(backup).every(candidate=>localStorage.getItem(candidate)===backup[candidate])};
  })())`));
  await call('Page.navigate', { url: `${baseUrl}?platform=desktop&appVersion=0.3.34&quotaVerifyDone=${Date.now()}` });
  socket.close();
  if (!result.unlocked || !result.script || !result.style) throw new Error(`Nieprawidłowe zasoby runtime: ${JSON.stringify(result)}`);
  if (result.before.daily !== '85%' || result.before.weekly !== '92%' || result.before.tokens !== '1' || result.before.resetDisabled) throw new Error(`Nieprawidłowy licznik: ${JSON.stringify(result.before)}`);
  if (result.resetState.dailyUsed !== 0 || result.resetState.weeklyUsed !== 0 || result.resetState.resetTokens !== 0 || result.resetState.dailyTenPercentNotified || result.resetState.weeklyTenPercentNotified) throw new Error(`Reset nie wyzerował limitów ani ostrzeżeń: ${JSON.stringify(result.resetState)}`);
  if (result.repeatedTokens !== 2 || !result.restored) throw new Error(`Kod wielokrotny albo odtworzenie danych nie działa: ${JSON.stringify(result)}`);
  process.stdout.write(JSON.stringify(result, null, 2));
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
