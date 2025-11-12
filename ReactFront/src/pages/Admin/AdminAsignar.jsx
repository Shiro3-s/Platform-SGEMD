// src/pages/Admin/AdminAsignar.jsx

import React from 'react';

// Componente para las tarjetas de Emprendimiento
const EmprendimientoCard = ({ title, description }) => (
  <div className="base-card emprendimiento-card">
    <div className="emprendimiento-card-icon">
      {/* Ícono de emprendimiento */}
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

// Componente para las tarjetas de Persona (Docentes/Estudiantes)
const PersonaCard = ({ name, description }) => (
  <div className="base-card persona-card">
    <div className="persona-card-icon">
      {/* Imagen o ícono de perfil */}
    </div>
    <h3>{name}</h3>
    <p>{description}</p>
  </div>
);

const AdminAsignar = () => {
  const emprendimientos = [
    {
      id: 1,
      title: 'Emprendimiento 1',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    },
    {
      id: 2,
      title: 'Emprendimiento 2',
      desc: 'Nulla vestibulum mauris ut diam vulputate, nec...',
    },
    {
      id: 3,
      title: 'Emprendimiento 3',
      desc: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
  ];

  const docentes = [
    {
      id: 1,
      name: 'Lorem ipsum',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    },
    {
      id: 2,
      name: 'Lorem ipsum',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    },
    {
      id: 3,
      name: 'Lorem ipsum',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    },
  ];

  return (
    <div className="admin-area-contenido">
      {/* Filtros y barra de búsqueda */}
      <div className="asignar-header-filtros">
        <button className="btn-filtro">Filtrar</button>
        <input type="text" placeholder="Nombre Emprendimiento" />
        <select>
          <option>Tipo de Emprendimiento</option>
        </select>
        <input type="text" placeholder="Nombre Docente" />
        <button className="btn-filtro">🔎</button>
      </div>

      {/* Título de la sección de emprendimientos */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>
        Emprendimientos Disponibles
      </h2>

      <div className="emprendimientos-scroll-container">
        {emprendimientos.map((e) => (
          <EmprendimientoCard
            key={e.id}
            title={e.title}
            description={e.desc}
          />
        ))}
      </div>

      {/* Slider de estado (simulado) */}
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <div
          style={{
            height: '5px',
            width: '80%',
            margin: '0 auto',
            backgroundColor: '#ddd',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '-5px',
              width: '15px',
              height: '15px',
              backgroundColor: '#1a75bc',
              borderRadius: '50%',
            }}
          ></div>
        </div>
      </div>

      <hr style={{ margin: '30px 0' }} />

      {/* Título de la sección de docentes */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>
        Docentes para Asignación
      </h2>

      <div className="docentes-grid">
        {docentes.map((d) => (
          <PersonaCard
            key={d.id}
            name={d.name}
            description={d.desc}
          />
        ))}
      </div>

      {/* Botón de Asignar fijo */}
      <button className="fixed-assign-button">Asignar</button>
    </div>
  );
};

export default AdminAsignar;
