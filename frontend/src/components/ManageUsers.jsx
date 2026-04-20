import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Users, Shield, User, Lock, Unlock, ArrowLeft, Search, Mail, AlertTriangle } from 'lucide-react';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const currentUsername = localStorage.getItem('username');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getUsers();
      setUsers(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (userId, username, isBlocked) => {
    if (username === currentUsername) {
      alert("You cannot block yourself!");
      return;
    }

    if (!window.confirm(`Are you sure you want to ${isBlocked ? 'unblock' : 'block'} ${username}?`)) {
      return;
    }

    try {
      await api.toggleBlockUser(userId);
      fetchUsers(); // Refresh list
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-page">
      <nav className="dashboard-nav glass-card">
        <div className="nav-left">
          <button onClick={() => navigate('/dashboard')} className="btn btn-icon">
            <ArrowLeft size={20} />
          </button>
          <div className="nav-brand">
            <span className="nav-title">Manage<span> Users</span></span>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="section-header">
          <div className="header-text">
            <h2>User Repository</h2>
            <p>Manage platform access and user privileges</p>
          </div>
          <div className="search-bar glass-card">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="alert alert-error glass-card">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="table-container glass-card">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Fetching user data...</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Contact</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">{user.username.charAt(0).toUpperCase()}</div>
                          <div className="user-details">
                            <span className="user-name">{user.username}</span>
                            <span className="user-id">ID: #{user.id}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="contact-cell">
                          <Mail size={14} />
                          <span>{user.email}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${user.role.toLowerCase()}`}>
                          {user.role === 'ADMIN' ? <Shield size={12} /> : <User size={12} />}
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill ${user.blocked ? 'status-blocked' : 'status-active'}`}>
                          {user.blocked ? <Lock size={12} /> : <Unlock size={12} />}
                          {user.blocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className={`btn btn-sm ${user.blocked ? 'btn-success' : 'btn-danger'}`}
                          onClick={() => handleToggleBlock(user.id, user.username, user.blocked)}
                          disabled={user.username === currentUsername}
                          title={user.username === currentUsername ? "Cannot block yourself" : ""}
                        >
                          {user.blocked ? <Unlock size={14} /> : <Lock size={14} />}
                          {user.blocked ? 'Unblock' : 'Block User'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      No users found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
