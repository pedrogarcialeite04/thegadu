import { obterProdutos, obterSaidas, excluirProdutoAPI, excluirSaidaAPI } from './estado.js';
import { mostrarNotificacao, mostrarConfirmacao } from './notificacoes.js';
import { desenharTabelaProdutos } from '../entrada/tabela.js';
import { desenharTabelaSaidas } from '../saida/tabela.js';

export async function removerProduto(codigo) {
    const listaProdutos = obterProdutos();
    const produto = listaProdutos.find(p => p.codigo === codigo);
    if (!produto) return;

    const confirmado = await mostrarConfirmacao(
        `Deseja excluir <strong>"${produto.codigo} — ${produto.descricao}"</strong> do estoque? Esta ação não pode ser desfeita.`,
        'Excluir produto'
    );

    if (confirmado) {
        try {
            await excluirProdutoAPI(codigo);
            await desenharTabelaProdutos();
            mostrarNotificacao(`Produto "${produto.codigo}" excluído`, 'erro');
        } catch (erro) {
            mostrarNotificacao(erro.message || 'Erro ao excluir produto', 'erro');
        }
    }
}

export async function removerSaida(indice) {
    const listaSaidas = obterSaidas();
    const saida = listaSaidas[indice];
    if (!saida) return;

    const confirmado = await mostrarConfirmacao(
        `Deseja excluir o registro de saída de <strong>"${saida.codigo}"</strong>? Esta ação não pode ser desfeita.`,
        'Excluir registro'
    );

    if (confirmado) {
        try {
            await excluirSaidaAPI(saida._id);
            await desenharTabelaSaidas();
            mostrarNotificacao('Registro de saída excluído', 'erro');
        } catch (erro) {
            mostrarNotificacao(erro.message || 'Erro ao excluir registro', 'erro');
        }
    }
}
