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
  const page = pages.find(item => item.type === 'page' && !/desktop-widget\.html/.test(item.url));
  if (!page) throw new Error('Nie znaleziono okna aplikacji.');
  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  const expression = `(async()=>{
    const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
    for(let i=0;i<80&&!document.querySelector('.desktop-menu-bar');i++)await sleep(100);
    await sleep(3500);
    const timed=async action=>{const start=performance.now();const result=await action();return{ms:Math.round(performance.now()-start),ok:result?.ok,cached:!!result?.cached,error:result?.error||''}};
    const mrWarm=await timed(()=>window.czatboxDesktop.warmPiper('piper-mr-drwina'));
    const halinkaWarm=await timed(()=>window.czatboxDesktop.warmPiper('piper-halinka'));
    const mrSpeech=await timed(()=>window.czatboxDesktop.synthesizePiper('piper-mr-drwina','Test głosu.'));
    const halinkaSpeech=await timed(()=>window.czatboxDesktop.synthesizePiper('piper-halinka','Test głosu.'));
    return {version:new URLSearchParams(location.search).get('appVersion'),mobileHelp:!!document.querySelector('[data-help-panel="mobile"]'),mrWarm,halinkaWarm,mrSpeech,halinkaSpeech};
  })()`;
  const result = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Przekroczono czas testu.')), 60000);
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
  process.stdout.write(JSON.stringify(result.result.result.value));
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
