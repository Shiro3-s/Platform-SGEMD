// src/pages/Admin/Admin.jsx

import React, { useEffect, useState } from 'react';
import UserMenu from '../../components/UserMenu';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

const getAuthHeaders = (includeContentType = true) => {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

const Admin = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    fetch(`${API_URL}/segmed/users/me`, {
      method: 'GET',
      headers: getAuthHeaders(false),
      credentials: 'include'
    })
      .then(r => r.json())
      .then(j => setUser(j.data || j));
  }, []);
  return (
    <div className="container position-relative">
      <UserMenu user={user} onLogout={() => { window.location.href = '/login'; }} />
      <div className="card mt-5">
        <h1>👋 Bienvenido al Panel de Administración</h1>
        <p>Aquí puedes ver las estadísticas y los accesos rápidos.</p>
      </div>
    </div>
  );
};

export default Admin;
