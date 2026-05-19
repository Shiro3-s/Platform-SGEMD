const { pool } = require('../config/db.config')

exports.findAll = async () => {
    const [rows] = await pool.execute('SELECT * FROM Eventos')
    return rows
}

exports.findById = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM Eventos WHERE idEventos = ?', [id])
    if (rows.length === 0) throw new Error('Evento no encontrado')
    return rows[0]
}

exports.create = async (data) => {
    const [result] = await pool.execute(
        `INSERT INTO Eventos (
            Nombre_evento, Descripcion_evento, Tipo_evento_idTipo_evento,
            Link_evento, Archivo_url, Estado,
            Capacidad_maxima, Creado_por, Fecha_creacion, Fecha_actualizacion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            data.Nombre || data.Nombre_evento,
            data.Descripcion || data.Descripcion_evento,
            data.Tipo || data.Tipo_evento_idTipo_evento || 1,
            data.Link_evento || null,
            data.Archivo_url || null,
            data.Estado || 'Activo',
            data.Capacidad_maxima || data.Capacidad || 50,
            data.Creado_por || null,
            new Date(),
            new Date()
        ]
    )
    return { id: result.insertId, ...data }
}

exports.update = async (id, data) => {
    const updates = [];
    const values = [];
    
    if (data.Nombre || data.Nombre_evento) {
        updates.push('Nombre_evento = ?');
        values.push(data.Nombre || data.Nombre_evento);
    }
    if (data.Descripcion || data.Descripcion_evento) {
        updates.push('Descripcion_evento = ?');
        values.push(data.Descripcion || data.Descripcion_evento);
    }
    if (data.Tipo || data.Tipo_evento_idTipo_evento) {
        updates.push('Tipo_evento_idTipo_evento = ?');
        values.push(data.Tipo || data.Tipo_evento_idTipo_evento);
    }
    if (data.Link_evento !== undefined) {
        updates.push('Link_evento = ?');
        values.push(data.Link_evento);
    }
    if (data.Archivo_url !== undefined) {
        updates.push('Archivo_url = ?');
        values.push(data.Archivo_url);
    }
    if (data.Estado) {
        updates.push('Estado = ?');
        values.push(data.Estado);
    }
    if (data.Capacidad_maxima || data.Capacidad) {
        updates.push('Capacidad_maxima = ?');
        values.push(data.Capacidad_maxima || data.Capacidad);
    }
    if (data.Creado_por !== undefined) {
        updates.push('Creado_por = ?');
        values.push(data.Creado_por);
    }
    
    updates.push('Fecha_actualizacion = ?');
    values.push(new Date());
    values.push(id);
    
    const [result] = await pool.execute(
        `UPDATE Eventos SET ${updates.join(', ')} WHERE idEventos = ?`,
        values
    )
    return result.affectedRows > 0
}

exports.remove = async (id) => {
    const [result] = await pool.execute(
        'DELETE FROM Eventos WHERE idEventos = ?', [id]
    )
    return result.affectedRows > 0
}