import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function PrivateRoute({ allowedRoles = [], children }) {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/" />;

  if (!allowedRoles.includes(user.rol)) {
    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRoute;
