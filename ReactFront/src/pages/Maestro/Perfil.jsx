import React, { useEffect, useState } from 'react';
import AccountDeactivated from '../../components/AccountDeactivated';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

// Utilidad para obtener el token y preparar headers
const getAuthHeaders = (includeContentType = true) => {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

const Perfil = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Sin token en localStorage');
      return;
    }
    
    fetch(`${API_URL}/segmed/users/me`, {
      method: 'GET',
      headers: getAuthHeaders(false),
      credentials: 'include'
    })
      .then((r) => r.json())
      .then((j) => {
        setUser(j.data || j);
        if (j.data) setName(j.data.Nombre || '');
      }).catch((err) => {
        console.error('Error fetching profile:', err);
      });
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_URL}/segmed/users/${user.idUsuarios}`, {
        method: 'PUT',
        headers: getAuthHeaders(true),
        credentials: 'include',
        body: JSON.stringify({ Nombre: name })
      });
      const json = await res.json();
      if (json.success) alert('Perfil actualizado'); else alert(json.error || 'Error');
    } catch (err) { console.error(err); alert('Error'); }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return alert('Selecciona un archivo');
    const fd = new FormData();
    fd.append('avatar', avatarFile);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/segmed/users/${user.idUsuarios}/avatar`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      });
      const json = await res.json();
      if (json.success) { alert('Avatar actualizado'); setUser({ ...user, img_perfil: json.img_perfil }); }
      else alert(json.error || 'Error');
    } catch (err) { console.error(err); alert('Error subiendo avatar'); }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción desactivará tu cuenta y necesitarás solicitar su reactivación.')) return;
    
    try {
      const res = await fetch(`${API_URL}/segmed/users/${user.idUsuarios}`, {
        method: 'DELETE',
        headers: getAuthHeaders(true),
        credentials: 'include'
      });
      const j = await res.json();
      if (j.success) {
        alert('✅ Cuenta desactivada correctamente. Cerrando sesión...');
        localStorage.removeItem('token');
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        alert(j.error || 'Error al desactivar la cuenta');
      }
    } catch (err) {
      alert('Error de conexión: ' + err.message);
    }
  };

  if (user && user.Estado === 0) {
    return <AccountDeactivated user={user} />;
  }

  if (!user) return <div>Cargando perfil...</div>;

  return (
    <div className="content-padding">
      <h2>Mi Perfil de Profesor</h2>
      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <div>
            {user.img_perfil ? (
              <img src={`${API_URL}${user.img_perfil}`} alt="avatar" width={120} />
            ) : (
              <div style={{ width: 120, height: 120, background: '#eee' }} />
            )}
          </div>
          <div>
            <div>
              <label>Nombre</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div style={{ marginTop: 8 }}>
              <input type="file" onChange={(e) => setAvatarFile(e.target.files[0])} />
              <button onClick={handleUploadAvatar}>Subir avatar</button>
            </div>
            <div style={{ marginTop: 8 }}>
              <button onClick={handleSave}>Guardar</button>
              <button onClick={handleDeleteAccount} style={{ marginLeft: 8, background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Eliminar cuenta</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;