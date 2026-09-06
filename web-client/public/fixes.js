(()=>{
  const processRows=root=>{
    const scope=root?.querySelectorAll?root:document;
    scope.querySelectorAll('.chat-message.special.multiplier .special-avatar use').forEach(use=>use.setAttribute('href','/icons.svg#bolt'));
    scope.querySelectorAll('.chat-message.special.freeze .special-avatar use').forEach(use=>use.setAttribute('href','/icons.svg#snow'));
    scope.querySelectorAll('.chat-message.gift:not([data-gift-formatted])').forEach(row=>{
      row.dataset.giftFormatted='true';
      if(row.querySelector('.coin-value'))return;
      row.querySelectorAll('.gift-image').forEach(image=>image.remove());
      const paragraph=row.querySelector('p'),text=paragraph?.innerText.replace('wysłał(a) prezent:','wysyła prezent:')||'';
      if(!paragraph)return;
      const match=text.match(/^(.*?)(?:\s*·\s*(\d+)\s*monet)$/i);
      paragraph.textContent=match?match[1]:text;
      if(match){const coin=document.createElement('span');coin.className='coin-value';coin.innerHTML=`<span>×</span><svg><use href="/icons.svg#coin"></use></svg><b>${match[2]}</b>`;paragraph.append(coin)}
    });
  };
  processRows(document);
  new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(processRows))).observe(document.getElementById('chatFeed'),{childList:true});

  let audioContext=null,keepAliveTone=null;
  const claimAudioSession=async()=>{
    if(!document.querySelector('#tts')?.checked||document.visibilityState!=='visible')return;
    try{
      audioContext ||= new (window.AudioContext||window.webkitAudioContext)();
      if(audioContext.state==='suspended')await audioContext.resume();
      if(!keepAliveTone){const oscillator=audioContext.createOscillator(),gain=audioContext.createGain();gain.gain.value=.00001;oscillator.connect(gain).connect(audioContext.destination);oscillator.start();keepAliveTone=oscillator}
      if('mediaSession'in navigator)navigator.mediaSession.metadata=new MediaMetadata({title:'Czytanie czatu LIVE',artist:'Czatbox TT(M)'});
    }catch(error){console.warn('System iOS nie udostępnił sesji audio',error)}
  };
  document.querySelector('#tts')?.addEventListener('change',claimAudioSession);
  addEventListener('pointerdown',claimAudioSession,{passive:true});
  addEventListener('focus',claimAudioSession);
  document.addEventListener('visibilitychange',claimAudioSession);

  let persistentWakeLock=null,wakeRetry=null;
  const liveIsActive=()=>document.querySelector('#liveDot')?.classList.contains('online');
  const acquirePersistentWakeLock=async()=>{
    clearTimeout(wakeRetry);
    if(!liveIsActive()||document.visibilityState!=='visible'||persistentWakeLock||!navigator.wakeLock)return;
    try{
      persistentWakeLock=await navigator.wakeLock.request('screen');
      persistentWakeLock.addEventListener('release',()=>{persistentWakeLock=null;if(liveIsActive()&&document.visibilityState==='visible')wakeRetry=setTimeout(acquirePersistentWakeLock,250)});
    }catch{wakeRetry=setTimeout(acquirePersistentWakeLock,3000)}
  };
  new MutationObserver(acquirePersistentWakeLock).observe(document.getElementById('liveDot'),{attributes:true,attributeFilter:['class']});
  document.addEventListener('visibilitychange',acquirePersistentWakeLock);
  addEventListener('focus',acquirePersistentWakeLock);addEventListener('pageshow',acquirePersistentWakeLock);addEventListener('pointerdown',acquirePersistentWakeLock,{passive:true});
  setInterval(acquirePersistentWakeLock,15000);
})();
