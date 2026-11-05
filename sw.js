self.addEventListener('install', (e) => {
  console.log('Vortex Service Worker Установлен');
});

self.addEventListener('fetch', (e) => {
  // Позволяет сайту работать автономно в будущем
});
