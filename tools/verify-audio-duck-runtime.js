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
  const statePath = path.join(process.env.APPDATA, 'Czatbox TT', 'audio-duck-state.json');
  if (fs.existsSync(statePath)) throw new Error(`Przed testem pozostał plik wyciszenia: ${statePath}`);
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
  const observeLease = async (name, trigger) => {
    await trigger();
    const startedAt = Date.now();
    while (!fs.existsSync(statePath) && Date.now() - startedAt < 6000) await wait(50);
    if (!fs.existsSync(statePath)) throw new Error(`${name}: nie utworzono stanu wyciszenia.`);
    const saved = JSON.parse(fs.readFileSync(statePath, 'utf8').replace(/^\uFEFF/, '') || '[]');
    const restoredAt = Date.now();
    while (fs.existsSync(statePath) && Date.now() - restoredAt < 25000) await wait(100);
    if (fs.existsSync(statePath)) throw new Error(`${name}: stan wyciszenia nie został usunięty po zakończeniu.`);
    return { started: true, restored: true, savedSessions: Array.isArray(saved) ? saved.length : 1, elapsedMs: Date.now() - startedAt };
  };

  const runtime = JSON.parse(await evaluate(`JSON.stringify({
    unlocked:!document.body.classList.contains('beta-locked'),
    hotfix:[...document.scripts].some(script=>script.src.includes('app-hotfix-v150.js?v=150')),
    voiceButton:Boolean(document.querySelector('#testVoice')),
    giftPreviewCount:document.querySelectorAll('.sound-preview:not([disabled])').length
  })`));
  if (!runtime.unlocked || !runtime.hotfix || !runtime.voiceButton) throw new Error(`Nieprawidłowy runtime: ${JSON.stringify(runtime)}`);
  const tts = await observeLease('TTS', () => evaluate(`document.querySelector('#testVoice').click();true`));
  const gift = await observeLease('Gift', async () => {
    const clicked = await evaluate(`(()=>{const button=document.querySelector('.sound-preview:not([disabled])');if(!button)return false;button.click();return true})()`);
    if (!clicked) throw new Error('Brak dostępnej próbki dźwięku giftu.');
  });
  socket.close();
  process.stdout.write(JSON.stringify({ runtime, tts, gift, stateFileRemoved: !fs.existsSync(statePath) }, null, 2));
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
