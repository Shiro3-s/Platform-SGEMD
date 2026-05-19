import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

function Login() {
  const { updateUser } = useContext(AuthContext);
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setMensaje("");

    const DEMO_ACCOUNTS = {
      "admin@demo.com": { password: "admin123", rol: 1, nombre: "Admin Demo" },
      "student@demo.com": { password: "student123", rol: 2, nombre: "Student Demo" },
      "teacher@demo.com": { password: "teacher123", rol: 3, nombre: "Asesor Demo" },
    };

    const tryDemo = (email, pass) => {
      const account = DEMO_ACCOUNTS[email];
      if (account && account.password === pass) return account;
      return null;
    };

    const demo = tryDemo(correo.trim(), clave);
    if (demo) {
      const rolesMap = { 1: "administrador", 2: "emprendedor", 3: "asesor" };
      const rol = rolesMap[demo.rol] || "desconocido";
      localStorage.setItem("token", `demo-token-${demo.rol}`);
      updateUser({ idUsuarios: 0, Nombre: demo.nombre, Roles_idRoles1: demo.rol, CorreoInstitucional: correo.trim() });
      if (rol === "administrador") navigate("/admin");
      else if (rol === "asesor") navigate("/asesor");
      else if (rol === "emprendedor") navigate("/emprendedor");
      setIsSubmitting(false);
      return;
    }

    try {
      const loginUrl = `${API_URL}/segmed/users/login`;
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ CorreoInstitucional: correo, Password: clave }),
        mode: "cors"
      });

      let data = {};
      try {
        data = await response.json();
      } catch (err) {
        data = {};
      }

      if (response.ok && data.success) {
        const user = data.data.user;
        localStorage.setItem("token", data.data.token);
        updateUser(user);
        if (user && (typeof user.Rol === "number" || typeof user.Roles_idRoles1 === "number")) {
          const rolesMap = { 1: "administrador", 2: "emprendedor", 3: "asesor" };
          const userRol = user.Rol || user.Roles_idRoles1;
          const rol = rolesMap[userRol] || "desconocido";
          if (rol === "administrador") navigate("/admin");
          else if (rol === "asesor") navigate("/asesor");
          else if (rol === "emprendedor") navigate("/emprendedor");
          else setMensaje("Rol desconocido.");
        } else {
          setMensaje("No se recibió un rol válido del servidor.");
        }
      } else {
        const serverMsg = data?.message || data?.msg || data?.error;
        if (response.status === 401 || response.status === 403) {
          setMensaje(serverMsg || "Credenciales inválidas.");
        } else {
          setMensaje(serverMsg || "Credenciales inválidas.");
        }
      }
    } catch (error) {
      console.error("Error completo:", error);
      let msg = error.message;
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        msg = 'No se puede conectar al servidor. Verifica que el backend est corriendo.';
      }
      setMensaje(`Error al conectar con el servidor: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Inicio de Sesión</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Correo Institucional" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={clave} onChange={(e) => setClave(e.target.value)} required />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Validando..." : "Ingresar"}
        </button>
      </form>
      {mensaje && <p className="error-message">{mensaje}</p>}
    </div>
  );
}

export default Login;

