const PATREON_API='https://www.patreon.com/api/oauth2/v2';
const CACHE_SECONDS=600;
const POST_IMAGE_PATHS={'170153834':'/patreon-post-170153834.png'};
const corsHeaders={
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Methods':'GET, OPTIONS',
  'Access-Control-Allow-Headers':'Accept',
  'Access-Control-Max-Age':'86400'
};

const json=(body,status=200,extra={})=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':status===200?`public, max-age=${CACHE_SECONDS}`:'no-store',...corsHeaders,...extra}});
const stripHtml=value=>String(value||'').replace(/<br\s*\/?>/gi,' ').replace(/<[^>]*>/g,' ').replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&#39;/gi,"'").replace(/\s+/g,' ').trim();
const excerpt=(value,max=280)=>{const plain=stripHtml(value);return plain.length<=max?plain:`${plain.slice(0,max-1).trim()}…`};

async function fetchPosts(env){
  if(!env.PATREON_ACCESS_TOKEN||!env.PATREON_CAMPAIGN_ID||env.PATREON_CAMPAIGN_ID.startsWith('UZUPELNIJ'))throw new Error('Patreon Worker nie jest skonfigurowany.');
  const fields='title,content,published_at,url,is_public';
  const url=`${PATREON_API}/campaigns/${encodeURIComponent(env.PATREON_CAMPAIGN_ID)}/posts?fields%5Bpost%5D=${encodeURIComponent(fields)}&sort=-published_at&page%5Bcount%5D=12`;
  const response=await fetch(url,{headers:{Authorization:`Bearer ${env.PATREON_ACCESS_TOKEN}`,Accept:'application/json'}});
  if(!response.ok){console.error('Patreon API error',{status:response.status});throw new Error(`Patreon API zwróciło błąd ${response.status}.`)}
  const payload=await response.json();
  return (Array.isArray(payload?.data)?payload.data:[]).map(item=>{
    const data=item?.attributes||{},isPublic=data.is_public===true;
    return{
      id:String(item?.id||''),
      title:String(data.title||'Nowy post'),
      publishedAt:String(data.published_at||''),
      url:String(data.url||'https://www.patreon.com/cw/BaksikTS4'),
      isPublic,
      // Nigdy nie ujawniamy treści postów płatnych przez publiczny endpoint.
      excerpt:isPublic?excerpt(data.content):'',
      imageUrl:isPublic?String(POST_IMAGE_PATHS[String(item?.id||'')]||''):''
    };
  });
}

export default{
  async fetch(request,env,ctx){
    const url=new URL(request.url);
    if(request.method==='OPTIONS')return new Response(null,{status:204,headers:corsHeaders});
    if(request.method!=='GET'||url.pathname!=='/posts')return json({error:'Not found'},404);
    const cache=globalThis.caches?.default,cacheKey=new Request(`${url.origin}/posts`,{method:'GET'}),forceRefresh=url.searchParams.get('refresh')==='1';
    const cached=cache&&!forceRefresh?await cache.match(cacheKey):null;
    if(cached)return cached;
    try{
      const response=json({posts:await fetchPosts(env),updatedAt:new Date().toISOString()});
      if(cache)ctx.waitUntil(cache.put(cacheKey,response.clone()));
      return response;
    }catch(error){
      console.error('Patreon feed failure',{message:error instanceof Error?error.message:'Unknown error'});
      return json({error:'Nie udało się pobrać postów Patreon.'},502);
    }
  }
};

export{excerpt,stripHtml};
