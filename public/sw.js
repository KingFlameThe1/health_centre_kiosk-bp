const CACHE_NAME = "medical-triage-kiosk-v1"
const urlsToCache = [
  "/",
  "/manifest.json",
  "/_next/static/css/app/layout.css",
  "/_next/static/css/app/page.css",
  "/_next/static/chunks/webpack.js",
  "/_next/static/chunks/main-app.js",
  "/_next/static/chunks/app/layout.js",
  "/_next/static/chunks/app/page.js",
  "/doctor-with-calendar-appointment-scheduling-medica.png",
  "/medical-hand-care-nursing-services-health-check.png",
  "/running-person-with-heart-urgent-care-emergency-me.png",
  "/medicine-bottle-with-syringe-pharmacy-medical-supp.png",
]

// Install event - cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache")
      return cache.addAll(urlsToCache)
    }),
  )
})

// Fetch event - serve from cache when offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      if (response) {
        return response
      }
      return fetch(event.request)
    }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})
