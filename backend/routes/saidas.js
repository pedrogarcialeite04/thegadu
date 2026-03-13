const express = require('express');
const router = express.Router();
const {
    listarSaidas,
    registrarSaida,
    excluirSaida
} = require('../controllers/saidaController');

router.get('/', listarSaidas);
router.post('/', registrarSaida);
router.delete('/:id', excluirSaida);

module.exports = router;
