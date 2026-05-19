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
import AdminAsesores from "./pages/Admin/AdminAsesores.jsx";
import AdminCrearEmprendimiento from "./pages/Admin/AdminCrearEmprendimiento.jsx";
import AdminVerEmprendimiento from "./pages/Admin/AdminVerEmprendimiento.jsx";
import AdminDiagnostico from "./pages/Admin/AdminDiagnostico.jsx";

import Asesor from "./pages/Asesor/Asesor.jsx";
import AsesorDashboard from "./pages/Asesor/AsesorDashboard.jsx";
import AsesorPerfil from "./pages/Asesor/Perfil.jsx";
import AsesorAsesorias from "./pages/Asesor/Asesorias.jsx";
import AsesorAsesoriasCrear from "./pages/Asesor/AsesoriasCrear.jsx";
import AsesorAsesoriasEditar from "./pages/Asesor/AsesoriasEditar.jsx";
import AsesorEmprendimientos from "./pages/Asesor/Emprendimientos.jsx";
import AsesorEmpSeguimiento from "./pages/Asesor/EmpSeguimiento.jsx";
import AsesorTareas from "./pages/Asesor/AsesorTareas.jsx";
import AsesorDiagnostico from "./pages/Asesor/AsesorDiagnostico.jsx";
import AsesorEventos from "./pages/Asesor/AsesorEventos.jsx";

import EmprendedorLayout from "./pages/Emprendedor/EmprendedorLayout.jsx";
import EmprendedorDashboard from "./pages/Emprendedor/DashboardContent.jsx";
import EmprendedorPerfil from "./pages/Emprendedor/Perfil.jsx";
import EmprendedorProgreso from "./pages/Emprendedor/Progreso.jsx";
import EmprendedorPerfilEmp from "./pages/Emprendedor/PerfilEmprendimiento.jsx";
import EmprendedorPlan from "./pages/Emprendedor/PlanTrabajo.jsx";
import EmprendedorSeguimiento from "./pages/Emprendedor/Seguimiento.jsx";
import EmprendedorComparativa from "./pages/Emprendedor/Comparativa.jsx";
import AsesoresRecursos from "./pages/Emprendedor/AsesoresRecursos.jsx";
import AsesoriasRecursos from "./pages/Emprendedor/AsesoriasRecursos.jsx";
import EventosEmprendedor from "./pages/Emprendedor/EventosEmprendedor.jsx";
import DiagnosticoEmprendedor from "./pages/Emprendedor/Diagnostico.jsx";

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
            path="/emprendedor"
            element={
              <PrivateRoute allowedRoles={["emprendedor"]}>
                <EmprendedorLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<EmprendedorDashboard />} />
            <Route path="perfil" element={<EmprendedorPerfil />} />
            <Route path="progreso" element={<EmprendedorProgreso />} />
            <Route path="emprendimiento/perfil" element={<EmprendedorPerfilEmp />} />
            <Route path="plan" element={<EmprendedorPlan />} />
            <Route path="seguimiento" element={<EmprendedorSeguimiento />} />
            <Route path="comparativa" element={<EmprendedorComparativa />} />
            <Route path="recursos/asesores" element={<AsesoresRecursos />} />
            <Route path="recursos/asesorias" element={<AsesoriasRecursos />} />
            <Route path="eventos" element={<EventosEmprendedor />} />
            <Route path="diagnostico" element={<DiagnosticoEmprendedor />} />
          </Route>

          <Route
            path="/asesor"
            element={
              <PrivateRoute allowedRoles={["asesor"]}>
                <Asesor />
              </PrivateRoute>
            }
          >
            <Route index element={<AsesorDashboard />} />
            <Route path="perfil" element={<AsesorPerfil />} />
            <Route path="asesorias" element={<AsesorAsesorias />} />
            <Route path="asesorias/crear" element={<AsesorAsesoriasCrear />} />
            <Route path="asesorias/editar" element={<AsesorAsesoriasEditar />} />
            <Route path="emprendimientos/perfil" element={<AsesorEmprendimientos />} />
            <Route path="emprendimientos/seguimiento" element={<AsesorEmpSeguimiento />} />
            <Route path="tareas" element={<AsesorTareas />} />
            <Route path="diagnosticos" element={<AsesorDiagnostico />} />
            <Route path="eventos" element={<AsesorEventos />} />
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
            <Route path="asesores/asignar" element={<AdminAsignar />} />
            <Route path="asesores/gestion" element={<AdminAsesores />} />
            <Route path="gestionar/asesores" element={<GestionarUsuarios role="asesor" />} />
            <Route path="gestionar/emprendedores" element={<GestionarUsuarios role="emprendedor" />} />
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








