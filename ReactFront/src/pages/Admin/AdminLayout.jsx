// src/pages/Admin/AdminLayout.jsx (Versión Mejorada y Accesible)
import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar.jsx";
import "./Admin.css";

function AdminLayout() {

  // Función de ejemplo para futuras acciones del perfil
  const handlePerfilClick = () => {
    alert("Aquí puedes abrir un menú de configuración o cerrar sesión");
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main-content">
        <header className="admin-header">
          <span className="header-iconos" title="Configuración">⚙️</span>
          <span className="header-iconos" title="Información">ℹ️</span>
          <span className="header-iconos" title="Notificaciones">🔔</span>

          <div
            className="perfil-admin"
            role="button"
            tabIndex={0}
            onClick={handlePerfilClick}
            onKeyDown={(e) => e.key === "Enter" && handlePerfilClick()}
            aria-label="Perfil de administrador, presiona Enter para opciones"
          >
            <span className="icono-admin" title="Perfil">👤</span>
            <span>Administrador</span>
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
