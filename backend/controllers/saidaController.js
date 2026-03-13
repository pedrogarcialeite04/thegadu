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
                valor: produto.valor,
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
    const session = await mongoose.startSession();

    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            session.endSession();
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID de saída inválido'
            });
        }

        let saidaExcluida;
        let estoqueRestaurado = false;

        await session.withTransaction(async () => {
            const saida = await Saida.findByIdAndDelete(req.params.id).session(session);

            if (!saida) {
                throw { statusCode: 404, mensagem: 'Registro de saída não encontrado' };
            }

            saidaExcluida = saida;

            const produto = await Produto.findOne({ codigo: saida.codigo }).session(session);

            if (produto) {
                produto.quantidade += saida.quantidade;
                await produto.save({ session });
                estoqueRestaurado = true;
            } else if (saida.valor && saida.valor > 0) {
                const novoProduto = new Produto({
                    codigo: saida.codigo,
                    descricao: saida.descricao,
                    fornecedor: saida.fornecedor || '',
                    quantidade: saida.quantidade,
                    valor: saida.valor
                });
                await novoProduto.save({ session });
                estoqueRestaurado = true;
            }
        });

        session.endSession();

        const mensagem = estoqueRestaurado
            ? `Saída excluída e ${saidaExcluida.quantidade} un. restauradas ao estoque de "${saidaExcluida.codigo}"`
            : 'Registro de saída excluído';

        res.json({
            sucesso: true,
            mensagem,
            dados: saidaExcluida,
            estoqueRestaurado
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

module.exports = {
    listarSaidas,
    registrarSaida,
    excluirSaida
};
