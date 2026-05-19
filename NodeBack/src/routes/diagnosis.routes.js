const express = require('express')
const router = express.Router()
const diagnostico = require('../controllers/diagnosis.controller')
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware')

router.get('/', authenticateToken, diagnostico.getAll)
router.get('/me', authenticateToken, diagnostico.getMyDiagnosis)
router.get('/:id', authenticateToken, diagnostico.getById)
router.post('/', authenticateToken, isAdmin, diagnostico.create)
router.put('/:id', authenticateToken, isAdmin, diagnostico.update)
router.delete('/:id', authenticateToken, isAdmin, diagnostico.remove)

module.exports = router
