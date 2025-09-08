const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/pagamentoController');

router.patch('/:id/confirmar', pagamentoController.confirmarPagamento);
router.get('/:id/pagamentos', pagamentoController.getPagamentosByPedido);

module.exports = router;
