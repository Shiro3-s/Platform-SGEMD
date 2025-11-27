// src/api.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

// apiFetch with timeout and improved error handling
export const apiFetch = async (url, options = {}, timeoutMs = 8000) => {
  const token = localStorage.getItem("token");

  // Asegurar que la URL sea completa
  const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  console.log(`📡 Fetching ${fullUrl} (timeout ${timeoutMs}ms)`);

  try {
    const response = await fetch(fullUrl, { ...options, headers, credentials: 'include', signal: controller.signal });

    if (response.status === 401 || response.status === 403) {
      console.warn(`⚠️ Error ${response.status}: Token inválido o expirado. URL: ${url}`);
      throw new Error(`Error ${response.status}: No autorizado.`);
    }

    // Intentar parsear JSON, si falla devolver error legible
    const text = await response.text();
    try {
      const data = text ? JSON.parse(text) : {};
      return data;
    } catch (err) {
      // Respuesta no JSON
      return text;
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      console.warn(`⏱️ Request timeout after ${timeoutMs}ms: ${fullUrl}`);
      throw new Error('Request timeout');
    }
    console.warn('📛 Fetch error:', err.message);
    throw err;
  } finally {
    clearTimeout(id);
  }
};
