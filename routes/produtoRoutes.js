const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

router.patch('/:id', produtoController.updateProduto);
router.patch('/:id/estoque', produtoController.updateEstoque);

module.exports = router;
