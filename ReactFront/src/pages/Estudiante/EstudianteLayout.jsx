// src/pages/Estudiante/Estudiante.jsx
import React from "react";
import { Outlet } from "react-router-dom"; // Permite mostrar las rutas hijas
import Sidebar from "./Sidebar"; // Barra lateral del estudiante
import "./Estudiante.css"; // Estilos del layout

const Estudiante = () => {
  return (
    <div className="estudiante-layout">
      {/* Barra lateral siempre visible */}
      <Sidebar />

      <main className="main-content">
        <header className="dashboard-header">
          {/* Íconos de acciones rápidas */}
          <div className="header-right">
            <span className="icon-link">⚙️</span>
            <span className="icon-link">ℹ️</span>
            <span className="icon-link">🔔</span>
            <span className="user-name">Estudiante</span>
          </div>
        </header>

        {/* 🔹 Aquí se inyectan las vistas anidadas (Dashboard, Perfil, Progreso, etc.) */}
        <Outlet />
      </main>
    </div>
  );
};

export default Estudiante;
