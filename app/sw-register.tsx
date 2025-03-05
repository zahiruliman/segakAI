'use client';

import { useEffect, useState } from 'react';

export function ServiceWorkerRegistration() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only register the service worker in production and if the browser supports it
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          })
          .catch((error) => {
            console.error('ServiceWorker registration failed: ', error);
          });
      });
    }
  }, []);

  // Return null to prevent any rendering that might cause hydration issues
  return null;
} 