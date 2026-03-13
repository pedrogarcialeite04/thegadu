const mongoose = require('mongoose');
const Produto = require('../models/Produto');
const { validarProduto, validarEntrada } = require('../validators/produtoValidator');
const { criarFiltroBusca, sanitizarString } = require('../middlewares/seguranca');

async function listarProdutos(req, res, next) {
    try {
        const { busca } = req.query;
        let filtro = {};

        if (busca && busca.trim()) {
            const termo = sanitizarString(busca, 200);
            filtro = criarFiltroBusca(termo, ['codigo', 'descricao', 'fornecedor']);
        }

        const produtos = await Produto.find(filtro).sort({ createdAt: -1 }).limit(1000).lean();
        res.json({ sucesso: true, dados: produtos });
    } catch (erro) {
        next(erro);
    }
}

async function obterProduto(req, res, next) {
    try {
        const codigo = sanitizarString(req.params.codigo, 50).toUpperCase();
        const produto = await Produto.findOne({ codigo }).lean();

        if (!produto) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Produto não encontrado'
            });
        }

        res.json({ sucesso: true, dados: produto });
    } catch (erro) {
        next(erro);
    }
}

async function criarOuAtualizarProduto(req, res, next) {
    try {
        const { codigo, descricao, fornecedor, quantidade, valor } = req.body;

        const erros = validarEntrada(req.body);
        if (erros.length > 0) {
            return res.status(400).json({ sucesso: false, erros });
        }

        const codigoNormalizado = sanitizarString(codigo, 50).toUpperCase();
        const descricaoLimpa = sanitizarString(descricao, 200);
        const fornecedorLimpo = sanitizarString(fornecedor || '', 200);
        const qtd = parseInt(quantidade);
        const val = parseFloat(valor);

        const resultado = await Produto.findOneAndUpdate(
            { codigo: codigoNormalizado },
            {
                $inc: { quantidade: qtd },
                $set: {
                    descricao: descricaoLimpa,
                    fornecedor: fornecedorLimpo,
                    valor: val
                },
                $setOnInsert: { codigo: codigoNormalizado }
            },
            { new: true, upsert: true, runValidators: true }
        );

        const foiAtualizado = resultado.quantidade !== qtd;

        res.status(foiAtualizado ? 200 : 201).json({
            sucesso: true,
            mensagem: foiAtualizado
                ? `Estoque de "${codigoNormalizado}" atualizado (+${qtd} un.)`
                : `Produto "${codigoNormalizado}" adicionado ao estoque`,
            dados: resultado,
            atualizado: foiAtualizado
        });
    } catch (erro) {
        if (erro.code === 11000) {
            return res.status(409).json({
                sucesso: false,
                mensagem: 'Código de produto já existe'
            });
        }
        next(erro);
    }
}

async function atualizarProduto(req, res, next) {
    try {
        const erros = validarProduto(req.body, true);
        if (erros.length > 0) {
            return res.status(400).json({ sucesso: false, erros });
        }

        const codigoBusca = sanitizarString(req.params.codigo, 50).toUpperCase();
        const atualizacoes = {};

        if (req.body.descricao !== undefined) atualizacoes.descricao = sanitizarString(req.body.descricao, 200);
        if (req.body.fornecedor !== undefined) atualizacoes.fornecedor = sanitizarString(req.body.fornecedor, 200);
        if (req.body.quantidade !== undefined) atualizacoes.quantidade = parseInt(req.body.quantidade);
        if (req.body.valor !== undefined) atualizacoes.valor = parseFloat(req.body.valor);

        const produto = await Produto.findOneAndUpdate(
            { codigo: codigoBusca },
            { $set: atualizacoes },
            { new: true, runValidators: true }
        );

        if (!produto) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Produto não encontrado'
            });
        }

        res.json({
            sucesso: true,
            mensagem: 'Produto atualizado com sucesso',
            dados: produto
        });
    } catch (erro) {
        next(erro);
    }
}

async function excluirProduto(req, res, next) {
    try {
        const codigoBusca = sanitizarString(req.params.codigo, 50).toUpperCase();
        const produto = await Produto.findOneAndDelete({ codigo: codigoBusca });

        if (!produto) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Produto não encontrado'
            });
        }

        res.json({
            sucesso: true,
            mensagem: `Produto "${produto.codigo}" excluído`,
            dados: produto
        });
    } catch (erro) {
        next(erro);
    }
}

async function obterResumo(req, res, next) {
    try {
        const resultado = await Produto.aggregate([
            {
                $group: {
                    _id: null,
                    totalPecas: { $sum: '$quantidade' },
                    valorTotal: { $sum: { $multiply: ['$quantidade', '$valor'] } },
                    totalProdutos: { $sum: 1 }
                }
            }
        ]);

        const resumo = resultado[0] || { totalPecas: 0, valorTotal: 0, totalProdutos: 0 };
        delete resumo._id;

        res.json({ sucesso: true, dados: resumo });
    } catch (erro) {
        next(erro);
    }
}

module.exports = {
    listarProdutos,
    obterProduto,
    criarOuAtualizarProduto,
    atualizarProduto,
    excluirProduto,
    obterResumo
};
