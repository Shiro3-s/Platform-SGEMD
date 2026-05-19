import React, { useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import SidebarAsesor from '../../components/SidebarAsesor';
import UserMenu from '../../components/UserMenu';
import NotificationBell from '../../components/NotificationBell';
import './Asesor.css';

const Asesor = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname === '/asesor' || location.pathname === '/asesor/') return 'Home';
    if (location.pathname.includes('/perfil')) return 'Mi Perfil';
    if (location.pathname.includes('/emprendimientos/perfil')) return 'Perfil de Emprendimiento';
    if (location.pathname.includes('/emprendimientos/seguimiento')) return 'Seguimiento de Emprendimiento';
    if (location.pathname.includes('/asesorias/crear')) return 'Crear Nueva Asesora';
    if (location.pathname.includes('/asesorias/historial')) return 'Historial de Asesoras';
    if (location.pathname.includes('/asesorias/pendientes')) return 'Asesoras Pendientes';
    if (location.pathname.includes('/asesorias/editar')) return 'Editar Asesoras';
    if (location.pathname.includes('/asesorias')) return 'Solicitudes de Asesora';
    if (location.pathname.includes('/eventos/crear')) return 'Publicar Evento';
    if (location.pathname.includes('/eventos')) return 'Eventos';
    if (location.pathname.includes('/tareas')) return 'Tareas';
    if (location.pathname.includes('/diagnosticos')) return 'Diagnsticos';
    return 'Panel Asesor';
  };

  return (
    <div className="contenedor-Asesor position-relative">
      <SidebarAsesor user={user} />
      <main className="contenido-principal">
        <header className="header-superior">
          <h2>{getPageTitle()}</h2>
          <div className="header-right-group">
            <NotificationBell role="asesor" userId={user?.id} />
            <UserMenu user={user} onLogout={logout} />
          </div>
        </header>
        <div className="area-contenido">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Asesor;


