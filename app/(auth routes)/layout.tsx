'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

//===========================================================================

interface PublicLayoutProps {
  children: React.ReactNode;
}

//===========================================================================

function PublicLayout({ children }: PublicLayoutProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    router.refresh();

    const id = setTimeout(() => {
      if (!cancelled) {
        setLoading(false);
      }
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}

export default PublicLayout;
