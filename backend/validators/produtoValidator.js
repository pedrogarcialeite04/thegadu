function validarProduto(dados, parcial = false) {
    const erros = [];

    if (!parcial || dados.codigo !== undefined) {
        if (!dados.codigo || typeof dados.codigo !== 'string' || !dados.codigo.trim()) {
            erros.push('Código do produto é obrigatório');
        }
    }

    if (!parcial || dados.descricao !== undefined) {
        if (!dados.descricao || typeof dados.descricao !== 'string' || !dados.descricao.trim()) {
            erros.push('Descrição do produto é obrigatória');
        }
    }

    if (!parcial || dados.quantidade !== undefined) {
        const qtd = Number(dados.quantidade);
        if (isNaN(qtd) || !Number.isInteger(qtd) || qtd < 0) {
            erros.push('Quantidade deve ser um número inteiro não-negativo');
        }
    }

    if (!parcial || dados.valor !== undefined) {
        const val = Number(dados.valor);
        if (isNaN(val) || val < 0.01) {
            erros.push('Valor unitário deve ser maior que zero');
        }
    }

    return erros;
}

function validarEntrada(dados) {
    const erros = validarProduto(dados);

    const qtd = Number(dados.quantidade);
    if (!isNaN(qtd) && qtd < 1) {
        erros.push('Quantidade de entrada deve ser no mínimo 1');
    }

    return erros;
}

module.exports = { validarProduto, validarEntrada };
