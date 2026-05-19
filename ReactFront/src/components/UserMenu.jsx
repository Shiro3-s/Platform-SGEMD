import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import './UserMenu.css';

const getRolLabel = (rol) => {
  if (rol === 1 || rol === 'Administrador' || rol === 'Admin' || rol === 'administrador') return 'Administrador';
  if (rol === 2 || rol === 'Emprendedor' || rol === 'emprendedor') return 'Emprendedor';
  if (rol === 3 || rol === 'Asesor' || rol === 'asesor') return 'Asesor';
  return 'Usuario';
};

const getRolHref = (rol) => {
  if (rol === 1 || rol === 'Administrador' || rol === 'Admin' || rol === 'administrador') return '/admin';
  if (rol === 2 || rol === 'Emprendedor' || rol === 'emprendedor') return '/emprendedor';
  if (rol === 3 || rol === 'Asesor' || rol === 'asesor') return '/asesor';
  return '/';
};

export default function UserMenu({ user, onLogout }) {
  const { logout: contextLogout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    setOpen(false);
    if (onLogout) {
      onLogout();
      return;
    }
    if (contextLogout) {
      contextLogout();
      return;
    }
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!menuRef.current || menuRef.current.contains(event.target)) return;
      setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const rolLabel = getRolLabel(user.rol || user.rolId || user.Rol);
  const rolHref = getRolHref(user.rol || user.rolId || user.Rol);

  const opciones = [
    { label: 'Mi perfil', href: `${rolHref}/perfil` },
  ];

  return (
    <div className="user-menu-dropdown" ref={menuRef}>
      <button
        className="btn btn-light dropdown-toggle user-menu-btn"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="user-menu-name">{user.nombre || user.Nombre || 'Usuario'}</span>
        <span className="badge bg-secondary user-menu-role">{rolLabel}</span>
      </button>
      <ul className={`dropdown-menu${open ? ' show' : ''}`} style={{ right: 0, left: 'auto', minWidth: 200 }}>
        {opciones.map(opt => (
          <li key={opt.label}>
            <a className="dropdown-item" href={opt.href} onClick={() => setOpen(false)}>{opt.label}</a>
          </li>
        ))}
        <li><hr className="dropdown-divider" /></li>
        <li><button className="dropdown-item text-danger" onClick={handleLogout}>Cerrar sesión</button></li>
      </ul>
    </div>
  );
}



