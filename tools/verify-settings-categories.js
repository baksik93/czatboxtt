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
  const pages = await getJson('http://127.0.0.1:9333/json');
  const page = pages.find(item => item.type === 'page' && /platform=desktop/.test(item.url));
  if (!page) throw new Error('Nie znaleziono okna aplikacji.');
  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  const expression = `(async()=>{
    const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
    for(let i=0;i<80&&!document.querySelector('[data-menu-settings]');i++)await sleep(100);
    document.querySelector('[data-menu-settings]').click();await sleep(100);
    const results=[];
    for(const button of document.querySelectorAll('.settings-index [data-settings-target]')){
      button.click();await sleep(25);
      const visible=[...document.querySelectorAll('#settingsContent .settings-section')].filter(section=>getComputedStyle(section).display!=='none').map(section=>section.id);
      results.push({target:button.dataset.settingsTarget,visible,active:button.classList.contains('active')});
    }
    window.dispatchEvent(new CustomEvent('cttm-open-account-settings'));await sleep(150);
    const accountVisible=[...document.querySelectorAll('#settingsContent .settings-section')].filter(section=>getComputedStyle(section).display!=='none').map(section=>section.id);
    return {results,accountVisible,accountActive:document.querySelector('[data-settings-target="settings-account"]')?.classList.contains('active')};
  })()`;
  const result = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Przekroczono czas testu.')), 30000);
    socket.addEventListener('message', event => {
      const payload = JSON.parse(event.data);
      if (payload.id !== 1) return;
      clearTimeout(timer);resolve(payload);
    });
    socket.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { awaitPromise: true, returnByValue: true, expression } }));
  });
  socket.close();
  if (result.error || result.result?.exceptionDetails) throw new Error(JSON.stringify(result));
  process.stdout.write(JSON.stringify(result.result.result.value));
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
