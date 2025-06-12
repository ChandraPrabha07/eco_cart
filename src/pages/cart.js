import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Notification from '../components/Notification';
import { useCart } from '../context/CartContext';
import LoginModal from '../components/LoginModal';
import AddressModal from '../components/AddressModal';
import { supabase } from '../utils/supabaseClient';

export default function Cart() {
  const { cart, updateQuantity, clearCart } = useCart();
  const [notification, setNotification] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [address, setAddress] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasAddress, setHasAddress] = useState(false);


  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  useEffect(() => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
    const address = localStorage.getItem('default_address');
    setHasAddress(!!address);
    if (address) setAddress(JSON.parse(address));
  }
}, []);


  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleBuyNow = () => {
  if (cart.length === 0) {
    setNotification("Your cart is empty.");
    return;
  }
  if (!isLoggedIn) {
    setShowLogin(true);
    return;
  }
  if (!hasAddress) {
    setShowAddress(true);
    return;
  }
  alert(`Total Amount: ₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}\nProceeding to confirmation...`);
  setShowConfirmation(true);
};


  const handleConfirm = () => {
    const user = JSON.parse(localStorage.getItem('sb-user'));
    if (user) {
      await supabase.from('orders').insert([
     {
      user_id: user.id,
      items: cart,
      status: 'confirmed',
      created_at: new Date().toISOString(),
     }
     ]);
    }
    setShowConfirmation(false);
    clearCart();
    setNotification("Order confirmed! Thank you for your eco-friendly purchase.");
  };

  return (
    <>
      <Head>
        <title>Shopping Cart - Eco Cart</title>
      </Head>
      <Notification message={notification} onClose={() => setNotification('')} />
      <LoginModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={() => {
          setShowLogin(false);
          setIsLoggedIn(true);
          setShowAddress(true);
        }}
      />
      <AddressModal
      open={showAddress}
      onClose={() => setShowAddress(false)}
      onSuccess={() => {
        setShowAddress(false);
        setHasAddress(true);
        setNotification('Address saved! Now you can confirm your order.');
        setShowConfirmation(true);
        }}
      />
      
      <div className="container">
        <header className="header">
          <Link href="/" className="logo">🌱 Eco Cart</Link>
        </header>
        <div className="cart-page">
          <h1>Your Shopping Cart</h1>
          {/* Show default address if available */}
          {address && (
            <div style={{ margin: '1rem 0', padding: '1rem', border: '1px solid #eee', borderRadius: 8 }}>
              <h3>Shipping Address</h3>
              <p>{address.display_name}</p>
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
                <p>Thank you for shopping sustainably with Eco Card!</p>
                <button onClick={handleConfirm} className="buy-now-btn">Confirm Order</button>
              </div>
              <style jsx>{`
                .confirmation-modal {
                  position: fixed;
                  top: 0;
                  left: 0;
                  width: 100vw;
                  height: 100vh;
                  background: rgba(0,0,0,0.3);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  z-index: 2000;
                }
                .confirmation-content {
                  background: #fff;
                  padding: 40px 30px;
                  border-radius: 12px;
                  text-align: center;
                  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
                }
              `}</style>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
