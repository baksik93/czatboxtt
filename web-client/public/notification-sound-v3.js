(()=>{
  const source='/sounds/codex-notification.wav';
  const AudioContextClass=window.AudioContext||window.webkitAudioContext;
  const fallbackAudio=new Audio(source);
  let context=null;
  let bufferPromise=null;
  fallbackAudio.preload='auto';
  fallbackAudio.load();
  const getContext=()=>{
    if(!AudioContextClass)return null;
    if(!context)context=new AudioContextClass();
    return context;
  };
  const loadBuffer=()=>{
    const activeContext=getContext();
    if(!activeContext)return Promise.reject(new Error('Web Audio is unavailable'));
    if(!bufferPromise)bufferPromise=fetch(source,{cache:'force-cache'}).then(response=>{
      if(!response.ok)throw new Error(`Notification sound HTTP ${response.status}`);
      return response.arrayBuffer();
    }).then(data=>activeContext.decodeAudioData(data)).catch(error=>{
      bufferPromise=null;
      throw error;
    });
    return bufferPromise;
  };
  const unlock=async()=>{
    const activeContext=getContext();
    if(!activeContext)return false;
    try{
      if(activeContext.state==='suspended')await activeContext.resume();
      return activeContext.state==='running';
    }catch{return false}
  };
  const playFallback=async()=>{
    fallbackAudio.pause();
    fallbackAudio.currentTime=0;
    await fallbackAudio.play();
    return true;
  };
  window.playCzatboxNotificationSound=async()=>{
    try{
      const activeContext=getContext();
      if(!activeContext||!await unlock())return await playFallback();
      const buffer=await loadBuffer();
      const node=activeContext.createBufferSource();
      node.buffer=buffer;
      node.connect(activeContext.destination);
      node.start();
      return true;
    }catch(error){
      try{return await playFallback()}catch(fallbackError){
        console.error('Nie udało się odtworzyć dźwięku powiadomienia',fallbackError||error);
        return false;
      }
    }
  };
  const keepReady=()=>{void unlock();void loadBuffer().catch(()=>{})};
  document.addEventListener('pointerdown',keepReady,{capture:true});
  document.addEventListener('touchend',keepReady,{capture:true,passive:true});
  window.addEventListener('focus',keepReady);
  if(document.visibilityState==='visible')keepReady();
  document.documentElement.dataset.notificationSound='ready';
})();
