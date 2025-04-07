"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

// Custom type for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const userDismissed = localStorage.getItem("pwaPromptDismissed");
    if (userDismissed === "true") return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setShowInstallButton(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
      setShowInstallButton(false);
      localStorage.setItem("pwaPromptDismissed", "true");
    });
  };

  const handleCloseClick = () => {
    setShowInstallButton(false);
    localStorage.setItem("pwaPromptDismissed", "true"); // ✅ Save dismissal
  };

  if (!showInstallButton) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border flex items-start space-x-3">
      <div className="flex-1">
        <p className="mb-2 text-sm">Install our app for a better experience!</p>
        <Button onClick={handleInstallClick}>Install App</Button>
      </div>
      <button
        onClick={handleCloseClick}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl font-bold"
        aria-label="Close install prompt"
      >
        ✕
      </button>
    </div>
  );
}
