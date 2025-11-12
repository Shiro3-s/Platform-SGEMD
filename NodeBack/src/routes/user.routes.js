// Rutas para la gestión de usuarios
const express = require('express')
const router = express.Router()
const usersController = require('../controllers/user.controller') 
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware')

//RUTAS PÚBLICAS
router.post('/login', usersController.loginUser)
router.post('/register', usersController.createUser)
router.post('/verify', usersController.verifyUser)

// Ruta de prueba para verificar que el correo funciona
router.post('/test-email', async (req, res) => {
  try {
    const { destinatario, nombre, codigo } = req.body;
    
    if (!destinatario || !nombre || !codigo) {
      return res.status(400).json({ 
        success: false, 
        error: 'Faltan parámetros: destinatario, nombre, codigo' 
      });
    }
    
    const { enviarCorreoVerificacion } = require('../config/mailer');
    const result = await enviarCorreoVerificacion(destinatario, nombre, codigo);
    
    res.json({
      success: true,
      message: 'Correo de prueba enviado',
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

//RUTAS PROTEGIDAS 
router.get('/', authenticateToken, usersController.getAllUsers)
router.get('/students', authenticateToken, usersController.getAllStudents)
router.get('/teachers', authenticateToken, usersController.getAllTeachers)
router.get('/admins', authenticateToken, isAdmin, usersController.getAllAdmins)

// RUTAS DINÁMICAS (por ID) 
router.get('/:id', authenticateToken, usersController.getUsersById)
router.put('/:id', authenticateToken, usersController.updateUser)
router.delete('/:id', authenticateToken, isAdmin, usersController.deleteUser)

//EMPRENDIMIENTOS DE ESTUDIANTE
router.get('/:id/entrepreneurships', authenticateToken, usersController.getStudentEntrepreneurships)

module.exports = router
