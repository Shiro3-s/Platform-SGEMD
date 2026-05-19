const { pool } = require('../config/db.config')

exports.findAll = async (filters = {}) => {
    let query = 'SELECT * FROM Asesorias WHERE 1=1';
    const params = [];
    
    if (filters.docenteId) {
        query += ' AND Docente_idUsuarios = ?';
        params.push(filters.docenteId);
    }
    
    if (filters.estudianteId) {
        query += ' AND Estudiante_idUsuarios = ?';
        params.push(filters.estudianteId);
    }
    
    if (filters.estado) {
        query += ' AND EstadoSolicitud = ?';
        params.push(filters.estado);
    }
    
    const [rows] = await pool.execute(query, params);
    return rows;
}

exports.findById = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM Asesorias WHERE idAsesorias = ?', [id]);
    if (rows.length === 0) throw new Error('Asesoría no encontrada');
    return rows[0];
}

exports.create = async (data) => {
    const fechaActual = new Date();
    const [result] = await pool.execute(
        `INSERT INTO Asesorias (
            Nombre_de_asesoria, Descripcion, Fecha_asesoria, Comentarios,
            Fecha_creacion, Fecha_actualizacion, confirmacion,
            Usuarios_idUsuarios, Docente_idUsuarios, Estudiante_idUsuarios,
            Modalidad_idModalidad, Fecha_y_Horarios_idFecha_y_Horarios,
            MotivoSolicitud, EstadoSolicitud
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            data.Nombre_de_asesoria || null,
            data.Descripcion || null,
            data.Fecha_asesoria || null,
            data.Comentarios || null,
            data.Fecha_creacion || fechaActual,
            data.Fecha_actualizacion || fechaActual,
            data.confirmacion || 'pendiente',
            data.Usuarios_idUsuarios || null,
            data.Docente_idUsuarios || null,
            data.Estudiante_idUsuarios || null,
            data.Modalidad_idModalidad || 1,
            data.Fecha_y_Horarios_idFecha_y_Horarios || 1,
            data.MotivoSolicitud || null,
            data.EstadoSolicitud || 'pendiente'
        ]
    );
    return { idAsesorias: result.insertId, ...data };
}

exports.update = async (id, data) => {
    let updates = [];
    let values = [];
    
    if (data.Nombre_de_asesoria !== undefined) {
        updates.push('Nombre_de_asesoria = ?');
        values.push(data.Nombre_de_asesoria);
    }
    if (data.Descripcion !== undefined) {
        updates.push('Descripcion = ?');
        values.push(data.Descripcion || null);
    }
    if (data.Fecha_asesoria !== undefined) {
        updates.push('Fecha_asesoria = ?');
        values.push(data.Fecha_asesoria);
    }
    if (data.Comentarios !== undefined) {
        updates.push('Comentarios = ?');
        values.push(data.Comentarios || null);
    }
    if (data.Fecha_actualizacion !== undefined) {
        updates.push('Fecha_actualizacion = ?');
        values.push(data.Fecha_actualizacion);
    }
    if (data.confirmacion !== undefined) {
        updates.push('confirmacion = ?');
        values.push(data.confirmacion);
    }
    if (data.Usuarios_idUsuarios !== undefined) {
        updates.push('Usuarios_idUsuarios = ?');
        values.push(data.Usuarios_idUsuarios);
    }
    if (data.Docente_idUsuarios !== undefined) {
        updates.push('Docente_idUsuarios = ?');
        values.push(data.Docente_idUsuarios);
    }
    if (data.Estudiante_idUsuarios !== undefined) {
        updates.push('Estudiante_idUsuarios = ?');
        values.push(data.Estudiante_idUsuarios);
    }
    if (data.Modalidad_idModalidad !== undefined) {
        updates.push('Modalidad_idModalidad = ?');
        values.push(data.Modalidad_idModalidad);
    }
    if (data.Fecha_y_Horarios_idFecha_y_Horarios !== undefined) {
        updates.push('Fecha_y_Horarios_idFecha_y_Horarios = ?');
        values.push(data.Fecha_y_Horarios_idFecha_y_Horarios);
    }
    if (data.MotivoSolicitud !== undefined) {
        updates.push('MotivoSolicitud = ?');
        values.push(data.MotivoSolicitud);
    }
    if (data.EstadoSolicitud !== undefined) {
        updates.push('EstadoSolicitud = ?');
        values.push(data.EstadoSolicitud);
    }
    if (data.ComentarioDocente !== undefined) {
        updates.push('ComentarioDocente = ?');
        values.push(data.ComentarioDocente);
    }
    if (data.FechaRespuesta !== undefined) {
        updates.push('FechaRespuesta = ?');
        values.push(data.FechaRespuesta);
    }
    
    if (updates.length === 0) return false;
    
    values.push(id);
    const [result] = await pool.execute(
        `UPDATE Asesorias SET ${updates.join(', ')} WHERE idAsesorias = ?`,
        values
    );
    return result.affectedRows > 0;
}

exports.remove = async (id) => {
    const [result] = await pool.execute(
        'DELETE FROM Asesorias WHERE idAsesorias = ?', [id]
    );
    return result.affectedRows > 0;
}
