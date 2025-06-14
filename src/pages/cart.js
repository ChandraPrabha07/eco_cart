import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Notification from '../components/Notification';
import { useCart } from '../context/CartContext';
import { supabase } from '../utils/supabaseClient';

export default function Cart() {
  const { cart, updateQuantity, clearCart, removeFromCart } = useCart();
  const [notification, setNotification] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [address, setAddress] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Fetch user and default address from Supabase
  useEffect(() => {
    const fetchUserAndAddress = async () => {
      if (typeof window !== 'undefined') {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);

          // Fetch default address from profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('default_address')
            .eq('id', session.user.id)
            .single();

          setAddress(profile?.default_address || null);
        } else {
          setUser(null);
          setAddress(null);
        }
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

  // Update stock in Supabase when quantity changes
  const handleUpdateQuantity = async (id, newQuantity) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    if (newQuantity < 1) return;

    // Fetch current stock
    const { data: productData } = await supabase
      .from('products')
      .select('stock')
      .eq('id', id)
      .single();

    if (!productData) {
      setNotification("Product not found.");
      return;
    }

    const diff = newQuantity - item.quantity;
    const newStock = productData.stock - diff;

    if (newStock < 0) {
      setNotification("Not enough stock.");
      return;
    }

    // Update stock in DB
    await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', id);

    updateQuantity(id, newQuantity);
  };

  // Remove from cart and increase stock
  const handleRemoveFromCart = async (id) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    // Fetch current stock
    const { data: productData } = await supabase
      .from('products')
      .select('stock')
      .eq('id', id)
      .single();

    if (productData) {
      const newStock = productData.stock + item.quantity;
      await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', id);
    }

    removeFromCart(id);
  };

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
        // 1. Insert the order
        const { error: orderError } = await supabase.from('orders').insert([
          {
            user_id: user.id,
            items: cart,
            status: 'confirmed',
            shipping_address: address || 'No address provided',
            total_amount: total,
            created_at: new Date().toISOString()
          }
        ]);
        if (orderError) {
          setNotification("Failed to save order. Please check permissions or required fields.");
          return;
        }
        clearCart();
        setNotification("Order confirmed! Thank you for your eco-friendly purchase.");
        setShowConfirmation(false);
        setTimeout(() => router.push('/'), 1500);
      }
    } catch (error) {
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

      <div className="container cart-bg">
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
              <p>{address}</p>
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
                    <div className="cart-image-category">
                      <img src={item.image} alt={item.name} className="cart-item-image" />
                      <span className="category-overlay">{item.category}</span>
                    </div>
                    <div className="cart-item-details">
                      <h3>{item.name}</h3>
                      <p className="cart-item-price">₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="quantity-controls">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        disabled={item.quantity <= 1}
                      >-</button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >+</button>
                    </div>
                    <div className="cart-item-total">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                    <button className="remove-btn" onClick={() => handleRemoveFromCart(item.id)}>
                      Remove
                    </button>
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
                  <p>Shipping to: <strong>{address}</strong></p>
                )}
                <p>Thank you for shopping sustainably with Eco Cart!</p>
                <button onClick={handleConfirm} className="buy-now-btn">Confirm Order</button>
                <button onClick={() => setShowConfirmation(false)} className="cancel-btn">Cancel</button>
              </div>
            </div>
          )}
        </div>
        <style jsx>{`
          .cart-bg { background: linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%); min-height: 100vh; }
          .user-info, .address-info { background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; }
          .user-info p { margin: 0; color: #28a745; font-weight: 500; }
          .cart-items { margin-bottom: 2rem; }
          .cart-item { display: flex; align-items: center; margin-bottom: 1rem; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 1rem; position: relative; }
          .cart-image-category { position: relative; }
          .cart-item-image { width: 80px; height: 80px; object-fit: cover; border-radius: 8px; margin-right: 1rem; }
          .category-overlay { position: absolute; top: 8px; left: 8px; background: #28a745cc; color: #fff; font-size: 0.75rem; padding: 2px 8px; border-radius: 6px; }
          .cart-item-details { flex: 2; }
          .cart-item-price { color: #28a745; font-weight: bold; }
          .quantity-controls { display: flex; align-items: center; gap: 0.5rem; }
          .quantity-controls button { padding: 0.25rem 0.75rem; font-size: 1.2rem; border: none; background: #e9ecef; border-radius: 4px; cursor: pointer; }
          .quantity-controls button:disabled { background: #ccc; cursor: not-allowed; }
          .quantity { min-width: 2rem; text-align: center; }
          .cart-item-total { font-weight: bold; margin-left: 1rem; }
          .remove-btn { background: #dc3545; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; margin-left: 1rem; }
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
