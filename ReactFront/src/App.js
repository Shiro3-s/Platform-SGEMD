import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { setLogoutHandler } from "./api";
import SessionExpired from "./components/SessionExpired";

import Register from "./components/Register";
import PrivateRoute from "./routes/PrivateRoute";

import AdminPage from "./pages/Admin/Admin.jsx";
import AdminLayout from "./pages/Admin/AdminLayout.jsx";
import AdminAsignar from "./pages/Admin/AdminAsignar.jsx";
import AdminPerfil from "./pages/Admin/Perfil.jsx";
import AdminUsuarios from "./pages/Admin/Usuarios.jsx";
import GestionarUsuarios from "./pages/Admin/GestionarUsuarios.jsx";
import AdminPlanTrabajo from "./pages/Admin/AdminPlanTrabajo.jsx";
import AdminEventos from "./pages/Admin/AdminEventos.jsx";
import AdminDocentes from "./pages/Admin/AdminDocentes.jsx";
import AdminCrearEmprendimiento from "./pages/Admin/AdminCrearEmprendimiento.jsx";
import AdminVerEmprendimiento from "./pages/Admin/AdminVerEmprendimiento.jsx";
import AdminDiagnostico from "./pages/Admin/AdminDiagnostico.jsx";

import Maestro from "./pages/Maestro/Maestro.jsx";
import MaestroDashboard from "./pages/Maestro/MaestroDashboard.jsx";
import MaestroPerfil from "./pages/Maestro/Perfil.jsx";
import MaestroAsesorias from "./pages/Maestro/Asesorias.jsx";
import MaestroAsesoriasCrear from "./pages/Maestro/AsesoriasCrear.jsx";
import MaestroAsesoriasEditar from "./pages/Maestro/AsesoriasEditar.jsx";
import MaestroEmprendimientos from "./pages/Maestro/Emprendimientos.jsx";
import MaestroEmpSeguimiento from "./pages/Maestro/EmpSeguimiento.jsx";
import MaestroTareas from "./pages/Maestro/MaestroTareas.jsx";
import MaestroDiagnostico from "./pages/Maestro/MaestroDiagnostico.jsx";
import MaestroEventos from "./pages/Maestro/MaestroEventos.jsx";

import EstudianteLayout from "./pages/Estudiante/EstudianteLayout.jsx";
import EstudianteDashboard from "./pages/Estudiante/DashboardContent.jsx";
import EstudiantePerfil from "./pages/Estudiante/Perfil.jsx";
import EstudianteProgreso from "./pages/Estudiante/Progreso.jsx";
import EstudiantePerfilEmp from "./pages/Estudiante/PerfilEmprendimiento.jsx";
import EstudiantePlan from "./pages/Estudiante/PlanTrabajo.jsx";
import EstudianteSeguimiento from "./pages/Estudiante/Seguimiento.jsx";
import EstudianteComparativa from "./pages/Estudiante/Comparativa.jsx";
import DocentesRecursos from "./pages/Estudiante/DocentesRecursos.jsx";
import AsesoriasRecursos from "./pages/Estudiante/AsesoriasRecursos.jsx";
import EventosEstudiante from "./pages/Estudiante/EventosEstudiante.jsx";
import DiagnosticoEstudiante from "./pages/Estudiante/Diagnostico.jsx";

function AppContent() {
  const { user, loading, logout } = useContext(AuthContext);
  const [showExpired, setShowExpired] = useState(false);

  useEffect(() => {
    setLogoutHandler(() => {
      setShowExpired(true);
      setTimeout(() => {
        setShowExpired(false);
        logout();
      }, 3000);
    });
  }, [logout]);

  useEffect(() => {
    const wasExpired = sessionStorage.getItem('sessionExpired');
    if (wasExpired) {
      sessionStorage.removeItem('sessionExpired');
      setShowExpired(true);
      setTimeout(() => {
        setShowExpired(false);
      }, 3000);
    }
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {showExpired && <SessionExpired />}
      <Router>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/estudiante"
            element={
              <PrivateRoute allowedRoles={["emprendedor"]}>
                <EstudianteLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<EstudianteDashboard />} />
            <Route path="perfil" element={<EstudiantePerfil />} />
            <Route path="progreso" element={<EstudianteProgreso />} />
            <Route path="emprendimiento/perfil" element={<EstudiantePerfilEmp />} />
            <Route path="plan" element={<EstudiantePlan />} />
            <Route path="seguimiento" element={<EstudianteSeguimiento />} />
            <Route path="comparativa" element={<EstudianteComparativa />} />
            <Route path="recursos/docentes" element={<DocentesRecursos />} />
            <Route path="recursos/asesorias" element={<AsesoriasRecursos />} />
            <Route path="eventos" element={<EventosEstudiante />} />
            <Route path="diagnostico" element={<DiagnosticoEstudiante />} />
          </Route>

          <Route
            path="/maestro"
            element={
              <PrivateRoute allowedRoles={["asesor"]}>
                <Maestro />
              </PrivateRoute>
            }
          >
            <Route index element={<MaestroDashboard />} />
            <Route path="perfil" element={<MaestroPerfil />} />
            <Route path="asesorias" element={<MaestroAsesorias />} />
            <Route path="asesorias/crear" element={<MaestroAsesoriasCrear />} />
            <Route path="asesorias/editar" element={<MaestroAsesoriasEditar />} />
            <Route path="emprendimientos/perfil" element={<MaestroEmprendimientos />} />
            <Route path="emprendimientos/seguimiento" element={<MaestroEmpSeguimiento />} />
            <Route path="tareas" element={<MaestroTareas />} />
            <Route path="diagnosticos" element={<MaestroDiagnostico />} />
            <Route path="eventos" element={<MaestroEventos />} />
          </Route>

          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={["administrador"]}>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<AdminPage />} />
            <Route path="perfil" element={<AdminPerfil />} />
            <Route path="usuarios" element={<AdminUsuarios />} />
            <Route path="docentes/asignar" element={<AdminAsignar />} />
            <Route path="docentes/gestion" element={<AdminDocentes />} />
            <Route path="gestionar/docentes" element={<GestionarUsuarios role="docente" />} />
            <Route path="gestionar/estudiantes" element={<GestionarUsuarios role="estudiante" />} />
            <Route path="emprendimientos/plan-de-trabajo" element={<AdminPlanTrabajo />} />
            <Route path="emprendimientos/crear" element={<AdminCrearEmprendimiento />} />
            <Route path="emprendimientos/ver/:id" element={<AdminVerEmprendimiento />} />
            <Route path="eventos" element={<AdminEventos />} />
            <Route path="diagnosticos" element={<AdminDiagnostico />} />
          </Route>

          <Route path="*" element={<div>404 - Pgina no encontrada</div>} />
        </Routes>
      </Router>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
