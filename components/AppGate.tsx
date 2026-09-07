'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export default function AppGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (pathname.startsWith('/admin')) {
      setLoading(false);
      return;
    }

    const checkStatus = async () => {
      try {
        const response = await fetch('/api/app-status', {
          cache: 'no-store',
        });

        const result = await response.json();

        if (result.success) {
          setActive(result.active);
        }
      } catch {
        console.error('Could not check app status');
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [pathname]);

  if (pathname.startsWith('/admin')) {
    return <>{children}</>;
  }

  if (loading) {
    return <main style={{ padding: 40 }}>Loading...</main>;
  }

  if (!active) {
    return (
      <main style={{ padding: 40, textAlign: 'center' }}>
        <h1>Service temporarily unavailable</h1>
        <p>Please contact the administrator to reactivate this service.</p>
      </main>
    );
  }

  return <>{children}</>;
}