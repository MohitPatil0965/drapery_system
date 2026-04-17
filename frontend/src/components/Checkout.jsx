import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { CreditCard, ShoppingBag, ArrowLeft, Loader2, CheckCircle, ShieldCheck } from 'lucide-react';

export default function Checkout() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type') || 'PURCHASE'; // RENTAL or PURCHASE

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');

  const [cardForm, setCardForm] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: ''
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const products = await api.getProducts();
        const p = products.find(item => item.id.toString() === productId);
        if (!p) throw new Error('Product not found');
        setProduct(p);
      } catch (err) {
        setError('Could not load product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const amount = type === 'RENTAL' ? product.rentalPrice : product.price;
      await api.createOrder({
        productId,
        type,
        amount,
        cardNumber: cardForm.number
      });
      setCompleted(true);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      setError('Transaction failed. Please check your card details.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-screen"><Loader2 className="spinner" size={40} /></div>;

  if (completed) {
    return (
      <div className="checkout-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="glass-card fade-in" style={{ padding: '60px', textAlign: 'center', maxWidth: '500px' }}>
          <CheckCircle size={80} color="var(--success)" style={{ margin: '0 auto 24px' }} />
          <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>Order Confirmed!</h1>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Thank you for choosing Threads & Luxe. Your {type.toLowerCase()} of <strong>{product.name}</strong> has been processed successfully.
          </p>
          <div style={{ marginTop: '30px', fontSize: '14px', color: 'var(--accent-gold)' }}>Redirecting to dashboard...</div>
        </div>
      </div>
    );
  }

  const price = type === 'RENTAL' ? product.rentalPrice : product.price;

  return (
    <div className="checkout-page" style={{ padding: '40px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ marginBottom: '30px' }}>
          <ArrowLeft size={18} /> Back to Collection
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '40px' }}>
          {/* Order Summary */}
          <div className="glass-card" style={{ padding: '30px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShoppingBag className="text-accent" /> Order Summary
            </h2>
            
            <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--glass-border)' }}>
              <img src={product.imageUrl} alt={product.name} style={{ width: '100px', height: '120px', borderRadius: '12px', objectFit: 'cover' }} />
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>{product.category}</div>
                <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{product.name}</h3>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Size: {product.size} | Color: {product.color}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Type</span>
                <span className="badge badge-customer">{type}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--glass-border)' }}>
                <span>Total Amount</span>
                <span style={{ color: 'var(--accent-gold)' }}>${price?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Card Form */}
          <div className="glass-card" style={{ padding: '30px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CreditCard className="text-accent" /> Payment Details
            </h2>

            {error && <div className="alert alert-error" style={{ marginBottom: '20px' }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="input-group">
                <label>Cardholder Name</label>
                <input required name="name" value={cardForm.name} onChange={handleInputChange} className="input-field" placeholder="John Doe" />
              </div>

              <div className="input-group">
                <label>Card Number</label>
                <div className="input-wrapper">
                  <CreditCard className="input-icon" size={18} />
                  <input required name="number" value={cardForm.number} onChange={handleInputChange} className="input-field with-icon" placeholder="**** **** **** ****" maxLength="16" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="input-group">
                  <label>Expiry Date</label>
                  <input required name="expiry" value={cardForm.expiry} onChange={handleInputChange} className="input-field" placeholder="MM/YY" maxLength="5" />
                </div>
                <div className="input-group">
                  <label>CVC</label>
                  <input required name="cvv" value={cardForm.cvv} onChange={handleInputChange} className="input-field" placeholder="123" maxLength="3" />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', background: 'rgba(212, 175, 55, 0.05)', borderRadius: '10px', border: '1px solid rgba(212, 175, 55, 0.1)' }}>
                <ShieldCheck size={20} color="var(--accent-gold)" />
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Secure 256-bit SSL Encrypted Payment</span>
              </div>

              <button type="submit" className="btn btn-primary" style={{ height: '50px', fontSize: '16px' }} disabled={submitting}>
                {submitting ? <Loader2 className="spinner" /> : `Confirm ${type === 'RENTAL' ? 'Rental' : 'Purchase'}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
