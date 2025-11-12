// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import PrivateRoute from "./routes/PrivateRoute";
import Admin from "./pages/Admin";
import Maestro from "./pages/Maestro";
import Estudiante from "./pages/Estudiante";

function App() {
  // 🔹 Estado global para guardar la información del usuario
  const [usuario, setUsuario] = useState(null);

  return (
    <Router>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<Login setUsuario={setUsuario} />} /> {/* ✅ Aquí pasamos setUsuario */}

        {/* Rutas protegidas */}
        <Route
          path="/admin"
          element={
            <PrivateRoute usuario={usuario} allowedRoles={["administrador"]}>
              <Admin />
            </PrivateRoute>
          }
        />
        <Route
          path="/maestro"
          element={
            <PrivateRoute usuario={usuario} allowedRoles={["maestro"]}>
              <Maestro />
            </PrivateRoute>
          }
        />
        <Route
          path="/estudiante"
          element={
            <PrivateRoute usuario={usuario} allowedRoles={["estudiante"]}>
              <Estudiante />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
