// src/pages/Maestro/SidebarMaestro.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SidebarMaestro = () => {
  const [openMenu, setOpenMenu] = useState('Perfil'); // Abre 'Perfil' por defecto

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const MenuItem = ({ name, path, hasSubmenu, submenuItems }) => (
    <div className="menu-item-container">
      {!hasSubmenu ? (
        <Link
          to={path}
          className={`menu-item ${openMenu === name ? 'activo' : ''}`}
        >
          {name}
        </Link>
      ) : (
        <div
          className={`menu-item ${openMenu === name ? 'activo' : ''}`}
          onClick={() => toggleMenu(name)}
        >
          {name}
          <span className="arrow">{openMenu === name ? '▲' : '▼'}</span>
        </div>
      )}

      {hasSubmenu && openMenu === name && (
        <ul className="submenu">
          {submenuItems.map((item) => (
            <li key={item.name}>
              <Link to={item.path}>{item.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <aside className="sidebar-maestro">
      <div className="logo-sgep">
        {/* CAMBIO: Reemplazamos el texto 'SGEKO' por la imagen del logo */}
        <img 
            // Asume que el logo se llama 'logo-sgeko.png' y está en la raíz de `public/`
            src="/logo.png" 
            alt="Logo SGEKO" 
            className="logo-imagen" // Clase para estilizar
        />
      </div>

      <nav className="navigation-menu"></nav>
 

      <nav className="navigation-menu">
        {/* Perfil */}
        <MenuItem
          name="Perfil"
          hasSubmenu={true}
          submenuItems={[
            { name: 'Completar información personal', path: '/maestro/perfil' },
          ]}
        />

        {/* Emprendimientos */}
        <MenuItem
          name="Emprendimientos"
          hasSubmenu={true}
          submenuItems={[
            { name: 'Perfil de Emprendimiento', path: '/maestro/emprendimientos/perfil' },
            { name: 'Seguimiento', path: '/maestro/emprendimientos/seguimiento' },
          ]}
        />

        {/* Asesorías */}
        <MenuItem name="Mis Asesorías" path="/maestro/asesorias" />
        <MenuItem name="Crear Asesorías" path="/maestro/asesorias/crear" />
        <MenuItem name="Editar Asesorías" path="/maestro/asesorias/editar" />
      </nav>
    </aside>
  );
};

export default SidebarMaestro;
