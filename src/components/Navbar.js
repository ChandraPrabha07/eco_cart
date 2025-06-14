import Link from 'next/link';
import LogoutButton from './LogoutButton';

export default function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: '#f8f9fa',
      padding: '1rem 2rem',
      borderBottom: '1px solid #eee'
    }}>
      <div>
        <Link href="/">Home</Link>
        <Link href="/cart" style={{ marginLeft: 16 }}>Cart</Link>
      </div>
      <LogoutButton />
    </nav>
  );
}
