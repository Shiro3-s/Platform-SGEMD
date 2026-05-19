import React, { useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import EmprendedorSidebar from "../../components/EmprendedorSidebar.jsx";
import UserMenu from '../../components/UserMenu';
import NotificationBell from '../../components/NotificationBell';
import "./Emprendedor.css";

const EmprendedorLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/emprendedor' || path === '/emprendedor/') return 'Home';
    if (path.includes('/emprendedor/perfil')) return 'Mi perfil';
    if (path.includes('/emprendedor/diagnostico')) return 'Diagnóstico';
    if (path.includes('/emprendedor/emprendimientos/mi-emprendimiento')) return 'Mi emprendimiento';
    if (path.includes('/emprendedor/emprendimientos/plan-de-trabajo')) return 'Plan de trabajo';
    if (path.includes('/emprendedor/emprendimientos/estado-de-seguimiento')) return 'Estado de seguimiento';
    if (path.includes('/emprendedor/emprendimientos/perfil')) return 'Perfil de Emprendimiento';
    if (path.includes('/emprendedor/recursos/asesores')) return 'Asesores';
    if (path.includes('/emprendedor/recursos/asesorias')) return 'Asesoras';
    if (path.includes('/emprendedor/eventos')) return 'Eventos disponibles';
    if (path.includes('/emprendedor/comparativa')) return 'Comparativa';
    if (path.includes('/emprendedor/progreso')) return 'Progreso';
    return 'Panel emprendedor';
  };

  return (
      <div className="emprendedor-layout position-relative">
      <EmprendedorSidebar user={user} />
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

export default EmprendedorLayout;



