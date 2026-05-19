const express = require('express');
const router = express.Router();
const assignmentsController = require('../controllers/assignments.controller');
const { authenticateToken, isAdmin, isAsesor } = require('../middleware/auth.middleware');

router.get('/', authenticateToken, assignmentsController.getAll);
router.get('/asesor/:asesorId', authenticateToken, assignmentsController.getByAsesor);
router.get('/emprendedor/:emprendedorId', authenticateToken, assignmentsController.getByEmprendedor);
router.get('/:id', authenticateToken, assignmentsController.getById);
router.post('/', authenticateToken, isAdmin, assignmentsController.create);
router.put('/:id', authenticateToken, isAdmin, assignmentsController.update);
router.delete('/:id', authenticateToken, isAdmin, assignmentsController.remove);

module.exports = router;
