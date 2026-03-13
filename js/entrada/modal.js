import { obterProdutos, atualizarProdutoAPI } from '../compartilhado/estado.js';
import { elementos, pegar } from '../compartilhado/seletores.js';
import { mostrarNotificacao } from '../compartilhado/notificacoes.js';
import { desenharTabelaProdutos } from './tabela.js';

let codigoEdicao = null;

function fecharModal() {
    if (!elementos.modalFundo) return;
    elementos.modalFundo.classList.remove('visivel');
    codigoEdicao = null;
}

export function abrirEdicao(codigo) {
    const listaProdutos = obterProdutos();
    const produto = listaProdutos.find(p => p.codigo === codigo);
    if (!produto) return;

    codigoEdicao = codigo;
    pegar('#edicaoCodigo').value      = produto.codigo;
    pegar('#edicaoDescricao').value   = produto.descricao;
    pegar('#edicaoFornecedor').value  = produto.fornecedor || '';
    pegar('#edicaoQuantidade').value  = produto.quantidade;
    pegar('#edicaoValor').value       = produto.valor;
    elementos.modalFundo.classList.add('visivel');
}

export function iniciarModal() {
    if (!elementos.formularioEdicao) return;

    elementos.formularioEdicao.addEventListener('submit', async function (evento) {
        evento.preventDefault();
        if (!codigoEdicao) return;

        const dados = {
            descricao:  pegar('#edicaoDescricao').value.trim(),
            fornecedor: pegar('#edicaoFornecedor').value.trim(),
            quantidade: parseInt(pegar('#edicaoQuantidade').value),
            valor:      parseFloat(pegar('#edicaoValor').value)
        };

        try {
            await atualizarProdutoAPI(codigoEdicao, dados);
            await desenharTabelaProdutos();
            fecharModal();
            mostrarNotificacao('Produto atualizado com sucesso', 'sucesso');
        } catch (erro) {
            mostrarNotificacao(erro.message || 'Erro ao atualizar produto', 'erro');
        }
    });

    if (elementos.modalFechar) elementos.modalFechar.addEventListener('click', fecharModal);
    if (elementos.botaoCancelar) elementos.botaoCancelar.addEventListener('click', fecharModal);
    if (elementos.modalFundo) {
        elementos.modalFundo.addEventListener('click', function (evento) {
            if (evento.target === this) fecharModal();
        });
    }

    document.addEventListener('keydown', function (evento) {
        if (evento.key === 'Escape') fecharModal();
    });
}
