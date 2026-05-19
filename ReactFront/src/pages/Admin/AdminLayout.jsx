import React, { useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AdminSidebar from "../../components/AdminSidebar.jsx";
import UserMenu from "../../components/UserMenu";
import NotificationBell from "../../components/NotificationBell";

import "./Admin.css";

function AdminLayout() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const getHeaderTitle = () => {
    const path = location.pathname;
    if (path === '/admin' || path === '/admin/') return 'Home';
    if (path.includes('/admin/perfil')) return 'Perfil administrador';
    if (path.includes('/admin/gestionar/docentes')) return 'Gestin de asesores';
    if (path.includes('/admin/gestionar/estudiantes')) return 'Gestin de emprendedores';
    if (path.includes('/admin/docentes/asignar')) return 'Asignacin de asesores';
    if (path.includes('/admin/docentes/seguimiento')) return 'Seguimiento de asesores';
    if (path.includes('/admin/docentes/asesorias')) return 'Asesoras de asesores';
    if (path.includes('/admin/emprendimientos/plan-de-trabajo')) return 'Plan de trabajo';
    if (path.includes('/admin/emprendimientos/seguimiento')) return 'Seguimiento de emprendimientos';
    if (path.includes('/admin/emprendimientos/editar')) return 'Edicin de emprendimientos';
    if (path.includes('/admin/emprendimientos/crear')) return 'Crear emprendimiento';
    if (path.includes('/admin/eventos/crear')) return 'Crear evento';
    if (path.includes('/admin/eventos/editar')) return 'Editar eventos';
    if (path.includes('/admin/eventos')) return 'Eventos';
    if (path.includes('/admin/diagnosticos')) return 'Diagnsticos';
    if (path.includes('/admin/usuarios')) return 'Usuarios';
    return 'Administracin SGEMD';
  };

  return (
    <div className="admin-layout position-relative">
      <AdminSidebar user={user} />

      <div className="admin-main-content">
        <header className="admin-header">
          <strong>{getHeaderTitle()}</strong>
          <div className="header-right-group">
            <NotificationBell role="admin" userId={user?.id} />
            <UserMenu user={user} onLogout={logout} />
          </div>
        </header>

        <div className="admin-area-contenido">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
