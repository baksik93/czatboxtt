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
    document.querySelector('[data-menu-settings]').click();
    document.querySelector('[data-settings-target="settings-thresholds"]').click();await sleep(120);
    const initialGiftRows=[...document.querySelectorAll('#giftSoundList .gift-sound-row')],initialRows=initialGiftRows.length;
    const firstTop=Math.round(initialGiftRows[0]?.getBoundingClientRect().top||0),tileColumns=initialGiftRows.filter(item=>Math.round(item.getBoundingClientRect().top)===firstTop).length;
    const defaultLabel=initialGiftRows[0]?.querySelector('.sound-picker-toggle span')?.textContent;
    const sectionWidth=Math.round(document.querySelector('#settings-thresholds')?.getBoundingClientRect().width||0),contentWidth=Math.round(document.querySelector('#settingsContent')?.getBoundingClientRect().width||0);
    initialGiftRows[0]?.querySelector('.sound-picker-toggle')?.click();const builtInSoundOptions=initialGiftRows[0]?.querySelectorAll('.sound-picker-option').length-1;document.dispatchEvent(new MouseEvent('click',{bubbles:true}));
    const title=document.querySelector('#settings-thresholds h2')?.textContent;
    const search=document.querySelector('#giftSoundSearch');search.value='5655';search.dispatchEvent(new Event('input',{bubbles:true}));await sleep(80);
    const row=document.querySelector('#giftSoundList .gift-sound-row');
    const persistedBefore=JSON.parse(localStorage.getItem('cttm-settings')||'{}').giftSounds?.find(item=>item.giftId==='5655')||null;
    const customLibraryBefore=JSON.parse(localStorage.getItem('cttm-custom-gift-sounds')||'[]');
    const selectedLabelBefore=row?.querySelector('.sound-picker-toggle span')?.textContent;
    const gift={id:row?.dataset.giftId,name:row?.querySelector('.gift-sound-gift b')?.textContent,meta:row?.querySelector('.gift-sound-gift small')?.textContent,image:row?.querySelector('img')?.getAttribute('src')};
    row.querySelector('.sound-picker-toggle').click();row.querySelector('[data-sound-id="aura"]').click();await sleep(80);
    const standard=JSON.parse(localStorage.getItem('cttm-settings')).giftSounds.find(item=>item.giftId==='5655');
    const configuredRow=document.querySelector('#giftSoundList .gift-sound-row');
    const input=configuredRow.querySelector('.sound-file-input'),transfer=new DataTransfer(),blob=await (await fetch('/sounds/bambus.mp3')).blob(),file=new File([blob],'test-wlasny-bambus.mp3',{type:'audio/mpeg'});transfer.items.add(file);input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}));await sleep(350);
    const custom=JSON.parse(localStorage.getItem('cttm-settings')).giftSounds.find(item=>item.giftId==='5655');
    const customLibrary=JSON.parse(localStorage.getItem('cttm-custom-gift-sounds')||'[]');
    return {title,initialRows,tileColumns,defaultLabel,builtInSoundOptions,sectionWidth,contentWidth,gift,persistedBefore,selectedLabelBefore,customLibraryCountBefore:customLibraryBefore.length,standard,custom,customLibraryCount:customLibrary.length,resultText:document.querySelector('#giftSoundResults')?.textContent||null};
  })()`;
  const result = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Przekroczono czas testu.')), 30000);
    socket.addEventListener('message', event => {
      const payload = JSON.parse(event.data);if(payload.id!==1)return;clearTimeout(timer);resolve(payload);
    });
    socket.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { awaitPromise: true, returnByValue: true, expression } }));
  });
  socket.close();
  if (result.error || result.result?.exceptionDetails) throw new Error(JSON.stringify(result));
  process.stdout.write(JSON.stringify(result.result.result.value));
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
