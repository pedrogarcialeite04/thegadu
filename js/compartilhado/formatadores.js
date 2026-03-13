export function formatarMoeda(valor) {
    return Number(valor).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

export function formatarData(textoData) {
    return new Date(textoData).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function obterNivelQuantidade(qtd) {
    if (qtd >= 20) return 'alto';
    if (qtd >= 5)  return 'medio';
    return 'baixo';
}

export function limparHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}
