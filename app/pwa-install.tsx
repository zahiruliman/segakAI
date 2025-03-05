'use client';

import { useState, useEffect, ComponentProps } from 'react';
import { Button } from '@/components/ui/button';
import { PhoneIcon } from 'lucide-react';

type ButtonProps = ComponentProps<typeof Button>;

/**
 * This component handles PWA installation
 */
export function InstallPWA({ children, ...props }: ButtonProps) {
  const [mounted, setMounted] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Store the install prompt event for later use
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Store the event for later use
      setDeferredPrompt(e);
      // Show the install button
      setIsInstallable(true);
    };

    // If already installed, hide the button
    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log('PWA was installed');
    };

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if already installed or in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // Reset the deferred prompt variable
    setDeferredPrompt(null);
    
    // Hide the button if installed
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
  };

  // Only render on client and when installable
  if (!mounted || !isInstallable) return null;

  return (
    <Button onClick={handleInstallClick} {...props}>
      {children || (
        <>
          <PhoneIcon className="mr-2 h-4 w-4" />
          Install App
        </>
      )}
    </Button>
  );
} 