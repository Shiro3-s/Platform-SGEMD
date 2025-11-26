import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

const getAuthHeaders = (includeContentType = true) => {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

export default function AccountDeactivated({ user, onReactivate }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRequestReactivation = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(`${API_URL}/segmed/users/${user.idUsuarios}/request-reactivation`, {
        method: 'POST',
        headers: getAuthHeaders(true),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Solicitud de reactivación enviada. Un administrador revisará tu solicitud pronto.');
      } else {
        setError(data.error || 'Error al enviar la solicitud');
      }
    } catch (err) {
      setError('Error de conexión: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card border-danger">
            <div className="card-header bg-danger text-white">
              <h4 className="mb-0">⚠️ Cuenta Desactivada</h4>
            </div>
            <div className="card-body">
              <p className="card-text">
                Hola <strong>{user?.Nombre || 'Usuario'}</strong>,
              </p>
              <p className="card-text">
                Tu cuenta se encuentra desactivada en este momento. 
                No puedes acceder a la plataforma hasta que sea reactivada.
              </p>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {message && (
                <div className="alert alert-success" role="alert">
                  {message}
                </div>
              )}

              <div className="mt-4">
                <h6>¿Qué puedo hacer?</h6>
                <ul className="list-group list-group-flush mb-3">
                  <li className="list-group-item">
                    ✓ Solicitar reactivación de tu cuenta
                  </li>
                  <li className="list-group-item">
                    ✓ Un administrador revisará tu solicitud
                  </li>
                  <li className="list-group-item">
                    ✓ Recibirás notificación cuando tu cuenta sea reactivada
                  </li>
                </ul>
              </div>

              <div className="d-grid gap-2 mt-4">
                <button
                  className="btn btn-warning"
                  onClick={handleRequestReactivation}
                  disabled={loading}
                >
                  {loading ? 'Enviando solicitud...' : '📝 Solicitar Reactivación'}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/';
                  }}
                >
                  Cerrar Sesión
                </button>
              </div>

              <div className="alert alert-info mt-4 mb-0">
                <small>
                  <strong>Nota:</strong> Si tienes dudas sobre por qué tu cuenta fue desactivada, 
                  contacta al equipo de administración.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
