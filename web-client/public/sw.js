const CACHE = "czatbox-ttm-v204";
const CORE = [
  "/", "/app.css?v=99", "/special.css?v=99", "/enhancements.css?v=99",
  "/corrections.css?v=107", "/legacy-themes.css?v=99", "/legacy-chat-styles.css?v=99",
  "/tool-rail-notes.css?v=99", "/workspace-codex-v178.css?v=180", "/mobile-adaptive.css?v=126",
  "/hls.min.js?v=99", "/profanity-words.js?v=99", "/notification-sound-v3.js?v=3",
  "/app-hotfix-v176.js?v=177", "/fixes.js?v=101", "/workspace-shell-v150.js?v=156",
  "/localization-v1.js?v=9", "/manifest.webmanifest", "/icons.svg", "/app-icon.ico",
  "/app-icon-192.png", "/app-icon-512.png", "/whats-new-app-icon-v1.png", "/gift-alert.png",
  "/avatars/krita.jpeg", "/themes/chill-serwis-frost-v1.png", "/themes/drwinka-sunflowers-v1.png",
  "/fonts/InterVariable.woff2", "/fonts/InterDisplay-ExtraBold.woff2", "/fonts/Inter-LICENSE.txt",
  "/sounds/codex-notification.wav", "/sounds/aura.mp3", "/sounds/auuuu.mp3", "/sounds/blysk.mp3",
  "/sounds/cute-wow.mp3", "/sounds/donate-alert.mp3", "/sounds/kraina-zapomnienia.mp3",
  "/sounds/perfumy.mp3", "/sounds/pinionszki.mp3", "/sounds/sklad.mp3", "/sounds/mod-v1.mp4",
  "/sounds/mod-v2.mp4", "/sounds/mod-v3.mp4", "/sounds/mod-v4.mp4", "/sounds/mod-v5.mp4",
  "/sounds/mod-v6.mp4"
];

self.addEventListener("install", event => event.waitUntil(
  caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting())
));

self.addEventListener("activate", event => event.waitUntil(
  caches.keys()
    .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
    .then(() => self.clients.claim())
));

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();
        void caches.open(CACHE).then(cache => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then(response => response || caches.match("/")))
  );
});
