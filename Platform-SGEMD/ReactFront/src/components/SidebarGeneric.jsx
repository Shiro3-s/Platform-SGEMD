// src/components/SidebarGeneric.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Componente de flecha para indicar el estado del submenú
 */
const IconArrow = ({ isOpen }) => (
    <span style={{ transition: 'transform 0.2s', marginLeft: 'auto', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
        ▼
    </span>
);

/**
 * Sidebar Genérico
 * @param {string} basePath - Ruta base del rol ("/admin", "/estudiante", etc.)
 * @param {array} menuData - Estructura del menú
 * @param {string} roleClass - Clase CSS del sidebar
 * @param {string} logoText - Texto que aparece al lado del logo
 */
function SidebarGeneric({ basePath, menuData, roleClass, logoText }) {
    const location = useLocation();
    const [openMenu, setOpenMenu] = useState(null);

    const getFullPath = (path) => {
        if (path === "/") return basePath;
        return `${basePath}${path}`;
    };

    const toggleMenu = (name) => {
        setOpenMenu(openMenu === name ? null : name);
    };

    const isActive = (path) => {
        const fullPath = getFullPath(path);
        if (path === "/") return location.pathname === fullPath;
        return location.pathname.startsWith(fullPath);
    };

    return (
        <aside className={roleClass || "sidebar"}>
            
            {/* 🔵 LOGO CORREGIDO — toma el archivo desde /public/logo.png */}
            <div className="logo-area" style={{ padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link to={basePath}>
                    <img 
                        src="/logo.png"   // ← YA NO SE IMPORTA, SE LEE DESDE PUBLIC
                        alt="Logo del Sistema"
                        className="logo-img"
                        style={{ width: "220px", height: "100px" }}
                    />
                </Link>
                <span style={{ fontWeight: "bold" }}>{logoText}</span>
            </div>

            <nav className="navigation-menu">
                {menuData.map((item) => {
                    const isGroupActive = item.submenus && item.submenus.some(sub => isActive(sub.path));

                    const itemClass = `
                        menu-item 
                        ${!item.submenus && isActive(item.path) ? 'activo-principal' : ''} 
                        ${item.submenus && isGroupActive ? 'activo-grupo' : ''}
                    `;

                    if (!item.submenus) {
                        return (
                            <Link
                                key={item.name}
                                to={getFullPath(item.path)}
                                className={itemClass}
                            >
                                <span className="menu-icon">{item.icon}</span> {item.name}
                            </Link>
                        );
                    }

                    const isOpen = openMenu === item.name || isGroupActive;

                    return (
                        <div key={item.name} className="menu-item-container">
                            <div
                                className={itemClass}
                                onClick={() => toggleMenu(item.name)}
                            >
                                <span className="menu-icon">{item.icon}</span> {item.name}
                                <IconArrow isOpen={isOpen} />
                            </div>

                            {isOpen && (
                                <div className="submenu">
                                    {item.submenus.map((sub) => (
                                        <Link
                                            key={sub.name}
                                            to={getFullPath(sub.path)}
                                            className={`submenu-item ${location.pathname === getFullPath(sub.path) ? 'activo-submenu' : ''}`}
                                        >
                                            {sub.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

        </aside>
    );
}

export default SidebarGeneric;
