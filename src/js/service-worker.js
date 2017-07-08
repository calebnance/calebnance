let version = '0.1';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('starter').then(cache => {

      return cache.addAll([
        '/',
        '/index.html',
        '/offline.html',
      ])
      .then(() => self.skipWaiting());
    })
  )
});

self.addEventListener('activate',  event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  if (
    event.request.mode === 'navigate'
    ||
    (
      event.request.method === 'GET'
      &&
      event.request.headers.get('accept').includes('text/html')
    )
  ) {
    event.respondWith(
      fetch(createCacheBustedRequest(event.request.url)).catch( error => {

        return caches.match('offline.html');
      })
    );
  } else {
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
  }
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
