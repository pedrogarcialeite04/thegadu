import { obterProdutos, obterResumoAPI } from '../compartilhado/estado.js';
import { elementos, pegar } from '../compartilhado/seletores.js';
import { formatarMoeda, obterNivelQuantidade, limparHtml } from '../compartilhado/formatadores.js';

export async function atualizarResumo() {
    try {
        const resumo = await obterResumoAPI();
        if (elementos.totalPecas) elementos.totalPecas.textContent = resumo.totalPecas;
        if (elementos.valorTotal) elementos.valorTotal.textContent = formatarMoeda(resumo.valorTotal);
    } catch (erro) {
        const listaProdutos = obterProdutos();
        const totalPecas = listaProdutos.reduce((soma, p) => soma + p.quantidade, 0);
        const valorTotal = listaProdutos.reduce((soma, p) => soma + (p.quantidade * p.valor), 0);
        if (elementos.totalPecas) elementos.totalPecas.textContent = totalPecas;
        if (elementos.valorTotal) elementos.valorTotal.textContent = formatarMoeda(valorTotal);
    }
}

export async function desenharTabelaProdutos(filtro = '') {
    if (!elementos.listaProdutos) {
        await atualizarResumo();
        return;
    }

    const listaProdutos = obterProdutos();
    const resultado = filtro
        ? listaProdutos.filter(p =>
            p.codigo.toLowerCase().includes(filtro.toLowerCase()) ||
            p.descricao.toLowerCase().includes(filtro.toLowerCase()) ||
            (p.fornecedor || '').toLowerCase().includes(filtro.toLowerCase())
        )
        : listaProdutos;

    const tabelaEl = pegar('#tabelaProdutos');

    if (resultado.length === 0) {
        elementos.listaProdutos.innerHTML = '';
        if (elementos.vazioEstoque) elementos.vazioEstoque.classList.add('visivel');
        if (tabelaEl) tabelaEl.style.display = 'none';
    } else {
        if (elementos.vazioEstoque) elementos.vazioEstoque.classList.remove('visivel');
        if (tabelaEl) tabelaEl.style.display = '';

        elementos.listaProdutos.innerHTML = resultado.map(produto => {
            const nivel = obterNivelQuantidade(produto.quantidade);
            return `
            <tr>
                <td>${limparHtml(produto.codigo)}</td>
                <td>${limparHtml(produto.descricao)}</td>
                <td>${limparHtml(produto.fornecedor || '—')}</td>
                <td><span class="indicador-qtd indicador-qtd--${nivel}">${produto.quantidade}</span></td>
                <td>${formatarMoeda(produto.valor)}</td>
                <td>${formatarMoeda(produto.quantidade * produto.valor)}</td>
                <td>
                    <div class="acoes-tabela">
                        <button class="botao-acao" data-acao="editar" data-codigo="${produto.codigo}" title="Editar">
                            <span class="material-icons-outlined">edit</span>
                        </button>
                        <button class="botao-acao botao-acao--excluir" data-acao="excluir" data-codigo="${produto.codigo}" title="Excluir">
                            <span class="material-icons-outlined">delete_outline</span>
                        </button>
                    </div>
                </td>
            </tr>`;
        }).join('');
    }

    await atualizarResumo();
    document.dispatchEvent(new CustomEvent('produtos-atualizados'));
}
