// src/pages/Maestro/Maestro.jsx

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SidebarMaestro from './SidebarMaestro';
import './Maestro.css';

const Maestro = () => {
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname.includes('/perfil')) return 'Mi Perfil';
    if (location.pathname.includes('/asesorias/crear')) return 'Crear Nueva Asesoría';
    if (location.pathname.includes('/asesorias')) return 'Mis Asesorías';
    return 'Dashboard Principal';
  };

  return (
    <div className="contenedor-maestro">
      <SidebarMaestro />

      <main className="contenido-principal">
        <header className="header-superior">
          {/* En la versión final, el título puede ir en otra posición,
              pero aquí se mantiene en el header superior */}
          <h2>{getPageTitle()}</h2>

          <div className="header-perfil">
            <span className="header-iconos">⚙️</span>
            <span className="header-iconos">🔔</span>
            <span className="profesor-nombre">Profesor</span>
          </div>
        </header>

        {/* Contenido dinámico según la ruta */}
        <div className="area-contenido">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Maestro;
