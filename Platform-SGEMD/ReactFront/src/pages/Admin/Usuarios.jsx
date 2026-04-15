import React, { useEffect, useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

export default function AdminUsuarios() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // si filter === 'active' añadimos ?active=1
      let url = `${API_URL}/segmed/users`;
      if (filter === 'active') url += '?active=1';
      const res = await fetch(url, { credentials: 'include' });
      const json = await res.json();
      setUsers(json.data || json);
    } catch (err) {
      console.error('Error cargando usuarios', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Desea desactivar este usuario?')) return;
    try {
      const res = await fetch(`${API_URL}/segmed/users/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      const json = await res.json();
      if (json.success) fetchUsers();
      else alert(json.error || 'Error');
    } catch (err) {
      console.error(err);
      alert('Error al desactivar usuario');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Gestión de Usuarios (Admin)</h2>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setFilter('all')}>Todos</button>
        <button onClick={() => setFilter('active')}>Activos</button>
        <button onClick={() => setFilter('inactive')}>Inactivos</button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users && users.map((u) => (
              <tr key={u.idUsuarios} style={{ borderTop: '1px solid #ddd' }}>
                <td style={{ padding: 8 }}>
                  {u.img_perfil ? (
                    <img src={`${API_URL}${u.img_perfil}`} alt="avatar" width={48} height={48} />
                  ) : (
                    <div style={{ width: 48, height: 48, background: '#eee' }} />
                  )}
                </td>
                <td>{u.Nombre}</td>
                <td>{u.CorreoInstitucional}</td>
                <td>{u.Roles_idRoles1}</td>
                <td>{u.Estado === 1 ? 'Activo' : 'Inactivo'}</td>
                <td>
                  <button onClick={() => alert(JSON.stringify(u, null, 2))}>Ver</button>
                  <button onClick={() => alert('Implementar editar UI')}>Editar</button>
                  <button onClick={() => handleDelete(u.idUsuarios)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
