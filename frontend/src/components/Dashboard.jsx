import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Shield, User, Users, Settings, BarChart3, ShoppingBag, Star } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'User';
  const role = localStorage.getItem('role') || 'CUSTOMER';
  const isAdmin = role === 'ADMIN';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const adminWidgets = [
    { icon: <Users size={22} />, title: 'Total Users', value: '1,248', change: '+12%', color: '#7c3aed' },
    { icon: <BarChart3 size={22} />, title: 'Revenue', value: '₹48,320', change: '+8.5%', color: '#2563eb' },
    { icon: <ShoppingBag size={22} />, title: 'Orders', value: '394', change: '+5%', color: '#db2777' },
    { icon: <Star size={22} />, title: 'Ratings', value: '4.9', change: '+0.1', color: '#f59e0b' },
  ];

  const customerWidgets = [
    { icon: <ShoppingBag size={22} />, title: 'My Orders', value: '12', change: 'Active', color: '#10b981' },
    { icon: <Star size={22} />, title: 'Wishlist', value: '7', change: 'Items', color: '#7c3aed' },
    { icon: <BarChart3 size={22} />, title: 'Total Spent', value: '₹1,240', change: 'This year', color: '#2563eb' },
    { icon: <Shield size={22} />, title: 'Reward Points', value: '3,500', change: 'Points', color: '#f59e0b' },
  ];

  const widgets = isAdmin ? adminWidgets : customerWidgets;

  const adminActions = [
    { icon: <Users size={18} />, label: 'Manage Users', desc: 'View, update or remove user accounts', path: '/admin/users' },
    { icon: <ShoppingBag size={18} />, label: 'Manage Products', desc: 'Add, edit or delete products', path: '/admin/products' },
    { icon: <BarChart3 size={18} />, label: 'View Reports', desc: 'Detailed analytics and reports', path: '/admin/reports' },
    { icon: <Settings size={18} />, label: 'System Settings', desc: 'Configure platform settings', path: '#' },
  ];

  const customerActions = [
    { icon: <ShoppingBag size={18} />, label: 'Browse Products', desc: 'Explore the latest collection', path: '/' },
    { icon: <Star size={18} />, label: 'My Wishlist', desc: 'Items you saved for later', path: '#' },
    { icon: <BarChart3 size={18} />, label: 'Order History', desc: 'Track your past purchases', path: '#' },
    { icon: <User size={18} />, label: 'My Profile', desc: 'Update your account details', path: '#' },
  ];

  const actions = isAdmin ? adminActions : customerActions;

  return (
    <div className="dashboard-page">
      {/* Navbar */}
      <nav className="dashboard-nav glass-card">
        <div className="nav-brand">
          <div className="nav-logo">
            <ShoppingBag size={20} />
          </div>
          <span className="nav-title">Threads<span>& Luxe</span></span>
        </div>
        <div className="nav-right">
          <div className="nav-user">
            <div className="user-avatar">{username.charAt(0).toUpperCase()}</div>
            <div className="user-info">
              <span className="user-name">{username}</span>
              <span className={`badge badge-${role.toLowerCase()}`}>{role}</span>
            </div>
          </div>
          <button id="logout-btn" onClick={handleLogout} className="btn btn-secondary">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        {/* Welcome Banner */}
        <div className={`welcome-banner glass-card ${isAdmin ? 'admin-banner' : 'customer-banner'}`}>
          <div className="welcome-text">
            <div className="welcome-badge">
              {isAdmin ? <Shield size={16} /> : <User size={16} />}
              {isAdmin ? 'Maison Administrator' : 'Client Portal'}
            </div>
            <h1 className="welcome-title">Welcome back, <span>{username}</span> 👋</h1>
            <p className="welcome-subtitle">
              {isAdmin
                ? 'Manage your collection, review atelier analytics, and curate the platform.'
                : 'Explore our latest collections, track your rentals, and manage your wardrobe.'}
            </p>
          </div>
          <div className="welcome-icon">
            {isAdmin ? <Shield size={80} /> : <User size={80} />}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {widgets.map((w, i) => (
            <div key={i} className="stat-card glass-card" style={{ '--accent': w.color }}>
              <div className="stat-icon" style={{ background: `${w.color}22`, color: w.color }}>
                {w.icon}
              </div>
              <div className="stat-info">
                <span className="stat-title">{w.title}</span>
                <span className="stat-value">{w.value}</span>
                <span className="stat-change">{w.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="section-header">
          <h2>Quick Actions</h2>
          <p>{isAdmin ? 'Administrative tools and management options' : 'Common tasks and shortcuts'}</p>
        </div>
        <div className="actions-grid">
          {actions.map((a, i) => (
            <button key={i} className="action-card glass-card" id={`action-${i}`} onClick={() => a.path && a.path !== '#' && navigate(a.path)}>
              <div className="action-icon">{a.icon}</div>
              <div className="action-info">
                <span className="action-label">{a.label}</span>
                <span className="action-desc">{a.desc}</span>
              </div>
              <div className="action-arrow">→</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
