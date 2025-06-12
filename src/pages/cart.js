import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Cart() {
  const [cartItems, setCartItems] = useState([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    // In a real app, you'd get this from context or localStorage
    const mockCartItems = [
      { id: 1, name: "Bamboo Toothbrush Set", price: 12.99, quantity: 2, image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=200" },
      { id: 2, name: "Reusable Water Bottle", price: 24.99, quantity: 1, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200" }
    ]
    setCartItems(mockCartItems)
  }, [])

  useEffect(() => {
    const newTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    setTotal(newTotal)
  }, [cartItems])

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      setCartItems(cartItems.filter(item => item.id !== id))
    } else {
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ))
    }
  }

  const handleBuyNow = () => {
    alert(`Total Amount: $${total.toFixed(2)}\nThank you for your eco-friendly purchase!`)
  }

  return (
    <>
      <Head>
        <title>Shopping Cart - Eco Card</title>
      </Head>

      <div className="container">
        <header className="header">
          <Link href="/" className="logo">🌱 Eco Card</Link>
        </header>

        <div className="cart-page">
          <h1>Your Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <Link href="/" className="continue-shopping">Continue Shopping</Link>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-item-image" />
                    <div className="cart-item-details">
                      <h3>{item.name}</h3>
                      <p className="cart-item-price">${item.price}</p>
                    </div>
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span className="quantity">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <div className="cart-item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="total-amount">
                  <h2>Total: ${total.toFixed(2)}</h2>
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
        </div>
      </div>
    </>
  )
}
