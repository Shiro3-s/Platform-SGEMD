// src/services/users.service.js
// Servicio para la gestión de usuarios
const { pool } = require('../config/db.config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'clave_super_secreta';

// Obtener todos los usuarios
exports.findAll = async () => {
    const [rows] = await pool.query('SELECT * FROM usuarios');
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
            FechaActualizacion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
            0, // Verificado = 0 (no verificado)
            data.FechaCreacion || new Date(),
            data.FechaActualizacion || new Date()
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
    const { Nombre, CorreoInstitucional, Password } = data;
    const updates = [];
    const params = [];

    if (Nombre) { updates.push('Nombre = ?'); params.push(Nombre); }
    if (CorreoInstitucional) { updates.push('CorreoInstitucional = ?'); params.push(CorreoInstitucional); }

    if (Password) {
        const hashedPassword = await bcrypt.hash(Password, 10);
        updates.push('Password = ?');
        params.push(hashedPassword);
    }

    if (updates.length === 0) throw new Error('No hay campos para actualizar');

    params.push(id);
    const [result] = await pool.query(`UPDATE usuarios SET ${updates.join(', ')} WHERE idUsuarios = ?`, params);
    return result.affectedRows > 0;
};

// Eliminar usuario
exports.remove = async (id) => {
    const [result] = await pool.query('DELETE FROM usuarios WHERE idUsuarios = ?', [id]);
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

    // Validar que el usuario esté verificado
    if (!user.Verificado) {
        throw new Error('Tu cuenta aún no ha sido verificada. Revisa tu correo o contacta al administrador.');
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
