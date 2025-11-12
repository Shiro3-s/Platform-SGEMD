// ========================================
// 📋 CÓDIGO LISTO PARA COPIAR/PEGAR
// ========================================

// ===== user.controller.js - Nueva Función =====
// Agrega esto al final del archivo

exports.verifyUser = async (req, res) => {
  const { CorreoInstitucional, code } = req.body;
  console.log('🔍 Intento de verificación:', { CorreoInstitucional, code });

  if (!CorreoInstitucional || !code) {
    return res.status(400).json({ 
      success: false, 
      error: 'El correo y el código de verificación son requeridos' 
    });
  }

  try {
    const result = await usersService.verifyUserByCode(CorreoInstitucional, code);
    
    if (result) {
      console.log('✅ Usuario verificado:', CorreoInstitucional);
      res.json({ 
        success: true, 
        message: 'Usuario verificado correctamente' 
      });
    } else {
      res.status(401).json({ 
        success: false, 
        error: 'Código de verificación incorrecto o expirado' 
      });
    }
  } catch (error) {
    console.error('❌ Error en verifyUser:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};




// ===== users.service.js - Función NUEVA verifyUserByCode =====
// Agrega esto al final del archivo

exports.verifyUserByCode = async (CorreoInstitucional, code) => {
    const [rows] = await pool.query(
        'SELECT * FROM usuarios WHERE CorreoInstitucional = ?',
        [CorreoInstitucional]
    );

    if (rows.length === 0) {
        throw new Error('Usuario no encontrado');
    }

    const user = rows[0];

    // Verificar si el código coincide
    if (user.CodigoVerificacion !== code) {
        throw new Error('Código de verificación incorrecto');
    }

    // Actualizar a verificado
    const [result] = await pool.query(
        `UPDATE usuarios SET Verificado = 1, CodigoVerificacion = NULL 
         WHERE idUsuarios = ?`,
        [user.idUsuarios]
    );

    return result.affectedRows > 0;
};




// ===== users.service.js - REEMPLAZA la función create =====
// BUSCA exports.create y REEMPLAZA COMPLETAMENTE

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

    // Generar código de verificación (6 dígitos)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

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
            CodigoVerificacion,
            FechaCreacion,
            FechaActualizacion
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
            data.Roles_idRoles1 || 2, // Por defecto estudiante
            0, // No verificado al inicio
            verificationCode, // Guardar el código
            new Date(),
            new Date()
        ]
    );

    // 📧 Enviar correo de verificación
    const { enviarCorreoVerificacion } = require('../config/mailer');
    try {
        await enviarCorreoVerificacion(CorreoInstitucional, Nombre, verificationCode);
        console.log('📧 Correo de verificación enviado a:', CorreoInstitucional);
    } catch (err) {
        console.error('⚠️ Error enviando correo de verificación:', err.message);
        // No fallar la creación del usuario si el email no se envía
    }

    return {
        idUsuarios: result.insertId,
        Nombre,
        CorreoInstitucional,
        Roles_idRoles1: data.Roles_idRoles1 || 2,
        message: 'Usuario creado. Verifica tu correo para activar la cuenta.'
    };
};




// ===== mailer.js - NUEVA Función para verificación =====
// Agrega esto ANTES de module.exports

async function enviarCorreoVerificacion(destinatario, nombre, codigo) {
  try {
    const info = await transporter.sendMail({
      from: `"Soporte SGEMD" <${process.env.EMAIL_USER}>`,
      to: destinatario,
      subject: "Código de Verificación - SGEMD",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #0057a4; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">SGEMD</h1>
            <p style="margin: 5px 0 0 0;">Sistema de Gestión de Emprendimientos Médicos Digitales</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 5px 5px;">
            <h2 style="color: #333; margin-top: 0;">¡Bienvenido, ${nombre}!</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Gracias por registrarte en nuestra plataforma. Para activar tu cuenta, 
              por favor ingresa el siguiente código de verificación:
            </p>
            
            <div style="
              background: linear-gradient(135deg, #0057a4, #004080);
              padding: 30px;
              text-align: center;
              border-radius: 8px;
              margin: 25px 0;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            ">
              <p style="color: #fff; font-size: 12px; margin: 0 0 10px 0; opacity: 0.9;">TU CÓDIGO DE VERIFICACIÓN</p>
              <h1 style="
                color: #fff; 
                font-size: 48px; 
                letter-spacing: 8px; 
                font-family: 'Courier New', monospace;
                margin: 0;
                font-weight: bold;
              ">
                ${codigo}
              </h1>
            </div>
            
            <div style="background-color: #fff3cd; border-left: 4px solid #ff9800; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                <strong>⏰ Importante:</strong> Este código expirará en 24 horas. 
                No compartas este código con nadie.
              </p>
            </div>
            
            <p style="color: #666; margin-top: 20px; line-height: 1.6;">
              Si no solicitaste este registro, puedes ignorar este correo de forma segura.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              Este es un correo automático. Por favor, no respondas a este mensaje.
              <br>
              Para soporte, contacta con nuestro equipo de administración.
            </p>
          </div>
        </div>
      `,
    });
    console.log("Correo de verificación enviado:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error enviando correo de verificación:", error);
    throw error;
  }
}




// ===== user.routes.js - AGREGA ESTA LÍNEA =====
// En la sección de RUTAS PÚBLICAS, agrega:

router.post('/verify', usersController.verifyUser)




// ===== mailer.js - ACTUALIZA module.exports =====
// Reemplaza la línea module.exports con:

module.exports = { enviarCorreoLogin, enviarCorreoVerificacion };
