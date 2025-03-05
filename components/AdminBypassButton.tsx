"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export function AdminBypassButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleBypassAuth = async () => {
    try {
      setLoading(true);
      
      // Call our bypass API endpoint
      const response = await fetch('/api/admin/bypass-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to bypass authentication');
      }

      toast.success('Successfully authenticated as user');
      // Direct to regular dashboard instead of admin
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Bypass auth error:', error);
      toast.error(error instanceof Error ? error.message : 'Authentication bypass failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBypassAuth}
      disabled={loading}
      className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-lg z-50 text-sm flex items-center gap-2 transition-all"
      aria-label="Login bypass"
    >
      {loading ? (
        <>
          <span className="h-4 w-4 block rounded-full border-2 border-white border-r-transparent animate-spin" />
          <span>Logging in...</span>
        </>
      ) : (
        <>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          <span>Login Bypass</span>
        </>
      )}
    </button>
  );
} 