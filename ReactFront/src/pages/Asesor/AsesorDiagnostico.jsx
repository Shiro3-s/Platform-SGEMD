import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const AsesorDiagnostico = () => {
  const [Emprendedores, setEmprendedores] = useState([]);
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [todasAsignaciones, setTodasAsignaciones] = useState([]);
  const [Emprendedoreseleccionado, setEmprendedoreseleccionado] = useState(null);
  const [emprendimientoSeleccionado, setEmprendimientoSeleccionado] = useState(null);
  const [diagnostico, setDiagnostico] = useState(null);
  const [loading, setLoading] = useState(true);

  const camposDiagnostico = [
    { name: 'AreaEstrategia', label: 'Área de Estrategia' },
    { name: 'Diferencial', label: 'Factor Diferencial' },
    { name: 'Planeacion', label: 'Planificación' },
    { name: 'MercadoObjetivo', label: 'Mercado Objetivo' },
    { name: 'Tendencias', label: 'Tendencias del Mercado' },
    { name: 'Canales', label: 'Canales de Distribución' },
    { name: 'DescripcionPromocion', label: 'Descripción de Promoción' },
    { name: 'Presentacion', label: 'Presentación' },
    { name: 'PasosElaboracion', label: 'Pasos de Elaboración' },
    { name: 'SituacionFinanciera', label: 'Situación Financiera' },
    { name: 'FuenteFinanciero', label: 'Fuentes de Financiamiento' },
    { name: 'EstructuraOrganica', label: 'Estructura Orgánica' },
    { name: 'ConocimientoLegal', label: 'Conocimiento Legal' },
    { name: 'MetodologiaInnovacion', label: 'Metodología de Innovación' },
    { name: 'HerramientaTecnologicas', label: 'Herramientas Tecnológicas' },
    { name: 'Marca', label: 'Marca' },
    { name: 'AplicacionMetodologia', label: 'Aplicación de Metodología' },
    { name: 'ImpactoAmbiental', label: 'Impacto Ambiental' },
    { name: 'ImpactoSocial', label: 'Impacto Social' },
    { name: 'Viabilidad', label: 'Viabilidad del Proyecto' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = getAuthHeaders();
      
      const userRes = await fetch(`${API_URL}/segmed/users/me`, { headers, credentials: 'include' });
      const userData = await userRes.json();
      const teacherId = userData.data?.idUsuarios;

      const [empRes, diagRes, allAsigRes] = await Promise.all([
        fetch(`${API_URL}/segmed/entrepreneurship`, { headers }),
        fetch(`${API_URL}/segmed/diagnosis`, { headers }),
        fetch(`${API_URL}/segmed/assignments`, { headers })
      ]);

      const empData = await empRes.json();
      const diagData = await diagRes.json();
      const asigData = await allAsigRes.json();

      const todosEmprendimientos = empData.data || [];
      const todosDiagnosticos = diagData.data || [];
      const todasAsignaciones = asigData.data || [];
      const misAsignaciones = todasAsignaciones.filter(a => a.Usuarios_idMentor === teacherId && a.Estado === 'activa');
      
      setTodasAsignaciones(todasAsignaciones);
      setEmprendimientos(todosEmprendimientos);
      setDiagnosticos(todosDiagnosticos);

      const uniqueEmprendedores = [];
      const seen = new Set();
      for (const asig of misAsignaciones) {
        if (asig.Usuarios_idEmprendedor && !seen.has(asig.Usuarios_idEmprendedor)) {
          seen.add(asig.Usuarios_idEmprendedor);
          uniqueEmprendedores.push({
            idUsuarios: asig.Usuarios_idEmprendedor,
            Nombre: asig.EmprendedorNombre,
            CorreoInstitucional: asig.EmprendedorCorreo
          });
        }
      }
      
      setEmprendedores(uniqueEmprendedores);

      if (uniqueEmprendedores.length > 0) {
        setEmprendedoreseleccionado(uniqueEmprendedores[0]);
        const asigDelPrimero = misAsignaciones.find(a => a.Usuarios_idEmprendedor === uniqueEmprendedores[0].idUsuarios);
        if (asigDelPrimero && asigDelPrimero.Emprendimiento_idEmprendimiento) {
          const emp = todosEmprendimientos.find(e => e.idEmprendimiento === asigDelPrimero.Emprendimiento_idEmprendimiento);
          setEmprendimientoSeleccionado(emp || null);
          if (emp) {
            const diag = todosDiagnosticos.find(d => d.Emprendimiento_idEmprendimiento === emp.idEmprendimiento);
            setDiagnostico(diag || null);
          }
        }
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEmprendedor = (estId) => {
    const est = Emprendedores.find(e => e.idUsuarios === estId);
    setEmprendedoreseleccionado(est);
    
    const asig = todasAsignaciones.find(a => a.Usuarios_idEmprendedor === estId);
    if (asig && asig.Emprendimiento_idEmprendimiento) {
      const emp = emprendimientos.find(e => e.idEmprendimiento === asig.Emprendimiento_idEmprendimiento);
      setEmprendimientoSeleccionado(emp || null);
      if (emp) {
        const diag = diagnosticos.find(d => d.Emprendimiento_idEmprendimiento === emp.idEmprendimiento);
        setDiagnostico(diag || null);
      } else {
        setDiagnostico(null);
      }
    } else {
      setEmprendimientoSeleccionado(null);
      setDiagnostico(null);
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 style={{ color: '#0c4a6e', marginBottom: '5px' }}>📋 Diagnósticos de Emprendedores</h1>
          <p style={{ color: '#666', margin: 0 }}>Visualiza los diagnósticos de tus Emprendedores asignados</p>
        </div>
        <Link to="/asesor" className="btn btn-outline-secondary">← Volver al Panel</Link>
      </div>

      {Emprendedores.length === 0 ? (
        <div className="card">
          <div className="card-body text-center" style={{ padding: '50px' }}>
            <p style={{ fontSize: '48px', marginBottom: '15px' }}>👨‍🏫</p>
            <h4 style={{ color: '#0c4a6e' }}>Sin Emprendedores asignados</h4>
            <p className="text-muted">No tienes Emprendedores asignados a tus emprendimientos.</p>
            <p className="text-muted">El administrador debe asignarte Emprendedores primero.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="card mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label"><strong>Seleccionar Emprendedor:</strong></label>
                  <select 
                    className="form-select"
                    value={Emprendedoreseleccionado?.idUsuarios || ''}
                    onChange={(e) => handleSelectEmprendedor(parseInt(e.target.value))}
                  >
                    {Emprendedores.map(est => (
                      <option key={est.idUsuarios} value={est.idUsuarios}>
                        {est.Nombre} - {est.CorreoInstitucional}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  {emprendimientoSeleccionado ? (
                    diagnostico ? (
                      <div className="badge bg-success p-2 mt-2">✓ Tiene diagnóstico</div>
                    ) : (
                      <div className="badge bg-warning text-dark p-2 mt-2">⏳ Sin diagnóstico</div>
                    )
                  ) : (
                    <div className="badge bg-secondary p-2 mt-2">Sin emprendimiento</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {emprendimientoSeleccionado && (
            <div className="card">
              <div className="card-header" style={{ backgroundColor: '#0c4a6e', color: 'white' }}>
                <h5 style={{ margin: 0 }}>📋 Diagnóstico: {emprendimientoSeleccionado.Nombre}</h5>
                <small>{Emprendedoreseleccionado?.Nombre}</small>
              </div>
              
              <div className="card-body">
                {diagnostico ? (
                  <div>
                    <div className="alert alert-success d-flex align-items-center" style={{ marginBottom: '20px' }}>
                      <span style={{ marginRight: '10px', fontSize: '20px' }}>✅</span>
                      <strong>Diagnóstico completado</strong>
                    </div>
                    <div className="row">
                      {camposDiagnostico.map(campo => (
                        <div key={campo.name} className="col-md-6 mb-3">
                          <div className="p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                            <h6 style={{ margin: '0 0 10px 0', color: '#0c4a6e' }}>{campo.label}</h6>
                            <p style={{ margin: 0, color: '#555', whiteSpace: 'pre-wrap' }}>
                              {diagnostico[campo.name] || 'No especificado'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <div style={{ 
                      width: '80px', 
                      height: '80px', 
                      borderRadius: '50%', 
                      backgroundColor: '#fff3cd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px'
                    }}>
                      <span style={{ fontSize: '36px' }}>⏳</span>
                    </div>
                    <h5 style={{ color: '#ffc107', marginBottom: '10px' }}>Diagnóstico Pendiente</h5>
                    <p style={{ color: '#666', marginBottom: '20px' }}>
                      Este Emprendedor no tiene un diagnóstico registrado.
                    </p>
                    <p className="text-muted">El administrador debe crear el diagnóstico.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AsesorDiagnostico;



