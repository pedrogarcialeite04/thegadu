const MOTIVOS_VALIDOS = [
    'Venda',
    'Devolução ao Fornecedor',
    'Perda/Avaria',
    'Uso Interno',
    'Outro'
];

function validarSaida(dados) {
    const erros = [];

    if (!dados.codigo || typeof dados.codigo !== 'string' || !dados.codigo.trim()) {
        erros.push('Código do produto é obrigatório');
    }

    const qtd = Number(dados.quantidade);
    if (isNaN(qtd) || !Number.isInteger(qtd) || qtd < 1) {
        erros.push('Quantidade deve ser um número inteiro maior que zero');
    }

    if (!dados.motivo || !MOTIVOS_VALIDOS.includes(dados.motivo)) {
        erros.push(`Motivo inválido. Valores aceitos: ${MOTIVOS_VALIDOS.join(', ')}`);
    }

    return erros;
}

module.exports = { validarSaida, MOTIVOS_VALIDOS };
