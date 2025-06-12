import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Notification from '../components/Notification'
import { useCart } from '../context/CartContext';

const PRODUCTS=[
      { id: 1, name: "Bamboo Toothbrush Set", price: 299, stock: 25, image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=300", category: "Personal Care" },
      { id: 2, name: "Reusable Water Bottle", price: 499, stock: 18, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300", category: "Lifestyle" },
      { id: 3, name: "Organic Cotton Tote Bag", price: 199, stock: 30, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300", category: "Bags" },
      { id: 4, name: "Solar Power Bank", price: 1799, stock: 12, image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300", category: "Electronics" },
      { id: 5, name: "Beeswax Food Wraps", price: 399, stock: 22, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300", category: "Kitchen" },
      { id: 6, name: "Stainless Steel Straws", price: 149, stock: 35, image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300", category: "Kitchen" },
      { id: 7, name: "Cork Yoga Mat", price: 2499, stock: 8, image: "https://images.unsplash.com/photo-1506629905607-d5f42a50b25c?w=300", category: "Fitness" },
      { id: 8, name: "Recycled Notebook Set", price: 349, stock: 28, image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300", category: "Stationery" },
      { id: 9, name: "Hemp Backpack", price: 1799, stock: 14, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300", category: "Bags" },
      { id: 10, name: "Organic Shampoo Bar", price: 249, stock: 26, image: "https://images.unsplash.com/photo-1556228578-dd339f8f0265?w=300", category: "Personal Care" },
      { id: 11, name: "Wooden Phone Stand", price: 399, stock: 20, image: "https://images.unsplash.com/photo-1434749071564-6cf342b5b0d6?w=300", category: "Electronics" },
      { id: 12, name: "Biodegradable Phone Case", price: 499, stock: 16, image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=300", category: "Electronics" },
      { id: 13, name: "Organic Tea Sampler", price: 599, stock: 19, image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300", category: "Food & Beverage" },
      { id: 14, name: "Compostable Plates Set", price: 299, stock: 32, image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300", category: "Kitchen" },
      { id: 15, name: "Natural Deodorant", price: 199, stock: 24, image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300", category: "Personal Care" },
      { id: 16, name: "Recycled Denim Jacket", price: 2999, stock: 11, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300", category: "Clothing" },
      { id: 17, name: "Plant-Based Protein Powder", price: 899, stock: 15, image: "https://images.unsplash.com/photo-1544716278-e513176f20a5?w=300", category: "Food & Beverage" },
      { id: 18, name: "Bamboo Cutting Board", price: 599, stock: 21, image: "https://images.unsplash.com/photo-1556909114-b7ccfdc2b6cf?w=300", category: "Kitchen" },
      { id: 19, name: "Solar Garden Lights", price: 1499, stock: 9, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", category: "Home & Garden" },
      { id: 20, name: "Eco-Friendly Laundry Pods", price: 399, stock: 27, image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300", category: "Home Care" }
];

export default function Home() {
  const [products, setProducts] = useState(PRODUCTS);
  const [notification, setNotification] = useState('');
  const { cart, addToCart } = useCart();

  const handleAddToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product && product.stock > 0) {
      setProducts(products.map(p =>
        p.id === productId ? { ...p, stock: p.stock - 1 } : p
      ));
      addToCart(product);
      setNotification(`Added "${product.name}" to cart!`);
    }
  };

  return (
    <>
      <Head>
        <title>Eco Cart - Sustainable Products Store</title>
      </Head>
      <Notification message={notification} onClose={() => setNotification('')} />
      <div className="container">
        <header className="header">
          <h1 className="logo">🌱 ECO CART</h1>
          <nav className="nav">
            <Link href="/cart" className="cart-link">
              🛒 Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            </Link>
          </nav>
        </header>
        <main className="main">
          <h2 className="page-title">Sustainable Products for a Better Tomorrow</h2>
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <img src={product.image} alt={product.name} className="product-image" />
                  <span className="category-badge">{product.category}</span>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">₹{product.price.toLocaleString('en-IN')}</p>
                  <p className="product-stock">Stock: {product.stock} available</p>
                  <div className="product-actions">
                    <Link href={`/product/${product.id}`} className="details-btn">
                      View Details
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      disabled={product.stock === 0}
                      className={`add-to-cart-btn ${product.stock === 0 ? 'disabled' : ''}`}
                    >
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}