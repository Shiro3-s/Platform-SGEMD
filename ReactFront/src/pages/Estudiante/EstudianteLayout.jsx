import React, { useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import EstudianteSidebar from "../../components/EstudianteSidebar.jsx";
import UserMenu from '../../components/UserMenu';
import NotificationBell from '../../components/NotificationBell';
import "./Estudiante.css";

const EstudianteLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/estudiante' || path === '/estudiante/') return 'Home';
    if (path.includes('/estudiante/perfil')) return 'Mi perfil';
    if (path.includes('/estudiante/diagnostico')) return 'Diagnóstico';
    if (path.includes('/estudiante/emprendimientos/mi-emprendimiento')) return 'Mi emprendimiento';
    if (path.includes('/estudiante/emprendimientos/plan-de-trabajo')) return 'Plan de trabajo';
    if (path.includes('/estudiante/emprendimientos/estado-de-seguimiento')) return 'Estado de seguimiento';
    if (path.includes('/estudiante/emprendimientos/perfil')) return 'Perfil de Emprendimiento';
    if (path.includes('/estudiante/recursos/docentes')) return 'Asesores';
    if (path.includes('/estudiante/recursos/asesorias')) return 'Asesoras';
    if (path.includes('/estudiante/eventos')) return 'Eventos disponibles';
    if (path.includes('/estudiante/comparativa')) return 'Comparativa';
    if (path.includes('/estudiante/progreso')) return 'Progreso';
    return 'Panel emprendedor';
  };

  return (
    <div className="estudiante-layout position-relative">
      <EstudianteSidebar user={user} />
      <main className="main-content">
        <header className="dashboard-header">
          <strong>{getPageTitle()}</strong>
          <div className="header-right-group">
            <NotificationBell role="emprendedor" userId={user?.id} />
            <UserMenu user={user} onLogout={logout} />
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
};

export default EstudianteLayout;
