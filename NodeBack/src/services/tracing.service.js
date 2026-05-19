const { pool } = require('../config/db.config')

exports.findAll = async () => {
    const [rows] = await pool.execute(`
        SELECT s.*, 
               u_usuario.Nombre as UsuarioNombre,
               u_asesor.Nombre as AsesorNombre,
               e.Nombre as EmprendimientoNombre
        FROM Seguimientos s
        LEFT JOIN Usuarios u_usuario ON s.Usuarios_idUsuarios = u_usuario.idUsuarios
        LEFT JOIN Usuarios u_asesor ON s.Asesor_idUsuarios = u_asesor.idUsuarios
        LEFT JOIN Emprendimiento e ON s.Emprendimiento_idEmprendimiento = e.idEmprendimiento
        ORDER BY s.FechaCreacion DESC
    `)
    return rows;
}

exports.findById = async (id) => {
    const [rows] = await pool.execute(`
        SELECT s.*, 
               u_usuario.Nombre as UsuarioNombre,
               u_asesor.Nombre as AsesorNombre,
               e.Nombre as EmprendimientoNombre
        FROM Seguimientos s
        LEFT JOIN Usuarios u_usuario ON s.Usuarios_idUsuarios = u_usuario.idUsuarios
        LEFT JOIN Usuarios u_asesor ON s.Asesor_idUsuarios = u_asesor.idUsuarios
        LEFT JOIN Emprendimiento e ON s.Emprendimiento_idEmprendimiento = e.idEmprendimiento
        WHERE s.idSeguimientos = ?
    `, [id])
    if (rows.length === 0) throw new Error('Seguimiento no encontrado')
    return rows[0]
}

exports.findByEmprendimiento = async (empId) => {
    const [rows] = await pool.execute(`
        SELECT s.*, 
               u_usuario.Nombre as UsuarioNombre,
               u_asesor.Nombre as AsesorNombre
        FROM Seguimientos s
        LEFT JOIN Usuarios u_usuario ON s.Usuarios_idUsuarios = u_usuario.idUsuarios
        LEFT JOIN Usuarios u_asesor ON s.Asesor_idUsuarios = u_asesor.idUsuarios
        WHERE s.Emprendimiento_idEmprendimiento = ? 
        ORDER BY s.FechaCreacion DESC
    `, [empId]);
    return rows;
}

exports.create = async (data) => {
    const [result] = await pool.execute(
        `INSERT INTO Seguimientos (
            histproal, TipoSeguimiento, Descripcion, SeguimientoCol,
            FechaCreacion, FechaActualizacion, Emprendimiento_idEmprendimiento,
            Usuarios_idUsuarios, Asesor_idUsuarios
        ) VALUES (?, ?, ?, ?, NOW(), NOW(), ?, ?, ?)`,
        [
            data.histproal || 'Seguimiento',
            data.TipoSeguimiento || 'Nota',
            data.Descripcion || '',
            data.SeguimientoCol || null,
            data.Emprendimiento_idEmprendimiento || null,
            data.Usuarios_idUsuarios || null,
            data.Asesor_idUsuarios || null
        ]
    )
    return { idSeguimientos: result.insertId, ...data };
}

exports.update = async (id, data) => {
    const [result] = await pool.execute(
        `UPDATE Seguimientos SET
            histproal = ?, TipoSeguimiento = ?, Descripcion = ?, SeguimientoCol = ?,
            Emprendimiento_idEmprendimiento = ?, Usuarios_idUsuarios = ?, Asesor_idUsuarios = ?,
            FechaActualizacion = NOW()
        WHERE idSeguimientos = ?`,
        [
            data.histproal,
            data.TipoSeguimiento,
            data.Descripcion,
            data.SeguimientoCol,
            data.Emprendimiento_idEmprendimiento,
            data.Usuarios_idUsuarios,
            data.Asesor_idUsuarios,
            id
        ]
    )
    return result.affectedRows > 0;
}

exports.remove = async (id) => {
    const [result] = await pool.execute(
        'DELETE FROM Seguimientos WHERE idSeguimientos = ?', [id]
    )
    return result.affectedRows > 0;
}