import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

export default function Header() {
  const [user, setUser] = useState(null);
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem('sb-user');
      if (stored) setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('sb-user');
    localStorage.removeItem('default_address');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header className="header">
      <Link href="/" className="logo">🌱 Eco Cart</Link>
      
      <div className="header-actions">
        {user ? (
          <>
            <span className="welcome-text">Welcome, {user.email}</span>
            <Link href="/orders" className="header-btn">My Orders</Link>
            <button onClick={handleLogout} className="header-btn">Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" className="header-btn">Login</Link>
            <Link href="/signup" className="header-btn">Sign Up</Link>
          </>
        )}
        
        <Link href="/cart" className="cart-link">
          🛒 Cart ({totalItems})
        </Link>
      </div>

      <style jsx>{`
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }
        .logo {
          font-size: 1.5rem;
          font-weight: bold;
          text-decoration: none;
          color: #28a745;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .header-btn {
          padding: 0.5rem 1rem;
          background: #28a745;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }
        .header-btn:hover {
          background: #218838;
        }
        .cart-link {
          padding: 0.5rem 1rem;
          background:rgb(168, 251, 130);
          color: white;
          text-decoration: none;
          border-radius: 4px;
        }
        .welcome-text {
          color: #6c757d;
          font-size: 0.9rem;
        }
      `}</style>
    </header>
  );
}
