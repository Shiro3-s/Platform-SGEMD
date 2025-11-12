// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 🔹 Componentes principales
import Login from "./components/Login";
import PrivateRoute from "./routes/PrivateRoute";

// 🔹 Layouts y páginas del Administrador
import AdminPage from "./pages/Admin/Admin.jsx"; // Dashboard principal del admin
import AdminLayout from "./pages/Admin/AdminLayout.jsx"; // Layout con <Outlet />

// 🔹 Subpáginas del Administrador
import AdminAsignar from "./pages/Admin/AdminAsignar.jsx";
import AdminPerfil from "./pages/Admin/Perfil.jsx";

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

  return (
    <Router>
      <Routes>

        {/* ========================================================= */}
        {/* 🟢 RUTA PÚBLICA: LOGIN */}
        {/* ========================================================= */}
        <Route path="/" element={<Login setUsuario={setUsuario} />} />

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

          {/* 3️⃣ Asignación de docentes */}
          <Route path="docentes/asignar" element={<AdminAsignar />} />

          {/* 4️⃣ Otras rutas de ejemplo */}
          <Route path="gestionar/docentes" element={<div>Gestionar Docentes View</div>} />
          <Route path="gestionar/estudiantes" element={<div>Gestionar Estudiantes View</div>} />
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
