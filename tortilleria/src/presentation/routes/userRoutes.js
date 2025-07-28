const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const { verifyToken, checkRole } = require('../middlewares/auth');

router.post('/', verifyToken, checkRole('Dueño'), controller.create);
router.get('/', verifyToken, controller.list);
router.get('/:id', verifyToken, controller.getById);
router.put('/:id', verifyToken, checkRole('Dueño'), controller.update);
router.delete('/:id', verifyToken, checkRole('Dueño'), controller.remove);

module.exports = router;
