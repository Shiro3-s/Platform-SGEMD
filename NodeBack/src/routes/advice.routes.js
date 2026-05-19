const express = require('express')
const router = express.Router()
const advice = require('../controllers/advice.controller')
const { authenticateToken, isAdmin, isAsesor } = require('../middleware/auth.middleware')

// Rutas con autenticación
router.get('/', authenticateToken, advice.getAll)
router.get('/:id', authenticateToken, advice.getById)
router.post('/', authenticateToken, advice.create)
router.put('/:id', authenticateToken, isAdmin, advice.update)
router.delete('/:id', authenticateToken, isAdmin, advice.remove)

module.exports = router
