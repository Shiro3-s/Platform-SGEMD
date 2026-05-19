// src/components/EstudianteSidebar.jsx

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
    { title: 'Diagnóstico', items: ['Ver diagnóstico'] },
    { title: 'Emprendimientos', items: ['Plan de Trabajo', 'Estado de Seguimiento', 'Mi Progreso'] },
    { title: 'Recursos', items: ['Docentes', 'Asesorías'] },
    { title: 'Eventos', items: ['Ver eventos disponibles'] },
];

const normalize = (value) =>
    value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '');

const hasValue = (value) => String(value || '').trim().length > 0;

const isStudentProfileComplete = (user) => {
    if (!user) return false;
    return hasValue(user.Nombre)
        && hasValue(user.Direccion)
        && hasValue(user.Telefono)
        && hasValue(user.Genero)
        && hasValue(user.Modalidad)
        && hasValue(user.Semestre)
        && hasValue(user.FechaNacimiento);
};

const EstudianteSidebar = ({ user }) => {
    const location = useLocation();
    const activePath = location.pathname;

    // Abiertos por defecto
    const [openMenus, setOpenMenus] = useState(['Perfil', 'Emprendimientos', 'Recursos']);

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

        if (item === 'completarinformacionpersonal') return '/estudiante/perfil';
        if (item === 'completarperfil') return '/estudiante/perfil';
        if (item === 'verdiagnostico') return '/estudiante/diagnostico';
        if (item === 'plandetrabajo') return '/estudiante/emprendimiento/perfil';
        if (item === 'estadodeseguimiento') return '/estudiante/seguimiento';
        if (item === 'miprogreso') return '/estudiante/progreso';
        if (item === 'docentes') return '/estudiante/recursos/docentes';
        if (item === 'asesorias') return '/estudiante/recursos/asesorias';
        if (item === 'vereventosdisponibles') return '/estudiante/eventos';

        return `/estudiante/${base}/${item}`;
    };

    const profileItemLabel = isStudentProfileComplete(user) ? 'Mi perfil' : 'Completar perfil';
    const resolvedMenuStructure = menuStructure.map((group) => (
        group.title === 'Perfil'
            ? { ...group, items: [profileItemLabel] }
            : group
    ));

    return (
        <aside
            className="admin-sidebar"
            style={{ height: '100vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', width: '250px', minWidth: '250px', position: 'sticky', top: 0 }}
        >
            <div className="logo-admin-area" style={{ position: 'sticky', top: 0, zIndex: 10, minHeight: '90px', flexShrink: 0, justifyContent: 'center' }}>
                <img
                    src="/logo.png"
                    alt="Logo SGEMD Emprendedor"
                    className="logo-admin-imagen"
                    style={{ maxHeight: '75px', maxWidth: '200px', width: 'auto', height: 'auto' }}
                />
            </div>

            <nav>
                <Link
                    to="/estudiante"
                    className={`admin-menu-item ${activePath === '/estudiante' ? 'activo' : ''}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                    Home
                </Link>

                {/* Grupos de menú colapsables */}
                {resolvedMenuStructure.map((group) => (
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

export default EstudianteSidebar;
