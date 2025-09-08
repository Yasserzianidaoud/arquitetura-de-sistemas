const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.post('/', clienteController.createCliente);
router.get('/:id/pedidos', clienteController.getPedidosByCliente);

module.exports = router;
