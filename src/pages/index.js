import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router';
import Notification from '../components/Notification'
import { useCart } from '../context/CartContext';

// Your hardcoded products array
const products = [
  { id: 1, name: "Bamboo Toothbrush Set", price: 299, stock: 25, image: "https://images.unsplash.com/photo-1646376156066-174d86571e5b?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YmFtYm9vJTIwdG9vdGhicnVzaHxlbnwwfHwwfHx8MA%3D%3D", category: "Personal Care" },
  { id: 2, name: "Reusable Water Bottle", price: 499, stock: 18, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300", category: "Lifestyle" },
  { id: 3, name: "Organic Cotton Tote Bag", price: 199, stock: 30, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300", category: "Bags" },
  { id: 4, name: "Solar Power Bank", price: 1799, stock: 12, image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300", category: "Electronics" },
  { id: 5, name: "Beeswax Food Wraps", price: 399, stock: 22, image: "https://images.unsplash.com/photo-1669490883681-2378be12bb29?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Zm9vZCUyMHdhcnAlMjBjb3ZlcnxlbnwwfHwwfHx8MA%3D%3D", category: "Kitchen" },
  { id: 6, name: "Stainless Steel Straws", price: 149, stock: 35, image: "https://images.unsplash.com/photo-1554327075-31266866daa7?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3RlZWwlMjBzdHJhd3xlbnwwfHwwfHx8MA%3D%3D", category: "Kitchen" },
  { id: 7, name: "Cork Yoga Mat", price: 2499, stock: 8, image: "https://plus.unsplash.com/premium_photo-1675155952889-abb299df1fe7?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8eW9nYSUyMG1hdHxlbnwwfHwwfHx8MA%3D%3D", category: "Fitness" },
  { id: 8, name: "Recycled Notebook Set", price: 349, stock: 28, image: "https://images.unsplash.com/photo-1571916234808-adf437ac1644?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHJlY2x5Y2VkJTIwbm90ZSUyMGJvb2t8ZW58MHx8MHx8fDA%3D", category: "Stationery" },
  { id: 9, name: "Hemp Backpack", price: 1799, stock: 14, image: "https://plus.unsplash.com/premium_photo-1664110691115-790e20a41744?q=80&w=653&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", category: "Bags" },
  { id: 10, name: "Organic Shampoo Bar", price: 249, stock: 26, image: "https://images.unsplash.com/photo-1634906345513-3fef37b28ae6?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hhbXBvbyUyMGJhcnxlbnwwfHwwfHx8MA%3D%3D", category: "Personal Care" },
  { id: 11, name: "Wooden Phone Stand", price: 399, stock: 20, image: "https://images.unsplash.com/photo-1675109322863-2f4eef9fe032?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d29vZCUyMHBob25lJTIwc3RhbmR8ZW58MHx8MHx8fDA%3D", category: "Electronics" },
  { id: 12, name: "Biodegradable Phone Case", price: 499, stock: 16, image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=300", category: "Electronics" },
  { id: 13, name: "Organic Tea Sampler", price: 599, stock: 19, image: "https://media.istockphoto.com/id/1130648900/photo/cup-of-tea-cinnamon-sticks-anise-dried-orange-on-wooden-table.webp?a=1&b=1&s=612x612&w=0&k=20&c=Zm25URvkq3TbOnb1re_6UVcjk3onamaMGCRb3tfgDLI=", category: "Food & Beverage" },
  { id: 14, name: "Compostable Plates Set", price: 299, stock: 32, image: "https://plus.unsplash.com/premium_photo-1661427091086-4e291eb01b99?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29tcG9zdGFibGUlMjBwbGF0ZXN8ZW58MHx8MHx8fDA%3D", category: "Kitchen" },
  { id: 15, name: "Natural Deodorant", price: 199, stock: 24, image: "https://plus.unsplash.com/premium_photo-1706800175794-57cd657b846d?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8TmF0dXJhbCUyMERlb2RvcmFudHxlbnwwfHwwfHx8MA%3D%3D", category: "Personal Care" },
  { id: 16, name: "Recycled Denim Jacket", price: 2999, stock: 11, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300", category: "Clothing" },
  { id: 17, name: "Plant-Based Protein Powder", price: 899, stock: 15, image: "https://media.istockphoto.com/id/2154155625/photo/protein-shake-and-chocolate-protein-powder-in-a-scoop-food-supplement.webp?a=1&b=1&s=612x612&w=0&k=20&c=UTdvUl3S-M6mglFCaJWPtopuKAait4oygfeJNP39Kcw=", category: "Food & Beverage" },
  { id: 18, name: "Bamboo Cutting Board", price: 599, stock: 21, image: "https://images.unsplash.com/photo-1624811533744-f85d5325d49c?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y3V0dGluZyUyMGJvYXJkfGVufDB8fDB8fHww", category: "Kitchen" },
  { id: 19, name: "Solar Garden Lights", price: 1499, stock: 9, image: "https://media.istockphoto.com/id/629434366/photo/small-solar-garden-light-lantern-in-flower-bed-garden-design.webp?a=1&b=1&s=612x612&w=0&k=20&c=iG6kQSx08wDeOXi4-lPdOqi7Om19iAQroPlE9kfch1Y=", category: "Home & Garden" },
  { id: 20, name: "Eco-Friendly Laundry Pods", price: 399, stock: 27, image: "https://media.istockphoto.com/id/1169695931/photo/blue-gel-caps-in-hand-for-washing-mashine-liquid-coloured-detergent.webp?a=1&b=1&s=612x612&w=0&k=20&c=Z16qBKBnRqd6z_Od4BISO_uH4X7IqMMe8q7bEmPoIno=", category: "Home Care" }
];

export default function Home() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [notification, setNotification] = useState('');

  // Add to cart handler
  const handleAddToCart = (product) => {
    if (product.stock === 0) {
      setNotification('This product is out of stock.');
      return;
    }
    addToCart(product);
    setNotification(`${product.name} added to cart!`);
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <>
      <Head>
        <title>Eco Cart - Sustainable Shopping</title>
      </Head>
      <Notification message={notification} onClose={() => setNotification('')} />

      <div className="container">
        <div className="hero">
          <h1>🌱 Welcome to Eco Cart</h1>
          <p>Discover sustainable products for a greener tomorrow</p>
        </div>

        <div className="products-grid">
          {products.length === 0 ? (
            <p>No products available.</p>
          ) : (
            products.map(product => (
              <div key={product.id} className="product-card">
                <img src={product.image} alt={product.name} />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="description">{product.description || product.category}</p>
                  <p className="stock">
                    Stock: {product.stock > 0 ? product.stock : <span style={{color:'red'}}>Out of stock</span>}
                  </p>
                  <p className="price">₹{product.price.toLocaleString('en-IN')}</p>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className="add-to-cart-btn"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => router.push(`/product/${product.id}`)}
                    className="view-details-btn"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <style jsx>{`
          .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
          .hero { text-align: center; margin-bottom: 3rem; }
          .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
          }
          .product-card {
            border: 1px solid #e9ecef;
            border-radius: 8px;
            overflow: hidden;
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .product-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .product-card img { width: 100%; height: 200px; object-fit: cover; }
          .product-info { padding: 1.5rem; }
          .product-info h3 { margin-bottom: 0.5rem; color: #333; }
          .description { color: #6c757d; margin-bottom: 1rem; font-size: 0.9rem; }
          .stock { margin-bottom: 0.5rem; }
          .price { font-size: 1.25rem; font-weight: bold; color: #28a745; margin-bottom: 1rem; }
          .add-to-cart-btn, .view-details-btn {
            width: 48%; margin-right: 2%; margin-bottom: 0.5rem;
            background: #007bff; color: white; border: none; padding: 0.5rem; border-radius: 4px; cursor: pointer;
            font-size: 1rem; transition: background 0.2s;
          }
          .add-to-cart-btn:disabled { background: #aaa; cursor: not-allowed; }
          .view-details-btn { background: #28a745; }
        `}</style>
      </div>
    </>
  );
}
