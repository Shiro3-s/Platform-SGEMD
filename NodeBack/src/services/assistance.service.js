const { pool } = require('../config/db.config')

exports.findAll = async () => {
    const [rows] = await pool.execute('SELECT * FROM Asistencia')
    return rows
}

exports.findById = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM Asistencia WHERE idAsistencia = ?', [id]);
    if (rows.length === 0) throw new Error('Asistencia no encontrada');
    return rows[0]
}

exports.create = async (data) => {
    const fechaActual = new Date()
    const [result] = await pool.execute(
    `INSERT INTO Asistencia (
            FeedBack, Emprendimiento_idEmprendimiento, FechaCreacion, FechaActualizacion, Seguimientos_idSeguimientos
        ) VALUES (?, ?, ?, ?, ?)`,
        [
            data.FeedBack,
            data.Emprendimiento_idEmprendimiento,
            fechaActual,
            fechaActual,
            data.Seguimientos_idSeguimientos
        ]
    )
    return { id: result.insertId, ...data };
}

exports.update = async (id, data) => {
    const [result] = await pool.execute(
    `UPDATE Asistencia SET
            FeedBack = ?, Emprendimiento_idEmprendimiento = ?, FechaActualizacion = ?, Seguimientos_idSeguimientos = ?
    WHERE idAsistencia = ?`,
        [
            data.FeedBack,
            data.Emprendimiento_idEmprendimiento,
            new Date(),
            data.Seguimientos_idSeguimientos,
            id
        ]
    )
    return result.affectedRows > 0;
}

exports.remove = async (id) => {
    const [result] = await pool.execute(
    'DELETE FROM Asistencia WHERE idAsistencia = ?', [id]
    )
    return result.affectedRows > 0;
}