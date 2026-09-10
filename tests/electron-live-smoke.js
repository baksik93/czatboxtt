// Run with electron, not node. Uses an isolated profile and no user credentials.
const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const appRoot = process.env.CZATBOX_SMOKE_APP_ROOT || path.resolve(__dirname, '..');
const smokeCreator = process.env.CZATBOX_SMOKE_CREATOR || 'chill.serwis';
const { LocalLive } = require(path.join(appRoot, 'src/local-live'));
app.setPath('userData', fs.mkdtempSync(path.join(os.tmpdir(), 'czatbox-live-smoke-')));
app.commandLine.appendSwitch('disable-background-timer-throttling');
const live = new LocalLive();
let win;
ipcMain.on('desktop:live-connect', (event, id, username) => {
  if (event.sender === win.webContents) void live.start(id, username, p => event.sender.send('desktop:live-event', p));
});
ipcMain.on('desktop:live-disconnect', (_event, id) => live.stop(id));
const deadline = setTimeout(() => { console.log('FAIL: Electron bridge timeout'); live.stop(); app.exit(1); }, 60000);
app.whenReady().then(async () => {
  win = new BrowserWindow({ show: false, webPreferences: {
    preload: path.join(appRoot, 'src/desktop-preload.js'),
    contextIsolation: true, sandbox: true, nodeIntegration: false, backgroundThrottling: false
  } });
  await win.loadURL('https://czatbox-tt-mobile.p548bzdpmd.workers.dev/');
  const source = fs.readFileSync(path.resolve(__dirname, '../web-client/public/app.js'), 'utf8');
  const adapter = source.slice(source.indexOf('  function nativeChatPacket('), source.indexOf('  function connectLive(){'));
  const result = await win.webContents.executeJavaScript(`(async()=>{
    ${adapter}
    return await new Promise(resolve=>{
      const socket=createLocalLiveSocket(${JSON.stringify(smokeCreator)});let messages=0,opened=false;
      socket.onopen=()=>{opened=true};
      socket.onmessage=event=>{
        if(JSON.parse(event.data).event==='chat'&&++messages>=2){socket.onclose=null;socket.close();resolve({opened,messages,closed:socket.readyState===3})}
      };
      socket.onclose=event=>resolve({error:event.code});
    });
  })()`);
  await new Promise(resolve => setTimeout(resolve, 500));
  clearTimeout(deadline);
  console.log('Electron hidden-window LIVE:', JSON.stringify(result), 'nativeStopped:', live.current === null);
  const ok = result.opened && result.messages >= 2 && result.closed && live.current === null;
  live.stop(); app.exit(ok ? 0 : 1);
}).catch(error => { console.log('FAIL:', error.name); live.stop(); app.exit(1); });
