const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const workspace=fs.readFileSync(path.join(root,'web-client/public/workspace.js'),'utf8');
const html=fs.readFileSync(path.join(root,'web-client/public/index.html'),'utf8');
const worker=fs.readFileSync(path.join(root,'services/patreon-feed-worker/src/index.js'),'utf8');

assert.match(workspace,/dataset\.workspace='patreon'/,'brak przycisku Patreon w menu');
assert.ok(workspace.indexOf("dataset.timer='true'")<workspace.indexOf("dataset.workspace='patreon'")&&workspace.indexOf("dataset.workspace='patreon'")<workspace.indexOf("dataset.giveaway='true'"),'Patreon powinien być między Minutnikiem a Giveaway');
assert.match(workspace,/cttm-patreon-posts-cache-v1/,'brak pamięci podręcznej postów');
assert.match(workspace,/CZATBOX_PATREON_FEED_ENDPOINT\|\|'https:\/\/czatbox-patreon-feed\.p548bzdpmd\.workers\.dev\/posts'/,'brak niezależnego od cache adresu kanału');
assert.match(workspace,/supportQr\.hidden=!\['chat','patreon'\]\.includes\(name\)/,'kody QR muszą pozostać widoczne w zakładce Patreon');
assert.match(html,/patreon-feed-config\.js[^<]*<\/script><script src="\/workspace(?:-shell-v\d+)?\.js/,'konfiguracja kanału musi ładować się przed workspace.js');
assert.match(worker,/env\.PATREON_ACCESS_TOKEN/,'Worker musi odczytywać token z sekretu');
assert.doesNotMatch(worker,/PATREON_ACCESS_TOKEN\s*[:=]\s*['"][^'"]+['"]/,'token nie może być zapisany w kodzie');
assert.match(worker,/excerpt:isPublic\?excerpt\(data\.content\):''/,'treść płatnych postów musi być ukryta');
assert.match(worker,/POST_IMAGE_PATHS\[String\(item\?\.id\|\|''\)\]/,'Worker musi przypisywać trwałą miniaturę publicznego posta');
assert.match(worker,/forceRefresh=url\.searchParams\.get\('refresh'\)==='1'/,'Worker musi obsługiwać wymuszone odświeżenie');
assert.match(workspace,/refresh=1&_=/,'przycisk odświeżania musi omijać cache');
assert.match(workspace,/data-patreon-view="list"/,'brak przełącznika widoku listy');
assert.match(workspace,/data-patreon-view="tiles"/,'brak przełącznika widoku kafelków');
assert.match(workspace,/patreon-view-toolbar/,'przełącznik widoku musi znajdować się pod nagłówkiem');
assert.match(workspace,/cttm-patreon-last-seen-v1/,'brak zapamiętywania przeczytanego posta');
assert.match(workspace,/setInterval\(\(\)=>void loadPatreonPosts\(\{force:true\}\),300000\)/,'brak automatycznego odświeżania Patreon');
console.log('Patreon feed checks passed.');
