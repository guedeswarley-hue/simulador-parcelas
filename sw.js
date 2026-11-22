const CACHE_NAME = "simulador-v1";
const ARQUIVOS_PARA_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json"
];

// Instala e guarda os arquivos principais no navegador
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ARQUIVOS_PARA_CACHE))
  );
});

// Responde usando o cache quando disponível, ou busca na rede
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((resposta) => resposta || fetch(event.request))
  );
});