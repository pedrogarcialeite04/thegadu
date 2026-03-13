const express = require('express');
const router = express.Router();
const {
    listarProdutos,
    obterProduto,
    criarOuAtualizarProduto,
    atualizarProduto,
    excluirProduto,
    obterResumo
} = require('../controllers/produtoController');

router.get('/resumo', obterResumo);
router.get('/', listarProdutos);
router.get('/:codigo', obterProduto);
router.post('/', criarOuAtualizarProduto);
router.put('/:codigo', atualizarProduto);
router.delete('/:codigo', excluirProduto);

module.exports = router;
