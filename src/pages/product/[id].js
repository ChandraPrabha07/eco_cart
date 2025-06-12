import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Notification from '../../components/Notification'
import { useCart } from '../../context/CartContext';

const products = [
    { id: 1, name: "Bamboo Toothbrush Set", price: 299, stock: 25, image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500", category: "Personal Care" },
    { id: 2, name: "Reusable Water Bottle", price: 499, stock: 18, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500", category: "Lifestyle" },
    { id: 3, name: "Organic Cotton Tote Bag", price: 199, stock: 30, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500", category: "Bags" },
    { id: 4, name: "Solar Power Bank", price: 1799, stock: 12, image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500", category: "Electronics" },
    { id: 5, name: "Beeswax Food Wraps", price: 399, stock: 22, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500", category: "Kitchen" },
    { id: 6, name: "Stainless Steel Straws", price: 149, stock: 35, image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500", category: "Kitchen" },
    { id: 7, name: "Cork Yoga Mat", price: 2499, stock: 8, image: "https://images.unsplash.com/photo-1506629905607-d5f42a50b25c?w=500", category: "Fitness" },
    { id: 8, name: "Recycled Notebook Set", price: 349, stock: 28, image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500", category: "Stationery" },
    { id: 9, name: "Hemp Backpack", price: 1799, stock: 14, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500", category: "Bags" },
    { id: 10, name: "Organic Shampoo Bar", price: 249, stock: 26, image: "https://images.unsplash.com/photo-1556228578-dd339f8f0265?w=500", category: "Personal Care" },
    { id: 11, name: "Wooden Phone Stand", price: 399, stock: 20, image: "https://images.unsplash.com/photo-1434749071564-6cf342b5b0d6?w=500", category: "Electronics" },
    { id: 12, name: "Biodegradable Phone Case", price: 499, stock: 16, image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500", category: "Electronics" },
    { id: 13, name: "Organic Tea Sampler", price: 599, stock: 19, image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500", category: "Food & Beverage" },
    { id: 14, name: "Compostable Plates Set", price: 299, stock: 32, image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500", category: "Kitchen" },
    { id: 15, name: "Natural Deodorant", price: 199, stock: 24, image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500", category: "Personal Care" },
    { id: 16, name: "Recycled Denim Jacket", price: 2999, stock: 11, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500", category: "Clothing" },
    { id: 17, name: "Plant-Based Protein Powder", price: 899, stock: 15, image: "https://images.unsplash.com/photo-1544716278-e513176f20a5?w=500", category: "Food & Beverage" },
    { id: 18, name: "Bamboo Cutting Board", price: 599, stock: 21, image: "https://images.unsplash.com/photo-1556909114-b7ccfdc2b6cf?w=500", category: "Kitchen" },
    { id: 19, name: "Solar Garden Lights", price: 1499, stock: 9, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500", category: "Home & Garden" },
    { id: 20, name: "Eco-Friendly Laundry Pods", price: 399, stock: 27, image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500", category: "Home Care" }
];

const productDetails = {
    1: {
      description: "Premium bamboo toothbrush set for sustainable oral care",
      features: [
        "Made from 100% biodegradable bamboo",
        "Soft BPA-free bristles",
        "Ergonomic handle design",
        "Plastic-free packaging",
        "Set of 4 toothbrushes",
        "Naturally antimicrobial",
        "Compostable after use"
      ],
      specifications: {
        "Material": "Sustainable bamboo",
        "Bristle Type": "Soft nylon",
        "Handle Length": "19cm",
        "Weight": "15g each",
        "Packaging": "Recyclable cardboard"
      }
    },
    2: {
      description: "Double-wall insulated stainless steel water bottle",
      features: [
        "24-hour cold retention",
        "12-hour hot retention",
        "BPA-free construction",
        "Leak-proof design",
        "Wide mouth for easy cleaning",
        "Powder-coated finish",
        "Dishwasher safe"
      ],
      specifications: {
        "Capacity": "750ml",
        "Material": "304 Stainless Steel",
        "Dimensions": "26cm x 7cm",
        "Weight": "320g",
        "Colors": "5 eco-friendly colors"
      }
    },
    3: {
      description: "Reusable organic cotton tote bag for sustainable shopping",
      features: [
        "100% GOTS-certified organic cotton",
        "Reinforced stitching for durability",
        "Washable and reusable",
        "Flat base for stability",
        "Supports 15kg weight capacity",
        "Screen-printed with eco-friendly inks"
      ],
      specifications: {
        "Dimensions": "40cm x 40cm x 10cm",
        "Weight": "200g",
        "Handle Length": "60cm",
        "Care Instructions": "Machine wash cold"
      }
    },
    4: {
      description: "Portable solar-powered charging bank",
      features: [
        "20W high-efficiency solar panel",
        "25000mAh battery capacity",
        "IP67 water resistance",
        "Dual USB outputs",
        "LED power indicator",
        "Emergency flashlight"
      ],
      specifications: {
        "Solar Charge Time": "8-10 hours",
        "Output": "5V/2.4A",
        "Weight": "450g",
        "Warranty": "2 years"
      }
    },
    5: {
      description: "Natural beeswax food wraps for plastic-free storage",
      features: [
        "Made with organic cotton and beeswax",
        "Reusable for up to 1 year",
        "Biodegradable and compostable",
        "Self-adhesive when warmed",
        "Set of 3 sizes (S/M/L)",
        "Handmade with natural ingredients"
      ],
      specifications: {
        "Materials": "Beeswax, organic cotton, jojoba oil",
        "Care": "Hand wash with cold water",
        "Shelf Life": "12 months with proper care"
      }
    },
    6: {
      description: "Stainless steel reusable straw set with cleaning brush",
      features: [
        "4 straight and 4 bent straws",
        "Food-grade 304 stainless steel",
        "Silicone tips for comfort",
        "Carry case included",
        "Dishwasher safe",
        "Lifetime replacement guarantee"
      ],
      specifications: {
        "Length": "20cm (straight), 18cm (bent)",
        "Diameter": "6mm",
        "Weight": "180g/set",
        "Colors": "Silver, rose gold"
      }
    },
    7: {
      description: "Eco-friendly cork yoga mat with natural grip",
      features: [
        "100% natural cork surface",
        "Non-toxic rubber base",
        "Biodegradable and sustainable",
        "4mm thickness for comfort",
        "Antimicrobial properties",
        "Includes carrying strap"
      ],
      specifications: {
        "Dimensions": "183cm x 61cm",
        "Weight": "2.1kg",
        "Thickness": "4mm",
        "Grip": "Natural moisture-wicking"
      }
    },
    8: {
      description: "Recycled paper notebook set with plantable cover",
      features: [
        "Made from 100% post-consumer waste",
        "Seed-infused cover paper",
        "80 sheets of acid-free paper",
        "Elastic closure band",
        "Includes recycled pen",
        "Plant cover to grow wildflowers"
      ],
      specifications: {
        "Size": "A5 (14.8 x 21cm)",
        "Paper Weight": "90gsm",
        "Pages": "160 (80 sheets)",
        "Packaging": "Compostable sleeve"
      }
    },
    9: {
      description: "Durable hemp backpack with laptop compartment",
      features: [
        "Water-resistant hemp canvas",
        "15\" laptop sleeve",
        "Adjustable padded straps",
        "Multiple interior pockets",
        "Reinforced bottom panel",
        "Ethically produced"
      ],
      specifications: {
        "Capacity": "25L",
        "Dimensions": "45cm x 30cm x 15cm",
        "Weight": "800g",
        "Max Load": "10kg"
      }
    },
    10: {
      description: "Natural shampoo bar with organic ingredients",
      features: [
        "Zero-waste packaging",
        "Suitable for all hair types",
        "Cold-processed for nutrient retention",
        "Contains argan oil & shea butter",
        "80+ washes per bar",
        "pH balanced formula"
      ],
      specifications: {
        "Weight": "100g",
        "Ingredients": "Organic oils, herbal extracts",
        "Scent": "Lavender & peppermint",
        "Cruelty Free": "Yes"
      }
    },
    11: {
      description: "Handcrafted bamboo phone stand with wireless charging",
      features: [
        "Natural bamboo construction",
        "Qi wireless charging compatible",
        "Non-slip silicone pad",
        "Adjustable viewing angles",
        "Cable management system",
        "Supports fast charging"
      ],
      specifications: {
        "Compatibility": "All smartphones",
        "Charging Speed": "10W max",
        "Dimensions": "12cm x 8cm x 3cm",
        "Weight": "150g"
      }
    },
    12: {
      description: "Biodegradable phone case made from plant-based materials",
      features: [
        "100% compostable within 6 months",
        "Shock-absorbent TPU material",
        "Precise cutouts for ports",
        "Raised bezel for screen protection",
        "Available for latest models",
        "Carbon-neutral production"
      ],
      specifications: {
        "Material": "Plant-based polymer",
        "Degradation Time": "180 days in compost",
        "Colors": "4 natural tones",
        "Thickness": "2mm"
      }
    },
    13: {
      description: "Organic fair-trade tea sampler collection",
      features: [
        "16 biodegradable tea bags",
        "4 different herbal blends",
        "Plastic-free packaging",
        "USDA organic certified",
        "Caffeine-free options",
        "Compostable tags"
      ],
      specifications: {
        "Net Weight": "40g",
        "Flavors": "Chamomile, Peppermint, Ginger, Hibiscus",
        "Shelf Life": "18 months",
        "Origin": "Ethically sourced worldwide"
      }
    },
    14: {
      description: "Compostable palm leaf plate set for eco-friendly dining",
      features: [
        "Made from fallen palm leaves",
        "Biodegrades in 2-6 weeks",
        "Microwave and freezer safe",
        "Set of 25 plates",
        "Natural wood grain pattern",
        "Supports local communities"
      ],
      specifications: {
        "Diameter": "23cm (dinner plate)",
        "Weight Capacity": "1kg per plate",
        "Heat Tolerance": "-40°C to 220°C",
        "Packaging": "Recycled cardboard"
      }
    },
    15: {
      description: "Natural deodorant in plastic-free packaging",
      features: [
        "Baking soda-free formula",
        "Refillable bamboo container",
        "72-hour odor protection",
        "Vegan and cruelty-free",
        "Essential oil scents",
        "Aluminum-free"
      ],
      specifications: {
        "Net Weight": "60g",
        "Scents": "Citrus, Unscented, Lavender",
        "Shelf Life": "24 months",
        "Application": "Cream formula"
      }
    },
    16: {
      description: "Upcycled denim jacket with organic cotton lining",
      features: [
        "Made from post-consumer denim",
        "Natural indigo dye",
        "Reinforced stitching",
        "2 side pockets",
        "Adjustable cuffs",
        "Ethical manufacturing"
      ],
      specifications: {
        "Materials": "95% recycled cotton, 5% elastane",
        "Care": "Cold wash, line dry",
        "Sizes": "XS-XXL",
        "Weight": "700g"
      }
    },
    17: {
      description: "Plant-based protein powder in compostable packaging",
      features: [
        "100% vegan protein blend",
        "25g protein per serving",
        "No artificial sweeteners",
        "Compostable stand-up pouch",
        "3 delicious flavors",
        "BCAA enriched"
      ],
      specifications: {
        "Net Weight": "1kg",
        "Flavors": "Chocolate, Vanilla, Berry",
        "Serving Size": "35g",
        "Shelf Life": "18 months"
      }
    },
    18: {
      description: "Bamboo cutting board with juice groove",
      features: [
        "Made from sustainable moso bamboo",
        "Natural antimicrobial properties",
        "Reversible design",
        "Juice-catching groove",
        "Dishwasher safe",
        "Non-slip feet"
      ],
      specifications: {
        "Dimensions": "38cm x 25cm x 2cm",
        "Weight": "1.2kg",
        "Care": "Oil monthly",
        "Features": "Built-in handle"
      }
    },
    19: {
      description: "Solar-powered garden lights with automatic sensor",
      features: [
        "IP65 waterproof rating",
        "6 LED bulbs per light",
        "2 lighting modes",
        "Stake mount design",
        "8-hour runtime",
        "Auto dusk-to-dawn operation"
      ],
      specifications: {
        "Battery": "800mAh Li-ion",
        "Charge Time": "6-8 hours",
        "Light Output": "20 lumens",
        "Warranty": "3 years"
      }
    },
    20: {
      description: "Eco-friendly laundry detergent strips",
      features: [
        "Plastic-free packaging",
        "Hypoallergenic formula",
        "Compact and lightweight",
        "32 loads per package",
        "Biodegradable ingredients",
        "HE-compatible"
      ],
      specifications: {
        "Ingredients": "Plant-based surfactants",
        "Scent": "Fresh Linen",
        "Storage": "Cool, dry place",
        "Efficacy": "Works in cold water"
      }
    }
};

export default function ProductDetail() {
  const router = useRouter()
  const { id } = router.query
  const [product, setProduct] = useState(null)
  const [notification, setNotification] = useState('')
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      const foundProduct = PRODUCTS.find(p => p.id === Number(id));
      if (foundProduct) {
        setProduct({
          ...foundProduct,
          ...productDetails[Number(id)]
        });
      }
    }
  }, [id]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    setNotification(`Added "${product.name}" to cart!`);
  };

  if (!product) return <div className="loading">Product not found</div>;

  return (
    <>
      <Head>
        <title>{product.name} - Eco Cart</title>
        <meta name="description" content={product.description} />
      </Head>
      <Notification message={notification} onClose={() => setNotification('')} />
      <div className="container">
        <header className="header">
          <Link href="/" className="logo">🌱 Eco Cart</Link>
          <Link href="/cart" className="cart-link">🛒 Cart</Link>
        </header>
        <div className="product-detail">
          <div className="product-detail-image">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="product-detail-info">
            <span className="category-badge">{product.category}</span>
            <h1 className="product-title">{product.name}</h1>
            <p className="product-description">{product.description}</p>
            <p className="product-price">₹{product.price.toLocaleString('en-IN')}</p>
            <div className="product-features">
              <h3>Key Features:</h3>
              <ul>
                {product.features?.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
            {product.specifications && (
              <div className="product-specifications">
                <h3>Specifications:</h3>
                <ul>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <li key={key}><strong>{key}:</strong> {value}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="product-actions">
              <button className="add-to-cart-btn large" onClick={handleAddToCart}>Add to Cart</button>
              <Link href="/" className="back-btn">← Back to Products</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}