import React from 'react';

const MaestroDashboard = () => {
  // Datos simulados (podrían venir de una API más adelante)
  const data = [
    { id: 1, nombre: 'Honda', tipo: 'Accord' },
    { id: 2, nombre: 'Toyota', tipo: 'Camry' },
    { id: 3, nombre: 'Hyundai', tipo: 'Elantra' },
  ];

  return (
    <div className="content-padding">
      <h3>Gestión de Emprendimientos Estudiantiles</h3>
      <button className="btn-retroceder">Retroceder</button>

      <table className="tabla-emprendimientos">
        <thead>
          <tr>
            <th>#</th>
            <th>NOMBRE</th>
            <th>TIPO DE EMPRENDIMIENTO</th>
            <th>OPCIONES</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nombre}</td>
              <td>{item.tipo}</td>
              <td>
                {/* Botones de acción */}
                <button className="btn-tabla btn-asignar">Asignar</button>
                <button className="btn-tabla btn-editar">Editar</button>
                <button className="btn-tabla btn-eliminar">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaestroDashboard;
