import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem('sb-user');
      if (stored) setUser(JSON.parse(stored));
    }
  }, []);

  return (
    <nav style={{ marginBottom: 16 }}>
      <Link href="/">Home</Link> |{' '}
      {user ? (
        <>
          <Link href="/orders">My Orders</Link> |{' '}
          <button onClick={() => {
            localStorage.removeItem('sb-user');
            window.location.reload();
          }}>Logout</button>
        </>
      ) : (
        <>
          <Link href="/login">Login</Link> |{' '}
          <Link href="/signup">Sign Up</Link>
        </>
      )}
    </nav>
  );
}
