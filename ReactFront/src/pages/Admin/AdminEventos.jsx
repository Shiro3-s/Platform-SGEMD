import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const AdminEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [tiposEvento, setTiposEvento] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editEvento, setEditEvento] = useState(null);
  const [form, setForm] = useState({
    Nombre: '',
    Descripcion: '',
    Tipo: '',
    Estado: 'activo',
    Capacidad: 50,
    Requiere_registro: 1
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = getAuthHeaders();
      const [eventosRes, tiposRes] = await Promise.all([
        fetch(`${API_URL}/segmed/event`, { headers }),
        fetch(`${API_URL}/segmed/type-event`, { headers })
      ]);
      const eventosData = await eventosRes.json();
      const tiposData = await tiposRes.json();
      
      if (eventosData.success) {
        setEventos(eventosData.data || []);
      }
      setTiposEvento(tiposData.data || []);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  };

  const getTipoNombre = (tipo) => {
    if (!tipo) return 'Sin tipo';
    if (tipo.Academico === '1' || tipo.Academico === 1) return 'Académico';
    if (tipo.Cultura === '1' || tipo.Cultura === 1) return 'Cultura';
    if (tipo.Deportivo === '1' || tipo.Deportivo === 1) return 'Deportivo';
    if (tipo.Social === '1' || tipo.Social === 1) return 'Social';
    if (tipo.Conferencia === '1' || tipo.Conferencia === 1) return 'Conferencia';
    return 'Sin tipo';
  };

  const getTipoIdFromEvento = (evento) => {
    return evento?.Tipo_evento_idTipo_evento || '';
  };

  const getTipoNombreFromId = (tipoId) => {
    const tipo = tiposEvento.find(t => t.idTipo_evento === tipoId || t.idTipoEvento === tipoId);
    return getTipoNombre(tipo);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editEvento) {
        res = await fetch(`${API_URL}/segmed/event/${editEvento.idEventos}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(form),
          credentials: 'include'
        });
      } else {
        res = await fetch(`${API_URL}/segmed/event`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(form),
          credentials: 'include'
        });
      }
      const data = await res.json();
      
      if (data.success) {
        alert(editEvento ? 'Evento actualizado' : 'Evento creado');
        setShowModal(false);
        setEditEvento(null);
        setForm({ Nombre: '', Descripcion: '', Tipo: '', Estado: 'activo', Capacidad: 50, Requiere_registro: 1 });
        fetchData();
      } else {
        alert(data.error || 'Error');
      }
    } catch (err) {
      alert('Error al guardar');
    }
  };

  const handleEdit = (evento) => {
    setEditEvento(evento);
    setForm({
      Nombre: evento.Nombre_evento || '',
      Descripcion: evento.Descripcion_evento || '',
      Tipo: evento.Tipo_evento_idTipo_evento || '',
      Estado: evento.Estado || 'activo',
      Capacidad: evento.Capacidad_maxima || 50,
      Requiere_registro: evento.Requiere_registro || 1
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este evento?')) return;
    try {
      const res = await fetch(`${API_URL}/segmed/event/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  const openCreateModal = () => {
    setEditEvento(null);
    setForm({ Nombre: '', Descripcion: '', Tipo: '', Estado: 'activo', Capacidad: 50, Requiere_registro: 1 });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0 text-primary">Gestión de Eventos</h4>
          <button className="btn btn-primary" onClick={openCreateModal}>
            + Crear Evento
          </button>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          
          {eventos.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No hay eventos registrados</p>
              <button className="btn btn-primary" onClick={openCreateModal}>
                Crear Primer Evento
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Capacidad</th>
                    <th>Requiere Registro</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {eventos.map((evento, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: '500', color: '#0c4a6e' }}>{evento.Nombre_evento}</td>
                      <td>{getTipoNombreFromId(evento.Tipo_evento_idTipo_evento)}</td>
                      <td>{evento.Capacidad_maxima || 'N/A'}</td>
                      <td>{evento.Requiere_registro === 1 ? 'Sí' : 'No'}</td>
                      <td>
                        <span className={`badge ${evento.Estado === 'activo' ? 'bg-success' : evento.Estado === 'proximo' ? 'bg-info' : 'bg-secondary'}`}>
                          {evento.Estado || 'Activo'}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(evento)}>
                          Editar
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(evento.idEventos)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <>
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editEvento ? 'Editar Evento' : 'Crear Evento'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Nombre del Evento</label>
                      <input type="text" className="form-control" name="Nombre" value={form.Nombre} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Descripción</label>
                      <textarea className="form-control" name="Descripcion" rows="3" value={form.Descripcion} onChange={handleChange} />
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Tipo de Evento</label>
                        <select className="form-select" name="Tipo" value={form.Tipo} onChange={handleChange}>
                          <option value="">Seleccionar...</option>
                          {Array.from(
                            new Map(
                              tiposEvento
                                .filter(tipo => getTipoNombre(tipo) !== 'Sin tipo')
                                .map(tipo => [getTipoNombre(tipo), tipo])
                            ).values()
                          ).map(tipo => (
                            <option key={tipo.idTipo_evento || tipo.idTipoEvento} value={tipo.idTipo_evento || tipo.idTipoEvento}>
                              {getTipoNombre(tipo)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Estado</label>
                        <select className="form-select" name="Estado" value={form.Estado} onChange={handleChange}>
                          <option value="activo">Activo</option>
                          <option value="proximo">Próximo</option>
                          <option value="inactivo">Inactivo</option>
                          <option value="finalizado">Finalizado</option>
                        </select>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Capacidad Máxima</label>
                        <input type="number" className="form-control" name="Capacidad" value={form.Capacidad} onChange={handleChange} min="1" />
                      </div>
                      <div className="col-md-6 mb-3 d-flex align-items-center">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" name="Requiere_registro" checked={form.Requiere_registro === 1} onChange={(e) => setForm(prev => ({ ...prev, Requiere_registro: e.target.checked ? 1 : 0 }))} id="requiereRegistro" />
                          <label className="form-check-label" htmlFor="requiereRegistro">
                            Requiere registro previo
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                    <button type="submit" className="btn btn-primary">{editEvento ? 'Guardar' : 'Crear'}</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default AdminEventos;
