import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const AdminAsesores = () => {
  const [Asesores, setAsesores] = useState([]);
  const [Emprendedores, setEmprendedores] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarAsignar, setMostrarAsignar] = useState(false);
  const [formAsignacion, setFormAsignacion] = useState({
    AsesorId: '',
    EmprendedorId: '',
    emprendimientoId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = getAuthHeaders();
      
      const [AsesoresRes, EmprendedoresRes, asignacionesRes] = await Promise.all([
        fetch(`${API_URL}/segmed/users/teachers`, { headers }),
        fetch(`${API_URL}/segmed/users?role=Emprendedor`, { headers }),
        fetch(`${API_URL}/segmed/assignments`, { headers })
      ]);

      const AsesoresData = await AsesoresRes.json();
      const EmprendedoresData = await EmprendedoresRes.json();
      const asignacionesData = await asignacionesRes.json();

      setAsesores(AsesoresData.data || []);
      setEmprendedores((EmprendedoresData.data || []).filter(u => u.Roles_idRoles1 === 2));
      setAsignaciones(asignacionesData.data || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAsignar = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/segmed/assignments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          Usuarios_idMentor: parseInt(formAsignacion.AsesorId),
          Usuarios_idEmprendedor: parseInt(formAsignacion.EmprendedorId),
          Emprendimiento_idEmprendimiento: formAsignacion.emprendimientoId ? parseInt(formAsignacion.emprendimientoId) : null
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Asignación creada exitosamente');
        fetchData();
        setMostrarAsignar(false);
        setFormAsignacion({ AsesorId: '', EmprendedorId: '', emprendimientoId: '' });
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      alert('Error al crear asignación');
    }
  };

  const handleDesasignar = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta asignación?')) return;
    try {
      const res = await fetch(`${API_URL}/segmed/assignments/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) {
        alert('Asignación eliminada');
        fetchData();
      }
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  if (loading) {
    return <div className="container mt-5 text-center"><div className="spinner-border text-primary" /></div>;
  }

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">👨‍🏫 Gestión de Asesores y Asignaciones</h4>
          <button className="btn btn-primary" onClick={() => setMostrarAsignar(true)}>
            + Nueva Asignación
          </button>
        </div>
        <div className="card-body">
          {/* Formulario de asignación */}
          {mostrarAsignar && (
            <div className="card mb-4 border-primary">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Crear Nueva Asignación</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleAsignar}>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Asesor (Mentor)</label>
                      <select 
                        className="form-select"
                        value={formAsignacion.AsesorId}
                        onChange={(e) => setFormAsignacion({...formAsignacion, AsesorId: e.target.value})}
                        required
                      >
                        <option value="">Seleccionar Asesor...</option>
                        {Asesores.map(d => (
                          <option key={d.idUsuarios} value={d.idUsuarios}>{d.Nombre}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Emprendedor</label>
                      <select 
                        className="form-select"
                        value={formAsignacion.EmprendedorId}
                        onChange={(e) => setFormAsignacion({...formAsignacion, EmprendedorId: e.target.value})}
                        required
                      >
                        <option value="">Seleccionar Emprendedor...</option>
                        {Emprendedores.map(e => (
                          <option key={e.idUsuarios} value={e.idUsuarios}>{e.Nombre}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Emprendimiento (Opcional)</label>
                      <select 
                        className="form-select"
                        value={formAsignacion.emprendimientoId}
                        onChange={(e) => setFormAsignacion({...formAsignacion, emprendimientoId: e.target.value})}
                      >
                        <option value="">Sin emprendimiento</option>
                      </select>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">Guardar Asignación</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setMostrarAsignar(false)}>Cancelar</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Lista de Asesores */}
          <h5 className="mb-3">Asesores Registrados</h5>
          <div className="table-responsive mb-4">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Nombre</th>
                  <th>Correo Institucional</th>
                  <th>Tipo de Usuario</th>
                </tr>
              </thead>
              <tbody>
                {Asesores.length === 0 ? (
                  <tr><td colSpan="3" className="text-center text-muted">No hay Asesores registrados</td></tr>
                ) : (
                  Asesores.map(d => (
                    <tr key={d.idUsuarios}>
                      <td>{d.Nombre}</td>
                      <td>{d.CorreoInstitucional}</td>
                      <td>{d.TipodeUsuario || 'Asesor'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Lista de asignaciones */}
          <h5 className="mb-3">Asignaciones Activas</h5>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Asesor</th>
                  <th>Emprendedor</th>
                  <th>Emprendimiento</th>
                  <th>Fecha Asignación</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {asignaciones.length === 0 ? (
                  <tr><td colSpan="6" className="text-center text-muted">No hay asignaciones</td></tr>
                ) : (
                  asignaciones.map(a => (
                    <tr key={a.idAsignacion}>
                      <td>{a.MentorNombre || 'Sin asignar'}</td>
                      <td>{a.EmprendedorNombre || 'Sin asignar'}</td>
                      <td>{a.EmprendimientoNombre || 'Sin emprendimiento'}</td>
                      <td>{a.FechaAsignacion}</td>
                      <td>
                        <span className={`badge ${a.Estado === 'activa' ? 'bg-success' : 'bg-secondary'}`}>
                          {a.Estado}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDesasignar(a.idAsignacion)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAsesores;

