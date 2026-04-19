const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export const api = {
  register: async (data) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Registration failed');
    }
    return response.text();
  },

  login: async (data) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Invalid credentials');
    }
    return response.json();
  },

  getAuthHeaders: () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  },

  getProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  searchProducts: async (query) => {
    const response = await fetch(`${API_BASE_URL}/products/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search products');
    return response.json();
  },

  createProduct: async (data) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: api.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  },

  updateProduct: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: api.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  },

  deleteProduct: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: api.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete product');
    return true;
  },

  createOrder: async (data) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: api.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Checkout failed');
    return response.json();
  },

  getOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: api.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch reports');
    return response.json();
  },
};
