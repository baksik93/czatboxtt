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
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  const message = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Przekroczono czas testu.')), 12000);
    socket.addEventListener('message', event => {
      const payload = JSON.parse(event.data);
      if (payload.id !== 1) return;
      clearTimeout(timer);
      resolve(payload);
    });
    socket.send(JSON.stringify({id: 1, method: 'Runtime.evaluate', params: {
      awaitPromise: true,
      returnByValue: true,
      expression: `(async()=>{const wait=()=>new Promise(resolve=>setTimeout(resolve,120)),result={};for(const name of ['archive','notes','calendar']){document.querySelector('.round-nav [data-workspace="'+name+'"]').click();await wait();const side=document.querySelector('.desktop-module-sidebar'),tools=side.querySelector('.desktop-module-tools'),rows=[...side.querySelectorAll('.archive-session-card,.notes-list>button,.desktop-category-button')],search=tools.querySelector('input[type="search"]'),searchStyle=search?getComputedStyle(search):null;result[name]={sidebarVisible:!side.hidden,title:side.querySelector('[data-module-title]').textContent.trim(),panelVisible:!document.querySelector('[data-workspace-panel="'+name+'"]').hidden,listInSidebar:name==='archive'?side.contains(document.querySelector('#archiveList')):name==='notes'?side.contains(document.querySelector('#notesList')):side.querySelectorAll('.desktop-category-button').length,sidebarWidth:side.getBoundingClientRect().width,toolsFit:tools.scrollWidth<=tools.clientWidth,maxRowWidth:Math.max(0,...rows.map(row=>row.getBoundingClientRect().width)),maxRowHeight:Math.max(0,...rows.map(row=>row.getBoundingClientRect().height)),search:search?{width:search.getBoundingClientRect().width,height:search.getBoundingClientRect().height,padding:searchStyle.padding,borderRadius:searchStyle.borderRadius,borderWidth:searchStyle.borderWidth,background:searchStyle.backgroundColor}:null,iconButtons:[...tools.querySelectorAll('button')].map(button=>({text:button.textContent.trim(),width:button.getBoundingClientRect().width}))};}document.querySelector('.desktop-module-sidebar .desktop-settings-back').click();await wait();result.back={sidebarHidden:document.querySelector('.desktop-module-sidebar').hidden,chatVisible:!document.querySelector('[data-workspace-panel="chat"]').hidden};return JSON.stringify(result)})()`
    }}));
  });
  socket.close();
  if (message.error || message.result?.exceptionDetails) throw new Error(JSON.stringify(message));
  process.stdout.write(message.result.result.value);
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
