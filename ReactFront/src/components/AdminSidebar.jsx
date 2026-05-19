// src/pages/Admin/AdminSidebar.jsx

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Íconos SVG para indicar el estado del submenú
const IconAngleUp = (props) => (
  <svg
    {...props}
    width="16"
    height="16"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    fill="currentColor"
  >
    <path d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z" />
  </svg>
);

const IconAngleDown = (props) => (
  <svg
    {...props}
    width="16"
    height="16"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    fill="currentColor"
  >
    <path d="M201.4 342.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
  </svg>
);

const menuStructure = [
  { title: 'Perfil', items: ['Completar información personal'] },
  { title: 'Gestionar perfiles', items: ['Docentes', 'Estudiantes'] },
  { title: 'Emprendimientos', items: ['Plan de trabajo', 'Crear Emprendimiento'] },
  { title: 'Docentes', items: ['Asignar a emprendimiento', 'Seguimiento', 'Asesorias'] },
  { title: 'Eventos', items: ['Crear', 'Editar'] },
  { title: 'Diagnósticos', items: ['Gestionar'] },
];

const normalize = (value) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '');

const AdminSidebar = () => {
  const location = useLocation();
  const activePath = location.pathname;

  // Abiertos por defecto
  const [openMenus, setOpenMenus] = useState(['Perfil', 'Docentes', 'Emprendimientos']);

  const toggleMenu = (title) => {
    setOpenMenus((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  const getLinkPath = (groupTitle, itemTitle) => {
    const base = normalize(groupTitle);
    const item = normalize(itemTitle);

    if (item === 'completarinformacionpersonal') return '/admin/perfil';
    if (item === 'asignaraemprendimiento') return '/admin/docentes/asignar';
    if (item === 'docentes' && base === 'gestionarperfiles')
      return '/admin/gestionar/docentes';
    if (item === 'estudiantes' && base === 'gestionarperfiles')
      return '/admin/gestionar/estudiantes';
    if (item === 'plandetrabajo') return '/admin/emprendimientos/plan-de-trabajo';
    if (item === 'crearemprendimiento') return '/admin/emprendimientos/crear';
    if (item === 'crear' && base === 'eventos') return '/admin/eventos';
    if (item === 'editar' && base === 'eventos') return '/admin/eventos';
    if (item === 'gestionar' && base === 'diagnosticos') return '/admin/diagnosticos';
    if (item === 'seguimiento' && base === 'docentes') return '/admin/docentes/seguimiento';
    if (item === 'asesorias' && base === 'docentes') return '/admin/docentes/asesorias';

    return `/admin/${base}/${item}`;
  };

  return (
    <aside className="admin-sidebar">
      <div className="logo-admin-area">
        <img
          src="/logo.png"
          alt="Logo SGEMD Admin"
          className="logo-admin-imagen"
        />
      </div>

      <nav>
        <Link
          to="/admin"
          className={`admin-menu-item ${activePath === '/admin' ? 'activo' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Home
        </Link>

        {/* Grupos de menú colapsables */}
        {menuStructure.map((group) => (
          <div key={group.title}>
            <div
              className="admin-menu-group-title"
              onClick={() => toggleMenu(group.title)}
            >
              {group.title}
              {openMenus.includes(group.title) ? <IconAngleUp /> : <IconAngleDown />}
            </div>

            {/* Submenú */}
            {openMenus.includes(group.title) && (
              <div className="submenu-admin">
                {group.items.map((item) => {
                  const itemPath = getLinkPath(group.title, item);
                  return (
                    <Link
                      key={item}
                      to={itemPath}
                      className={`admin-menu-item ${activePath === itemPath ? 'activo' : ''}`}
                    >
                      {item}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
