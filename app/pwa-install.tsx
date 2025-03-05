'use client';

import { useState, useEffect } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { PhoneIcon } from 'lucide-react';

/**
 * This component handles PWA installation
 */
export function InstallPWA({ children, ...props }: ButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Store the install prompt event for later use
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Store the event for later use
      setDeferredPrompt(e);
      // Show the install button
      setIsInstallable(true);
    };

    // Add event listener
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We've used the prompt, so we can't use it again
    setDeferredPrompt(null);
    
    // Hide the install button
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
  };

  // If the app is not installable, don't render the button
  if (!isInstallable) return null;

  // Render the install button
  return (
    <Button onClick={handleInstallClick} {...props}>
      <PhoneIcon className="mr-2 h-4 w-4" />
      {children || 'Install App'}
    </Button>
  );
} 