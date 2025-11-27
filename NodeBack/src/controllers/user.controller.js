// // 🔹 Controlador para la gestión de usuarios
// const usersService = require('../services/users.service');
// const { enviarCorreoLogin } = require('../config/mailer.js');

// // ==================================================
// // 📍 OBTENER TODOS LOS USUARIOS
// // ==================================================
// exports.getAllUsers = async (req, res) => {
//   try {
//     const users = await usersService.findAll();
//     res.json({ success: true, data: users });
//   } catch (error) {
//     console.error('Error en getAllUsers:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================================================
// // 📍 OBTENER ESTUDIANTES
// // ==================================================
// exports.getAllStudents = async (req, res) => {
//   try {
//     const students = await usersService.findAllStudents();
//     res.json({ success: true, data: students });
//   } catch (error) {
//     console.error('Error en getAllStudents:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================================================
// // 📍 OBTENER PROFESORES
// // ==================================================
// exports.getAllTeachers = async (req, res) => {
//   try {
//     const teachers = await usersService.findAllTeachers();
//     res.json({ success: true, data: teachers });
//   } catch (error) {
//     console.error('Error en getAllTeachers:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================================================
// // 📍 OBTENER ADMINISTRADORES
// // ==================================================
// exports.getAllAdmins = async (req, res) => {
//   try {
//     const admins = await usersService.findAllAdmin();
//     res.json({ success: true, data: admins });
//   } catch (error) {
//     console.error('Error en getAllAdmins:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================================================
// // 📍 OBTENER USUARIO POR ID
// // ==================================================
// exports.getUsersById = async (req, res) => {
//   try {
//     const user = await usersService.findById(req.params.id);
//     res.json({ success: true, data: user });
//   } catch (error) {
//     console.error('Error en getUsersById:', error);
//     res.status(404).json({ success: false, error: error.message });
//   }
// };

// // ==================================================
// // 📍 CREAR NUEVO USUARIO
// // ==================================================
// exports.createUser = async (req, res) => {
//   try {
//     console.log('Body recibido en createUser:', req.body);

//     // Asignar verificación falsa por defecto (aún no verificado)
//     const userData = {
//       ...req.body,
//       Verificado: 0, // 👈 Por defecto la cuenta no está verificada
//     };

//     const newUser = await usersService.create(userData);
//     res.status(201).json({ success: true, data: newUser });
//   } catch (error) {
//     console.error('Error en createUser:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // ==================================================
// // 📍 ACTUALIZAR USUARIO
// // ==================================================
// exports.updateUser = async (req, res) => {
//   try {
//     const updated = await usersService.update(req.params.id, req.body);
//     if (updated) {
//       res.json({ success: true, message: 'Usuario actualizado correctamente' });
//     } else {
//       res.status(404).json({ success: false, error: 'Usuario no encontrado' });
//     }
//   } catch (error) {
//     console.error('Error en updateUser:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // ==================================================
// // 📍 ELIMINAR USUARIO
// // ==================================================
// exports.deleteUser = async (req, res) => {
//   try {
//     const deleted = await usersService.remove(req.params.id);
//     if (deleted) {
//       res.json({ success: true, message: 'Usuario eliminado correctamente' });
//     } else {
//       res.status(404).json({ success: false, error: 'Usuario no encontrado' });
//     }
//   } catch (error) {
//     console.error('Error en deleteUser:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================================================
// // 🔐 LOGIN DE USUARIO (con verificación de cuenta)
// // ==================================================
// exports.loginUser = async (req, res) => {
//   const { CorreoInstitucional, Password } = req.body;
//   console.log('🟢 Intento de login:', { CorreoInstitucional });

//   if (!CorreoInstitucional || !Password) {
//     return res
//       .status(400)
//       .json({ success: false, error: 'El correo y la contraseña son requeridos' });
//   }

//   try {
//     const result = await usersService.login(CorreoInstitucional, Password);

//     if (!result.user) {
//       return res
//         .status(401)
//         .json({ success: false, error: 'Credenciales inválidas' });
//     }

//     // 🚨 Verificación de cuenta antes de generar token
//     if (!result.user.Verificado) {
//       return res
//         .status(403)
//         .json({
//           success: false,
//           error: 'Tu cuenta aún no ha sido verificada. Revisa tu correo o contacta al administrador.',
//         });
//     }

//     console.log('✅ Login exitoso:', { userId: result.user.idUsuarios });

//     // 📧 Enviar correo de notificación
//     const contenido = `
//       <h3>Inicio de sesión en SGEMD</h3>
//       <p>Hola ${result.user.Nombre},</p>
//       <p>Se detectó un inicio de sesión en tu cuenta.</p>
//       <p><strong>Correo:</strong> ${result.user.CorreoInstitucional}</p>
//       <p>Si no fuiste tú, cambia tu contraseña inmediatamente.</p>
//     `;

//     enviarCorreoLogin(
//       result.user.CorreoInstitucional,
//       'Inicio de sesión en SGEMD',
//       contenido
//     )
//       .then(() => console.log('📧 Correo de login enviado correctamente'))
//       .catch((err) =>
//         console.error('⚠️ Error enviando correo de login:', err.message)
//       );

//     // ✅ Respuesta en formato esperado por React
//     res.json({
//       success: true,
//       message: 'Inicio de sesión exitoso',
//       data: {
//         user: result.user,
//         token: result.token,
//       },
//     });
//   } catch (error) {
//     console.error('❌ Error en loginUser:', error);

//     if (
//       error.message === 'Usuario no encontrado' ||
//       error.message === 'Contraseña incorrecta'
//     ) {
//       return res
//         .status(401)
//         .json({ success: false, error: 'Credenciales inválidas' });
//     }

//     res
//       .status(500)
//       .json({ success: false, error: 'Error interno del servidor' });
//   }
// };

// // ==================================================
// // 📍 OBTENER EMPRENDIMIENTOS DEL ESTUDIANTE
// // ==================================================
// exports.getStudentEntrepreneurships = async (req, res) => {
//   try {
//     const entrepreneurships = await usersService.getEntrepreneurships(req.params.id);
//     res.json({ success: true, data: entrepreneurships });
//   } catch (error) {
//     console.error('Error en getStudentEntrepreneurships:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };
// ==================================================
// 🔹 CONTROLADOR: Gestión de Usuarios
// ==================================================

const usersService = require('../services/users.service');
const { enviarCorreoLogin } = require('../config/mailer.js');

// ==================================================
// 📍 OBTENER TODOS LOS USUARIOS
// ==================================================
exports.getAllUsers = async (req, res) => {
  try {
    const onlyActive = req.query && (req.query.active === '1' || req.query.active === 'true');
    const users = await usersService.findAll(onlyActive);
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Error en getAllUsers:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================================================
// 📍 OBTENER USUARIOS SEGÚN ROL
// ==================================================
exports.getAllStudents = async (req, res) => {
  try {
    const students = await usersService.findAllStudents();
    res.json({ success: true, data: students });
  } catch (error) {
    console.error('Error en getAllStudents:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await usersService.findAllTeachers();
    res.json({ success: true, data: teachers });
  } catch (error) {
    console.error('Error en getAllTeachers:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await usersService.findAllAdmin();
    res.json({ success: true, data: admins });
  } catch (error) {
    console.error('Error en getAllAdmins:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================================================
// 📍 OBTENER USUARIO POR ID
// ==================================================
exports.getUsersById = async (req, res) => {
  try {
    const user = await usersService.findById(req.params.id);
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error en getUsersById:', error);
    res.status(404).json({ success: false, error: error.message });
  }
};

// ==================================================
// 📍 OBTENER PERFIL DEL USUARIO AUTENTICADO
// ==================================================
exports.getMe = async (req, res) => {
  try {
    const requester = req.user;
    console.log('👤 getMe solicitado por usuario:', requester);

    if (!requester || !requester.id) {
      console.error('❌ No hay usuario en req.user');
      return res.status(401).json({ success: false, error: 'No autenticado' });
    }

    const user = await usersService.findById(requester.id);
    console.log('✅ Usuario encontrado:', { id: user?.idUsuarios, nombre: user?.Nombre });

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('❌ Error en getMe:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================================================
// 📍 REACTIVAR USUARIO (Solo Admins)
// ==================================================
exports.reactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const requester = req.user || {};
    // Solo admins (Rol 1) pueden reactivar
    if (requester.Rol !== 1) {
      return res.status(403).json({ success: false, error: 'Solo administradores pueden reactivar usuarios' });
    }
    const reactivated = await usersService.reactivate(id);
    if (reactivated) {
      res.json({ success: true, message: 'Usuario reactivado correctamente' });
    } else {
      res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error en reactivateUser:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================================================
// 📍 SOLICITAR REACTIVACIÓN DE CUENTA
// ==================================================
exports.requestReactivation = async (req, res) => {
  try {
    const { id } = req.params;
    const requester = req.user || {};

    // Solo el usuario puede solicitar su propia reactivación
    if (requester.id != id) {
      return res.status(403).json({ success: false, error: 'Solo puedes solicitar la reactivación de tu propia cuenta' });
    }

    // Obtener datos del usuario
    const user = await usersService.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }

    // Verificar que la cuenta esté desactivada
    if (user.Estado !== 0) {
      return res.status(400).json({ success: false, error: 'Tu cuenta no está desactivada' });
    }

    console.log('📧 Solicitud de reactivación enviada por:', { userId: id, userName: user.Nombre });

    // Enviar notificación a admins (aquí puedes implementar envío de email a admins)
    // Por ahora solo registramos que se hizo la solicitud

    res.json({
      success: true,
      message: 'Solicitud enviada exitosamente. Un administrador revisará tu solicitud pronto.'
    });
  } catch (error) {
    console.error('Error en requestReactivation:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================================================
// 📍 CREAR NUEVO USUARIO
// ==================================================
exports.createUser = async (req, res) => {
  try {
    console.log('Body recibido en createUser:', req.body);
    console.log('Body recibido en createUser:', req.body);

    const data = { ...req.body };
    // Si es admin (req.user.Rol === 1), permitir crear usuario verificado
    if (req.user && req.user.Rol === 1) {
      data.Verificado = 1;
    } else {
      data.Verificado = 0;
    }

    const newUser = await usersService.create(data);
    console.log('✅ Usuario creado correctamente');
    console.log('   Código de verificación:', newUser.verificationCode);
    console.log('   Retornando al frontend:', JSON.stringify(newUser));
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    console.error('Error en createUser:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// ==================================================
// 📍 ACTUALIZAR USUARIO
// ==================================================
exports.updateUser = async (req, res) => {
  try {
    const updated = await usersService.update(req.params.id, req.body);
    if (updated) {
      res.json({ success: true, message: 'Usuario actualizado correctamente' });
    } else {
      res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error en updateUser:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// ==================================================
// 📍 ELIMINAR USUARIO
// ==================================================
exports.deleteUser = async (req, res) => {
  try {
    const targetId = parseInt(req.params.id, 10);
    const requester = req.user || {};

    // Permitir si el solicitante es el mismo usuario o es administrador (Rol 1)
    if (requester.id !== targetId && requester.Rol !== 1) {
      return res.status(403).json({ success: false, error: 'No tiene permisos para eliminar este usuario' });
    }

    const deleted = await usersService.remove(targetId);
    if (deleted) {
      res.json({ success: true, message: 'Usuario desactivado correctamente' });
    } else {
      res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error en deleteUser:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================================================
// 📍 SUBIR/ACTUALIZAR AVATAR DE USUARIO
// ==================================================
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'Archivo no recibido' });

    const userId = req.params.id;
    const filename = req.file.filename;

    const updated = await usersService.update(userId, { img_perfil: `/uploads/avatars/${filename}` });
    if (updated) {
      return res.json({ success: true, message: 'Avatar subido', img_perfil: `/uploads/avatars/${filename}` });
    }

    return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
  } catch (error) {
    console.error('Error subiendo avatar:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================================================
// 🔐 LOGIN DE USUARIO
// ==================================================
exports.loginUser = async (req, res) => {
  const { CorreoInstitucional, Password } = req.body;
  console.log('🟢 Intento de login:', { CorreoInstitucional });

  if (!CorreoInstitucional || !Password) {
    return res
      .status(400)
      .json({ success: false, error: 'El correo y la contraseña son requeridos' });
  }

  try {
    const result = await usersService.login(CorreoInstitucional, Password);

    if (!result.user) {
      return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
    }

    console.log('✅ Login exitoso:', { userId: result.user.idUsuarios });

    // Contenido del correo de aviso de inicio de sesión
    const contenido = `
      <h3>Inicio de sesión en SGEMD</h3>
      <p>Hola ${result.user.Nombre},</p>
      <p>Se detectó un inicio de sesión en tu cuenta.</p>
      <p><strong>Correo:</strong> ${result.user.CorreoInstitucional}</p>
      <p>Si no fuiste tú, cambia tu contraseña inmediatamente.</p>
    `;

    // Enviar correo (async, no bloquea respuesta)
    enviarCorreoLogin(
      result.user.CorreoInstitucional,
      'Inicio de sesión en SGEMD',
      contenido
    )
      .then(() => console.log('📧 Correo de login enviado correctamente'))
      .catch((err) => console.error('⚠️ Error enviando correo de login:', err.message));

    // Respuesta en formato esperado por el frontend
    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        user: result.user,
        token: result.token,
      },
    });
  } catch (error) {
    console.error('❌ Error en loginUser:', error.message);

    if (error.message === 'Usuario no encontrado') {
      return res.status(401).json({ success: false, error: 'Usuario no encontrado' });
    }
    if (error.message === 'Contraseña incorrecta') {
      return res.status(401).json({ success: false, error: 'Contraseña incorrecta' });
    }
    if (error.message.includes('desactivada')) {
      return res.status(403).json({ success: false, error: error.message });
    }

    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

// ==================================================
// 📍 OBTENER EMPRENDIMIENTOS DE UN ESTUDIANTE
// ==================================================
exports.getStudentEntrepreneurships = async (req, res) => {
  try {
    const entrepreneurships = await usersService.getEntrepreneurships(req.params.id);
    res.json({ success: true, data: entrepreneurships });
  } catch (error) {
    console.error('Error en getStudentEntrepreneurships:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================================================
// 🔐 VERIFICAR USUARIO (Activar cuenta)
// ==================================================
exports.verifyUser = async (req, res) => {
  const { CorreoInstitucional } = req.body;
  console.log('🔍 Intento de verificación:', { CorreoInstitucional });

  if (!CorreoInstitucional) {
    return res.status(400).json({
      success: false,
      error: 'El correo es requerido'
    });
  }

  try {
    const result = await usersService.verifyUserByEmail(CorreoInstitucional);

    if (result) {
      console.log('✅ Usuario verificado:', CorreoInstitucional);
      res.json({
        success: true,
        message: 'Usuario verificado correctamente'
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }
  } catch (error) {
    console.error('❌ Error en verifyUser:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
