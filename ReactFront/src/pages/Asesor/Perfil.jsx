import React, { useEffect, useState } from 'react';
import AccountDeactivated from '../../components/AccountDeactivated';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';
const DEFAULT_AVATAR = '/img/default-avatar.svg';

const splitFullName = (fullName) => {
  const clean = String(fullName || '').trim().replace(/\s+/g, ' ');
  if (!clean) return { nombre: '', apellido: '' };
  const parts = clean.split(' ');
  if (parts.length === 1) return { nombre: parts[0], apellido: '' };
  return {
    nombre: parts[0],
    apellido: parts.slice(1).join(' '),
  };
};

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
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarSrc, setAvatarSrc] = useState(DEFAULT_AVATAR);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No hay sesión activa');
      setTimeout(() => { window.location.href = '/'; }, 1500);
      return;
    }

    fetch(`${API_URL}/segmed/users/me`, {
      method: 'GET',
      headers: getAuthHeaders(false),
      credentials: 'include'
    })
      .then((r) => r.json())
      .then((j) => {
        if (!j.success) {
          setError(j.error || 'No se pudo cargar el perfil');
          return;
        }

        const u = j.data || j;
        const splitName = splitFullName(u.Nombre);
        setUser(u);
        setAvatarSrc(u.img_perfil ? `${API_URL}${u.img_perfil}` : DEFAULT_AVATAR);
        setForm({
          Nombre: splitName.nombre,
          Apellido: splitName.apellido,
          Direccion: u.Direccion || '',
          Telefono: u.Telefono || '',
          Genero: u.Genero || '',
          FechaNacimiento: u.FechaNacimiento ? u.FechaNacimiento.slice(0, 10) : '',
        });
      }).catch(() => {
        setError('No se pudo conectar al servidor');
      });
  }, []);

  const handleChange = (e) => {
    const { name: field, value } = e.target;
    if (field === 'Telefono') {
      const numericValue = String(value || '').replace(/\D/g, '').slice(0, 10);
      setForm((previous) => ({ ...previous, [field]: numericValue }));
      return;
    }
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');

    try {
      const fullName = `${form.Nombre || ''} ${form.Apellido || ''}`.trim().replace(/\s+/g, ' ');
      const res = await fetch(`${API_URL}/segmed/users/${user.idUsuarios}`, {
        method: 'PUT',
        headers: getAuthHeaders(true),
        credentials: 'include',
        body: JSON.stringify({
          Nombre: fullName,
          Direccion: form.Direccion,
          Telefono: form.Telefono,
          Genero: form.Genero,
          FechaNacimiento: form.FechaNacimiento || null,
        })
      });

      const json = await res.json();
      if (!json.success) {
        setError(json.error || 'No se pudo actualizar el perfil');
        return;
      }

      setSuccess('Perfil actualizado correctamente');
      setEditMode(false);

      const profileRes = await fetch(`${API_URL}/segmed/users/me`, {
        method: 'GET',
        headers: getAuthHeaders(false),
        credentials: 'include',
      });
      const profileJson = await profileRes.json();
      const u = profileJson.data || profileJson;
      const splitName = splitFullName(u.Nombre);

      setUser(u);
      setAvatarSrc(u.img_perfil ? `${API_URL}${u.img_perfil}` : DEFAULT_AVATAR);
      setForm((previous) => ({
        ...previous,
        Nombre: splitName.nombre,
        Apellido: splitName.apellido,
      }));
    } catch (err) {
      setError('Error de red al guardar el perfil');
    }
  };

  const handleUploadAvatar = async () => {
    setError('');
    setSuccess('');
    if (!avatarFile) {
      setError('Selecciona un archivo');
      return;
    }

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
      if (json.success) {
        setSuccess('Avatar actualizado correctamente');
        setUser({ ...user, img_perfil: json.img_perfil });
        setAvatarSrc(`${API_URL}${json.img_perfil}`);
        setAvatarFile(null);
      } else {
        setError(json.error || 'Error al subir avatar');
      }
    } catch (err) {
      setError(err?.message || 'Error subiendo avatar');
    }
  };

  if (user && user.Estado === 0) {
    return <AccountDeactivated user={user} />;
  }

  if (error && !user) return <div className="container mt-4"><div className="alert alert-danger mb-0">{error}</div></div>;

  if (!user) return <div className="container mt-4">Cargando perfil...</div>;

  return (
    <div className="container mt-5 position-relative">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow">
            <div className="card-header bg-success text-white">
              <h3 className="mb-0">Mi Perfil de Asesor</h3>
            </div>

            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <div className="row g-4">
                <div className="col-md-4 text-center">
                  <img
                    src={avatarSrc}
                    alt="avatar"
                    className="rounded-circle mb-3"
                    width={120}
                    height={120}
                    style={{ objectFit: 'cover' }}
                    onError={(event) => {
                      if (event.currentTarget.src.includes(DEFAULT_AVATAR)) return;
                      event.currentTarget.src = DEFAULT_AVATAR;
                    }}
                  />

                  <div className="mb-2">
                    <input type="file" className="form-control" onChange={(e) => setAvatarFile(e.target.files[0])} />
                  </div>
                  <button type="button" className="btn btn-outline-primary btn-sm" onClick={handleUploadAvatar}>Subir avatar</button>
                </div>

                <div className="col-md-8">
                  {!editMode ? (
                    <>
                      <table className="table table-borderless mb-0">
                        <tbody>
                          <tr><th>Nombre</th><td>{user.Nombre || <span className="text-muted">Sin completar</span>}</td></tr>
                          <tr><th>Correo institucional</th><td>{user.CorreoInstitucional || <span className="text-muted">Sin completar</span>}</td></tr>
                          <tr><th>Dirección</th><td>{user.Direccion || <span className="text-muted">Sin completar</span>}</td></tr>
                          <tr><th>Teléfono</th><td>{user.Telefono || <span className="text-muted">Sin completar</span>}</td></tr>
                          <tr><th>Género</th><td>{user.Genero || <span className="text-muted">Sin completar</span>}</td></tr>
                          <tr><th>Fecha de cumpleaños</th><td>{user.FechaNacimiento ? user.FechaNacimiento.slice(0, 10) : <span className="text-muted">Sin completar</span>}</td></tr>
                          <tr><th>Última actualización</th><td>{user.FechaActualizacion ? new Date(user.FechaActualizacion).toLocaleString() : 'N/A'}</td></tr>
                        </tbody>
                      </table>

                      <div className="mt-3">
                        <button type="button" className="btn btn-success" onClick={() => { setEditMode(true); setError(''); setSuccess(''); }}>Editar perfil</button>
                      </div>
                    </>
                  ) : (
                    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                      <div className="row g-2">
                        <div className="col-md-6">
                          <label className="form-label">Nombre</label>
                          <input name="Nombre" className="form-control" value={form.Nombre || ''} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Apellido</label>
                          <input name="Apellido" className="form-control" value={form.Apellido || ''} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Dirección</label>
                          <input name="Direccion" className="form-control" value={form.Direccion || ''} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Teléfono</label>
                          <input
                            name="Telefono"
                            className="form-control"
                            value={form.Telefono || ''}
                            onChange={handleChange}
                            maxLength={10}
                            inputMode="numeric"
                            pattern="[0-9]{1,10}"
                            placeholder="Solo numeros, maximo 10"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Género</label>
                          <select name="Genero" className="form-select" value={form.Genero || ''} onChange={handleChange}>
                            <option value="">Selecciona</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                            <option value="No binario">No binario</option>
                            <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                            <option value="Otro">Otro</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Fecha de cumpleaños</label>
                          <input name="FechaNacimiento" type="date" className="form-control" value={form.FechaNacimiento || ''} onChange={handleChange} />
                        </div>
                      </div>

                      <div className="mt-3">
                        <button type="submit" className="btn btn-success">Guardar cambios</button>
                        <button type="button" className="btn btn-secondary ms-2" onClick={() => setEditMode(false)}>Cancelar</button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
