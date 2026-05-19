import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { apiFetch } from '../api';

export const AuthContext = createContext();

const rolesMap = { 1: 'administrador', 2: 'emprendedor', 3: 'asesor' };

const formatUser = (data) => {
  const rolId = data.Roles_idRoles1 || data.Rol;
  const rol = typeof rolId === 'number' ? rolesMap[rolId] : rolesMap[parseInt(rolId)] || 'desconocido';
  return {
    id: data.idUsuarios,
    nombre: data.Nombre,
    rol: rol,
    rolId: rolId,
    correo: data.CorreoInstitucional,
    raw: data,
  };
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isRedirectingRef = useRef(false);

  const handleExpiredSession = useCallback(() => {
    if (isRedirectingRef.current) return;
    isRedirectingRef.current = true;
    localStorage.removeItem('token');
    setUser(null);
    sessionStorage.setItem('sessionExpired', 'true');
    if (window.location.pathname !== '/') {
      window.location.href = '/';
    }
  }, []);

  const verifySession = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await apiFetch('/segmed/users/me', {}, 5000);
      if (res.success && res.data) {
        setUser(formatUser(res.data));
      } else {
        handleExpiredSession();
      }
    } catch {
      // Network/500 errors should NOT expire session; apiFetch already calls logoutHandler on 401/403
    } finally {
      setLoading(false);
    }
  }, [handleExpiredSession]);

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  const updateUser = useCallback((userData) => {
    setUser(formatUser(userData));
  }, []);

  const logout = useCallback(() => {
    if (isRedirectingRef.current) return;
    isRedirectingRef.current = true;
    localStorage.removeItem('token');
    setUser(null);
    if (window.location.pathname !== '/') {
      window.location.href = '/';
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser: verifySession, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
