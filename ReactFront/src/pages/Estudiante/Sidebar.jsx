import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // ⬅️ ¡IMPORTANTE!

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  // El componente MenuItem usa Link para navegar
  const MenuItem = ({ name, path, hasSubmenu, submenuItems }) => (
    <div className="menu-item-container">
      {/* Si tiene un path y no tiene submenú, es un Link */}
      {!hasSubmenu ? (
        <Link 
            to={path} 
            className={`menu-item ${openMenu === name ? 'active' : ''}`}
        >
            {name}
        </Link>
      ) : (
        // Si tiene submenú, es un botón para desplegar
        <div 
          className={`menu-item ${openMenu === name ? 'active' : ''}`}
          onClick={() => toggleMenu(name)}
        >
          {name} 
          <span>{openMenu === name ? '▲' : '▼'}</span>
        </div>
      )}
      
      {/* Submenú */}
      {hasSubmenu && openMenu === name && (
        <ul className="submenu">
          {submenuItems.map(item => (
            <li key={item.name}>
                <Link to={item.path}>{item.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <aside className="sidebar">
      {/* ... (Logo y encabezado) ... */}
      <nav className="navigation-menu">
        {/* 1. Perfil (con submenú) */}
        <MenuItem 
            name="Perfil" 
            hasSubmenu={true} 
            submenuItems={[{ name: "Completar información personal", path: "/estudiante/perfil" }]} 
        />
        {/* 2. Emprendimientos (con submenú) - Puedes ajustar los paths */}
        <MenuItem 
            name="Emprendimientos" 
            hasSubmenu={true} 
            submenuItems={[
                { name: "Perfil de Emprendimiento", path: "/estudiante/emprendimiento/perfil" },
                { name: "Inscripción", path: "/estudiante/emprendimiento/inscripcion" }
            ]} 
        />
        {/* 3. Diagnóstico (Ruta principal del Dashboard) */}
        <MenuItem name="Diagnóstico" path="/estudiante" /> 
        
        {/* 4. Otros enlaces (ajusta los paths) */}
        <MenuItem name="Plan de Trabajo" path="/estudiante/plan" />
        <MenuItem name="Estado de Seguimiento" path="/estudiante/seguimiento" />
        <MenuItem name="Docentes" path="/estudiante/docentes" />
        <MenuItem name="Asesorías" path="/estudiante/asesorias" />
        
        {/* 5. Eventos (con submenú) */}
        <MenuItem 
            name="Eventos" 
            hasSubmenu={true} 
            submenuItems={[{ name: "Consultar", path: "/estudiante/eventos" }]} 
        />
      </nav>
    </aside>
  );
};

export default Sidebar;