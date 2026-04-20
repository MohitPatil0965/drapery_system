import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Package, Plus, Edit2, Trash2, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export default function ManageProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    imageUrl: '',
    category: '',
    tag: '',
    rating: 0,
    reviews: 0,
    rentalPrice: '',
    size: '',
    color: '',
    material: '',
    isRentable: true,
    isPurchasable: true
  });

  useEffect(() => {
    // Check if admin
    const role = localStorage.getItem('role');
    if (role !== 'ADMIN') {
      navigate('/dashboard');
      return;
    }
    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : (name === 'price' || name === 'rentalPrice' || name === 'rating' || name === 'reviews' ? Number(value) : value)
    }));
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      category: product.category || '',
      tag: product.tag || '',
      rating: product.rating || 0,
      reviews: product.reviews || 0,
      rentalPrice: product.rentalPrice || '',
      size: product.size || '',
      color: product.color || '',
      material: product.material || '',
      isRentable: product.isRentable !== undefined ? product.isRentable : true,
      isPurchasable: product.isPurchasable !== undefined ? product.isPurchasable : true
    });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.deleteProduct(id);
      fetchProducts();
    } catch (err) {
      alert('Error deleting product');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.updateProduct(editingId, form);
      } else {
        await api.createProduct(form);
      }
      // Reset form
      setIsEditing(false);
      setEditingId(null);
      setForm({ name: '', price: '', description: '', imageUrl: '', category: '', tag: '', rating: 0, reviews: 0, rentalPrice: '', size: '', color: '', material: '', isRentable: true, isPurchasable: true });
      fetchProducts();
    } catch (err) {
      alert(`Error ${isEditing ? 'updating' : 'creating'} product`);
    }
  };

  return (
    <div className="dashboard-page" style={{ padding: '20px' }}>
      <div className="dashboard-content" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ padding: '8px' }}>
              <ArrowLeft size={18} />
            </button>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Package className="text-accent" /> Manage Products
            </h1>
          </div>
        </div>

        {/* Product Form */}
        <div className="glass-card" style={{ padding: '24px', marginBottom: '30px' }}>
          <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-row">
              <div className="input-group">
                <label>Product Name</label>
                <input required name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="E.g. Wireless Mouse" />
              </div>
              <div className="input-group">
                <label>Price (₹)</label>
                <input required type="number" step="0.01" name="price" value={form.price} onChange={handleChange} className="input-field" placeholder="29.99" />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>Image URL</label>
                <input name="imageUrl" value={form.imageUrl} onChange={handleChange} className="input-field" placeholder="https://..." />
              </div>
              <div className="input-group">
                <label>Category</label>
                <input name="category" value={form.category} onChange={handleChange} className="input-field" placeholder="Electronics" />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>Rental Price (₹)</label>
                <input type="number" step="0.01" name="rentalPrice" value={form.rentalPrice} onChange={handleChange} className="input-field" placeholder="15.00" />
              </div>
              <div className="input-group">
                <label>Material</label>
                <input name="material" value={form.material} onChange={handleChange} className="input-field" placeholder="Silk, Wool, Cotton..." />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>Size</label>
                <input name="size" value={form.size} onChange={handleChange} className="input-field" placeholder="S, M, L, XL..." />
              </div>
              <div className="input-group">
                <label>Color</label>
                <input name="color" value={form.color} onChange={handleChange} className="input-field" placeholder="Navy, Charcoal, Floral..." />
              </div>
            </div>

            <div className="form-row" style={{ gap: '20px', alignItems: 'center' }}>
              <div className="input-group" style={{ flexDirection: 'row', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" name="isRentable" checked={form.isRentable} onChange={handleChange} style={{ width: '18px', height: '18px' }} id="rentable-check" />
                <label htmlFor="rentable-check" style={{ marginBottom: 0, cursor: 'pointer' }}>Available for Rental</label>
              </div>
              <div className="input-group" style={{ flexDirection: 'row', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" name="isPurchasable" checked={form.isPurchasable} onChange={handleChange} style={{ width: '18px', height: '18px' }} id="purchasable-check" />
                <label htmlFor="purchasable-check" style={{ marginBottom: 0, cursor: 'pointer' }}>Available for Purchase</label>
              </div>
            </div>

            <div className="input-group">
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="input-field" rows="3"></textarea>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" className="btn btn-primary">
                {isEditing ? <Edit2 size={16} /> : <Plus size={16} />}
                {isEditing ? 'Update Product' : 'Save Product'}
              </button>
              {isEditing && (
                <button type="button" className="btn btn-secondary" onClick={() => {
                  setIsEditing(false);
                  setForm({ name: '', price: '', description: '', imageUrl: '', category: '', tag: '', rating: 0, reviews: 0 });
                }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Product List */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>Product Catalog</h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}><Loader2 className="spinner" size={30} style={{ margin: '0 auto' }} /></div>
          ) : error ? (
            <div className="alert alert-error"><AlertCircle size={16} /> {error}</div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No products found. Add one above!</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <th style={{ padding: '12px' }}>Product</th>
                    <th style={{ padding: '12px' }}>Category</th>
                    <th style={{ padding: '12px' }}>Buy/Rent Price</th>
                    <th style={{ padding: '12px' }}>Details</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {p.imageUrl && <img src={p.imageUrl} alt={p.name} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />}
                        <div>
                          <div style={{ fontWeight: 500 }}>{p.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{p.tag}</div>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>{p.category}</td>
                      <td style={{ padding: '12px' }}>
                        <div>Buy: <span style={{ fontWeight: 'bold' }}>₹{p.price.toFixed(2)}</span></div>
                        {p.rentalPrice && <div>Rent: <span style={{ fontWeight: 'bold' }}>₹{p.rentalPrice.toFixed(2)}</span></div>}
                      </td>
                      <td style={{ padding: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        <div>Size: {p.size}</div>
                        <div>Color: {p.color}</div>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <button onClick={() => handleEdit(p)} className="btn btn-secondary" style={{ padding: '6px', marginRight: '6px' }}>
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="btn btn-danger" style={{ padding: '6px' }}>
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
