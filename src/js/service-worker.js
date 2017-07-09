self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('calebnance').then(cache => {

      return cache.addAll([
        '/',
        '/index.html',
        '/css/styles.min.css'
      ])
      .then(() => self.skipWaiting());
    })
  )
});

self.addEventListener('activate',  event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(
        event.request, {
          ignoreSearch : true
        }
      ).then(response => {

        return response || fetch(event.request);
      }).catch(function(error) {
        // console.log('Fetch failed; returning offline page instead.', error);
      })
    );
});

function createCacheBustedRequest(url) {
  let request = new Request(url, {cache: 'reload'});

  if ('cache' in request) {

    return request;
  }

  let bustedUrl = new URL(url, self.location.href);
  bustedUrl.search += (bustedUrl.search ? '&' : '') + 'cachebust=' + Date.now();

  return new Request(bustedUrl);
}
