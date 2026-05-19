const { pool } = require('../config/db.config')

exports.findAll = async () => {
    const [rows] = await pool.execute(`
        SELECT ea.*, 
               u_asesor.Nombre as AsesorNombre, 
               u_asesor.CorreoInstitucional as AsesorCorreo,
               e.Nombre as EmprendimientoNombre,
               e.Usuarios_idUsuarios as Emprendedor_idUsuarios,
               u_emprendedor.Nombre as EmprendedorNombre,
               u_emprendedor.CorreoInstitucional as EmprendedorCorreo
        FROM Emprendimiento_Asesor ea
        LEFT JOIN Usuarios u_asesor ON ea.Asesor_idUsuarios = u_asesor.idUsuarios
        LEFT JOIN Emprendimiento e ON ea.Emprendimiento_idEmprendimiento = e.idEmprendimiento
        LEFT JOIN Usuarios u_emprendedor ON e.Usuarios_idUsuarios = u_emprendedor.idUsuarios
    `)
    return rows
}

exports.findById = async (id) => {
    const [rows] = await pool.execute(`
        SELECT ea.*, 
               u_asesor.Nombre as AsesorNombre, 
               u_asesor.CorreoInstitucional as AsesorCorreo,
               e.Nombre as EmprendimientoNombre,
               e.Usuarios_idUsuarios as Emprendedor_idUsuarios,
               u_emprendedor.Nombre as EmprendedorNombre,
               u_emprendedor.CorreoInstitucional as EmprendedorCorreo
        FROM Emprendimiento_Asesor ea
        LEFT JOIN Usuarios u_asesor ON ea.Asesor_idUsuarios = u_asesor.idUsuarios
        LEFT JOIN Emprendimiento e ON ea.Emprendimiento_idEmprendimiento = e.idEmprendimiento
        LEFT JOIN Usuarios u_emprendedor ON e.Usuarios_idUsuarios = u_emprendedor.idUsuarios
        WHERE ea.idAsignacion = ?
    `, [id])
    if (rows.length === 0) throw new Error('Asignación no encontrada')
    return rows[0]
}

exports.findByMentor = async (mentorId) => {
    const [rows] = await pool.execute(`
        SELECT ea.*, 
               e.Nombre as EmprendimientoNombre,
               e.Descripcion as EmprendimientoDescripcion,
               et.TipoEtapa as EtapaNombre,
               e.Usuarios_idUsuarios as Emprendedor_idUsuarios,
               u_emprendedor.Nombre as EmprendedorNombre,
               u_emprendedor.CorreoInstitucional as EmprendedorCorreo
        FROM Emprendimiento_Asesor ea
        INNER JOIN Emprendimiento e ON ea.Emprendimiento_idEmprendimiento = e.idEmprendimiento
        LEFT JOIN Usuarios u_emprendedor ON e.Usuarios_idUsuarios = u_emprendedor.idUsuarios
        LEFT JOIN EtapaEmprendimiento et ON e.EtapaEmprendimiento_idEtapaEmprendimiento = et.idEtapaEmprendimiento
        WHERE ea.Asesor_idUsuarios = ? AND ea.Estado = 'Activo'
    `, [mentorId])
    return rows
}

exports.findByEstudiante = async (estudianteId) => {
    const [rows] = await pool.execute(`
        SELECT ea.*, 
               u_asesor.Nombre as AsesorNombre,
               u_asesor.CorreoInstitucional as AsesorCorreo,
               e.Nombre as EmprendimientoNombre,
               e.Usuarios_idUsuarios as Emprendedor_idUsuarios,
               u_emprendedor.Nombre as EmprendedorNombre,
               u_emprendedor.CorreoInstitucional as EmprendedorCorreo
        FROM Emprendimiento_Asesor ea
        INNER JOIN Usuarios u_asesor ON ea.Asesor_idUsuarios = u_asesor.idUsuarios
        INNER JOIN Emprendimiento e ON ea.Emprendimiento_idEmprendimiento = e.idEmprendimiento
        LEFT JOIN Usuarios u_emprendedor ON e.Usuarios_idUsuarios = u_emprendedor.idUsuarios
        WHERE e.Usuarios_idUsuarios = ? AND ea.Estado = 'Activo'
    `, [estudianteId])
    return rows
}

exports.create = async (data) => {
    const fechaActual = new Date()
    const [result] = await pool.execute(
        `INSERT INTO Emprendimiento_Asesor (Asesor_idUsuarios, Emprendimiento_idEmprendimiento, AsignadoPor, FechaCreacion, FechaActualizacion, Estado) VALUES (?, ?, ?, ?, ?, ?)`,
        [
            data.Asesor_idUsuarios,
            data.Emprendimiento_idEmprendimiento || null,
            data.AsignadoPor || null,
            fechaActual,
            fechaActual,
            data.Estado || 'Activo'
        ]
    )
    return { id: result.insertId, ...data }
}

exports.update = async (id, data) => {
    const [result] = await pool.execute(
        `UPDATE Emprendimiento_Asesor SET 
            Asesor_idUsuarios = ?,
            Emprendimiento_idEmprendimiento = ?,
            Estado = ?,
            FechaActualizacion = ?
        WHERE idAsignacion = ?`,
        [
            data.Asesor_idUsuarios,
            data.Emprendimiento_idEmprendimiento,
            data.Estado,
            new Date(),
            id
        ]
    )
    return result.affectedRows > 0
}

exports.remove = async (id) => {
    const [result] = await pool.execute(
        'UPDATE Emprendimiento_Asesor SET Estado = "Inactivo", FechaActualizacion = ? WHERE idAsignacion = ?',
        [new Date(), id]
    )
    return result.affectedRows > 0
}
