import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Notification from '../components/Notification';
import { useCart } from '../context/CartContext';
import { supabase } from '../utils/supabaseClient';

export default function Cart() {
  const router = useRouter();
  const { cart, updateQuantity, clearCart, removeFromCart } = useCart();

  const [notification, setNotification] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [address, setAddress] = useState(null);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Clear all user-related state and redirect to login
        setUser(null);
        setShippingAddress('');
        clearCart();
        router.replace('/login');
      } else {
        setUser(session.user);
        // Fetch shipping address
        const { data: profile } = await supabase
          .from('profiles')
          .select('shipping_address')
          .eq('id', session.user.id)
          .single();
        setShippingAddress(profile?.shipping_address || '');
      }
      setLoading(false);
    };
    checkSession();
  }, [router, clearCart]);

  if (loading) return <div>Loading...</div>;
  
   const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    const fetchUserAndAddress = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('shipping_address')
          .eq('id', session.user.id)
          .single();

        if (error) {
          setNotification('Failed to fetch shipping address.');
          setAddress(null);
        } else {
          setAddress(profile?.shipping_address || null);
        }
      } else {
        setUser(null);
        setAddress(null);
      }
    };
    fetchUserAndAddress();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Example handlers for quantity and remove - replace with your context logic
  const handleUpdateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    updateQuantity(id, newQty);
  };

  const handleRemoveFromCart = (id) => {
    removeFromCart(id);
  };

  const handleBuyNow = () => {
    if (cart.length === 0) {
      setNotification("Your cart is empty.");
      return;
    }
    if (!user) {
      setNotification("Please login to continue.");
      setTimeout(() => router.push('/login?from=/cart'), 2000);
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
  if (!user) {
    setNotification("Please login to place order.");
    return;
  }
  try {
    // 1. Fetch profile info
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('shipping_address, phone, email')
      .eq('id', user.id)
      .single();

    if (profileError) {
      setNotification("Failed to fetch profile info for order.");
      return;
    }

    // 2. Insert order including phone and email
    const { error } = await supabase.from('orders').insert([
      {
        user_id: user.id,
        shipping_address: profile?.shipping_address || '',
        phone: profile?.phone || '',
        email: profile?.email || '',
        items: cart,
        status: 'confirmed',
        total_amount: total,
        created_at: new Date().toISOString(),
      }
    ]);
    if (error) {
      setNotification("Failed to place order.");
      return;
    }
    clearCart();
    setNotification("Order confirmed! Thank you for shopping sustainably.");
    setShowConfirmation(false);
    setTimeout(() => router.push('/'), 1500);
  } catch {
    setNotification("Error placing order.");
  }
};

  const handleChangeAddress = () => {
    router.push('/address?from=/cart');
  };

  return (
    <>
      <Head>
        <title>Eco Cart - Shopping Cart</title>
      </Head>
      <Notification message={notification} onClose={() => setNotification('')} />

      <div className="container cart-bg">
        <div className="cart-page">
          <h1>Your Shopping Cart</h1>

          {user && (
            <div className="user-info">
              <p>👤 Logged in as: {user.email}</p>
            </div>
          )}

          {address ? (
            <div className="address-info">
              <h3>📍 Shipping Address</h3>
              <p>{address}</p>
              <button onClick={handleChangeAddress} className="change-address-btn">Change Address</button>
            </div>
          ) : (
            <p style={{ color: 'red' }}>No shipping address found. Please add your address in profile.</p>
          )}

          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, marginRight: 16 }}
                    />
                    <span>{item.name}</span>
                    <span>₹{item.price.toLocaleString('en-IN')}</span>
                    <div className="quantity-controls">
                      <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button onClick={() => handleRemoveFromCart(item.id)} className="remove-btn">Remove</button>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <h2>Total: ₹{total.toLocaleString('en-IN')}</h2>
                <button onClick={handleBuyNow} className="buy-now-btn">Buy Now</button>
              </div>
            </>
          )}

          {showConfirmation && (
            <div className="confirmation-modal">
              <div className="confirmation-content">
                <h2>Order Confirmation</h2>
                <p>Total Amount: <strong>₹{total.toLocaleString('en-IN')}</strong></p>
                <p>Shipping to: <strong>{address}</strong></p>
                <button onClick={handleConfirm} className="confirm-btn">Confirm Order</button>
                <button onClick={() => setShowConfirmation(false)} className="cancel-btn">Cancel</button>
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          .cart-bg {
            background: linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%);
            min-height: 100vh;
            padding: 2rem;
          }
          .cart-page {
            max-width: 700px;
            margin: 0 auto;
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .user-info, .address-info {
            margin-bottom: 1rem;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 8px;
          }
          .change-address-btn {
            margin-top: 0.5rem;
            background: #007bff;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            cursor: pointer;
          }
          .cart-items {
            margin-bottom: 1rem;
          }
          .cart-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0;
            border-bottom: 1px solid #ddd;
          }
          .quantity-controls {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          .quantity-controls button {
            width: 28px;
            height: 28px;
            border: none;
            background: #007bff;
            color: white;
            border-radius: 4px;
            cursor: pointer;
          }
          .quantity-controls button:disabled {
            background: #aaa;
            cursor: not-allowed;
          }
          .remove-btn {
            background: #dc3545;
            border: none;
            color: white;
            padding: 0.3rem 0.7rem;
            border-radius: 4px;
            cursor: pointer;
          }
          .cart-summary {
            text-align: right;
          }
          .buy-now-btn {
            background: #28a745;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1rem;
          }
          .confirmation-modal {
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }
          .confirmation-content {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            max-width: 400px;
            width: 90%;
            text-align: center;
          }
          .confirm-btn {
            background: #28a745;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            cursor: pointer;
            margin-right: 1rem;
          }
          .cancel-btn {
            background: #6c757d;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            cursor: pointer;
          }
        `}</style>
      </div>
    </>
  );
}
