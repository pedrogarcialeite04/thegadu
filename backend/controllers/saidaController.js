const mongoose = require('mongoose');
const Saida = require('../models/Saida');
const Produto = require('../models/Produto');
const { validarSaida } = require('../validators/saidaValidator');
const { criarFiltroBusca, sanitizarString } = require('../middlewares/seguranca');

async function listarSaidas(req, res, next) {
    try {
        const { busca } = req.query;
        let filtro = {};

        if (busca && busca.trim()) {
            const termo = sanitizarString(busca, 200);
            filtro = criarFiltroBusca(termo, ['codigo', 'descricao', 'fornecedor']);
        }

        const saidas = await Saida.find(filtro).sort({ data: -1 }).limit(1000).lean();
        res.json({ sucesso: true, dados: saidas });
    } catch (erro) {
        next(erro);
    }
}

async function registrarSaida(req, res, next) {
    const session = await mongoose.startSession();

    try {
        const { codigo, quantidade, motivo } = req.body;

        const erros = validarSaida(req.body);
        if (erros.length > 0) {
            session.endSession();
            return res.status(400).json({ sucesso: false, erros });
        }

        const codigoNormalizado = sanitizarString(codigo, 50).toUpperCase();
        const qtdSaida = parseInt(quantidade);

        let resultado;

        await session.withTransaction(async () => {
            const produto = await Produto.findOne({ codigo: codigoNormalizado }).session(session);

            if (!produto) {
                throw { statusCode: 404, mensagem: 'Produto não encontrado no estoque' };
            }

            if (qtdSaida > produto.quantidade) {
                throw {
                    statusCode: 400,
                    mensagem: `Estoque insuficiente. Disponível: ${produto.quantidade} un.`
                };
            }

            produto.quantidade -= qtdSaida;

            const novaSaida = new Saida({
                codigo: codigoNormalizado,
                descricao: produto.descricao,
                fornecedor: produto.fornecedor || '',
                quantidade: qtdSaida,
                motivo: sanitizarString(motivo, 100),
                data: new Date()
            });

            await novaSaida.save({ session });

            if (produto.quantidade === 0) {
                await Produto.deleteOne({ codigo: codigoNormalizado }).session(session);
            } else {
                await produto.save({ session });
            }

            resultado = {
                saida: novaSaida,
                produtoRemovido: produto.quantidade === 0
            };
        });

        session.endSession();

        res.status(201).json({
            sucesso: true,
            mensagem: `Saída de ${qtdSaida} un. de "${codigoNormalizado}" registrada`,
            dados: resultado.saida,
            produtoRemovido: resultado.produtoRemovido
        });
    } catch (erro) {
        session.endSession();

        if (erro.statusCode) {
            return res.status(erro.statusCode).json({
                sucesso: false,
                mensagem: erro.mensagem
            });
        }

        next(erro);
    }
}

async function excluirSaida(req, res, next) {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID de saída inválido'
            });
        }

        const saida = await Saida.findByIdAndDelete(req.params.id);

        if (!saida) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Registro de saída não encontrado'
            });
        }

        res.json({
            sucesso: true,
            mensagem: 'Registro de saída excluído',
            dados: saida
        });
    } catch (erro) {
        next(erro);
    }
}

module.exports = {
    listarSaidas,
    registrarSaida,
    excluirSaida
};
