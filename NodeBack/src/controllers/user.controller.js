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
    const users = await usersService.findAll();
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
// 📍 CREAR NUEVO USUARIO
// ==================================================
exports.createUser = async (req, res) => {
  try {
    console.log('Body recibido en createUser:', req.body);
    const newUser = await usersService.create(req.body);
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
    const deleted = await usersService.remove(req.params.id);
    if (deleted) {
      res.json({ success: true, message: 'Usuario eliminado correctamente' });
    } else {
      res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error en deleteUser:', error);
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

    // Enviar correo
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
    console.error('❌ Error en loginUser:', error);

    if (
      error.message === 'Usuario no encontrado' ||
      error.message === 'Contraseña incorrecta'
    ) {
      return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
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
