if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered');
        })
        .catch((error) => {
          console.error('Error registering Service Worker:', error);
        });
    });
  }