// src/components/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3005";

function Register() {
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  // LOGIN STATE
  const [loginData, setLoginData] = useState({
    correo: "",
    clave: "",
  });
  const [loginMsg, setLoginMsg] = useState("");

  // REGISTER STATE
  const [registerData, setRegisterData] = useState({
    nombre: "",
    correo: "",
    clave: "",
    confirmarClave: "",
  });
  const [registerMsg, setRegisterMsg] = useState("");
  const [registerMsgType, setRegisterMsgType] = useState("");

  // VERIFICATION STATE
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [correctCode, setCorrectCode] = useState("");
  const [tempUserEmail, setTempUserEmail] = useState("");
  const [verificationMsg, setVerificationMsg] = useState("");

  // LOGIN FUNCTIONS
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
        
        if (user && typeof user.Rol === "number") {
          const rolesMap = { 1: "administrador", 2: "estudiante", 3: "maestro" };
          const rol = rolesMap[user.Rol] || "desconocido";

          if (rol === "administrador") navigate("/admin");
          else if (rol === "maestro") navigate("/maestro");
          else if (rol === "estudiante") navigate("/estudiante");
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

  // REGISTER FUNCTIONS
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterMsg("");

    if (
      !registerData.nombre ||
      !registerData.correo ||
      !registerData.clave ||
      !registerData.confirmarClave
    ) {
      setRegisterMsg("Por favor completa todos los campos");
      setRegisterMsgType("error");
      return;
    }

    if (registerData.clave !== registerData.confirmarClave) {
      setRegisterMsg("Las contraseñas no coinciden");
      setRegisterMsgType("error");
      return;
    }

    if (registerData.clave.length < 6) {
      setRegisterMsg("La contraseña debe tener al menos 6 caracteres");
      setRegisterMsgType("error");
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
        console.log('✅ Respuesta del backend:', JSON.stringify(data, null, 2));
        console.log('Estructura:', {
          'data.verificationCode': data.verificationCode,
          'data.data.verificationCode': data.data?.verificationCode
        });
        
        setRegisterMsg("Código enviado a tu correo. Ingresalo para activar tu cuenta.");
        setRegisterMsgType("success");
        setTempUserEmail(registerData.correo);
        
        // EL CÓDIGO ESTÁ EN data.data.verificationCode (dentro del objeto "data")
        const codigo = data.data?.verificationCode;
        
        if (!codigo) {
          console.error('❌ ERROR: No se encontró el código de verificación en la respuesta');
          console.error('Respuesta completa:', JSON.stringify(data));
          setRegisterMsg("Error: No se recibió el código. Intenta nuevamente.");
          setRegisterMsgType("error");
          return;
        }
        
        console.log('✅ Código capturado:', codigo);
        console.log('   Tipo:', typeof codigo);
        console.log('   Longitud:', String(codigo).length);
        
        setCorrectCode(codigo); // Guardar código del backend
        setVerificationStep(true);
      } else {
        const serverMsg = data?.message || data?.msg || data?.error;
        setRegisterMsg(serverMsg || "Error al crear la cuenta");
        setRegisterMsgType("error");
      }
    } catch (error) {
      console.error("Error en registro:", error);
      setRegisterMsg(`Error de conexión: ${error.message}`);
      setRegisterMsgType("error");
    }
  };

  // VERIFICATION FUNCTIONS
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setVerificationMsg("");

    console.log("🔍 handleVerifySubmit fue llamado");
    console.log("verificationCode:", verificationCode);
    console.log("correctCode:", correctCode);
    console.log("tempUserEmail:", tempUserEmail);

    if (!verificationCode) {
      setVerificationMsg("Por favor ingresa el código");
      return;
    }

    if (!correctCode) {
      setVerificationMsg("Error: No se recibió el código del servidor. Intenta registrarte nuevamente.");
      console.error("ERROR: correctCode no está definido");
      return;
    }

    // Validar código localmente - comparar como strings y sin espacios
    const codIngresado = String(verificationCode).trim();
    const codCorrecto = String(correctCode).trim();
    
    console.log("Comparando:");
    console.log("  Ingresado (trim):", codIngresado);
    console.log("  Correcto (trim):", codCorrecto);
    console.log("  ¿Coinciden?:", codIngresado === codCorrecto);
    
    if (codIngresado !== codCorrecto) {
      console.log('❌ Códigos no coinciden');
      setVerificationMsg(`❌ Código incorrecto. Ingresaste: "${codIngresado}", Se esperaba: "${codCorrecto}"`);
      return;
    }

    console.log('✅ Códigos coinciden, enviando verificación al servidor...');
    setVerificationMsg("Verificando código...");

    // Código correcto - activar usuario en backend
    try {
      console.log("📡 Enviando POST a /segmed/users/verify");
      console.log("   Datos:", { CorreoInstitucional: tempUserEmail });
      
      const response = await fetch(`${API_URL}/segmed/users/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          CorreoInstitucional: tempUserEmail,
        }),
      });

      console.log("📥 Respuesta recibida del servidor");
      console.log("   Status:", response.status);
      console.log("   OK:", response.ok);

      const data = await response.json();
      console.log("   Data:", JSON.stringify(data));

      if (response.ok && data.success) {
        console.log('✅ ¡VERIFICACIÓN EXITOSA!');
        setVerificationMsg("✅ ¡Verificación exitosa! Ahora puedes iniciar sesión.");
        setTimeout(() => {
          console.log("Limpiando estados y redirigiendo...");
          setVerificationStep(false);
          setVerificationCode("");
          setCorrectCode("");
          setTempUserEmail("");
          setRegisterData({
            nombre: "",
            correo: "",
            clave: "",
            confirmarClave: "",
          });
          setActiveTab("login");
        }, 2000);
      } else {
        const serverMsg = data?.message || data?.msg || data?.error;
        console.log('❌ Error del servidor:', serverMsg);
        setVerificationMsg(`❌ Error: ${serverMsg || "Error al verificar"}`);
      }
    } catch (error) {
      console.error("❌ Error de conexión en verificación:", error);
      setVerificationMsg(`❌ Error de conexión: ${error.message}`);
    }
  };

  return (
    <div className="login-container">
      {/* TABS PARA CAMBIAR ENTRE LOGIN Y REGISTER */}
      {!verificationStep && (
        <div className="form-tabs">
          <button
            className={`tab-button ${activeTab === "login" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("login");
              setRegisterMsg("");
            }}
          >
            Iniciar Sesión
          </button>
          <button
            className={`tab-button ${activeTab === "register" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("register");
              setLoginMsg("");
            }}
          >
            Registrarse
          </button>
        </div>
      )}

      {/* FORMULARIO LOGIN */}
      {activeTab === "login" && !verificationStep && (
        <div className="form-content">
          <h2>Inicio de Sesión</h2>
          <form onSubmit={handleLoginSubmit}>
            <input
              type="email"
              name="correo"
              placeholder="Correo Institucional"
              value={loginData.correo}
              onChange={handleLoginChange}
              required
            />
            <input
              type="password"
              name="clave"
              placeholder="Contraseña"
              value={loginData.clave}
              onChange={handleLoginChange}
              required
            />
            <button type="submit">Ingresar</button>
          </form>
          {loginMsg && <p className="error-message">{loginMsg}</p>}
        </div>
      )}

      {/* FORMULARIO REGISTER */}
      {activeTab === "register" && !verificationStep && (
        <div className="form-content">
          <h2>Crear Cuenta</h2>
          <form onSubmit={handleRegisterSubmit}>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre Completo"
              value={registerData.nombre}
              onChange={handleRegisterChange}
              required
            />
            <input
              type="email"
              name="correo"
              placeholder="Correo Institucional"
              value={registerData.correo}
              onChange={handleRegisterChange}
              required
            />
            <input
              type="password"
              name="clave"
              placeholder="Contraseña"
              value={registerData.clave}
              onChange={handleRegisterChange}
              required
            />
            <input
              type="password"
              name="confirmarClave"
              placeholder="Confirmar Contraseña"
              value={registerData.confirmarClave}
              onChange={handleRegisterChange}
              required
            />
            <button type="submit">Crear Cuenta</button>
          </form>
          {registerMsg && (
            <p className={registerMsgType === "error" ? "error-message" : "success-message"}>
              {registerMsg}
            </p>
          )}
        </div>
      )}

      {/* FORMULARIO VERIFICACIÓN */}
      {verificationStep && (
        <div className="form-content">
          <h2>Verificar tu Correo</h2>
          <p className="verification-info">
            Se envió un código de verificación a:<br/>
            <strong>{tempUserEmail}</strong>
          </p>
          
          {/* FORMULARIO */}
          <form onSubmit={handleVerifySubmit} style={{ marginTop: "20px" }}>
            <input
              type="text"
              placeholder="Ingresa el código que recibiste por email"
              value={verificationCode}
              onChange={(e) => {
                const newVal = e.target.value;
                console.log('👤 Usuario escribió:', newVal);
                setVerificationCode(newVal);
              }}
              maxLength="6"
              required
              style={{
                marginBottom: "15px",
                fontSize: "18px",
                textAlign: "center",
                letterSpacing: "2px",
                fontWeight: "bold"
              }}
            />
            <button 
              type="submit"
              style={{ width: "100%", padding: "12px", fontSize: "16px" }}
            >
              ✓ Verificar Código
            </button>
          </form>
          
          {/* MOSTRAR MENSAJES */}
          {verificationMsg && (
            <div style={{
              marginTop: "15px",
              padding: "12px",
              borderRadius: "5px",
              backgroundColor: verificationMsg.includes("✅") ? "#e8f5e9" : "#ffebee",
              border: `2px solid ${verificationMsg.includes("✅") ? "#4caf50" : "#d32f2f"}`,
              color: verificationMsg.includes("✅") ? "#388e3c" : "#d32f2f",
              fontWeight: "500",
              fontSize: "14px"
            }}>
              {verificationMsg}
            </div>
          )}
          
          {/* BOTÓN VOLVER */}
          <button
            className="back-button"
            onClick={() => {
              console.log("Usuario hizo clic en 'Volver'");
              setVerificationStep(false);
              setVerificationCode("");
              setVerificationMsg("");
              setCorrectCode("");
              setTempUserEmail("");
            }}
            style={{ marginTop: "15px", width: "100%" }}
          >
            ← Volver a Registro
          </button>
        </div>
      )}
    </div>
  );
}

export default Register;
