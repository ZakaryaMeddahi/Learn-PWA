// This File Should Be In The Root Directory

// Install Service Wroker
self.addEventListener('install', async (event) => {
  console.log('Service Worker Installed');
});

// Activate Service Worker
self.addEventListener('active', (event) => {
  console.log('Service Worker Activated');
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  console.log('Fetching:', event.request.url);
});

// NOTE: The Service Worker Will Be Installed
// And Activated Only If The The Code Chnaged In This File
