// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { apiFetch } from "./api";

// 🔹 Componentes principales
import Login from "./components/Login";
import Register from "./components/Register";
import PrivateRoute from "./routes/PrivateRoute";

// 🔹 Layouts y páginas del Administrador
import AdminPage from "./pages/Admin/Admin.jsx"; // Dashboard principal del admin
import AdminLayout from "./pages/Admin/AdminLayout.jsx"; // Layout con <Outlet />

// 🔹 Subpáginas del Administrador
import AdminAsignar from "./pages/Admin/AdminAsignar.jsx";
import AdminPerfil from "./pages/Admin/Perfil.jsx";
import AdminUsuarios from "./pages/Admin/Usuarios.jsx";
import GestionarUsuarios from "./pages/Admin/GestionarUsuarios.jsx";

// 🔹 Páginas del Maestro
import Maestro from "./pages/Maestro/Maestro.jsx";
import MaestroDashboard from "./pages/Maestro/MaestroDashboard.jsx";
import MaestroPerfil from "./pages/Maestro/Perfil.jsx";
import MaestroAsesorias from "./pages/Maestro/Asesorias.jsx";
import MaestroAsesoriasCrear from "./pages/Maestro/AsesoriasCrear.jsx";

// 🔹 Páginas del Estudiante
import EstudianteLayout from "./pages/Estudiante/EstudianteLayout.jsx";
import EstudianteDashboard from "./pages/Estudiante/DashboardContent.jsx";
import EstudiantePerfil from "./pages/Estudiante/Perfil.jsx";
import EstudianteProgreso from "./pages/Estudiante/Progreso.jsx";

function App() {
  // 🔹 Estado global del usuario autenticado
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true); // Nuevo estado de carga

  // 🔹 Efecto para restaurar sesión desde localStorage al recargar
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");
      console.log('🔍 App.js: Verificando sesión...');
      console.log('   Token en localStorage:', token ? 'PRESENTE' : 'AUSENTE');
      if (token) {
        try {
          // Validar token con el backend
          const res = await apiFetch('/segmed/users/me');
          if (res.success && res.data) {
            const user = res.data;
            const rolesMap = { 1: "administrador", 2: "estudiante", 3: "maestro" };
            const rol = rolesMap[user.Roles_idRoles1] || "desconocido";

            setUsuario({
              nombre: user.Nombre,
              rol: rol,
              id: user.idUsuarios
            });
            console.log('✅ Sesión restaurada:', { nombre: user.Nombre, rol });
          } else {
            // Token inválido o expirado según el backend
            console.warn("Sesión inválida, limpiando token");
            localStorage.removeItem("token");
          }
        } catch (err) {
          console.error("❌ Error validando sesión:", err.message);
          localStorage.removeItem("token");
        }
      } else {
        console.log('⚠️ No hay token en localStorage');
      }
      setLoading(false); // Finalizar carga
    };

    checkSession();
  }, []);

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>;
  }

  return (
    <Router>
      <Routes>
        {/* Ruta pública - Vista combinada (login/register) en la raíz */}
        <Route path="/" element={<Register setUsuario={setUsuario} />} />
        {/* Rutas alternativas: acceso directo a login o register si se necesita */}
        <Route path="/login" element={<Login setUsuario={setUsuario} />} />
        <Route path="/register" element={<Register setUsuario={setUsuario} />} />

        {/* ========================================================= */}
        {/* 🟢 RUTA PÚBLICA: (la raíz ya muestra el formulario combinado) */}
        {/* ========================================================= */}

        {/* ========================================================= */}
        {/* 🧑‍🎓 RUTAS ANIDADAS: ESTUDIANTE */}
        {/* ========================================================= */}
        <Route
          path="/estudiante"
          element={
            <PrivateRoute usuario={usuario} allowedRoles={["estudiante"]}>
              <EstudianteLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<EstudianteDashboard />} />
          <Route path="perfil" element={<EstudiantePerfil />} />
          <Route path="progreso" element={<EstudianteProgreso />} />
          <Route path="comparativa" element={<div>Vista de Comparativa</div>} />
        </Route>

        {/* ========================================================= */}
        {/* 👨‍🏫 RUTAS ANIDADAS: MAESTRO */}
        {/* ========================================================= */}
        <Route
          path="/maestro"
          element={
            <PrivateRoute usuario={usuario} allowedRoles={["maestro"]}>
              <Maestro />
            </PrivateRoute>
          }
        >
          <Route index element={<MaestroDashboard />} />
          <Route path="perfil" element={<MaestroPerfil />} />
          <Route path="asesorias" element={<MaestroAsesorias />} />
          <Route path="asesorias/crear" element={<MaestroAsesoriasCrear />} />
          <Route path="asesorias/editar" element={<div>Editar Asesorías View</div>} />
          <Route path="emprendimientos/perfil" element={<div>Perfil Emprendimiento View</div>} />
          <Route path="emprendimientos/seguimiento" element={<div>Seguimiento Emprendimiento View</div>} />
        </Route>

        {/* ========================================================= */}
        {/* 🧑‍💼 RUTAS ANIDADAS: ADMINISTRADOR */}
        {/* ========================================================= */}
        <Route
          path="/admin"
          element={
            <PrivateRoute usuario={usuario} allowedRoles={["administrador"]}>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          {/* 1️⃣ Dashboard */}
          <Route index element={<AdminPage />} />

          {/* 2️⃣ Perfil del administrador */}
          <Route path="perfil" element={<AdminPerfil />} />

          {/* Gestión de usuarios */}
          <Route path="usuarios" element={<AdminUsuarios />} />

          {/* 3️⃣ Asignación de docentes */}
          <Route path="docentes/asignar" element={<AdminAsignar />} />

          {/* 4️⃣ Otras rutas de ejemplo */}
          <Route path="gestionar/docentes" element={<GestionarUsuarios role="docente" />} />
          <Route path="gestionar/estudiantes" element={<GestionarUsuarios role="estudiante" />} />
          <Route path="emprendimientos/plan-de-trabajo" element={<div>Plan de Trabajo View</div>} />
          <Route path="eventos/crear" element={<div>Crear Evento View</div>} />
          <Route path="eventos/editar" element={<div>Editar Evento View</div>} />
        </Route>

        {/* ========================================================= */}
        {/* 🚫 RUTA DE FALLBACK / 404 */}
        {/* ========================================================= */}
        <Route path="*" element={<div>404 - Página no encontrada</div>} />

      </Routes>
    </Router>
  );
}

export default App;
