const CACHE_NAME="graceprint-rutboaz-lite-pro-v1";
const CORE=[
  "./",
  "./index.html",
  "./content.json",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./1.webp","./2.webp","./3.webp","./4.webp","./5.webp",
  "./6.webp","./7.webp","./8.webp","./9.webp","./10.webp"
];

self.addEventListener("install",(event)=>{
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())
  );
});

self.addEventListener("activate",(event)=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.map(k=>k===CACHE_NAME?null:caches.delete(k)))).then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch",(event)=>{
  const req=event.request;
  if(req.method!=="GET") return;

  event.respondWith(
    caches.match(req).then(cached=>{
      if(cached) return cached;
      return fetch(req).then(res=>{
        const copy=res.clone();
        caches.open(CACHE_NAME).then(cache=>cache.put(req,copy)).catch(()=>{});
        return res;
      }).catch(()=>caches.match("./index.html"));
    })
  );
});
