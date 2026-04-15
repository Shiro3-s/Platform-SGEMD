// src/routes/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

// PrivateRoute ahora espera recibir el estado `usuario` desde App y
// un arreglo `allowedRoles` con los roles permitidos (en minúsculas).
function PrivateRoute({ usuario, allowedRoles = [], children }) {
  // No autenticado
  if (!usuario) return <Navigate to="/" />;

  // Verificar rol
  if (!allowedRoles.includes(usuario.rol)) {
    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRoute;
