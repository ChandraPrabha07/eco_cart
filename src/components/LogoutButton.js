import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import { useCart } from '../context/CartContext';

export default function LogoutButton() {
  const router = useRouter();
  const { clearCart } = useCart();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    clearCart();
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
    }
    router.replace('/login');
  };

  return (
    <button onClick={handleLogout} style={{
      background: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: 6,
      padding: '0.5rem 1.2rem',
      cursor: 'pointer'
    }}>
      Log Out
    </button>
  );
}
