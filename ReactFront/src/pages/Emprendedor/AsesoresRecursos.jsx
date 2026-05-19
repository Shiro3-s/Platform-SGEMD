import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const AsesoresRecursos = () => {
  const [asesores, setAsesores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetchAsesores();
  }, []);

  const fetchAsesores = async () => {
    try {
      const res = await fetch(`${API_URL}/segmed/users/asesores`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setAsesores(data.data || []);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const asesoresFiltrados = asesores.filter(asesor =>
    asesor.Nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    asesor.CorreoInstitucional?.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ color: '#0c4a6e', marginBottom: '5px' }}>👨‍🏫 Asesores</h1>
          <p style={{ color: '#666', margin: 0 }}>Listado de asesores disponibles como recurso de apoyo</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nombre o correo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {asesoresFiltrados.length === 0 ? (
        <div className="card">
          <div className="card-body text-center" style={{ padding: '40px' }}>
            <p style={{ fontSize: '48px', marginBottom: '15px' }}>👨‍🏫</p>
            <p style={{ color: '#666' }}>No hay asesores disponibles</p>
          </div>
        </div>
      ) : (
        <div className="row">
          {asesoresFiltrados.map((asesor) => (
            <div key={asesor.idusuarios} className="col-md-4 mb-4">
              <div className="card h-100" style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <div className="card-body">
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: '#1a75bc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      marginRight: '15px'
                    }}>
                      {asesor.Nombre?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h5 style={{ margin: 0, color: '#0c4a6e' }}>{asesor.Nombre}</h5>
                      <span style={{ fontSize: '12px', color: '#666' }}>Asesor</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', color: '#555' }}>
                    <p style={{ marginBottom: '8px' }}>
                      <strong>📧 Correo:</strong><br />
                      <span style={{ color: '#1a75bc' }}>{asesor.CorreoInstitucional || 'No disponible'}</span>
                    </p>
                    {asesor.Celular && (
                      <p style={{ marginBottom: '8px' }}>
                        <strong>📱 Celular:</strong> {asesor.Celular}
                      </p>
                    )}
                    {asesor.ProgramaAcademico_idProgramaAcademico1 && (
                      <p style={{ marginBottom: '0' }}>
                        <strong>🎓 Programa:</strong> #{asesor.ProgramaAcademico_idProgramaAcademico1}
                      </p>
                    )}
                  </div>
                </div>
                <div className="card-footer" style={{ backgroundColor: '#f8f9fa', borderTop: '1px solid #eee' }}>
                  <Link
                    to={`/emprendedor/recursos/asesorias?asesor=${asesor.idusuarios}`}
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      padding: '8px',
                      backgroundColor: '#1a75bc',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '5px',
                      fontWeight: '500'
                    }}
                  >
                    Solicitar Asesoría
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AsesoresRecursos;
