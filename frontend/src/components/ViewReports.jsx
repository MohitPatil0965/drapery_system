import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { BarChart3, ArrowLeft, Loader2, Download, TrendingUp, ShoppingBag, Calendar, User } from 'lucide-react';

export default function ViewReports() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if admin
    const role = localStorage.getItem('role');
    if (role !== 'ADMIN') {
      navigate('/dashboard');
      return;
    }
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      setError('Failed to load transaction reports');
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
  const totalRentals = orders.filter(o => o.type === 'RENTAL').length;
  const totalPurchases = orders.filter(o => o.type === 'PURCHASE').length;

  return (
    <div className="dashboard-page" style={{ padding: '20px' }}>
      <div className="dashboard-content" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ padding: '8px' }}>
              <ArrowLeft size={18} />
            </button>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <BarChart3 className="text-accent" /> Atelier Analytics
            </h1>
          </div>
          <button className="btn btn-primary" onClick={() => window.print()}>
            <Download size={16} /> Export Report
          </button>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid" style={{ marginBottom: '30px', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          <div className="stat-card glass-card" style={{ '--accent': 'var(--accent-gold)' }}>
            <div className="stat-icon" style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent-gold)' }}>
              <TrendingUp size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-title">Total Revenue</span>
              <span className="stat-value">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              <span className="stat-change" style={{ color: 'var(--success)' }}>+12.5% this month</span>
            </div>
          </div>

          <div className="stat-card glass-card" style={{ '--accent': '#c5a059' }}>
            <div className="stat-icon" style={{ background: 'rgba(197, 160, 89, 0.1)', color: '#c5a059' }}>
              <Calendar size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-title">Rentals</span>
              <span className="stat-value">{totalRentals}</span>
              <span className="stat-change">Active leases</span>
            </div>
          </div>

          <div className="stat-card glass-card" style={{ '--accent': '#f5f5f0' }}>
            <div className="stat-icon" style={{ background: 'rgba(245, 245, 240, 0.1)', color: '#f5f5f0' }}>
              <ShoppingBag size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-title">Purchases</span>
              <span className="stat-value">{totalPurchases}</span>
              <span className="stat-change">Direct sales</span>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>Transaction History</h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}><Loader2 className="spinner" size={30} style={{ margin: '0 auto' }} /></div>
          ) : error ? (
            <div className="alert alert-error">{error}</div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No transactions recorded yet.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '13px' }}>
                    <th style={{ padding: '12px' }}>Client</th>
                    <th style={{ padding: '12px' }}>Garment</th>
                    <th style={{ padding: '12px' }}>Type</th>
                    <th style={{ padding: '12px' }}>Date</th>
                    <th style={{ padding: '12px' }}>Amount</th>
                    <th style={{ padding: '12px' }}>Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '16px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                            <User size={14} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 500 }}>{order.user.username}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{order.user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img src={order.product.imageUrl} alt="" style={{ width: '35px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                          <span style={{ fontWeight: 500 }}>{order.product.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 12px' }}>
                        <span className={`badge ${order.type === 'RENTAL' ? 'badge-customer' : 'badge-admin'}`} style={{ fontSize: '10px' }}>
                          {order.type}
                        </span>
                      </td>
                      <td style={{ padding: '16px 12px', fontSize: '13px' }}>
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '16px 12px', fontWeight: 'bold', color: 'var(--accent-gold)' }}>
                        ${order.amount.toFixed(2)}
                      </td>
                      <td style={{ padding: '16px 12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        {order.cardNumber}
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
