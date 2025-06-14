import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) setCart(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (id, newQuantity) => {
    setCart(prevCart => {
      if (newQuantity <= 0) {
        return prevCart.filter(item => item.id !== id);
      }
      return prevCart.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const removeFromCart = (id) => {
    setCart(cart => cart.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  // --- Extra features below ---

  // Total price of all items
  const getCartTotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Total number of items (sum of quantities)
  const getCartCount = () => cart.reduce((sum, item) => sum + item.quantity, 0);

  // Check if a product is in the cart
  const isInCart = (id) => cart.some(item => item.id === id);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
