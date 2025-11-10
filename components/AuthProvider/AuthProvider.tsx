'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { checkSession, getMe, logout } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/stores/authStore';

//===========================================================================

interface AuthProviderProps {
  children: React.ReactNode;
}
//===========================================================================

function AuthProvider({ children }: AuthProviderProps) {
  const [isChecking, setIsChecking] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const setUser = useAuthStore(s => s.setUser);
  const clearIsAuthenticated = useAuthStore(s => s.clearIsAuthenticated);

  const isPrivate =
    pathname.startsWith('/profile') || pathname.startsWith('/notes');

  useEffect(() => {
    const run = async () => {
      try {
        const ok = await checkSession();
        if (ok) {
          const user = await getMe();
          setUser(user);
        } else {
          clearIsAuthenticated();
          if (isPrivate) {
            await logout();
            router.replace('/sign-in');
          }
        }
      } finally {
        setIsChecking(false);
      }
    };

    run();
  }, [setUser, clearIsAuthenticated, isPrivate, router]);

  if (isChecking && isPrivate) {
    return <div className="spinner" aria-label="Checking session..." />;
  }

  return <>{children}</>;
}

export default AuthProvider;
