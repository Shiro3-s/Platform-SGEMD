// src/services/users.service.js
// Servicio para la gestión de usuarios
const { pool } = require('../config/db.config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'clave_super_secreta';

// Obtener todos los usuarios (incluye estado)
exports.findAll = async (onlyActive = false) => {
    const sql = onlyActive ? 'SELECT * FROM usuarios WHERE Estado = 1' : 'SELECT * FROM usuarios';
    const [rows] = await pool.query(sql);
    return rows;
};

// Obtener estudiantes
exports.findAllStudents = async () => {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE Roles_idRoles1 = 2");
    return rows;
};

// Obtener profesores
exports.findAllTeachers = async () => {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE Roles_idRoles1 = 3");
    return rows;
};

// Obtener administradores
exports.findAllAdmin = async () => {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE Roles_idRoles1 = 1");
    return rows;
};

// Buscar usuario por ID
exports.findById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE idUsuarios = ?', [id]);
    if (rows.length === 0) throw new Error('Usuario no encontrado');
    return rows[0];
};

// Crear nuevo usuario
exports.create = async (data) => {
    const { Nombre, CorreoInstitucional, Password } = data;

    if (!CorreoInstitucional || !Password || !Nombre) {
        throw new Error('Faltan campos obligatorios');
    }

    // Verificar si el correo ya existe
    const [existing] = await pool.query(
        'SELECT * FROM usuarios WHERE CorreoInstitucional = ?',
        [CorreoInstitucional]
    );
    if (existing.length > 0) {
        throw new Error('El correo institucional ya está registrado');
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Generar código de verificación (6 dígitos) - solo para enviar por email
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`\n🔐 CÓDIGO DE VERIFICACIÓN GENERADO: ${verificationCode}`);
    console.log(`   Tipo: ${typeof verificationCode}`);
    console.log(`   Longitud: ${verificationCode.length}`);
    console.log(`   Para: ${CorreoInstitucional}\n`);

    const [result] = await pool.query(
        `INSERT INTO usuarios (
            Nombre,
            CorreoInstitucional,
            CorreoPersonal,
            Password,
            Celular,
            Telefono,
            Direccion,
            Genero,
            EstadoCivil,
            FechaNacimiento,
            ProgramaAcademico_idProgramaAcademico1,
            CentroUniversitarios_idCentroUniversitarios,
            Estado,
            Semestre,
            Modalidad,
            Roles_idRoles1,
            Verificado,
            FechaCreacion,
            FechaActualizacion,
            img_perfil
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            Nombre,
            CorreoInstitucional,
            data.CorreoPersonal || null,
            hashedPassword,
            data.Celular || null,
            data.Telefono || null,
            data.Direccion || null,
            data.Genero || null,
            data.EstadoCivil || null,
            data.FechaNacimiento || null,
            data.ProgramaAcademico_idProgramaAcademico1 || null,
            data.CentroUniversitarios_idCentroUniversitarios || null,
            data.Estado || 1,
            data.Semestre || null,
            data.Modalidad || null,
            data.Roles_idRoles1 || 2,
            data.Verificado !== undefined ? data.Verificado : 0, // Verificado (si no se pasa, es 0)
            data.FechaCreacion || new Date(),
            data.FechaActualizacion || new Date(),
            data.img_perfil || null
        ]
    );

    // Enviar email de verificación con el código
    const { enviarCorreoVerificacion } = require('../config/mailer');
    let emailSent = false;
    try {
        console.log(`\n🔄 Intentando enviar correo de verificación a ${CorreoInstitucional}...`);
        const result = await enviarCorreoVerificacion(CorreoInstitucional, Nombre, verificationCode);
        if (result && result.success) {
            console.log('✅ Correo de verificación enviado exitosamente');
            emailSent = true;
        } else {
            console.log('⚠️ Correo no enviado, pero el registro continúa');
        }
    } catch (err) {
        console.error('⚠️ Error enviando correo:', err.message);
        console.error('   El registro continúa sin el correo');
    }

    return {
        idUsuarios: result.insertId,
        Nombre,
        CorreoInstitucional,
        Roles_idRoles1: data.Roles_idRoles1 || 2,
        verificationCode, // Retornar código para desarrollo/testing
        emailSent, // Indicar si el correo se envió
        message: 'Usuario creado. Verifica tu correo para activar la cuenta.'
    };
};

// Actualizar usuario
exports.update = async (id, data) => {
    const updates = [];
    const params = [];

    if (data.Nombre) { updates.push('Nombre = ?'); params.push(data.Nombre); }
    if (data.CorreoInstitucional) { updates.push('CorreoInstitucional = ?'); params.push(data.CorreoInstitucional); }
    if (data.CorreoPersonal) { updates.push('CorreoPersonal = ?'); params.push(data.CorreoPersonal); }
    if (data.Celular) { updates.push('Celular = ?'); params.push(data.Celular); }
    if (data.Telefono) { updates.push('Telefono = ?'); params.push(data.Telefono); }
    if (data.Direccion) { updates.push('Direccion = ?'); params.push(data.Direccion); }
    if (data.Genero) { updates.push('Genero = ?'); params.push(data.Genero); }
    if (data.EstadoCivil) { updates.push('EstadoCivil = ?'); params.push(data.EstadoCivil); }
    if (data.FechaNacimiento) { updates.push('FechaNacimiento = ?'); params.push(data.FechaNacimiento); }
    if (data.ProgramaAcademico_idProgramaAcademico1) { updates.push('ProgramaAcademico_idProgramaAcademico1 = ?'); params.push(data.ProgramaAcademico_idProgramaAcademico1); }
    if (data.CentroUniversitarios_idCentroUniversitarios) { updates.push('CentroUniversitarios_idCentroUniversitarios = ?'); params.push(data.CentroUniversitarios_idCentroUniversitarios); }
    if (typeof data.Estado !== 'undefined') { updates.push('Estado = ?'); params.push(data.Estado); }
    if (data.Semestre) { updates.push('Semestre = ?'); params.push(data.Semestre); }
    if (data.Modalidad) { updates.push('Modalidad = ?'); params.push(data.Modalidad); }
    if (data.Roles_idRoles1) { updates.push('Roles_idRoles1 = ?'); params.push(data.Roles_idRoles1); }
    if (data.img_perfil) { updates.push('img_perfil = ?'); params.push(data.img_perfil); }

    if (data.Password) {
        const hashedPassword = await bcrypt.hash(data.Password, 10);
        updates.push('Password = ?');
        params.push(hashedPassword);
    }

    if (updates.length === 0) throw new Error('No hay campos para actualizar');

    updates.push('FechaActualizacion = ?');
    params.push(data.FechaActualizacion || new Date());

    params.push(id);
    const [result] = await pool.query(`UPDATE usuarios SET ${updates.join(', ')} WHERE idUsuarios = ?`, params);
    return result.affectedRows > 0;
};

// Eliminar usuario (soft-delete: establecer Estado = 0)
exports.remove = async (id) => {
    const [result] = await pool.query('UPDATE usuarios SET Estado = 0, FechaActualizacion = ? WHERE idUsuarios = ?', [new Date(), id]);
    return result.affectedRows > 0;
};

// Login de usuario
exports.login = async (CorreoInstitucional, Password) => {
    const [rows] = await pool.query(
        'SELECT * FROM usuarios WHERE CorreoInstitucional = ?',
        [CorreoInstitucional]
    );

    const user = rows[0];
    if (!user) throw new Error('Usuario no encontrado');

    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) throw new Error('Contraseña incorrecta');

    // Validar estado del usuario (desactivado)
    if (user.Estado === 0) {
        throw new Error('Tu cuenta ha sido desactivada. Contacta al administrador para reactivarla.');
    }

    // Log: Usuario verificado o no (para desarrollo)
    if (!user.Verificado) {
        console.warn(`⚠️  Usuario no verificado: ${CorreoInstitucional} - permitiendo login de todas formas`);
    }

    const token = jwt.sign(
        { id: user.idUsuarios, Rol: user.Roles_idRoles1 },
        JWT_SECRET,
        { expiresIn: '8h' }
    );

    return {
        user: {
            idUsuarios: user.idUsuarios,
            Nombre: user.Nombre,
            Rol: user.Roles_idRoles1,
            CorreoInstitucional: user.CorreoInstitucional
        },
        token
    };
};

// Obtener emprendimientos de un estudiante
exports.getEntrepreneurships = async (idUsuario) => {
    const [rows] = await pool.query(
        'SELECT * FROM emprendimientos WHERE idUsuario = ?',
        [idUsuario]
    );
    return rows;
};

// Verificar usuario (activar por código)
exports.verifyUserByEmail = async (CorreoInstitucional) => {
    const [result] = await pool.query(
        `UPDATE usuarios SET Verificado = 1 WHERE CorreoInstitucional = ?`,
        [CorreoInstitucional]
    );

    return result.affectedRows > 0;
};

// Reactivar usuario (solo admins)
exports.reactivate = async (id) => {
    const [result] = await pool.query(
        'UPDATE usuarios SET Estado = 1, FechaActualizacion = ? WHERE idUsuarios = ?',
        [new Date(), id]
    );
    return result.affectedRows > 0;
};
