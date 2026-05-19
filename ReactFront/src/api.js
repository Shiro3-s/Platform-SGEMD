const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

let logoutHandler = null;

export const setLogoutHandler = (handler) => {
  logoutHandler = handler;
};

export const apiFetch = async (url, options = {}, timeoutMs = 8000) => {
  const token = localStorage.getItem("token");
  const hadToken = Boolean(token);

  const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(fullUrl, { ...options, headers, credentials: 'include', signal: controller.signal });

    if (response.status === 401 || response.status === 403) {
      if (logoutHandler && hadToken) {
        logoutHandler();
      }
      throw new Error(`Error ${response.status}: No autorizado.`);
    }

    const text = await response.text();
    try {
      const data = text ? JSON.parse(text) : {};
      return data;
    } catch (err) {
      return text;
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw err;
  } finally {
    clearTimeout(id);
  }
};
