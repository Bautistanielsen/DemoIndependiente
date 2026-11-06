// Service worker mínimo de la demo: habilita la instalación como PWA.
// En producción acá va el cache de la app shell para que el carnet abra rápido y sin señal.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
