import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../api';
import './Asesorias.css';

// Página de Asesorías para Estudiantes
const Asesorias = () => {
  const [me, setMe] = useState(null);
  const [profesores, setProfesores] = useState([]);
  const [loadingProfesores, setLoadingProfesores] = useState(true);
  const [asesorias, setAsesorias] = useState([]);
  const [loadingAsesorias, setLoadingAsesorias] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ fecha: '', hora: '', profesorId: '', comentarios: '' });
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const load = async () => {
      console.log('🔄 [Asesorias] Iniciando carga de datos...');
      setError(null);
      try {
        // 1. Cargar usuario actual
        console.log('📥 [Asesorias] Obteniendo usuario actual (/segmed/users/me)...');
        const meRes = await apiFetch('/segmed/users/me');
        console.log('✅ [Asesorias] Respuesta /segmed/users/me:', meRes);
        const user = (meRes && meRes.data) ? meRes.data : (meRes || null);
        setMe(user);
        console.log('👤 [Asesorias] Usuario:', user?.Nombre || user?.nombre || user?.name);

        // 2. Cargar docentes
        setLoadingProfesores(true);
        try {
          console.log('📥 [Asesorias] Obteniendo docentes (/segmed/users)...');
          const res = await apiFetch('/segmed/users');
          console.log('✅ [Asesorias] Respuesta /segmed/users:', res);
          const list = (res && Array.isArray(res.data)) ? res.data : (Array.isArray(res) ? res : []);
          console.log('📊 [Asesorias] Total usuarios:', list.length);
          const docentes = list.filter(u => Number(u.Roles_idRoles1) === 3 || Number(u.Rol) === 3 || Number(u.Roles_idRoles) === 3);
          console.log('👨‍🏫 [Asesorias] Docentes filtrados:', docentes.length);
          const mapped = docentes.map(d => ({ id: d.idUsuarios || d.id, nombre: d.Nombre || d.nombre || d.name }));
          setProfesores(mapped);
        } catch (err) {
          console.error('❌ [Asesorias] Error cargando docentes:', err.message);
          setProfesores([]);
          setError(`Error cargando docentes: ${err.message}`);
        } finally {
          setLoadingProfesores(false);
        }

        // 3. Cargar asesorías
        setLoadingAsesorias(true);
        try {
          console.log('📥 [Asesorias] Obteniendo asesorías (/segmed/advice)...');
          const adv = await apiFetch('/segmed/advice');
          console.log('✅ [Asesorias] Respuesta /segmed/advice:', adv);
          const list = (adv && Array.isArray(adv.data)) ? adv.data : (Array.isArray(adv) ? adv : []);
          console.log('📊 [Asesorias] Total asesorías en BD:', list.length);
          const userId = user && (user.idUsuarios || user.id);
          console.log('🔍 [Asesorias] Filtrando por usuario:', userId);
          const my = list.filter(a => Number(a.Usuarios_idUsuarios) === Number(userId));
          console.log('📋 [Asesorias] Asesorías del usuario:', my.length);
          
          // Mapear a formato simple
          const mappedAses = my.map(a => {
            const fechaRaw = a.Fecha_asesoria || a.Fecha_asesoria;
            const dt = fechaRaw ? new Date(fechaRaw) : null;
            const fecha = dt ? dt.toISOString().slice(0,10) : '';
            const hora = dt ? dt.toTimeString().slice(0,5) : '';
            let profesorId = null; let profesorNombre = null;
            try {
              if (a.Comentarios) {
                const parsed = JSON.parse(a.Comentarios);
                profesorId = parsed.profesorId || parsed.profesor_id || parsed.profesor || null;
                profesorNombre = parsed.profesorNombre || parsed.profesor_nombre || null;
              }
            } catch (e) {
              // comentarios no JSON
            }
            return {
              id: a.idAsesorias || a.id || a.idAsesoria,
              fecha,
              hora,
              profesorId,
              profesorNombre,
              raw: a
            };
          });
          setAsesorias(mappedAses);
        } catch (err) {
          console.error('❌ [Asesorias] Error cargando asesorías:', err.message);
          setAsesorias([]);
          setError(`Error cargando asesorías: ${err.message}`);
        } finally {
          setLoadingAsesorias(false);
        }
      } catch (err) {
        console.error('❌ [Asesorias] Error general iniciando:', err.message);
        setError(`Error iniciando: ${err.message}`);
      }
    };

    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ fecha: '', hora: '', profesorId: profesores[0]?.id || '', comentarios: '' });
    setShowModal(true);
  };

  const openEdit = (a) => {
    setEditing(a);
    setForm({ fecha: a.fecha || '', hora: a.hora || '', profesorId: a.profesorId || '', comentarios: '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fecha || !form.hora || !form.profesorId) return alert('Completa fecha, hora y docente');
    setSubmitting(true);

    const fechaIso = `${form.fecha} ${form.hora}:00`;

    if (editing) {
      // Editar: sólo fecha/hora permitidos
      const original = editing.raw || {};
      const payload = {
        Nombre_de_asesoria: original.Nombre_de_asesoria || `Asesoria`,
        Descripcion: original.Descripcion || '',
        Fecha_asesoria: fechaIso,
        Comentarios: original.Comentarios || JSON.stringify({ profesorId: editing.profesorId, profesorNombre: editing.profesorNombre }),
        Fecha_creacion: original.Fecha_creacion || new Date().toISOString().slice(0,19).replace('T',' '),
        Fecha_actualizacion: new Date().toISOString().slice(0,19).replace('T',' '),
        confirmacion: original.confirmacion || 'pendiente',
        Usuarios_idUsuarios: original.Usuarios_idUsuarios || (me && (me.idUsuarios || me.id)) || null,
        Modalidad_idModalidad: original.Modalidad_idModalidad || 1,
        Fecha_y_Horarios_idFecha_y_Horarios: original.Fecha_y_Horarios_idFecha_y_Horarios || 1
      };

      try {
        const res = await apiFetch(`/segmed/advice/${editing.id}`, { method: 'PUT', body: JSON.stringify(payload) });
        // actualizar UI optimista
        setAsesorias(prev => prev.map(it => it.id === editing.id ? { ...it, fecha: form.fecha, hora: form.hora } : it));
      } catch (err) {
        console.warn('Error al editar asesoría:', err.message);
        alert('Error editando asesoría: ' + err.message);
      } finally {
        setSubmitting(false);
        setShowModal(false);
      }

    } else {
      // Crear nueva asesoría
      const profesorIdNum = Number(form.profesorId);
      const profesorNombre = (profesores.find(p => Number(p.id) === profesorIdNum) || {}).nombre || '';
      const payload = {
        Nombre_de_asesoria: (`Asesoria con ${profesorNombre}`).slice(0,45),
        Descripcion: '',
        Fecha_asesoria: fechaIso,
        Comentarios: JSON.stringify({ profesorId: profesorIdNum, profesorNombre }),
        Fecha_creacion: new Date().toISOString().slice(0,19).replace('T',' '),
        Fecha_actualizacion: new Date().toISOString().slice(0,19).replace('T',' '),
        confirmacion: 'pendiente',
        Usuarios_idUsuarios: (me && (me.idUsuarios || me.id)) || null,
        Modalidad_idModalidad: 1,
        Fecha_y_Horarios_idFecha_y_Horarios: 1
      };

      try {
        const res = await apiFetch('/segmed/advice', { method: 'POST', body: JSON.stringify(payload) });
        // si backend retorna data con id, usarlo, sino generar temporal
        const newId = res && res.data && (res.data.id || res.data.idAsesorias) ? (res.data.id || res.data.idAsesorias) : Date.now();
        const newA = { id: newId, fecha: form.fecha, hora: form.hora, profesorId: profesorIdNum, profesorNombre };
        setAsesorias(prev => [newA, ...prev]);
      } catch (err) {
        console.warn('Error creando asesoría:', err.message);
        alert('Error creando asesoría: ' + err.message);
      } finally {
        setSubmitting(false);
        setShowModal(false);
      }
    }
  };

  const openDeleteConfirm = (id, fecha, profesorNombre) => {
    setDeleteTarget({ id, fecha, profesorNombre });
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    
    setSubmitting(true);
    try {
      console.log(`🗑️ [Asesorias] Eliminando asesoría ${deleteTarget.id}...`);
      await apiFetch(`/segmed/advice/${deleteTarget.id}`, { method: 'DELETE' });
      setAsesorias(prev => prev.filter(a => a.id !== deleteTarget.id));
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
      console.log('✅ [Asesorias] Asesoría eliminada correctamente');
    } catch (err) {
      console.error('❌ Error eliminando asesoría:', err.message);
      alert('Error eliminando asesoría: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
  };

  if (loadingAsesorias && loadingProfesores) {
    return (
      <div className="content-padding">
        <div className="card p-5 text-center">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p>Cargando asesorías...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-padding">
      {error && (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          <strong>Advertencia:</strong> {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Asesorías</h2>
        <button className="btn btn-primary" onClick={openCreate} disabled={loadingProfesores || profesores.length === 0}>
          Agendar Asesoría
        </button>
      </div>

      {profesores.length === 0 && !loadingProfesores && (
        <div className="alert alert-info mb-3">
          ⚠️ No hay docentes disponibles para agendar asesorías.
        </div>
      )}

      <div className="card p-3">
        {asesorias.length === 0 ? (
          <div className="text-center py-4">
            <p>No tienes asesorías programadas.</p>
            {profesores.length > 0 && (
              <button className="btn btn-outline-primary" onClick={openCreate}>Agendar ahora</button>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Docente</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {asesorias.map(a => (
                  <tr key={a.id}>
                    <td>{a.fecha}</td>
                    <td>{a.hora}</td>
                    <td>{a.profesorNombre || (profesores.find(p => Number(p.id) === Number(a.profesorId)) || {}).nombre}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => openEdit(a)}>Editar</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => openDeleteConfirm(a.id, a.fecha, a.profesorNombre)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-backdrop show"></div>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editing ? 'Editar Asesoría' : 'Agendar Asesoría'}</h5>
                <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label date-time-label">📅 Selecciona Fecha</label>
                    <div className="date-input-wrapper">
                      <input 
                        className="form-control date-input" 
                        type="date" 
                        value={form.fecha} 
                        onChange={e => setForm({ ...form, fecha: e.target.value })} 
                        required 
                      />
                      {form.fecha && <span className="date-badge">{new Date(form.fecha).toLocaleDateString('es-ES', { weekday: 'short', month: 'short', day: 'numeric' })}</span>}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label date-time-label">🕐 Selecciona Hora</label>
                    <div className="time-input-wrapper">
                      <input className="form-control" type="time" value={form.hora} onChange={e => setForm({ ...form, hora: e.target.value })} required />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Docente</label>
                    {loadingProfesores ? (
                      <div className="d-flex align-items-center"><div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div> Cargando docentes...</div>
                    ) : (
                      <select className="form-select" value={form.profesorId} onChange={e => setForm({ ...form, profesorId: e.target.value })} disabled={!!editing} required>
                        <option value="">-- Seleccionar docente --</option>
                        {profesores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                      </select>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Comentarios (opcional)</label>
                    <textarea className="form-control" value={form.comentarios} onChange={e => setForm({ ...form, comentarios: e.target.value })} placeholder="Detalles opcionales"></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={submitting}>Cancelar</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting || loadingProfesores}>{submitting ? 'Enviando...' : (editing ? 'Guardar cambios' : 'Agendar')}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteConfirm && deleteTarget && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-backdrop show"></div>
          <div className="modal-dialog modal-dialog-centered" role="document" style={{ maxWidth: '450px' }}>
            <div className="modal-content delete-confirm-modal">
              <div className="modal-header delete-header">
                <div className="delete-icon-wrapper">
                  <span className="delete-icon">⚠️</span>
                </div>
                <h5 className="modal-title">Confirmar eliminación</h5>
                <button type="button" className="btn-close" aria-label="Cerrar" onClick={cancelDelete} disabled={submitting}></button>
              </div>
              <div className="modal-body delete-body">
                <p className="delete-text">
                  ¿Estás seguro de que deseas eliminar esta asesoría?
                </p>
                <div className="delete-details">
                  <div className="detail-item">
                    <span className="detail-label">📅 Fecha:</span>
                    <span className="detail-value">{deleteTarget.fecha}</span>
                  </div>
                  {deleteTarget.profesorNombre && (
                    <div className="detail-item">
                      <span className="detail-label">👨‍🏫 Docente:</span>
                      <span className="detail-value">{deleteTarget.profesorNombre}</span>
                    </div>
                  )}
                </div>
                <p className="delete-warning">
                  <strong>Nota:</strong> Esta acción no se puede deshacer.
                </p>
              </div>
              <div className="modal-footer delete-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={cancelDelete}
                  disabled={submitting}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={confirmDelete}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Eliminando...
                    </>
                  ) : (
                    '🗑️ Eliminar'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Asesorias;
