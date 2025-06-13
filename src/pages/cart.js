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

  // Check authentication status and load address
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem('sb-user');
      if (storedUser) setUser(JSON.parse(storedUser));
      
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

    // Check if user is logged in
    if (!user) {
      setNotification("Please login to continue with your purchase.");
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      return;
    }

    // If logged in, proceed to confirmation
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    try {
      // Save order to database
      if (user) {
        const { error } = await supabase.from('orders').insert([
          {
            user_id: user.id,
            items: cart,
            status: 'confirmed',
            total_amount: total,
            shipping_address: address?.display_name || 'No address provided',
            created_at: new Date().toISOString(),
          }
        ]);

        if (error) {
          console.error('Error saving order:', error);
          setNotification("Error saving order. Please try again.");
          return;
        }
      }

      setShowConfirmation(false);
      clearCart();
      setNotification("Order confirmed! Thank you for your eco-friendly purchase.");
    } catch (error) {
      console.error('Error confirming order:', error);
      setNotification("Error confirming order. Please try again.");
    }
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
          
          {/* Show user info if logged in */}
          {user && (
            <div className="user-info">
              <p>👤 Logged in as: {user.email}</p>
            </div>
          )}
          
          {/* Show default address if available */}
          {address && (
            <div className="address-info">
              <h3>📍 Shipping Address</h3>
              <p>{address.display_name}</p>
              <Link href="/address">Change Address</Link>
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
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span className="quantity">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
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

        <style jsx>{`
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
          }
          .user-info, .address-info {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
          }
          .user-info p {
            margin: 0;
            color: #28a745;
            font-weight: 500;
          }
          .confirmation-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
          }
          .confirmation-content {
            background: #fff;
            padding: 2rem;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0,0,0,0.15);
            max-width: 500px;
          }
          .cancel-btn {
            background: #6c757d;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            margin-left: 1rem;
            border-radius: 4px;
            cursor: pointer;
          }
        `}</style>
      </div>
    </>
  );
}
