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
  const port = process.argv.find(value => /^--port=\d+$/.test(value))?.split('=')[1] || '9333';
  const pages = await getJson(`http://127.0.0.1:${port}/json`);
  const page = pages.find(item => item.type === 'page' && /platform=desktop/.test(item.url));
  if (!page) throw new Error('Nie znaleziono głównego okna aplikacji.');
  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  let requestId = 0;
  const evaluate = expression => new Promise((resolve, reject) => {
    const id = ++requestId;
    const timeout = setTimeout(() => reject(new Error('Przekroczono czas testu runtime.')), 15000);
    const listener = event => {
      const message = JSON.parse(event.data);
      if (message.id !== id) return;
      socket.removeEventListener('message', listener);
      clearTimeout(timeout);
      if (message.result?.exceptionDetails) reject(new Error(message.result.exceptionDetails.text));
      else resolve(message.result?.result?.value);
    };
    socket.addEventListener('message', listener);
    socket.send(JSON.stringify({ id, method: 'Runtime.evaluate', params: { expression, returnByValue: true, awaitPromise: true } }));
  });

  await evaluate(`(()=>{
    const settings=JSON.parse(localStorage.getItem('cttm-settings')||'{}');
    settings.giftSounds=[
      {giftId:'5655',sound:'none',hidden:false,manualSound:false},
      {giftId:'5269',sound:'univers',hidden:false,manualSound:true},
      {giftId:'6064',sound:'none',hidden:false,manualSound:true}
    ];
    localStorage.setItem('cttm-settings',JSON.stringify(settings));
    localStorage.setItem('cttm-gift-blysk-silent-v1','done');
    localStorage.removeItem('cttm-gift-blysk-restore-v2');
    location.reload();
  })()`);
  await new Promise(resolve => setTimeout(resolve, 1200));
  const result = JSON.parse(await evaluate(`(async()=>{
    const settings=JSON.parse(localStorage.getItem('cttm-settings')||'{}');
    const byId=Object.fromEntries((settings.giftSounds||[]).map(item=>[item.giftId,item]));
    const response=await fetch('/sounds/blysk.mp3');
    const bytes=await response.arrayBuffer();
    const AudioContextClass=window.AudioContext||window.webkitAudioContext;
    const context=new AudioContextClass();
    const decoded=await context.decodeAudioData(bytes.slice(0));
    await context.close();
    return JSON.stringify({
      restored:byId['5655'],
      preservedSound:byId['5269'],
      preservedManualSilence:byId['6064'],
      marker:localStorage.getItem('cttm-gift-blysk-restore-v2'),
      soundAsset:{ok:response.ok,bytes:bytes.byteLength,duration:decoded.duration}
    });
  })()`));
  socket.close();
  if (result.restored?.sound !== 'blysk' || result.restored?.manualSound !== true) throw new Error('Nie przywrócono błędnie wyciszonego Błysku.');
  if (result.preservedSound?.sound !== 'univers') throw new Error('Nadpisano wcześniej wybrany dźwięk.');
  if (result.preservedManualSilence?.sound !== 'none') throw new Error('Nadpisano ręczne ustawienie Brak dźwięku.');
  if (result.marker !== 'done') throw new Error('Migracja nie została oznaczona jako wykonana.');
  if (!result.soundAsset.ok || result.soundAsset.bytes < 1000 || !(result.soundAsset.duration > 0)) throw new Error('Wbudowany dźwięk nie został poprawnie pobrany i zdekodowany.');
  process.stdout.write(JSON.stringify(result));
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
