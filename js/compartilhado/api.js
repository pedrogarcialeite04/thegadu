const BASE_URL = '/api';

async function requisicao(caminho, opcoes = {}) {
    const config = {
        headers: { 'Content-Type': 'application/json' },
        ...opcoes
    };

    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
    }

    const resposta = await fetch(`${BASE_URL}${caminho}`, config);
    const dados = await resposta.json();

    if (!resposta.ok) {
        const mensagem = dados.mensagem || dados.erros?.join(', ') || 'Erro na requisição';
        throw new Error(mensagem);
    }

    return dados;
}

export const apiProdutos = {
    listar: (busca = '') => {
        const params = busca ? `?busca=${encodeURIComponent(busca)}` : '';
        return requisicao(`/produtos${params}`);
    },
    obter: (codigo) => requisicao(`/produtos/${encodeURIComponent(codigo)}`),
    criar: (produto) => requisicao('/produtos', { method: 'POST', body: produto }),
    atualizar: (codigo, dados) => requisicao(`/produtos/${encodeURIComponent(codigo)}`, { method: 'PUT', body: dados }),
    excluir: (codigo) => requisicao(`/produtos/${encodeURIComponent(codigo)}`, { method: 'DELETE' }),
    resumo: () => requisicao('/produtos/resumo')
};

export const apiSaidas = {
    listar: (busca = '') => {
        const params = busca ? `?busca=${encodeURIComponent(busca)}` : '';
        return requisicao(`/saidas${params}`);
    },
    registrar: (saida) => requisicao('/saidas', { method: 'POST', body: saida }),
    excluir: (id) => requisicao(`/saidas/${encodeURIComponent(id)}`, { method: 'DELETE' })
};
