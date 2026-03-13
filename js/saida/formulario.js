import { obterProdutos, registrarSaidaAPI } from '../compartilhado/estado.js';
import { elementos, pegar } from '../compartilhado/seletores.js';
import { limparHtml } from '../compartilhado/formatadores.js';
import { mostrarNotificacao } from '../compartilhado/notificacoes.js';
import { desenharTabelaSaidas } from './tabela.js';
import { atualizarResumo } from '../entrada/tabela.js';

function atualizarSeletorSaida() {
    if (!elementos.saidaCodigo) return;
    const listaProdutos = obterProdutos();
    const seletor = elementos.saidaCodigo;
    const valorAtual = seletor.value;
    seletor.innerHTML = '<option value="">Selecione um produto</option>';
    listaProdutos.forEach(p => {
        const fornecedor = p.fornecedor ? ` | ${limparHtml(p.fornecedor)}` : '';
        seletor.innerHTML += `<option value="${limparHtml(p.codigo)}" data-descricao="${limparHtml(p.descricao)}" data-fornecedor="${limparHtml(p.fornecedor || '')}" data-qtd="${p.quantidade}">${limparHtml(p.codigo)} — ${limparHtml(p.descricao)}${fornecedor} (${p.quantidade} un.)</option>`;
    });
    if (valorAtual) seletor.value = valorAtual;
}

export function iniciarFormularioSaida() {
    if (!elementos.formularioSaida) return;

    document.addEventListener('produtos-atualizados', atualizarSeletorSaida);
    atualizarSeletorSaida();

    elementos.saidaCodigo.addEventListener('change', function () {
        const opcao = this.selectedOptions[0];
        if (elementos.saidaDescricao) elementos.saidaDescricao.value = opcao.dataset.descricao || '';
        const fornecedorEl = pegar('#saidaFornecedor');
        if (fornecedorEl) fornecedorEl.value = opcao.dataset.fornecedor || '';
        const qtdEl = pegar('#saidaQuantidade');
        if (qtdEl) qtdEl.max = parseInt(opcao.dataset.qtd) || 0;
    });

    elementos.formularioSaida.addEventListener('submit', async function (evento) {
        evento.preventDefault();

        const codigo     = elementos.saidaCodigo.value;
        const quantidade = parseInt(pegar('#saidaQuantidade').value);
        const motivo     = pegar('#saidaMotivo').value;

        if (!codigo) {
            mostrarNotificacao('Selecione um produto', 'erro');
            return;
        }

        try {
            const resposta = await registrarSaidaAPI({ codigo, quantidade, motivo });
            mostrarNotificacao(resposta.mensagem, 'alerta');
            await desenharTabelaSaidas();
            await atualizarResumo();
            this.reset();
            if (elementos.saidaDescricao) elementos.saidaDescricao.value = '';
            const fornecedorEl = pegar('#saidaFornecedor');
            if (fornecedorEl) fornecedorEl.value = '';
            document.dispatchEvent(new CustomEvent('produtos-atualizados'));
        } catch (erro) {
            mostrarNotificacao(erro.message || 'Erro ao registrar saída', 'erro');
        }
    });
}
