import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const AdminCrearEmprendimiento = () => {
  const navigate = useNavigate();
  const [Emprendedores, setEmprendedores] = useState([]);
  const [Asesores, setAsesores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    Nombre: '',
    Descripcion: '',
    TipoEmprendimiento: '',
    SectorProductivo: '',
    EmprendedoresSeleccionados: [],
    AsesoresSeleccionados: []
  });

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const headers = getAuthHeaders();
      const res = await fetch(`${API_URL}/segmed/users`, { 
        headers, 
        credentials: 'include' 
      });
      const data = await res.json();
      
      if (data.data) {
        setEmprendedores(data.data.filter(u => u.Roles_idRoles1 === 2));
        setAsesores(data.data.filter(u => u.Roles_idRoles1 === 3));
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEmprendedorChange = (e) => {
    const options = e.target.options;
    const values = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        values.push(parseInt(options[i].value));
      }
    }
    setForm(prev => ({ ...prev, EmprendedoresSeleccionados: values }));
  };

  const handleAsesorChange = (e) => {
    const options = e.target.options;
    const values = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        values.push(parseInt(options[i].value));
      }
    }
    setForm(prev => ({ ...prev, AsesoresSeleccionados: values }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (!form.Nombre.trim()) {
      alert('El nombre del emprendimiento es requerido');
      setSaving(false);
      return;
    }
    if (!form.TipoEmprendimiento) {
      alert('Selecciona el tipo de emprendimiento');
      setSaving(false);
      return;
    }
    if (!form.SectorProductivo) {
      alert('Selecciona el sector productivo');
      setSaving(false);
      return;
    }
    if (form.EmprendedoresSeleccionados.length === 0) {
      alert('Debes seleccionar al menos un Emprendedor');
      setSaving(false);
      return;
    }

    try {
      let creados = 0;
      let erroresMsg = [];

      for (const EmprendedorId of form.EmprendedoresSeleccionados) {
        const payload = {
          Nombre: form.Nombre,
          Descripcion: form.Descripcion || '',
          TipoEmprendimiento: form.TipoEmprendimiento,
          SectorProductivo: form.SectorProductivo,
          Usuarios_idUsuarios: EmprendedorId,
          EtapaEmprendimiento_idEtapaEmprendimiento: 1,
          RedesSociales: 0,
          Acompanamiento: 0
        };

        console.log('Enviando:', JSON.stringify(payload));

        const res = await fetch(`${API_URL}/segmed/entrepreneurship`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
          credentials: 'include'
        });
        
        const data = await res.json();
        console.log('Respuesta:', res.status, data);

        if (!res.ok || !data.success) {
          erroresMsg.push(`Emprendedor ${EmprendedorId}: ${data.error || 'Error ' + res.status}`);
          continue;
        }

        creados++;

        if (form.AsesoresSeleccionados.length > 0) {
          const empId = data.data?.idEmprendimiento || data.data?.id;
          for (const AsesorId of form.AsesoresSeleccionados) {
            await fetch(`${API_URL}/segmed/assignments`, {
              method: 'POST',
              headers: getAuthHeaders(),
              body: JSON.stringify({
                Asesor_idUsuarios: AsesorId,
                Emprendimiento_idEmprendimiento: empId
              }),
              credentials: 'include'
            });
          }
        }
      }

      if (erroresMsg.length > 0) {
        alert('Errores:\n' + erroresMsg.join('\n'));
      } else if (creados > 0) {
        alert('Emprendimiento creado exitosamente');
        navigate('/admin/emprendimientos/plan-de-trabajo');
      }
    } catch (err) {
      console.error('Error completo:', err);
      alert('Error al crear: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

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
      <div className="card">
        <div className="card-header" style={{ backgroundColor: '#0c4a6e', color: 'white' }}>
          <h4 style={{ margin: 0 }}>➕ Crear Emprendimiento</h4>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label" style={{ fontWeight: 'bold', color: '#0c4a6e' }}>
                  Nombre del Emprendimiento *
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="Nombre"
                  value={form.Nombre}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Mi Negocio Verde"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label" style={{ fontWeight: 'bold', color: '#0c4a6e' }}>
                  Tipo de Emprendimiento *
                </label>
                <select
                  className="form-select"
                  name="TipoEmprendimiento"
                  value={form.TipoEmprendimiento}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="Individual">Individual</option>
                  <option value="Grupal">Grupal</option>
                  <option value="Social">Social</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label" style={{ fontWeight: 'bold', color: '#0c4a6e' }}>
                Descripción
              </label>
              <textarea
                className="form-control"
                name="Descripcion"
                rows="3"
                value={form.Descripcion}
                onChange={handleChange}
                placeholder="Describe tu emprendimiento..."
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label" style={{ fontWeight: 'bold', color: '#0c4a6e' }}>
                  Sector Productivo *
                </label>
                <select
                  className="form-select"
                  name="SectorProductivo"
                  value={form.SectorProductivo}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="Agricultura">Agricultura y ganadería</option>
                  <option value="Comercio">Comercio al por menor</option>
                  <option value="Industria">Industria manufacturera</option>
                  <option value="Alimentacion">Servicios de alimentación</option>
                  <option value="Tecnologia">Tecnología de la información</option>
                  <option value="Educacion">Educación</option>
                  <option value="Salud">Salud</option>
                  <option value="Construccion">Construcción</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Otros">Otros servicios</option>
                </select>
              </div>
            </div>

            <hr style={{ margin: '20px 0' }} />

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label" style={{ fontWeight: 'bold', color: '#0c4a6e' }}>
                  Seleccionar Emprendedor(s) *
                </label>
                <select
                  className="form-select"
                  multiple
                  onChange={handleEmprendedorChange}
                  style={{ height: '200px' }}
                  required
                >
                  {Emprendedores.map(emprendedor => (
                    <option key={emprendedor.idUsuarios || emprendedor.idusuarios} value={emprendedor.idUsuarios || emprendedor.idusuarios}>
                      {emprendedor.Nombre} ({emprendedor.CorreoInstitucional})
                    </option>
                  ))}
                </select>
                <small className="text-muted">Mantén presionado Ctrl para seleccionar múltiples</small>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label" style={{ fontWeight: 'bold', color: '#0c4a6e' }}>
                  Seleccionar Asesor(s) - Opcional
                </label>
                <select
                  className="form-select"
                  multiple
                  onChange={handleAsesorChange}
                  style={{ height: '200px' }}
                >
                  {Asesores.map(asesor => (
                    <option key={asesor.idUsuarios || asesor.idusuarios} value={asesor.idUsuarios || asesor.idusuarios}>
                      {asesor.Nombre} ({asesor.CorreoInstitucional})
                    </option>
                  ))}
                </select>
                <small className="text-muted">Mantén presionado Ctrl para seleccionar múltiples</small>
              </div>
            </div>

            <div className="d-flex gap-2 mt-4">
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ backgroundColor: '#1a75bc' }}
                disabled={saving}
              >
                {saving ? 'Guardando...' : '💾 Crear Emprendimiento'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate('/admin')}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminCrearEmprendimiento;

