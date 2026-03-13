import { obterSaidas } from '../compartilhado/estado.js';
import { elementos, pegar } from '../compartilhado/seletores.js';
import { formatarData, limparHtml } from '../compartilhado/formatadores.js';

export function desenharTabelaSaidas(filtro = '') {
    if (!elementos.listaSaidas) return;

    const listaSaidas = obterSaidas();
    const resultado = filtro
        ? listaSaidas.filter(s =>
            s.codigo.toLowerCase().includes(filtro.toLowerCase()) ||
            s.descricao.toLowerCase().includes(filtro.toLowerCase()) ||
            s.motivo.toLowerCase().includes(filtro.toLowerCase()) ||
            (s.fornecedor || '').toLowerCase().includes(filtro.toLowerCase())
        )
        : listaSaidas;

    const tabelaEl = pegar('#tabelaSaidas');

    if (resultado.length === 0) {
        elementos.listaSaidas.innerHTML = '';
        if (elementos.vazioSaidas) elementos.vazioSaidas.classList.add('visivel');
        if (tabelaEl) tabelaEl.style.display = 'none';
    } else {
        if (elementos.vazioSaidas) elementos.vazioSaidas.classList.remove('visivel');
        if (tabelaEl) tabelaEl.style.display = '';

        elementos.listaSaidas.innerHTML = resultado.map(saida => {
            return `
            <tr>
                <td style="font-weight:400; color:var(--texto-medio)">${formatarData(saida.data)}</td>
                <td>${limparHtml(saida.codigo)}</td>
                <td>${limparHtml(saida.descricao)}</td>
                <td>${limparHtml(saida.fornecedor || '—')}</td>
                <td><span class="indicador-qtd indicador-qtd--baixo">${saida.quantidade}</span></td>
                <td>${limparHtml(saida.motivo)}</td>
                <td>
                    <div class="acoes-tabela">
                        <button class="botao-acao botao-acao--excluir" onclick="controle.excluirSaida('${saida._id}')" title="Excluir">
                            <span class="material-icons-outlined">delete_outline</span>
                        </button>
                    </div>
                </td>
            </tr>`;
        }).join('');
    }
}
