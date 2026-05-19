import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

function Register() {
  const { updateUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ correo: "", clave: "" });
  const [loginMsg, setLoginMsg] = useState("");

  const [registerData, setRegisterData] = useState({
    nombre: "", correo: "", clave: "", confirmarClave: "",
  });
  const [registerMsg, setRegisterMsg] = useState("");
  const [registerMsgType, setRegisterMsgType] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [correctCode, setCorrectCode] = useState("");
  const [tempUserEmail, setTempUserEmail] = useState("");
  const [verificationMsg, setVerificationMsg] = useState("");

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginMsg("");

    if (!loginData.correo || !loginData.clave) {
      setLoginMsg("Por favor completa todos los campos");
      return;
    }

    const DEMO_ACCOUNTS = {
      "admin@demo.com": { password: "admin123", rol: 1, nombre: "Admin Demo" },
      "student@demo.com": { password: "student123", rol: 2, nombre: "Student Demo" },
      "teacher@demo.com": { password: "teacher123", rol: 3, nombre: "Teacher Demo" },
    };

    const tryDemo = (email, pass) => {
      const account = DEMO_ACCOUNTS[email];
      if (account && account.password === pass) return account;
      return null;
    };

    const demo = tryDemo(loginData.correo.trim(), loginData.clave);
    if (demo) {
      const rolesMap = { 1: "administrador", 2: "emprendedor", 3: "asesor" };
      const rol = rolesMap[demo.rol] || "desconocido";
      localStorage.setItem("token", `demo-token-${demo.rol}`);
      updateUser({ idUsuarios: 0, Nombre: demo.nombre, Roles_idRoles1: demo.rol, CorreoInstitucional: loginData.correo });
      if (rol === "administrador") navigate("/admin");
      else if (rol === "asesor") navigate("/asesor");
      else if (rol === "emprendedor") navigate("/emprendedor");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/segmed/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          CorreoInstitucional: loginData.correo,
          Password: loginData.clave,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("token", data.data.token);
        const user = data.data.user;
        updateUser(user);
        if (user && (typeof user.Rol === "number" || typeof user.Roles_idRoles1 === "number")) {
          const rolesMap = { 1: "administrador", 2: "emprendedor", 3: "asesor" };
          const userRol = user.Rol || user.Roles_idRoles1;
          const rol = rolesMap[userRol] || "desconocido";
          if (rol === "administrador") navigate("/admin");
          else if (rol === "asesor") navigate("/asesor");
          else if (rol === "emprendedor") navigate("/emprendedor");
          else setLoginMsg("Rol desconocido.");
        } else {
          setLoginMsg("No se recibió un rol válido del servidor.");
        }
      } else {
        const serverMsg = data?.message || data?.msg || data?.error;
        setLoginMsg(serverMsg || "Credenciales inválidas.");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setLoginMsg(`Error al conectar: ${error.message}`);
    }
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterMsg("");
    setRegisterMsgType("");
    setRegisterLoading(true);

    if (!registerData.nombre || !registerData.correo || !registerData.clave || !registerData.confirmarClave) {
      setRegisterMsg("Por favor completa todos los campos");
      setRegisterMsgType("error");
      setRegisterLoading(false);
      return;
    }

    if (registerData.clave !== registerData.confirmarClave) {
      setRegisterMsg("Las contraseñas no coinciden");
      setRegisterMsgType("error");
      setRegisterLoading(false);
      return;
    }

    if (registerData.clave.length < 6) {
      setRegisterMsg("La contraseña debe tener al menos 6 caracteres");
      setRegisterMsgType("error");
      setRegisterLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/segmed/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Nombre: registerData.nombre,
          CorreoInstitucional: registerData.correo,
          Password: registerData.clave,
          Roles_idRoles1: 2,
          FechaCreacion: new Date(),
          FechaActualizacion: new Date(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const codigo = data.data?.verificationCode;
        if (!codigo) {
          setRegisterMsg("Error: No se recibió el código. Intenta nuevamente.");
          setRegisterMsgType("error");
          setRegisterLoading(false);
          return;
        }
        setRegisterMsg("");
        setRegisterMsgType("");
        setTempUserEmail(registerData.correo);
        setCorrectCode(codigo);
        setVerificationStep(true);
        setRegisterLoading(false);
      } else {
        const serverMsg = data?.message || data?.msg || data?.error;
        setRegisterMsg(serverMsg || "Error al crear la cuenta");
        setRegisterMsgType("error");
        setRegisterLoading(false);
      }
    } catch (error) {
      console.error("Error en registro:", error);
      setRegisterMsg(`Error de conexión: ${error.message}`);
      setRegisterMsgType("error");
      setRegisterLoading(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setVerificationMsg("");
    setVerifyLoading(true);

    if (!verificationCode) {
      setVerificationMsg("Por favor ingresa el código");
      setVerifyLoading(false);
      return;
    }

    if (!correctCode) {
      setVerificationMsg("Error: No se recibió el código del servidor. Intenta registrarte nuevamente.");
      setVerifyLoading(false);
      return;
    }

    const codIngresado = String(verificationCode).trim();
    const codCorrecto = String(correctCode).trim();

    if (codIngresado !== codCorrecto) {
      setVerificationMsg("Código incorrecto. Inténtalo de nuevo.");
      setVerifyLoading(false);
      return;
    }

    setVerificationMsg("Verificando código...");

    try {
      const response = await fetch(`${API_URL}/segmed/users/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ CorreoInstitucional: tempUserEmail }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setVerificationMsg("Verificación exitosa! Ahora puedes iniciar sesión.");
        setTimeout(() => {
          setVerificationStep(false);
          setVerificationCode("");
          setCorrectCode("");
          setTempUserEmail("");
          setRegisterData({ nombre: "", correo: "", clave: "", confirmarClave: "" });
          setRegisterMsg("");
          setRegisterMsgType("");
          setActiveTab("login");
          setVerifyLoading(false);
        }, 2000);
      } else {
        const serverMsg = data?.message || data?.msg || data?.error;
        setVerificationMsg(`Error: ${serverMsg || "Error al verificar"}`);
        setVerifyLoading(false);
      }
    } catch (error) {
      console.error("Error de conexión en verificación:", error);
      setVerificationMsg(`Error de conexión: ${error.message}`);
      setVerifyLoading(false);
    }
  };

  return (
    <div className="login-container">
      {!verificationStep && (
        <div className="form-tabs">
          <button
            className={`tab-button ${activeTab === "login" ? "active" : ""}`}
            onClick={() => { setActiveTab("login"); setRegisterMsg(""); setRegisterMsgType(""); }}
          >
            Iniciar Sesión
          </button>
          <button
            className={`tab-button ${activeTab === "register" ? "active" : ""}`}
            onClick={() => { setActiveTab("register"); setLoginMsg(""); setRegisterMsg(""); setRegisterMsgType(""); }}
          >
            Registrarse
          </button>
        </div>
      )}

      {activeTab === "login" && !verificationStep && (
        <div className="form-content">
          <h2>Inicio de Sesión</h2>
          <form onSubmit={handleLoginSubmit}>
            <input type="email" name="correo" placeholder="Correo Institucional" value={loginData.correo} onChange={handleLoginChange} required />
            <input type="password" name="clave" placeholder="Contraseña" value={loginData.clave} onChange={handleLoginChange} required />
            <button type="submit">Ingresar</button>
          </form>
          {loginMsg && <p className="error-message">{loginMsg}</p>}
        </div>
      )}

      {activeTab === "register" && !verificationStep && (
        <div className="form-content">
          <h2>Crear Cuenta</h2>
          <form onSubmit={handleRegisterSubmit}>
            <input type="text" name="nombre" placeholder="Nombre Completo" value={registerData.nombre} onChange={handleRegisterChange} required />
            <input type="email" name="correo" placeholder="Correo Institucional" value={registerData.correo} onChange={handleRegisterChange} required />
            <input type="password" name="clave" placeholder="Contraseña" value={registerData.clave} onChange={handleRegisterChange} required />
            <input type="password" name="confirmarClave" placeholder="Confirmar Contraseña" value={registerData.confirmarClave} onChange={handleRegisterChange} required />
            <button type="submit" disabled={registerLoading}>
              {registerLoading ? "Enviando..." : "Crear Cuenta"}
            </button>
          </form>
          {registerMsg && (
            <p className={registerMsgType === "error" ? "error-message" : "success-message"}>
              {registerMsg}
            </p>
          )}
        </div>
      )}

      {verificationStep && (
        <div className="form-content">
          <h2>Verificar tu Correo</h2>
          <p className="verification-info">
            Se envió un código de verificación a:<br/>
            <strong>{tempUserEmail}</strong>
          </p>
          <form onSubmit={handleVerifySubmit} style={{ marginTop: "20px" }}>
            <input
              type="text"
              placeholder="Ingresa el código que recibiste por email"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength="6"
              required
              style={{ marginBottom: "15px", fontSize: "18px", textAlign: "center", letterSpacing: "2px", fontWeight: "bold" }}
            />
            <button type="submit" disabled={verifyLoading} style={{ width: "100%", padding: "12px", fontSize: "16px" }}>
              {verifyLoading ? "Verificando..." : "Verificar Código"}
            </button>
          </form>
          {verificationMsg && (
            <div style={{
              marginTop: "15px", padding: "12px", borderRadius: "5px",
              backgroundColor: verificationMsg.includes("exitosa") ? "#e8f5e9" : "#ffebee",
              border: `2px solid ${verificationMsg.includes("exitosa") ? "#4caf50" : "#d32f2f"}`,
              color: verificationMsg.includes("exitosa") ? "#388e3c" : "#d32f2f",
              fontWeight: "500", fontSize: "14px"
            }}>
              {verificationMsg}
            </div>
          )}
          <button
            className="back-button"
            onClick={() => {
              setVerificationStep(false);
              setVerificationCode("");
              setVerificationMsg("");
              setCorrectCode("");
              setTempUserEmail("");
              setRegisterMsg("");
              setRegisterMsgType("");
              setVerifyLoading(false);
            }}
            style={{ marginTop: "15px", width: "100%" }}
          >
            Volver a Registro
          </button>
        </div>
      )}
    </div>
  );
}

export default Register;


