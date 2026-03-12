const CACHE="aktas-homepage";

const files=[

"/",
"/style.css",
"/css/search.css",
"/css/nav.css",
"/js/nav.js",
"/js/script.js",
"/js/search.js",
"/js/commands.js"

];

self.addEventListener("install",e=>{

e.waitUntil(

caches.open(CACHE).then(cache=>cache.addAll(files))

);

});

self.addEventListener("fetch",e=>{

e.respondWith(

caches.match(e.request).then(r=>r||fetch(e.request))

);

});