// src/pages/Estudiante/EstudianteLayout.jsx
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import EstudianteSidebar from "../../components/EstudianteSidebar.jsx"; 
import UserMenu from '../../components/UserMenu';
import "./Estudiante.css";

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

const EstudianteLayout = () => {
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
    <div className="estudiante-layout position-relative">
      <UserMenu user={user} onLogout={() => { window.location.href = '/login'; }} />
      {/* Barra lateral */}
      <EstudianteSidebar />
      <main className="main-content">
        <header className="dashboard-header">
          <div className="header-right">
            <span className="icon-link">⚙️</span>
            <span className="icon-link">ℹ️</span>
            <span className="icon-link">🔔</span>
          </div>
        </header>
        {/* Aquí se cargan las rutas hijas */}
        <Outlet />
      </main>
    </div>
  );
};

export default EstudianteLayout;
