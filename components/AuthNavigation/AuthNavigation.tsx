'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { logout } from '@/lib/api/clientApi';

//===========================================================================

function AuthNavigation() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const clearIsAuthenticated = useAuthStore(s => s.clearIsAuthenticated);

  const handleLogout = async () => {
    await logout();
    clearIsAuthenticated();
    router.push('/sign-in');
  };

  if (!isAuthenticated) {
    return (
      <>
        <li>
          <Link href="/sign-up">Register</Link>
        </li>
        <li>
          <Link href="/sign-in">Login</Link>
        </li>
      </>
    );
  }

  return (
    <>
      <li>
        <Link href="/profile">Profile</Link>
      </li>
      <li>
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </li>
    </>
  );
}

export default AuthNavigation;
