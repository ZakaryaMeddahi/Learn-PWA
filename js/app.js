const checkServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registeration = await navigator.serviceWorker.register(
        '/service-worker.js'
      );
      console.log('service worker registered', registeration);
    } catch (error) {
      console.log('service worker not registered', err);
    }
  }
};

checkServiceWorker();
