// src/api.js
export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, { ...options, headers });

  // Si el token expiró o no es válido
  if (response.status === 401 || response.status === 403) {
    console.warn("⚠️ Token inválido o expirado. Redirigiendo al login...");
    localStorage.removeItem("token");
    window.location.href = "/";
    return;
  }

  return response.json();
};
