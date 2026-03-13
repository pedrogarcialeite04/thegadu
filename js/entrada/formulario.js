import { salvarNovoProduto } from '../compartilhado/estado.js';
import { elementos, pegar } from '../compartilhado/seletores.js';
import { mostrarNotificacao } from '../compartilhado/notificacoes.js';
import { desenharTabelaProdutos } from './tabela.js';

export function iniciarFormularioEntrada() {
    if (!elementos.formularioEntrada) return;

    elementos.formularioEntrada.addEventListener('submit', async function (evento) {
        evento.preventDefault();

        const codigo     = pegar('#entradaCodigo').value.trim();
        const descricao  = pegar('#entradaDescricao').value.trim();
        const fornecedor = pegar('#entradaFornecedor').value.trim();
        const quantidade = parseInt(pegar('#entradaQuantidade').value);
        const valor      = parseFloat(pegar('#entradaValor').value);

        try {
            const resposta = await salvarNovoProduto({ codigo, descricao, fornecedor, quantidade, valor });
            mostrarNotificacao(resposta.mensagem, 'sucesso');
            await desenharTabelaProdutos();
            this.reset();
            pegar('#entradaCodigo').focus();
        } catch (erro) {
            mostrarNotificacao(erro.message || 'Erro ao salvar produto', 'erro');
        }
    });
}
