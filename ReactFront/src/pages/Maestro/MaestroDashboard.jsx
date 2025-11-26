import React, { useState, useEffect } from 'react';
// Importa el hook para navegación si necesitas redirigir
// import { useNavigate } from 'react-router-dom'; 

// Importa tu función de utilidad para llamar al API
// import { apiFetch } from '../../api'; // Asumiendo que api.js está en la raíz

// =========================================================
// 💡 DATOS SIMULADOS: Reemplaza esto con una llamada real a tu API
// La estructura ideal del emprendimiento para el maestro:
const dummyEmprendimientos = [
  { id: 101, nombreProyecto: 'Eco-Rutas Viales', estudiante: 'Ana López', fase: 'Ideación', estado: 'Pendiente' },
  { id: 102, nombreProyecto: 'App de Gestión de Cultivos', estudiante: 'Equipo Alfa', fase: 'Desarrollo', estado: 'En Curso' },
  { id: 103, nombreProyecto: 'Sistema de Riego Inteligente', estudiante: 'Carlos Ruiz', fase: 'Prototipo', estado: 'Terminado' },
  { id: 104, nombreProyecto: 'Plataforma de Trueque Local', estudiante: 'María García', fase: 'Ideación', estado: 'Pendiente' },
];
// =========================================================


const MaestroDashboard = () => {
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // const navigate = useNavigate(); // Descomentar si se usa

  useEffect(() => {
    // ⬇️ En un escenario real, harías una llamada al API aquí ⬇️
    // fetchEmprendimientos();
    
    // Simulamos la carga de datos
    setTimeout(() => {
        setEmprendimientos(dummyEmprendimientos);
        setLoading(false);
    }, 1000); 

  }, []);

  /* // 💡 Ejemplo de función para obtener datos reales del API:
  const fetchEmprendimientos = async () => {
    try {
      // Reemplaza la URL por la de tu endpoint de backend
      const data = await apiFetch('http://localhost:3005/api/maestro/emprendimientos'); 
      setEmprendimientos(data);
    } catch (err) {
      setError('Error al cargar los emprendimientos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  */

  if (loading) return <div className="content-padding">Cargando emprendimientos...</div>;
  if (error) return <div className="content-padding" style={{color: 'red'}}>{error}</div>;

  return (
    <div className="content-padding">
      <h3>🚀 Emprendimientos Asignados</h3>
      
      {/* El botón de Retroceder se elimina ya que estamos en el Dashboard */}
      
      <div className="card">
        {emprendimientos.length === 0 ? (
          <p>Aún no tienes emprendimientos asignados.</p>
        ) : (
          <table className="tabla-emprendimientos">
            <thead>
              <tr>
                <th>PROYECTO</th>
                <th>ESTUDIANTE/EQUIPO</th>
                <th>FASE ACTUAL</th>
                <th>ESTADO</th>
                <th>OPCIONES</th>
              </tr>
            </thead>

            <tbody>
              {emprendimientos.map((item) => (
                <tr key={item.id}>
                  <td>{item.nombreProyecto}</td>
                  <td>{item.estudiante}</td>
                  <td>{item.fase}</td>
                  <td>{item.estado}</td>
                  <td>
                    {/* Botones de acción. Los paths deben ir a rutas definidas en App.js */}
                    <button 
                        className="btn-tabla btn-ver" 
                        // onClick={() => navigate(`/maestro/emprendimientos/${item.id}`)}
                    >
                        Ver Detalle
                    </button>
                    <button className="btn-tabla btn-editar">Evaluar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MaestroDashboard;