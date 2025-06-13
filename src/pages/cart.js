import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Notification from '../components/Notification';
import { useCart } from '../context/CartContext';
import { supabase } from '../utils/supabaseClient';

export default function Cart() {
  const { cart, updateQuantity, clearCart } = useCart();
  const [notification, setNotification] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [address, setAddress] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      useEffect(() => {
        const fetchUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user); // this gives you the actual `auth.uid()`
    } else {
      setUser(null);
    }

    // Also load address from localStorage
    const storedAddress = localStorage.getItem('default_address');
    if (storedAddress) setAddress(JSON.parse(storedAddress));
  };

  fetchUser();
}, []);

      const storedAddress = localStorage.getItem('default_address');
      if (storedAddress) setAddress(JSON.parse(storedAddress));
    }
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleBuyNow = () => {
    if (cart.length === 0) {
      setNotification("Your cart is empty.");
      return;
    }
    if (!user) {
      setNotification("Please login to continue with your purchase.");
      setTimeout(() => {
        router.push('/login?from=/cart');
      }, 2000);
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
  try {
    if (user) {
      console.log("User ID being used for order:", user.id);

      const { error } = await supabase.from('orders').insert([
        {
          user_id: user.id, // this now equals auth.uid()
          items: cart,
          status: 'confirmed',
          total_amount: total,
          shipping_address: address?.display_name || 'No address provided',
          created_at: new Date().toISOString()
        }
      ]);

      if (error) {
        console.error('Order save error:', error);
        setNotification("Failed to save order. Please check permissions or required fields.");
        return;
      }

      clearCart();
      setNotification("Order confirmed! Thank you for your eco-friendly purchase.");
      setShowConfirmation(false);
    }
  } catch (error) {
    console.error('Order confirm exception:', error);
    setNotification("Error confirming order. Please try again.");
  }
};


  const handleChangeAddress = () => {
    router.push(`/address?from=${encodeURIComponent(router.asPath)}`);
  };

  return (
    <>
      <Head>
        <title>Shopping Cart - Eco Cart</title>
      </Head>
      <Notification message={notification} onClose={() => setNotification('')} />

      <div className="container">
        <div className="cart-page">
          <h1>Your Shopping Cart</h1>
          {user && (
            <div className="user-info">
              <p>👤 Logged in as: {user.email}</p>
            </div>
          )}
          {address && (
            <div className="address-info">
              <h3>📍 Shipping Address</h3>
              <p>{address.display_name}</p>
              <button onClick={handleChangeAddress}>Change Address</button>
            </div>
          )}
          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <Link href="/" className="continue-shopping">Continue Shopping</Link>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-item-image" />
                    <div className="cart-item-details">
                      <h3>{item.name}</h3>
                      <p className="cart-item-price">₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="quantity-controls">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        disabled={item.quantity <= 1}
                      >-</button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >+</button>
                    </div>
                    <div className="cart-item-total">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-summary">
                <div className="total-amount">
                  <h2>Total: ₹{total.toLocaleString('en-IN')}</h2>
                </div>
                <button onClick={handleBuyNow} className="buy-now-btn">
                  Buy Now
                </button>
                <Link href="/" className="continue-shopping">
                  Continue Shopping
                </Link>
              </div>
            </>
          )}
          {showConfirmation && (
            <div className="confirmation-modal">
              <div className="confirmation-content">
                <h2>Order Confirmation</h2>
                <p>Your total bill is <strong>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></p>
                {address && (
                  <p>Shipping to: <strong>{address.display_name}</strong></p>
                )}
                <p>Thank you for shopping sustainably with Eco Cart!</p>
                <button onClick={handleConfirm} className="buy-now-btn">Confirm Order</button>
                <button onClick={() => setShowConfirmation(false)} className="cancel-btn">Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* Styles */}
        <style jsx>{`
          .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
          .user-info, .address-info { background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; }
          .user-info p { margin: 0; color: #28a745; font-weight: 500; }
          .cart-items { margin-bottom: 2rem; }
          .cart-item { display: flex; align-items: center; margin-bottom: 1rem; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 1rem; }
          .cart-item-image { width: 80px; height: 80px; object-fit: cover; border-radius: 8px; margin-right: 1rem; }
          .cart-item-details { flex: 2; }
          .cart-item-price { color: #28a745; font-weight: bold; }
          .quantity-controls { display: flex; align-items: center; gap: 0.5rem; }
          .quantity-controls button { padding: 0.25rem 0.75rem; font-size: 1.2rem; border: none; background: #e9ecef; border-radius: 4px; cursor: pointer; }
          .quantity-controls button:disabled { background: #ccc; cursor: not-allowed; }
          .quantity { min-width: 2rem; text-align: center; }
          .cart-item-total { font-weight: bold; margin-left: 1rem; }
          .cart-summary { background: #f8f9fa; padding: 1rem; border-radius: 8px; text-align: right; }
          .buy-now-btn { background: #28a745; color: white; border: none; padding: 0.75rem 2rem; border-radius: 4px; cursor: pointer; margin-right: 1rem; }
          .continue-shopping { margin-left: 1rem; color: #007bff; text-decoration: underline; }
          .confirmation-modal { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000; }
          .confirmation-content { background: #fff; padding: 2rem; border-radius: 12px; text-align: center; box-shadow: 0 8px 32px rgba(0,0,0,0.15); max-width: 500px; }
          .cancel-btn { background: #6c757d; color: white; border: none; padding: 0.75rem 1.5rem; margin-left: 1rem; border-radius: 4px; cursor: pointer; }
        `}</style>
      </div>
    </>
  );
}

