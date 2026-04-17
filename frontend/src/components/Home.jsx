import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, LogIn, Search, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await api.getProducts();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="home-nav glass-card">
        <div className="nav-brand">
          <div className="nav-logo">
            <ShoppingBag size={20} />
          </div>
          <span className="nav-title">Threads<span>& Luxe</span></span>
        </div>
        
        <div className="nav-search">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search our atelier..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="nav-right">
          {token ? (
            <Link to="/dashboard" className="user-profile-btn">
              <div className="user-avatar-small">{username?.charAt(0).toUpperCase()}</div>
              <span className="hidden-mobile">Dashboard ({role === 'ADMIN' ? 'Admin' : 'User'})</span>
            </Link>
          ) : (
            <button onClick={() => navigate('/login')} className="btn btn-primary login-btn">
              <LogIn size={16} />
              Login
            </button>
          )}
        </div>
      </nav>

      <main className="home-content">
        {/* Hero Section */}
        <div className="hero-section glass-card">
          <div className="hero-content">
            <span className="hero-badge">Curated Collection 2026</span>
            <h1 className="hero-title">Elevate Your <span>Signature Style</span></h1>
            <p className="hero-subtitle">
              Experience sustainable luxury. Rent designer pieces for your next event 
              or purchase bespoke additions for your permanent wardrobe.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary">Start Renting</button>
              <button className="btn btn-secondary">Shop Collection</button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="section-header">
          <h2>Featured Products</h2>
          <p>Explore our most popular and highly rated items</p>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <Loader2 className="spinner" size={40} style={{ margin: '0 auto' }} />
            <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>Loading amazing products...</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card glass-card fade-in">
                <div className="product-image-container">
                  {product.tag && (
                    <span className={`product-tag tag-${product.tag.toLowerCase().replace(' ', '-')}`}>
                      {product.tag}
                    </span>
                  )}
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="product-image" loading="lazy" />
                  ) : (
                    <div className="product-image-placeholder">
                      <ShoppingBag size={40} />
                    </div>
                  )}
                  <div className="product-overlay" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '15px' }}>
                    {product.isRentable && (
                      <button 
                        className="btn btn-primary" 
                        style={{ flex: 1, fontSize: '12px' }}
                        onClick={() => token ? navigate(`/checkout/${product.id}?type=RENTAL`) : navigate('/login')}
                      >
                        Rent Now
                      </button>
                    )}
                    {product.isPurchasable && (
                      <button 
                        className="btn btn-secondary" 
                        style={{ flex: 1, fontSize: '12px' }}
                        onClick={() => token ? navigate(`/checkout/${product.id}?type=PURCHASE`) : navigate('/login')}
                      >
                        Buy Piece
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="product-info">
                  <span className="product-category">{product.category} • {product.material}</span>
                  <h3 className="product-name">{product.name}</h3>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>Size: {product.size} | Color: {product.color}</div>
                  
                  <div className="product-meta" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      {product.isPurchasable && (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Buy</span>
                          <span className="product-price" style={{ color: 'var(--accent-gold)' }}>${(product.price || 0).toFixed(2)}</span>
                        </div>
                      )}
                      {product.isRentable && (
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                          <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Rent</span>
                          <span className="product-price" style={{ color: 'var(--text-primary)' }}>${(product.rentalPrice || 0).toFixed(2)}<span style={{ fontSize: '10px', fontWeight: 'normal' }}>/day</span></span>
                        </div>
                      )}
                    </div>
                    
                    <div className="product-rating" style={{ marginTop: '5px' }}>
                      <Star size={12} className="star-icon" fill="currentColor" />
                      <span>{product.rating || 0}</span>
                      <span className="review-count">({product.reviews || 0})</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredProducts.length === 0 && (
              <div className="empty-state glass-card">
                <Search size={40} className="empty-icon" />
                <h3>No products found</h3>
                <p>Try adjusting your search terms</p>
              </div>
            )}
          </div>
        )}
      </main>
      
      <footer className="home-footer glass-card">
        <p>&copy; 2026 TechStore. All rights reserved. Built with premium design.</p>
      </footer>
    </div>
  );
}
